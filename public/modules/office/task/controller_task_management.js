myApp.registerCtrl('task_management_controller', ['$scope', 'task_service', '$q', '$rootScope', '$filter', '$location', 'FileSaver', 'Blob', function ($scope, task_service, $q, $rootScope, $filter, $location, FileSaver, Blob) {
    let ctrl = this;
    const _statusValueSet = [
        { name: "Task", action: "init" },
        { name: "Task", action: "load" },
        { name: "Task", action: "count" },
        { name: "Task", action: "insert" },
        { name: "Task", action: "update" },
        { name: "Task", action: "delete" },
        { name: "Task", action: "cancel" },
        { name: "Task", action: "pause" },
        { name: "Task", action: "update_status" },
        { name: "Task", action: "resume" },
        { name: "Task", action: "alertPopupExcel" },
        { name: "Task", action: "pushFile" },
        { name: "Task", action: "removeFile" },
        { name: "Task", action: "loadTemplate" },
        { name: "Task", action: "loadDepartments" },
        { name: "Task", action: "import_excel_task" },

        { name: "Label", action: "insert" },
        { name: "Label", action: "update" },
    ];
    {
        var currentItem = {};
        ctrl._ctrlName = "task_management_controller";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._notyetInit = true;
        ctrl.collapseTask = true;
        ctrl.collapseProject = true;
        ctrl.collapseManagementLabel = true;
        ctrl.showPopup = false;
        ctrl.handleDataForDepartment = false
        ctrl.dataExcelJsonImported = [];
        ctrl.dataExcelConverted = [];
        ctrl.isOpenAddmorePeople = '';
        ctrl.togglePerson = '';
        ctrl._search = '';
        ctrl.department = [];
        ctrl.project = [];
        ctrl.task_type = [{key: 1, value: 'Công việc'}, {key: 2, value: 'Trình ký'}, {key: 3, value: 'Thông báo'}];
        ctrl.dispatchArrived = [];
        ctrl.dataSendToBe = [];
        ctrl.groupData = [];
        ctrl.message = [];
        ctrl.insertedData = [];
        ctrl._filterSeries = null;
        ctrl.sort_Project = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.errorEmpty = "Dữ liệu không được để trống!";
        ctrl.templateHeader = ['title', 'from_date', 'to_date', 'department', 'priority', 'content', 'task_list'];
        ctrl.templateHeaderForProject = ['title', 'from_date', 'to_date', 'project', 'priority', 'content'];
        ctrl.requiredPropertiesDepartment = ['title', 'from_date', 'to_date', 'department', 'priority'];
        ctrl.requiredPropertiesProject = ['title', 'from_date', 'to_date', 'project', 'priority'];
        ctrl.priorityListImport = [
            {
                title: 'Thấp', value: 4
            },
            {
                title: 'Trung bình', value: 3
            },
            {
                title: 'Quan trọng', value: 2
            },
            {
                title: 'Nghiêm trọng', value: 1
            }
        ];
        ctrl.TaskType = {
            master_key: "task_type",
            load_details_column: "value"
        };

        ctrl.TaskPriority = {
            master_key: "task_priority",
            load_details_column: "value"
        };

        ctrl.RecurringTaskState = {
            master_key: "recurring_task_state",
            load_details_column: "value"
        };

        ctrl.RecurringTaskCycle = {
            master_key: "recurring_task_cycle",
            load_details_column: "value"
        };

        // Pagination variables
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 5;

        ctrl._urlInsertMajorLabelModal = FrontendDomain + "/modules/office/task/views/insert_major_label_modal.html";
        ctrl._urlInsertMinorLabelModal = FrontendDomain + "/modules/office/task/views/insert_minor_label_modal.html";
        ctrl._urlUpdateMajorLabelModal = FrontendDomain + "/modules/office/task/views/update_major_label_modal.html";
        ctrl._urlUpdateMinorLabelModal = FrontendDomain + "/modules/office/task/views/update_minor_label_modal.html";

        ctrl._urlPauseModal = FrontendDomain + "/modules/office/task/views/pause_modal.html";
        ctrl._urlResumeModal = FrontendDomain + "/modules/office/task/views/resume_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/views/cancel_recurring_task_modal.html";

    }

     // Function to update the paginated data
     ctrl.updatePaginatedData = function () {
        const start = (ctrl.currentPage - 1) * ctrl.numOfItemPerPage;
        const end = start + ctrl.numOfItemPerPage;
        let tempArray = ctrl?.insertedData;
        if (ctrl._searchByDataExcel) {
          tempArray = tempArray.filter((item) => { 
            return (item.title.toLowerCase()).includes(ctrl._searchByDataExcel.toLowerCase())
          });
        }
        ctrl.totalItems = tempArray.length;
        ctrl.totalPages = Math.ceil(ctrl.totalItems / ctrl.numOfItemPerPage);
        ctrl.pages = Array.from({ length: ctrl.totalPages }, (v, k) => k + 1);
        ctrl.paginatedData = tempArray?.slice(start, end);
      };

      // Function to set the current page
      ctrl.setPage = function (page) {
        if (page >= 1 && page <= ctrl.totalPages) {
          ctrl.currentPage = page;
          ctrl.updatePaginatedData();
        }
      };

      // Function to go to the previous page
      ctrl.previousPage = function () {
        if (ctrl.currentPage > 1) {
          ctrl.currentPage--;
          ctrl.updatePaginatedData();
        }
      };

      // Function to go to the next page
      ctrl.nextPage = function () {
        if (ctrl.currentPage < ctrl.totalPages) {
          ctrl.currentPage++;
          ctrl.updatePaginatedData();
        }
      };

      // Watch for changes in insertedData to update pagination
      $scope.$watch(
        function () {
          return ctrl.insertedData;
        },
        function (newVal) {
          if (newVal) {
            ctrl.totalItems = newVal.length;
            ctrl.totalPages = Math.ceil(ctrl.totalItems / ctrl.numOfItemPerPage);
            ctrl.pages = Array.from({ length: ctrl.totalPages }, (v, k) => k + 1);
            ctrl.updatePaginatedData();
          }
        }
    );
    
    ctrl.searchTasks = function ({ search } = {}) {
        ctrl._searchByDataExcel = search;
        ctrl.updatePaginatedData();
    };

      // Initial call to update paginated data
      ctrl.updatePaginatedData();

    function loadTemplate_service() {
        var dfd = $q.defer();
        ctrl.loadingTemplate = true;
        ctrl.handleDataForDepartment = false;
        task_service.load_template_for_departments().then(
            function (res) {
                FileSaver.saveAs(res.data, 'Tep-tin-mau-Them-cong-viec.xlsx');
                dfd.resolve(true);
            },
            function (err) {
                dfd.reject(err);
            }
        ).finally(() => {
            ctrl.loadingTemplate = false;
        });
        return dfd.promise;
    }

    ctrl.loadTemplate = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadTemplate", loadTemplate_service);
    };

    ctrl.editSeries = function (item) {
        ctrl.seriesInfo = item;
    }

    function loadTemplate_project_service() {
        var dfd = $q.defer();
        ctrl.loadingTemplate = true;
        task_service.load_template_for_projects().then(
            function (res) {
                FileSaver.saveAs(res.data, 'Tep-tin-mau-Them-cong-viec.xlsx');
                dfd.resolve(true);
            },
            function (err) {
                dfd.reject(err);
            }
        ).finally(() => {
            ctrl.loadingTemplate = false;
        });
        return dfd.promise;
    }

    ctrl.loadTemplateProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadTemplate", loadTemplate_project_service);
    };

    ctrl.valueImportChange = function () {
        ctrl.validateProperties(ctrl.dataExcelConverted);
    }

    ctrl.toggleDropdown = function (itemId, person) {
        ctrl.activeItemId = ctrl.activeItemId === itemId ? null : itemId;
        ctrl.togglePerson = person;
    };

    ctrl.openDropdown = function () {
        ctrl.isDropdownOpen = true;
        ctrl.searchText = '';
    };

    ctrl.closeAddMoreUser = function () {
        ctrl.isOpenAddmorePeople = '';
    }

    ctrl.filterAccount = function (account) {
        if (account) {
            return account.split('-')[1].trim()
        }
    }

    ctrl.converttoISOString = function (dateString) {
        if (typeof dateString === 'string') {
            var dateParts = dateString.split('/');
            var dateObject = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
            return dateObject;
        }
    }

    ctrl.closePopup = function () {
        ctrl.showPopup = false;
    }

    ctrl.removeExcelFile_insert = function (item) {

        var temp = [];
        ctrl._insertExcel.excelFile = angular.copy(temp);
        ctrl.dataExcelConverted = angular.copy(temp);
        ctrl.isWatched = false;
        ctrl.groupData = [];
        ctrl.message = [];
        ctrl.insertedData = [];
        ctrl.handleDataForDepartment = false;
    }
    ctrl.loadDepartments = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadDepartments", loadDepartment_service);
    }
    function loadDepartment_service() {
        var dfd = $q.defer();
        task_service.load_department(undefined, 0).then((res) => {
            ctrl.department = res.data.map(item => ({
                ...item,
                optionTitle: item.title['vi-VN'],
            }));
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    function loadProjects() {
        var dfd = $q.defer();
        task_service.load_project(undefined, 100, 0, ctrl.sort_Project.query).then((res) => {
            ctrl.project = res.data.map(item => ({
                ...item,
                optionTitle: item.title,
            }));
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    function loadDispatchArrived(search) {
        var dfd = $q.defer();
        task_service.loadDispatchArrived(search || '').then(function (res) {
            ctrl.dispatchArrived = res.data.map(item => ({
                ...item,
                optionTitle: `[${item.code}] ${item.title}`,
            }));
            dfd.resolve(true);
        }, function () {
            console.log('err');
            dfd.reject(false);
        });
        return dfd.promise;
    }

    ctrl.handleInvalidDepartment = function (item) {
        item.department = undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.handleInvalidTaskType = function (item) {
        item.task_type = undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.handleInvalidProject = function (item) {
        item.project = undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.chooseDepartment = function (item, department) {
        item.orig_department = undefined;
        item.department = department.title ? department.title['vi-VN'] : undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.chooseTaskType = function (item, task_type) {
        item.task_type = task_type.key;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.handleInvalidProject = function (item) {
        item.project = undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.chooseProject = function (item, project) {
        item.orig_project = undefined;
        item.project = project.title ? project.title : undefined;
        groupData();
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.handleInvalidDispatchArrived = function (item) {
        item.dispatch_arrived_code = undefined;
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.chooseDispatchArrived = function (item, dispatchArrived) {
        item.orig_dispatch_arrived_code = undefined;
        item.dispatch_arrived_code = dispatchArrived.code ? dispatchArrived.code : undefined;
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.loadData = function (params) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var firstSheetName = workbook.SheetNames[0];
                var thirdSheetName = workbook.SheetNames[2];
                var fourthSheetName = workbook.SheetNames[3];
                var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
                var jsonPriority = XLSX.utils.sheet_to_json(workbook.Sheets[thirdSheetName]);
                var jsonTaskType = XLSX.utils.sheet_to_json(workbook.Sheets[fourthSheetName]);
                ctrl.dataExcelJsonImported = jsonData;
                ctrl.priorityDataExcel = jsonPriority;
                ctrl.taskTypeDataExcel = jsonTaskType;

                resolve()
            }
            reader.readAsBinaryString(params);
        })
    }

    ctrl.insertNewTaskExcel = function (file) {
        if (file) {
            var fileType = file.name.split('.').pop().toLowerCase();
            if (fileType == 'xlsx' || fileType == 'xls') {
                if (file.file.size >= 5 * 1024 * 1024) {
                    openPopup("Cảnh báo", "Tệp của bạn đang vượt quá dung lượng được cho phép (Tối đa < 5mb)", "error");
                    return;
                }
                else {
                    ctrl.closePopup();

                }
            }
            else {
                openPopup("Cảnh báo", "Định dạng tệp của bạn không đúng, vui lòng thử lại", "error");
                return;
            }
            ctrl.isWatched = false;
            ctrl.dataExcelConverted = [];
            ctrl.loadData(file.file).then(() => {
                const keysData = Object.keys(ctrl.dataExcelJsonImported[0]);
                const isSameArrayForDepartment =
                    ctrl.templateHeader.every(element => keysData.includes(element)) && keysData.length === ctrl.templateHeader.length;
                if(isSameArrayForDepartment) {
                    ctrl.handleDataForDepartment = isSameArrayForDepartment;
                    ctrl.validateDataImport();
                } else {
                    openPopup("Cảnh báo", "Template của bạn không đúng, vui lòng thử lại", "error");
                    return;
                }
            })
        }
        ctrl.showPopup = false;
        $rootScope.$apply();
    }

    ctrl.insertNewTaskExcelProject = function (file) {
        if (file) {
            var fileType = file.name.split('.').pop().toLowerCase();
            if (fileType == 'xlsx' || fileType == 'xls') {
                if (file.file.size >= 5 * 1024 * 1024) {
                    openPopup("Cảnh báo", "Tệp của bạn đang vượt quá dung lượng được cho phép (Tối đa < 5mb)", "error");
                    return;
                }
                else {
                    ctrl.closePopup();

                }
            }
            else {
                openPopup("Cảnh báo", "Định dạng tệp của bạn không đúng, vui lòng thử lại", "error");
                return;
            }
            ctrl.isWatched = false;
            ctrl.dataExcelConverted = [];
            ctrl.loadData(file.file).then(() => {
                const keysData = Object.keys(ctrl.dataExcelJsonImported[0]);
                const isSameArrayForProject = ctrl.templateHeaderForProject.every(element => keysData.includes(element)) && keysData.length === ctrl.templateHeaderForProject.length;
                if(isSameArrayForProject) {
                    ctrl.validateDataImport();
                } else {
                    openPopup("Cảnh báo", "Template của bạn không đúng, vui lòng thử lại", "error");
                    return;
                }
            })
        }
        ctrl.showPopup = false;
        $rootScope.$apply();
    }

    ctrl.getValuePriority = function (data) {
        let newValue = '';
        let list = [...ctrl.priorityDataExcel];
        for (let i = 0; i < ctrl.priorityDataExcel.length; i++) {
            if (i > 0) {
                if (list[i].value === data) {
                    newValue = list[i].priority
                }
            }
        }
        return newValue;
    }

    ctrl.convertTaskType = function (data) {
        let newValue = '';
        let list = [...ctrl.taskTypeDataExcel];
        for (let i = 0; i < ctrl.taskTypeDataExcel.length; i++) {
            if (i > 0) {
                if (list[i].value === data) {
                    newValue = list[i].task_type;
                }
            }
        }
        return newValue;
    }

    ctrl.selectOption = function (index, option, id, type) {
        ctrl.selectedValue = option;
        ctrl.isDropdownOpen = false;
        if (ctrl.dataExcelConverted[index].id === id) {
            if (type === 'priority') {
                ctrl.dataExcelConverted[index][type] = option;
            }
            else {
                ctrl.dataExcelConverted[index][type].push(option);
                ctrl.userLists = ctrl.userLists.filter(item => !ctrl.dataExcelConverted[index][type].some(item2 => item.username === item2.username));
            }
        }
        ctrl.activeItemId = '';
        ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    ctrl.validateDataImport = function (isSameArrayForDepartment) {
        let newTask = {}
        ctrl.dataExcelConverted = [];
        ctrl.isWatched = true;
        let dataExcel = ctrl.dataExcelJsonImported;
        try {
            for (let i = 0; i < dataExcel.length; i++) {
                if (i > 1) {
                    if(ctrl.handleDataForDepartment) {
                        newTask = {
                            idx: i-2,
                            id: Math.random().toString(36).substring(2, 9),
                            title: dataExcel[i].title,
                            content: dataExcel[i].content,
                            from_date: ctrl.converttoISOString(dataExcel[i].from_date),
                            to_date: ctrl.converttoISOString(dataExcel[i].to_date),
                            orig_department: dataExcel[i].department,
                            department: dataExcel[i].department,
                            // orig_dispatch_arrived_code: dataExcel[i].dispatch_arrived_code,
                            dispatch_arrived_code: dataExcel[i].dispatch_arrived_code,
                            priority: ctrl.getValuePriority(dataExcel[i].priority),
                            task_type: ctrl.convertTaskType(dataExcel[i].task_type),
                            has_time: dataExcel[i].hours ? true : false,
                            // hours: dataExcel[i].hours,
                            task_list: dataExcel[i].task_list ? dataExcel[i].task_list.split('\n').map(function (item) {
                                return {
                                    title: item.trim(),
                                    id: Math.random().toString(36).substring(2, 9),
                                    status: false
                                }
                            }) : []
                        }
                    } else {
                        newTask = {
                            idx: i-2,
                            id: Math.random().toString(36).substring(2, 9),
                            title: dataExcel[i].title,
                            content: dataExcel[i].content,
                            from_date: ctrl.converttoISOString(dataExcel[i].from_date),
                            to_date: ctrl.converttoISOString(dataExcel[i].to_date),
                            orig_project: dataExcel[i].project,
                            project: dataExcel[i].project,
                            priority: ctrl.getValuePriority(dataExcel[i].priority),
                            task_type: ctrl.convertTaskType(dataExcel[i].task_type),
                            has_time: dataExcel[i].hours ? true : false,
                            // hours: dataExcel[i].hours,
                            task_list: dataExcel[i].task_list ? dataExcel[i].task_list.split('\n').map(function (item) {
                                return {
                                    title: item.trim(),
                                    id: Math.random().toString(36).substring(2, 9),
                                    status: false
                                }
                            }) : []
                        }
                    }
                    ctrl.dataExcelConverted.push(newTask);
                }
            }
            groupData();
        }
        catch (err) {
            alert("File có lỗi, vui lòng kiểm tra lại!");
            console.log(err);
        }
        ctrl.validateProperties(ctrl.dataExcelConverted);
        $rootScope.$apply();
    }

    function groupData (){
        // let groupData = new Map();
        // if(ctrl.dataExcelConverted[0].department) {
        //     ctrl.dataExcelConverted.forEach((item) => {
        //         groupData.set(item.department, [...(groupData.get(item.department) || []), item]);
        //     })
        // } else {
        //     ctrl.dataExcelConverted.forEach((item) => {
        //         groupData.set(item.project, [...(groupData.get(item.project) || []), item]);
        //     })
        // }

        // ctrl.groupData = [... groupData.entries()];
        ctrl.insertedData = ctrl.dataExcelConverted;
    }

    ctrl.validateProperties = function (arrayImportedItem) {
        const format = "DD/MM/YYYY";
        let isValidFormatFromDate = false;
        let isValidFormatToDate = false;
        const indexes = [];
        arrayImportedItem.forEach((object, index) => {
            for (const key in object) {
                if(ctrl.handleDataForDepartment) {
                    if (key === 'department' && !object[key] && !!object.orig_department) {
                        indexes.push({ index, property: key, details: `Không tìm thấy Phòng ban "${object.orig_department}"` });
                        continue;
                    }
                    if (ctrl.requiredPropertiesDepartment.includes(key) && !object[key]) {
                        indexes.push({ index, property: key, details: ctrl.errorEmpty });
                    }
                } else {
                    if (key === 'project' && !object[key] && !!object.orig_project) {
                        indexes.push({ index, property: key, details: `Không tìm thấy dự án "${object.orig_project}"` });
                        continue;
                    }
                    if (ctrl.requiredPropertiesProject.includes(key) && !object[key]) {
                        indexes.push({ index, property: key, details: ctrl.errorEmpty });
                    }
                }
            }
            if (object.from_date) {
                ctrl.converttoISOString(object.from_date);
                isValidFormatFromDate = moment(object.from_date, format, true).isValid();
                if (!isValidFormatFromDate) {
                    indexes.push({ index, property: 'from_date', details: "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy)." })
                }
            }
            if (object.to_date) {
                isValidFormatToDate = moment(object.to_date, format, true).isValid();
                if (!isValidFormatToDate) {
                    indexes.push({ index, property: 'to_date', details: "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy)." })
                }
            }

            if (isValidFormatFromDate && isValidFormatToDate && moment(object.from_date, format).unix() > moment(object.to_date, format).unix()) {
                indexes.push({ index, property: 'from_date', details: "Trường 'Từ ngày' phải nhỏ hơn trường 'Đến ngày'" })
            }

        });
        if (indexes.length > 0) {
            ctrl.listErrorExcelImport = indexes;
        } else {
            ctrl.listErrorExcelImport = [];
            console.log("All properties are defined in all objects.");
        }
    }

    ctrl.filterData = function (item) {
        if (!item.title) {
            alert("Tiêu đề trong từng công việc không được để trống. Vui lòng kiểm tra lại!");
            ctrl.removeExcelFile_insert();
        }
        return window.removeUnicode(item.title.toLowerCase()).includes(window.removeUnicode(ctrl._search.toLowerCase()));
    }

    openPopup = (title, content, type) => {
        ctrl.showPopup = true;
        ctrl.titleInputExcelPopup = title;
        ctrl.contentinputExcelPopup = content;
        ctrl.titleType = type;
        $rootScope.$apply();
    }

    ctrl.stopPropagation = function (e) {
        e.stopPropagation();
    }

    ctrl.reloadPage = function() {
        location.reload()
    }

    ctrl.import_excel_task = function(){
        if (ctrl.listErrorExcelImport.length) {
            alert('File của bạn có lỗi, xin vui lòng cập nhật trước khi thêm mới.');
            return;
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'import_excel_task', import_excel_task_service)
    }

    function import_excel_task_service(){
        const dfd = $q.defer();
        ctrl.dataSendToBe = JSON.parse(JSON.stringify(ctrl.dataExcelConverted));
        ctrl.dataSendToBe.map((item) => {
            let dateFromDate = new Date(item.from_date);
            item.from_date = dateFromDate.getTime();
            let dateToDate = new Date(item.to_date);
            item.to_date = dateToDate.getTime();
            if (item.department) {
                const selectedDepartment = ctrl.department.find((department) => department.optionTitle === item.department);
                item.department = selectedDepartment ? selectedDepartment.id : undefined;
            }
            if(item.project) {
                const selectedProject = ctrl.project.find((project) => project.optionTitle === item.project);
                item.project = selectedProject ? selectedProject._id : undefined;
            }
            if (item.dispatch_arrived_code) {
                const selectedDispatchArrived = ctrl.dispatchArrived.find(dispatchArrived => dispatchArrived.code === item.dispatch_arrived_code);
                item.dispatch_arrived_id = selectedDispatchArrived ? selectedDispatchArrived._id : undefined;
            }
            delete item.$$hashKey;
            delete item.idx;
            delete item.orig_department;
            delete item.orig_project;
            delete item.orig_dispatch_arrived_code;
            delete item.dispatch_arrived_code;
            delete item.task_type;
        });

        if(ctrl.handleDataForDepartment) {
            task_service.insert_for_multiple_departments({data: ctrl.dataSendToBe}).then((res) => {
                // ctrl.groupData.forEach((data) => {
                //     ctrl.message.push(`${data[0]}: ${data[1].length} công việc.`)
                // })
                openPopup(
                    'Thành công',
                    `Có ${ctrl.insertedData.length} công việc trong tệp của bạn đã được thêm thành công vào hệ thống`,
                    'success'
                );
                dfd.resolve(true);
            }, function(err){
                dfd.reject(err);
            })
        } else {
            task_service.insert_for_multiple_projects({data: ctrl.dataSendToBe}).then((res) => {
                // ctrl.groupData.forEach((data) => {
                //     ctrl.message.push(`${data[0]}: ${data[1].length} công việc.`)
                // })
                
                openPopup(
                    'Thành công',
                    `Có ${ctrl.insertedData.length} công việc trong tệp của bạn đã được thêm thành công vào hệ thống`,
                    'success'
                );
                dfd.resolve(true);
            }, function(err){
                dfd.reject(err);
            })
        }

        return dfd.promise;
    }

    //Insert major label
    ctrl.prepareInsertLabel = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Label", "insert");

        ctrl._insert_majorLabel_value = {
            title: "",
            labelChosen_type: "",
            department: []
        }
    }

    ctrl.handleDepartmentLabel = function (val) {
        ctrl._insert_majorLabel_value.department = val
    }

    function insert_majorLabel_service() {
        var dfd = $q.defer();
        if(ctrl._insert_majorLabel_value.labelChosen_type === "all") {
            ctrl._insert_majorLabel_value.is_has_department = false;
            ctrl._insert_majorLabel_value.department = []
        } else {
            ctrl._insert_majorLabel_value.is_has_department = true;
        }
        task_service.insert_label(
            ctrl._insert_majorLabel_value.title,
            null,
            ctrl._insert_majorLabel_value.is_has_department,
            ctrl._insert_majorLabel_value.department,
        ).then(function () {
            ctrl.loadLabel({});
            $("#modal_MajorLabel_Insert").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.insert_label = function() {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Label", "insert", insert_majorLabel_service);
    }

    //Insert major label
    ctrl.prepareInsertMinorLabel = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Label", "insert");

        ctrl._insert_minorLabel_value = {
            title: "",
            parent_label: item._id,
            majorTitle: item.title,
            is_has_department: false,
            departments: []
        }
    }

    function insert_minorLabel_service() {
        var dfd = $q.defer();

        task_service.insert_label(
            ctrl._insert_minorLabel_value.title,
            ctrl._insert_minorLabel_value.parent_label,
            ctrl._insert_minorLabel_value.is_has_department,
            ctrl._insert_minorLabel_value.departments
        ).then(function () {
            ctrl.loadLabel({});
            $("#modal_MinorLabel_Insert").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.insert_minorLabel = function() {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Label", "insert", insert_minorLabel_service);
    }

    // Update major label
    ctrl.prepareUpdate_major_label = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Label", "update");
        ctrl._update_majorLabel_value = angular.copy(value);
        if(ctrl._update_majorLabel_value.is_has_department === true) {
            ctrl._update_majorLabel_value.labelChosen_type = 'specific';
        } else {
            ctrl._update_majorLabel_value.labelChosen_type = 'all';
        }
    }

    ctrl.handleUpdateMajorLabel = function (val) {
        ctrl._update_majorLabel_value.departments = val
    }

    function update_major_label_service () {
        var dfd = $q.defer();
        if(ctrl._update_majorLabel_value.labelChosen_type === "all") {
            ctrl._update_majorLabel_value.is_has_department = false;
            ctrl._update_majorLabel_value.departments = []
        } else {
            ctrl._update_majorLabel_value.is_has_department = true;
        }
        task_service.update_label(
            ctrl._update_majorLabel_value._id,
            ctrl._update_majorLabel_value.title,
            ctrl._update_majorLabel_value.parent_label,
            ctrl._update_majorLabel_value.is_has_department,
            ctrl._update_majorLabel_value.departments,
        ).then(function () {
            ctrl.loadLabel({});
            $("#modal_majorLabel_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.update_major_label = function() {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Label", "update", update_major_label_service);
    }

    // Update minor label
    ctrl.prepareUpdate_minor_label = function (child, item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Label", "update");
        ctrl._update_minorLabel_value = angular.copy(child);
        ctrl._update_minorLabel_value.majorTitle = item.title;
        ctrl._update_minorLabel_value.parent_label = item._id;
        ctrl._update_minorLabel_value.is_has_department = false;
        ctrl._update_minorLabel_value.departments = []
    }

    function update_minor_label_service () {
        var dfd = $q.defer();
        task_service.update_label(
            ctrl._update_minorLabel_value._id,
            ctrl._update_minorLabel_value.title,
            ctrl._update_minorLabel_value.parent_label,
            ctrl._update_minorLabel_value.is_has_department,
            ctrl._update_minorLabel_value.departments,
        ).then(function () {
            ctrl.loadLabel({});
            $("#modal_minorLabel_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.update_minor_label = function() {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Label", "update", update_minor_label_service);
    }

    ctrl.loadLabel = function ({search, top, offset, sort}) {
        var dfd = $q.defer();
        task_service.load_label(search, top, offset, sort).then(function (res) {
            ctrl.labels = res.data;
            ctrl.labels.forEach(function(element) {
                if (element.child_labels && element.child_labels.length > 0) {
                    element.expand = true;
                    element.open = true;
                }
            });
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.expandLabel = function (item) {
        currentItem = item
        if (currentItem.open) {
            currentItem.open = false;
            currentItem.child_labels = [];
        } else {
            currentItem.open = true;
            ctrl.loadLabel({})
        }
    }

    // Recurring department task
    ctrl.chooseFromDate = function (val) {
        ctrl._filterFromDate = val ? val.getTime() : undefined;
        ctrl.refreshRecurringData()
    }

    ctrl.chooseToDate = function (val) {
        ctrl._filterToDate = val ? val.getTime() : undefined;
        ctrl.refreshRecurringData()
    }

    ctrl.pickCycle = function(val){
        ctrl._filterCycle = val.value;
        ctrl.refreshRecurringData()
    }

    ctrl.pickSeries = function(val){
        ctrl._filterSeries = val._id;
        ctrl.refreshRecurringData()
    }

    ctrl.pickTaskType = function(val){
        ctrl._filterTaskType = val.ordernumber;
        ctrl.refreshRecurringData()
    }

    ctrl.pickPriority = function(val){
        ctrl._filterPriority = val.ordernumber;
        ctrl.refreshRecurringData()
    }

    ctrl.pickStatus = function(val){
        ctrl._filterStatus = val.value;
        ctrl.refreshRecurringData()
    }

    function generateFilter() {
        var filter = {};

        if (ctrl._searchByKeyToFilterData !== "") {
            filter.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        if(ctrl._filterFromDate) {
            filter.from_date = ctrl._filterFromDate;
        }
        if(ctrl._filterToDate) {
            filter.to_date = ctrl._filterToDate;
        }
        if(ctrl._filterCycle) {
            filter.cycle = ctrl._filterCycle;
        }
        if(ctrl._filterSeries) {
            filter.series = ctrl._filterSeries;
        }
        if(ctrl._filterTaskType) {
            filter.task_type = ctrl._filterTaskType;
        }
        if(ctrl._filterPriority) {
            filter.priority = ctrl._filterPriority;
        }
        if(ctrl._filterStatus) {
            filter.status = ctrl._filterStatus;
        }
        return filter;
    }

    ctrl.loadRecurringTask = function() {
        var dfd = $q.defer();
        var filter = generateFilter();
        task_service.load_recurring_task(filter.search, 0, 0, false, false, filter.cycle, filter.priority, filter.status, filter.series, filter.task_type, filter.from_date, filter.to_date).then((res) => {
            ctrl.recurring_tasks = res.data.map(task => {
                return {
                    ...task,
                    isOpen: false
                };
            });
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.loadRecurringTask_directive = function(params) {
        var dfd = $q.defer();
        task_service.load_recurring_task(params.search).then((res) => {
            res.data.unshift({title: "Tất cả", value: "All", _id: ''});
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.loadRecurringTask_detail = function(id) {
        var dfd = $q.defer();
        task_service.load_recurring_task_detail(id.id).then((res) => {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.countRecurringTask_detail = function() {
        var dfd = $q.defer();
        var filter = generateFilter();
        task_service.count_recurring_task(filter.search, filter.cycle, filter.priority, filter.status, filter.series, filter.from_date, filter.to_date).then((res) => {
            ctrl.count_recurring_tasks = res.data;
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.refreshRecurringData = function () {
        ctrl.loadRecurringTask();
    }

    ctrl.prepareCancel = function (val, department) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
        ctrl._update_status_value = angular.copy(val);
        ctrl._update_status_value.action = 'cancel';
        if(department) {
            ctrl._update_status_value.department_series = department;
        }
    }

    ctrl.preparePause = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "pause");
        ctrl._update_status_value = angular.copy(val);
        ctrl._update_status_value.action = 'pause';
    }

    ctrl.prepareResume = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "resume");
        ctrl._update_status_value = angular.copy(val);
        ctrl._update_status_value.action = 'resume';
    }


    function update_status_service () {
        var dfd = $q.defer();
        task_service.update_status_recurring_tasks(ctrl._update_status_value._id, ctrl._update_status_value.department_series, ctrl._update_status_value.action).then(function () {
            ctrl.loadRecurringTask();
            if(ctrl._update_status_value.action === 'cancel') {
                $("#modal_Recurring_Task_Cancel").modal("hide");
            } else if (ctrl._update_status_value.action === 'pause') {
                $("#modal_Task_Pause").modal("hide");
            } else {
                $("#modal_Task_Resume").modal("hide");
            }
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }

    ctrl.update_status = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "update_status", update_status_service);
    }

    function init() {
        const dfdAr = [];
        dfdAr.push(ctrl.loadDepartments());
        dfdAr.push(loadProjects());
        dfdAr.push(ctrl.loadRecurringTask());
        // dfdAr.push(ctrl.loadDispatchArrived());
        dfdAr.push(ctrl.loadLabel({}));
        $q.all(dfdAr).then(function(){
            ctrl._notyetInit = false;
        }, function(err){
            err = undefined;
        })
    }

    ctrl.loadLabel_InsertTranferTask = function ({ search, top, offset, sort }) {
        var dfd = $q.defer();
        task_service.load_label(search, top, offset, sort).then(
            function (res) {
            dfd.resolve(res.data);
            dfd = undefined;
            },
            function (err) {
            dfd.reject(err);
            err = undefined;
            }
        );
        return dfd.promise;
    };

    ctrl.loadLabel_details_InsertTranferTask = function ({ ids }) {
        var dfd = $q.defer();
        task_service.loadLabel_details(ids).then(
            function (res) {
            dfd.resolve(res.data);
            dfd = undefined;
            },
            function (err) {
            dfd.reject(err);
            err = undefined;
            }
        );
        return dfd.promise;
    };

    ctrl.pickLabel_InsertTranferTask = function (value, item) {
        item.label = value;
    };

    init();
}])

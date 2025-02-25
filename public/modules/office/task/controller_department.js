myApp.registerCtrl("task_department_homepage_controller", [
  "task_service",
  "workflow_play_service",
  "notify_service",
  "$q",
  "$rootScope",
  "$scope",
  "$filter",
  "$location",
  "FileSaver",
  "Blob",
  function (
    task_service,
    workflow_play_service,
    notify_service,
    $q,
    $rootScope,
    $scope,
    $filter,
    $location,
    FileSaver,
    Blob
  ) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Task", action: "init" },
      { name: "Task", action: "load" },
      { name: "Task", action: "load_head_task" },
      { name: "Task", action: "count" },
      { name: "Task", action: "count_head_task" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "alertPopupExcel" },
      { name: "Task", action: "pushFile" },
      { name: "Task", action: "removeFile" },
      { name: "Task", action: "insertTaskExcel" },
      { name: "Task", action: "export" },
      { name: "Task", action: "loadTemplate" },
      { name: "Task", action: "loadGanttChartData" },
    ];

    var ctrl = this;
    ctrl._insertExcel = {
      excelFile: [],
    };
    ctrl.Departments = [];
    ctrl._insert_value = {};
    ctrl.view = "grid";
    var idEditor = "insertTask_inDepartmentDashboard_content";
    ctrl._urlInsertHeadTaskModal =
      FrontendDomain +
      "/modules/office/task/views/insert_head_task_in_department_dashboard.html";
    // SWITCH VIEW

    ctrl.switchView = function (val) {
      if (ctrl.view !== val) {
        ctrl.view = val;
      }
    };
    ctrl.statusList = [
      {
        title: "All",
      },
      {
        title: "Processing",
      },
      {
        title: "Completed",
      },
      {
        title: "NotSeen",
      },
      {
        title: "Cancelled",
      },
      {
        title: "WaitingForApproval",
      },
    ];

    ctrl.stateList = [
      {
        title: "All",
      },
      {
        title: "Open",
      },
      {
        title: "OnSchedule",
      },
      {
        title: "GonnaLate",
      },
      {
        title: "Overdue",
      },
      {
        title: "Early",
      },
      {
        title: "Late",
      },
    ];

    ctrl.sortByList = [
      { title: "DepartmentName", value: "title" },
      { title: "CurrentTask", value: "open" },
      { title: "CompletedTask", value: "closed" },
      { title: "Overdue", value: "over_due" },
      { title: "GonnaLate", value: "gonna_late" },
      { title: "Open", value: "on_schedule" },
    ];

    ctrl.sortingOrderList = [
      { title: "Ascending(A->Z)", value: 1 },
      { title: "Descending(Z->A)", value: -1 },
    ];

    ctrl.sortBy_department_dashboard = ctrl.sortByList[0];
    ctrl.sortingOrder_department_dashboard = ctrl.sortingOrderList[0];
    ctrl.search_department_dashboard = "";

    ctrl._ctrlName = "task_department_controller";
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    function setValueFilter() {
      var today = new Date();

      if (today.getDate() < 10) {
        ctrl._filterFromDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
          0,
          0,
          0
        );
        ctrl._filterFromDate_Department_Dashboard = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
          0,
          0,
          0
        );
      } else {
        ctrl._filterFromDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
          0,
          0,
          0
        );
        ctrl._filterFromDate_Department_Dashboard = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
          0,
          0,
          0
        );
      }
      ctrl._filterToDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      ctrl._filterToDate_Department_Dashboard = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      ctrl._filterStatus = "All";
      ctrl._filterHeadTaskStatus = "All";
      ctrl._filterTaskStatus = "All";
      ctrl._filterTaskState = "All";
    }

    ctrl.search_department = function ({ search } = {}) {
        var dfd = $q.defer();
        ctrl.search_department_dashboard = search;

        task_service.load_department(undefined, 0, ctrl.search_department_dashboard
            , ctrl._filterFromDate_Department_Dashboard.getTime(),
            ctrl._filterToDate_Department_Dashboard.getTime(), ctrl.sortBy_department_dashboard.value,
            ctrl.sortingOrder_department_dashboard.value).then(function (res) {
                ctrl.Departments = res.data.filter(item => item?._id);
                let currentId = $location.search().id;
                if (ctrl.Departments && currentId) {
                    let currentDepartment = ctrl.Departments.find(dep => dep._id === currentId);
                    if (currentDepartment) {
                        $location.search('id', currentId);
                        ctrl.chooseDepartment(currentDepartment);
                        load_employee_office(currentDepartment.id)
                    } else {
                        $location.search('id', null);
                    }
                    currentDepartment = undefined;
                }
                dfd.resolve(true);
                currentId = undefined;
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    //DEPARTMENT DASHBOARD
    ctrl.refreshData_Department_Dashboard = function () {
      ctrl.Departments = [];
      task_service
        .load_department(
          undefined,
          0,
          ctrl.search_department_dashboard,
          ctrl._filterFromDate_Department_Dashboard.getTime(),
          ctrl._filterToDate_Department_Dashboard.getTime(),
          ctrl.sortBy_department_dashboard.value,
          ctrl.sortingOrder_department_dashboard.value
        )
        .then(
          function (res) {
            ctrl.Departments = res.data.filter(item => item?._id);
          },
          function (err) {
            console.log(err);
          }
        );
    };

    ctrl.selectSortBy = function (item) {
      ctrl.sortBy_department_dashboard = item;
      ctrl.refreshData_Department_Dashboard();
    };

    ctrl.selectSortingOrder = function (item) {
      ctrl.sortingOrder_department_dashboard = item;
      ctrl.refreshData_Department_Dashboard();
    };

    //EXPORT DEPARTMENT DASHBOARD
    ctrl.exportDepartmentReport = function () {
      const table = document.getElementById("departmentReport");
      const workbook = XLSX.utils.table_to_book(table);
      XLSX.writeFile(workbook, "departmentReport.xlsx");
    };

    function load_employee_office(currentId) {
      var dfd = $q.defer();
      task_service.load_employee(currentId).then(
        function (res) {
          ctrl.listEmployeeAPI = res.data;
          dfd.resolve(true);
          currentId = undefined;
        },
        function () {
          dfd.reject(false);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    /**INIT */
    function init() {
      setValueFilter();
      ctrl.search_department();
    }

    init();

    //INSERT
    ctrl.TaskPriority = {
      master_key: "task_priority",
      load_details_column: "value",
    };

    ctrl.loadLabel = function ({ search, top, offset, sort }) {
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
    ctrl.loadLabel_details = function ({ ids }) {
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

    ctrl.chooseFromDate_insert = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._insert_value.from_date = val ? val.getTime() : undefined;
      if (ctrl._insert_value.to_date && ctrl._insert_value.from_date >= ctrl._insert_value.to_date) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date);
      }
      if (!ctrl.fromDate_ErrorMsg === $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date)) {
        ctrl.chooseToDate_insert(ctrl._insert_value.to_date ? new Date(ctrl._insert_value.to_date) : undefined);
      }
    };
    ctrl.chooseToDate_insert = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._insert_value.to_date = val ? val.getTime() : undefined;
      if (ctrl._insert_value.from_date && ctrl._insert_value.to_date <= ctrl._insert_value.from_date) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._insert_value.from_date, val);
      }
    };
    ctrl.chooseDepartment_insert = function (val) {
      ctrl._insert_value.currentDepartment = val.id;
    };
    ctrl.chooseTaskPriority_insert = function (val) {
      const priority = task_service.taskPriorityTransform(val.value);
      ctrl._insert_value.priority = priority.key;
    };

    
    ctrl.pickLabel_insert = function (value) {
      ctrl._insert_value.label = value;
    };

    ctrl.addCheckList_insert = function () {
      var d = new Date();
      ctrl._insert_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._insert_value.focusChecklist = d.getTime().toString();
    };
    ctrl.removeCheckList_insert = function (id) {
      ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
        (e) => e.id !== id
      );
    };
    ctrl.removeFile_insert = function (item) {
      ctrl._insert_value.files = ctrl._insert_value.files.filter(
        (e) => e.name !== item.name
      );
    };

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        $("#" + idEditor).summernote({
            placeholder: $filter("l")("InputContentHere"),
            toolbar: [
                ['style', ['style']], 
                ['style', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']],
                ['misc', ['fullscreen', 'help']]
              ],
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    task_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data);
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });

        ctrl._insert_value = {
            files: [],
            code:"",
            task_list: [],
            main_person:[],
            participant: [],
            observer: [],
            parent: [],
            label:[],
            da_book:"",
            number:1,
            from_date:myToday.getTime(),
            author: "",
            agency_promulgate: "",
            to_date:endDay.getTime(),
            note: "",
            type: 1,
            priority: "Medium",
            is_legal: false,
            is_assign_task: false,
            excerpt: "",
            level: "HeadTask",
            _filterTaskPriority: "",
            currentDepartment: null
        };
    }

    function insert_service() {
      return task_service.insert(
        ctrl._insert_value.files, //1
        ctrl._insert_value.title, //1
        "",
        ctrl._insert_value.note, //1
        ctrl._insert_value.task_list, //1
        ctrl._insert_value.main_person, //1
        ctrl._insert_value.participant, //1
        ctrl._insert_value.observer, //1
        ctrl._insert_value.from_date, //1
        ctrl._insert_value.to_date, //1
        ctrl._insert_value.has_time, //1
        ctrl._insert_value.hours, //1
        task_service.taskPriorityTransform(ctrl._insert_value.priority).key, //1
        ctrl._insert_value.type, //1
        ctrl._insert_value.head_task_id, //1
        null, //parent_id
        ctrl._insert_value.currentProject, //1
        ctrl._insert_value.currentDepartment, //1
        undefined, //dispatch_arrived_id
        ctrl._insert_value.level, //1
        ctrl._insert_value.label, //1
        false, //is_draft
        [], //parents
        {}, //parent
        1 //source_id
      );
    }

    ctrl.insert = function () {
      return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Task",
          "insert",
          insert_service
      ).then(function() {
          $('#modal_Head_Task_Insert_In_Department_Dashboard').modal('hide');
          ctrl.refreshData_Department_Dashboard();
      });
    };
  },
]);

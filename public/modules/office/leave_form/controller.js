

myApp.registerCtrl('leave_form_controller', ['leave_form_service', '$q', '$rootScope', function (leave_form_service, $q, $rootScope) {

    /**declare variable */
    const _statusValueSet = [
        { name: "LeaveForm", action: "init" },
        { name: "LeaveForm", action: "load" },
        { name: "LeaveForm", action: "count" },
        { name: "LeaveForm", action: "countPending" },
        { name: "LeaveForm", action: "insert" },
        { name: "LeaveForm", action: "update" },
        { name: "LeaveForm", action: "delete" }
    ];
    var ctrl = this;
    var idEditor = "insertLeaveForm_content";
    /** init variable */
    {
        ctrl._ctrlName = "leave_form_controller";
        ctrl.tab = "need_to_handle";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl.leave_forms = [];

        ctrl.LeaveFormType_Config = {
            master_key: "leave_form_type",
            load_details_column: "value"
        };

        ctrl.LeavingFormApprovalStatus_Config = {
            master_key: "leaving_form_approval_status",
            load_details_column: "value"
        };

        ctrl.WF = [];
        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";
        ctrl._filterStatus = "";
        ctrl._filterType = "";
        ctrl._filterFromDate = "";
        ctrl._filterToDate = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/office/leave_form/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/leave_form/views/delete_modal.html";
    }

    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.chooseFromDate = function (val) {
        ctrl._filterFromDate = val.getTime();
        ctrl.refreshData();
    }

    ctrl.chooseToDate = function (val) {
        ctrl._filterToDate = val.getTime();
        ctrl.refreshData();
    }

    ctrl.chooseStatus = function (val) {
        ctrl._filterStatus = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseType = function (val) {
        ctrl._filterType = val.value;
        ctrl.refreshData();
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        ctrl.refreshData();
    }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate);
        }

        if (ctrl._filterToDate) {
            obj.to_date = angular.copy(ctrl._filterToDate);
        }

        if (ctrl._filterStatus) {
            obj.status = angular.copy(ctrl._filterStatus);
        }
        if (ctrl._filterType) {
            obj.type = angular.copy(ctrl._filterType);
        }
        return obj;
    }

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.leave_forms) {
            if (ctrl.leave_forms[i]._id === params.params) {
                ctrl.leave_forms[i].check = params.value;
            }
            if (ctrl.leave_forms[i].check && ctrl.leave_forms[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.leave_forms[i]._id);
                ctrl.checkAr.push(ctrl.leave_forms[i]);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.leave_forms.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.leave_forms) {
            ctrl.leave_forms[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.leave_forms) {
            ctrl.leave_forms[i].check = params;
            if (ctrl.leave_forms[i].check && ctrl.leave_forms[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.leave_forms[i]._id);
                ctrl.checkAr.push(ctrl.leave_forms[i]);
            }
        }
    }

    /* Init and load necessary resource to the module. */

    function init_service() {
        var dfd = $q.defer();
        leave_form_service.init().then(function (res) {
            ctrl.WFT = res.data.wft;
            ctrl.WF = res.data.wf;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }



    ctrl.loadWorkflow_details = function (params) {
        let dfd = $q.defer();
        leave_form_service.loadWorkflow_details(params.id).then(function (res) {
            dfd.resolve(res.data[0]);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function load_service() {
        var dfd = $q.defer();
        ctrl.leave_forms = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        leave_form_service.load(_filter.search, _filter.type, _filter.from_date, _filter.to_date, _filter.status, ctrl.tab, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.leave_forms = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        leave_form_service.count(_filter.search, _filter.type, _filter.from_date, _filter.to_date, _filter.status, ctrl.tab).then(function (res) {
            ctrl.totalItems = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "count", count_service);
    }

    function countPending_service() {
        var dfd = $q.defer();
        leave_form_service.countPending().then(function (res) {
            ctrl.numberPending = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countPending = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "countPending", countPending_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(ctrl.countPending());
        $q.all(dfdAr);
    }

    init();
    function init() {
        var dfdAr = [];
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        ctrl.chooseFromDate(firstDay);
        ctrl.chooseToDate(lastDay);
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(init_service());
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(ctrl.countPending());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }


    /**load File */

    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            leave_form_service.loadFileInfo(params.id, params.name).then(function (res) {
                dfd.resolve({
                    display: res.data.display,
                    embedUrl: res.data.url,
                    guid: res.data.guid
                });
                res = undefined;
                dfd = undefined;
            }, function (err) {
            });
            return dfd.promise;
        }
    }


    /**insert */
    ctrl.chooseLFT_insert = function (val) {

        ctrl._insert_value.type = val.value;
    }
    ctrl.chooseWF_insert = function (val) {
        ctrl._insert_value.key = val._id;
        ctrl._insert_value.wf = val;
    }
    ctrl.chooseFromDate_insert = function (val) {

        ctrl._insert_value.from_date = val.getTime();
    }

    ctrl.chooseToDate_insert = function (val) {
        ctrl._insert_value.to_date = val.getTime();
    }
    ctrl.removeFile_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.files) {
            if (ctrl._insert_value.files[i].name != item.name) {
                temp.push(ctrl._insert_value.files[i]);
            }
        }
        ctrl._insert_value.files = angular.copy(temp);
    }

    ctrl.removeRelatedFile_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.relatedfile) {
            if (ctrl._insert_value.relatedfile[i].name != item.name) {
                temp.push(ctrl._insert_value.relatedfile[i]);
            }
        }
        ctrl._insert_value.relatedfile = angular.copy(temp);
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "LeaveForm", "insert");
        $("#" + idEditor).summernote({
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    task_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });

        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        ctrl._insert_value = {
            files: [],
            from_date: "",
            to_date: "",
            type: "",
            number_day: 1,
            from_date: myToday.getTime(),
            to_date: endDay.getTime(),
            use_jtf: false
        };
        if (ctrl.WF[0]) {
            ctrl._insert_value.wf = ctrl.WF[0];
            ctrl._insert_value.key = ctrl.WF[0]._id;
        }
    }

    function insert_service() {
        var dfd = $q.defer();
        leave_form_service.insert(
            ctrl._insert_value.files,
            JSON.stringify(ctrl._insert_value.wf.flow),
            ctrl._insert_value.from_date,
            ctrl._insert_value.to_date,
            ctrl._insert_value.type,
            $("#" + idEditor).summernote('code'),
            ctrl._insert_value.number_day,
            ctrl._insert_value.use_jtf
        ).then(function () {
            $("#modal_LeaveForm_Insert").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "insert", insert_service);
    }

    ctrl.prepareDelete= function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "LeaveForm", "delete");
       
        ctrl._delete_value = angular.copy(item);
    }

    function delete_service() {
        var dfd = $q.defer();
        leave_form_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_LeaveForm_Delete").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "delete", delete_service);
    }

}]);



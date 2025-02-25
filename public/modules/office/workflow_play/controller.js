myApp.registerCtrl('workflow_play_controller', ['workflow_play_service', '$q', '$rootScope', '$scope', function (workflow_play_service, $q, $rootScope, $scope) {

    /**declare variable */
    const _statusValueSet = [
        { name: "WFP", action: "init" },
        { name: "WFP", action: "load" },
        { name: "WFP", action: "count" },
        { name: "WFP", action: "countPending" },
        { name: "WFP", action: "insert" },
        { name: "WFP", action: "update" },
        { name: "WFP", action: "delete" },
        { name: "WFP", action: "loadUserAndDepartment" },
        { name: "WFP", action: "loadCustomTemplatePreview" },
    ];

    $scope.forms = {};

    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "workflow_play_controller";
        // ctrl.tab = "need_to_handle";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 15;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
        ctrl.workflow_plays = [];

        ctrl.WF = [];
        ctrl.WF2 = [];
        ctrl.listUsers = [];
        ctrl.listUsersDefault = [];
        ctrl.departmentDetails = {};
        ctrl._notyetInit = true;
        ctrl.showCount = 5;
        ctrl.showLoadMore = false;
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterWFT = "";
        ctrl._filterStatus = "";

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/workflow_play/views/delete_modal.html";
    }

    ctrl.checkbox_need_to_handle = true;
    ctrl.checkbox_handled = false
    ctrl.checkbox_created = false;

    // ctrl.checkbox_approved = true;
    // ctrl.checkbox_returned = true;
    // ctrl.checkbox_rejected = true;

    // ctrl.is_personal = false;
    // ctrl.is_department = false;

    // ctrl.checkbox_personal = false;
    // ctrl.checkbox_department = false;

    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.chooseTypeWFP = function (val) {
        ctrl._filterWFT = val.value;
        ctrl.refreshData();
    }
    ctrl.chooseStatus = function (val) {
        ctrl._filterStatus = val.value;
        ctrl.refreshData();
    }
    // ctrl.switchTab = function (val) {
    //     ctrl.tab = val;
    //     ctrl.refreshData();
    // }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    const CHECKS_ON_UI = {
        CREATED: "created",
        NEED_HANDLE: "need_handle",
        HANDLED: "handled"
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterWFT) {
            obj.document_type = angular.copy(ctrl._filterWFT);
        }

        if (ctrl._filterStatus) {
            obj.status = angular.copy(ctrl._filterStatus);
        }

        obj.checks = [];

        if (ctrl.checkbox_need_to_handle) {
            obj.checks.push(CHECKS_ON_UI.NEED_HANDLE);
        }
        if (ctrl.checkbox_created && ctrl.checkbox_handled) {
            obj.checks.push(CHECKS_ON_UI.HANDLED);
        }
        if (ctrl.checkbox_created) {
            obj.checks.push(CHECKS_ON_UI.CREATED);
        }

        // if (ctrl.checkbox_approved) {
        //     obj.checks.push("Approved");
        // }
        
        // if (ctrl.checkbox_returned) {
        //     obj.checks.push("Returned");
        // }

        // if (ctrl.checkbox_returned) {
        //     obj.checks.push("Rejected");
        // }

        // if (ctrl.checkbox_personal) {
        //     obj.checks.push("ForPersonal");
        // }
    
        // if (ctrl.checkbox_department) {
        //     obj.checks.push("ForDepartment");
        // }

        // obj.is_personal = ctrl.is_personal || false;
        // obj.is_department = ctrl.is_department || false; 

        return obj;
    }

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.workflow_plays) {
            if (ctrl.workflow_plays[i]._id === params.params) {
                ctrl.workflow_plays[i].check = params.value;
            }
            if (ctrl.workflow_plays[i].check && ctrl.workflow_plays[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.workflow_plays[i]._id);
                ctrl.checkAr.push(ctrl.workflow_plays[i]);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.workflow_plays.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.workflow_plays) {
            ctrl.workflow_plays[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.workflow_plays) {
            ctrl.workflow_plays[i].check = params;
            if (ctrl.workflow_plays[i].check && ctrl.workflow_plays[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.workflow_plays[i]._id);
                ctrl.checkAr.push(ctrl.workflow_plays[i]);
            }
        }
    }

    /* Init and load necessary resource to the module. */

    function init_service() {
        var dfd = $q.defer();
        workflow_play_service.init().then(function (res) {
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
        workflow_play_service.loadWorkflow_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }


    function load_service() {
        var dfd = $q.defer();
        ctrl.workflow_plays = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        workflow_play_service.load( _filter.checks, _filter.search, _filter.document_type, _filter.status, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.workflow_plays = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        workflow_play_service.count(_filter.search, _filter.document_type, _filter.status, _filter.checks).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "count", count_service);
    }

    function countPending_service() {
        var dfd = $q.defer();
        workflow_play_service.countPending().then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "countPending", countPending_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        var filter = generateFilter();
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(ctrl.countPending());
        $q.all(dfdAr);
    }

    ctrl.togglePersonal = function() {
        ctrl.refreshData();
    }
    
    ctrl.toggleDepartment = function() {
        ctrl.refreshData();
    }

    init();
    function init() {
        var dfdAr = [];
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
            workflow_play_service.loadFileInfo(params.id, params.name).then(function (res) {
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
    ctrl.handleInsertWFPSuccess = function () {
        ctrl.refreshData();
        ctrl.switchTab('created');
    };


    /**delete */
    ctrl.prepareDelete = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "WFP", "delete");

        ctrl._delete_value = angular.copy(item);
    }

    function delete_service() {
        var dfd = $q.defer();
        workflow_play_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_WFP_Delete").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "delete", delete_service);
    }

    ctrl.loadUserAndDepartment = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "loadUserAndDepartment", load_users_and_department_service);
    }

    function load_users_and_department_service() {
        var dfd = $q.defer();
        let dfdArr = [];
        
        if (ctrl.listUsersDefault.length === 0) {
            let request = {
                department: $rootScope.logininfo.data.department,
                top: 0,
                offset: ctrl.offset,
                sort: { title: 1 }
            }
            dfdArr.push(workflow_play_service.loadUsersByDepartment(request))
        }

        if (Object.keys(ctrl.departmentDetails).length === 0) {
            dfdArr.push(workflow_play_service.loadDepartmentDetails($rootScope.logininfo.data.department))
        }
        
        $q.all(dfdArr).then(function (data) {
            ctrl.listUsersDefault = data[0].data;
            ctrl.departmentDetails = data[1].data;
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        })
        return dfd.promise;
    }
    /**END Load Department */

    ctrl.loadMore = function () {
        if (ctrl.showCount === ctrl.listUsers.length) {
            ctrl.showCount = 5;
        } else {
            ctrl.showCount = ctrl.listUsers.length;
        }
    }

    $scope.$on('detailsbox.hide', function () {
        ctrl.refreshData();
    });
}]);



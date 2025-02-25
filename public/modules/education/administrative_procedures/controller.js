
myApp.registerCtrl('administrative_procedures_controller', ['administrative_procedures_service', '$q', '$rootScope', '$filter', function (administrative_procedures_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "administrativeProcedures", action: "load" },
        { name: "administrativeProcedures", action: "count" },
        { name: "administrativeProcedures", action: "insert" },
        { name: "administrativeProcedures", action: "update" },
        { name: "administrativeProcedures", action: "loadWorkflows" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "administrative_procedures_controller";
        ctrl._notyetInit = true;

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/education/administrative_procedures/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/education/administrative_procedures/views/update_modal.html";

        ctrl.tab = 'all';
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { "_id": 1 };
        ctrl.state = "";
        ctrl.templateTags = []; 

        ctrl._insert_value = {
            studentId: "2257010049",
            formId: "",
            quantity: 1,
            flow: [],
            play_now: [],
            templateTagData: [],
            fee: "",
            status: "PendingProcessing",
            createdBy: $rootScope.logininfo.data._id,
            feedback: [],
            node: 0
        }

        ctrl._update_value = {}

        ctrl.attachment;
        ctrl.statusOptions = [
            {
                id: 1,
                title: { 'vi-VN': 'Tất cả', 'en-US': 'All' },
            },
            {
                id: 2,
                title: { 'vi-VN': 'Hoàn tất', 'en-US': 'Completed' },
            },
            {
                id: 2,
                title: { 'vi-VN': 'Đang xử lý', 'en-US': 'Pending' },
            },
            {
                id: 2,
                title: { 'vi-VN': 'Đã bác bỏ', 'en-US': 'Rejected' },
            }
        ]

        ctrl._filterFromDate = "";
        ctrl._filterToDate = "";

        ctrl.feeOptions = [
            {
                id: 1,
                title: { 'vi-VN': 'Có phí', 'en-US': 'Surcharge' },
            },
            {
                id: 2,
                title: { 'vi-VN': 'Không phí', 'en-US': 'No fees' },
            }
        ]

        ctrl._searchByKeyToFilterData = "";
        ctrl.AdministrativeProceduresType_Config = {
            master_key: "administrative_procedures_type",
            load_details_column: "value"
        };
        ctrl.Students_Config = {
            master_key: "students",
            load_details_column: "value"
        };
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        ctrl.refreshData();
    }

    //search
    ctrl.chooseNumberItem = function (val) {

    }

    function loadAdministrativeProcedures() {
        var dfd = $q.defer();
        ctrl.administrativeProcedures = [];
        administrative_procedures_service.load({ top: ctrl.numOfItemPerPage, offset: ctrl.offset, sort: ctrl.sort }).then(function (res) {
            ctrl.administrativeProcedures = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadWorkflows() {
        var dfd = $q.defer();
        ctrl.workflows = [];
        administrative_procedures_service.loadWorkflows(top = 100).then(function (res) {
            ctrl.workflows = res.data.map(function (item) {
                item.value = item._id;
                return item;
            });
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "load", loadAdministrativeProcedures);
    }

    ctrl.loadWorkflows = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "loadWorkflows", loadWorkflows);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        $q.all(dfdAr);
    }

    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function count_service() {
        var dfd = $q.defer();
        administrative_procedures_service.count().then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "count", count_service);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(ctrl.loadWorkflows());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    // insert
    ctrl.prepareInsert = function (val) {
        ctrl.state = 'insert';
    }

    // update
    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        ctrl.state = 'update';
        ctrl.tagInputUpdate = [];
        let templateTagData =  Object.entries(ctrl._update_value.templateTagData).map(([key, value]) => {
            ctrl.tagInputUpdate[key] = value;
        });

    }

    ctrl.chooseWorkflow = function (params = null) {
        if (params != null) {
           if(ctrl.state == 'insert') {
            ctrl._insert_value.formId = params._id;
            ctrl._insert_value.flow = params.flows;
            ctrl._insert_value.fee = String(params.fee.amount) || "0";
           }
            if (params.templateFile) {
                ctrl.attachment = params.templateFile;
            }
            if (params.templateTags.length > 0) {
                ctrl.templateTags = params.templateTags;
            } else ctrl.templateTags = [];
        }
    }

    function insert_service() {
        var dfd = $q.defer();
        administrative_procedures_service.insert(ctrl._insert_value).then(function (res) {
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
            ctrl._insert_value = {
                studentId: "2257010049",
                formId: "",
                quantity: 1,
                flow: [],
                play_now: [],
                templateTagData: [],
                fee: "",
                status: "PendingProcessing",
                createdBy: $rootScope.logininfo.data._id,
                feedback: [],
                node: 0
            }
            ctrl.load();
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function update_service() {
        var dfd = $q.defer();
        administrative_procedures_service.update(ctrl._update_value).then(function (res) {
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
            ctrl.load();
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        ctrl.templateTags.map(function (item) {
            ctrl._insert_value.templateTagData[item.key] = ctrl.tagInputInsert[item.key];
        });
        ctrl._insert_value.templateTagData = Object.assign({}, ctrl._insert_value.templateTagData);
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "insert", insert_service);
    }

    ctrl.update = function () {
        ctrl.templateTags.map(function (item) {
            ctrl._update_value.templateTagData[item.key] = ctrl.tagInputUpdate[item.key];
        });
        ctrl._update_value.templateTagData = Object.assign({}, ctrl._update_value.templateTagData);
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "update", update_service);
    }
}])
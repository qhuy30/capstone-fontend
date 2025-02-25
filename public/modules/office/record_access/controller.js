myApp.registerCtrl('record_access_controller', ['record_access_service', '$q', '$rootScope', '$filter', function (record_access_service, $q, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "record_access", action: "init" },
        { name: "record_access", action: "load" },
        { name: "record_access", action: "count" },
        { name: "record_access", action: "update" },
        { name: "record_access", action: "cancel" },
    ];
    var ctrl = this;
    var idEditor = "cancelFile_content";
    /** init variable */
    {
        ctrl._ctrlName = "record_access_controller";
        ctrl.tab = "all";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 15;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
        ctrl.record_access = [];
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterStatus = "";
        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };
        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

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

        if (ctrl._filterWFT) {
            obj.document_type = angular.copy(ctrl._filterWFT);
        }

        if (ctrl._filterStatus) {
            obj.status = angular.copy(ctrl._filterStatus);
        }
        return obj;
    }
    

    function load_record_access () {
        var dfd = $q.defer();
        let _filter = generateFilter();
        record_access_service.load(_filter.search,_filter.status, ctrl.tab, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.record_access = res.data;
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "record_access", "load", load_record_access);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        record_access_service.count(_filter.search, _filter.status, ctrl.tab).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "record_access", "count", count_service);
    }


    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        $q.all(dfdAr);
    }

    function init_service() {
        var dfd = $q.defer();
        record_access_service.init().then(function (res) {
            ctrl.WFT = res.data.wft;
            ctrl.WF = res.data.wf;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function init() {
        var dfdAr = [];
        dfdAr.push(init_service());
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    init()
}]);



myApp.registerCtrl('storage_controller', ['storage_service', '$q', '$rootScope', '$filter', function (storage_service, $q, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "storage", action: "init" },
        { name: "storage", action: "load" },
        { name: "storage", action: "count" },
        { name: "storage", action: "update" },
        { name: "storage", action: "cancel" },
    ];
    var ctrl = this;
    var idEditor = "cancelBriefcase_content";
    /** init variable */
    {
        ctrl._ctrlName = "storage_controller";
        ctrl.briefcase = [];
        ctrl.limit = undefined;
        ctrl.top = undefined;
        ctrl._searchByKeyToFilterData = "";
        ctrl.stateStorage = {
            master_key: "storage_state",
            load_details_column: "value"
        };

        ctrl.OutgoingDispatchBook_Config = {
            master_key: "outgoing_dispatch_book",
            load_details_column: "value"
        };

        ctrl.IncommingDispatchBook_Config = {
            master_key: "incomming_dispatch_book",
            load_details_column: "value"
        };

        ctrl.Storage_config = {
            master_key: "storage_name",
            load_details_column: "value"
        };

        ctrl._update_value = {};

        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/storage/views/update_briefcase.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/storage/views/cancel_briefcase.html";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.chooseFromDate = function (val) {
        ctrl._filterFromDate = val ? val.getTime() : undefined;
        ctrl.refreshData()
    }

    ctrl.chooseToDate = function (val) {
        ctrl._filterToDate = val ? val.getTime() : undefined;
        ctrl.refreshData()
    }

    ctrl.pickODT = function(val){
        ctrl._filterODT = val.value;
        ctrl.refreshData()
    }

    ctrl.pickDAB = function(val){
        ctrl._filterDAB = val.value;
        ctrl.refreshData()
    }

    ctrl.pickState = function(val){
        ctrl._filterState = val.value;
        ctrl.refreshData()
    }

    ctrl.prepareUpdate = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "storage", "update");
        ctrl._update_value = angular.copy(value);
    }

    // ctrl.loadDetailsReference = function (params) {
    //     return $q.resolve(params.ids)
    // }

    function generateFilter() {
        var obj = {};

        if(ctrl._filterToDate) {
            obj.toDate = angular.copy(ctrl._filterToDate);
        }

        if(ctrl._filterFromDate) {
            obj.fromDate = angular.copy(ctrl._filterFromDate);
        }

        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterDAB) {
            obj.DAB = angular.copy(ctrl._filterDAB);
        }

        if (ctrl._filterODT) {
            obj.ODT = angular.copy(ctrl._filterODT);
        }

        if (ctrl._filterState && ctrl._filterState !== "All") {
            obj.state = angular.copy(ctrl._filterState);
        }

        return obj;
    }

    ctrl.chooseStorage = function (val) {
        ctrl._update_value.storage_name = val.value;
    }

    function update_service() {
        var dfd = $q.defer();

        // const references = ctrl._update_value.references.map(item => {
        //     return {
        //         id: item.id,
        //         object: item.object,
        //     }
        // });

        storage_service.update(
            ctrl._update_value._id,
            ctrl._update_value.title,
            ctrl._update_value.organ_id,
            ctrl._update_value.file_notation,
            ctrl._update_value.maintenance_time,
            ctrl._update_value.usage_mode,
            ctrl._update_value.language,
            ctrl._update_value.storage_name,
            ctrl._update_value.storage_position,
            ctrl._update_value.year,
            ctrl._update_value.description,
            []
            // references
        ).then(function () {
            $("#modal_BriefCase_Update").modal("hide");
            ctrl.load();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "storage", "update", update_service);
    }

    ctrl.prepareCancel = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "storage", "cancel");
        ctrl._cancel_value = angular.copy(value);
    }

    function cancel_service() {
        var dfd = $q.defer();
        storage_service.cancel(ctrl._cancel_value._id, $("#" + idEditor).summernote('code')).then(function () {
            $("#modal_BriefCase_Cancel").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.cancel = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "storage", "cancel", cancel_service);
    }

    function load_briefcase () {
        var dfd = $q.defer();
        let _filter = generateFilter();
        storage_service.load(ctrl.top, ctrl.limit, _filter.fromDate, _filter.toDate, _filter.DAB, _filter.ODT, _filter.state, _filter.search).then(function (res) {
            ctrl.briefcase = res.data;
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "storage", "load", load_briefcase);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        $q.all(dfdAr);
    }

    // ctrl.searchReference = function (search) {
    //     var dfd = $q.defer();
    //     storage_service.searchReference(search.search)
    //         .then(({ data }) => {
    //             dfd.resolve(data);
    //             dfd = undefined;
    //         }, function (err) {
    //             dfd.reject(err);
    //             err = undefined;
    //         });
    //     return dfd.promise;
    // }

    // ctrl.chooseReference = function (item) {
    //     ctrl._update_value.references = item;
    // }

    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
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



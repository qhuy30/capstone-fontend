myApp.registerCtrl('sending_place_controller', ['sending_place_service', '$q', '$rootScope', function (sending_place_service, $q, $rootScope) {

    /**declare variable */
    const _statusValueSet = [
        { name: "sending_place", action: "load" },
        { name: "sending_place", action: "count" },
        { name: "sending_place", action: "insert" },
        { name: "sending_place", action: "update" },
        { name: "sending_place", action: "delete" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "sending_place_controller";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
        ctrl.sending_place = [];
        ctrl._insert_value = {};
        ctrl._update_value = {};
        ctrl._delete_value = {};

        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/office/sending_place/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/sending_place/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/sending_place/views/delete_modal.html";
    }

    /**function for logic */

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

        return obj;
    }
    /** LOAD */
    function load_service() {
        var dfd = $q.defer();
        ctrl.sending_place = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        sending_place_service.load(_filter.search, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.sending_place = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "sending_place", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        sending_place_service.count(_filter.search).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "sending_place", "count", count_service);
    }

    /** INSERT */
    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "sending_place", "insert");
        ctrl._insert_value = {
            name: '',
            email: '',
            phoneNumber: '',
            address: ''
        };

    }

    function insert_service() {
        var dfd = $q.defer();
        sending_place_service.insert(
            ctrl._insert_value.name,
            ctrl._insert_value.email,
            ctrl._insert_value.phoneNumber,
            ctrl._insert_value.address,
        ).then(function () {
            $("#modal_SP_Insert").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "sending_place", "insert", insert_service);
    }

    /** UPDATE */
    ctrl.prepareUpdate = function (item) {
        ctrl._update_value = angular.copy(item);
        ctrl._update_value.item ={};
        $rootScope.statusValue.generate(ctrl._ctrlName, "sending_place", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        sending_place_service.update(
            ctrl._update_value._id,
            ctrl._update_value.name,
            ctrl._update_value.email,
            ctrl._update_value.phoneNumber,
            ctrl._update_value.address,
        ).then(function () {
            $("#modal_SP_Update").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        $rootScope.statusValue.execute(ctrl._ctrlName, "sending_place", "update", update_service);
    }

    /** DELETE */
    function generate_resetDeleteValue(val) {
        ctrl._delete_value = val;
    }

    ctrl.prepareDelete = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "sending_place", "delete");
        generate_resetDeleteValue(item);
    }

    function delete_service() {
        var dfd = $q.defer();
        sending_place_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_SP_Delete").modal("hide");
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
        $rootScope.statusValue.execute(ctrl._ctrlName, "sending_place", "delete", delete_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }

    function init() {
        var dfdAr = [];
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

    init();
}]);



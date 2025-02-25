myApp.registerCtrl('master_directory_controller', ['master_directory_service', '$q', '$rootScope', function (master_directory_service, $q, $rootScope) {

    /**declare variable */
    const _statusValueSet = [
        { name: "MasterDirectory", action: "getOrderNumber" },
        { name: "MasterDirectory", action: "load" },
        { name: "MasterDirectory", action: "count" },
        { name: "MasterDirectory", action: "insert" },
        { name: "MasterDirectory", action: "update" },
        { name: "MasterDirectory", action: "delete" }
    ];

    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "master_directory_controller";

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.master_directory = [];
        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/management/master_directory/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/management/master_directory/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/management/master_directory/views/update_modal.html";

    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }

    function load_service() {
        var dfd = $q.defer();

        let _filter = generateFilter();
        master_directory_service.load(_filter.search, ctrl.numOfItemPerPage, ctrl.offset).then(function (res) {
            ctrl.master_directory = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        master_directory_service.count(_filter.search).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "count", count_service);
    }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    ctrl.refreshData = function () {
        resetPaginationInfo();
        ctrl.load();
        ctrl.count();
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


    //INSERT MASTER DIRECTORY

    function getOrderNumber_service() {
        let dfd = $q.defer();
        master_directory_service.getOrderNumber().then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "getOrderNumber", getOrderNumber_service);
    }

    function generate_InsertValue() {
        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                "vi-VN": "",
                "en-US": ""
            },
            key: "",
            extend: ""
        };
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "insert");
    }

    function insert_service() {
        var dfd = $q.defer();
        master_directory_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            ctrl._insert_value.key,
            ctrl._insert_value.extend && ctrl._insert_value.extend !== "" ? JSON.parse(ctrl._insert_value.extend) : []).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "insert");
                $("#modal_MasterDirectory_Insert").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "insert", insert_service);
    }

    //UPDATE MASTER DIRECTORY

    ctrl.prepareUpdate = function (item) {
        ctrl._update_value = angular.copy(item);
        ctrl._update_value.extend = JSON.stringify(ctrl._update_value.extend);
        $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        master_directory_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            ctrl._update_value.key,
            ctrl._update_value.extend &&  ctrl._update_value.extend !== "" ? JSON.parse(ctrl._update_value.extend) : []).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "update");
                $("#modal_MasterDirectory_Update").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "update", update_service);
    }

    //DELETE MASTER DIRECTORY

    ctrl.prepareDelete = function (item) {
        ctrl._delete_value = angular.copy(item);
        $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        master_directory_service.delete(
            ctrl._delete_value.key).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MasterDirectory", "delete");
                $("#modal_MasterDirectory_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MasterDirectory", "delete", delete_service);
    }
}]);
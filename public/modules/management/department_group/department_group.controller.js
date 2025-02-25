myApp.registerCtrl('department_group_controller', ['department_group_service', '$q', '$rootScope','$timeout', function (department_group_service, $q, $rootScope,$timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "DepartmentGroup", action: "load" },
        { name: "DepartmentGroup", action: "count" },
        { name: "DepartmentGroup", action: "insert" },
        { name: "DepartmentGroup", action: "update" },
        { name: "DepartmentGroup", action: "delete" },
        { name: "DepartmentGroup", action: "loadDetails" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "department_group_controller";
        ctrl.groups = [];
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "title", value: false, query: { title: 1 } };
        ctrl._notyetInit = true;
        ctrl._checkActive = false;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";
        ctrl.Role_Config = {
            master_key: "role",
            load_details_column: "value"
        };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlFilterModal = FrontendDomain + "/modules/management/department_group/views/departmentgroup_filter_modal.html";
        ctrl._urlInsertModal = FrontendDomain + "/modules/management/department_group/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/management/department_group/views/update_modal.html";
        // ctrl._urlDeleteModal = FrontendDomain + "/modules/management/department_group/views/delete_modal.html";

        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        dfdAr.push(ctrl.loadDepartmentGroup());
        // dfdAr.push(ctrl.countGroup());
        $q.all(dfdAr);
    }

    function generateFilterLoadDepartmentGroup() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isActive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }

    ctrl.changeCheckActive = function (val) {
        ctrl._checkActive = val;
        ctrl.loadDepartmentGroup();
    }

    ctrl.changeActiveFilterData = function (val) {
        ctrl._activeFilterData = val;
        if (ctrl._checkActive === true) {
            ctrl.refreshData();
        }
    }

    function loadDepartmentGroup_service() {
        var dfd = $q.defer();
        ctrl.groups = [];
        var filter = generateFilterLoadDepartmentGroup();
        department_group_service.loadDepartmentGroup(filter.search, filter.isActive, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(function (res) {
            ctrl.groups = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartmentGroup = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DepartmentGroup", "load", loadDepartmentGroup_service);
    }

    ctrl.chooseDepartment_update = function (val) {
        ctrl._update_value.departments = angular.copy(val);
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "DepartmentGroup", "insert");
        ctrl._insert_value = {
            title: "",
            isActive: true
        }
    }

    function insert_service() {
        var dfd = $q.defer();
        department_group_service.insertDepartmentGroup(ctrl._insert_value.title, ctrl._insert_value.isActive).then(function () {
            ctrl.refreshData();
            $("#modal_DepartmentGroup_Insert").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DepartmentGroup", "insert", insert_service);
    }

    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        ctrl._update_value.departments = val.departments || [];
        $rootScope.statusValue.generate(ctrl._ctrlName, "DepartmentGroup", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        department_group_service.updateDepartmentGroup(ctrl._update_value._id, ctrl._update_value.title, ctrl._update_value.isActive, ctrl._update_value.departments).then(function () {
            ctrl.refreshData();
            $("#modal_DepartmentGroup_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DepartmentGroup", "update", update_service);
    }

    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.loadDepartmentGroup());
        // dfdAr.push(ctrl.countGroup());
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

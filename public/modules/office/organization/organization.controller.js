

myApp.registerCtrl('organization_controller', ['organization_service', '$q', '$rootScope', function (organization_service, $q, $rootScope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Organization", action: "load" },
        { name: "Organization", action: "insert" },
        { name: "Organization", action: "update" },
        { name: "Organization", action: "delete" }
    ];
    var ctrl = this;
    var currentItem = {};
    /** init variable */
    {
        ctrl._ctrlName = "organization_controller";

        ctrl.organizations = [];
        ctrl.expandAr = [];
        ctrl.listUser = [];
        ctrl._notyetInit = true;

        ctrl.competence_config = {
            master_key: "competence",
            load_details_column: "value",
        };
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/office/organization/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/organization/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/organization/views/delete_modal.html";
        ctrl._urlLoadUserByDepartment = FrontendDomain + "/modules/office/organization/views/list_user_modal.html";
    }


    /**interact with view */

    function load() {
        if (currentItem.id) {
            organization_service.load(currentItem.level + 1, currentItem.id).then(function (res) {
                // ctrl.organizations = assignChild(ctrl.organizations, res.data).data;
                currentItem.childs = res.data;
                if(currentItem.childs.length==0){
                    currentItem.canExpand = false;
                }
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        } else {
            organization_service.load(1).then(function (res) {
                ctrl.organizations = res.data;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        }

    }


    ctrl.expandDepartment = function (item) {
        currentItem = item;
        if (currentItem.open) {
            currentItem.open = false;
            currentItem.childs =[];
        } else {
            currentItem.open = true;
            load();
        }
    }

    ctrl.expandFunc = function (params) {
        if (params.action) {
            ctrl.expandAr.push(params.value);
        } else {
            var temp = [];
            for (var i in ctrl.expandAr) {
                if (ctrl.expandAr[i] !== params.value) {
                    temp.push(ctrl.expandAr[i]);
                }
            }
            ctrl.expandAr[i] = angular.copy(temp);
        }
    }




    /* Init and load necessary resource to the module. */

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(load());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    /** INSERT DEPARTMENT*/
    ctrl.chooseStatus = function (val) {
        ctrl._insert_value.status = angular.copy(val);
    }
    ctrl.chooseType = function (val) {
        ctrl._insert_value.type = angular.copy(val);
    }

    ctrl.chooseIcon = function (val) {
        ctrl._insert_value.icon = val.value;
    }

    function generateOrdernumber() {
        var max = 0;
        if (currentItem) {
            for (var i in ctrl.organizations) {
                if (ctrl.organizations[i].parent
                    && ctrl.organizations[i].parent[ctrl.organizations[i].parent.length - 1] === currentItem.id
                    && ctrl.organizations[i].ordernumber > max) {
                    max = ctrl.organizations[i].ordernumber;
                }
            }
        } else {
            for (var i in ctrl.organizations) {
                if (ctrl.organizations[i].ordernumber > max) {
                    max = ctrl.organizations[i].ordernumber;
                }
            }
        }

        max++;
        return max;
    }

    function generateParent() {
        if (currentItem && currentItem.id) {        
            var parent = angular.copy(currentItem.parent);
            parent.push(currentItem.id);

            return parent;
        } else {
            return [];
        }

    }

    function generateLevel() {
        return currentItem.level ? currentItem.level + 1 : 1;
    }

    function generate_resetInsertValue() {
        ctrl._insert_value = {
            ordernumber: generateOrdernumber(),
            title: {
                "vi-VN": "",
                "en-US": ""
            },
            abbreviation: "",
            icon: "",
            parent: generateParent(),
            level: generateLevel(), //de chi ra cap do trong cay phong ban
            isactive: true,
            leader:"",
            departmentLeader:"",
            type:"department"
        };
    }

    ctrl.pickLeader_insert = function(val){
        ctrl._insert_value.leader = angular.copy(val);
    }

    ctrl.pickDepartmentLeader_insert = function(val){
        ctrl._insert_value.departmentLeader = angular.copy(val);
    }

    ctrl.prepareInsert = function (item) {
        currentItem = item;
        $rootScope.statusValue.generate(ctrl._ctrlName, "Organization", "insert");
        generate_resetInsertValue();
    }

    function insert_service() {
        var dfd = $q.defer();
        organization_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            ctrl._insert_value.abbreviation,
            ctrl._insert_value.icon,
            ctrl._insert_value.parent,
            ctrl._insert_value.level,
            ctrl._insert_value.isactive,
            ctrl._insert_value.leader,
            ctrl._insert_value.departmentLeader,
            ctrl._insert_value.type
        ).then(function () {
            $("#modal_Organization_Insert").modal("hide");
            currentItem.canExpand = true;
            load();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        $rootScope.statusValue.execute(ctrl._ctrlName, "Organization", "insert", insert_service);
    }

    /**UPDATE DEPARTMENT*/
    ctrl.chooseStatus_update = function (val) {
        ctrl._update_value.status = angular.copy(val);
    }
    ctrl.chooseType_udpate = function (val) {
        ctrl._update_value.type = angular.copy(val);
    }

    ctrl.chooseIcon_udpate = function (val) {
        ctrl._update_value.icon = val.value;
    }

    function generate_resetUpdateValue(val) {
        ctrl._update_value = val;

    }

    ctrl.pickLeader_update = function(val){
        ctrl._update_value.leader = angular.copy(val);
    }

    ctrl.pickDepartmentLeader_update = function(val){
        ctrl._update_value.departmentLeader = angular.copy(val);
    }

    ctrl.prepareUpdate = function (item) {
        currentItem = {};
        $rootScope.statusValue.generate(ctrl._ctrlName, "Organization", "update");
        generate_resetUpdateValue(item);
    }

    function update_service() {
        var dfd = $q.defer();
        organization_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            ctrl._update_value.abbreviation,
            ctrl._update_value.icon,
            ctrl._update_value.parent,
            ctrl._update_value.level,
            ctrl._update_value.isactive,
            ctrl._update_value.leader,
            ctrl._update_value.departmentLeader,
            ctrl._update_value.type
        ).then(function () {
            $("#modal_Organization_Update").modal("hide");

            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        $rootScope.statusValue.execute(ctrl._ctrlName, "Organization", "update", update_service);
    }

    /**DELETE DEPARTMENT*/

    function generate_resetDeleteValue(val) {
        ctrl._delete_value = val;
    }

    ctrl.prepareDelete = function (parent,item) {
        currentItem = parent;
        $rootScope.statusValue.generate(ctrl._ctrlName, "Organization", "delete");
        generate_resetDeleteValue(item);
    }

    function delete_service() {
        var dfd = $q.defer();
        organization_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_Organization_Delete").modal("hide");
            load();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        $rootScope.statusValue.execute(ctrl._ctrlName, "Organization", "delete", delete_service);
    }

    /**LOAD USER FOR DEPARTMENT */
    ctrl.loadUserByDepartment = function (params) {
        var dfd = $q.defer();
        organization_service.loadUser(params.id).then(function (res) {
            ctrl.listUser = res.data;
            dfd.resolve(data);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

}]);



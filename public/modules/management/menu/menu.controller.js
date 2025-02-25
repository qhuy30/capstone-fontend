

myApp.registerCtrl('menu_controller', ['menu_service', '$q', '$rootScope', function (menu_service, $q, $rootScope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Menu", action: "load" },
        { name: "Menu", action: "getOrderNumberForInsert" },
        { name: "Menu", action: "insertAsComponent" },
        { name: "Menu", action: "insertAsUrl" },
        { name: "Menu", action: "updateAsComponent" },
        { name: "Menu", action: "updateAsUrl" },
        { name: "Menu", action: "delete" },
        { name: "MenuGroup", action: "load" },
        { name: "MenuGroup", action: "getOrderNumberForInsert" },
        { name: "MenuGroup", action: "insert" },
        { name: "MenuGroup", action: "update" },
        { name: "MenuGroup", action: "delete" }
    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "menu_controller";
        ctrl.sortMenuGroup = { name: "ordernumber", value: false, query: { ordernumber: 1 } };
        ctrl.sortMenu = { name: "ordernumber", value: false, query: { ordernumber: 1 } };
        ctrl.FrontendMaps = [];
        ctrl.MenuGroups = [];
        ctrl.menus = [];
        ctrl._notyetInit = true;
        ctrl._checkActive = false;
        ctrl._activeFilterMenuData = true;
        ctrl._searchByKeyToFilterMenuData = "";


        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlMenuFilterModal = FrontendDomain + "/modules/management/menu/views/menufilter_modal.html";
        ctrl._urlInsertMenuGroupModal = FrontendDomain + "/modules/management/menu/views/insertmenugroup_modal.html";
        ctrl._urlInsertMenuModal = FrontendDomain + "/modules/management/menu/views/insertmenu_modal.html";
        ctrl._urlUpdateMenuGroupModal = FrontendDomain + "/modules/management/menu/views/updatemenugroup_modal.html";
        ctrl._urlUpdateMenuModal = FrontendDomain + "/modules/management/menu/views/updatemenu_modal.html";
        ctrl._urlDeleteMenuGroupModal = FrontendDomain + "/modules/management/menu/views/deletemenugroup_modal.html";
        ctrl._urlDeleteMenuModal = FrontendDomain + "/modules/management/menu/views/deletemenu_modal.html";
    }

    /**function for logic */

    function generateFilterLoadMenu() {
        var obj = {};
        obj.group = angular.copy(ctrl._currentMenuGroup.key);
        if (ctrl._checkActive === true) {
            obj.active = angular.copy(ctrl._activeFilterMenuData);
        }
        if (ctrl._searchByKeyToFilterMenuData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterMenuData);
        }
        return obj;
    }

    /**interact with view */
    ctrl.changeCheckActive = function (val) {
        if (ctrl._checkActive != val) {
            ctrl._checkActive = val;
            ctrl.loadMenu();
        }
    }


    ctrl.changeActiveFilterMenuData = function (val) {
        ctrl._activeFilterMenuData = angular.copy(val);
        ctrl.loadMenu();
    }

    ctrl.chooseCurrentMenuGroup = function (val) {
        ctrl._currentMenuGroup = val;
        ctrl.loadMenu();
    }







    /* Init and load necessary resource to the module. */
    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(loadFrontendMap());
        // dfdAr.push(loadFrontendMap_Tenant());
        dfdAr.push(loadMenuGroup());

        $q.all(dfdAr).then(
            function () {
                if (ctrl.MenuGroups[0]) {
                    ctrl._currentMenuGroup = ctrl.MenuGroups[0];
                    ctrl.loadMenu().then(function () {
                        ctrl._notyetInit = false;
                    }, function () {

                    });
                }
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    function loadFrontendMap() {
        var dfd = $q.defer();
        menu_service.loadFrontendMap().then(function (res) {
            ctrl.FrontendMaps = res.data.data.filter(e => e.canStick===true);
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    // function loadFrontendMap_Tenant() {
    //     var dfd = $q.defer();
    //     menu_service.loadFrontendMap_Tenant().then(function (res) {
    //         ctrl.FrontendMaps.employee = res.data.data;

    //         dfd.resolve(true);
    //         res = undefined;
    //         dfd = undefined;
    //     }, function (err) {
    //         dfd.reject(err);
    //         err = undefined;
    //     });
    //     return dfd.promise;
    // }

    function loadMenuGroup_service() {
        var dfd = $q.defer();
        ctrl.MenuGroups = [];
        ctrl.menus = [];
        menu_service.loadMenuGroup().then(function (res) {
            ctrl.MenuGroups = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;

        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    function loadMenuGroup() {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MenuGroup", "load", loadMenuGroup_service);
    }
    function loadMenu_service() {
        var dfd = $q.defer();
        var _filterLoadMenu = generateFilterLoadMenu();
        ctrl.menus = [];
        menu_service.loadMenu(ctrl._currentMenuGroup._id, _filterLoadMenu.search, _filterLoadMenu.active).then(function (res) {
            ctrl.menus = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.loadMenu = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "load", loadMenu_service);
    }



    /** Insert a menu group */

    function generate_resetInsertMenuGroupValue() {
        ctrl._insertMenuGroup_value = {
            ordernumber: 0,
            title: {
                "vi-VN": "",
                "en-US": ""
            },
            icon: "",
            isactive: true
        };
    }



    function getMenuGroupOrderNumber_service() {
        var dfd = $q.defer();
        menu_service.getOrderNumberMenuGroup().then(function (data) {
            ctrl._insertMenuGroup_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
            data = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(false);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }
    ctrl.getMenuGroupOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MenuGroup", "getOrderNumberForInsert", getMenuGroupOrderNumber_service);
    }
    ctrl.prepareInsertMenuGroup = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MenuGroup", "getOrderNumberForInsert");
        generate_resetInsertMenuGroupValue();
        ctrl.getMenuGroupOrderNumber();
    }

    insertMenuGroup_service = function () {
        var dfd = $q.defer();
        menu_service.insertMenuGroup(
            ctrl._insertMenuGroup_value.ordernumber,
            ctrl._insertMenuGroup_value.title,
            ctrl._insertMenuGroup_value.isactive
            , ctrl._insertMenuGroup_value.icon).then(function () {
                dfd.resolve(true);
                $("#modal_menugroup_insert").modal('hide');
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.insertMenuGroup_func = function () {
        var dfd = $q.defer();
        $rootScope.statusValue.execute(ctrl._ctrlName, "MenuGroup", "insert", insertMenuGroup_service).then(function () {
            loadMenuGroup().then(function () {
                // $("#modal_menugroup_insert").modal('hide');
                for (var i in ctrl.MenuGroups) {
                    ctrl.MenuGroups[i].key == ctrl._insertMenuGroup_value.key;
                    ctrl.chooseCurrentMenuGroup(ctrl.MenuGroups[i]);
                    break;
                }
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }


    /** Insert a menu */
    ctrl.changeInsertMenuType = function (val) {
        ctrl._insertMenu_value.type = angular.copy(val);
    }

    ctrl.chooseInsertMenuKey = function (val) {
        ctrl._insertMenu_value.key = angular.copy(val);
    }

    ctrl.chooseIncon_insert = function(val){
        ctrl._insertMenuGroup_value.icon = val.value;
    }

    function generate_resetInsertMenuValue() {

        ctrl._insertMenu_value = {
            ordernumber: 0,
            key: ctrl.FrontendMaps[0],
            url: "",
            type: "component",
            isactive: true,
            title: {
                "vi-VN": "",
                "en-US": ""
            }
        };
    }

    function getMenuOrderNumber_service() {
        var dfd = $q.defer();
        menu_service.getOrderNumberMenu(ctrl._currentMenuGroup._id).then(function (data) {
            ctrl._insertMenu_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
            data = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(false);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    ctrl.getMenuOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "getOrderNumberForInsert", getMenuOrderNumber_service);
    }
    ctrl.prepareInsertMenu = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsComponent");
        $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsUrl");
        generate_resetInsertMenuValue();
        ctrl.getMenuOrderNumber();
    }
    function insertMenuAsComponent_service() {
        var dfd = $q.defer();
        menu_service.insertMenuAsComponent(
            ctrl._insertMenu_value.ordernumber,
            ctrl._currentMenuGroup._id,
            ctrl._insertMenu_value.title,
            ctrl._insertMenu_value.key.key,
            ctrl._insertMenu_value.isactive).then(function () {
                ctrl.loadMenu();
                $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsComponent");
                $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsUrl");
                $("#modal_menu_insert").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }
    ctrl.insertMenuAsComponent_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "insertAsComponent", insertMenuAsComponent_service);
    }

    function insertMenuAsUrl_service() {
        var dfd = $q.defer();
        menu_service.insertMenuAsUrl(ctrl._currentMenuGroup._id, ctrl._insertMenu_value.ordernumber, ctrl._insertMenu_value.isactive, ctrl._insertMenu_value.url, ctrl._insertMenu_value.title).then(function () {
            ctrl.loadMenu();
            $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsComponent");
            $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "insertAsUrl");
            $("#modal_menu_insert").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.insertMenuAsUrl_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "insertAsUrl", insertMenuAsUrl_service);
    }


    /**Update menu group */

    function generate_resetUpdateMenuGroupValue(val) {
        ctrl._updateMenuGroup_value = angular.copy(val);
    }

    ctrl.prepareUpdateMenuGroup = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MenuGroup", "update");
        generate_resetUpdateMenuGroupValue(val);
    }

    ctrl.chooseIncon_update = function(val){
        ctrl._updateMenuGroup_value.icon = val.value;
    }

    function updateMenuGroup_service() {
        var dfd = $q.defer();
        menu_service.updateMenuGroup(ctrl._updateMenuGroup_value._id,
            ctrl._updateMenuGroup_value.ordernumber,
            ctrl._updateMenuGroup_value.title,
            ctrl._updateMenuGroup_value.isactive,
            ctrl._updateMenuGroup_value.icon).then(function () {
                $("#modal_menugroup_update").modal('hide');
                loadMenuGroup().then(function () {
                    for (var i in ctrl.MenuGroups) {
                        if (ctrl.MenuGroups[i]._id == ctrl._updateMenuGroup_value._id) {
                            ctrl.chooseCurrentMenuGroup(ctrl.MenuGroups[i]);
                            break;
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }
    ctrl.updateMenuGroup_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MenuGroup", "update", updateMenuGroup_service);
    }

    /**Update menu */
    ctrl.changeUpdateMenuType = function (val) {
        ctrl._updateMenu_value.type = angular.copy(val);
    }
    ctrl.chooseUpdateMenuKey = function (val) {
        ctrl._updateMenu_value.key = angular.copy(val);
    }

    function generate_resetUpdateMenuValue(val) {
        ctrl._updateMenu_value = {
            ordernumber: val.ordernumber,
            url: val.url,
            type: val.type,
            isactive: val.isactive,
            id: val.id,
            title: val.title
        };
        
        for (var i in ctrl.FrontendMaps) {
            if (val.key == ctrl.FrontendMaps[i].key) {
                ctrl._updateMenu_value.key = ctrl.FrontendMaps[i];
                console.log(ctrl._updateMenu_value.key);
                break;
            }
        }
    }

    ctrl.prepareUpdateMenu = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MenuGroup", "updateAsComponent");
        $rootScope.statusValue.generate(ctrl._ctrlName, "MenuGroup", "updateAsUrl");
        generate_resetUpdateMenuValue(val);
    }

    function updateMenuAsComponent_service() {
        var dfd = $q.defer();
        menu_service.updateMenuAsComponent(
            ctrl._currentMenuGroup._id,
            ctrl._updateMenu_value.title,
            ctrl._updateMenu_value.key.key,
            ctrl._updateMenu_value.ordernumber,
            ctrl._updateMenu_value.isactive,
            ctrl._updateMenu_value.id
        ).then(function () {
            ctrl.loadMenu();
            $("#modal_menu_update").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.updateMenuAsComponent_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "updateAsComponent", updateMenuAsComponent_service);
    }

    function updateMenuAsUrl_service() {
        var dfd = $q.defer();
        menu_service.updateMenuAsUrl(
            ctrl._currentMenuGroup._id,
            ctrl._updateMenu_value.url,
            ctrl._updateMenu_value.ordernumber,
            ctrl._updateMenu_value.isactive,
            ctrl._updateMenu_value.id,
            ctrl._updateMenu_value.title
        ).then(function () {
            ctrl.loadMenu();
            $("#modal_menu_update").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            console.log(err);
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.updateMenuAsUrl_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "updateAsUrl", updateMenuAsUrl_service);
    }

    /**Delete menu group */
    function generate_resetDeleteMenuGroupValue(val) {
        ctrl._deleteMenuGroup_value = angular.copy(val);
    }

    ctrl.prepareDeleteMenuGroup = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MenuGroup", "delete");
        generate_resetDeleteMenuGroupValue(val);
    }

    function deleteMenuGroup_service() {
        var dfd = $q.defer();
        menu_service.deleteMenuGroup(ctrl._deleteMenuGroup_value._id).then(function () {
            $("#modal_menugroup_delete").modal('hide');
            loadMenuGroup().then(function () {
                if (ctrl.MenuGroups[0]) {
                    ctrl.chooseCurrentMenuGroup(ctrl.MenuGroups[0]);
                } else {
                    ctrl.menus = [];
                }
            }, function (err) {
                console.log(err);
            });
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.deleteMenuGroup_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MenuGroup", "delete", deleteMenuGroup_service);
    }

    /**Delete menu */
    function generate_resetDeleteMenuValue(val) {
        ctrl._deleteMenu_value = angular.copy(val);
    }

    ctrl.prepareDeleteMenu = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Menu", "delete");
        generate_resetDeleteMenuValue(val);
    }
    function deleteMenu_service() {
        var dfd = $q.defer();
        menu_service.deleteMenu(ctrl._currentMenuGroup._id, ctrl._deleteMenu_value.id).then(function () {
            $("#modal_menu_delete").modal('hide');
            ctrl.loadMenu();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.deleteMenu_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Menu", "delete", deleteMenu_service);
    }
}]);



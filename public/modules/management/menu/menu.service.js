myApp.registerFtr('menu_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.loadFrontendMap = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/frontendmap/all",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.loadFrontendMap_Tenant = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/frontendmap/all",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadMenuGroup = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menugroup/all",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadMenu = function (id, search, active) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/load",
            method: "POST",
            data: JSON.stringify({ id, search, active }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.insertMenuGroup = function ( ordernumber, title,isactive,icon) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menugroup/insert",
            method: "POST",
            data: JSON.stringify({  ordernumber, title,isactive,icon }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.updateMenuGroup = function (id, ordernumber, title, isactive,icon) {

        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menugroup/update",
            method: "POST",
            data: JSON.stringify({ id, ordernumber, title, isactive,icon }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumberMenu = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/ordernumber",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumberMenuGroup = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menugroup/ordernumber",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertMenuAsComponent = function (ordernumber, id,title, keyofmenu, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/insertascomponent",
            method: "POST",
            data: JSON.stringify({  ordernumber, id,title, keyofmenu, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertMenuAsUrl = function (id, ordernumber, isactive, url,title) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/insertasurl",
            method: "POST",
            data: JSON.stringify({ id, ordernumber, isactive, url,title }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.updateMenuAsComponent = function (id,title, keyofmenu, ordernumber, isactive, idofmenu, type) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/updateascomponent",
            method: "POST",
            data: JSON.stringify({ id,title, ordernumber, isactive, keyofmenu, idofmenu, type }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.updateMenuAsUrl = function (id, url, ordernumber, isactive, idofmenu,title) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/updateasurl",
            method: "POST",
            data: JSON.stringify({ id, ordernumber, isactive, url, idofmenu,title }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.deleteMenuGroup = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menugroup/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.deleteMenu = function (id,idofmenu) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/menu/delete",
            method: "POST",
            data: JSON.stringify({ id,idofmenu}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    return obj;
}]);
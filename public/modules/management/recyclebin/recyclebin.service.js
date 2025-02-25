myApp.registerFtr('recyclebin_service', ['fRoot', function (fRoot) {
    var obj = {};


    obj.load = function (search, isactive, offset, top, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/recyclebin/load",
            method: "POST",
            data: JSON.stringify({ search, isactive, offset, top, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/recyclebin/loaddetails",
            method: "POST",
            data: JSON.stringify({id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/recyclebin/count",
            method: "POST",
            data: JSON.stringify({ search, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(idar){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/recyclebin/delete",
            method: "POST",
            data: JSON.stringify({idar }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.restore = function(data){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/recyclebin/restore",
            method: "POST",
            data: JSON.stringify({data }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    return obj;
}]);
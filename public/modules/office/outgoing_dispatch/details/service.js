
myApp.registerFtr('odb_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetail = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadDetail",
            method: "POST",
            data: JSON.stringify({id, code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
myApp.registerFtr('sending_place_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/sending-place/load",
            method: "POST",
            data: JSON.stringify({ search,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/sending-place/count",
            method: "POST",
            data: JSON.stringify({ search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function (name, email, phoneNumber, address) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/sending-place/insert",
            method: "POST",
            data: JSON.stringify({ name, email, phoneNumber, address }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id, name, email, phoneNumber, address) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/sending-place/update",
            method: "POST",
            data: JSON.stringify({ id, name, email, phoneNumber, address }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/sending-place/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
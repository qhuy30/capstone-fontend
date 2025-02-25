myApp.registerFtr('master_directory_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(search,top,offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/load",
            method: "POST",
            data: JSON.stringify({ search,top,offset}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function(search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/count",
            method: "POST",
            data: JSON.stringify({ search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumber = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/get_ordernumber",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(ordernumber,title,key,extend){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/insert",
            method: "POST",
            data: JSON.stringify({ordernumber,title,key,extend}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(id,ordernumber,title,key,extend){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/update",
            method: "POST",
            data: JSON.stringify({id,ordernumber,title,key,extend}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/delete",
            method: "POST",
            data: JSON.stringify({key}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
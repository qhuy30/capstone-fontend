myApp.registerFtr('directory_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadDetails_MasterDirectory = function(key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ key}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadMasterDirectory = function(search,top,offset){
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

    obj.countMasterDirectory = function(search){
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


    obj.load = function(search,master_key,top,offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ search,master_key,top,offset}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function(search,master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/count",
            method: "POST",
            data: JSON.stringify({ search,master_key}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumber = function(master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/get_ordernumber",
            method: "POST",
            data: JSON.stringify({master_key}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(ordernumber,title,value,item,master_key,isactive){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/insert",
            method: "POST",
            data: JSON.stringify({ordernumber,title,value,item,master_key,isactive}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(id,ordernumber,title,value,item,isactive){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/update",
            method: "POST",
            data: JSON.stringify({id,ordernumber,title,value,item,isactive}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/delete",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
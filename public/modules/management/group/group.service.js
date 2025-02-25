myApp.registerFtr('group_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadProject= function(sort,top,offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/load",
            method: "POST",
            data: JSON.stringify({sort,top,offset}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countProject= function(search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/count",
            method: "POST",
            data: JSON.stringify({search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadProject_details_m= function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/load_details_m",
            method: "POST",
            data: JSON.stringify({ _ids: id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment = function(level,id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/load",
            method: "POST",
            data: JSON.stringify({ level,id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.loadDepartment_details_multi = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails_m",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.loadGroup = function (search,isactive,offset,top,sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/load",
            method: "POST",
            data: JSON.stringify({ search,isactive,offset,top,sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    
    obj.countGroup = function (search,isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/count",
            method: "POST",
            data: JSON.stringify({ search,isactive}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.insert = function (title, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/insert",
            method: "POST",
            data: JSON.stringify({ title,isactive}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.update = function (id, title, isactive,user,role,competence) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/update",
            method: "POST",
            data: JSON.stringify({ id, title, isactive,user,role,competence }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete= function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.pushRule = function (id,rule) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/pushrule",
            method: "POST",
            data: JSON.stringify({ id, rule }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.removeRule = function (id,rule) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/group/removerule",
            method: "POST",
            data: JSON.stringify({ id, rule }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
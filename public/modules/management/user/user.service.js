myApp.registerFtr('user_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadProject= function(search,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/load",
            method: "POST",
            data: JSON.stringify({search,top,offset,sort}),
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



    obj.loadUser = function (search, isactive, offset, top, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load",
            method: "POST",
            data: JSON.stringify({ search, isactive, offset, top, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails = function (account) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/loaddetails",
            method: "POST",
            data: JSON.stringify({ account }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.countUser = function (search, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/count",
            method: "POST",
            data: JSON.stringify({ search, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.insert = function (title, username, password,language,isactive,department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/register",
            method: "POST",
            data: JSON.stringify({ title,account: username, password,language,isactive,department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id, title,isactive,role) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/update",
            method: "POST",
            data: JSON.stringify({ id, title, isactive,role }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reset_password = function (account) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/reset_password",
            method: "POST",
            data: JSON.stringify({ account}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reset_permission = function (account) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/reset_permission",
            method: "POST",
            data: JSON.stringify({ account}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.assignUser = function (id,account) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/resumes/assignuser",
            method: "POST",
            data: JSON.stringify({ id, account}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushRule = function (id, rule) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/pushrule",
            method: "POST",
            data: JSON.stringify({ id, rule }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.removeRule = function (id, rule) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/removerule",
            method: "POST",
            data: JSON.stringify({ id, rule }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_import_user_template = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_import_user_template",
            method: "GET",
            headers: {},
            responseType: 'blob'
        });
    }


    return obj;
}]);
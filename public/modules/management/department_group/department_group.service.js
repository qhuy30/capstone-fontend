myApp.registerFtr('department_group_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadDepartmentGroup = function (search,isActive,offset,top,sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/group/load",
            method: "POST",
            data: JSON.stringify({ search,isActive,offset,top,sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertDepartmentGroup = function (title, isActive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/group/insert",
            method: "POST",
            data: JSON.stringify({ title, isActive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.updateDepartmentGroup = function (id, title, isActive, departments) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/group/update",
            method: "POST",
            data: JSON.stringify({ id, title, isActive, departments }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

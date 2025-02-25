myApp.registerFtr('administrative_procedures_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load = function(body){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/load",
            method: "POST",
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/count",
            method: "POST",
            data: JSON.stringify(),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadWorkflows = function(top){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/workflow-form/load",
            method: "POST",
            data: JSON.stringify({top}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(data){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/insert",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(data){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/update",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    return obj;
}])
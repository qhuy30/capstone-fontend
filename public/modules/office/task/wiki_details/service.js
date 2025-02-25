
myApp.registerFtr('project_wiki_details_service', ['fRoot', '$q', function (fRoot, $q) {
    var obj = {};

    obj.loadDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.like = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/like",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.unlike = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/unlike",
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
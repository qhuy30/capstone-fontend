myApp.registerFtr('storage_details_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load_details = function(id, code){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/load-detail",
            method: "POST",
            data: JSON.stringify({ id, code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails_wfp = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loaddetails",
            method: "POST",
            data: JSON.stringify({ id, code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

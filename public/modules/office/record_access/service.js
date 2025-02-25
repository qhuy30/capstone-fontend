myApp.registerFtr('record_access_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(search,status,tab,top,offset,sort,statuses){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/load",
            method: "POST",
            data: JSON.stringify({ search,document_type: "exploit_document",status,tab,top,offset,sort,statuses}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,status,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/count",
            method: "POST",
            data: JSON.stringify({ search,document_type: "exploit_document",status,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.init = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/init",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    return obj;
}]);
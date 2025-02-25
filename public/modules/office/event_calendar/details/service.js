
myApp.registerFtr('event_calendar_details_service', ['fRoot','$q', function (fRoot,$q) {
    var obj = {};
    
    obj.loadDetail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

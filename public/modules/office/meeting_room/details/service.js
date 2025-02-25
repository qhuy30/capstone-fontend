
myApp.registerFtr('meeting_room_details_service', ['fRoot','$q', function (fRoot,$q) {
    var obj = {};
    
    obj.loadDetail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_detail_for_update",
            method: "POST",
            data: JSON.stringify({ code:id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_file_info",
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

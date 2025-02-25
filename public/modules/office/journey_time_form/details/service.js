
myApp.registerFtr('journey_time_form_details_service', ['fRoot', function (fRoot) {
    var obj = {};


    obj.loadDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/journey_time_form/loaddetails",
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

myApp.registerFtr('car_registration_details_service', ['fRoot','$q', function (fRoot,$q) {
    var obj = {};
    
    obj.loadDetail = function (code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/loaddetail",
            method: "POST",
            data: JSON.stringify({ code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load_file_info",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    return obj;
}]);

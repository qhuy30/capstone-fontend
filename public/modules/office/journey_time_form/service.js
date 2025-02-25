myApp.registerFtr('journey_time_form_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(search,type,from_date,to_date,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/journey_time_form/load",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.count = function (search,type,from_date,to_date,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/journey_time_form/count",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadLF = function(search,type,from_date,to_date,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/load",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countLF = function (search,type,from_date,to_date,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/count",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }





    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/count_jtf",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }




    
    return obj;
}]);
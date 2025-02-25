myApp.registerFtr('advanced_search_service', ['fRoot', function (fRoot) {

    var obj = {};

    obj.search = function(type, search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/advanced_search/load",
            method: "POST",
            data: JSON.stringify({ type, search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    return obj;

}]);


myApp.registerFtr('feature_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/load_module",
            method: "POST",
            data: JSON.stringify({ module: 'feature' }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (itemAr) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/update",
            method: "POST",
            data: JSON.stringify({
                itemAr
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
myApp.registerFtr('support_service', ['fRoot', function (fRoot) {

    var obj = {};

    obj.load_FAQs = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/support/faqs",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_user_manuals = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/support/user_manuals",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function (params) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/support/load_file_info",
            method: "POST",
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.downloadfile = function (attachment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/support/downloadfile",
            method: "POST",
            data: JSON.stringify(attachment),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            },
            responseType: 'blob'
        });
    }
    
    return obj;

}]);
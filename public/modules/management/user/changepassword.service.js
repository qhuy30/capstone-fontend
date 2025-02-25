myApp.registerFtr('user_changepassword_service', ['fRoot',  function (fRoot) {
    var obj = {};
    obj.changePassword = function (password, newpassword) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/changepassword",
            method: "POST",
            data: JSON.stringify({ newpassword, password}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
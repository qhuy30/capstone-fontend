myApp.registerFtr('user_login_service', ['$http', '$q', function($http, $q) {
    var obj={};
    obj.login = function(username,password,remember){
        var dfd = $q.defer();
        $http({
            url :BackendDomain+"/management/user/login",
            method:"POST",
            data: JSON.stringify(
                {
                    data:
                    {
                        username,password
                        ,remember
                    }
                }
            ),
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        }).then(function(item){
            dfd.resolve(item);
            item = undefined;
            dfd  = undefined;
        },function(err){
            dfd.reject(err);
            err = undefined;
            dfd  = undefined;
        });
        return dfd.promise;
    }

    obj.load_all_department = function () {
        const dfd = $q.defer();
        $http({
            url :BackendDomain + "/office/organization/load_all_department",
            method:"POST",
            data: {},
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        }).then(function(item){
            dfd.resolve(item);
            item = undefined;
            dfd  = undefined;
        },function(err){
            dfd.reject(err);
            err = undefined;
            dfd  = undefined;
        });
        return dfd.promise;
    }
    
    return obj;
}]);

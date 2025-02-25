

myApp.registerCtrl('user_changepassword_controller', ['$scope', '$rootScope', 'user_changepassword_service', 'fRoot', '$q', function ($scope, $rootScope, user_changepassword_service, fRoot, $q) {
    /**declare variable */
    const _statusValueSet = [
        { name: "ChangePassword", action: "changepassword" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "user_changepassword_controller";
        ctrl.password ="";
        ctrl.newpassword1 ="";
        ctrl.newpassword2 ="";
        ctrl.success = false;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.comparePassword = function(model,params){
        if (model === params.val){
            return true;
        }
        return false;
    }

    function changepassword_service() {
        var dfd  = $q.defer();
        user_changepassword_service.changePassword(ctrl.password, ctrl.newpassword1).then(function(){
            dfd.resolve(true);
            ctrl.success = true; 
        },function(err){
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.changepassword = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ChangePassword", "changepassword", changepassword_service);
    }
}]);




myApp.registerCtrl('user_login_controller', ['$scope', '$rootScope', 'user_login_service', 'fRoot', '$q', 'fRoot', '$location', 'encrypt', 'languageValue', '$filter', function ($scope, $rootScope, user_login_service, fRoot, $q, fRoot, $location, encrypt, $languageValue, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Login", action: "login" },
        { name: "Login", action: "loadDP"}
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "user_login_controller";
        ctrl.remember = false;
        ctrl.portalName = "";
        ctrl.slogan = "";
        ctrl.logo = "";
        ctrl.backgroundLogin = "";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl.departments = [];
        ctrl.departments_filter = [];
        ctrl._language_current = $languageValue.current;
        ctrl.text_search_dp = '';
        ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
        ctrl._loginInstructions = $rootScope.Settings.find(item => item.key === 'loginInstructions');
    }
    
    fRoot.tabEnterNew();
    if (!$rootScope.security) {
        window.location.href = "home";
    }
    $("#username_login").focus();
    for (var i in $rootScope.Settings) {
        switch ($rootScope.Settings[i].key) {
            case "portalName":
                ctrl.portalName = $rootScope.Settings[i].value;
                break;
            case "portalSlogan":
                ctrl.slogan = $rootScope.Settings[i].value;
                break;
            case "logo":
                ctrl.logo = $rootScope.Settings[i].value;
                break;
            case "backgroundLogin":
                ctrl.backgroundLogin = $rootScope.Settings[i].value;
                break;
        }
    }
    function login_service() {
        let dfd = $q.defer();
        encrypt.encrypt_oneDirection_lv1(ctrl.password).then(function (data) {
            user_login_service.login(ctrl.username, data, ctrl.remember).then(function (data) {
                fRoot.setCookies(window.cookieKey.token, data.data.token);
                if (ctrl.remember) {
                    fRoot.setCookies(window.cookieKey.refreshToken, data.data.refresh_token);
                }
                if (fRoot.getCookies(window.cookieKey.currentPath).data === '/login') {
                    window.location.href = "task";
                } else {
                    $location.path(fRoot.getCookies(window.cookieKey.currentPath).data);
                    $rootScope.executeAuth_initPrivate();
                }

                let logginArray = fRoot.getCookies(window.cookieKey.logginArray).data;

                if (logginArray) {
                    logginArray = JSON.parse(logginArray);
                    logginArray = logginArray.filter(accountItem => accountItem.username !== ctrl.username);
                    fRoot.setCookies(window.cookieKey.logginArray, JSON.stringify(logginArray));
                }

                fRoot.delCookies(window.cookieKey.currentPath);
                dfd.resolve(data);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                dfd = undefined;
            });
        }, function (err) {
            dfd.reject(err);
            dfd = undefined;
        });
        return dfd.promise;
    }

    ctrl.login = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Login", "login", login_service);
    }
    
    ctrl.switchAccount = function(account) {
        let logginArray = fRoot.getCookies(window.cookieKey.logginArray).data;

        if (logginArray) {
            logginArray = JSON.parse(logginArray);
        } else {
            logginArray = [];
        }

        logginArray = logginArray.filter(accountItem => 
            !(accountItem.username === account.username && accountItem.tenantlLogin === account.tenantlLogin)
        );
        
        fRoot.setCookies(window.cookieKey.logginArray, JSON.stringify(logginArray));
        fRoot.setCookies(window.cookieKey.token, account.tenantlLogin);
        window.location.href = "home";
    }

    ctrl.removeAccount = function(account) {
        let logginArray = fRoot.getCookies(window.cookieKey.logginArray).data;
    
        if (logginArray) {
            logginArray = JSON.parse(logginArray);
        } else {
            logginArray = [];
        }

        logginArray = logginArray.filter(accountItem => 
            !(accountItem.username === account.username && accountItem.tenantlLogin === account.tenantlLogin)
        );
    
        fRoot.setCookies(window.cookieKey.logginArray, JSON.stringify(logginArray));
        fRoot.delCookies(window.cookieKey.token, account.tenantlLogin);
        window.location.reload();
    };
    

    function loadUserSwicth() {
        const cookieData = fRoot.getCookies(window.cookieKey.logginArray);

        if (cookieData && cookieData.data) {
            ctrl.accounts = JSON.parse(cookieData.data);
        } else {
            ctrl.accounts = [];
        }
    }


    function load_all_department_service(){
        let dfd = $q.defer();
        user_login_service.load_all_department().then(function(res){
            ctrl.departments = res.data;
            ctrl.departments_filter = ctrl.departments;
            dfd.resolve(true);
        }, function(err){ console.log(err) } )
        return dfd.promise;
    }

    ctrl.copy = function(id){
        const dp = ctrl.departments.find(item => item.id === id);
        navigator.clipboard.writeText(dp.abbreviation)
        .then(() => {
            $('#modal_show_dp').modal('hide');
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('Copy department abbreviation successfully'),
                type:"success"
            });

        });
    }

    ctrl.load_all_department = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Login", "loadDP", load_all_department_service);
    }

    ctrl.search_dp = function(){
        console.log(ctrl.text_search_dp)
        const normalizedSearchTerm = removeVietnameseAccents(ctrl.text_search_dp.toLowerCase());
    
        ctrl.departments_filter = ctrl.departments.filter(dept => {
            // Get Vietnamese title and normalize it
            const deptName = dept.title['vi-VN'];
            const normalizedDeptName = removeVietnameseAccents(deptName.toLowerCase());
            
            // Check if normalized department name contains normalized search term
            return normalizedDeptName.includes(normalizedSearchTerm);
        });
    }

    function removeVietnameseAccents(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }
    
    function init(){
        const dfdAr = [];
        dfdAr.push(loadUserSwicth());
        dfdAr.push(ctrl.load_all_department());
        $q.all(dfdAr).then(function(){

        }, function(err){
            dfd.reject(err)
        })
    }
    init();
}]);


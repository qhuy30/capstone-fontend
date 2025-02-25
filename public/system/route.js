
myApp.controller('RouteCtrl', ['$rootScope', '$location', '$ocLazyLoad', '$timeout', 'fRoot','$filter', function ($rootScope, $location, $ocLazyLoad, $timeout, fRoot,$filter) {
    var url = angular.copy($location.url());
    url = url.toLowerCase();
    url = url.replace('%3f', '?');
    $rootScope.currentPath =url;
    $rootScope.urlPage ="";
    var thisroute = url.split("?")[0].substring(1, url.split("?")[0].length);
    $rootScope.thisroute = angular.copy(thisroute);
     
    $rootScope.resetDataContext();
   
   
    function setBreadcrumb(){
        try {
            
            if($rootScope.thisroute ==='home'){
                $rootScope.breadcrumb = [$filter('l')('HomePage')];
            }
            for(var i in $rootScope.Menu){
                for(var j in  $rootScope.Menu[i].items){
                    if($rootScope.Menu[i].items[j].path ===$rootScope.thisroute){
                        $rootScope.breadcrumb = [$rootScope.Menu[i].title[$rootScope.Language.current],$rootScope.Menu[i].items[j].title[$rootScope.Language.current]];
                        break;
                    }
                }
            }
        } catch (error) {
            
        }

    }

    function NotLogined() {
        setBreadcrumb();
        for (var i in $rootScope.PublishRouter) {
            if (thisroute == $rootScope.PublishRouter[i].path) {
                $ocLazyLoad.load({ name: 'tqv', files: $rootScope.PublishRouter[i].js }).then(function () {
                    $rootScope.currentRouter = $rootScope.PublishRouter[i];
                    $rootScope.urlPage = $rootScope.PublishRouter[i].html;
                    
                }, function (err) {
                    console.log(err);
                });
                if ($rootScope.PublishRouter[i].toolbar){
                    if ($rootScope.PublishRouter[i].toolbar.js && $rootScope.PublishRouter[i].toolbar.js.length > 0){
                        $ocLazyLoad.load({ name: 'tqv', files: $rootScope.PublishRouter[i].toolbar.js }).then(function () {
                            $rootScope.currentToolbar = $rootScope.PublishRouter[i].toolbar;
                            $rootScope.urlToolbar = $rootScope.PublishRouter[i].toolbar.html;
                        }, function (err) {
                            console.log(err);
                        });
                    }else{
                        $rootScope.currentToolbar = $rootScope.PublishRouter[i].toolbar;
                        $rootScope.urlToolbar = $rootScope.PublishRouter[i].toolbar.html;
                    }
                    
                }else{
                    $rootScope.currentToolbar ="";
                    $rootScope.urlToolbar="";
                }
                return;
            }
        }
        $ocLazyLoad.load({ name: 'tqv', files: loginFiles }).then(function () {
            if ($rootScope.security) {
                $rootScope.urlPage = urlLoginPage;
            }
        }, function (err) {
            console.log(err);
        });

    }

    function Logined() {
       
        fRoot.loadDetailsRouter(thisroute).then(function (data) {
            setBreadcrumb();
            
            if (data.data.js.length>0){
                $ocLazyLoad.load({ name: 'tqv', files: data.data.js }).then(function () {
                    $rootScope.currentRouter = data.data;
                    $rootScope.urlPage = data.data.html;
                }, function (err) {
                    console.log(err);
                });
                
            }else{
                $rootScope.urlPage = data.data.html;
            }
            if (data.data.toolbar){
                if (data.data.toolbar.js && data.data.toolbar.js.length > 0){
                    $ocLazyLoad.load({ name: 'tqv', files: data.data.toolbar.js }).then(function () {
                        $rootScope.currentToolbar = data.data.toolbar;
                        $rootScope.urlToolbar = data.data.toolbar.html;
                    }, function (err) {
                        console.log(err);
                    });
                }else{
                    $rootScope.urlToolbar = data.data.toolbar.html;
                }
                
            }else{
                $rootScope.currentToolbar ="";
                $rootScope.urlToolbar="";
            }
        }, function (err) {
            switch (err.status) {
                case 404:
                  
                    $ocLazyLoad.load({ name: 'tqv', files: notfoundFiles }).then(function () {
                        $rootScope.urlPage = urlNotFoundPage;
                    }, function (err) {
                        console.log(err);
                    });
                    break;
                case 401:
                    $ocLazyLoad.load({ name: 'tqv', files: notpermissionFiles }).then(function () {
                        $rootScope.urlPage = urlNotPermissionPage;
                    }, function (err) {
                        console.log(err);
                    });
                    break;
            }
            $rootScope.messageLoadPage = err.data.mes;
        });
    }
    $rootScope.$watchGroup(['security', 'firstLoad', 'PrivateRouter'], function (val) {
        if (!val[1]) {
           
            $rootScope.chooseMenuItem();
            if (!val[0]) {
                if (thisroute !== undefined
                    && thisroute !== ""
                    && thisroute !== "/") {
                        Logined(); 
                }
            }
            else {
                NotLogined();
            }
        }
    });


}]);

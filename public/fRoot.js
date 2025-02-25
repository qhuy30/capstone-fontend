window.myApp = angular.module('tqv', ['ngAnimate', 'ngSanitize', 'ngCookies', 'oc.lazyLoad', 'ngRoute', 'chart.js', 'ngFileSaver']);
// '$sceProvider', '$controllerProvider','$routeProvider','$locationProvider', function ($sceProvider, $controllerProvider,$routeProvider,$locationProvider
myApp.config(['$sceProvider', '$controllerProvider', '$routeProvider', '$locationProvider', '$provide', '$qProvider', '$compileProvider', '$sceDelegateProvider', '$filterProvider',
    function ($sceProvider, $controllerProvider, $routeProvider, $locationProvider, $provide, $qProvider, $compileProvider, $sceDelegateProvider, $filterProvider) {
        // Compvarely disable SCE.  For demonstration purposes only!
        // Do not use in new projects or libraries.
        // $httpProvider.defaults.withCredentials = true;
        // $sceDelegateProvider.resourceUrlWhitelist([
        //     // Allow same origin resource loads.
        //     'self',
        //     // Allow loading from our assets domain.  Notice the difference between * and **.
        //     'https://www.youtube.com/**'
        //   ]);

        $sceProvider.enabled(false);
        myApp.compileProvider = $compileProvider;
        myApp.registerCtrl = $controllerProvider.register;
        myApp.registerFtr = $provide.factory;
        myApp.registerFilter = $filterProvider.register;
        $qProvider.errorOnUnhandledRejections(false);
        $routeProvider.when('/', {
            redirectTo: '/login'
        }).otherwise({
            controller: 'RouteCtrl',
            template: '<div ng-include="$root.urlPage" ></div>'
        });
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false,
          rewriteLinks:false
        });
        console.log('HTML5 mode:', $locationProvider.html5Mode());
    }
]);

myApp.service('LazyDirectiveLoader', ['$rootScope', '$q', '$compile', function ($rootScope, $q, $compile) {



    var _load = function (url) {
        var dfd = $q.defer();

        var deferred = $q.defer();
        var script = document.createElement('script');
        script.src = url;
        script.onload = function () {
            $rootScope.$apply(deferred.resolve);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
        return dfd.promise;
    };

    return {
        load: _load
    };

}]);

myApp.service('encrypt', ['$q', function ($q) {
    let obj = {};

    obj.encrypt_oneDirection_lv1 = function (value) {
        let dfd = $q.defer();

        // Convert the string to be hashed to an ArrayBuffer
        let dataEncode = new TextEncoder().encode(value).buffer;

        // Hash the data using the SHA-256 algorithm
        window.crypto.subtle.digest('SHA-256', dataEncode).then(function (data) {
            // Convert the hash value to a hexadecimal string
            let hexHash = Array.from(new Uint8Array(data))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            dfd.resolve(hexHash);
            data = undefined;
            dataEncode = undefined;
            hexHash = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            data = undefined;
            dataEncode = undefined;
            hexHash = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    };

    return obj;
}]);

myApp.factory('socket', ['$rootScope', '$cookies', function ($rootScope, $cookies) {
    /*REALTIME*/
    function getCookies(key) {

        if ($cookies.get(key)) {
            // if(window.localStorage.getItem(key)){
            return {
                status: true,
                data: $cookies.get(key)
                // data:window.localStorage.getItem(key)
            };
        } else {
            return { status: false };
        }
    }

    return {
        init: function () {
            $rootScope.socket = io.connect(socketDomain, { transports: ["websocket"] });
        },
        on: function (eventName, callback) {
            try {
                $rootScope.socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply($rootScope.socket, args);
                    });
                });
            } catch (error) {

            }

        },
        emit: function (eventName, data, callback) {
            try {
                $rootScope.socket.emit(eventName, { token: getCookies(window.cookieKey.token).data, data }, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply($rootScope.socket, args);
                        }
                    });
                })
            } catch (error) {

            }

        }
    }
}]);

myApp.value('languageValue', { current: "", list: [], details: [] });
myApp.value('statusvalue', {});
myApp.value('toastValues', []);

myApp.value('refreshTokenStatusValue', { isProcessingRefreshToken: false, isAccessTokenExpired: false });

myApp.factory('SVFactory', ['statusvalue', '$q', function (statusvalue, $q) {
    var obj = {};
    /**generate status value. These value serve for presentation async action. Help a good enjoy end-user*/
    obj.generate = function (ctrl, name, action) {
        statusvalue[ctrl] = statusvalue[ctrl] || {};
        statusvalue[ctrl][name] = statusvalue[ctrl][name] || {};
        statusvalue[ctrl][name][action] = statusvalue[ctrl][name][action] || {};
        statusvalue[ctrl][name][action].doing = false;
        statusvalue[ctrl][name][action].status = true;
        statusvalue[ctrl][name][action].start = false;
        statusvalue[ctrl][name][action].message = "";
    }

    obj.generateSet = function (ctrl, set) {
        for (var i in set) {
            obj.generate(ctrl, set[i].name, set[i].action);
        }
    }

    /**set Start status value */
    obj.start = function (ctrl, name, action) {
        statusvalue[ctrl][name][action].doing = true;
        statusvalue[ctrl][name][action].start = true;
    }

    /**set Success status value */
    obj.success = function (ctrl, name, action, message) {
        statusvalue[ctrl][name][action].doing = false;
        statusvalue[ctrl][name][action].status = true;
        statusvalue[ctrl][name][action].start = true;
        if (message) { statusvalue[ctrl][name][action].message = message; }
    }

    /**set Fail status value */
    obj.fails = function (ctrl, name, action, message) {
        statusvalue[ctrl][name][action].doing = false;
        statusvalue[ctrl][name][action].status = false;
        statusvalue[ctrl][name][action].start = true;
        if (message) { statusvalue[ctrl][name][action].message = message; }
    }

    /**get status value */
    obj.get = function (ctrl, name, action, attrs) {
        return statusvalue[ctrl][name][action][attrs];
    }

    /**get status value object */
    obj.getObj = function (ctrl, name, action) {
        return statusvalue[ctrl][name][action];
    }

    /**execute Async Function with auto set status value */
    obj.execute = function (ctrl, name, action, func) {
        var dfd = $q.defer();
        obj.start(ctrl, name, action);
        func().then(function (data) {
            obj.success(ctrl, name, action, "");
            dfd.resolve(data);
            data = undefined;
            ctrl = undefined;
            name = undefined;
            action = undefined;
            func = undefined;
        }, function (err) {
            if (err !== undefined && err.data !== undefined && typeof err.data.mes == "string") {
                obj.fails(ctrl, name, action, err.data.mes);
            } else {
                obj.fails(ctrl, name, action, "PleaseCheckInformation");
            }
            dfd.reject(err);
            data = undefined;
            ctrl = undefined;
            name = undefined;
            action = undefined;
            func = undefined;
        });
        return dfd.promise;
    }

    return obj;
}]);
myApp.value('notifyvalue', { show: false, type: "success", mes: "Cập nhật thành công!!" });
myApp.factory('NotifyFactory', ['notifyvalue', '$timeout', function (notifyvalue, $timeout) {
    var obj = {};


    obj.showSuccess = function (mes, time) {
        notifyvalue.show = true;
        notifyvalue.type = "success";
        notifyvalue.mes = mes;
        $timeout(function () {
            notifyvalue.show = false;
        }, time);
    }

    obj.showWarning = function (mes, time) {
        notifyvalue.show = true;
        notifyvalue.type = "warning";
        notifyvalue.mes = mes;
        $timeout(function () {
            notifyvalue.show = false;
        }, time);
    }

    obj.showInfo = function (mes, time) {
        notifyvalue.show = true;
        notifyvalue.type = "info";
        notifyvalue.mes = mes;
        $timeout(function () {
            notifyvalue.show = false;
        }, time);
    }

    return obj;
}]);

myApp.factory('PushNotifyFactory', ['$location', '$rootScope', function ($location, $rootScope) {
    var obj = {};

    function askNotificationPermission() {
        // Let's check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications.");
        } else {
            Notification.requestPermission();
        }
    }

    obj.push = function (title, body, url, icon) {
        try {
            var settingsLogo = {};
            for (var i in $rootScope.Settings) {
                switch ($rootScope.Settings[i].key) {
                    case "logo":
                        settingsLogo = $rootScope.Settings[i].value;
                        break;

                }
            }
            if (!icon) {
                if (settingsLogo.urlDisplay) {
                    icon = settingsLogo.urlDisplay;
                } else {
                    icon = window.location.origin + "/datasources/images/default/avatar_default.png"
                }

            }
            
            if (Notification.permission === "granted") {
                var notification = new Notification(title, { body, icon });
                notification.onclick = function () {
                    // console.log("url",url);
                    // $location.url(url)
                    window.location.href = url;
                    $rootScope.$apply();
                }
            } else {
                if (Notification.permission === "denied") {
                    console.log("Quyền thông báo đã bị từ chối");
                    // Hiển thị thông báo cho người dùng về cách bật lại quyền
                    console.log("Vui lòng bật quyền thông báo trong cài đặt trình duyệt của bạn.");
                    return false;
                } else {
                    askNotificationPermission();
                }

            }


        } catch (error) {
            console.log(error);
        }

    }

    return obj;
}]);
myApp.value('memberOnlineValue', { items: [] });
myApp.factory('myValidate', [function () {
    var obj = {};

    /**min for number */
    obj.min = function (model, params) {
        if (!params || params.min === undefined) { return true; }
        if (model < params.min) {
            return false;
        }
        return true;
    }

    /**max for number */
    obj.max = function (model, params) {
        if (!params || params.max === undefined) { return true; }
        if (model > params.max) {
            return false;
        }
        return true;
    }
    return obj;
}]);

myApp.factory('FileFactory', ['$rootScope', function ($rootScope) {
    var obj = {};

    /**bind data */
    obj.bind = function (data) {
        $rootScope.resetFileDataContext();
        let fileName;
        let urlFileName;
        if (data.embedUrl.indexOf('?') !== -1) {
            urlFileName = data.embedUrl.substring(data.embedUrl.lastIndexOf('/') + 1, data.embedUrl.indexOf('?'));
        } else {
            urlFileName = data.embedUrl.substring(data.embedUrl.lastIndexOf('/') + 1, data.embedUrl.length);
        }
        fileName = urlFileName.replace(/%20/g, ' ');

        $rootScope.fileInfo.display = data.display;
        $rootScope.fileInfo.filetype = data.display.split(".")[data.display.split(".").length - 1].toLowerCase();
        $rootScope.fileInfo.fileName = fileName;
        $rootScope.fileInfo.serviceName = data.serviceName;
        $rootScope.fileInfo.attachmentId = data.attachmentId;
        switch ($rootScope.fileInfo.filetype) {
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'ppt':
            case 'pptx':
                $rootScope.fileInfo.embedUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=' + data.embedUrl;
                break;
            default:
                $rootScope.fileInfo.embedUrl = data.embedUrl;
                break;
        }

    }

    obj.show = function (data) {
        if (!$("#myapp").hasClass("filebox-show")) {
            $("#myapp").addClass("filebox-show");
        }

    }

    obj.hide = function () {
        $rootScope.fileInfo = {};
        $("#myapp").removeClass("filebox-show");
    }

    return obj;
}]);

myApp.factory('fRoot', ['$http', '$q', '$cookies', '$location', 'refreshTokenStatusValue', '$rootScope', '$ocLazyLoad', function ($http, $q, $cookies, $location, refreshTokenStatusValue, $rootScope, $ocLazyLoad) {
    var obj = {};
    $rootScope.refreshTokenStatusValue = refreshTokenStatusValue;

    obj.tabEnterNew = function () {
        $("body").on("keydown", "input, select, textarea, button", function (e) {
            var enter_key, form, input_array, move_direction, move_to, new_index, self, tab_index, tab_key;
            enter_key = 13;
            tab_key = 9;

            if (e.keyCode === tab_key || e.keyCode === enter_key) {
                self = $(this);

                // some controls should react as designed when pressing enter
                if (e.keyCode === enter_key && (self.prop('type') === "submit" || self.prop('type') === "textarea")) {
                    return true;
                }

                form = self.parents('form:eq(0)');

                // Sort by tab indexes if they exist
                tab_index = parseInt(self.attr('tabindex'));
                if (tab_index) {
                    input_array = form.find("[tabindex]").filter(':visible').sort(function (a, b) {
                        return parseInt($(a).attr('tabindex')) - parseInt($(b).attr('tabindex'));
                    });
                } else {
                    input_array = form.find("input, select,  textarea,button").not(".no-focus").filter(':visible');
                }

                // reverse the direction if using shift
                move_direction = e.shiftKey ? -1 : 1;
                new_index = input_array.index(this) + move_direction;

                // wrap around the controls
                if (new_index === input_array.length) {
                    new_index = 0;
                } else if (new_index === -1) {
                    new_index = input_array.length - 1;
                }

                move_to = input_array.eq(new_index);
                
                move_to.focus();
                move_to.select();
                return false;
            }
        });
    }

    obj.setCookies = function (key, value) {
        // window.localStorage.setItem(key, value);
        $cookies.put(key, value, { path: '/' });
    }

    /** xoa cookies*/
    obj.delCookies = function (key) {
        // window.localStorage.removeItem('key');
        $cookies.remove(key, { path: '/' });
    }

    /** lay du lieu cookies*/
    obj.getCookies = function (key) {

        if ($cookies.get(key)) {
            //  if(window.localStorage.getItem(key)){
            return {
                status: true,
                data: $cookies.get(key)
                // data: window.localStorage.getItem(key)
            };
        } else {
            return { status: false };
        }
    }
    obj.setAuthentication = function (param) {
        param.headers.authorization = "DTTOKEN " + obj.getCookies(window.cookieKey.token).data;
        return param;
    }

    obj.logout = function () {
        obj.delCookies(window.cookieKey.token);
        obj.delCookies(window.cookieKey.refreshToken);
        obj.delCookies(window.cookieKey.currentPath);
        window.location.href = '/login';
    }

    obj.requestHTTP = function (param) {
        var dfd = $q.defer();
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            switch (err.status) {
                case 401:
                    if (!$rootScope.refreshTokenStatusValue.isAccessTokenExpired) {
                        $rootScope.refreshTokenStatusValue.isAccessTokenExpired = true;

                        const refreshToken = obj.getCookies(window.cookieKey.refreshToken).data;
                        if (refreshToken && !$rootScope.refreshTokenStatusValue.isProcessingRefreshToken) {
                            $rootScope.refreshTokenStatusValue.isProcessingRefreshToken = true;

                            // Call API to get a new accessToken
                            obj.refreshToken().then(function (item) {
                                obj.setCookies(cookieKey.token, item.data.token);
                                $location.path(obj.getCookies(window.cookieKey.currentPath).data);

                                // Recall the original API
                                param = obj.setAuthentication(param);
                                $http(param).then(function (item) {
                                    dfd.resolve(item);
                                    $rootScope.refreshTokenStatusValue.isProcessingRefreshToken = false;
                                    $rootScope.refreshTokenStatusValue.isAccessTokenExpired = false;
                                    obj.delCookies(window.cookieKey.currentPath);
                                    refreshToken = undefined;
                                    item = undefined;
                                    dfd = undefined;
                                }, function (err) {
                                    window.location = window.location.origin;
                                    dfd.reject(err);
                                    dfd = undefined;
                                    err = undefined;
                                });
                            }, function (err) {
                                window.location = window.location.origin;
                                dfd.reject(err);
                                dfd = undefined;
                                err = undefined;
                            });
                        } else {
                            window.location = window.location.origin;
                            dfd.reject(err);
                            dfd = undefined;
                            err = undefined;
                        }
                    } else {
                        const watchEvent = $rootScope.$watchGroup(['refreshTokenStatusValue.isAccessTokenExpired', 'refreshTokenStatusValue.isProcessingRefreshToken'], function (value) {
                            if (value[0] === false && value[1] === false) {
                                param = obj.setAuthentication(param);
                                $http(param).then(function (item) {
                                    dfd.resolve(item);

                                    // Release the event of watchGroup of rootScope
                                    watchEvent();
                                    item = undefined;
                                    dfd = undefined;
                                }, function (err) {
                                    window.location = window.location.origin;
                                    dfd.reject(err);
                                    dfd = undefined;
                                    err = undefined;
                                });
                            }
                        });
                    }
                    break;

                case 403:
                    // Todo: Need an enhancement to improve and detail for each case of this errorCode
                    dfd.reject(err);
                    dfd = undefined;
                    err = undefined;
                    break;
                
                case 404: 
                    if(err.data.mes === "ShowPageNotFound"){    
                        $ocLazyLoad.load({ name: 'tqv', files: notfoundFiles }).then(function () {        
                            if(Object.keys($rootScope.detailsInfo).length > 0){
                                $rootScope.detailsInfo.urlPage = urlNotFoundPage;
                                $rootScope.messageLoadPage = err.data.mes
                            }
                            else{
                                $rootScope.urlPage = urlNotFoundPage;
                            }
                        }, function (err) {
                            console.log(err);
                        });
                        break;
                    }
                    dfd.reject(err);
                    dfd = undefined;
                    err = undefined;
                    break;

                case 422:
                    // Todo: Need an enhancement to improve and detail for each case of this errorCode
                    dfd.reject(err);
                    dfd = undefined;
                    err = undefined;
                    break;

                case 500:
                    // Todo: Need an enhancement to improve and detail for each case of this errorCode
                    dfd.reject(err);
                    dfd = undefined;
                    err = undefined;
                    break;
                default:
                    dfd.reject(err);
                    dfd = undefined;
                    err = undefined;
                    break;
            }
        });

        return dfd.promise;
    }

    obj.auth = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/user/auth",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            obj.setCookies(window.cookieKey.currentPath, $location.path());
            dfd.reject(err);
            dfd = undefined;
            err = undefined;

        });
        return dfd.promise;
    }

    obj.refreshToken = function () {
        let dfd = $q.defer();
        const refreshToken = obj.getCookies(window.cookieKey.refreshToken).data;
        let params = {
            url: BackendDomain + "/management/user/refreshToken",
            method: "POST",
            data: JSON.stringify({
                refreshToken: refreshToken
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        $http(params).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });

        return dfd.promise;
    }

    obj.loadPrivateRouter = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/frontendmap/private",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadPrivateLanguage = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/localization/init",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadPrivateMenu = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/menugroup/private",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.initSystem = function () {
        var dfd = $q.defer();
        $http({
            url: BackendDomain + "/management/setup/init",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        }).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.changeLanguage = function (key) {
        var dfd = $q.defer();
        var params = {
            url: BackendDomain + "/management/user/changelanguage",
            method: "POST",
            data: JSON.stringify({ key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        };
        obj.requestHTTP(params).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadDetailsLanguageByKey = function (key) {
        var dfd = $q.defer();
        var params = {
            url: BackendDomain + "/management/localization/getdetailsbykey",
            method: "POST",
            data: JSON.stringify({ key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        };
        obj.requestHTTP(params).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadDetailsRouter = function (path) {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/system/checkrouter",
            method: "POST",
            data: JSON.stringify({ path }),
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            if (window.modeProduction.toLowerCase() !== 'production') {
                const originalDomain = window.originalDomain;
                if (item.data.js && item.data.js.length > 0) {
                    item.data.js = item.data.js.map(field => {
                        return field ? field.replace(originalDomain, window.primaryDomain) : field;
                    });
                }

                if (item.data.html) {
                    item.data.html = item.data.html.replace(originalDomain, window.primaryDomain);
                }

                if (item.data.toolbar && item.data.toolbar.js && item.data.toolbar.js.length > 0) {
                    item.data.toolbar.js = item.data.toolbar.js.map(field => {
                        return field ? field.replace(originalDomain, window.primaryDomain) : field;
                    });
                }
            }
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadShareLink = function (type, id) {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/og/get",
            method: "POST",
            data: JSON.stringify({ type, id }),
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    // obj.loadDepartment = function() {
    //     var dfd = $q.defer();
    //     var param = {
    //         url: BackendDomain + "/organization/loadfordirective",
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     };
    //     param = obj.setAuthentication(param);
    //     $http(param).then(function(item) {
    //         dfd.resolve(item);
    //         item = undefined;
    //         dfd = undefined;
    //     }, function(err) {
    //         dfd.reject(err);
    //         err = undefined;
    //         dfd = undefined;
    //     });
    //     return dfd.promise;
    // }

    obj.loadPerson = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/human/resumes/loadfordirective",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.loadUser = function () {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/management/user/loadfordirective",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.getUser = function (employee) {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/human/employee/loaddetails_d",
            method: "POST",
            data: JSON.stringify({ id: employee.toString() }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item.data);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    obj.getDepartment = function (id) {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item.data);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }
    obj.checkDeclaration_HMR = function (id) {
        var dfd = $q.defer();
        var param = {
            url: BackendDomain + "/human/employee/check_declaration",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json"
            }
        };
        param = obj.setAuthentication(param);
        $http(param).then(function (item) {
            dfd.resolve(item);
            item = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }
    return obj;
}]);
myApp.factory('debounce', ['$timeout', function ($timeout) {
    var timer = null;
    return function (func, delay) {
        $timeout.cancel(timer);
        timer = $timeout(function () {
            func();
        }, delay || 700);
    };
}])
myApp.factory('DetailsFactory', ['$rootScope', 'fRoot', '$ocLazyLoad', function ($rootScope, fRoot, $ocLazyLoad) {
    var obj = {};

    /**bind data */
    obj.bind = function (data) {
        $rootScope.resetLinkDataContext();
        $rootScope.detailsInfo.display = data.display;
        $rootScope.detailsInfo.code = data.code;
        $rootScope.detailsInfo.route = data.route;
        $rootScope.detailsInfo.url = data.url;
        $rootScope.detailsInfo.prefix = data.prefix;
        if (data.func) {
            $rootScope.detailsInfo.func = data.func;
        }
        if (data.params) {
            $rootScope.detailsInfo.params = data.params;
        }
        if (data.state) {
            $rootScope.detailsInfo.state = data.state;
        }
        if (data.department) {
            $rootScope.detailsInfo.department = JSON.parse(data.department);
        }
        if (data.chooseDepartment) {
            $rootScope.detailsInfo.chooseDepartment = data.chooseDepartment;
        }
        if (data.step) {
            $rootScope.detailsInfo.step = data.step;
        }
        if (data.titleDirectory) {
            $rootScope.detailsInfo.titleDirectory = data.titleDirectory;
        }
        if (data.showDirectory) {
            $rootScope.detailsInfo.showDirectory = data.showDirectory;
        }

        fRoot.loadDetailsRouter(data.route).then(function (data) {
            if (data.data.js.length > 0) {
                $ocLazyLoad.load({ name: 'tqv', files: data.data.js }).then(function () {
                    $rootScope.detailsInfo.urlPage = data.data.html;
                }, function (err) {
                    console.log(err);
                });
            } else {
                $rootScope.detailsInfo.urlPage = data.data.html;
            }
            if (data.data.toolbar) {
                if (data.data.toolbar.js && data.data.toolbar.js.length > 0) {
                    $ocLazyLoad.load({ name: 'tqv', files: data.data.toolbar.js }).then(function () {
                        $rootScope.detailsInfo.currentToolbar = data.data.toolbar;
                        $rootScope.detailsInfo.urlToolbar = data.data.toolbar.html;
                    }, function (err) {
                        console.log(err);
                    });
                } else {
                    $rootScope.detailsInfo.currentToolbar = data.data.toolbar;
                    $rootScope.detailsInfo.urlToolbar = data.data.toolbar.html;
                }

            } else {
                $rootScope.detailsInfo.currentToolbar = "";
                $rootScope.detailsInfo.urlToolbar = "";
            }
        }, function (err) {

            switch (err.status) {
                case 404:
                    $ocLazyLoad.load({ name: 'tqv', files: notfoundFiles }).then(function () {
                        $rootScope.detailsInfo.urlPage = urlNotFoundPage;
                    }, function (err) {
                        console.log(err);
                    });
                    break;
                case 401:
                    $ocLazyLoad.load({ name: 'tqv', files: notpermissionFiles }).then(function () {
                        $rootScope.detailsInfo.urlPage = urlNotPermissionPage;
                    }, function (err) {
                        console.log(err);
                    });
                    break;
            }
            $rootScope.detailsInfo.messageLoadPage = err.data.mes;
        });
    }

    obj.show = function (data) {
        if (!$("#myapp").hasClass("detailsbox-show")) {
            $("#myapp").addClass("detailsbox-show");
        }

    }

    obj.hide = function () {
        if ($rootScope.detailsInfo.func) {
            $rootScope.detailsInfo.func({ params: $rootScope.detailsInfo.params });
        }
        $rootScope.detailsInfo = {};
        $rootScope.$broadcast('detailsbox.hide');
        $("#myapp").removeClass("detailsbox-show");
    }



    return obj;
}]);

myApp.factory('localStorage', ['$rootScope', function ($rootScope){
    var obj = {};


    obj.setItem = function (key, value, expirationMinutes = 60 * 24 * 30 * 365) {
        try {
            if (value === undefined || value === null) {
                console.warn("Cannot store 'undefined' or 'null' in localStorage");
                return localStorage.setItem(key, JSON.stringify({}));
            }
            const expirationTime = new Date().getTime() + expirationMinutes * 60 * 1000; // Thời gian hết hạn (ms)
            const data = {
                value,
                expirationTime
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error("Error saving to localStorage", e);
        }
    };
    
    obj.getItem = function (key) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
    
            const parsedData = JSON.parse(data);

            if(!parsedData.expirationTime){
                obj.removeItem(key);
                return null;
            }

            if (parsedData.expirationTime && new Date().getTime() > parsedData.expirationTime) {
                // Xóa key nếu đã hết hạn
                obj.removeItem(key);
                console.warn(`Key "${key}" has expired and has been removed.`);
                return null;
            }
    
            return parsedData.value || null;
        } catch (e) {
            obj.removeItem(key)
            console.error("Error reading from localStorage", e);
            return null;
        }
    };
    

    obj.removeItem = function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error("Error removing from localStorage", e);
        }
    };

    obj.clear = function() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error("Error clearing localStorage", e);
        }
    };

    return obj;
}])

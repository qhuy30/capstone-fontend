myApp.controller('cRoot', ['$rootScope', 'fRoot', '$q', 'languageValue', 'SVFactory', 'myValidate', 'FileFactory', 'DetailsFactory', 'socket', 'componentSocket', '$window','$timeout','notifyvalue','NotifyFactory','$filter',
    function ($rootScope, fRoot, $q, languageValue, SVFactory, myValidate, FileFactory, DetailsFactory, socket, componentSocket, $window,$timeout,notifyvalue,NotifyFactory,$filter) {
        $rootScope._ctrlName = "cRoot";
        const _statusValueSet = [
            { name: "Localization", action: "chooseLanguage" },
            { name: "File", action: "load" }
        ];

        $rootScope.statusLogin = { value: false };
        $rootScope.componentLink = {
            header: primaryDomain + "/component/header.html",
            menu: primaryDomain + "/component/menu.html",
            asidemenu: primaryDomain + "/component/asidemenu.html",
            footer: primaryDomain + "/component/footer.html"
        };

        $rootScope.reloadObj = {};

        $rootScope.currentPath = "";
        $rootScope.currentRouter = {};
        $rootScope.firstLoad = true;
        $rootScope._checkedAuth = false;
        $rootScope._checkedInitSystem = false;
        $rootScope.security = true;
        $rootScope.logininfo = {};
        $rootScope.theModule = {};
        $rootScope.PublishRouter = [];
        $rootScope.PrivateRouter = [];
        $rootScope.Persons = [];
        $rootScope.Departments = [];
        $rootScope.dataHome = [];
        $rootScope.dataHandle = [];
        $rootScope.breadcrumb = [];
        $rootScope.dataItem = {};
        $rootScope.infoModule = {};
        $rootScope.statusValue = SVFactory;
        $rootScope.statusValue.generateSet($rootScope._ctrlName, _statusValueSet);
        $rootScope.Language = languageValue;
        $rootScope.validate = myValidate;
        $rootScope.notifyvalue = notifyvalue;
        $rootScope.NotifyFactory = NotifyFactory;
        $rootScope.fileInfo = {};
        $rootScope.FileService = FileFactory;
        $rootScope.detailsInfo = {};
        $rootScope.DetailsInfoService = DetailsFactory;
        $rootScope.connectedSocket = false;
        $rootScope.friendsOnline = [];
        $rootScope.DataContext = {
            File: {},
            Link: {},
            Route: {}
        };

        $rootScope.setBreadcrumb = function (val) {
            $rootScope.breadcrumb = val;
        }
        $rootScope.resetDataContext = function () {
            $rootScope.DataContext = {
                File: {},
                Link: {},
                Route: {}
            };
        }

        $rootScope.resetLinkDataContext = function () {
            $rootScope.DataContext.Link = {};
        }
        $rootScope.resetFileDataContext = function () {
            $rootScope.DataContext.File = {};
        }
        $rootScope.logout = function () {
            socket.emit('logout', $rootScope.logininfo.username);
            $timeout(function () {
                fRoot.logout();
            },400);
            

        }

        const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
        const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");

        $rootScope.emitReloadEvent = function (obj) {
            $rootScope.reloadObj = angular.copy(obj)
        };
        
        $rootScope.clearReloadObj = function () {
            $rootScope.reloadObj = {}
        };

        $rootScope.isValidFromDate = function (
            isInsert,
            fromDate,
            toDate
        ) {
            if (isInsert) {
                return !fromDate || fromDate >= toDate
                    ? From_Date_Error_Msg
                    : "";
            } else {
                return fromDate >= toDate ? From_Date_Error_Msg : "";
            }
        };

        $rootScope.isValidToDate = function (
            isInsert,
            fromDate,
            toDate
        ) {
            if (isInsert) {
                return !toDate || fromDate >= toDate
                    ? To_Date_Error_Msg
                    : "";
            } else {
                return fromDate >= toDate ? To_Date_Error_Msg : "";
            }
        };

        /**public resource */
        $rootScope.chooseMenuItem = function () {
            $rootScope.DetailsInfoService.hide();
            $rootScope.FileService.hide();
        }

        function checkAndDirection() {
            var enableSelfConfig = {};
            for (var i in $rootScope.Settings) {
                switch ($rootScope.Settings[i].key) {
                    case "enableSelfConfig":
                        enableSelfConfig = $rootScope.Settings[i];
                        break;
                }
            }

            if ($rootScope.currentPath != "/profile?tab=selfdeclaration"
                && enableSelfConfig.value) {
                if ($rootScope.logininfo.data.employee
                ) {
                    fRoot.checkDeclaration_HMR($rootScope.logininfo.data.employee).then(function (res) {

                        if (!res.data.result) {
                            $window.location.href = "profile?tab=selfdeclaration";
                        }
                    }, function () { });
                }

            }
        }

        function initSystem_sevice() {
            fRoot.initSystem().then(function (data) {
                $rootScope.Settings = data.data.setting;
                $rootScope.Menu = data.data.menu;
                if (window.modeProduction.toLowerCase() !== 'production') {
                    const originalDomain = window.originalDomain;
                    let router = data.data.router[0];
                    if (router.js && router.js.length > 0) {
                        router.js = router.js.map(item => {
                            return item ? item.replace(originalDomain, window.primaryDomain) : item;
                        });
                    }

                    if (router.html) {
                        router.html = router.html.replace(originalDomain, window.primaryDomain);
                    }

                    if (router.toolbar && router.toolbar.js && router.toolbar.js.length > 0) {
                        router.toolbar.js = router.toolbar.js.map(item => {
                            return item ? item.replace(originalDomain, window.primaryDomain) : item;
                        });
                    }
                }
                $rootScope.PublishRouter = data.data.router;
                languageValue.current = data.data.language.current;
                languageValue.list = data.data.language.list;
                languageValue.details = data.data.language.details;
                $rootScope.QuickIcon = data.data.quickicon;
                $rootScope._checkedInitSystem = true;

                if ($rootScope._checkedAuth) {
                    completeLoad();
                }
                setSetting();
                updateFavicon();
                console.log("....initilize successed.");
            }, function () {
                alert("Vui lòng liên hệ nhà cung cấp để hỗ trợ sự cố.");
            });
        }

        function setSetting() {
            for (var i in $rootScope.Settings) {
                switch ($rootScope.Settings[i].key) {
                    case "portalName":
                        document.title = $rootScope.Settings[i].value;
                        break;
                }
            }
        }

        function updateFavicon() {
            var faviconSetting = $rootScope.Settings.find(setting => setting.key === "logo");
            if (faviconSetting) {
              var faviconElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
              faviconElement.type = 'image/x-icon';
              faviconElement.rel = 'shortcut icon';
              faviconElement.href = faviconSetting.value.urlDisplay;
              document.getElementsByTagName('head')[0].appendChild(faviconElement);
            }
        }

        /**private resource */
        function initPrivateLanguage_service() {
            fRoot.loadPrivateLanguage().then(function (data) {

                languageValue.current = data.data.data.current;
                languageValue.list = data.data.data.list;
                languageValue.details = data.data.data.details;
            }, function (err) {
                console.log(err);
            });
        }

        function initPrivateRouter_service() {
            fRoot.loadPrivateRouter().then(function (privateData) {
                $rootScope.PrivateRouter = privateData.data.data;
            }, function (err) {
                console.log(err);
            });
        }

        function initPrivatemenu_service() {
            fRoot.loadPrivateMenu().then(function (data) {
                var menus = data.data;

                for (var i in menus) {
                    var check = true;
                    for (var j in $rootScope.Menu) {
                        if (menus[i]._id == $rootScope.Menu[j]._id) {
                            check = false;
                            for (var z in menus[i].items) {
                                $rootScope.Menu[j].items.push(angular.copy(menus[i].items[z]));
                            }
                            break;
                        }
                    }
                    if (check) {
                        $rootScope.Menu.push(menus[i]);
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }

        $rootScope.executeAuth_initPrivate = function () {
            fRoot.auth().then(function (data) {
                $rootScope._checkedAuth = true;
                $rootScope.logininfo = data.data;
                $rootScope.security = false;
                if ($rootScope._checkedInitSystem) {
                    completeLoad();
                }
                socket.init();
                socket.on('connect', function () {
                    $rootScope.connectedSocket = true;
                    console.log('socket connected. Authenticating...');
                    socket.emit('login', $rootScope.logininfo.username);
                    componentSocket.run();

                    socket.on('unauthorized', function (msg) {
                        console.log("unauthorized: " + JSON.stringify(msg.data));
                        throw new Error(msg.data.type);
                    });
                });


            }, function () {
                $rootScope._checkedAuth = true;
                if ($rootScope._checkedInitSystem) { $rootScope.firstLoad = false; }
            });
        }

        function completeLoad() {
            $rootScope.firstLoad = false;
            checkAndDirection();
            if (!$rootScope.security) {
                initPrivatemenu_service();
                initPrivateRouter_service();

                if ($rootScope.logininfo.data.language &&
                    $rootScope.logininfo.data.language.current &&
                    $rootScope.logininfo.data.language.current != languageValue.current) {
                    initPrivateLanguage_service();
                }
            }

        }
        $rootScope.initApp = function () {
            initSystem_sevice();
            $rootScope.executeAuth_initPrivate();
        }

        $rootScope.initApp();

        function loadDetailsLanguageByKey_service(key) {
            var dfd = $q.defer();
            fRoot.loadDetailsLanguageByKey(key).then(function (data) {
                languageValue.details = data.data.data;
                dfd.resolve(true);
            }, function (err) {
                console.log(err);
                dfd.reject(false);
            });
            return dfd.promise;
        }

        function chooseLanguage_service(key) {
            return function () {
                var dfd = $q.defer();
                var dfdAr = [];
                dfdAr.push(fRoot.changeLanguage(key));
                dfdAr.push(loadDetailsLanguageByKey_service(key));
                languageValue.current = key;
                $q.all(dfdAr).then(function () {
                    dfd.resolve(true);
                    window.location.reload();
                }, function (err) {
                    console.log(err);
                    dfd.reject(false);
                });
                return dfd.promise;
            }
        }

        $rootScope.chooseLanguage = function (key) {
            return $rootScope.statusValue.execute($rootScope._ctrlName, "Localization", "chooseLanguage", chooseLanguage_service(key));
        }

        $rootScope.loadFiletoApproval = function (item) {
            //Make the container Div contenteditable
            $("#copyTarget").attr("contenteditable", true);
            //Select the image
            SelectText($("#copyTarget").get(0));
            //Execute copy Command
            //Note: This will ONLY work directly inside a click listenner
            document.execCommand('copy');
            //Unselect the content
            window.getSelection().removeAllRanges();
            //Make the container Div uneditable again
            $("#copyTarget").removeAttr("contenteditable");
            document.onpaste = function (event) {
                var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                for (index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();
                        var reader = new FileReader();
                        reader.onload = function (event) { }; // data url!
                        reader.readAsDataURL(blob);
                    }
                }
            }
            fRoot.loadFile_v2(item);
        }

        function SelectText(element) {
            var doc = document;
            if (doc.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
]);
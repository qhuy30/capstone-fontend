
myApp.registerCtrl('setting_controller', ['$rootScope', '$q', function ($rootScope, $q) {

    /**declare variable */
    const _statusValueSet = [
        { name: "Setting", action: "load_general" },
        { name: "Setting", action: "load_module" },
        { name: "Setting", action: "update" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "setting_controller";
        ctrl.Modules = [

            {
                title: {
                    "vi-VN": "Quản lý nhân sự",
                    "en-US": "HMR"
                },
                key: "hmr"
            }
        ];
        //ctrl.module = ctrl.Modules[0].key;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlMain = FrontendDomain + "/modules/management/setting/views/general.html";
        ctrl.tab = "general";
    }

    /**function for logic */
    ctrl.switchModule = function (val) {
        ctrl.module = angular.copy(val.key);
        switch (ctrl.module) {
            case "hmr":
                ctrl._urlModule = FrontendDomain + "/modules/management/setting/views/hmr.html";
                break;
        }
    }

    ctrl.switchTab = function (tab) {
        switch (tab) {
            case "general":
                ctrl.tab = tab;
                ctrl._urlMain = FrontendDomain + "/modules/management/setting/views/general.html";
                break;
            case "module":
                ctrl.tab = tab;
                ctrl._urlMain = FrontendDomain + "/modules/management/setting/views/module.html";
                ctrl.switchModule(ctrl.Modules[0]);
                break;
        }
    }



    ctrl.loadModule_details = function (params) {
        let dfd = $q.defer();
        for (var i in ctrl.Modules) {
            if (ctrl.Modules[i].key == params.id) {
                dfd.resolve(ctrl.Modules[i]);
                break;
            }
        }
        return dfd.promise;
    }

}]);


myApp.registerCtrl('setting_general_controller', ['setting_service', '$q', '$rootScope', '$filter', function (setting_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Setting", action: "load_general" },
        { name: "Setting", action: "update" }
    ];
    var ctrl = this;
    var idElement = {};
    {
        ctrl._ctrlName = "setting_general_controller";
        ctrl.logo = {};
        ctrl.background = {};
        ctrl.backgroundLogin = {};
        ctrl.portalName = {};
        ctrl.portalSlogan = {};

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
      
    }


    function loadGerneral_service() {
        var dfd = $q.defer();
        ctrl.settings = [];
        ctrl.checkIdAr = [];
        setting_service.loadGeneral().then(function (res) {
            ctrl.settings = res.data;
            setValue();
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadGerneral = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Setting", "load_general", loadGerneral_service);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.loadGerneral());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );

    }

    /**UPDATE */

    ctrl.update = function(){
        var itemAr = [
            { id: ctrl.portalName._id, value: ctrl.portalName.value },
            { id: ctrl.portalSlogan._id, value: ctrl.portalSlogan.value }
        ];
        setting_service.update(itemAr).then(function () {
            $rootScope.NotifyFactory.showSuccess($filter("l")("SuccessSaving"), 800);
            
            ctrl.load();
           
        }, function (err) {
            $rootScope.NotifyFactory.showSuccess($filter("l")("FailedSaving"), 800);
        });
    }
    /**Upload Image */
    function setValue() {
        for (var i in ctrl.settings) {
            if (ctrl.settings[i].value) {
                switch (ctrl.settings[i].key) {
                    case "portalName":
                        ctrl.portalName = ctrl.settings[i];
                        break;
                    case "portalSlogan":
                        ctrl.portalSlogan = ctrl.settings[i];
                        break;
                    case "logo":
                        ctrl.logo.url = ctrl.settings[i].value.urlDisplay;
                        break;
                    case "background":
                        ctrl.background.url = ctrl.settings[i].value.urlDisplay;
                        break;
                    case "backgroundLogin":
                        ctrl.backgroundLogin.url = ctrl.settings[i].value.urlDisplay;
                        break;
                }
            }
        }

        function readURL(input, id) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#' + id).attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $("#setting-logo").change(function () {
            readURL(this, 'setting-logo-show');
        });

        $("#setting-background").change(function () {
            readURL(this, 'setting-background-show');
        });

        $("#setting-background-login").change(function () {
            readURL(this, 'setting-background-login-show');
        });
    }

    function uploadImage(file, key) {
        var id;
        var image = false;
        for (var i in ctrl.settings) {
            if (ctrl.settings[i].key === key) {
                id = ctrl.settings[i]._id;
                if (ctrl.settings[i].value && ctrl.settings[i].value.name) {
                    image = ctrl.settings[i].value;
                }
                break;
            }
        }
        setting_service.uploadImage(file, id ? id : undefined, image ? image : undefined).then(function () {

        }, function (err) {
            console.log(err);
        });
    }

    ctrl.chooseLogo = function (params) {
        ctrl.logo = params.file;
        uploadImage(ctrl.logo, 'logo');
    }

    ctrl.chooseBackground = function (params) {
        ctrl.background = params.file;
        uploadImage(ctrl.background, 'background');
    }

    ctrl.chooseBackgroundLogin = function (params) {
        ctrl.backgroundLogin = params.file;
        uploadImage(ctrl.backgroundLogin, 'backgroundLogin');
    }

}]);



myApp.registerCtrl('setting_module_hmr_controller', ['setting_service', '$q', '$rootScope', '$filter', function (setting_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Setting", action: "load" },
        { name: "Setting", action: "update" }
    ];
    var ctrl = this;
    var idElement = {};
    {
        ctrl._ctrlName = "setting_module_hmr_controller";

        ctrl.enableSelfConfig = {};

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    function generateForm() {
        for (var i in ctrl.settings) {
            switch (ctrl.settings[i].key) {
                case "enableSelfConfig":
                    ctrl.enableSelfConfig = ctrl.settings[i];
                    break;

            }
        }
    }

    function load_service() {
        var dfd = $q.defer();
        ctrl.settings = [];
        ctrl.checkIdAr = [];
        setting_service.loadModule("hmr").then(function (res) {
            ctrl.settings = res.data;
            generateForm();
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Setting", "load", load_service);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );

    }

    /**UPDATE */

    ctrl.update = function() {
        var itemAr = [
            { id: ctrl.enableSelfConfig._id, value: ctrl.enableSelfConfig.value }
        ];
        setting_service.update(itemAr).then(function () {
            $rootScope.NotifyFactory.showSuccess($filter("l")("SuccessSaving"), 800);
            ctrl.load();
           
        }, function (err) {
            $rootScope.NotifyFactory.showSuccess($filter("l")("FailedSaving"), 800);
        });

    };

    ctrl.load = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Setting", "load", load_service);
    }
}]);

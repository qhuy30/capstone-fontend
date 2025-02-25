
myApp.registerCtrl('feature_controller', ['$rootScope', '$q', 'feature_service', function ($rootScope, $q, feature_service) {

    /**declare variable */
    const _statusValueSet = [
        { name: "Feature", action: "load" },
        { name: "Feature", action: "update" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "feature_controller";
        ctrl.Modules = [

            {
                title: {
                    "vi-VN": "Quản lý nhân sự",
                    "en-US": "HMR"
                },
                key: "hmr"
            }
        ];
        ctrl._notyetInit = true;
        ctrl.applyNewStorageFlow = {
            value: false
        };
        ctrl.settings = [];
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.changeNewStorageFlowFlag = (params) => {
        ctrl.applyNewStorageFlow.value = params;
        ctrl.update();
    }

    function update_service() {
        var dfd = $q.defer();
        const itemAr = [
            { id: ctrl.applyNewStorageFlow._id, value: ctrl.applyNewStorageFlow.value }
        ];
        feature_service.update(itemAr).then(() => {
            dfd.resolve(true);
            ctrl.load();
        }).catch(err => {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = () => {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Feature", "update", update_service);
    }

    function loadSetting() {
        for (var i in ctrl.settings) {
            switch (ctrl.settings[i].key) {
                case "applyNewStorageFlow":
                    ctrl.applyNewStorageFlow = ctrl.settings[i];
                    break;
            }
        }
    }

    function load_service() {
        var dfd = $q.defer();
        feature_service.load().then((res) => {
            ctrl.settings = res.data;
            loadSetting();
            dfd.resolve(true);
        }).catch(err => {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Feature", "load", load_service);
    }


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
    init();

}]);
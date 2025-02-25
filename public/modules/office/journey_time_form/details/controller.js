myApp.registerCtrl('journey_time_form_details_controller', ['journey_time_form_details_service', '$q', '$rootScope', '$filter', function (journey_time_form_details_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "JourneyTimeForm", action: "loadDetails" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "journey_time_form_details_controller";
        ctrl.Item = {};
        ctrl.LeaveFormType_Config = {
            master_key: "leave_form_type",
            load_details_column: "value"
        };
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }





    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        journey_time_form_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }



    ctrl.loadRole_details = function (params) {
        let dfd = $q.defer();
        journey_time_form_details_service.loadRole_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            journey_time_form_details_service.loadFileInfo(params.id, params.name).then(function (res) {
                dfd.resolve({
                    display: res.data.display,
                    embedUrl: res.data.url,
                    guid: res.data.guid
                });
                res = undefined;
                dfd = undefined;
            }, function (err) {
            });
            return dfd.promise;
        }
    }
    /**show Infomation Details*/

    function loadDetails_service() {
        var dfd = $q.defer();
        journey_time_form_details_service.loadDetails(ctrl.thisId).then(function (res) {
            ctrl.Item = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "JourneyTimeForm", "loadDetails", loadDetails_service);
    }



    function init() {
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'journey-time-form-details') {
            ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !== 24) {
                $rootScope.detailsInfo.urlPage = urlNotFoundPage;
            } else {
                ctrl.loadDetails();
            }
        } else {
            ctrl.thisId = $rootScope.currentPath.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !== 24) {
                $rootScope.urlPage = urlNotFoundPage;
            } else {
                ctrl.loadDetails();
            }
        }
    }
    init();



}]);
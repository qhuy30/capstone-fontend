myApp.registerCtrl('labor_contract_details_controller', ['labor_contract_details_service', '$q', '$rootScope', '$timeout', function (labor_contract_details_service, $q, $rootScope, $timeout) {
        /**declare variable */
        const _statusValueSet = [
            { name: "LaborContract", action: "loadDetails" }
        ];
        var ctrl = this;
            /** init variable */
    {
        ctrl._ctrlName = "labor_contract_details_controller";
        ctrl.Item = {};
        ctrl.tab = "general";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }


    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            labor_contract_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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

    function loadDetails_service() {
        var dfd = $q.defer();
        labor_contract_details_service.loadDetails(ctrl.thisId).then(function (res) {
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

    ctrl.loadDetails_TrainingSchool = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadDetails_TrainingSchool(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadTypeLaborContract_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadTypeLaborContract_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadTypeResidence_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadTypeResidence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadSpecialized_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadSpecialized_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadNationality_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadNationality_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadReligion_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadReligion_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadEducation_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadEducation_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDegree_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadDegree_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadStateManagement_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadStateManagement_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadIT_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadIT_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDegreeEnglish_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadDegreeEnglish_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadCompetence_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadCompetence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadPoliticalTheory_details = function (params) {
        let dfd = $q.defer();
        labor_contract_details_service.loadPoliticalTheory_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    
    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "loadDetails", loadDetails_service);
    }

    function init() {

        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'human-larbor-contract-details') {
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


myApp.registerCtrl('project_wiki_details_controller', ['project_wiki_details_service', '$q', '$rootScope', '$timeout', function (project_wiki_details_service, $q, $rootScope, $timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Wiki", action: "loadDetails" },
        { name: "Wiki", action: "delete" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "project_wiki_details_controller";
        ctrl.Item = {};
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }



    /**show Infomation Details*/

    function loadDetails_service() {
        var dfd = $q.defer();
        project_wiki_details_service.loadDetails(ctrl.thisId).then(function (res) {
            ctrl.Item = res.data;
            $rootScope.DataContext.Route.Item = angular.copy(ctrl.Item);
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Wiki", "loadDetails", loadDetails_service);
    }

    if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'wiki-details') {
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
    

    ctrl.loadFileInfo = function (params) {
        return function () {
            var dfd = $q.defer();
            project_wiki_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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
    
    function like() {
        project_wiki_details_service.like(ctrl.Item._id).then(function (res) {
            ctrl.Item = res.data;
        }, function (err) {
            console.log(err);
        });
    }
    function unlike() {
        project_wiki_details_service.unlike(ctrl.Item._id).then(function (res) {
            ctrl.Item = res.data;
        }, function (err) {
            console.log(err);
        });
    }

    ctrl.like = function (val) {
        if (val) {
            like();
        } else {
            unlike();
        }
    }


}]);
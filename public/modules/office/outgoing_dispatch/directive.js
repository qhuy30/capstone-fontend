myApp.compileProvider.directive("outgoingDispatchDetails", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/outgoing_dispatch/directives/outgoing_dispatch_details.html",
        scope: {
            itemId: "<",
            itemCode: "<",
            setBreadcrumb: "&",
        },
        controller: [
            "odb_details_service",
            "$q",
            "$scope",
            "$rootScope",
            function (odb_details_service, $q, $scope, $rootScope) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "ODB", action: "loadDetail" },
                    { name: "ODB", action: "handling" },
                ];
                var ctrl = ($scope.ctrl = this);
                /** init variable */
                {
                    ctrl._ctrlName = "odb_details_controller";

                    ctrl.LaborContractType_Config = {
                        master_key: "larbor_contract_type",
                        load_details_column: "value"
                    };

                    ctrl.OutgoingDispatchBook_Config = {
                        master_key: "outgoing_dispatch_book",
                        load_details_column: "value",
                    };

                    ctrl.IncommingDispatchPririoty_Config = {
                        master_key: "incomming_dispatch_priority",
                        load_details_column: "value",
                    };

                    ctrl.MethodOfSendingDispatchTo_Config = {
                        master_key: "method_of_sending_dispatch_to",
                        load_details_column: "value",
                    };

                    ctrl.KindOfDispatchTo_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };

                    ctrl.forward = [];
                    ctrl.Departments = [];
                    ctrl.Item = {};
                    ctrl.status = "see";
                    ctrl.comment = "";
                    ctrl.Type = [
                        {
                            title: {
                                "vi-VN": "Một người duyệt cho tất cả",
                                "en-US": "One for all",
                            },
                            key: "one",
                        },
                        {
                            title: {
                                "vi-VN": "Đồng thuận",
                                "en-US": "All Approval",
                            },
                            key: "all",
                        },
                    ];

                    ctrl.task = {};

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                ctrl.pickForward = function (val) {
                    console.log(val);
                };

                /**show Infomation Details*/
                function loadDetail_service() {
                    var dfd = $q.defer();
                    odb_details_service.loadDetail(ctrl.thisId, ctrl.code).then(
                        function (res) {
                            ctrl.Item = res.data;
                            ctrl.thisId = ctrl.Item._id;
                            $scope.setBreadcrumb && $scope.setBreadcrumb({
                                params: [
                                    ...(ctrl.Item.parents || []).reverse(),
                                    { object: 'odb', code: ctrl.Item.code },
                                ]
                            });
                            if (
                                ctrl.Item.handler.indexOf(
                                    $rootScope.logininfo.username
                                ) !== -1
                            ) {
                                ctrl.status = "handling";
                            }
                            dfd.resolve(true);
                            res = undefined;
                            dfd = undefined;
                        },
                        function (err) {
                            if (err.status === 403) {
                                $rootScope.urlPage = urlNotPermissionPage;
                            } else {
                                $rootScope.urlPage = urlNotFoundPage;
                            }
                            dfd.reject(err);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                }

                ctrl.loadDetail = function () {
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "ODB",
                        "loadDetail",
                        loadDetail_service
                    );
                };

                ctrl.loadFile = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        odb_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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
                function init() {
                    ctrl.loadDetail();
                }

                $scope.$watch("itemId", (val) => {
                    if (val) {
                        ctrl.thisId = val;
                        init();
                    }
                });

                $scope.$watch("itemCode", (val) => {
                    if (val) {
                        ctrl.code = val;
                        init();
                    }
                });
            },
        ],
    };
});

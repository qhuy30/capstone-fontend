myApp.registerCtrl("training_details_controller", [
    "training_details_service",
    "$q",
    "$rootScope",
    '$scope',
    "$timeout",
    'FileSaver',
    function (training_details_service, $q, $rootScope, $scope, $timeout, FileSaver) {
        var ctrl = this;
        ctrl._ctrlName = "training_point_controller";
        ctrl.Item = {};
        ctrl.QRCodeCheckIn = "";
        ctrl.QRCodeCheckOut = "";
        
        const _statusValueSet = [
            { name: "TrainingPoint", action: "loadDetails" },
            { name: "TrainingPoint", action: "getQRCode" },
            { name: "TrainingPoint", action: "checkin" },
            { name: "TrainingPoint", action: "checkout" },
            { name: "TrainingPoint", action: "export_checkout" }
        ];
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


        ctrl.getQRCodes = function () {
            return $rootScope.statusValue.execute(
                ctrl._ctrlName,
                "TrainingPoint",
                "getQRCode",
                getQRCodes_service
            );
        };

        function getQRCodes_service() {
            var dfd = $q.defer();

            $q.all([
                training_details_service.getQRCode(ctrl.thisId, 'checkin'),
                training_details_service.getQRCode(ctrl.thisId, 'checkout')
            ]).then(([checkInRes, checkOutRes]) => {
                ctrl.QRCodeCheckIn = checkInRes.data;
                ctrl.QRCodeCheckOut = checkOutRes.data;
                dfd.resolve(true);
                checkInQR = undefined;
                checkOutQR = undefined;
                dfd = undefined;
            }).catch(err => {
                dfd.reject(err);
                err = undefined;
            })
            return dfd.promise;
        }

        ctrl.downloadQRCode = function (data, type) {
            fetch(data)
                .then((response) => response.blob())
                .then((blob) => {
                    FileSaver.saveAs(blob, type + "_" + ctrl.Item.title_search);
                })
                .catch((error) => {
                    console.error('Get QR Code Error: ', error);
                });
        }

        ctrl.loadDetails = function () {
            return $rootScope.statusValue.execute(
                ctrl._ctrlName,
                "TrainingPoint",
                "loadDetails",
                loadDetails_service
            );
        };


        ctrl.ackTrainingEvent = function (studentId, type, modalName) {
            return $rootScope.statusValue.execute(
                ctrl._ctrlName,
                "TrainingPoint",
                type,
                ackTrainingEvent_service(studentId,type,modalName)
            );
        }

        function export_checkout_list_service() {
            var dfd = $q.defer();
            training_details_service.export_checkout_list(ctrl.thisId).then(function (res) {
                training_details_service.exportCheckOutListToExcelFile(res.data);
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
            return dfd.promise;
        }
    
    
    
        ctrl.export_checkout_list = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "export_checkout", export_checkout_list_service);
        }

        function ackTrainingEvent_service(studentId, type, modalName) {
            return function () {
                var dfd = $q.defer();
                training_details_service
                    .ackTrainingEvent(ctrl.thisId, studentId, type)
                    .then(
                        function (res) {
                            dfd.resolve(true);
                            ctrl.loadDetails();
                            $("#" + modalName).modal("hide");
                            document.querySelector('.modal-backdrop').remove();
                            res = undefined;
                            dfd = undefined;
                            return $rootScope.statusValue.generate(ctrl._ctrlName, "TrainingPoint", type);
                        },
                        function (err) {
                            dfd.reject(err);
                            err = undefined;
                        }
                    );
                return dfd.promise;
            };
        }

        function loadDetails_service() {
            var dfd = $q.defer();

            training_details_service.loadDetails(ctrl.thisId).then(
                function (res) {
                    console.log("res", res);
                    console.log(ctrl.Item);
                    ctrl.Item = res.data;
                    console.log(ctrl.Item);
                    ctrl.getQRCodes();
                    dfd.resolve(true);
                    res = undefined;
                    dfd = undefined;
                },
                function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
            );
            return dfd.promise;
        }

        function init() {
            if (
                $rootScope.detailsInfo.url &&
                $rootScope.detailsInfo.route === "training-point-details"
            ) {
                ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
                if (!ctrl.thisId || ctrl.thisId.length !== 24) {
                    $rootScope.urlPage = urlNotFoundPage;
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

        $scope.$watch('detailsInfo.url', function (newVal) {
            if (newVal) {
                init();
            }
        });
    },
]);

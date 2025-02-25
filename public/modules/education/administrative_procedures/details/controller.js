myApp.registerCtrl('administrative_procedure_details_controller', ['administrative_procedure_details_service', '$q', '$rootScope', '$timeout', function (administrative_procedure_details_service, $q, $rootScope, $timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "administrativeProcedures", action: "loadDetails" },
        { name: "administrativeProcedures", action: "reloadDetails" },
        { name: "administrativeProcedures", action: "loadWFDetails" },
        { name: "administrativeProcedures", action: "update" },
        { name: "administrativeProcedures", action: "updateStatus" },
        { name: "administrativeProcedures", action: "addFeedback" },
    ];

    var ctrl = this;

    ctrl.Type = [
        { title: { "vi-VN": "Xử lý văn bản", "en-US": "Process" }, key: "process" },
        { title: { "vi-VN": "Thu phí", "en-US": "Pay fee" }, key: "pay_fee" },
        { title: { "vi-VN": "Phê duyệt", "en-US": "Approval" }, key: "approval" },
        { title: { "vi-VN": "Stamp", "en-US": "Stamp" }, key: "stamp" },
        { title: { "vi-VN": "Publish", "en-US": "Publish" }, key: "publish" },
    ];

    ctrl._update_value = {
        note: ""
    }

    ctrl.comment = "";
    ctrl._notyetInit = true;

    /** init variable */
    {
        ctrl._ctrlName = "administrative_procedures_details_controller";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    }

    function loadDetails_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.loadDetails(ctrl.thisId).then(
            function (res) {
                ctrl.Item = res.data;
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

    function loadWFDetails_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.loadWFDetails(ctrl.Item.formId).then(
            function (res) {
                ctrl.Form = res.data;
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

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "loadDetails", loadDetails_service).then(function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "loadWFDetails", loadWFDetails_service);
        })
    }

    ctrl.reloadDetails = function () {
        angular.element('#update_status_comment').val('');
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "reloadDetails", loadDetails_service);
    }
    function init() {
        var dfdAr = [];
        if (
            $rootScope.detailsInfo.url &&
            $rootScope.detailsInfo.route === "administrative-procedure-details"
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

    $rootScope.$watch('detailsInfo.url', function (newVal) {
        if (newVal) {
            init();
        }
    });

    // NODE
    ctrl.loadCompetence_details = function (params) {
        let dfd = $q.defer();
        administrative_procedure_details_service.loadCompetence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadType_details = function (params) {
        let dfd = $q.defer();
        for (var i in ctrl.Type) {
            if (ctrl.Type[i].key == params.id) {
                dfd.resolve(ctrl.Type[i]);
                break;
            }
        }
        return dfd.promise;
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        administrative_procedure_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }


    ctrl.prepareUpdateStatus = function (action) {
        ctrl._update_status = {};
        switch (action) {
            case 'PendingProcessing':
                ctrl._update_status.status = "PendingProcessing";
                ctrl._update_status.label = "WaitingForProgressing";
                ctrl._update_status.text = {
                    'vi-VN': 'Xác nhận chờ xử lý?',
                    'en-US': 'Confirmed pending processing?',
                };
                break;
            case 'RequireAdditionalDocuments':
                ctrl._update_status.status = "RequireAdditionalDocuments";
                ctrl._update_status.label = "NeedAdditionalRecords";
                ctrl._update_status.text = {
                    'vi-VN': 'Yêu cầu bổ sung hồ sơ?',
                    'en-US': 'Request additional documents?',
                };
                break;
            case 'Approved':
                ctrl._update_status.status = "Approved";
                ctrl._update_status.label = "Approval";
                ctrl._update_status.text = {
                    'vi-VN': 'Xác nhận phê duyệt?',
                    'en-US': 'Confirmed approval?',
                };
                break;
            case 'Rejected':
                ctrl._update_status.status = "Rejected";
                ctrl._update_status.label = "Reject";
                ctrl._update_status.text = {
                    'vi-VN': 'Xác nhận bác bỏ?',
                    'en-US': 'Confirmed refusal?',
                };
                break;
            default:
                break;
        }
        $("#modal_administrative_procedures_update_status").modal("show");
    }

    function requireAdditionalDocuments_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.requireAdditionalDocuments(ctrl.Item._id, $rootScope.logininfo.username, angular.element('#update_status_comment').val()).then(
            function (res) {
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

    function approval_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.approval(ctrl.Item._id, $rootScope.logininfo.username, angular.element('#update_status_comment').val()).then(
            function (res) {
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

    function reject_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.reject(ctrl.Item._id, $rootScope.logininfo.username, angular.element('#update_status_comment').val()).then(
            function (res) {
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

    function resumeProcessing_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.resumeProcessing(ctrl.Item._id, $rootScope.logininfo.username, angular.element('#update_status_comment').val()).then(
            function (res) {
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

    function addFeedback_service() {
        var dfd = $q.defer();
        administrative_procedure_details_service.addFeedback(ctrl.Item._id, $rootScope.logininfo.username, ctrl.comment).then(
            function (res) {
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
                ctrl.comment = "";
                ctrl.feedbackNotify = {
                    'vi-VN': 'Gửi phản hồi thành công',
                    'en-US': 'Feedback sent successfully',
                }
                ctrl.loadDetails();
            },
            function (err) {
                ctrl.feedbackNotify = {
                    'vi-VN': 'Gửi phản hồi thất bại',
                    'en-US': 'Sending feedback failed',
                }
                dfd.reject(err);
                err = undefined;   
            }
        );

        $timeout(function () {
            ctrl.feedbackNotify = {
                'vi-VN': '',
                'en-US': '',
            }
        }, 7000);
        return dfd.promise;
    }

    ctrl.updateStatus = function () {
        switch (ctrl._update_status.status) {
            case 'PendingProcessing':
                ctrl.resumeProcessing().then(function () {
                    ctrl.reloadDetails();
                });
                break;
            case 'RequireAdditionalDocuments':
                ctrl.requireAdditionalDocuments().then(function () {
                    ctrl.reloadDetails();
                });
                break;
            case 'Approved':
                ctrl.approval().then(function () {
                    ctrl.reloadDetails();
                });
                break;
            case 'Rejected':
                ctrl.reject().then(function () {
                    ctrl.reloadDetails();
                });
                break;
            default:
                break;
        }
    }

    ctrl.requireAdditionalDocuments = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "updateStatus", requireAdditionalDocuments_service);
    }
    ctrl.approval = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "updateStatus", approval_service);
    }
    ctrl.reject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "updateStatus", reject_service);
    }

    ctrl.resumeProcessing = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "updateStatus", resumeProcessing_service);
    }

    ctrl.sendFeedback = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "administrativeProcedures", "update", addFeedback_service);
    }
    /**show Infomation Details*/
}]);
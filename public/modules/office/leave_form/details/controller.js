myApp.registerCtrl('leaveform_details_controller', ['leaveform_details_service', '$q', '$rootScope', '$filter', function (leaveform_details_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "LeaveForm", action: "loadDetails" },
        { name: "LeaveForm", action: "approval" },
        { name: "LeaveForm", action: "reject" },
        { name: "LeaveForm", action: "return" },
        { name: "LeaveForm", action: "insert" },
        { name: "LeaveForm", action: "cancel" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "leaveform_details_controller";
        ctrl.Item = {};
        ctrl.status = "see";
        ctrl.comment = "";
        ctrl.note = "";
        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };
        ctrl.LeaveFormType_Config = {
            master_key: "leave_form_type",
            load_details_column: "value"
        };

        ctrl.LeavingFormApprovalStatus_Config = {
            master_key: "leaving_form_approval_status",
            load_details_column: "value"
        };

        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };
        
        ctrl.Type = [
            { title: { "vi-VN": "Một người duyệt cho tất cả", "en-US": "One for all" }, key: "one" },
            { title: { "vi-VN": "Đồng thuận", "en-US": "All Approval" }, key: "all" }
        ];
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/leave_form/details/views/insert_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/leave_form/details/views/cancel_modal.html";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }






    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        leaveform_details_service.loadDepartment_details(params.id).then(function (res) {
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
        leaveform_details_service.loadCompetence_details(params.id).then(function (res) {
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
        leaveform_details_service.loadRole_details(params.id).then(function (res) {
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
            leaveform_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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
        leaveform_details_service.loadDetails(ctrl.thisId).then(function (res) {
            ctrl.Item = res.data;
            ctrl.status = "see";
            if (ctrl.Item && ctrl.Item.play_now) {
                for (var i in ctrl.Item.play_now) {
                    if (ctrl.Item.play_now[i].username == $rootScope.logininfo.username ) {
                        ctrl.status = "pending";
                        break;
                    }
                }
            }
            if ($filter('checkRule')(['OfficeLeaveForm.Manager']) 
            && ctrl.Item.status === 'Approved' 
            && ctrl.Item.use_jtf
            && !ctrl.Item.cancel_jtf
            && !ctrl.Item.has_jtf
            ) {
                ctrl.status = "jtf";
            }

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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "loadDetails", loadDetails_service);
    }



    function init() {
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'leaveform-details') {
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
    /**approval */
    function approval_service() {
        var dfd = $q.defer();
        leaveform_details_service.approval(ctrl.thisId, ctrl.comment).then(function (res) {
            init();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.approval = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "approval", approval_service);
    }

    function reject_service() {
        var dfd = $q.defer();
        leaveform_details_service.reject(ctrl.thisId, ctrl.comment).then(function (res) {
            init();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.reject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "reject", reject_service);
    }

    /**insert */
    function genString(obj) {
        let result = "";
        result += obj.getFullYear() + "/";
        result += obj.getMonth() < 9 ? "0" + (obj.getMonth() + 1) : (obj.getMonth() + 1);
        result += "/";
        result += obj.getDate() < 9 ? "0" + (obj.getDate() + 1) : (obj.getDate() + 1);
        return result;
    }

    ctrl.prepareInsert = function () {
        ctrl._insert_value = {
            number_day: 1,
            note: ""
        };
    }

    function insert_service() {
        var dfd = $q.defer();
        leaveform_details_service.loadEmployee_details(ctrl.Item.employee).then(function (data) {
            let from_date = new Date(ctrl.Item.from_date);
            let to_date = new Date(ctrl.Item.to_date);
            leaveform_details_service.insert(
                data.data.fullname + " (" + genString(from_date) + "-" + genString(to_date) + ")",
                ctrl._insert_value.number_day,
                ctrl.thisId,
                ctrl._insert_value.note
            ).then(function () {
                $("#modal_JTF_Insert").modal("hide");
                init();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });

        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "insert", insert_service);
    }

    function cancel_service() {
        var dfd = $q.defer();
        leaveform_details_service.cancel(
            ctrl.thisId,
            ctrl.note
        ).then(function () {
            $("#modal_JTF_Cancel").modal("hide");
            init();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.cancel = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LeaveForm", "insert", cancel_service);
    }

}]);
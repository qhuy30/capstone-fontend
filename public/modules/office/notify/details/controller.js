myApp.registerCtrl('notify_details_controller', ['$location', 'notify_details_service', '$q', '$rootScope', '$scope', '$filter', function ($location, notify_details_service, $q, $rootScope, $scope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Notify", action: "load_details" },
        { name: "Notify", action: "approval" },
        { name: "Notify", action: "reject" },
        { name: "Notify", action: "like" },
        { name: "Notify", action: "unlike" },
        { name: "Notify", action: "edit" },
        { name: "Notify", action: "approve_department" },
        { name: "Notify", action: "delete" },
        { name: "Notify", action: "recall" },
        { name: "Notify", action: "approve" },
        { name: "Notify", action: "reject" },
        { name: "Notify", action: "throw_to_recyclebin" },
        { name: "Notify", action: "restore_from_recyclebin" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "notify_details_controller";
        ctrl.tab = 'content';
        ctrl.comment = "";
        ctrl.Item = {};
        ctrl.NotifyGroup_Config = {
            master_key: "notify_group",
            load_details_column: "value"
        };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlProcessingButton = FrontendDomain + "/modules/office/notify/views/processing_button.html";
        ctrl._urlApproveModal_detail =
            FrontendDomain + "/modules/office/notify/details/views/approve_modal_detail.html";
        ctrl._urlRejectModal_detail =
            FrontendDomain + "/modules/office/notify/details/views/reject_modal_detail.html";
        ctrl._urlDeleteModal_detail =
            FrontendDomain + "/modules/office/notify/details/views/delete_modal_detail.html";
        ctrl._urlRecallModal_detail =
            FrontendDomain + "/modules/office/notify/details/views/recall_modal_detail.html";
        ctrl._urlEditModal_detail =
            FrontendDomain + "/modules/office/notify/details/views/notify_edit_modal_detail.html";

        ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
        

        ctrl.notify_group_config = {
            master_key: "notify_group",
            load_details_column: "value",
        };
        ctrl.notify_type_config = [
            { label: "WholeSchool", val: "WholeSchool" },
            { label: "Employee", val: "Employee" },
            { label: "Department", val: "Department" },
        ];

        ctrl.function_apply_suggestions = ['registration_notify'];


    }

    const NOTIFY_STATUS = {
        PENDING: "Pending",
        APPROVED_BY_DEPARTMENT_LEADER: "ApprovedByDepartmentLeader",
        APPROVED: "Approved",
        APPROVED_LEAD_EXTERNAL: "ApprovedLeadExternal",
        REJECTED: "Rejected",
        PENDING_RECALLED: "PendingRecalled",
        APPROVED_RECALL_BY_DEPARTMENT_LEADER: "ApprovedRecallByDepartmentLeader",
        APPROVED_RECALL_BY_LEADER: "ApprovedRecallByLead",
        RECALLED: "Recalled"
    }
  
    const NOTIFY_RULE = {
        USE: "Office.Notify.Use",
        APPROVE_DEPARTMENT: "Office.Notify.ApprovalLevel_2",
        APPROVE_LEAD: "Office.Notify.ApprovalLevel_1",
        APPROVE_LEAD_EXTERNAL: "Office.Notify.ApproveExternal",
        MANAGER: "Office.Notify.Manager",
        CREATE: "Office.Notify.Create"
    }
    const NOTIFY_SCOPE = {
        INTERNAL: "Internal",
        EXTERNAL: "External",
    };

    function getPermissionProperties(item) {
        let allowApprove = false;
        let allowApproveDepartment = false;
        let allowApproveLeadExternal = false;
        let allowApprove_recall = false;
        let allowCancel = false;
        let allowDelete = false;
        let allowEdit = false;
        let allowRequestRecall = false;

        let status_to_show = item.status;


        switch (item.status) {
            case NOTIFY_STATUS.PENDING:
                if ($filter('checkRuleDepartmentRadio')(item.department, NOTIFY_RULE.APPROVE_DEPARTMENT)) {
                    allowCancel = true;
                    allowDelete = true;
                    allowApproveDepartment = true;
                }
        
                if ($rootScope.logininfo.username === item.username) {
                    allowEdit = true;
                    allowCancel = true;
                    allowDelete = true;
                }
    
                break;
            case NOTIFY_STATUS.APPROVED_BY_DEPARTMENT_LEADER:
                if ($filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD) && item.scope === NOTIFY_SCOPE.EXTERNAL) {
                    allowApprove = true;
                }
        
                if (item.scope === NOTIFY_SCOPE.INTERNAL
                    && ($rootScope.logininfo.username === item.username
                    || $filter('checkRuleDepartmentRadio')(item.department, NOTIFY_RULE.APPROVE_DEPARTMENT))) {
                    allowRequestRecall = true;
                }
        
                if ($rootScope.logininfo.username === item.username
                    || $filter('checkRuleDepartmentRadio')(item.department, NOTIFY_RULE.APPROVE_DEPARTMENT)
                ) {
                    allowCancel = true;
                }
                break;
    
            case NOTIFY_STATUS.APPROVED_LEAD_EXTERNAL:
                if ($filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD_EXTERNAL) && item.scope === NOTIFY_SCOPE.EXTERNAL) {
                    allowApprove = true;
                }
                break;
            
            case NOTIFY_STATUS.PENDING_RECALLED:
                if ($filter('checkRuleDepartmentRadio')(item.department, NOTIFY_RULE.APPROVE_DEPARTMENT)) {
                    allowApprove_recall = true;
                }
                break;
            case NOTIFY_STATUS.APPROVED_RECALL_BY_DEPARTMENT_LEADER:
                if ($filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD) && item.scope === NOTIFY_SCOPE.EXTERNAL) {
                    allowApprove_recall = true;
                }
                break;
            case NOTIFY_STATUS.APPROVED_RECALL_BY_LEADER:
                if ($filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD_EXTERNAL) && item.scope === NOTIFY_SCOPE.EXTERNAL) {
                    allowApprove_recall = true;
                }
                break;
            case NOTIFY_STATUS.APPROVED:
                if ($rootScope.logininfo.username === item.username
                    || $filter('checkRuleDepartmentRadio')(item.department, NOTIFY_RULE.APPROVE_DEPARTMENT
                    || $filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD)
                    )
                ) {
                    allowRequestRecall = true;
                }
                if($filter('checkRuleCheckbox')(NOTIFY_RULE.APPROVE_LEAD)){
                    allowRequestRecall = true;
                }
                status_to_show = "Published";
                break;
        }
    
        return {
            allowApprove,
            allowCancel,
            allowEdit,
            allowRequestRecall,
            allowApprove_recall,
            status_to_show,
            allowDelete,
            allowApproveDepartment,
            allowApproveLeadExternal
        }
    }



    /**show Infomation Details*/
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'notify-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
      };

    ctrl.code = getCode();

    function load_details_service() {
        var dfd = $q.defer();
        notify_details_service.load_details(ctrl.code).then(function (res) {
            ctrl.Item = {
                ...res.data,
                ...getPermissionProperties(res.data)
            };
            
            ctrl.thisId = res.data._id;
            var check = true;
            if(ctrl.Item.username === $rootScope.logininfo.username || ctrl.Item.employee === $rootScope.logininfo.data.employee){
                check = false;
            }
            for(var i in ctrl.Item.event){
                if(ctrl.Item.event[i].username === $rootScope.logininfo.username 
                    && ctrl.Item.event[i].employee === $rootScope.logininfo.data.employee
                    && ctrl.Item.event[i].action ==='Seen'
                    ){
                        check = false;
                        break;
                    }
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

    function reloadDetails_service() {
        var dfd = $q.defer();
        notify_details_service.reload_details(ctrl.thisId).then(function (res) {
            ctrl.Item = {
                ...res.data,
                ...getPermissionProperties(res.data)
            };
            var check = true;
            if(ctrl.Item.username === $rootScope.logininfo.username || ctrl.Item.employee === $rootScope.logininfo.data.employee){
                check = false;
            }
            for(var i in ctrl.Item.event){
                if(ctrl.Item.event[i].username === $rootScope.logininfo.username 
                    && ctrl.Item.event[i].employee === $rootScope.logininfo.data.employee
                    && ctrl.Item.event[i].action ==='Seen'
                    ){
                        check = false;
                        break;
                    }
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


    ctrl.load_file_info = function (params) {
        return function () {
            var dfd = $q.defer();
            notify_details_service.load_file_info(params.id, params.name).then(function (res) {
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

    ctrl.load_details = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "load_details", load_details_service);
    }

    ctrl.reload_details = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "load_details", reloadDetails_service);
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        notify_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    /**approval */
    function approval_service() {
        var dfd = $q.defer();
        notify_details_service.approval(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "approved";
            ctrl.reload_details();
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "approval", approval_service);
    }

    function reject_service() {
        var dfd = $q.defer();
        notify_details_service.reject(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "rejected";
            ctrl.reload_details();
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "reject", reject_service);
    }

    function like_service() {
        var dfd = $q.defer();
        notify_details_service.like(ctrl.thisId).then(function (res) {
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }



    function unlike_service() {
        var dfd = $q.defer();
        notify_details_service.unlike(ctrl.thisId).then(function (res) {
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.like = function (val) {
        val ? like_service() : unlike_service();
    }


    function edit_notify_service() {
        var dfd = $q.defer();
  
        const content = $("#edit_notify_content_detail").summernote("code");
  
        // Process added files
        const addFilePromises = ctrl._edit_value.addedFiles.map(function (file) {
          return notify_details_service.pushFile(file, ctrl._edit_value._id).then();
        });
  
        // Process removed files
        const removeFilePromises = ctrl._edit_value.removedFiles.map(function (
          filename
        ) {
          return notify_details_service.removeFile(ctrl._edit_value._id, filename);
        });
  
        notify_details_service
          .edit(
            ctrl._edit_value._id,
            ctrl._edit_value.title,
            content,
            ctrl._edit_value.group,
            ctrl._edit_value.type,
            ctrl._edit_value.to_employee,
            ctrl._edit_value.to_department,
            ctrl._edit_value.to_director,
            ctrl._edit_value.task_id,
            ctrl._edit_value.is_internal_notify
          )
          .then(
            function (res) {
              $q.all(addFilePromises.concat(removeFilePromises)).then(
                function () {
                    $rootScope.$broadcast("notifyaccessDone");
                    $('#notify_edit_modal_details').modal('hide');
                    ctrl._customToastScope.addToastValue({
                        message: $filter('l')('Update news successfully'),
                        type:"success"
                    });
                    ctrl.reload_details();
                    dfd.resolve(true);
                },
                function (err) {
                  dfd.reject(err);
                }
              );
            },
            function (err) {
              dfd.reject(err);
            }
          );
  
        return dfd.promise;
      }
  
      function approve_department_notify_service() {
        var dfd = $q.defer();
        const content = $("#edit_notify_content_detail").summernote("code");
  
  
        // Process added files
        const addFilePromises = ctrl._edit_value.addedFiles.map(function (file) {
          return notify_details_service.pushFile(file, ctrl._edit_value._id).then();
        });
  
        // Process removed files
        const removeFilePromises = ctrl._edit_value.removedFiles.map(function (
          filename
        ) {
          return notify_details_service.removeFile(ctrl._edit_value._id, filename);
        });

        notify_details_service
          .approve_department(
            ctrl._edit_value._id,
            ctrl._edit_value.title,
            content,
            ctrl._edit_value.group,
            ctrl._edit_value.type,
            ctrl._edit_value.to_employee,
            ctrl._edit_value.to_department,
            ctrl._edit_value.to_director,
            ctrl._edit_value.task_id,
            ctrl._edit_value.note,
            ctrl._edit_value.is_internal_notify,
          )
          .then(
            function (res) {
                $('#notify_edit_modal_details').modal('hide');
                ctrl._customToastScope.addToastValue({
                    message: $filter('l')('Approval news successfully'),
                    type:"success"
                });
                $q.all(addFilePromises.concat(removeFilePromises)).then(
                    function () {
                        ctrl.reload_details();
                        $rootScope.$broadcast("notify:AccessDone");
                        dfd.resolve(true);
                    },
                    function (err) {
                        dfd.reject(err);
                    }
                );
            },
            function (err) {
              dfd.reject(err);
            }
          );
  
        return dfd.promise;
      }
  
      ctrl.prepareEdit = function (item, action = 'edit') {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "edit");
        ctrl._edit_value = angular.copy(item);
        ctrl._edit_value.action = action;
        ctrl._edit_value.files = item.attachments;
        ctrl._edit_value.removedFiles = [];
        ctrl._edit_value.addedFiles = [];
        ctrl._edit_value._access_edit = false;
        if(action !== 'edit'){
            ctrl._edit_value._access_edit = true;
        }

        $("#edit_notify_content_detail").summernote({
            callbacks: {
            onChange: function (contents, $editable) {
                if ($(contents).find("img").length === 0) {
                }
            },
            },
        });

        $("#edit_notify_content_detail").summernote("code", ctrl._edit_value.content);
        if(action !== 'edit'){
            $("#edit_notify_content_detail").summernote("disable");
        }
      };
  
      ctrl.edit = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "edit",
          edit_notify_service
        );
      };
  
      ctrl.approve_department = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "approve_department",
          approve_department_notify_service
        );
      };
  
      /**delete */
      ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "delete");
        ctrl._delete_value = angular.copy(value);
      };
  
      function delete_notify_service() {
        var dfd = $q.defer();
        notify_details_service.delete(ctrl._delete_value._id).then(
          function () {
            $("#modal_Notify_Delete_details").modal("hide");
            window.location.reload();
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('Delete news successfully'),
                type:"success"
            });
            ctrl.reload_details();
            $rootScope.$broadcast("notify:AccessDone");
            dfd.resolve(true);
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      }
  
      ctrl.delete = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "delete",
          delete_notify_service
        );
      };
  
      /**throw_to_recyclebin */
      ctrl.prepareThrow_to_recyclebin = function (value) {
        $rootScope.statusValue.generate(
          ctrl._ctrlName,
          "Notify",
          "throw_to_recyclebin"
        );
        ctrl._throw_to_recyclebin_value = angular.copy(value);
      };
  
      function throw_to_recyclebin_notify_service() {
        var dfd = $q.defer();
        notify_details_service
          .throw_to_recyclebin(ctrl._throw_to_recyclebin_value._id)
          .then(
            function () {
              $("#modal_Notify_Throw_to_recyclebin_details").modal("hide");
              dfd.resolve(true);
              ctrl.reload_details();
              dfd = undefined;
            },
            function (err) {
              dfd.reject(err);
              err = undefined;
            }
          );
        return dfd.promise;
      }
  
      ctrl.throw_to_recyclebin = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "throw_to_recyclebin",
          throw_to_recyclebin_notify_service
        );
      };
  
      /**restore_from_recyclebin */
      ctrl.prepareRestore_from_recyclebin = function (value) {
        $rootScope.statusValue.generate(
          ctrl._ctrlName,
          "Notify",
          "restore_from_recyclebin"
        );
        ctrl._restore_from_recyclebin_value = angular.copy(value);
      };
  
      function restore_from_recyclebin_notify_service() {
        var dfd = $q.defer();
        notify_details_service
          .restore_from_recyclebin(ctrl._restore_from_recyclebin_value._id)
          .then(
            function () {
              $("#modal_Notify_Restore_from_recyclebin_details").modal("hide");
              dfd.resolve(true);
              ctrl.reload_details();
              dfd = undefined;
            },
            function (err) {
              dfd.reject(err);
              err = undefined;
            }
          );
        return dfd.promise;
      }
  
      ctrl.restore_from_recyclebin = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "restore_from_recyclebin",
          restore_from_recyclebin_notify_service
        );
      };
  
      ctrl.prepareApprove = function (item) {
        ctrl.status = 'approve';
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "approve");
        ctrl._approve_value = angular.copy(item);
        ctrl._approve_value.files = item.attachments;
        ctrl._approve_value._access_edit = true;
  
        $("#approval_notify_content_details").summernote({
          callbacks: {
            onChange: function (contents, $editable) {
              if ($(contents).find("img").length === 0) {
              }
            },
          },
        });
  
        $("#approval_notify_content_details").summernote("code", ctrl._approve_value.content);
        if(ctrl._approve_value._access_edit){
          $("#approval_notify_content_details").summernote("disable");
        }
  
        if (item.allowApprove_recall) {
          const pendingRecalledEvent = item.event.find(event => event.status === "PendingRecalled");
          const reason = pendingRecalledEvent ? pendingRecalledEvent.reason : null;
  
          ctrl._approve_value.recall_reason = reason;
        }
      };
  
      ctrl.prepareRecalla = function (item) {
        ctrl.status = 'recall';
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "approve");
        ctrl._approve_value = angular.copy(item);
        ctrl._approve_value.files = item.attachments;
        ctrl._approve_value._access_edit = true;
  
        $("#approval_notify_content_details").summernote({
          callbacks: {
            onChange: function (contents, $editable) {
              if ($(contents).find("img").length === 0) {
              }
            },
          },
        });
  
        $("#approval_notify_content_details").summernote("code", ctrl._approve_value.content);
        if(ctrl._approve_value._access_edit){
          $("#approval_notify_content_details").summernote("disable");
        }
  
        if (item.allowApprove_recall) {
          const pendingRecalledEvent = item.event.find(event => event.status === "PendingRecalled");
          const reason = pendingRecalledEvent ? pendingRecalledEvent.reason : null;
  
          ctrl._approve_value.recall_reason = reason;
        }
      };
  
      ctrl.prepareReject = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "reject");
        ctrl._reject_value = angular.copy(value);
      };
  
      ctrl.approve = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "approve",
          approve_notify_service
        );
      };
  
      ctrl.reject = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "reject",
          reject_notify_service
        );
      };
  
      function approve_notify_service() {
        var dfd = $q.defer();
        const note = ctrl._approve_value.note;
        notify_details_service.approve(ctrl._approve_value._id, note).then(
          function () {
            $("#notify_approve_modal_details").modal("hide");
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('Approval news successfully'),
                type:"success"
            });
            ctrl.reload_details();
            $rootScope.$broadcast("notify:AccessDone");
            dfd.resolve(true);
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      }
  
      function reject_notify_service() {
        var dfd = $q.defer();
        notify_details_service
          .reject(ctrl._approve_value._id, ctrl._approve_value.note)
          .then(
            function () {
                $("#notify_reject_modal_details").modal("hide");
                $("#notify_approve_modal_details").modal("hide");
                ctrl._customToastScope.addToastValue({
                    message: $filter('l')('Reject news successfully'),
                    type:"success"
                });
                ctrl.reload_details();
                $rootScope.$broadcast("notify:AccessDone");
                dfd.resolve(true);
                dfd = undefined;
            },
            function (err) {
              dfd.reject(err);
              err = undefined;
            }
          );
        return dfd.promise;
      }
  
      /**recall */
      ctrl.prepareRecall = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "recall");
        ctrl._recall_value = angular.copy(value);
      };
  
      function recall_notify_service() {
        var dfd = $q.defer();
        notify_details_service.recall(ctrl._recall_value._id, ctrl._recall_value.reason).then(
          function () {
            $("#modal_Notify_Recall_details").modal("hide");
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('Recall news successfully'),
                type:"success"
            });
            dfd.resolve(true);
            ctrl.reload_details();
            $rootScope.$broadcast("notify:AccessDone");
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      }
  
      ctrl.recall = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "Notify",
          "recall",
          recall_notify_service
        );
      };

    function init() {
        const dfd = $q.defer();
        if (ctrl.code) {
            ctrl.load_details().then(function(){

            }, function(err){
                dfd.reject(err)
            });
        }
        return dfd.promise;
    }
    
    init();
}]);
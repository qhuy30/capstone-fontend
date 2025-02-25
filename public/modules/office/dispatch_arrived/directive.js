myApp.compileProvider.directive("dispatchArrivedDetails", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/dispatch_arrived/directives/dispatch_arrived_details.html",
        scope: {
            itemId: "<",
            itemCode: "<",
            setBreadcrumb: "&",
        },
        controller: [
            "da_details_service",
            "dispatch_arrived_service",
            "$q",
            "$scope",
            "$rootScope",
            "$filter",
            function (da_details_service, dispatch_arrived_service, $q, $scope, $rootScope, $filter) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "DA", action: "loadDetails" },
                    { name: "DA", action: "handling" },
                    { name: "DA", action: "forward" },
                    { name: "DA", action: "response" },
                    { name: "DA", action: "update" },
                    { name: "DA", action: "getNumber" },
                    { name: "DA", action: "load" },
                    { name: "DA", action: "receive" },
                    { name: "Task", action: "loadDetails" },
                    { name: "Notify", action: "insert" },
                    { name: "DA", action: "forward_CVP" },
                    { name: "DA", action: "forward_BGHOpinion" },
                    { name: "DA", action: "forwar_unit" },
                    { name: "DA", action: "transfer_department_approve" },
                    { name: "DA", action: "seen_work" },
                ];
                var ctrl = $scope.ctrl = this;

                /** init variable */
                {
                    ctrl._ctrlName = "da_details_controller";
                    ctrl._insert_value = {};
                    ctrl.yearData = Array.from({ length: 2051 - 2000 }, (_, i) => 2000 + i);

                    ctrl.statusList = [
                        {
                            title: "All",
                        },
                        {
                            title: "Processing",
                        },
                        {
                            title: "Completed",
                        },
                        {
                            title: "NotStartedYet",
                        },
                        {
                            title: "Done",
                        },
                    ];

                    ctrl.IncommingDispatchBook_Config = {
                        master_key: "incomming_dispatch_book",
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

                    ctrl.DocumentType_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };

                    ctrl.TaskPriority = {
                        master_key: "task_priority",
                        load_details_column: "value",
                    };
                    ctrl.Field_Config = {
                        master_key: "field",
                        load_details_column: "value"
                      };
                
                    // Security level
                    ctrl.securityLevel_Config = {
                    master_key: "security_level",
                    load_details_column: "value",
                    };

                    ctrl.TaskType = {
                    master_key: "task_type",
                    load_details_column: "value",
                    };
                    

                    ctrl.forward = [];
                    ctrl.Departments = [];
                    ctrl.Item = {};
                    ctrl.status = "see";
                    ctrl.comment = "";
                    ctrl.commentSignKnowledge = "";
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
                    ctrl._update_value = {};
                    ctrl._forward_value = {};

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                    ctrl._numberUsed = [];

                    ctrl._urlForwardModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_forward.html";
                    ctrl._urlUpdateModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_update.html";
                    ctrl._urlReceiveModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_receive.html";
                    ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
                }

                const DISPATCH_SCOPE = {
                    INTERNAL: "internal",
                    EXTERNAL: "external"
                }

                const RULE_DISPATCH = {
                    USE:"Office.DispatchArrived.Use",
                    CREATE:"Office.DispatchArrived.Manager",
                    LEAD_DEPARTMENT:"Office.DispatchArrived.Lead",
                    LEAD_EXTERNAL:"Office.DispatchArrived.ApproveLevel1",
                    FOLLOW:"Office.DispatchArrived.FollowDA",
                    LEAD_CONFIRM:"Office.DispatchArrived.Confirm"
                }

                const DISPATCH_STATUS = {
                    CREATED: "Created",
                    WAITING_LEAD_DERPARTMENT_APPROVE: "WaitingLeadDepartmentApprove",
                    WAITING_LEAD_EXTERNAL_APPROVE: "WaitingLeadExternalApprove",
                    LEAD_TRANSFER_DEPARTMENT: "LeadTransferDepartment",
                    APPROVED: "Approved",
                    PENDING_RECEIPT: "PendingReceipt"
                }
                
                ctrl.pickDAT_insert = function(val){
                    ctrl._insert_value.type = val.value;
                }
                ctrl.chooseYear = function (val) {
                    ctrl._filterYear = val;
                    ctrl.refreshData();
                };
                ctrl.refreshData = function () {
                    var dfdAr = [];
                    resetPaginationInfo();
                    dfdAr.push(ctrl.load());
                    dfdAr.push(ctrl.count());
                    $q.all(dfdAr);
                }


                ctrl.loadEmployee = function (params) {
                    var dfd = $q.defer();
                    da_details_service.loadEmployee(params.id).then(
                        function (res) {
                            dfd.resolve(res.data);
                        },
                        function () {
                            dfd.reject(false);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                };

                ctrl.loadEmployee_task = function (params) {
                    var dfd = $q.defer();
                    da_details_service.loadEmployee_task(params.id).then(
                        function (res) {
                            dfd.resolve(res.data);
                        },
                        function () {
                            dfd.reject(false);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                };
                ctrl.loadDepartmentReceiver = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        da_details_service
                            .loadDepartment_details(params.id)
                            .then(
                                function (res) {
                                    dfd.resolve({
                                        title_search: res.data.title_search
                                    });
                                    res = undefined;
                                    dfd = undefined;
                                },
                                function () {}
                            );
                        return dfd.promise;
                    };
                };

                ctrl.loadfile = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        da_details_service
                            .loadFileInfo(params.id, params.name)
                            .then(
                                function (res) {
                                    dfd.resolve({
                                        display: res.data.display,
                                        embedUrl: res.data.url,
                                        guid: res.data.guid,
                                    });
                                    res = undefined;
                                    dfd = undefined;
                                },
                                function () {}
                            );
                        return dfd.promise;
                    };
                };
                /**show Infomation Details*/

                function removeHtmlTags(str) {
                    return str.replace(/<\/?[^>]+(>|$)/g, "");
                }
                
                ctrl.checkRuleToTaskDetails = function(task) {
                    if (
                        task.username === $rootScope.logininfo.data.username &&
                        task.department.id === $rootScope.logininfo.data.department
                      ) {
                        return true;
                      }
                    if (task.main_person.indexOf($rootScope.logininfo.username) !== -1
                        || task.participant.indexOf($rootScope.logininfo.username) !== -1
                        || task.observer.indexOf($rootScope.logininfo.username) !== -1) {
                            return true;
                        }

                    const editTaskDepartmentRule = $rootScope.logininfo.data.rule.find(rule => rule.rule === 'Office.Task.View_Task_Department');
                    if (editTaskDepartmentRule) {
                        switch (editTaskDepartmentRule.details.type) {
                            case "All":
                                return true;
                            case "NotAllow":
                                return false;
                            case "Specific":
                                if(editTaskDepartmentRule.details.department.indexOf(task.department) === 1) {
                                    return true;
                                }else{
                                    return false;
                                }
                            case "Working":
                                if(task.department.id === $rootScope.logininfo.data.department){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                        }
                    }
                           
                };
                const currentYear = new Date().getFullYear();
                    this.years = Array.from({ length: 21 }, (_, i) => currentYear + i);
                    this.selectedYear = currentYear;
                
                ctrl.loadDetails = function () {
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "loadDetails",
                        loadDetails_service
                    );
                };

                function init() {
                    ctrl.loadDetails();
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

                ctrl._hintNoteSet = [
                    'I agree',
                    'I approve',
                    'Processed'
                ];

                ctrl.set_hint_note = function(note) {
                    ctrl._forward_value.note = $filter('l')(note);
                };


                /** Forward */

                ctrl._hintNoteSet = [
                    'I agree',
                    'I approve',
                    'Processed'
                ];
                ctrl.function_apply_suggestions = ['da'];
                ctrl.set_hint_note = function(note) {
                    ctrl._forward_value.note = $filter('l')(note);
                };

                ctrl.prepareForward = function (value) {
                    ctrl._forward_value = angular.copy(value);
                    ctrl._forward_value.incoming_file_remove = [];
                    ctrl._forward_value.attachments_remove = [];
                    ctrl._numberUsed = [];
                    $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "forward");
                };
                ctrl.removeFileAttachment_forward = function (item) {
                    if (item.id) {
                      ctrl._forward_value.attachments_remove.push(item.id);
                    }
                    ctrl._forward_value.attachments = ctrl._forward_value.attachments.filter(file => file.name !== item.name);
                };
                ctrl.removeFile_forward = function (item) {
                    if (item.id) {
                        ctrl._forward_value.incoming_file_remove.push(item.id);
                    }
                    ctrl._forward_value.incoming_file = ctrl._forward_value.incoming_file.filter((file) => file.name !== item.name);
                }

                ctrl.forward_CVP = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forward_CVP", access_service("forward_CVP"));
                }

                ctrl.pickViewOnlyDepartment_forward = function (val) {
                    ctrl._forward_value.department_receiver_ar = angular.copy(val);
                };
                ctrl.chooseSubmissionDepartment_forward = function (val) {
                    ctrl._forward_value.department_execute = val.id;
                };


                ctrl.forward_BGHOpinion = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forward_BGHOpinion", access_service("forward_BGHOpinion"));
                }

                ctrl.return_CVP = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "return_CVP", access_service("return_CVP"));
                }

                ctrl.forward_unit = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forwar_unit", access_service("forwar_unit"));
                }

                ctrl.transfer_department_approve = function (params) {
                    ctrl._forward_value = ctrl.Item;
                    ctrl._forward_value.note = params;
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "transfer_department_approve", access_service("transfer_department_approve"));
                }

                ctrl.seen_work = function (params) {
                    ctrl._forward_value = ctrl.Item;
                    ctrl._forward_value.note = params;
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "seen_work", access_service("seen_work"));
                }

                ctrl.update = function (){
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "update", access_service("update"));
                }

                function genDataForward(item){
                    const data = {};
                    data.id = item._id;
                    data.code = item.code;
                    data.content = item.content;
                    data.date_sign = item.date_sign;
                    data.expried = item.expried;
                    data.content = item.content;
                    data.department_execute = item.department_execute;
                    data.department_receiver = item.department_receiver_ar;
                    data.field = item.field;
                    data.incoming_number = item.incoming_number;
                    data.incomming_date = item.incomming_date;
                    data.note = item.note;
                    data.security_level = item.security_level;
                    data.sending_place = item.sending_place;
                    data.symbol_number = item.symbol_number;
                    data.type = item.type;
                    data.urgency_level = item.urgency_level;
                    data.year = item.year;
                    data.attachments_remove = item.attachments_remove;
                    data.incoming_file_remove = item.incoming_file_remove;
                    data.attachments = item.attachments;
                    data.incoming_file = item.incoming_file;
                    if(Array.isArray(item.task_label)){
                        data.task_label = item.task_label;
                    }else{
                        data.task_label = [];
                    }

                    return data;
                }

                function genDataUpdate(item){
                    const data = {};
                    data.id = item._id;
                    data.code = item.code;
                    data.content = item.content;
                    data.date_sign = item.date_sign;
                    data.expried = item.expried;
                    data.content = item.content;
                    data.department_execute = item.department_execute;
                    data.department_receiver = item.department_receiver_ar;
                    data.field = item.field;
                    data.incoming_number = item.incoming_number;
                    data.incomming_date = item.incomming_date;
                    data.security_level = item.security_level;
                    data.sending_place = item.sending_place;
                    data.symbol_number = item.symbol_number;
                    data.type = item.type;
                    data.urgency_level = item.urgency_level;
                    data.year = item.year;
                    data.attachments_remove = item.attachments_remove;
                    data.incoming_file_remove = item.incoming_file_remove;
                    data.attachments = item.attachments;
                    data.incoming_file = item.incoming_file;
                    if(Array.isArray(item.task_label)){
                        data.task_label = item.task_label;
                    }else{
                        data.task_label = [];
                    }
                    return data;
                }
            
            
                function access_service(action) {
                    return function () {
                        var dfd = $q.defer();
                        let dfdAr = [];
                        let data;
                        let messageSuccess ='Success';
                        switch (action) {
                            case "forward_CVP":
                                data = genDataForward(ctrl._forward_value);
                                messageSuccess = 'Forward to CVP successfully';
                                dfdAr.push(da_details_service.forward_CVP(data));
                                break;
                            case "forward_BGHOpinion":
                                data = genDataForward(ctrl._forward_value);
                                messageSuccess = 'Forward to BGHOpinion successfully';
                                dfdAr.push(da_details_service.forward_BGHOpinion(data));
                                break;
                            case "forwar_unit":
                                data = genDataForward(ctrl._forward_value);
                                messageSuccess = 'Forward to unit successfully';
                                dfdAr.push(da_details_service.forwar_unit(data));
                                break;
                            case "return_CVP":
                                data = genDataForward(ctrl._forward_value);
                                messageSuccess = 'Return to CVP successfully';
                                dfdAr.push(da_details_service.return_CVP(data));
                                break;
                            case "transfer_department_approve":
                                messageSuccess = 'Reciver work for dispatch successfully';
                                dfdAr.push(da_details_service.transfer_department_approve(ctrl._forward_value._id, ctrl._forward_value.note));
                                break;
                            case "seen_work":
                                messageSuccess = 'Seen work for dispatch';
                                dfdAr.push(da_details_service.seen_work(ctrl._forward_value._id, ctrl._forward_value.note));
                                break;
                            case "update":
                                messageSuccess = 'Update successfully';
                                data = genDataUpdate(ctrl._forward_value);
                                dfdAr.push(da_details_service.update(data));
                                break;
                        }
                        $q.all(dfdAr).then(function () {
                            ctrl.loadDetails();
                            ctrl._customToastScope.addToastValue({
                                message: $filter('l')(messageSuccess),
                                type:"success"
                            });
                            $rootScope.statusValue.generate(ctrl._ctrlName, "DA", action);
                            $("#modal_DA_Forward").modal('hide');
                            dfd.resolve(true);
                            dfd = undefined;
                        }, function (err) {
                            dfd.reject(err);
                            err = undefined;
                        });
                        return dfd.promise;
                    }
                }

                // Receive ------------->>
                ctrl.IncommingBook_Filter_External = [{ unit: { $eq: DISPATCH_SCOPE.EXTERNAL } }];
                ctrl.IncommingBook_Filter_Internal = [{ unit: { $eq: DISPATCH_SCOPE.INTERNAL } }, { deparment_used: { $in: [$rootScope.logininfo.data.department] } }];

                ctrl.prepareReceive = function (item) {
                    $rootScope.$broadcast("pickModalDirectory:initLoad");
                    ctrl._receive_value = angular.copy(item);
                    ctrl._receive_value.note = "";
                    ctrl._receive_value.department_receiver_ar = [];
                    ctrl._receive_value.incoming_file_remove = [];
                    ctrl._receive_value.attachments_remove = [];
                    ctrl._receive_value.incoming_number_old = ctrl._receive_value.incoming_number * 1;
                    load_details_incomming_dispatch(ctrl._receive_value.code).then(function (data) {
                        if (data.used_values) {
                            ctrl._numberUsed = data.used_values;
                        } else {
                            ctrl._numberUsed = [];
                        }
                    });
                    if (ctrl._receive_value.department_receiver && ctrl._receive_value.department_receiver.length > 0) {
                        ctrl._receive_value.department_receiver_ar = ctrl._receive_value.department_receiver.map(item => item.department)
                    }
                    $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "receive");
                }

                function receive_service() {
                    var dfd = $q.defer();
                    const { _id, odb_id, note, code, incoming_number, field } = ctrl._receive_value;

                    dispatch_arrived_service.receive(_id, odb_id, note, code, "" + incoming_number, field).then(
                        function () {
                            $("#modal_DA_Receive").modal("hide");
                            ctrl._customToastScope.addToastValue({
                                message: $filter('l')("DepartmentReceived"),
                                type: "success"
                            });
                            dfd.resolve(true);
                            ctrl.loadDetails();
                            dfd = undefined;
                        },
                        function (err) {
                            dfd.reject(err);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                }

                ctrl.receive = function (params) {
                    ctrl._forward_value.note = params;
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "receive",
                        receive_service
                    );
                };

                ctrl.pickDAB_receive = function (val) {
                    ctrl._receive_value.code = val.value;
                    if (val.used_values) {
                        ctrl._numberUsed = val.used_values;
                    } else {
                        ctrl._numberUsed = [];
                    }
                    ctrl._receive_value.incoming_number = Math.max(...[...ctrl._numberUsed, 0]) + 1;
                    ctrl._receive_value.invalid_incoming_number = false;
                };

                ctrl.change_incoming_number_receive = function () {
                    if (ctrl._numberUsed.filter(item => item !== ctrl._receive_value.incoming_number_old).includes(ctrl._receive_value.incoming_number * 1) || ctrl._receive_value.incoming_number * 1 === 0) {
                        ctrl._receive_value.invalid_incoming_number = true;
                    } else {
                        ctrl._receive_value.invalid_incoming_number = false;
                    }
                }

                ctrl.pickField_receive = function (val) {
                    ctrl._receive_value.field = val.value;
                }
                // Receive -------------<<

                ctrl.chooseSubmissionDepartment_forward = function (val) {
                    ctrl._forward_value.department_execute = val.id;
                };

                ctrl.loadDetails = function () {
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "loadDetails",
                        loadDetails_service
                    );
                };

                ctrl.change_incoming_number_forward = function(){
                    if(ctrl._numberUsed.filter(item => item !== ctrl._forward_value.incoming_number_old).includes(ctrl._forward_value.incoming_number * 1) || ctrl._forward_value.incoming_number * 1 === 0){
                      ctrl._forward_value.invalid_incoming_number = true;
                    }else{
                      ctrl._forward_value.invalid_incoming_number = false;
                    }
                }

                ctrl.pickDAB_forward = function (val) {
                    ctrl._forward_value.code = val.value;
                    if(val.used_values){
                      ctrl._numberUsed = val.used_values;
                    }else{
                      ctrl._numberUsed = [];
                    }
                    ctrl._forward_value.incoming_number = Math.max(...[...ctrl._numberUsed, 0]) + 1;
                    ctrl._forward_value.invalid_incoming_number = false;
                };

                ctrl.prepareAssess = function ({ item, action }) {
                    ctrl._forward_value = angular.copy(item);
                    load_details_incomming_dispatch(ctrl._forward_value.code).then(function(data){
                        if(data.used_values){
                            ctrl._numberUsed = data.used_values;
                        }else{
                            ctrl._numberUsed = [];
                        }
                    });
                    ctrl._forward_value.action = action;
                    ctrl._forward_value.note = "";
                    ctrl._forward_value.show_note = true;
                    ctrl._forward_value.incoming_file_remove = [];
                    ctrl._forward_value.attachments_remove = [];
                    ctrl._forward_value.incoming_number_old = ctrl._forward_value.incoming_number * 1;
                    if (ctrl._forward_value.department_receiver && ctrl._forward_value.department_receiver.length > 0) {
                        ctrl._forward_value.department_receiver_ar = ctrl._forward_value.department_receiver.map(subItem => subItem.department || null);
                      } else {
                        ctrl._forward_value.department_receiver_ar = [];
                      }
                    switch (action) {
                        case "forward_CVP":
                            ctrl._forward_value.note_placeholder = $filter('l')('You need to note for forward dispatch arrived');
                            ctrl._forward_value.note_required = true;
                            break;
                        case "forward_BGHOpinion":
                            ctrl._forward_value.note_placeholder = $filter('l')('You need to note for forward dispatch arrived');
                            ctrl._forward_value.note_required = true;
                            break;
                        case "forward_unit":
                            ctrl._forward_value.note_placeholder = $filter('l')('You need to note for forward dispatch arrived');
                            ctrl._forward_value.note_required = true;
                            break;
                        case "return_CVP":
                            ctrl._forward_value.note_placeholder = $filter('l')('You need to note for return dispatch arrived');
                            ctrl._forward_value.note_required = true;
                            break;
                        case "update":
                            ctrl._forward_value.show_note = false;
                            break;
                    }
                    $rootScope.statusValue.generate(ctrl._ctrlName, "DA", action);
                }

                function load_details_incomming_dispatch(value) {
                    const dfd = $q.defer();

                    da_details_service.load_detail_incomming_dispatchBook(value).then(function(res){
                        dfd.resolve(res.data[0]);
                    }, function(err){ dfd.reject(err); });

                    return dfd.promise;
                }

                ctrl.loadLabel = function ({ search, top, offset, sort }) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.load_label(search, top, offset, sort).then(
                      function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                      },
                      function (err) {
                        dfd.reject(err);
                        err = undefined;
                      }
                    );
                    return dfd.promise;
                  };
              
                  ctrl.loadLabel_details = function ({ ids }) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.loadLabel_details(ids).then(
                      function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                      },
                      function (err) {
                        dfd.reject(err);
                        err = undefined;
                      }
                    );
                    return dfd.promise;
                  };
              
                  ctrl.pickLabelDA_update = function (value) {
                    ctrl._update_value.task_label = value;
                  };
              
                  ctrl.pickLabelDA_insert = function (value) {
                    ctrl._insert_value.task_label = value;
                  };
              
                  ctrl.pickLabel = function (value) {
                    ctrl._forward_value.task_label = value;
                  };

                function getPermissionProperties(item) {
                    let statusShow = "";
                    let allow_delete = false;
                    let allow_edit = false;
                    let allow_forward_CVP = false;
                    let allow_forward_BGH = false;
                    let allow_forward_unit = false;
                    let allow_reciver_work = false;
                    let allow_seen_work = false;
                    let allow_return_CVP = false;
                    let allow_reciver_internal = false;
              
                    if (item.scope === DISPATCH_SCOPE.EXTERNAL) {
                      switch (item.status) {
                          case DISPATCH_STATUS.CREATED:
                              if (item.username === $rootScope.logininfo.username) {
                                  allow_edit = true;
                                  allow_delete = true;
                                  allow_forward_CVP = true;
                              }
                              statusShow = "Created";
                              break;
                          case DISPATCH_STATUS.WAITING_LEAD_DERPARTMENT_APPROVE:
                              if ($filter('checkRuleCheckbox')(RULE_DISPATCH.LEAD_DEPARTMENT)) {
                                  allow_forward_BGH = true;
                                  allow_forward_unit = true;
                                  allow_edit = true;
                              }
                              statusShow = "WaitingLeadDepartmentApprove";
                              break;
                          case DISPATCH_STATUS.WAITING_LEAD_EXTERNAL_APPROVE:
                              if ($filter('checkRuleCheckbox')(RULE_DISPATCH.LEAD_EXTERNAL)) {
                                  allow_return_CVP = true;
                                  allow_forward_unit = true;
                                  allow_edit = true;
                              }
                
                              statusShow = "WaitingLeadExternalApprove";
                              break;
                          case DISPATCH_STATUS.LEAD_TRANSFER_DEPARTMENT:
                              if ($filter('checkRuleDepartmentRadio')(item.department_execute, RULE_DISPATCH.LEAD_CONFIRM)) {
                                  allow_reciver_work = true;
                              }
                              if (checkRuleSeenWork(item)) {
                                allow_seen_work = true;
                              }
                              statusShow = 'LeadTransferDepartment';
                              break;
                          
                          case DISPATCH_STATUS.APPROVED:
                              if (checkRuleSeenWork(item)) {
                                  allow_seen_work = true;
                              }
                              statusShow = 'Approved';
                              break;  
                      }
                    } 
                    else if (item.scope === DISPATCH_SCOPE.INTERNAL) {
                      switch (item.status) {
                        case DISPATCH_STATUS.PENDING_RECEIPT:
                          if (checkRuleReceiveWork(item)) {
                            allow_reciver_internal = true;
                          }
                          statusShow = 'Approved';
                          break;
                      }
                    }
              
                    return {
                        statusShow,
                        allow_delete,                   
                        allow_edit,
                        allow_forward_CVP,
                        allow_forward_BGH,
                        allow_forward_unit,
                        allow_reciver_work,
                        allow_seen_work,
                        allow_return_CVP,
                        allow_reciver_internal
                    }
                }

                function hasMatchingDepartment(item, condition) {
                    if (!$filter('checkRuleCheckbox')(RULE_DISPATCH.FOLLOW)) {
                        return false;
                    }
                
                    // Kiểm tra nếu không có department_receiver hoặc mảng rỗng
                    if (!item.department_receiver || item.department_receiver.length === 0) {
                        return false;
                    }
                
                    // Tìm phòng ban thỏa mãn điều kiện
                    return item.department_receiver.some(department => 
                        department.department === $rootScope.logininfo.data.department && condition(department)
                    );
                }
              
                // Hàm kiểm tra phòng ban chưa xem
                function checkRuleSeenWork(item) {
                    return hasMatchingDepartment(item, department => !department.seen);
                }
                // Hàm kiểm tra phòng ban đã nhận
                function checkRuleReceiveWork(item) {
                    return hasMatchingDepartment(item, () => true); // Không có điều kiện bổ sung
                }

                // function checkRuleSeenWork(item) {

                //     if(!$filter('checkRuleCheckbox')(RULE_DISPATCH.FOLLOW)){
                //         return false;
                //     }
                //     // Kiểm tra nếu không có department_receiver hoặc mảng rỗng
                //     if (!item.department_receiver || item.department_receiver.length === 0) {
                //         return false;
                //     }
                //     // Tìm phòng ban đáp ứng điều kiện rule dispatch
                //     const unreviewedDepartment = item.department_receiver.find(department => {
                //         return department.department === $rootScope.logininfo.data.department && !department.seen;
                //     });
                
                //     // Trả về true nếu tìm thấy phòng ban chưa xem và thỏa mãn điều kiện rule
                //     return !!unreviewedDepartment;
                // }

                function loadDetails_service() {
                    var dfd = $q.defer();                    
                    da_details_service.loadDetails(ctrl.thisId, ctrl.code).then(
                        function (res) {
                            ctrl.Item = {
                                ...res.data,
                                ...getPermissionProperties(res.data)
                            };
                            $scope.setBreadcrumb && $scope.setBreadcrumb({
                                params: [
                                    ...(ctrl.Item.parents || []).reverse(),
                                    { object: 'dispatch_arrived', id: ctrl.Item.thisId, code: ctrl.Item.symbol_number },
                                ]
                            });
                            if(ctrl.Item.department_receiver && ctrl.Item.department_receiver.length > 0){
                                ctrl.Item.department_receiver_ar = ctrl.Item.department_receiver.map(item => item.department)
                            }else{
                                ctrl.Item.department_receiver_ar = [];
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

                $(document).on(
                    "hide.bs.modal",
                    "#modal_DA_Dir_Update",
                    "#modal_DA_Forward",
                    function (e) {
                        if (e.target.id == "modal_DA_Dir_Update") {
                            init();
                        }
                        if (e.target.id == "modal_DA_Forward") {
                            init();
                        }
                    }
                );
            },
        ],
    };
});

myApp.compileProvider.directive("outgoingDispatchDetails", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/dispatch_arrived/directives/outgoing_dispatch_details.html",
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
                    { name: "OD", action: "update" },
                ];
                var ctrl = ($scope.ctrl = this);
                /** init variable */
                {
                    ctrl._ctrlName = "odb_details_controller";

                    ctrl.LaborContractType_Config = {
                        master_key: "larbor_contract_type",
                        load_details_column: "value"
                    };
                    ctrl.IncommingDispatchBook_Config = {
                        master_key: "incomming_dispatch_book",
                        load_details_column: "value",
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

                    ctrl.DocumentType_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };
                    ctrl.Field_Config = {
                        master_key: "field",
                        load_details_column: "value"
                    };
                    ctrl.securityLevel_Config = {
                        master_key: "security_level",
                        load_details_column: "value",
                    };

                    ctrl._update_value = {};
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

                    ctrl._urlUpdateModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/outgoing_dispatch_update.html";

                }

                ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
                    let today = new Date();
                    let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    if (isInsert) {
                        return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
                    } else {
                        return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
                    }
                }
                
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
                                    { object: 'odb', id:ctrl.Item.thisId, code: ctrl.Item.symbol_number },
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

                // Update
                ctrl.prepareUpdate = function (value) {
                    $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "update");
                    ctrl._update_value = angular.copy(value);
                    ctrl._update_value.outgoing_file_remove = [];
                    ctrl._update_value.attachments_remove = [];
                };
            
                ctrl.pickYear_update = function (val) {
                    ctrl._update_value.year = val;
                };
                  
                
                ctrl.pickCode_update = function (val){
                    ctrl._update_value.code = val.value;     
                }
            
                ctrl.pickType_update = function(val){
                    ctrl._update_value.type = val.value;
                }
            
                ctrl.pickDeparmentWrite_update = function (val) {
                    ctrl._update_value.departmemt_write = val.id;
                };
            
                ctrl.pickDateSign_update = function (val) {
                    ctrl._update_value.date_sign = val.getTime();
                };
            
                ctrl.pickPersonSign_update = function(param){
                    ctrl._update_value.person_sign = param;
                }
                
                ctrl.pickExpireDate_update = function (val) {
                    ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
                    ctrl._update_value.expiration_date = val ? val.getTime() : null;
                };
            
                ctrl.pickUrgencyLevel_update = function(val){
                    ctrl._update_value.urgency_level = val.value;
                }
            
                ctrl.pickSecurityLevel_update = function(val){
                    ctrl._update_value.security_level = val.value;
                }
            
                ctrl.pickOtherDestination_update = function (val) {
                    ctrl._update_value.other_destination = angular.copy(val);
                };
            
                ctrl.removeOutgoingDocuments_update = function (item) {
                    if (item.id) {
                        ctrl._update_value.outgoing_file_remove.push(item.id);
                    }
                    ctrl._update_value.outgoing_file = ctrl._update_value.outgoing_file.filter(file => file.name !== item.name);
                };
            
                ctrl.removeAttachDocuments_update = function (item) {
                    if (item.id) {
                        ctrl._update_value.attachments_remove.push(item.id);
                    }
                    ctrl._update_value.attachments = ctrl._update_value.attachments.filter(file => file.name !== item.name);
                }

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



myApp.compileProvider.directive("dispatchArrivedUpdate", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/dispatch_arrived/directives/dispatch_arrived_update.html",
        scope: {
            item: "<",
            handleSuccessFunc: "&",
            insertDispatchArrivedId: '<',
            insertCurrentProject: '<',
            draft: '<',
            target: '@',
            noCommit: '<',
            initValue: '<',
            parentItem:"<",
            parentType:"<"
        },
        controller: [
            "dispatch_arrived_service",
            "task_service",
            "$q",
            "$scope",
            "$rootScope",
            "$filter",
            function (dispatch_arrived_service, task_service, $q, $scope, $rootScope, $filter) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "DA", action: "getNumber" },
                    { name: "DA", action: "update" },
                    { name: "DA", action: "pushFile" },
                    { name: "DA", action: "removeFile" },
                    { name: "Task", action: "delete" },
                    { name: "Task", action: "insert" },
                    { name: "Task", action: "update" }
                ];
                var ctrl = ($scope.ctrl = this);
                var idEditor = "updateTask_content";
                /** init variable */
                {
                    ctrl._ctrlName = "da_update_controller";
                    ctrl._update_value = {};
                    ctrl._update_tasks = [];/*  */
                    ctrl._task_value =[];
                    
                    ctrl.IncommingDispatchBook_Config = {
                        master_key: "incomming_dispatch_book",
                        load_details_column: "value",
                    };

                    ctrl.DocumentType_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };

                    ctrl.IncommingDispatchPririoty_Config = {
                        master_key: "incomming_dispatch_priority",
                        load_details_column: "value",
                    };
                    ctrl.TaskPriority = {
                        master_key: "task_priority",
                        load_details_column: "value"
                    };
                    ctrl.TaskType = {
                        master_key: "task_type",
                        load_details_column: "value"
                    };
                    ctrl.Field_Config = {
                        master_key: "field",
                        load_details_column: "value"
                    };

                    ctrl._urlDeleteTaskModal = FrontendDomain + "/modules/office/dispatch_arrived/views/delete_task_modal.html";

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                ctrl.prepareUpdate = function () {
                    $rootScope.statusValue.generate(
                        ctrl._ctrlName,
                        "DA",
                        "update"
                    );
                    ctrl._update_value = angular.copy($scope.item);             
                    ctrl._update_value.department_receiver = ($scope.item.department_receiver || []).map(department => department.department.id);
                    ctrl._update_value.files = ($scope.item.attachments || []).map((attachment) => ({
                        origName: attachment.name,
                        name: attachment.display,
                    }));
                    if (ctrl._update_value.is_assign_task){
                        ctrl._task_value = $scope.item.tasks[0] || [];
                        const priority = dispatch_arrived_service.taskPriorityTransform(ctrl._task_value.priority);
                        ctrl._task_value._filterTaskPriority = priority.value;
                        const taskType = task_service.taskTypeTransform(ctrl._task_value.task_type);
                        ctrl._task_value._filterTaskType = taskType.value;
                        $("#" + idEditor).summernote('code',ctrl._task_value.content);
                    }
                };




                function getNumber_update(da_code) {
                    return function () {
                        var dfd = $q.defer();
                        dispatch_arrived_service.get_number(da_code).then(
                        function (res) {
                            ctrl._update_value.incoming_number = res.data.incoming_number;
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
                    };
                }
                ctrl.pickDAB_update = function (val) {
                    ctrl._update_value.code = val.value;
                    $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "getNumber",
                        getNumber_update(ctrl._update_value.da_code)
                    );
                };
                ctrl.pickField_update = function (val){
                    ctrl._update_value.field = val.value;
                }

                ctrl.chooseReleaseDate_update = function (val) {
                    ctrl._update_value.release_date = val.getTime();
                };
    
                ctrl.chooseTransferDate_update = function (val) {
                    ctrl._update_value.transfer_date = val.getTime();
                };
                ctrl.chooseDateSign_update = function (val) {
                    ctrl._update_value.transfer_date = val.getTime();
                };

                ctrl.pickDAT_update = function (val) {
                    ctrl._update_value.type = val.value;
                };

                ctrl.chooseUrgencyLevel_update = function (val) {
                    ctrl._update_value.urgency_level = val.value;
                };
                ctrl.pick_update_security_level = function(val){
                    console.log(val)
                    ctrl._insert_value.security_level = val.value;
                  }

                ctrl.removeFile_update = function (item) {
                    ctrl._update_value.files = ctrl._update_value.files.filter((file) => file.name !== item.name);
                }

                ctrl.pickViewOnlyDepartment_update = function(val){
                    console.log(val)
                    ctrl._update_value.department_receiver = angular.copy(val);
                };
                ctrl.chooseSubmissionDepartment_update = function (val) {
                    ctrl._update_value.department_execute = val.id;
                };
                ctrl.pickLabel_update = function (value) {
                    ctrl._task_value.label = value;
                }
            
                ctrl.loadLabel = function ({search, top, offset, sort}) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.load_label(search, top, offset, sort).then(function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }
                ctrl.loadLabel_details = function ({ids}) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.loadLabel_details(ids).then(function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }
                ctrl.addCheckList_insert = function () {
                    var d = new Date();
                    ctrl._task_value.task_list.push({
                        title: "",
                        status: false,
                        id: d.getTime().toString()
                    });
                    ctrl._task_value.focusChecklist = d.getTime().toString();
                }
                ctrl.chooseFromDate_insert = function (val) {
                    ctrl._task_value.from_date = val ? val.getTime() : undefined;;
                }
                ctrl.chooseToDate_insert = function (val) {
                    ctrl._task_value.to_date = val ? val.getTime() : undefined;;
                }
                ctrl.chooseDepartment_insert = function (val) {
                    ctrl._task_value.currentDepartment_orig = val;
                    ctrl._task_value.currentDepartment = val.id;
                }
                ctrl.chooseTaskPriority = function (val) {
                    const priority = dispatch_arrived_service.taskPriorityTransform(val.value);
                    ctrl._task_value.priority = priority.key;
                    ctrl._task_value._filterTaskPriority = priority.value;
                }
                
                ctrl.chooseTaskType = function (val) {
                    const taskType = task_service.taskTypeTransform(val.value);
                    ctrl._task_value.task_type = taskType.key;
                    ctrl._task_value._filterTaskType = taskType.value;
                }
                ctrl.addCheckList_insert = function () {
                    var d = new Date();
                    ctrl._task_value.task_list.push({
                        title: "",
                        status: false,
                        id: d.getTime().toString()
                    });
                    ctrl._task_value.focusChecklist = d.getTime().toString();
                }
                ctrl.removeCheckList_insert = function (id) {
                    ctrl._task_value.task_list = ctrl._task_value.task_list.filter(e => e.id !== id);
                }
                ctrl.removeFile_insert = function (item) {
                    ctrl._task_value.attachment = ctrl._task_value.attachment.filter(e => e.name !== item.name);
                };
                $scope.$watch(function() {
                    $("#" + idEditor).summernote({
                        placeholder: $filter("l")("InputContentHere"),
                        callbacks: {
                            onImageUpload: function (image) {
                                var formData = new FormData();
                                formData.append('type', "image");
                                formData.append('file', image[0], image[0].name);
                                task_service.uploadImage(formData).then(function (res) {
                                    var thisImage = $('<img>').attr('src', res.data.data);
                                    $("#" + idEditor).summernote('insertNode', thisImage[0]);
                                }, function (err) {
                                })
                            }
                        }
                    });
                    return ctrl._update_value.is_assign_task;
                  }, function(newValue) {
                    if (ctrl._task_value.length === 0) {
                        var today = new Date();
                        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                        $("#" + idEditor).summernote('code', '');
                        ctrl._task_value = {
                            files: [],
                            title: "",
                            task_list: [],
                            main_person: [],
                            participant: [],
                            observer: [],
                            department: "",
                            from_date: myToday.getTime(),
                            to_date: endDay.getTime(),
                            has_time: false,
                            hours: 0,
                            priority: 1,
                            head_task_id: $scope.insertHeadTaskId,
                            currentDepartment:"",
                            dispatch_arrived_id:ctrl._update_value._id ,
                            currentDepartment_orig: [],
                            level: 'Task',
                            label: []
                        };
                        ctrl.selectedTask = null; // Clear the selected task
                        ctrl.initValue = false; 
                    }
                });
                ctrl.removeFileAttachment_update = function (item) {
                    if (item.id) {
                      ctrl._update_value.attachments_remove.push(item.id);
                    }
                    ctrl._update_value.attachments = ctrl._update_value.attachments.filter(file => file.name !== item.name);
                };
                function insert_service() {
                    var dfd = $q.defer();
                    let parent={};
                    let parents=[];
                    parent.id =  ctrl._update_value._id;
                    parent.object = "dispatch_arrived";
                    parent.code = ctrl._update_value.code;   
                    let department = "";
                    if(typeof ctrl._task_value.currentDepartment ==="object"){
                        department = ctrl._task_value.currentDepartment.id;
                    }else{
                        department = ctrl._task_value.currentDepartment;
                    }
                    ctrl._task_value.dispatch_arrived_id = ctrl._update_value._id;
                    task_service.insert(
                        ctrl._task_value.attachment,
                        ctrl._task_value.title,
                        $("#" + idEditor).summernote('code'),
                        ctrl._task_value.task_list,
                        [],
                        [],
                        [],
                        ctrl._task_value.from_date,
                        ctrl._task_value.to_date,
                        ctrl._task_value.has_time,
                        ctrl._task_value.hours,
                        ctrl._task_value.priority,
                        ctrl._task_value.task_type,
                        ctrl._task_value.head_task_id,
                        ctrl._parentID,
                        ctrl._task_value.currentProject,
                        department,
                        ctrl._task_value.dispatch_arrived_id,
                        ctrl._task_value.level,
                        ctrl._task_value.label,
                        $scope.draft,
                        parents,
                        parent
                    ).then(function (res) {
                        dfd.resolve(true);
                        dfd = undefined;
                        ctrl._update_tasks.push({
                            ...res.data,
                            currentDepartment_orig: res.data.department,
                        });
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                function update_task_service() {
                    const dispatch_arrived_id = ctrl._update_value._id;
                    var dfd = $q.defer();
                    task_service.update(
                        ctrl._task_value._id,
                        ctrl._task_value.title,
                        $("#" + idEditor).summernote('code'),
                        ctrl._task_value.task_list,
                        ctrl._task_value.main_person,
                        ctrl._task_value.participant,
                        ctrl._task_value.observer,
                        ctrl._task_value.from_date,
                        ctrl._task_value.to_date,
                        ctrl._task_value.status,
                        ctrl._task_value.has_time,
                        task_service.taskPriorityTransform(ctrl._task_value.priority).key,
                        (task_service.taskTypeTransform(ctrl._task_value.task_type) || {}).key,
                        (ctrl._task_value.workflowPlay_id || ''),
                        ctrl._task_value.label,
                        dispatch_arrived_id,
                        ctrl._task_value.currentDepartment,
                    ).then(function (res) {
                        dfd.resolve(true);
                        dfd = undefined;
                        $scope.handleSuccessFunc({ params: {
                            resData: res.data,
                        }});
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                ctrl.insert = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insert", insert_service);
                }
                $(document).on(
                    "show.bs.modal",
                    "#modal_DA_Dir_Update",
                    function (e) {
                        if (e.target.id == "modal_DA_Dir_Update") {
                            $scope.$apply(function () {
                                ctrl.prepareUpdate();
                            });
                        }
                    }
                );
            },
        ],
    };
});

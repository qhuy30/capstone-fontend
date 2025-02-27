myApp.registerCtrl("task_details_controller", [
  "task_service",
  "task_details_service",
  "workflow_play_service",
  "languageValue",
  "notify_service",
  "$q",
  "$rootScope",
  "$scope",
  "$filter",
  "$timeout",
  "$window",
  "$location",
  "debounce",
  function (
    task_service,
    task_details_service,
    workflow_play_service,
    languageValue,
    notify_service,
    $q,
    $rootScope,
    $scope,
    $filter,
    $timeout,
    $window,
    $location,
    debounce
  ) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Task", action: "loadDetails" },
      { name: "Task", action: "start" },
      { name: "Task", action: "done" },
      { name: "Task", action: "confirm" },
      { name: "Task", action: 'delete' },
      { name: "Task", action: 'update' },
      { name: "Task", action: "cancel" },
      { name: "Task", action: "complete" },
      { name: "Task", action: "comment" },
      { name: "Task", action: "updateProgress" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "insert_transferTicket" },
      { name: "Task", action: "init" },
      { name: "Task", action: "load" },
      { name: "Task", action: "pushFile" },
      { name: "Task", action: "removeFile" },
      { name: "Task", action: "transferTicketTemplatePreview" },
      { name: "Task", action: "signAFile" },
      { name: "Task", action: "linkWorkflowPlay" },
      { name: "Task", action: "updateProject" },
      { name: "Task", action: "AddProof" },
      { name: "Task", action: "RemoveProof" },
      { name: "Task", action: "loadUserAndDepartment" },
      { name: "Task", action: "loadCustomTemplatePreview" },
      { name: "Task", action: "parseTemplate" },
      { name: "Task", action: "searchArchivedDocument" },
      { name: "WFP", action: "delete" },
      { name: "Task", action: "insert_tranfer_task" },
      { name: "Task", action: "reject_receive_task" },
      { name: "Task", action: "receive_task" },
      { name: "Task", action: "load_receive_task" },
      { name: "Task", action: "assignment" },
      { name: "Task", action: "refune" },
      { name: "Task", action: "reject_approval_receive_task" },
      { name: "Task", action: "approval_receive_task" },

    ];
    var ctrl = this;
    ctrl._ctrlName = "task_details_controller";
    var idEditor_cancel = "cancelTask_content";
    const idEditor_update = "updateTask_content_inDetailView";
    var idEditor_complete = "completeTask_content";
    var idEditor_done = "doneTask_content";
    ctrl._idEditor_update_head_task = "updateHeadTask_content_details";

    const TASK_RULE = {
      DIRECTOR_MANAGE: "Office.Task.Director_Manage",
      LEADER_MANAGE: "Office.Task.Leader_Mangage",
      DEPARTMENT_LEADER_MANAGE: "Office.Task.Department_Leader_Manage",
      EDIT_TASK_PROJECT: "Office.Task.Edit_Task_Project",
      EDIT_TASK_DEPARTMENT: "Office.Task.Edit_Task_Department",
      DELETE_TASK_DEPARTMENT: "Office.Task.Delete_Task_Department",
      DELETE_TASK_EDIT_TASK_PROJECT: "Office.Task.Delete_Task_Project",

      RECEIVE_TASK: "Office.Task.Receive_task",
    };

    const TASK_STATUS = {
      NOT_SEEN: "NotSeen",
      PROCESSING: "Processing",
      PENDING_APPROVAL: "PendingApproval",
      WAITING_FOR_APPROVAL: "WaitingForApproval",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
      WAITING_RECEIVE: "WaitingReceive"
    };

    const TASK_EVENT = {
      ASSIGNMENT: "Assignment",
      CREATED: "Created",
      START_DOING: "StartDoing",
      UPDATED_INFORMATION: "UpdatedInformation",
      DONE: "Done",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      RECEIVE: "Receive",
      RECEIVE_TASK: "ReceiveTask",
      REJECT_RECEIVE_TASK: "RejectReceiveTask",
    };

    const TASK_ACTION = {
      // CREATED: "Created",
      // CREATED_AND_ASSIGNMENT: "CreateAndAssignment",
      ASSIGNMENT: "Assignment",
      DONE: "Done",
      COMPLETED: "Completed",
      REFUNED: "Refuned",
      CANCELLED: "Cancelled"
    };

    {
      ctrl._update_value = {};

      ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task/details/views/delete_modal.html";
      ctrl._urlDeleteTransferTicketModal = FrontendDomain + "/modules/office/task/details/views/delete_transfer_ticket_modal.html";
      ctrl._urlDeleteWfpModal = FrontendDomain + "/modules/office/task/details/views/delete_wfp_modal.html";
      ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/details/views/cancel_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task/details/views/update_modal.html";
      ctrl._urlConfirmModal = FrontendDomain + "/modules/office/task/details/views/confirm_modal.html";
      ctrl._urlApproveDoneAndCompleteModal = FrontendDomain + "/modules/office/task/details/views/done_complete_message_modal.html";
      ctrl._urlAssignmentModal = FrontendDomain + "/modules/office/task/details/views/assignment_modal.html";
      ctrl._urlCompleteModal = FrontendDomain + "/modules/office/task/details/views/complete_modal.html";
      ctrl._urlConfirmDoneModal = FrontendDomain + "/modules/office/task/details/views/confirm_done_modal.html";
      ctrl._urlUpdateHeadTaskModal = FrontendDomain + "/modules/office/task/details/views/update_head_task_modal_2.html";


    
      ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
    }

    const getCode = () => {
      let code = $location.search().code;
      if (code) { return code; }
      if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'task-details') {
        let temp = $rootScope.detailsInfo.url.split("?")[1];
        if (temp.indexOf("code") !== -1) {
          code = temp.split("=")[1];
          return code;
        }
      }
      return undefined;
    };

    const idEditor = "insertTransferTicket_content";
    /** init variable */
    {
      ctrl.code = getCode();
      ctrl.task_comment_editor = `task_comment_editor_${new Date().getTime()}_txt`;
      ctrl.Item = {};
      ctrl.tab = "responsibility";
      ctrl.status = "see";
      ctrl.cycle = "";
      ctrl.commentText = "";
      ctrl.proofText = "";
      ctrl.startWatchComment = false;
      ctrl.startWatchProof = false;
      ctrl.files = [];
      ctrl.filesProof = [];
      ctrl.receive_task = [];
      ctrl.proofErr = "";
      ctrl.proofFileSizeErr = false;
      ctrl._notyetInit = true;
      ctrl._notyetUpdate = false;
      ctrl.workflow_play = [];
      ctrl.notify_detail = null;
      ctrl._insert_value = {};
      ctrl.showPopup = false;
      ctrl.titlePopup = "";
      ctrl.contentPopup = "";
      ctrl.typePopup = "";
      ctrl.progressChanged = false;
      ctrl.originalProgress = 0;
      ctrl.isActive  = false;
      ctrl.currentDepartment = "";
      ctrl._done_value = "";
      ctrl._complete_value = "";

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl.commentFiles = [];
      ctrl.isEditingComment = false;

      $scope.ctrl = ctrl;
      $scope.forms = {};

      ctrl.WF = [];
      ctrl.WF2 = [];
      ctrl.listUsers = [];
      ctrl.listUsersDefault = [];
      ctrl.listAllUser = [];
      ctrl.departmentDetails = {};
      ctrl._assess_value = {};
      ctrl.function_apply_suggestions = ['task'];
      ctrl.DocumentType_Config = {
        master_key: "document_type",
        load_details_column: "value",
      };

      {
        ctrl.TaskPriority = {
          master_key: "task_priority",
          load_details_column: "value",
        };
        ctrl.TaskType = {
          master_key: "task_type",
          load_details_column: "value",
        };
      }

      ctrl.cancelTask_reason = '';
      ctrl._value_insert = {};

      ctrl._urlInsertTransferTicketModal =
        FrontendDomain +
        "/modules/office/task/details/views/insert_transfer_ticket_modal.html";
      ctrl._urlComment =
        FrontendDomain + "/modules/office/task/details/views/comment.html";
      ctrl._urlTranferTaskModal = FrontendDomain + "/modules/office/task/details/views/insert_tranfer_task_modal.html";
      ctrl._urlReceiveTaskModal = FrontendDomain + "/modules/office/task/details/views/receive_task_modal.html";
    
    }

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        task_details_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };


    ctrl.pickLabel_update = function (value) {
      ctrl._update_value.label = value;
    };

    function loadDetails_service() {
      var dfd = $q.defer();
    
      ctrl.startWatchComment = true;
      ctrl.startWatchProof = true;
      ctrl.label = [];
      if ($rootScope.detailsInfo.params) {
        ctrl.currentDepartment = $rootScope.detailsInfo.params.currentDepartment;
      }else{
        ctrl.currentDepartment = $rootScope.logininfo.data.department;
      }
      task_details_service.loadDetails(undefined, ctrl.code, ctrl.currentDepartment).then(async function (res) {
        res.data.work_items = res.data.work_items ? res.data.work_items : [];
        ctrl.Item = {
          ...res.data,
          permission: {
            // ...getPermission(res.data)
            ...$filter('getPermissionTask')(res.data)
          },
          work_items: res.data.work_items.map(childTask => ({
            ...childTask,
            // ...getPermission(childTask)
            ...$filter('getPermissionTask')(childTask)
          }))
        };

        
        loadLabel_details();
        ctrl.thisId = ctrl.Item._id;
        if(ctrl.Item.permission.allow_seen_task){
          ctrl.start();
        }else{
          //cập nhật % tiến độ
          ctrl.originalProgress = ctrl.Item.progress;
          if (ctrl.Item.work_items && ctrl.Item.work_items.length > 0) {
            ctrl.percentParentLeft = 100 - ctrl.Item.work_items.filter(i=> i.status !== 'Cancelled').reduce((sum, item) => sum + item.child_work_percent, 0);
            ctrl.disableProgressBar = true;
          } else {
            ctrl.disableProgressBar = false;
            ctrl.percentParentLeft = 100 - (ctrl.Item?.parent_task?.progress || ctrl.Item.progress || 0); 
          }
  
          //set breadcrumb
          ctrl._notyetUpdate = false;
          ctrl.breadcrumb = [
            ...(ctrl.Item.parents || []).reverse(),
            { object: "task", code: ctrl.Item.code },
          ];
          
          if(ctrl.Item.parent_code){
            ctrl.breadcrumb = [
              { object: "task", code: ctrl.Item.parent_code},
            ];
          }
  
          
          // gộp event and comment

          /* Event */
          const filteredEvents = ctrl.Item.event.reduce((acc, event) => {
            // Kiểm tra nếu action của event có trong TASK_ACTION
            if (Object.values(TASK_ACTION).includes(event.action)) {
                // Nếu action là "Assignment", chỉ giữ lại phần tử cuối cùng
                if (event.action === TASK_ACTION.ASSIGNMENT) {
                    if (acc.some(e => e.action === TASK_ACTION.ASSIGNMENT)) {
                        acc = acc.filter(e => e.action !== TASK_ACTION.ASSIGNMENT); // Xóa tất cả "Assignment"
                    }
                    acc.push(event);  // Thêm phần tử "Assignment" cuối cùng
                } else {
                    acc.push(event);  // Thêm các phần tử không phải "Assignment"
                }
            }
            return acc;
          }, []);

          /* Comment */
          const sortedComments = $filter('groupAndSortComments')(ctrl.Item.comment);

          ctrl.combinedCommentsAndEvents = [].concat(
            sortedComments.map(function(item) {
                item.typeData = 'comment';
                return item;
            }),
            filteredEvents.map(function(item) {
                item.typeData = 'event';
                return item;
            })
          ).sort(function(a, b) {
            return new Date(a.time) - new Date(b.time);
          });

          if(ctrl.Item.work_items && ctrl.Item.work_items.length > 0){
            //giới hạn progress
            ctrl.Item.ProgressLimits = $filter('checkLimitProcess')(ctrl.Item.work_items);
          }
          
        }

        // if (ctrl.Item.main_person.indexOf($rootScope.logininfo.data.username) !== -1 && ctrl.Item.status === "NotSeen") {    
        //   ctrl.start()
        // }    
        // else {
        //   getTaskPermissionProperties(ctrl.Item).then(function (permission) {
        //     if(ctrl.Item.comment && ctrl.Item.comment.length > 0) {
        //       ctrl.Item.sortedComments = $filter('groupAndSortComments')(ctrl.Item.comment);
        //     }
        //     ctrl.onProgressChange()
        //     ctrl._notyetUpdate = false;
        //     ctrl.breadcrumb = [
        //       ...(ctrl.Item.parents || []).reverse(),
        //       { object: "task", code: ctrl.Item.code },
        //     ];

        //     if(ctrl.Item.parent_code){
        //       ctrl.breadcrumb = [
        //         { object: "task", code: ctrl.Item.parent_code},
        //       ];
        //     }
        //     ctrl.task_type = task_details_service.taskTypeTransform(
        //       ctrl.Item.task_type
        //     ).value;
        //     ctrl.workflow_play = [ctrl.Item.workflow_play];
        //     ctrl.notify_detail = ctrl.Item.notify_detail || null;
        //     ctrl.cycle = ctrl.Item.repetitive
        //       ? ctrl.Item.repetitive.cycle.charAt(0).toUpperCase() +
        //       ctrl.Item.repetitive.cycle.slice(1)
        //       : "";
        //     switch (ctrl.Item.status) {
        //       case "NotSeen":
        //         ctrl.status = "notseen";
        //         break;
        //       case "Processing":
        //         ctrl.status = "processing";
        //         break;
        //       case "WaitingForApproval":
        //         ctrl.status = "done";
        //         break;
        //       case "Cancelled":
        //         ctrl.status = "cancelled";
        //         break;
        //       case "Completed":
        //         ctrl.status = "completed";
        //         break;
        //       default:
        //         ctrl.status = "see";
        //     }
        //     ctrl.Item = { ...ctrl.Item, ...permission };
            

        //     ctrl.Item?.transfer_tickets?.map((item) => { 
        //       item.type = item?.parents?.find(i => ctrl.Item?.code === i?.code &&i.type)?.type;
        //     })
        //     ctrl.Item.transfer_tickets_ar = [];
        //     ctrl.Item.transfer_sign_ar = [];
        //     if(ctrl.Item.transfer_tickets && ctrl.Item.transfer_tickets.length > 0){
        //       ctrl.Item.transfer_tickets_ar = ctrl.Item.transfer_tickets.filter(item => item.transfer_ticket);
        //       ctrl.Item.transfer_sign_ar = ctrl.Item.transfer_tickets.filter(item => !item.transfer_ticket);
        //     }

        //     $timeout(function () {
        //       ctrl._notyetInit = false;
        //       ctrl.isActive = true;
        //     }, 1000);
        //     dfd.resolve(true);
        //     res = undefined;
        //     dfd = undefined;
        //   },
        //     function (err) {
        //       if (err.status === 403) {
        //         $rootScope.urlPage = urlNotPermissionPage;
        //       } else {
        //         $rootScope.urlPage = urlNotFoundPage;
        //       }
        //       dfd.reject(err);
        //       err = undefined;
        //     }
        //   );
        // }
      }),function (err) {
        if (err.status === 403) {
          $rootScope.urlPage = urlNotPermissionPage;
        } else {
          $rootScope.urlPage = urlNotFoundPage;
        }
        dfd.reject(err);
        err = undefined;
      }
      return dfd.promise;
    }

    // function getPermission(item){
    //   const permission = {};
    //   const currentUser = $rootScope.logininfo.data;
    //   const isMainPerson = item.main_person.includes(currentUser.username);
    //   const isObserver = item.observer.includes(currentUser.username);
    //   const isParticipant = item.participant.includes(currentUser.username);
    //   const isCreator = item.username.includes(currentUser.username);

    //   permission.disableProgressBar = true;
    //   permission.allow_edit = false;
    //   permission.allow_remove_task = false;
    //   permission.allow_recive_task = false;
    //   permission.allow_update_progress = false;
    //   permission.allow_cancel = false;
    //   permission.allow_approve_complete = false;
    //   permission.allow_create_child_task = false;
    //   permission.allowCreateTransferTicket = false;
    //   permission.allow_assignment = false;


    //   switch(item.status){
    //     case TASK_STATUS.NOT_SEEN:
    //       if(isMainPerson){
    //         permission.allow_seen_task = true;
    //       }
    //       if(isCreator){
    //         permission.allow_edit = true;
    //         permission.allow_remove_task = true;
    //         permission.allow_assignment = true;
    //       }
    //       break;
    //     case TASK_STATUS.WAITING_RECEIVE:
    //       if($filter('checkRule')(TASK_RULE.RECEIVE_TASK) && currentUser.department === item.to_department){
    //         permission.allow_recive_task = true;
    //       }
    //       break;
    //     case TASK_STATUS.PROCESSING:
    //       if (isCreator  && item.progress === 0) {
    //         permission.allow_cancel = true;
    //       }
    //       if(isMainPerson){
    //         permission.allow_update_progress = true;
    //         permission.disableProgressBar = false;
    //         permission.allow_create_child_task = true;
    //         permission.allowCreateTransferTicket = true;
    //       }
    //       break;
    //     case TASK_STATUS.WAITING_FOR_APPROVAL:
    //       if(isObserver){
    //         permission.allow_approve_complete = true;
    //       }
    //       break;
    //   }

    //   if(isMainPerson || isObserver || isParticipant){
    //     permission.allow_comment = true;
    //   }
    //   return permission;
    // }

    function getPermission(item){
      const permission = {};
      const currentUser = $rootScope.logininfo.data;
      const isMainPerson = item.main_person.includes(currentUser.username);
      const isObserver = item.observer.includes(currentUser.username);
      const isParticipant = item.participant.includes(currentUser.username);
      const isCreator = item.username.includes(currentUser.username);

      permission.disableProgressBar = true;
      permission.allow_edit = false;
      permission.allow_remove_task = false;
      permission.allow_recive_task = false;
      permission.allow_update_progress = false;
      permission.allow_cancel = false;
      permission.allow_approve_complete = false;
      permission.allow_create_child_task = false;
      permission.allowCreateTransferTicket = false;
      permission.allow_assignment = false;


      switch(item.status){
        case TASK_STATUS.NOT_SEEN:
          if(isMainPerson){
            permission.allow_seen_task = true;
          }
          if(isCreator && item.source_id !== "1"){
            permission.allow_edit = true;
            permission.allow_remove_task = true;
            permission.allow_assignment = true;
          }

          if(isCreator && item.source_id === "1"){
            permission.allow_external_edit = true;
            permission.allow_remove_task = true;
          }
          break;
        case TASK_STATUS.WAITING_RECEIVE:
          if($filter('checkRule')(TASK_RULE.RECEIVE_TASK) && currentUser.department === item.to_department){
            permission.allow_recive_task = true;
          }
          break;
        case TASK_STATUS.PROCESSING:
          if (isCreator  && item.progress === 0) {
            permission.allow_cancel = true;
          }
          if(isMainPerson){
            permission.allow_update_progress = true;
            permission.disableProgressBar = false;
            permission.allow_create_child_task = true;
            permission.allowCreateTransferTicket = true;
          }
          break;
        case TASK_STATUS.WAITING_FOR_APPROVAL:
          if(isObserver){
            permission.allow_approve_complete = true;
          }
          break;
      }

      if(isMainPerson || isObserver || isParticipant){
        permission.allow_comment = true;
      }
      return permission;
    }

    ctrl.loadDetails = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "loadDetails",
        loadDetails_service
      );
    };

    function loadLabel_details() {
      var dfd = $q.defer();
      let labels = ctrl.Item.label;
      if(ctrl.Item.label_from_da && ctrl.Item.label_from_da.length > 0) {
        labels = labels.concat(ctrl.Item.label_from_da)
      }
      task_details_service.loadLabel_details(labels).then(
        function (res) {
          ctrl.label = res.data;
          dfd.resolve(true);
        },
        function (err) {
          dfd.reject(err);
        }
      );
      return dfd.promise;
    }

    ctrl.loadfileWFP = function (params) {
      return function () {
        var dfd = $q.defer();
        task_details_service.loadFileInfoWFP(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };

    //**UPDATE CHILD TASK */

    ctrl.addCheckList_update = function () {
      var d = new Date();
      ctrl._update_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._update_value.focusChecklist = d.getTime().toString();
    };

    ctrl.removeCheckList_update = function (id) {
      ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
        (e) => e.id !== id
      );
    };

    ctrl.Status = [
      {
        title: {
          "vi-VN": "Chưa xem",
          "en-US": "Not Seen"
        },
        key: "NotSeen"
      },
      {
        title: {
          "vi-VN": "Đang triển khai",
          "en-US": "Processing"
        },
        key: "Processing"
      },
      {
        title: {
          "vi-VN": "Chờ phê duyệt",
          "en-US": "Waiting For Approval"
        },
        key: "WaitingForApproval"
      },
      {
        title: {
          "vi-VN": "Hoàn thành",
          "en-US": "Completed"
        },
        key: "Completed"
      }
    ];
    ctrl.loadStatus_details = function (params) {
      let dfd = $q.defer();
      for (var i in ctrl.Status) {
        if (params.id === ctrl.Status[i].key) {
          dfd.resolve(ctrl.Status[i]);
          break;
        }
      }
      return dfd.promise;
    };
    ctrl.chooseEndDate_update = function (val) {
      if (!ctrl._update_value.repetitive) {
        ctrl._update_value.repetitive = {
            has_endDate: false,
            per: 1,
            cycle: "day",
            endDate: null
        };
      }

      ctrl.endDate_ErrorMsg = $rootScope?.isValidEndDate(
        true,
        ctrl._update_value.repetitive.endDate,
        val
      );
      ctrl._update_value.repetitive.endDate = val ? val.getTime() : null;
    };

    ctrl.chooseFromDate_update = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._update_value.from_date = val ? val.getTime() : undefined;
      if (ctrl._update_value.to_date && ctrl._update_value.from_date >= ctrl._update_value.to_date) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date);
      }
      if (!ctrl.fromDate_ErrorMsg) {
        ctrl.chooseToDate_update(ctrl._update_value.to_date ? new Date(ctrl._update_value.to_date) : undefined);
      }
    };

    ctrl.chooseToDate_update = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._update_value.to_date = val ? val.getTime() : undefined;
      if (ctrl._update_value.from_date && ctrl._update_value.to_date <= ctrl._update_value.from_date) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._update_value.from_date, val);
      }
    };

    ctrl.chooseStatus_update = function (val) {
      ctrl._update_value.status = angular.copy(val.key);
    };

    ctrl.pickMainperson_update = function (val) {
      ctrl._update_value.main_person = val ? [val] : [];
    };
    ctrl.pickParticipant_update = function (val) {
      ctrl._update_value.participant = val;
    };
    ctrl.pickObserver_update = function (val) {
      ctrl._update_value.observer = val;
    };


    ctrl.pickMainperson_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.main_person = [val];
      ctrl.update()
    };
    ctrl.pickParticipant_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.participant = val;
      ctrl.update()
    };
    ctrl.pickObserver_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.observer = val;
      ctrl.update()
    };

    
    ctrl.saveTitle = function () {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl.update()
      ctrl.isEditingTitle = false;
    };
    ctrl.saveContent = function () {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl.update()
      ctrl.isEditingContent = false;
    };

    ctrl.saveTitleTransferTicket = function () {
      var parts = ctrl.Item.fullTitle.split(" - ");
      
      if (parts.length >= 3) {
          ctrl.Item.title = ctrl.Item.fullTitle;
          ctrl.Item.to_department = parts[2];
      }
      ctrl._update_value.to_department = ctrl.Item.to_department;
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl.update()
      ctrl.isEditingTitle = false;
    };
    ctrl.startEditing = function () {
      ctrl.workTitleDetails = [
        {
          title: {
            "vi-VN": "Công việc",
            "en-US": "Work"
          },
          key: "Công việc"
        }
      ];

      ctrl.Item.fullTitle = ctrl.Item.title;
      ctrl.isEditingTitle = true;
    };

    ctrl.pickPriorityUpdate = function (val) {
      ctrl._update_value.priority = task_details_service.taskPriorityTransform(
        val.value
      ).value;
    };

    ctrl.pickTaskTypeUpdate = function (val) {
      ctrl._update_value.task_type = task_details_service.taskTypeTransform(
        val.value
      ).value;
    };

    ctrl.pickDispatchArrived_update = function (val) {
      ctrl._update_value.dispatch_arrived = val;
    };

    ctrl.chooseHasEndDateRepetitive_update = function (val) {
      ctrl._update_value.repetitive.has_endDate = val;
      if (val === false) {
        ctrl._update_value.repetitive.endDate = null;
      }
    };

    ctrl.calculateTotalPercent = function () {
      if (ctrl.Item.work_items && ctrl.Item.work_items.length > 0) {
        return ctrl.Item.work_items.reduce((sum, item) => sum + item.child_work_percent, 0);
      }
      return 0;
    };

    ctrl.validateAndOpenModal = function () {
          if (ctrl.percentParentLeft == 0) {
              ctrl.showPopup = true;
              ctrl.titlePopup = 'Warning';
              ctrl.contentPopup = 'The total percent is 100. Please modify child tasks to create a new one!';
              ctrl.typePopup = 'warning';
          } else {
            ctrl.showPopup = false;
          }
  };

    ctrl.prepareResponseTransferTicket = function (value) {
      ctrl.reponse_transfer_ticket = angular.copy(value);
    }

    function update_service() {
      var dfd = $q.defer();
      if (!ctrl._update_value.has_repetitive) {
        delete ctrl._update_value.per;
        delete ctrl._update_value.cycle;
        delete ctrl._update_value.has_expired;
        delete ctrl._update_value.expired_date;
      }

      if (!ctrl._update_value.has_repetitive) {
        ctrl._update_value.has_repetitive = undefined;
      } else {
        if (!ctrl._update_value.has_repetitive) {
          ctrl._update_value.expired_date = null;
        }
      }
      
      if (
        ctrl._update_value.dispatch_arrived === undefined ||
        Object.keys(ctrl._update_value.dispatch_arrived).length === 0
      ) {
        ctrl._update_value.dispatch_arrived =
          ctrl._update_value.dispatch_arrived || {};
        ctrl._update_value.dispatch_arrived._id = "";
      }
      
      task_service
        .update(
          ctrl._update_value.estimate,
          ctrl._update_value._id,
          ctrl._update_value.title,
          $("#" + idEditor_update).summernote("code"),
          ctrl._update_value.task_list,
          ctrl._update_value.main_person,
          ctrl._update_value.participant,
          ctrl._update_value.observer,
          ctrl._update_value.from_date,
          ctrl._update_value.to_date,
          ctrl._update_value.status,
          ctrl._update_value.has_time,
          task_service.taskPriorityTransform(ctrl._update_value.priority).key,
          (task_service.taskTypeTransform(ctrl._update_value.task_type) || {})
            .key,
          ctrl._update_value.workflowPlay_id || "",
          ctrl._update_value.label,
          ctrl._update_value.dispatch_arrived._id,
          ctrl.currentDepartment.id,
          ctrl._update_value.has_repetitive,
          ctrl._update_value.per,
          ctrl._update_value.cycle,
          ctrl._update_value.has_expired,
          ctrl._update_value.expired_date,
          ctrl.actionAccess
        )
        .then(
          function () {
            $("#modal_Task_Update_inDetailView").modal("hide");
            $("#modal_Task_Assignment_inDetailView").modal("hide");
            ctrl.loadDetails();
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

    ctrl.update = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "update",
        update_service
      );
    };

    // CANCEL CHILD TASK
    ctrl.prepareCancel = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
      ctrl._cancel_value = angular.copy(value);
      ctrl.cancelTask_reason = '';

      $("#" + idEditor_cancel).summernote({
        placeholder: $filter("l")("InputContentHere"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_details_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor_update).summernote("insertNode", thisImage[0]);
              },
              function (err) { }
            );
          },
        },
      });
      $("#" + idEditor_cancel).summernote("code", value.content);
    };

    function cancel_childtask_details_service() {
      var dfd = $q.defer();
      task_details_service.cancel(ctrl._cancel_value._id, ctrl.cancelTask_reason).then(
        function (res) {
          $("#modal_Task_Cancel_inDetailView").modal("hide");
          ctrl.loadDetails();
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

    ctrl.canceltask = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "cancel",
        cancel_childtask_details_service
      );
    };

    /**DELETE CHILD TASK */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    ctrl.prepareDeleteWfp = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "WFP", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      task_details_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Task_Delete_inDetailView").modal("hide");

          if ((ctrl._delete_value.status == "Completed")) {
            updateProgress(
              ctrl.Item._id,
              ctrl.Item?.progress - ctrl._delete_value.child_work_percent
            );
          } else {
            ctrl.loadDetails();
          }
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

    function delete_wfp_service() {
      var dfd = $q.defer();
      workflow_play_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Wfp_Delete").modal("hide");
          $("#modal_TransferTicket_Delete").modal("hide");

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

    ctrl.delete = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "delete",
        delete_service
      );
    };

    ctrl.delete_wfp = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "WFP",
        "delete",
        delete_wfp_service
      );
    };


    /**TASK - PUSH FILE FOR UPDATE MODAL */

    function pushFile_service(file) {
      return function () {
        var dfd = $q.defer();
        task_details_service.pushFile(file, ctrl._update_value._id).then(
          function (res) {
            ctrl._update_value.attachment.push(res.data);
            ctrl.loadDetails();
            dfd.resolve(true);
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

    ctrl.pushFile_update = function (file) {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "pushFile",
        pushFile_service(file)
      );
    };

    /**TASK - REMOVE FILE FOR UPDATE MODAL */
    function removeFile_service(filename) {
      return function () {
        var dfd = $q.defer();
        task_details_service.removeFile(ctrl._update_value._id, filename).then(
          function (res) {
            var temp = [];
            for (var i in ctrl._update_value.attachment) {
              if (ctrl._update_value.attachment[i].name !== filename) {
                temp.push(ctrl._update_value.attachment[i]);
              }
            }
            ctrl._update_value.attachment = temp;
            ctrl.loadDetails();
            temp = undefined;
            dfd.resolve(true);
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

    ctrl.loadfileWFP = function (params) {
      return function () {
        var dfd = $q.defer();
        workflow_play_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };

    ctrl.reloadModalBox = function (params) {
      $("body").addClass("modal-open");
    };

    ctrl.removeFile_update = function (item) {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "removeFile",
        removeFile_service(item.name)
      );
    };

    ctrl.convertTaskType = function (data) {
      let newValue = '';
      let list = [...ctrl.taskTypeDataExcel];
      for (let i = 0; i < ctrl.taskTypeDataExcel.length; i++) {
        if (i > 0) {
          if (list[i].value === data) {
            newValue = list[i].task_type;
          }
        }
      }
      return newValue;
    }
  

    ctrl.getValuePriority = function (data) {
    let newValue = "";
    let list = [...ctrl.priorityDataExcel];
    for (let i = 0; i < ctrl.priorityDataExcel.length; i++) {
      if (i > 0) {
        if (list[i].value === data) {
          newValue = list[i].priority;
        }
      }
    }
    return newValue;
  };

ctrl.isUsernameUnique = function (username, list) {
  return list.every(function (item) {
    return item.username !== username;
  });
};

ctrl.validateProperties = function (arrayImportedItem) {
  const format = "DD/MM/YYYY";
  let isValidFormatFromDate = false;
  let isValidFormatToDate = false;
  const indexes = [];
  const optionalFields = ["searching", "has_time", "hours"];
  arrayImportedItem.forEach((object, index) => {
    for (const key in object) {
      if (key === "main_person" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }

      if (key === "observer" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }

      if (key === "participant" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }
      if (!object[key] && !optionalFields.includes(key)) {
        indexes.push({ index, property: key, details: ctrl.errorEmpty });
      }
    }
    if (object.from_date) {
      ctrl.converttoISOString(object.from_date);
      isValidFormatFromDate = moment(
        object.from_date,
        format,
        true
      ).isValid();
      if (!isValidFormatFromDate) {
        indexes.push({
          index,
          property: "from_date",
          details:
            "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy).",
        });
      }
    }
    if (object.to_date) {
      isValidFormatToDate = moment(object.to_date, format, true).isValid();
      if (!isValidFormatToDate) {
        indexes.push({
          index,
          property: "to_date",
          details:
            "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy).",
        });
      }
    }

    if (
      isValidFormatFromDate &&
      isValidFormatToDate &&
      moment(object.from_date, format).unix() >
      moment(object.to_date, format).unix()
    ) {
      indexes.push({
        index,
        property: "from_date",
        details: "'Từ ngày' phải nhỏ hơn trường 'Đến ngày'",
      });
    }
  });

  if (indexes.length > 0) {
    ctrl.listErrorExcelImport = indexes;
  } else {
    ctrl.listErrorExcelImport = [];
    console.log("All properties are defined in all objects.");
  }
};

ctrl.valueImportChange = function () {
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.checkDateTime = function (value) {
  const now = moment();
  const currentDay = now.startOf("day");
  const timestamp = currentDay.unix();
  if (value < timestamp) {
    return true;
  } else {
    return false;
  }
};

ctrl.visible = true;
ctrl.selectable = true;
ctrl.removable = true;
ctrl.separatorKeysCodes = [13, 188];
ctrl.searchTextPeople = "";

ctrl.employeeSelected = [];
ctrl.selectedItem = [];
ctrl.opened = false;
ctrl.filteredEmployee = function (value) {
  const filterValue = value.toLowerCase();
  return ctrl.listEmployeeAPI.filter(function (empl) {
    return empl.username.toLowerCase().indexOf(filterValue) >= 0;
  });
};
ctrl.transformChip = function (chip) {
  return chip.title;
};
ctrl.add = function (event) {
  const value = ctrl.fruitCtrl.val();

  if ((value || "").trim()) {
    ctrl.fruits.push(value.trim());
  }

  ctrl.fruitCtrl.val("");

  ctrl.fruitCtrl.trigger("input");
};

ctrl.remove = function (fruit) {
  const index = ctrl.fruits.indexOf(fruit);

  if (index >= 0) {
    ctrl.fruits.splice(index, 1);
  }
};

ctrl.selected = function (val, index, type) {
  if (ctrl.searchTextPeople) {
    ctrl.searchTextPeople = "";
  }
  if (
    ctrl.dataExcelConverted[index][type].some((item) => item.id === val.id)
  ) {
    let indexItem = ctrl.dataExcelConverted[index][type].findIndex(
      (item) => item.id === val.id
    );
    ctrl.dataExcelConverted[index][type].splice(indexItem, 1);
  } else {
    ctrl.dataExcelConverted[index][type].push(val);
  }
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.handleKeyDown = function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};

ctrl.isItemSelected = function (empl, list) {
  return list.some(function (selectedItem) {
    return angular.equals(selectedItem, empl);
  });
};

ctrl.openAuto = function () {
  angular
    .element(document.querySelector("#autocompleteTrigger"))
    .triggerHandler("click");
  angular.element(document.querySelector("#fruitInput")).focus();
};

ctrl.filterAccount = function (account) {
  if (account) {
    return account.split("-")[1].trim();
  }
};

ctrl.converttoISOString = function (dateString) {
  if (typeof dateString === "string") {
    var dateParts = dateString.split("/");
    var dateObject = new Date(
      `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
    );
    return dateObject;
  }
};
ctrl.isDropdownOpen = false;
ctrl.selectedValue = "";
ctrl.searchText = "";
ctrl.userLists = [];
ctrl.userLists = ctrl.listEmployeeAPI;
ctrl.priorityListImport = [
  {
    title: "Thấp",
    value: 4,
  },
  {
    title: "Trung bình",
    value: 3,
  },
  {
    title: "Quan trọng",
    value: 2,
  },
  {
    title: "Nghiêm trọng",
    value: 1,
  },
];
ctrl.activeItemId = "";
ctrl.togglePerson = "";
ctrl.isOpenAddmorePeople = "";
ctrl.toggleDropdown = function (itemId, person) {
  ctrl.activeItemId = ctrl.activeItemId === itemId ? null : itemId;
  ctrl.togglePerson = person;
};

ctrl.openDropdown = function () {
  ctrl.isDropdownOpen = true;
  ctrl.searchText = "";
};

ctrl.closeAddMoreUser = function () {
  ctrl.isOpenAddmorePeople = "";
};

ctrl.removeUserImport = function (indexEmpl, index, type) {
  ctrl.dataExcelConverted[index][type].splice(indexEmpl, 1);
  ctrl.userLists = ctrl.listEmployeeAPI.filter(
    (item) =>
      !ctrl.dataExcelConverted[index][type].some(
        (item2) => item.username === item2.username
      )
  );
};

ctrl.closeAddMorePeople = function () {
  ctrl.isOpenAddmorePeople = "";
};

ctrl.closeDropdown = function (item) {
  ctrl.isDropdownOpen = false;
};

ctrl.selectOption = function (index, option, id, type) {
  ctrl.selectedValue = option;
  ctrl.isDropdownOpen = false;
  if (ctrl.dataExcelConverted[index].id === id) {
    if (type === "priority") {
      ctrl.dataExcelConverted[index][type] = option;
    } else {
      ctrl.dataExcelConverted[index][type].push(option);
      ctrl.userLists = ctrl.userLists.filter(
        (item) =>
          !ctrl.dataExcelConverted[index][type].some(
            (item2) => item.username === item2.username
          )
      );
    }
  }
  ctrl.activeItemId = "";
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.validateDataImport = function () {
  let newTask = {};
  ctrl.dataExcelConverted = [];
  ctrl.isWatched = true;
  let dataExcel = ctrl.dataExcelJsonImported;
  try {
    for (let i = 0; i < dataExcel.length; i++) {
      if (i > 1) {
        newTask = {
          id: Math.random().toString(36).substring(2, 9),
          title: dataExcel[i].title,
          content: dataExcel[i].content,
          from_date: ctrl.converttoISOString(dataExcel[i].from_date),
          to_date: ctrl.converttoISOString(dataExcel[i].to_date),
          main_person: ctrl.filterAccount(dataExcel[i].main_person)
            ? [ctrl.filterAccount(dataExcel[i].main_person)]
            : [],
          participant: ctrl.filterAccount(dataExcel[i].participant)
            ? [ctrl.filterAccount(dataExcel[i].participant)]
            : [],
          observer: ctrl.filterAccount(dataExcel[i].observer)
            ? [ctrl.filterAccount(dataExcel[i].observer)]
            : [],
          priority: ctrl.getValuePriority(dataExcel[i].priority),
          has_time: dataExcel[i].hours ? true : false,
          task_type: ctrl.convertTaskType(dataExcel[i].task_type),
          task_list: dataExcel[i].task_list
            ? dataExcel[i].task_list.split("\n").map(function (item) {
              return {
                title: item.trim(),
                id: Math.random().toString(36).substring(2, 9),
                status: false,
              };
            })
            : [],
        };
        ctrl.dataExcelConverted.push(newTask);
      }
    }
  } catch (err) {
    alert("File có lỗi, vui lòng kiểm tra lại!");
    console.log(err);
  }
  ctrl.validateProperties(ctrl.dataExcelConverted);
  $rootScope.$apply();
};

ctrl.loadData = function (params) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, { type: "binary" });
      var firstSheetName = workbook.SheetNames[0];
      var secondSheetName = workbook.SheetNames[1];
      var thirdSheetName = workbook.SheetNames[2];
      var jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[firstSheetName]
      );
      var jsonPriority = XLSX.utils.sheet_to_json(
        workbook.Sheets[secondSheetName]
      );
      var jsonTaskType = XLSX.utils.sheet_to_json(
        workbook.Sheets[thirdSheetName]
      );
      ctrl.dataExcelJsonImported = jsonData;
      ctrl.priorityDataExcel = jsonPriority;
      ctrl.taskTypeDataExcel = jsonTaskType;

      resolve();
    };
    reader.readAsBinaryString(params);
  });
};

ctrl.filterByDataExcel = function (item) {
  return window
    .removeUnicode(item.title.toLowerCase())
    .includes(window.removeUnicode(ctrl._searchByDataExcel.toLowerCase()));
};

// INSERT WORKFLOW
ctrl.handleInsertWFPSuccess = function (data) {
  $(".task-insert-directive #modal_WFP_Insert").modal("hide");
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "linkWorkflowPlay",
    linkWorkflowPlay_service(data[0]._id)
  );
};

function linkWorkflowPlay_service(workflowPlay_id) {
  task_details_service.link_workflow_play(ctrl.thisId, workflowPlay_id).then(function (res) {
    if (ctrl.status == "start") {
      ctrl.start();
    }
    ctrl.loadDetails();
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

function init_service() {
  var dfd = $q.defer();
  workflow_play_service.init().then(function (res) {
      ctrl.WF = res.data.wf;
      dfd.resolve(true);
  }, function () {
      dfd.reject(false);
      err = undefined;
  });
  return dfd.promise;
}

ctrl.load_receive_task = function () {
  return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "load_receive_task", load_receive_task_service);
}

function load_receive_task_service(){
  var dfd = $q.defer();
  task_details_service.load_receive_task(ctrl.code).then(function (res) {
    ctrl.receive_task = res.data;
    dfd.resolve(true);
  }, function (err) {
    dfd.reject(err);
    err = undefined;
  });
  return dfd.promise;
}

ctrl.refresh_data = function(){
  ctrl.loadDetails();
  ctrl.load_receive_task();
}

function init() {
  const dfdAr = [];

  const loaddetail_page = setUrlContent(); 
  if (loaddetail_page) {
    dfdAr.push(load_employee_detail());
    dfdAr.push(load_employee_info());
    dfdAr.push(ctrl.loadDetails());
    dfdAr.push(ctrl.load_receive_task());
    $q.all(dfdAr).then(function(){
    }, function(err){
      dfd.reject(err)
    })
  }
  
  // load_employee_detail();
  // init_service();
  // load_employee_info();
  // if (ctrl.code) {
  //   ctrl.loadDetails();
  //   return
  // }

}


function setUrlContent() {
  ctrl.thisUrl = $rootScope.detailsInfo?.url?.split("?")[1];
  switch (ctrl.thisUrl) {
    case "add-task":
      ctrl._urlContent = urlAddTask
      return false;

    case "add-tasks-for-departments":
      ctrl._urlContent = urlAddTasksForDepartments
      return false;

    case "add-tasks-for-projects":
      ctrl._urlContent = urlAddTasksForProjects
      return false;

    case "add-recurring-department-tasks":
      ctrl._urlContent = urlAddRecurringDepartmentTasks
      return false;

    case "department":
      ctrl._urlContent = urlDepartmentDetails
      return false;
    
    default:
      return true;
  }
}

$scope.$watch(getCode, function (newVal) {
  if (newVal && newVal !== ctrl.code) {
    ctrl.code = newVal;
    init();
  }
});

$scope.$watch(function() {
  return $rootScope.isActive;
}, function(newVal) {
  if (newVal === true) {
      ctrl.loadDetails();
  }
});

init()

//START TASK

function start_service() {
  var dfd = $q.defer();
  task_details_service.start(ctrl.Item._id).then(
    function (res) {
      ctrl.loadDetails();
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

ctrl.start = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "start",
    start_service
  );
};

//DONE TASK

function emitTaskReloadEvent(code) {
  let obj = {
    type: "task",
    value: code
  }

  $rootScope.emitReloadEvent(obj);
}

//COMPLETE TASK

ctrl._assess_value = {
  note: '',
  note_required: true
};

ctrl._hintNoteSet = [
  'I agree',
  'I approve',
  'Well done, I approve',
  'Processed'
];

ctrl.set_hint_note = function(note) {
  ctrl._assess_value.note = $filter('l')(note);
};

ctrl.openModal = function(modalId){
  $(modalId).modal('toggle');
}

function complete_service() {
  var dfd = $q.defer();
  let filesProof = ctrl.filesProof.map((file) => {
    const date = new Date();
    const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${date.getFullYear()}-${date
        .getHours()
        .toString()
        .padStart(2, "0")}.${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}.${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
    let fileExtension = file.name.split(".").pop();
    let fileName = file.name.replace(/\.[^/.]+$/, "");
    return {
      ...file,
      name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
    };
  });
  task_details_service
    .complete(ctrl.thisId, ctrl.code, $("#" + idEditor_complete).summernote("code"), filesProof)
    .then(
      function (res) {
        ctrl.proofErr = "";
        ctrl.proofText = "";
        ctrl.filesProof = [];
        ctrl.fileInput = null;
        ctrl.proofFileSizeErr = false;        
        $('#modal_Task_Complete').modal('hide');
        ctrl.loadDetails();
        ctrl.progressChanged = false;
        dfd.resolve(true);
        res = undefined;
        dfd = undefined;
        emitTaskReloadEvent(ctrl.code);
      },
      function (err) {
        ctrl.proofErr = get_value_error(err.data.mes);
        dfd.reject(err);
        err = undefined;
      }
    );
  return dfd.promise;
};

ctrl.complete = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "complete",
    complete_service
  );
};

// CANCEL TASK

function cancel_service() {
  var dfd = $q.defer();
  task_details_service.cancel(ctrl.Item._id).then(
    function (res) {
      ctrl.loadDetails();
      dfd.resolve(true);
      res = undefined;
      dfd = undefined;
      emitTaskReloadEvent(ctrl.code)
    },
    function (err) {
      dfd.reject(err);
      err = undefined;
    }
  );
  return dfd.promise;
}

ctrl.cancel = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "cancel",
    cancel_service
  );
};

function updateProgress(id = ctrl.Item._id, progress=ctrl.Item.progress) {
  var dfd = $q.defer();
  ctrl._notyetUpdate = true
  task_details_service
    .update_progress(id, progress)
    .then(
      function () {
        ctrl.loadDetails();
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
    
    ctrl.onProgressChange = function () {
      if (ctrl.Item._id) {
        if(ctrl.Item.progress === 100) {
          ctrl.prepareDone(ctrl.Item);
          $("#modal_Confirm_Done_Modal").modal('show');
        }
        return ctrl.progressChanged = ctrl.originalProgress !== ctrl.Item.progress
      }
    };
    ctrl.resetProcess = function () {
      ctrl.Item.progress = ctrl.originalProgress;
      ctrl.progressChanged = false;
      $(`#modal_Confirm_Done_Modal`).modal('hide');
    }

    ctrl.prepareDone = function (value) {
      ctrl._done_value = angular.copy(value);
      ctrl.subAttachment = [];
      $("#" + idEditor_done).summernote({
        placeholder: $filter("l")("Note"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_details_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor_update).summernote("insertNode", thisImage[0]);
              },
              function (err) { }
            );
          },
        },
      });
      $("#" + idEditor_done).summernote("code", "");
    };

    ctrl.hasAttachments = function (items) {
      if (!items || !Array.isArray(items)) {
        return false; // Nếu không có danh sách hoặc không phải là mảng, trả về false
      }
  
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.proof && Array.isArray(item.proof)) {
          for (var j = 0; j < item.proof.length; j++) {
            var proof = item.proof[j];
            if (proof.attachment && proof.attachment.length > 0) {
                return true; // Có tệp đính kèm
            }
          }
        }
      }
  
      return false; // Không có tệp đính kèm
  };
  
    ctrl.confirmProgressChange = function () {
      ctrl.changeProgressOfTask();
      ctrl.progressChanged = false;
      ctrl.originalProgress = ctrl.Item.progress;
    };

    ctrl.resetProgressChange = function () {
      ctrl.Item.progress = ctrl.originalProgress;
      ctrl.progressChanged = false;
    };

  ctrl.changeProgressOfTask = function () {
    return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "updateProgress",
      updateProgress
    );
  };
    
    ctrl.showConfirmModal = function () {
      $(`#modal_Task_Confirm`).modal('show');
    };
    
    ctrl.confirmAction = function () {
      $('#modal_Task_Confirm').modal('hide');
      ctrl.changeProgressOfTask();
      ctrl.progressChanged = false;
      ctrl.originalProgress = ctrl.Item.progress;
    };

// Add Proof
ctrl.addTempText = function () {
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_proof`;
  var inputStr = $("#" + ctrl.task_comment_editor).summernote("code");
  if (inputStr.length == "") {
    $window.localStorage.removeItem(draftKey);
  } else {
    $window.localStorage.setItem(draftKey, inputStr);
  }
};

ctrl.removeFilesProof = function (name) {
  ctrl.filesProof = ctrl.filesProof.filter((e) => e.name !== name);
};

ctrl.onProofFileExceedsLimit = function (params) {
  if (params.error) {
    ctrl.proofFileSizeErr = true;
  } else {
    ctrl.proofFileSizeErr = false;
  }
};

function get_value_error(key) {
  var valueErr = "FailureAction";
  for (var i in languageValue.details) {
    if (languageValue.details[i].key == key) {
      valueErr = languageValue.details[i];
      break;
    }
  }
  return valueErr && valueErr.value ? valueErr.value : "FailureAction";
}

function add_proof_service() {
  var dfd = $q.defer();
  if (ctrl.proofText.length > 0) {
    let filesProof = ctrl.filesProof.map((file) => {
      const date = new Date();
      const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}-${date
          .getHours()
          .toString()
          .padStart(2, "0")}.${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}.${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
      let fileExtension = file.name.split(".").pop();
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      return {
        ...file,
        name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
      };
    });
    task_details_service
      .add_proof(ctrl.thisId, ctrl.code, ctrl.proofText, filesProof)
      .then(
        function (res) {
          ctrl.proofErr = "";
          ctrl.proofText = "";
          ctrl.filesProof = [];
          ctrl.proofFileSizeErr = false;
          ctrl.loadDetails();
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          ctrl.proofErr = get_value_error(err.data.mes);
          dfd.reject(err);
          err = undefined;
        }
      );
  }
  return dfd.promise;
}
ctrl.addProof = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "AddProof",
    add_proof_service
  );
};

function remove_proof_service(proofId) {
  var dfd = $q.defer();
  if (ctrl.Item.proof.length > 0) {
    task_details_service.remove_proof(ctrl.thisId, proofId).then(
      function (res) {
        ctrl.loadDetails();
        dfd.resolve(true);
        res = undefined;
        dfd = undefined;
      },
      function (err) {
        dfd.reject(err);
        err = undefined;
      }
    );
  }
  return dfd.promise;
}

ctrl.removeProof = function (proofId) {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "RemoveProof",
    remove_proof_service(proofId)
  );
};

//COMMENT
ctrl.resetFileInput = function () {
  var fileInput = document.getElementById("file_upload");
  fileInput.value = "";
};

ctrl.removeFiles = function (name) {
  ctrl.commentFiles = ctrl.commentFiles.filter((e) => e.name !== name);
  ctrl.resetFileInput();
};

ctrl.blurPushComment = function () {
  ctrl.showPushComment = false;
  ctrl.commentFiles = [];
  ctrl.resetFileInput();
};

ctrl.addTempTextComment = function () {
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
  var inputStr = $("#" + ctrl.task_comment_editor).summernote("code");
  if (inputStr.length == "") {
    $window.localStorage.removeItem(draftKey);
  } else {
    $window.localStorage.setItem(draftKey, inputStr);
  }
};

ctrl.focusComment = function () {
  // if (Object.keys(ctrl.userList).length === 0) {
  //     ctrl.loadMembers().then(function (res) {
  //         ctrl.userList = res;
  //     }).catch(function (err) {
  //         console.log(err);
  //     });
  // }
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
  
  ctrl.showPushComment = true;

  $("#" + ctrl.task_comment_editor).summernote({
    height: 300, 
    focus: true,
    code: $window.localStorage.getItem(draftKey) || ""
  });

  var isTypingAt = false;
  var isSearching = false;
  var userList = $("<div/>", {
    id: "userList",
    css: {
      position: "absolute",
      "z-index": "9999",
      "max-height": "200px",
      "overflow-y": "auto",
    },
  });
  $(document).keydown(function (e) {
    if (e.key == "Escape") {
      // If the pressed key is ESC
      userList.empty(); // Clear the user list
      isSearching = false;
      $scope.$apply(function () {
        ctrl.showPushComment = false;
      });
    }
  });

  var currentSearch = "";
  $("#" + ctrl.task_comment_editor).after(userList);
  var currentAtPosition = -1;
  var cursorPosition = 0;
  // var currentSelectedIndex = -1;
  $("#" + ctrl.task_comment_editor).on("summernote.keyup", function (we, e) {
    debounce(ctrl.addTempTextComment);
    var content = $("#" + ctrl.task_comment_editor).summernote("code");
    previousAtPosition = currentAtPosition;
    currentAtPosition = content.lastIndexOf("@");
    if (["Tab"].includes(e.key)) {
      currentSearch = "";
      isTypingAt = false;
      isSearching = false;
      userList.empty();
    }
    if (
      ![
        "Shift",
        "Control",
        "Alt",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Meta",
        "CapsLock",
      ].includes(e.key)
    ) {
      var text = $("#" + ctrl.task_comment_editor).summernote("code");

      var atIndex = text.indexOf("@");
      var eKeyIndex = text.lastIndexOf(e.key);

      if (atIndex !== -1 && eKeyIndex !== -1) {
        text = text.substring(atIndex, eKeyIndex + 1);
        cursorPosition = atIndex;
      }

      if (e.key === "@" && e.keyCode !== 8) {
        currentSearch = "";
        isTypingAt = true;
        isSearching = true;
      } else if (isTypingAt && e.key !== " " && e.keyCode !== 8) {
        isSearching = true;
      } else if (e.key === " ") {
        userList.empty();
        isTypingAt = false;
        isSearching = false;
      } else if (e.keyCode === 8 && text.indexOf("@") === -1) {
        userList.empty();
        isTypingAt = false;
        isSearching = false;
      } else {
        isTypingAt = false;
      }
      if (e.key === "Backspace") {
        if (currentSearch.length > 0) {
          currentSearch = currentSearch.slice(0, -1);
        }
        if (currentSearch.length === 0) {
          userList.empty();
          isTypingAt = false;
        } else {
          isTypingAt = false;
        }
      } else {
        currentSearch += e.key;
        isTypingAt = false;
      }

      if (isTypingAt || isSearching) {
        userList.empty();
        var filteredMembers;

        const members = ctrl.userList;

        var search = currentSearch.replace("@", "").trim();

        if (search === "") {
          filteredMembers = members;
        } else {
          filteredMembers = members.filter(function (member) {
            return (
              member &&
              member.title_search
                .replace(/\s+/g, "")
                .toUpperCase()
                .includes(search.trim().toUpperCase())
            );
          });
        }

        var range = $("#" + ctrl.task_comment_editor).summernote("createRange");
        var rangePosition = range.getClientRects()[0];

        userList.css({
          position: "absolute",
          left: rangePosition.left - 250 + "px",
          top: rangePosition.top + rangePosition.height - 70 + "px",
        });
        for (var i = 0; i < filteredMembers.length; i++) {
          var userDiv = $("<div/>", {
            "data-username": filteredMembers[i].userName,
            css: {
              width: "300px",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              "align-items": "center",
              "background-color": "#ffffff",
              border: "1px solid #e0e0e0",
            },
            hover: function () {
              $(this).css("background-color", "#e0e0e0");
            },
            mouseleave: function () {
              $(this).css("background-color", "#ffffff");
            },
            click: function () {
              var id = $(this).find("span").attr("id");
              isSearching = false;
              isTypingAt = false;
              var selectedText = $(this).text();
              var highlightedText =
                '<span id = "' +
                id +
                '" contenteditable="false" style="background-color: #6452c6;color: #f3f3f5;border-radius: 5px;padding: 5px;display: inline-block;">' +
                selectedText +
                "</span>";
              handleUserListSelection(
                highlightedText,
                currentSearch,
                cursorPosition,
                currentAtPosition
              );

              currentSearch = "";
              userList.empty();
              var id = $(this).find("span").attr("id");
              var content = $("#" + ctrl.task_comment_editor).summernote("code");
              var $content = $("<div>").html(content);
              var spanIds = $content
                .find("span")
                .map(function () {
                  return this.id;
                })
                .get();
              if (!spanIds.includes(id)) {
              }
            },
            function (err) {
              dfd.reject(err);
              err = undefined;
            }
          });
        }
      }

      // return dfd.promise;
    }
  });
}

ctrl.comment = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "comment",
    comment_service
  );
};

ctrl.editComment = function (item) {
  ctrl.isEditingComment = true;
  item.isEditing = true;
  item.newContent = item.content;
  $timeout(function() {
    $('#summernote-' + item.id).summernote({
        height: 300, 
        focus: true, 
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['codeview']]
        ]
    });
  }, 0)
}

ctrl.saveUpdatedComment = function (item) {
  var dfd = $q.defer();
  var updatedContent = $('#summernote-' + item.id).summernote('code');
  var files = ctrl.commentFiles || [];
  task_details_service.updateComment(ctrl.thisId,item.id, updatedContent, files, 'Comment').then(function (res) {
    item.content = updatedContent;
    item.isEditing = false;
    ctrl.isEditingComment = false;
    ctrl.commentFiles = [];
    ctrl.loadDetails();
    dfd.resolve(true);
    res = undefined;
    dfd = undefined;
  },function (err) {
    dfd.reject(err);
    err = undefined;
  });
  return dfd.promise;
}

ctrl.cancelEditComment = function (item) {
  item.isEditing = false;
  ctrl.isEditingComment = false;
}

// UPDATE TASK LIST STATUS
ctrl.update_task_list_status = function (task_list_id, value) {
  task_details_service.update_task_list_status(
    ctrl.thisId,
    task_list_id,
    value
  );
};

//UPDATE TASK LIST
function update_task_list_service() {
  task_details_service.update_task_list(ctrl.thisId, ctrl.Item.task_list);
}

ctrl.removeTaskList = function (id) {
  ctrl.Item.task_list = ctrl.Item.task_list.filter((e) => e.id !== id);
  update_task_list_service();
};

ctrl.addTaskList = function () {
  var d = new Date();
  ctrl.Item.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl.Item.focusChecklist = d.getTime().toString();
  update_task_list_service();
};

ctrl.changeTextTaskList = function () {
  update_task_list_service();
};

ctrl.getCommentCountWithoutCancel = function (comments) {
  var nonCancelComments = (comments || []).filter(function (comment) {
    return comment.type !== "Cancelled";
  });

  return nonCancelComments.length;
};

ctrl.handleSuccess = function () {
  ctrl.loadDetails();
};

//INSERT SUBTASK

// handle function for INSERT TRANSFER TICKET

ctrl.chooseDepartment = function (val) {
  ctrl._insert_value.department = angular.copy(val.id);
};

ctrl.choosePriority = function (val) {
  const priority = task_details_service.taskPriorityTransform(val.value);
  ctrl._insert_value.priority = priority.key;
  ctrl._filterPriority = priority.value;
};

ctrl.chooseTaskType = function (val) {
  const taskType = task_details_service.taskTypeTransform(val.value);
  ctrl._insert_value.task_type = taskType.key;
  ctrl._filterTaskType = taskType.value;
};

ctrl.addCheckList_insert = function () {
  var d = new Date();
  ctrl._insert_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._insert_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_insert = function (id) {
  ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
    (e) => e.id !== id
  );
};

ctrl.chooseFromDate_insert = function (val) {
  ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
  ctrl._insert_value.from_date = val ? val.getTime() : undefined;
  if (ctrl._insert_value.to_date && ctrl._insert_value.from_date >= ctrl._insert_value.to_date) {
    ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date);
  }
  if (!ctrl.fromDate_ErrorMsg === $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date)) {
    ctrl.chooseToDate_insert(ctrl._insert_value.to_date ? new Date(ctrl._insert_value.to_date) : undefined);
  }
};

ctrl.chooseToDate_insert = function (val) {
  ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
  ctrl._insert_value.to_date = val ? val.getTime() : undefined;
  if (ctrl._insert_value.from_date && ctrl._insert_value.to_date <= ctrl._insert_value.from_date) {
    ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._insert_value.from_date, val);
  }
};

ctrl.chooseFromDate_update = function (val) {
  ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
  ctrl._update_value.from_date = val ? val.getTime() : undefined;
  if (ctrl._update_value.to_date && ctrl._update_value.from_date >= ctrl._update_value.to_date) {
    ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date);
  }
  if (!ctrl.fromDate_ErrorMsg === $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date)) {
    ctrl.chooseToDate_update(ctrl._update_value.to_date ? new Date(ctrl._update_value.to_date) : undefined);
  }
};

ctrl.chooseToDate_update = function (val) {
  ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
  ctrl._update_value.to_date = val ? val.getTime() : undefined;
  if (ctrl._update_value.from_date && ctrl._update_value.to_date <= ctrl._update_value.from_date) {
    ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._update_value.from_date, val);
  }
};

ctrl.pickMainperson_insert = function (val) {
  ctrl._insert_value.main_person = val;
};
ctrl.pickParticipant_insert = function (val) {
  ctrl._insert_value.participant = val;
};
ctrl.pickObserver_insert = function (val) {
  ctrl._insert_value.observer = val;
};

/*UPDATE TASK*/
ctrl.addCheckList_update = function () {
  var d = new Date();
  ctrl._update_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._update_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_update = function (id) {
  ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
    (e) => e.id !== id
  );
};

function comment_service() {
  var dfd = $q.defer();
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;

  const content = $(`#${ctrl.task_comment_editor}`).summernote("code");
  if (content) {
    task_details_service.comment(
      ctrl.thisId,
      content,
      ctrl.commentFiles,
      'Comment',
      ctrl.code
    )
      .then(
        function (res) {
          $window.localStorage.removeItem(draftKey);
          $window.localStorage.setItem(draftKey, "");
          $("#" + ctrl.task_comment_editor).summernote("code", "");
          ctrl.showPushComment = false;
          ctrl.commentFiles = [];
          ctrl.loadDetails();
          ctrl.resetFileInput();
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
  }
  return dfd.promise;
}

// UPDATE TASK LIST STATUS
ctrl.update_task_list_status = function (task_list_id, value) {
  task_details_service.update_task_list_status(
    ctrl.thisId,
    task_list_id,
    value
  );
};

//UPDATE TASK LIST
function update_task_list_service() {
  task_details_service.update_task_list(ctrl.thisId, ctrl.Item.task_list);
}

ctrl.removeTaskList = function (id) {
  ctrl.Item.task_list = ctrl.Item.task_list.filter((e) => e.id !== id);
  update_task_list_service();
};

ctrl.addTaskList = function () {
  var d = new Date();
  ctrl.Item.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl.Item.focusChecklist = d.getTime().toString();
  update_task_list_service();
};

ctrl.changeTextTaskList = function () {
  update_task_list_service();
};

ctrl.getCommentCountWithoutCancel = function (comments) {
  var nonCancelComments = (comments || []).filter(function (comment) {
    return comment.type !== "Cancelled";
  });

  return nonCancelComments.length;
};

ctrl.handleSuccess = function () {
  ctrl.loadDetails();
};

//INSERT SUBTASK

// handle function for INSERT TRANSFER TICKET

ctrl.chooseDepartment = function (val) {
  ctrl._insert_value.department = angular.copy(val.id);
};

ctrl.choosePriority = function (val) {
  const priority = task_details_service.taskPriorityTransform(val.value);
  ctrl._insert_value.priority = priority.key;
  ctrl._filterPriority = priority.value;
};

ctrl.chooseTaskType = function (val) {
  const taskType = task_details_service.taskTypeTransform(val.value);
  ctrl._insert_value.task_type = taskType.key;
  ctrl._filterTaskType = taskType.value;
};

ctrl.addCheckList_insert = function () {
  var d = new Date();
  ctrl._insert_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._insert_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_insert = function (id) {
  ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
    (e) => e.id !== id
  );
};

ctrl.pickMainperson_insert = function (val) {
  ctrl._insert_value.main_person = val;
};
ctrl.pickParticipant_insert = function (val) {
  ctrl._insert_value.participant = val;
};
ctrl.pickObserver_insert = function (val) {
  ctrl._insert_value.observer = val;
};

/**UPDATE TASK */
ctrl.addCheckList_update = function () {
  var d = new Date();
  ctrl._update_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._update_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_update = function (id) {
  ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
    (e) => e.id !== id
  );
};

function preview_service() {
  var dfd = $q.defer();
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  $rootScope.FileService.bind({
    display: "",
    embedUrl: "/component/loading.html",
  });
  $rootScope.FileService.show();
  task_details_service
    .transfer_ticket_preview(
      ctrl.Item.department.id,
      ctrl._insert_value.transfer_ticket_values,
      ctrl._insert_value.department
    )
    .then(
      function (res) {
        $rootScope.FileService.bind({
          display: "Phiếu chuyển.docx",
          embedUrl: res.data.url,
          serviceName: "task",
          attachmentId: ""
        });

        dfd.resolve(true);
      },
      function (err) {
        dfd.reject(err);
      }
    );

  return dfd.promise;
}

ctrl.transferTicketTemplatePreview = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "transferTicketTemplatePreview",
    preview_service
  );
};

function load_employee_info() {
  var dfdAr = [];
  dfdAr.push(load_employee_detail());
  $q.all(dfdAr).then(
    function () {
      ctrl._notyetInit = false;
    },
    function (err) {
      console.log(err);
      err = undefined;
    }
  );
}

function load_employee_detail() {
  var dfd = $q.defer();
  task_details_service
    .loadEmployeeDetail($rootScope.logininfo.data.employee)
    .then(
      function (res) {
        ctrl.sign = res.data.signature.link;
        ctrl.quotationMark = res.data.quotationMark.link;
        dfd.resolve(true);
      },
      function () {
        dfd.reject(false);
        err = undefined;
      }
    );
  return dfd.promise;
}

ctrl.prepareInsert = function () {
  ctrl.loadUserAndDepartment();

  $rootScope.statusValue.generate(
      ctrl._ctrlName,
      "Task",
      "insert"
  );

  ctrl._insert_value = {
      file: undefined,
      fileError: undefined,
      relatedfile: [],
      title: "",
      flow: "",
      document_type: "",
      templateTags: [],
      appendixFile: [],
      archived_documents: []
  };
};

//**TRANSFER TICKET***/

ctrl.loadWorkflow_details = function (params) {
  let dfd = $q.defer();
  task_details_service.loadWorkflow_details(params.id).then(function (res) {
      dfd.resolve(res.data);
      res = undefined;
  }, function (err) {
      dfd.reject(err);
      err = undefined;
  });
  return dfd.promise;
}

ctrl.chooseWFT_insert = function (val) {
  ctrl._insert_value.document_type = val.value;
  ctrl.WF2 = [];
  for (var i in ctrl.WF) {
      if(val.value == 'archive') {
          ctrl.WF2.push(ctrl.WF[i]);
      }
       else if (val.value === ctrl.WF[i].key){
          ctrl.WF2.push(ctrl.WF[i]);
      }
  }
  ctrl.listUsers = [];
};
ctrl.chooseWF_insert = function (val) {
  
  const allowChooseDestination = val.allow_choose_destination === true ? 'true' : 'false';

  ctrl._insert_value.is_personal = val.is_personal;
  ctrl._insert_value.is_department = val.is_department;

  ctrl._insert_value.allow_choose_destination = allowChooseDestination;
  ctrl._insert_value.userAndDepartmentDestination = {
      user: [],
      department: []
  };

  val.file_type =
      val.file_type ||
      (val.customTemplate
          ? "custom_template"
          : "file_upload");
  ctrl.listUsers = [];
  ctrl._insert_value.key = val._id;
  ctrl._insert_value.wf = val;
  ctrl._insert_value.templateTags = angular.copy(
      val.templateTags.map(tag => {
          if (tag.pickKey === 'user') {
              tag.rawValue = $rootScope.logininfo.data.username;
              tag.value = $rootScope.logininfo.data.username;
          } else if (tag.pickKey === 'department') {
              tag.rawValue = ctrl.departmentDetails.id;
              tag.value = ctrl.departmentDetails.id;
          }
          return tag;
      })
  );

  // handle flow

  ctrl.listUsers = ctrl.listUsersDefault.filter((u) =>
      val.flow.some((f) =>
          f.items.some(
              (i) =>
                  u.competence &&
                  i.competence === u.competence.value
          )
      )
  );
  ctrl.showLoadMore =
      ctrl.listUsers.length > ctrl.showCount ? true : false;

  let tempFlow = val.flow;
  // handle flow
  for (var i in tempFlow) { 
      for (var j in tempFlow[i].items) {
          if (tempFlow[i].items[j].methods === 'flexible' ) {
              let processType = tempFlow[i].items[j].processType;
              let processLeader = ctrl.departmentDetails[processType];
              let employeeLeader = ctrl.listAllUser.find(user => user.username === processLeader);
              let competenceLeader = employeeLeader.competence.value || employeeLeader.competence;
              let userInfor = ctrl.listAllUser.find(user => user.username === processLeader);
              let departmentLeader = userInfor.departmentId;
              let newItem = {
                  ...tempFlow[i].items[j],
                  department: departmentLeader,
                  competence: competenceLeader,
              }
              tempFlow[i].items[j] = newItem;

          } else {
              tempFlow[i].items[j] = val.flow[i].items[j];
          }
      }
  }
  val.flow = tempFlow;
  
};
  

ctrl.pickUserAndDepartment_insert = function (val) {
  ctrl._insert_value.userAndDepartment = val;
}

ctrl.loadFileTemplate = function (params) {
  return function () {
      var dfd = $q.defer();
      task_details_service
          .loadFileTemplateInfo(params.name)
          .then(
              function (res) {
                  dfd.resolve({
                      display: params.display,
                      embedUrl: res.data.url,
                  });
                  res = undefined;
                  dfd = undefined;
              },
              function (err) { }
          );
      return dfd.promise;
  };
};

function parseTemplate_service(file) {
  return function () {
      var dfd = $q.defer();
      task_details_service.parseCustomTemplate(file).then(function (res) {
          const tagNames = ((res.data || {}).tags || []).map(tag => tag.name);
          const isValidTags = ctrl._insert_value.wf.templateTags.every(tag => tagNames.includes(tag.name));
          ctrl._insert_value.fileError = isValidTags ? '' : 'File is missing required tags';
          dfd.resolve(true);
          dfd = undefined;
      }, function (err) {
          ctrl._insert_value.fileError = 'Invalid file format';
          dfd.reject(err);
          dfd = undefined;
      });
      return dfd.promise;
  }
};

ctrl.handleSelectFile = function (file) {
  return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "parseTemplate", parseTemplate_service(file));
};

ctrl.removeFile_insert = function () {
  ctrl._insert_value.file = undefined;
  ctrl._insert_value.fileError = undefined;
};

ctrl.removeRelatedFile_insert = function (item) {
  var temp = [];
  for (var i in ctrl._insert_value.relatedfile) {
      if (
          ctrl._insert_value.relatedfile[i].name != item.name
      ) {
          temp.push(ctrl._insert_value.relatedfile[i]);
      }
  }
  ctrl._insert_value.relatedfile = angular.copy(temp);
};

ctrl.removeAppendixFile_insert = function (item) {
  var temp = [];
  for (var i in ctrl._insert_value.appendixFile) {
      if (
          ctrl._insert_value.appendixFile[i].name != item.name
      ) {
          temp.push(ctrl._insert_value.appendixFile[i]);
      }
  }
  ctrl._insert_value.appendixFile = angular.copy(temp);
};

ctrl.chooseDateTag_insert = function ($index, val) {
  ctrl._insert_value.templateTags[$index].rawValue =
      val.getTime();
  ctrl._insert_value.templateTags[$index].value = dayjs(
      val.getTime()
  ).format(ctrl._insert_value.templateTags[$index].format);
};

ctrl.chooseDropdownTag_insert = function ($index, val) {
  ctrl._insert_value.templateTags[$index].rawValue =
      val.value;
  ctrl._insert_value.templateTags[$index].value =
      val.title[$rootScope.Language.current];
};

ctrl.chooseArchivedDocumentTag_insert = function ($index, params) {
  ctrl._insert_value.templateTags[$index].rawValue =
      params.value;
  ctrl._insert_value.templateTags[$index].value = params._id;
  ctrl._insert_value.archived_documents = params.outgoing_documents
};

ctrl.isCustomTagsValid = function () {
  const tags = ctrl._insert_value.templateTags;

  for (let i = 0; i < tags.length; i++) {
      const formField =
          $scope.forms.insertForm[
          "templateTags_" + tags[i].name
          ];
      if (
          (tags[i].type === "text" ||
              tags[i].type === "number") &&
          (!formField || !formField.$valid)
      ) {
          return false;
      }
      if (
          (tags[i].type === "date" ||
              tags[i].type === "dropdown") &&
          !tags[i].value
      ) {
          return false;
      }
  }

  return true;
};

function getTagsValue() {
  const tagsValue = {};

  ctrl._insert_value.templateTags.forEach((tag) => {
      tagsValue[tag.name] = tag.value;
  });

  return tagsValue;
}

function loadCustomTemplatePreview_service() {
  var dfd = $q.defer();
  const workflowId = ctrl._insert_value.wf._id;
  const tagsValue = getTagsValue();

  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  $rootScope.FileService.bind({
      display: "",
      embedUrl: "/component/loading.html",
  });
  $rootScope.FileService.show();

  task_details_service
      .loadCustomTemplatePreview(workflowId, tagsValue)
      .then(
          function (res) {
              $rootScope.FileService.bind({
                  display:
                      ctrl._insert_value.wf.templateFiles[0] 
                          .display,
                  embedUrl: res.data.url,
                  serviceName: "workflow",
                  attachmentId: "",
              });

              dfd.resolve(true);
          },
          function (err) {
              dfd.reject(err);
          }
      );

  return dfd.promise;
}

ctrl.loadCustomTemplatePreview = function () {
  return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "loadCustomTemplatePreview",
      loadCustomTemplatePreview_service
  );
};

function insert_transferTicket_service() {
  var dfd = $q.defer();
  const files = ctrl._insert_value.file ? [ctrl._insert_value.file] : [];

  const flowInfo = {
      _id: ctrl._insert_value.wf._id,
      title: ctrl._insert_value.wf.title,
  };

  const tagsValue = getTagsValue();
  let parent = {};
  let parents = [];

  if ($scope.parentItem) {
      parent.id = $scope.parentItem._id;
      parent.object = $scope.parentType;

      switch ($scope.parentType) {
          case "task":
          case "dispatcharrived":
              parent.code = $scope.parfentItem.code;
              break;
      }

      parents = $scope.parentItem.parents || [];
  }

  task_details_service
      .insert(
          files,
          ctrl._insert_value.relatedfile,
          ctrl._insert_value.appendixFile,
          ctrl._insert_value.title,
          flowInfo,
          ctrl._insert_value.wf.flow,
          ctrl._insert_value.document_type,
          tagsValue,
          ctrl._insert_value.archived_documents,
          parents,
          parent,
          ctrl._insert_value.userAndDepartmentDestination,
          ctrl._insert_value.is_personal || false,  
          ctrl._insert_value.is_department || false,
          ctrl.Item.department.id,
          ctrl._insert_value.department,
          ctrl.Item._id,
          ctrl._parentID,
          ctrl.Item.parents || [],
          {
            code: ctrl.Item.code,
            value: ctrl.Item._id,
            object: "task",
          },
      )
      .then(
          function (res) {
              $("#modal_TranferTicket_Insert").modal("hide");
              ctrl.loadDetails();
              dfd.resolve(true);
              dfd = undefined;

              if ($scope.insertSuccessFunc) {
                  $scope.insertSuccessFunc({ params: res.data });
              }
          },
          function (err) {
              dfd.reject(err);
              err = undefined;
          }
      );

  return dfd.promise;
}

ctrl.insert_transferTicket = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "insert_transferTicket",
    insert_transferTicket_service
  );
};

ctrl.handleClickInsert = function () {
  // check if this file need a signature from creator
  const needCreatorSign =
      ctrl._insert_value.templateTags.some(
          (tag) =>
              tag.type === "creator_signature" ||
              tag.type === "creator_quotation_mark"
      );
  if (needCreatorSign) {
      ctrl.showModalSignAFile = true;
  } else {
      ctrl.insert_transferTicket();
  }
};

ctrl.loadUserAndDepartment = function () {
  return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "loadUserAndDepartment",
      load_users_and_department_service
  );
};

function load_users_and_department_service() {
  var dfd = $q.defer();
  let dfdArr = [];

  if (ctrl.listUsersDefault.length === 0) {
      let request = {
          department: $rootScope.logininfo.data.department,
          top: 0,
          offset: ctrl.offset,
          sort: { title: 1 },
      };
      dfdArr.push(
        task_details_service.loadUsersByDepartment(request)
      );
  }

  if (Object.keys(ctrl.departmentDetails).length === 0) {
      dfdArr.push(
        task_details_service.loadDepartmentDetails(
              $rootScope.logininfo.data.department
          )
      );
  }

  if (ctrl.listAllUser.length === 0) {
      dfdArr.push(
        task_details_service.loadAllUser()
      );
  }

  $q.all(dfdArr).then(
      function (data) {
          ctrl.listUsersDefault = data[0].data;
          ctrl.departmentDetails = data[1].data;
          ctrl.listAllUser = data[2].data;
          dfd.resolve(true);
          dfd = undefined;
      },
      function (err) {
          dfd.reject(err);
          err = undefined;
      });
    return dfd.promise;
  }

  ctrl.handleHideModalSignAFile = function () {
    ctrl.showModalSignAFile = false;
  };

  ctrl.handleClickSign_insert = function () {
    ctrl.insert_transferTicket();
  };

  $(document).on('show.bs.modal', "#modal_TranferTicket_Insert", function (e) {
    if (e.target.id === 'modal_TranferTicket_Insert') {
        $scope.$apply(function () {
            ctrl.prepareInsert();
        });
    }
  });

  function signAFile_service() {
    return function () {
      var dfd = $q.defer();
      task_details_service.signAFile(ctrl.Item._id).then(
        function (res) {
          ctrl.loadDetails();
          dfd.resolve(true);
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

  ctrl.signAFile = function (filename) {
    return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "signAFile",
      signAFile_service(filename)
    );
  };

  ctrl.handle_insert_notify_success = function (data) {
    $(".task-details-container #notify_insert_modal").modal("hide");
    ctrl.Item.notify_detail = data.data;
    ctrl._insert_value.notify_detail = data.data;
    ctrl.notify_detail = data.data;
  };

  ctrl.load_notify_file = function (params) {
    return function () {
      var dfd = $q.defer();
      notify_service.loadFileInfo(params.id, params.name).then(
        function (res) {
          dfd.resolve({
            display: res.data.display,
            embedUrl: res.data.url,
            guid: res.data.guid,
          });
          res = undefined;
          dfd = undefined;
        },
        function (err) { }
      );
      return dfd.promise;
    };
  };

  ctrl.closePopup = function () {
    ctrl.showPopup = false;
  };

  openPopup = (title, content, type) => {
    ctrl.showPopup = true;
    ctrl.titlePopup = title;
    ctrl.contentPopup = content;
    ctrl.typePopup = type;
    $rootScope.$apply();
  };

  async function getTaskPermissionProperties() {
    const item = ctrl.Item;
    const sourceId = +item.source_id;
    const SOURCE_ID_LEVEL_1 = [1];
    const SOURCE_ID_LEVEL_2 = [2, 3, 4, 5];
    
    const isDirectorManage = $filter("checkRuleCheckbox")(TASK_RULE.DIRECTOR_MANAGE);
    
    const permissions = {
      allowUploadProof: false,
      allowEditTask: false,
      allowDeleteTask: false,
      allowCancelTask: false,
      allowCompleteTask: false,
      allowDoneTask: false,
      allowCreateTransferTicket: false,
      allowDeleteTransferTicket: false,
      allowHandleTask: false,
      allowResponseTransferTicket: true,
      allowReceiveTask: false,
    };
    if($filter('checkRuleCheckbox')(TASK_RULE.RECEIVE_TASK) && $rootScope.logininfo.data.department === item.department.id && item.status === TASK_STATUS.WAITING_RECEIVE){
      permissions.allowReceiveTask = true;
    }

    const isUserInvolved = (userList) => userList.indexOf($rootScope.logininfo.data.username) !== -1;
    const isCreator = item.username === $rootScope.logininfo.data.username;
    const isObserver = item.observer.includes($rootScope.logininfo.data.username)
    const isMainPerson = item.main_person.includes($rootScope.logininfo.data.username)
    const isParticipant = item.participant.includes($rootScope.logininfo.data.username)

    const setPermissions = (conditions) => {
      permissions.allowUploadProof = conditions.allowUploadProof ?? permissions.allowUploadProof;
      permissions.allowUpdateProgess = conditions.allowUpdateProgess ?? permissions.allowUpdateProgess;
      permissions.allowEditTask = conditions.allowEditTask ?? permissions.allowEditTask;
      permissions.allowDeleteTask = conditions.allowDeleteTask ?? permissions.allowDeleteTask;
      permissions.allowCancelTask = conditions.allowCancelTask ?? permissions.allowCancelTask;
      permissions.allowCompleteTask = conditions.allowCompleteTask ?? permissions.allowCompleteTask;
      permissions.allowDoneTask = conditions.allowDoneTask ?? permissions.allowDoneTask;
      permissions.allowCreateTransferTicket = conditions.allowCreateTransferTicket ?? permissions.allowCreateTransferTicket;
      permissions.allowDeleteTransferTicket = conditions.allowDeleteTransferTicket ?? permissions.allowDeleteTransferTicket;
      permissions.allowDoneTask = conditions.allowDoneTask ?? permissions.allowDoneTask;
      permissions.allowHandleTask = conditions.allowHandleTask ?? permissions.allowHandleTask;
      permissions.allowResponseTransferTicket = conditions.allowResponseTransferTicket ?? permissions.allowResponseTransferTicket;
    };
    const getCommonConditions = (departmentId) => {
      const isLeaderManage = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.LEADER_MANAGE);
      const isDepartmentLeaderManage = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.DEPARTMENT_LEADER_MANAGE);
      const isStaffManage = !isDirectorManage && !isLeaderManage && !isDepartmentLeaderManage;

      const isAllowDelete = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.DELETE_TASK_DEPARTMENT);
      const isAllowEdit = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.EDIT_TASK_DEPARTMENT);
      const isAllowCreateTransferTicket = $filter("checkRuleCheckbox")(TASK_RULE.RECEIVE_TASK);
      const isAllowUpdateProgess = (isMainPerson || isObserver || isParticipant) && (item.status !== 'Completed')
      const isAllowUploadProof = (isMainPerson || isObserver || isParticipant) 

      return { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit, isAllowCreateTransferTicket, isAllowUpdateProgess, isAllowUploadProof };
    };
    
    
    // Check permission for task source 1
    if (SOURCE_ID_LEVEL_1.includes(sourceId)) {
      const { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit, isAllowUpdateProgess, isAllowUploadProof, isAllowCreateTransferTicket } = getCommonConditions(item.department?.id);
      const isOnlyHaveDepartmentLeaderManage = isDepartmentLeaderManage && !isDirectorManage && !isLeaderManage;
      const isPIC = isUserInvolved(item.main_person) || isUserInvolved(item.participant) || isUserInvolved(item.observer);
      const isMainPerson = isUserInvolved(item.main_person)

      setPermissions({
        allowUploadProof: isAllowUploadProof,
        allowUpdateProgess: isAllowUpdateProgess,
        allowEditTask: isDepartmentLeaderManage || isDirectorManage || isLeaderManage || isAllowEdit || isPIC || isCreator || isObserver,
        allowDeleteTask: (!isStaffManage && !isOnlyHaveDepartmentLeaderManage) || isDirectorManage || isLeaderManage || isAllowDelete || isCreator,
        allowCancelTask: (!isStaffManage && !isOnlyHaveDepartmentLeaderManage) || isDirectorManage || isLeaderManage || isCreator,
        allowCompleteTask: isDirectorManage || isLeaderManage,
        allowDoneTask: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
        allowCreateTransferTicket: isAllowCreateTransferTicket && isMainPerson,
        allowDeleteTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
        allowHandleTask: isDepartmentLeaderManage || isDirectorManage || isLeaderManage || isAllowEdit || isPIC || isCreator,
        allowResponseTransferTicket: isDepartmentLeaderManage || isDirectorManage || isLeaderManage || isAllowEdit || isPIC || isCreator,
      });

      // Check permission for task source 2,3,4,5
    } else if (item.level === 'Task') {
      const { isLeaderManage, isDepartmentLeaderManage, isAllowUpdateProgess, isAllowUploadProof, isAllowCreateTransferTicket } = getCommonConditions(item.department?.id);
      const result = await task_details_service.loadDetails(item.head_task_id);
      const headTask = result.data;
      const isPIC = isUserInvolved(headTask.main_person) || isUserInvolved(headTask.participant) || isUserInvolved(headTask.observer);
      const isMainPerson = isUserInvolved(item.main_person)

      const commonCondition = isPIC || isCreator || isDirectorManage || isLeaderManage || isDepartmentLeaderManage
      setPermissions({
        allowUploadProof: isAllowUploadProof,
        allowUpdateProgess: isAllowUpdateProgess,
        allowEditTask: commonCondition,
        allowHandleTask: commonCondition,
        allowDeleteTask: commonCondition,
        allowCancelTask: commonCondition,
        allowCompleteTask: commonCondition,
        allowDoneTask: commonCondition,
        allowCreateTransferTicket: isAllowCreateTransferTicket && isMainPerson,
        allowDeleteTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
        allowResponseTransferTicket: commonCondition,
      });
    }
    else if (item.level === 'HeadTask') {
      const { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit, isAllowUpdateProgess, isAllowUploadProof, isAllowCreateTransferTicket } = getCommonConditions(item.from_department ?? item.department?.id);
      const isPIC = isUserInvolved(item.main_person) || isUserInvolved(item.participant) || isUserInvolved(item.observer);
      const isMainPerson = isUserInvolved(item.main_person)
      
      const commonCondition = isDepartmentLeaderManage || isDirectorManage || isLeaderManage
      setPermissions({
        allowUploadProof: isAllowUploadProof,
        allowUpdateProgess: isAllowUpdateProgess,
        allowEditTask: isAllowEdit || commonCondition || isLeaderManage || isPIC || isCreator,
        allowHandleTask: isAllowEdit || commonCondition || isLeaderManage || isPIC || isCreator,
        allowDeleteTask: !isStaffManage && (isAllowDelete || commonCondition || isLeaderManage || isPIC || isCreator),
        allowCancelTask: !isStaffManage && (commonCondition || isPIC || isCreator),
        allowCompleteTask: commonCondition,
        allowDoneTask: isPIC || commonCondition || isCreator,
        allowCreateTransferTicket: isAllowCreateTransferTicket && isMainPerson,
        allowDeleteTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
        allowResponseTransferTicket: commonCondition || isAllowEdit || isPIC || isCreator,
      });
    }

    if (![TASK_STATUS.PROCESSING, TASK_STATUS.COMPLETED].includes(item.status)) {
      setPermissions(
        {
          allowResponseTransferTicket: false,
        });
    }

    // check permission base on item status
    if ([TASK_STATUS.PENDING_APPROVAL, TASK_STATUS.WAITING_FOR_APPROVAL, TASK_STATUS.CANCELLED, TASK_STATUS.COMPLETED, TASK_STATUS.NOT_SEEN].includes(item.status)) {
      setPermissions(
        {
          allowEditTask: false,
          allowCancelTask: false,
          allowCreateTransferTicket: false,
          allowDeleteTransferTicket: false,
        });
    }
    if ([TASK_STATUS.CANCELLED, TASK_STATUS.COMPLETED].includes(item.status)) {
      setPermissions(
        {
          allowHandleTask: false,
        });
    }
    if (![TASK_STATUS.PROCESSING].includes(item.status) || item.progress < 100) {
      setPermissions(
        {
          allowDoneTask: false,
        });
    }
    if (![TASK_STATUS.WAITING_FOR_APPROVAL].includes(item.status) || item.progress < 100) {
      setPermissions(
        {
          allowCompleteTask: false,
        });
    }

      // If this task is a task from transfer ticket,
      // it will only allow reponse and not create any transfer ticket
      if (item?.transfer_ticket_parent?.type == 'Assign') {
        setPermissions(
          {
            allowCreateTransferTicket: false,
            allowDeleteTransferTicket: false,
          });
      }


    return permissions;
  }

  ctrl.chooseTaskPriority_InsertTranferTask = function (val) {
    const priority = $filter('taskPriorityTransform')(val.value);
    ctrl._value_insert.priority = priority.key;
  };

  ctrl.loadLabel_InsertTranferTask = function ({ search, top, offset, sort }) {
    var dfd = $q.defer();
    task_service.load_label(search, top, offset, sort).then(
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
  ctrl.loadLabel_details_InsertTranferTask = function ({ ids }) {
    var dfd = $q.defer();
    task_service.loadLabel_details(ids).then(
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

  ctrl.chooseDepartment_InsertTranferTask = function (val) {
    ctrl._value_insert.to_department = val.id;
  };

  ctrl.prepare_InsertTranferTask = function(){
    ctrl._value_insert = {
      to_department: null,
      title: ctrl.Item.title,
      priority: $filter('taskPriorityTransform')(ctrl.Item.priority).value,
      parent_code: ctrl.Item.code,
      from_date: ctrl.Item.from_date,
      to_date: ctrl.Item.to_date,
      label: ctrl.Item.label,
      level: ctrl.Item.level,
      source_id: "2",
      estimate: ctrl.Item.estimate,
      parent: {
        object: "task",
        code: ctrl.Item.code,
        id: ctrl.Item._id,
        value: ctrl.Item.code
      },
      parents: ctrl.Item.parents,
    };

    $("#" + 'insertTranferTask_content').summernote({
      placeholder: $filter("l")("InputContentHere"),
      toolbar: [
        ['style', ['style']], 
        ['style', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['picture', 'table']],
        ['misc', ['fullscreen', 'help']]
      ],
    });
  }

  ctrl.removeFile_InsertTranferTask = function(item){
    ctrl._value_insert.files = ctrl._value_insert.files.filter(e => e.name !== item.name);
  }

  ctrl.pickLabel_InsertTranferTask = function (value) {
    ctrl._value_insert.label = value;
  };

  ctrl.insert_transferTicketTask = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insert_tranfer_task", insert_transferTicketTask_service);
  }

  

  function genData_insert_transferTicketTask(){
    const data = {};
    data.title = ctrl._value_insert.title;
    data.priority = $filter('taskPriorityTransform')(ctrl._value_insert.priority).key;
    data.to_date = ctrl._value_insert.to_date;
    data.from_date = ctrl._value_insert.from_date;
    data.files = ctrl._value_insert.files;
    data.to_department = ctrl._value_insert.to_department;
    data.parent_code = ctrl._value_insert.parent_code;
    data.parent = ctrl._value_insert.parent;
    data.files = ctrl._value_insert.files;
    data.label = ctrl._value_insert.label;
    data.level = ctrl._value_insert.level;
    data.estimate = ctrl._value_insert.estimate;
    data.source_id = ctrl._value_insert.source_id;
    data.content = $("#" + 'insertTranferTask_content').summernote("code");
    return data;
  }

  

  function insert_transferTicketTask_service(){
    const dfd = $q.defer();
    const dataInsert = genData_insert_transferTicketTask();
    task_details_service.insert_transferTicketTask(dataInsert).then(
      function(res){
        $('#modal_Insert_Tranfer_Task').modal('hide');
        dfd.resolve(true);
        ctrl.refresh_data();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('You have created a work request for department'),
          type:"success"
        });
        dfd = undefined;
      },
      function(err){
        dfd.reject(err);
        err = undefined;
      }
    );
    dfd.resolve(true);
    return dfd.promise;
  }


  ctrl.prepareReceive_Task = function ({item, action}) {
    ctrl._assess_value = item;
    ctrl._assess_value.note = '';
    ctrl._assess_value.action = action;
    ctrl._assess_value.title_modal = 'Receive task';
    if(action === 'approve_recive_task'){
      ctrl._assess_value.title_modal = 'Approval'
    }
    ctrl._assess_value.priority = $filter('taskPriorityTransform')(ctrl._assess_value.priority).value
  };

  ctrl.receive_task_f = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "receive_task", receive_task_service);
  }

  function receive_task_service(){
    const dfd = $q.defer();
    task_service.receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
      function(){
        $("#modal_Receive_Task_Assess_detail").modal("hide");
        dfd.resolve(true);
        ctrl.refresh_data();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Receive task successfully'),
          type:"success"
        });
        dfd = undefined;
      },
      function(err){
        dfd.reject(err);
        err = undefined;
      }
    );
    return dfd.promise;
  }

  ctrl.approval_receive_task = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "approval_receive_task", approval_receive_task_service);
  }

  function approval_receive_task_service(){
    const dfd = $q.defer();
    task_service.approval_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
      function(){
        $("#modal_Receive_Task_Assess_detail").modal("hide");
        dfd.resolve(true);
        ctrl.refresh_data();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Approval receive task successfully'),
          type:"success"
        });
        dfd = undefined;
      },
      function(err){
        dfd.reject(err);
        err = undefined;
      }
    );
    return dfd.promise;
  }

  ctrl.reject_approval_receive_task = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "reject_approval_receive_task", reject_approval_receive_task_service);
  }

  function reject_approval_receive_task_service(){
    const dfd = $q.defer();
    task_service.reject_approval_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
      function(){
        $("#modal_Receive_Task_Assess_detail").modal("hide");
        dfd.resolve(true);
        ctrl.refresh_data();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Reject approval receive task successfully'),
          type:"success"
        });
        dfd = undefined;
      },
      function(err){
        dfd.reject(err);
        err = undefined;
      }
    );
    return dfd.promise;
  }

  ctrl.reject_receive_task = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "reject_receive_task", reject_receive_task_service);
  }

  function reject_receive_task_service(){
    const dfd = $q.defer();
    task_service.reject_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
      function(){
        $("#modal_Receive_Task_Assess_detail").modal("hide");
        dfd.resolve(true);
        ctrl.refresh_data();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Reject receive task successfully'),
          type:"success"
        });
        dfd = undefined;
      },
      function(err){
        dfd.reject(err);
        err = undefined;
      }
    );
    return dfd.promise;
  }

  ctrl.prepareUpdate = function (value, action) {
    if (action === 'A') {
      ctrl.actionAccess = TASK_EVENT.ASSIGNMENT;
    }
    else {
      ctrl.actionAccess = TASK_EVENT.UPDATED_INFORMATION
    }

    ctrl.workflow_plays = [];
    $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");
    if (value.workflowPlay) {
      ctrl.workflow_plays = [value.workflowPlay];
    } else {
      ctrl.workflow_plays = [];
    }
    if (value.notify_detail) {
      ctrl.notify_detail = value.notify_detail;
    } else {
      ctrl.notify_detail = null;
    }
    // if (!value.repetitive) {
    //   value.repetitive = {
    //     has_endDate: false,
    //     per: 1,
    //     cycle: "day", // allow: days, weeks, months, years
    //     endDate: null // null or "" khi ko hết hạn
    //   }
    // }
    ctrl._update_value = angular.copy(value);
    ctrl._update_value.priority = task_service.taskPriorityTransform(ctrl._update_value.priority).value;
    ctrl._update_value.task_type = (task_service.taskTypeTransform(ctrl._update_value.task_type) || {}).value;

    ctrl._update_value.has_repetitive = ctrl._update_value.has_repetitive || false;
    ctrl._update_value.per = ctrl._update_value.per || 1;
    ctrl._update_value.cycle = ctrl._update_value.cycle || "day";
    ctrl._update_value.has_expired = ctrl._update_value.has_expired || false;
    ctrl._update_value.expired_date = ctrl._update_value.expired_date?.toString() || null;

    $("#" + idEditor_update).summernote({
      placeholder: $filter("l")("InputContentHere"),
      toolbar: [
        ['style', ['style']],
        ['style', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['picture', 'table']],
        ['misc', ['fullscreen', 'help']]
      ],
      callbacks: {
        onImageUpload: function (image) {
          var formData = new FormData();
          formData.append('type', "image");
          formData.append('file', image[0], image[0].name);
          task_service.uploadImage(formData).then(function (res) {
            var thisImage = $('<img>').attr('src', res.data);
            $("#" + idEditor_update).summernote('insertNode', thisImage[0]);
          }, function (err) {

          })
        }
      }
    });
    $("#" + idEditor_update).summernote('code', value.content);
  }

  ctrl.insertLabel = function (item) {
    var dfd = $q.defer();
    task_service.insert_label(item).then(
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

  ctrl.loadLabel = function ({ search, top, offset, sort }) {
    var dfd = $q.defer();
    task_service.load_label(search, top, offset, sort).then(
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
    task_service.loadLabel_details(ids).then(
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

  ctrl.pickLabel = function (value) {
    ctrl._update_value.label = value;
  };

  ctrl.prepareComplete = function (value, action) {
    ctrl.actionAccess = action;
    ctrl._complete_value = angular.copy(value)
    $("#" + idEditor_complete).summernote({
      placeholder: $filter("l")("Note"),
      callbacks: {
        onImageUpload: function (image) {
          var formData = new FormData();
          formData.append("type", "image");
          formData.append("file", image[0], image[0].name);
          task_details_service.uploadImage(formData).then(
            function (res) {
              var thisImage = $("<img>").attr("src", res.data.data);
              $("#" + idEditor_complete).summernote("insertNode", thisImage[0]);
            },
            function (err) { }
          );
        },
      },
    });
    $("#" + idEditor_complete).summernote("code", "");
  };

  ctrl.updateSubAttachment = function(file) {
    if (file.checked) {
        // Thêm file vào mảng nếu checkbox được chọn
        ctrl.subAttachment.push(file);
    } else {
        // Loại bỏ file khỏi mảng nếu checkbox bị bỏ chọn
        ctrl.subAttachment = ctrl.subAttachment.filter(f => f !== file);
    }
  };

  function confirmDone_service() {
    var dfd = $q.defer();
    let filesProof = ctrl.filesProof.map((file) => {
      const date = new Date();
      const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}-${date
          .getHours()
          .toString()
          .padStart(2, "0")}.${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}.${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
      let fileExtension = file.name.split(".").pop();
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      return {
        ...file,
        name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
      };
    });
    
    task_details_service
      .done(ctrl._done_value._id, ctrl.code,  $("#" + idEditor_done).summernote("code"), filesProof, ctrl.Item.worktimes, ctrl.subAttachment)
      .then(
        function (res) {
          ctrl.proofErr = "";
          ctrl.proofText = "";
          ctrl.filesProof = [];
          ctrl.fileInput = null;
          ctrl.proofFileSizeErr = false;
          $('#modal_Confirm_Done_Modal').modal('hide');
          ctrl.loadDetails();
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
          emitTaskReloadEvent(ctrl.code);
        },
        function (err) {
          ctrl.proofErr = get_value_error(err.data.mes);
          dfd.reject(err);
          err = undefined;
        }
      );
    return dfd.promise;
  };
  
  ctrl.confirmDoneAction = function () {
    return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "done",
      confirmDone_service
    );
  };

  function refune_task_service() {
    var dfd = $q.defer();
    let filesProof = ctrl.filesProof.map((file) => {
      const date = new Date();
      const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}-${date
          .getHours()
          .toString()
          .padStart(2, "0")}.${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}.${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
      let fileExtension = file.name.split(".").pop();
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      return {
        ...file,
        name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
      };
    });
    
    task_details_service
      .refune(ctrl._complete_value._id, ctrl.code, $("#" + idEditor_complete).summernote("code"), filesProof, ctrl.progress)
      .then(
        function (res) {
          ctrl.proofErr = "";
          ctrl.proofText = "";
          ctrl.filesProof = [];
          ctrl.fileInput = null;
          ctrl.proofFileSizeErr = false;           
          $('#modal_Task_Complete').modal('hide');
          ctrl.loadDetails();
          ctrl.progressChanged = false;
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
          emitTaskReloadEvent(ctrl.code);
        },
        function (err) {
          ctrl.proofErr = get_value_error(err.data.mes);
          dfd.reject(err);
          err = undefined;
        }
      );
    return dfd.promise;
  };
  
  ctrl.refuneTask = function () {
    return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "Task",
      "refune",
      refune_task_service
    );
  };


  //Update task level 1
  ctrl.prepareUpdate_head_task = function(item){
    ctrl._update_value = angular.copy(item);
    ctrl._update_value.new_files = [];
    ctrl._update_value.department_id = ctrl._update_value.department.id;
    ctrl._update_value.remove_attachment = [];
    ctrl._update_value.priority = $filter('taskPriorityTransform')(ctrl._update_value.priority).value
    $("#" + ctrl._idEditor_update_head_task).summernote({
      placeholder: $filter("l")("InputContentHere"),
      toolbar: [
          ['style', ['style']], 
          ['style', ['bold', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['picture', 'table']],
          ['misc', ['fullscreen', 'help']]
        ],
      callbacks: {
          onImageUpload: function (image) {
              var formData = new FormData();
              formData.append('type', "image");
              formData.append('file', image[0], image[0].name);
              task_service.uploadImage(formData).then(function (res) {
                  var thisImage = $('<img>').attr('src', res.data);
                  $("#" + ctrl._idEditor_update_head_task).summernote('insertNode', thisImage[0]);
              }, function (err) {

              })
          }
      }
    });
    $("#" + ctrl._idEditor_update_head_task).summernote('code', item.content);
  }

  ctrl.chooseFromDate_update_head_task = function (val) {
    ctrl._update_value.from_date = val ? val.getTime() : undefined;
    if(ctrl._update_value.from_date >= ctrl._update_value.to_date){
      ctrl.fromDate_update_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date);
    }else{
      ctrl.fromDate_update_ErrorMsg = '';
    }
  };

  ctrl.chooseToDate_update_head_task = function (val) {
    ctrl._update_value.to_date = val ? val.getTime() : undefined;
    if(ctrl._update_value.from_date >= ctrl._update_value.to_date){
      ctrl.fromDate_update_ErrorMsg = $rootScope.isValidFromDate(true, ctrl._update_value.from_date, ctrl._update_value.to_date);
    }else{
      ctrl.fromDate_update_ErrorMsg = '';
    }
  };

  ctrl.chooseDepartment_update_head_task = function(val){
    ctrl._update_value.department_id = val.id;
  }

  ctrl.pickObserver_update_head_task = function(val){
    ctrl._update_value.observer = val;
  }

  ctrl.chooseTaskPriority_update_head_task = function (val) {
    const priority = $filter('taskPriorityTransform')(val.value);
    ctrl._update_value.priority = priority.key;
  };

  ctrl.pickLabel_update_head_task = function (value) {
    ctrl._update_value.label = value;
  };

  ctrl.removeFile_update_head_task = function (item) {
    ctrl._update_value.attachment = ctrl._update_value.attachment.filter(
      (e) => e.name !== item.name
    );
    ctrl._update_value.remove_attachment.push(item.name)
  };

  ctrl.removeNewFile_update_head_task = function (item) {
    ctrl._update_value.new_files = ctrl._update_value.new_files.filter(
      (e) => e.name !== item.name
    );
  };

  ctrl.update_head_task = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'update', update_head_task_service);
  }

  function update_head_task_service(){
    const dfd = $q.defer();
    task_service.update_head_task(
      ctrl._update_value.code, //code
      ctrl._update_value.new_files, //new file
      ctrl._update_value.remove_attachment, //remove_file
      ctrl._update_value.title, //title
      $("#" + ctrl._idEditor_update_head_task).summernote('code'), //content
      ctrl._update_value.observer, //observer
      ctrl._update_value.from_date, //from_date
      ctrl._update_value.to_date, //to_date
      $filter('taskPriorityTransform')(ctrl._update_value.priority).key, //priority
      ctrl._update_value.department_id, //1
      ctrl._update_value.label, //label
      ctrl._update_value.estimate, //estimate,
    ).then(function(res){
      $rootScope.$broadcast("importTask:accessDone");
      ctrl.loadDetails();
      ctrl._customToastScope.addToastValue({
        message: $filter('l')('Update successfully'),
        type:"success"
      });
      $('#modal_Head_Task_Update_2').modal('hide');
      dfd.resolve(true);
    }, function(err){
      dfd.reject(err);
    });

    return dfd.promise;
  }
  //End update task level 1

}]);

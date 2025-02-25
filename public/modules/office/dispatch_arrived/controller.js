myApp.registerCtrl("dispatch_feature_container_controller", [
  "dispatch_arrived_service",
  "$q",
  "$rootScope",
  "$timeout",
  "$filter",
  "$scope",
  "$location",
  function (
    dispatch_arrived_service,
    $q,
    $rootScope,
    $timeout,
    $filter,
    $scope,
    $location
  ) {
    var ctrl = this;
    const _statusValueSet = [
      { name: "DispatchContainer", action: "init" },
    ];
    {
      ctrl._ctrlName = "dispatch_feature_container_controller";
      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
      ctrl.show_tab_management = false;
      ctrl.show_tab_outGoingDispatch = false;
    }


    function setUrlContent() {
      switch (ctrl.tab) {
        case "Management":
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/dispatch_arrived/views/dispatch_arrived.html";
          break;

        case "DispatchOutGoing":
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/dispatch_arrived/views/dispatch_outgoing.html";
          break;
        default:
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/dispatch_arrived/views/dispatch_arrived.html";
          break;
      }
    }

    ctrl.switchTab = function (val) {
      $location.url("/dispatch?tab=" + val);
      ctrl.tab = val;
      setUrlContent();
    };

    ctrl.logininfo = $rootScope.logininfo;
    
    function init() {
      ctrl.show_tab_management = true;
      ctrl.show_tab_outGoingDispatch = true;
      ctrl.tab = getTab();
      setUrlContent();
    
    }

    function getTab() {
      const tab = $location.search().tab;
    
      if (!ctrl.show_tab_management) {
        return "DispatchOutGoing";
      }
    
      if (["Management", "DispatchOutGoing"].includes(tab)) {
        return tab;
      }
    
      return "Management";
    }

    init();
  },
]);

myApp.registerCtrl("dispatch_arrived_controller", [
  "dispatch_arrived_service",
  "da_details_service",
  "task_service",
  "$q",
  "$rootScope",
  "$filter",
  "$scope",
  function (
    dispatch_arrived_service,
    da_details_service,
    task_service,
    $q,
    $rootScope,
    $filter,
    $scope
  ) {
    /**declare variable */
  
    const _statusValueSet = [
      { name: "DA", action: "init" },
      { name: "DA", action: "load" },
      { name: "DA", action: "count" },
      { name: "DA", action: "countPending" },
      { name: "DA", action: "getNumber" },
      { name: "DA", action: "insert" },
      { name: "DA", action: "update" },
      { name: "DA", action: "delete" },
      { name: "DA", action: "multi_delete" },
      { name: "DA", action: "forward" },
      { name: "DA", action: "receive" },
      { name: "Task", action: "delete" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "update" },
      { name: "DA", action: "forward_CVP" },
      { name: "DA", action: "forward_BGHOpinion" },
      { name: "DA", action: "forward_unit" },
      { name: "DA", action: "transfer_department_approve" },
      { name: "DA", action: "seen_work" },
    ];
    var ctrl = this;
    var idEditor = "insertTask_content";
    /** init variable */
    {
      ctrl._ctrlName = "dispatch_arrived_controller";
      ctrl.scope = "external";
      ctrl.numberPending = 0;
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
      ctrl.dispatch_arriveds = [];
      ctrl._insert_value = {};
      ctrl._insert_task_value = {};
      ctrl._udpate_task_value = {};
      ctrl._update_value = {};
      ctrl._insert_tasks = [];
      ctrl._filterTaskPriority = "";
      ctrl._forward_value= {};

      ctrl.Departments = [];
      ctrl._notyetInit = true;
      ctrl.initValue = false;

      ctrl._searchByKeyToFilterData = "";
      ctrl._filterDAB = "";
      ctrl._filterDAT = "";
      ctrl._filterPriority = "";
      ctrl._filterReceiveMethod = "";

      ctrl._filterYear = null;
      ctrl.dateStart = null;
      ctrl.dateEnd = null;

      ctrl.checkbox_needhandle = true;
      ctrl.checkbox_handled = false;
      ctrl.checkbox_created = false;
      ctrl.checkbox_pending_receipt = false
      ctrl.show_checkbox_created = false;

      ctrl._numberUsed = [];

      ctrl.yearData = Array.from({ length: 2051 - 2000 }, (_, i) => 2000 + i);

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

      // Field
      ctrl.Field_Config = {
        master_key: "field",
        load_details_column: "value"
      };

      // Security level
      ctrl.securityLevel_Config = {
        master_key: "security_level",
        load_details_column: "value",
      };


      /** LOAD PRIORITY OPTIONS */
      ctrl.TaskPriority = {
        master_key: "task_priority",
        load_details_column: "value",
      };
      ctrl.TaskType = {
        master_key: "task_type",
        load_details_column: "value",
      };

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl._urlInsertModal = FrontendDomain + "/modules/office/dispatch_arrived/views/insert_modal.html";
      ctrl._urlDeleteModal = FrontendDomain + "/modules/office/dispatch_arrived/views/delete_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_update.html";
      ctrl._urlMultiDeleteModal = FrontendDomain + "/modules/office/dispatch_arrived/views/multi_delete_modal.html";
      ctrl._urlDeleteTaskModal = FrontendDomain + "/modules/office/dispatch_arrived/views/delete_task_modal.html";
      ctrl._urlForwardModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_forward.html";
      ctrl._urlReceiveModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/dispatch_arrived_receive.html";
      ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
    }

    const DISPATCH_SCOPE = {
      INTERNAL: "internal",
      EXTERNAL: "external"
    }

    const CHECKS_ON_UI = {
      CREATED: "created",
      NEED_HANDLE: "need_handle",
      HANDLED: "handled",
      PENDING_RECEIPT: "pending_receipt"
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
    };

    /**function for logic */
    ctrl._hintNoteSet = [
      'I agree',
      'I approve',
      'Processed'
    ];

    ctrl.function_apply_suggestions = ['da'];
    ctrl.set_hint_note = function(note) {
        ctrl._forward_value.note = $filter('l')(note);
    };

    ctrl.chooseNumberItem = function (val) {
      ctrl.numOfItemPerPage = val;
      ctrl.refreshData();
    };

    ctrl.chooseYear = function (val) {
      ctrl._filterYear = val;
      ctrl.refreshData();
    };

    ctrl.pickDAB = function (val) {
      ctrl._filterDAB = val.value;
      ctrl.refreshData();
    };

    ctrl.pickDAT = function (val) {
      ctrl._filterDAT = val.value;
      ctrl.refreshData();
    };

    ctrl.choosePriority = function (val) {
      ctrl._filterPriority = val.value;
      ctrl.refreshData();
    };

    ctrl.chooseReceiveMethod = function (val) {
      ctrl._filterReceiveMethod = val.value;
      ctrl.refreshData();
    };

    ctrl.switchTab = function (val) {
      ctrl.scope = val;
      ctrl.checkbox_pending_receipt = ctrl.scope === DISPATCH_SCOPE.INTERNAL;
      ctrl.refreshData();
    };

    function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.checkAll = false;
    }

    function generateFilter() {
      const obj = { checks: [] };

      // Kiểm tra các checkbox và scope
      if (ctrl.checkbox_needhandle && ctrl.scope === DISPATCH_SCOPE.EXTERNAL) {
        obj.checks.push(CHECKS_ON_UI.NEED_HANDLE);
      }
      if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
        obj.checks.push(CHECKS_ON_UI.CREATED);
      }
      if (ctrl.checkbox_handled) {
        obj.checks.push(CHECKS_ON_UI.HANDLED);
      }
      if (ctrl.checkbox_pending_receipt && ctrl.scope === DISPATCH_SCOPE.INTERNAL) {
        obj.checks.push(CHECKS_ON_UI.PENDING_RECEIPT);
      }

      // Các điều kiện tìm kiếm và bộ lọc
      if (ctrl._searchByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }
      if (ctrl._filterDAB) {
        obj.da_code = angular.copy(ctrl._filterDAB);
      }
      if (ctrl._filterDAT) {
        obj.type = angular.copy(ctrl._filterDAT);
      }
      if (ctrl._filterPriority) {
        obj.priority = angular.copy(ctrl._filterPriority);
      }
      if (ctrl._filterReceiveMethod) {
        obj.receive_method = angular.copy(ctrl._filterReceiveMethod);
      }
      if (ctrl._filterYear) {
        obj.year = angular.copy(ctrl._filterYear);
      }
      
      // Xử lý ngày
      if (ctrl.dateStart) {
        obj.dateStart =  (new Date(ctrl.dateStart)).setHours(0,0,0,0);
      }
      if (ctrl.dateEnd) {
        obj.dateEnd = (new Date(ctrl.dateEnd)).setHours(23, 59, 59, 999);
      }

      return obj;
    }

    ctrl.resetFilter = function () {
      ctrl._searchByKeyToFilterData = "";
      ctrl._filterDAB = "";
      ctrl._filterDAT = "";
      ctrl._filterPriority = "";
      ctrl._filterReceiveMethod = "";
      ctrl._filterYear = null;
      ctrl.dateStart = null;
      ctrl.dateEnd = null;
      ctrl.checkAll = false;
      ctrl.switchCheckAllItem(false);
      ctrl.load();
    }
  
    ctrl.checkItem = function (params) {
      ctrl.checkIdAr = [];
      ctrl.checkAr = [];
      ctrl.dispatch_arriveds.forEach(item => {
        if (item._id === params.params) {
          item.check = params.value;
        }
        if (item.check) {
          ctrl.checkIdAr.push(item._id);
          ctrl.checkAr.push(item);
        }
      });
      ctrl.checkAll = ctrl.checkIdAr.length === ctrl.dispatch_arriveds.length;
    };

    ctrl.switchCheckAllItem = function (params) {
      ctrl.checkIdAr = [];
      ctrl.checkAr = [];
      ctrl.dispatch_arriveds.forEach(item => {
        item.check = params;
        if (item.check) {
          ctrl.checkIdAr.push(item._id);
          ctrl.checkAr.push(item);
        }
      });
    };

    /* Init and load necessary resource to the module. */

    ctrl.loadPriority_details = function (params) {
      var dfd = $q.defer();
      for (var i in ctrl.Priority) {
        if (ctrl.Priority[i].key === params.id) {
          dfd.resolve(ctrl.Priority[i]);
          break;
        }
      }
      return dfd.promise;
    };

    ctrl.loadReceiveMethod_details = function (params) {
      var dfd = $q.defer();
      for (var i in ctrl.ReceiveMethod) {
        if (ctrl.ReceiveMethod[i].key === params.id) {
          dfd.resolve(ctrl.ReceiveMethod[i]);
          break;
        }
      }
      return dfd.promise;
    };

    // function checkRuleSeenWork(item) {
    //   if(!$filter('checkRuleCheckbox')(RULE_DISPATCH.FOLLOW)){
    //       return false;
    //   }
    //   // Kiểm tra nếu không có department_receiver hoặc mảng rỗng
    //   if (!item.department_receiver || item.department_receiver.length === 0) {
    //       return false;
    //   }
    //   // Tìm phòng ban đáp ứng điều kiện rule dispatch
    //   const unreviewedDepartment = item.department_receiver.find(department => {
    //       return department.department === $rootScope.logininfo.data.department && !department.seen;
    //   });
    //   // Trả về true nếu tìm thấy phòng ban chưa xem và thỏa mãn điều kiện rule
    //   return !!unreviewedDepartment;
    // }
    
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

    ctrl.forward_BGHOpinion = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forward_BGHOpinion", access_service("forward_BGHOpinion"));
    }

    ctrl.return_CVP = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "return_CVP", access_service("return_CVP"));
    }

    ctrl.forward_unit = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forward_unit", access_service("forward_unit"));
    }

    ctrl.forward_CVP = function () {
      return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "forward_CVP", access_service("forward_CVP"));
    }

    ctrl.transfer_department_approve = function (params) {
        ctrl._forward_value = params.approveParams;
        ctrl._forward_value.note = params.note;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "transfer_department_approve", access_service("transfer_department_approve"));
    }

    ctrl.seen_work = function (params) {
        ctrl._forward_value = params.approveParams;
        ctrl._forward_value.note = params.note;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "seen_work", access_service("seen_work"));
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

      if(item.task_label && Array.isArray(item.task_label)){
        data.task_label = item.task_label;
      }else{
        data.task_label = [];
      }

      return data;
  }

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

    ctrl.loadLabel = function ({ search, top, offset, sort }) {
      var dfd = $q.defer();
      da_details_service.load_label(search, top, offset, sort).then(
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
      da_details_service.loadLabel_details(ids).then(
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

    ctrl.chooseIncommingDate_forward = function (val) {
      ctrl._forward_value.incomming_date = val.getTime();
    };

    ctrl.chooseDateSign_forward = function (val) {
      ctrl._forward_value.date_sign = val.getTime();
    };

    ctrl.chooseExpried_forward = function (val) {
      ctrl._forward_value.expried = val.getTime();
    };

    ctrl.pickUrgencyLevel_forward = function(val){
      ctrl._forward_value.urgency_level = val.value;
    }
    
    ctrl.pickViewOnlyDepartment_forward = function (val) {
        ctrl._forward_value.department_receiver_ar = angular.copy(val);
    };
    ctrl.chooseSubmissionDepartment_forward = function (val) {
        ctrl._forward_value.department_execute = val.id;
    };

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
              case "forward_unit":
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
              ctrl.refreshData();
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
    ctrl.IncommingBook_Filter_External = [{ unit: { $eq : DISPATCH_SCOPE.EXTERNAL } }];
    ctrl.IncommingBook_Filter_Internal = [{ unit: { $eq : DISPATCH_SCOPE.INTERNAL } }, { deparment_used: { $in: [$rootScope.logininfo.data.department] } }];

    ctrl.prepareReceive = function (item) {
      $rootScope.$broadcast("pickModalDirectory:initLoad");
      ctrl._receive_value = angular.copy(item);
      ctrl._receive_value.note = "";
      ctrl._receive_value.department_receiver_ar = [];
      ctrl._receive_value.incoming_file_remove = [];
      ctrl._receive_value.attachments_remove = [];
      ctrl._receive_value.incoming_number_old = ctrl._receive_value.incoming_number * 1;
      load_details_incomming_dispatch(ctrl._receive_value.code).then(function(data){
        if(data.used_values){
            ctrl._numberUsed = data.used_values;
        }else{
            ctrl._numberUsed = [];
        }
      });
      if(ctrl._receive_value.department_receiver && ctrl._receive_value.department_receiver.length > 0){
        ctrl._receive_value.department_receiver_ar = ctrl._receive_value.department_receiver.map(item => item.department)
      }
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "receive");
    }
    
    function receive_service() {
      var dfd = $q.defer();
      const { _id, odb_id, note, code, incoming_number, field} = ctrl._receive_value;

      dispatch_arrived_service.receive(_id, odb_id, note, code, "" + incoming_number, field).then(
        function () {
          $("#modal_DA_Receive").modal("hide");
          ctrl._customToastScope.addToastValue({
            message: $filter('l')("DepartmentReceived"),
            type:"success"
          });
          dfd.resolve(true);
          ctrl.refreshData();
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
      if(val.used_values){
        ctrl._numberUsed = val.used_values;
      }else{
        ctrl._numberUsed = [];
      }
      ctrl._receive_value.incoming_number = Math.max(...[...ctrl._numberUsed, 0]) + 1;
      ctrl._receive_value.invalid_incoming_number = false;
    };

    ctrl.change_incoming_number_receive = function(){
      if(ctrl._numberUsed.filter(item => item !== ctrl._receive_value.incoming_number_old).includes(ctrl._receive_value.incoming_number * 1) || ctrl._receive_value.incoming_number * 1 === 0){
        ctrl._receive_value.invalid_incoming_number = true;
      }else{
        ctrl._receive_value.invalid_incoming_number = false;
      }
    }

    ctrl.pickField_receive = function(val){
      ctrl._receive_value.field = val.value;
    }
    // Receive -------------<<

    ctrl.prepareAssess = function ({ item, action }) {
      ctrl._forward_value = angular.copy(item);
      ctrl._forward_value.action = action;
      ctrl._forward_value.note = "";
      ctrl._forward_value.department_receiver_ar = [];
      ctrl._forward_value.incoming_file_remove = [];
      ctrl._forward_value.attachments_remove = [];
      ctrl._forward_value.incoming_number_old = ctrl._forward_value.incoming_number * 1;
      load_details_incomming_dispatch(ctrl._forward_value.code).then(function(data){
        if(data.used_values){
            ctrl._numberUsed = data.used_values;
        }else{
            ctrl._numberUsed = [];
        }
      });
      if(ctrl._forward_value.department_receiver && ctrl._forward_value.department_receiver.length > 0){
        ctrl._forward_value.department_receiver_ar = ctrl._forward_value.department_receiver.map(item => item.department)
      }
      ctrl._forward_value.show_note = true;
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

      if (ctrl.scope === DISPATCH_SCOPE.EXTERNAL) {
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
      else if (ctrl.scope === DISPATCH_SCOPE.INTERNAL) {
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

    function load_details_incomming_dispatch(value) {
      const dfd = $q.defer();

      da_details_service.load_detail_incomming_dispatchBook(value).then(function(res){
          dfd.resolve(res.data[0]);
      }, function(err){ dfd.reject(err); });

      return dfd.promise;
    }
    
    function load_service() {
      if (ctrl.dateStart && ctrl.dateEnd) {
        if (ctrl.dateEnd < ctrl.dateStart) {
            let temp = ctrl.dateStart;
            ctrl.dateStart = ctrl.dateEnd;
            ctrl.dateEnd = temp;
        }
      }

      var dfd = $q.defer();
      ctrl.dispatch_arriveds = [];
      ctrl.checkIdAr = [];
      ctrl.department_receiver_ar = [];
      let _filter = generateFilter();
      dispatch_arrived_service
        .load(
          _filter.search,
          _filter.da_code,
          _filter.priority,
          _filter.receive_method,
          _filter.type,
          _filter.checks,
          ctrl.scope,
          ctrl.numOfItemPerPage,
          ctrl.offset,
          ctrl.sort.query,
          _filter.dateStart,
          _filter.dateEnd,
          _filter.year,
        )
        .then(
          function (res) {
            ctrl.dispatch_arriveds = res.data;
            ctrl.dispatch_arriveds.forEach((item, index) => {
                if (item.content) {
                    item.content = removeHtmlTags(item.content);
                }
                ctrl.dispatch_arriveds[index] = { 
                    ...item, 
                    ...getPermissionProperties(item) 
                };

              });
              dfd.resolve(true);
            },
            function () {
              dfd.reject(false);
              err = undefined;
            }
          );
      return dfd.promise;
    }

    ctrl.handleTitleDA = function (item) {
      return `${item.typeDirectory[$rootScope.Language.current]} ${
        item.content
      }`;
    };

    function removeHtmlTags(str) {
      return str.replace(/<\/?[^>]+(>|$)/g, "");
    }

    ctrl.load = function (val) {
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "load",
        load_service
      );
    };

    function count_service() {
      var dfd = $q.defer();
      var _filter = generateFilter();
      dispatch_arrived_service
        .count(
          _filter.search,
          _filter.da_code,
          _filter.priority,
          _filter.receive_method,
          _filter.type,
          _filter.checks,
          ctrl.scope
        )
        .then(
          function (res) {
            ctrl.totalItems = res.data.count[0].count;
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

    ctrl.count = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "count",
        count_service
      );
    };

    function countPending_service() {
      var dfd = $q.defer();
      dispatch_arrived_service.countPending().then(
        function (res) {
          ctrl.numberPending = res.data.count;
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

    ctrl.countPending = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "countPending",
        countPending_service
      );
    };

    ctrl.refreshData = function () {
      resetPaginationInfo();

      let dfdAr = [ctrl.load(), ctrl.count()];
  
      if (ctrl.scope === DISPATCH_SCOPE.EXTERNAL) {
        dfdAr.push(ctrl.countPending());
      }
      
      $q.all(dfdAr);
    };

    function init() {
      if ($filter('hasRule')(RULE_DISPATCH.CREATE)) {
        ctrl.show_checkbox_created = true;
      }
      ctrl.scope = "external";
      const dfdAr = [ctrl.load(), ctrl.count(), ctrl.countPending()];
      $q.all(dfdAr).then(
        function () {
          ctrl._notyetInit = false;
          ctrl.show_tab_process = true;
          ctrl.show_tab_history_processing = true;
          ctrl.show_tab_related_document = true;
        },
        function (err) {
          console.log(err);
          err = undefined;
        }
      );
    }
    init();

    /**load File */

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) {}
        );
        return dfd.promise;
      };
    };

    /**insert */
    function getNumber(da_code) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.get_number(da_code).then(
          function (res) {
            ctrl._insert_value.incoming_number = res.data.number;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
          },
          function (err) {
            console.error('API Error:', err);
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      };
    }

    ctrl.removeArrivedFile_insert = function (item) {
      ctrl._insert_value.files = ctrl._insert_value.files.filter(file => file.name !== item.name);
    };

    ctrl.removeFileAttachment_insert = function (item) {
      ctrl._insert_value.attachment_files = ctrl._insert_value.attachment_files.filter(file => file.name !== item.name);
    };

    ctrl.removeFile_update = function (item) {
      if (item.id) {
        ctrl._update_value.incoming_file_remove.push(item.id);
      }
      ctrl._update_value.incoming_file = ctrl._update_value.incoming_file.filter(file => file.name !== item.name);
    };

    ctrl.removeFileAttachment_update = function (item) {
      if (item.id) {
        ctrl._update_value.attachments_remove.push(item.id);
      }
      ctrl._update_value.attachments = ctrl._update_value.attachments.filter(file => file.name !== item.name);
    };
    ctrl.removeFileAttachment_forward = function (item) {
      if (item.id) {
        ctrl._forward_value.attachments_remove.push(item.id);
      }
      ctrl._forward_value.attachments = ctrl._forward_value.attachments.filter(file => file.name !== item.name);
    };

    ctrl.pickDAB_insert = function (val) {
      ctrl._insert_value.code = val.value;
      if(val.used_values){
        ctrl._numberUsed = val.used_values;
      }else{
        ctrl._numberUsed = [];
      }
      ctrl._insert_value.incoming_number = Math.max(...[...ctrl._numberUsed, 0]) + 1;
      ctrl._insert_value.invalid_incoming_number = false;
    };

    ctrl.change_incoming_number_insert = function(){
      if(ctrl._numberUsed.includes(ctrl._insert_value.incoming_number * 1) || ctrl._insert_value.incoming_number * 1 === 0){
        ctrl._insert_value.invalid_incoming_number = true;
      }else{
        ctrl._insert_value.invalid_incoming_number = false;
      }
    }

    ctrl.change_incoming_number_update = function(){
      if(ctrl._numberUsed.filter(item => item !== ctrl._update_value.incoming_number_old).includes(ctrl._update_value.incoming_number * 1) || ctrl._update_value.incoming_number * 1 === 0){
        ctrl._update_value.invalid_incoming_number = true;
      }else{
        ctrl._update_value.invalid_incoming_number = false;
      }
    }

    ctrl.change_incoming_number_forward = function(){
      if(ctrl._numberUsed.filter(item => item !== ctrl._forward_value.incoming_number_old).includes(ctrl._forward_value.incoming_number * 1) || ctrl._forward_value.incoming_number * 1 === 0){
        ctrl._forward_value.invalid_incoming_number = true;
      }else{
        ctrl._forward_value.invalid_incoming_number = false;
      }
    }

    
    ctrl.pickField_insert = function(val){
      ctrl._insert_value.field = val.value;
    }
    
    ctrl.pick_insert_security_level = function(val){
      ctrl._insert_value.securityLevel = val.value;
    }
    
    ctrl.choosePriority_insert = function (val) {
      ctrl._insert_value.priority = val.value;
    };
    
    ctrl.chooseReceiveMethod_insert = function (val) {
      ctrl._insert_value.receive_method = val.value;
    };
    
    ctrl.chooseTransferDate_insert = function (val) {
      ctrl._insert_value.incomming_date = val.getTime();
    };
    
    ctrl.chooseSigningDate_insert = function (val) {
      ctrl._insert_value.signing_date = val.getTime();
    };

    ctrl.chooseExpried_insert = function (val) {
      ctrl._insert_value.expried = val.getTime();
    };
    
    ctrl.chooseDuration_insert = function (val) {
      ctrl._insert_value.date_sign = val.getTime();
    };
    
    ctrl.chooseIncommingDate_insert = function (val) {
      ctrl._insert_value.incomming_date = val.getTime();
    };
    
    ctrl.pickViewOnlyDepartment_insert = function (val) {
      ctrl._insert_value.view_only_departments = angular.copy(val);
    };
    

    ctrl.pickViewOnlyDepartment_update = function (val) {
      ctrl._update_value.department_receiver_ar = angular.copy(val);
    };

    ctrl.chooseReleaseDate_insert = function (params) {
      ctrl._insert_value.release_date = params;
    };


    ctrl.chooseReleaseDate_forward = function (params) {
      ctrl._forward_value.release_date = params;
    };
    ctrl.pickDAT_forward = function (val) {
      ctrl._forward_value.type = val.value;
    };
    ctrl.pickField_forward = function(val){
      ctrl._forward_value.field = val.value;
    }
    ctrl.pick_forward_security_level = function(val){
      ctrl._forward_value.securityLevel = val.value;
    }
    ctrl.choosePriority_forward = function (val) {
      ctrl._forward_value.priority = val.value;
    };
    ctrl.pickViewOnlyDepartment_forward = function (val) {
      ctrl._forward_value.department_receiver_ar = angular.copy(val);
    };
    
    // ctrl.chooseExpirationDate_insert = function (val) {
    //   if (val) {
    //     ctrl._insert_value.expiration_date = val.getTime();
    //   } else {
    //     ctrl._insert_value.expiration_date = undefined;
    //   }
    // };

    ctrl.chooseBriefcase_startDate_insert = function (val) {
      if (val) {
        ctrl._insert_value.briefcase.start_date = val.getTime();
      } else {
        ctrl._insert_value.briefcase.start_date = undefined;
      }
    };

    ctrl.chooseBriefcase_endDate_insert = function (val) {
      if (val) {
        ctrl._insert_value.briefcase.end_date = val.getTime();
      } else {
        ctrl._insert_value.briefcase.end_date = undefined;
      }
    };

    ctrl.chooseFromDate_insert = function (val) {
      ctrl._insert_task_value.from_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseToDate_insert = function (val) {
      ctrl._insert_task_value.to_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseDepartment_insert = function (val) {
      ctrl._insert_task_value.currentDepartment_orig = val;
      ctrl._insert_task_value.currentDepartment = val.id;
    };

    ctrl.chooseSubmissionDepartment = function (val) {
      ctrl._insert_value.department_execute = val.id;
    };
    ctrl.chooseSubmissionDepartment_forward = function (val) {
      ctrl._forward_value.department_execute = val.id;
    }
    ctrl.chooseSubmissionDepartment_update = function (val) {
      ctrl._update_value.department_execute = val.id;
    };
  
    ctrl.chooseTaskPriority = function (val) {
      const priority = dispatch_arrived_service.taskPriorityTransform(
        val.value
      );
      ctrl._insert_task_value.priority = priority.key;
      ctrl._insert_task_value._filterTaskPriority = priority.value;
    };

    ctrl.chooseTaskType = function (val) {
      const taskType = task_service.taskTypeTransform(val.value);
      ctrl._insert_task_value.task_type = taskType.key;
      ctrl._insert_task_value._filterTaskType = taskType.value;
    };
    ctrl.pickLabel_update = function (value) {
      ctrl._insert_task_value.label = value;
    };
    ctrl.pickDAT_insert = function(val){
      ctrl._insert_value.type = val.value;
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

    ctrl.addCheckList_insert = function () {
      var d = new Date();
      ctrl._insert_task_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._insert_task_value.focusChecklist = d.getTime().toString();
    };
    ctrl.removeCheckList_insert = function (id) {
      ctrl._insert_task_value.task_list =
        ctrl._insert_task_value.task_list.filter((e) => e.id !== id);
    };
    ctrl.removeCheckList_forward = function (id) {
      ctrl._insert_task_value.task_list =
        ctrl._insert_task_value.task_list.filter((e) => e.id !== id);
    };
    ctrl.removeFile_insert = function (item) {
      ctrl._insert_task_value.files = ctrl._insert_task_value.files.filter(
        (e) => e.name !== item.name
      );
    };

    ctrl.prepareInsert = function () {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "insert");
      var today = new Date();
      var yearOnly = today.getFullYear();
      var myToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      var endDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      $("#" + idEditor).summernote({
        placeholder: $filter("l")("InputContentHere"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor).summernote("insertNode", thisImage[0]);
              },
              function (err) {}
            );
          },
        },
      });


      ctrl._insert_value = {
        release_date: yearOnly,
        code: "",
        incoming_number: 1,
        incomming_date: myToday.getTime(),
        symbol_number: "",
        sending_place: "",
        type: "",
        field: "",
        securityLevel: "",
        priority: "",
        signing_date: myToday.getTime(),
        content: "",
        date_sign: myToday.getTime(), // Thời hạn
        view_only_departments: [],
        department_execute: "",
        is_legal: false,
        is_assign_task: false,
        invalid_incoming_number: false,
        attachment_files: [],
        files: [],
      };

      ctrl._numberUsed = [];

      ctrl._insert_task_value = {
        files: [],
        task_list: [],
        main_person: [],
        participant: [],
        observer: [],
        parent: [],
        label: [],
        code: "",
        incoming_number: 1,
        to_date: myToday.getTime(),
        sending_place: "",
        department_execute: "",
        to_date: endDay.getTime(),
        note: "",
        type: "",
        priority: "",
        is_legal: false,
        is_assign_task: false,
        content: "",
        level: "task",
        _filterTaskPriority: "",
      };
      $rootScope.$broadcast("pickModalDirectory:initLoad");
    };

    // $scope.$watch(function() {
    //     if (ctrl._insert_value.is_assign_task){
    //         $("#" + idEditor).summernote({
    //             placeholder: $filter("l")("InputContentHere"),
    //             callbacks: {
    //                 onImageUpload: function (image) {
    //                     var formData = new FormData();
    //                     formData.append('type', "image");
    //                     formData.append('file', image[0], image[0].name);
    //                     task_service.uploadImage(formData).then(function (res) {
    //                         var thisImage = $('<img>').attr('src', res.data.data);
    //                         $("#" + idEditor).summernote('insertNode', thisImage[0]);
    //                     }, function (err) {

    //                     })
    //                 }
    //             }
    //         });
    //         var taskTitle = "";
    //         if ($rootScope.Language.current === 'vi-VN') {
    //             taskTitle = 'Xử lý Công văn đến ' + ctrl._insert_value.code ;
    //         } else {
    //             taskTitle: 'Incoming Document Processing ' + ctrl._insert_value.code
    //         }
    //     }

    //   });
    $scope.$watch(
      function () {
        $("#" + idEditor).summernote({
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
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {
                    })
                }
            }
        });
        return ctrl._insert_value.is_assign_task;
      },
      function () {
        var today = new Date();
        var myToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        );
        var endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        );
        let taskTitle =
          $rootScope.Language.current === "vi-VN"
            ? "Xử lý Công văn đến " + ctrl._insert_value.incoming_number
            : "Incoming Document Processing " + ctrl._insert_value.incoming_number;
        ctrl._insert_task_value = {
          files: [],
          title: taskTitle,
          task_list: [],
          main_person: [],
          participant: [],
          observer: [],
          parent: [],
          label: [],
          da_code: "",
          incoming_number: 1,
          to_date: myToday.getTime(),
          sending_place: "",
          department_execute: "",
          to_date: endDay.getTime(),
          note: "",
          type: 1,
          priority: "Medium",
          is_legal: false,
          is_assign_task: false,
          content: "",
          level: "task",
          _filterTaskPriority: "Medium",
        };
      }
    );

    ctrl.prepareUpdateTask = function (index) {
      ctrl._task_update_value = {
        ...ctrl._insert_tasks[index],
        index,
      };
    };

    ctrl.prepareDeleteTask = function (index) {
      ctrl._task_delete_value = {
        ...ctrl._insert_tasks[index],
        index,
      };
    };

    ctrl.deleteTask = function () {
      const index = ctrl._task_delete_value.index;
      ctrl._insert_tasks.splice(index, 1);
      $("#modal_DA_Task_Delete").modal("hide");
    };

    function insert_service() {
      var dfd = $q.defer();  
      dispatch_arrived_service
        .insert(
          'external', // update -> lấy giá trị từ tab
          ctrl._insert_value.release_date,
          ctrl._insert_value.code,
          ctrl._insert_value.incoming_number,
          ctrl._insert_value.incomming_date,
          ctrl._insert_value.symbol_number,
          ctrl._insert_value.sending_place,
          ctrl._insert_value.type,
          ctrl._insert_value.field,
          ctrl._insert_value.securityLevel,
          ctrl._insert_value.priority,
          // ctrl._insert_value.signing_date,
          ctrl._insert_value.content,
          ctrl._insert_value.date_sign,
          ctrl._insert_value.expried,
          ctrl._insert_value.department_execute,
          ctrl._insert_value.view_only_departments,
          ctrl._insert_value.files,
          ctrl._insert_value.attachment_files,
          ctrl._insert_value.is_legal,
          ctrl._insert_value.is_assign_task,
          ctrl._insert_value.task_label,
        )
        .then(function (res) {
          daId = res.data._id;
          if (ctrl._insert_value.is_assign_task) {
            return $q.all(
              ctrl._insert_tasks.map((task) =>
                task_service.insert(
                  task.files,
                  task.title,
                  task.note,
                  task.task_list,
                  task.main_person,
                  task.participant,
                  task.observer,
                  task.from_date,
                  task.to_date,
                  task.has_time,
                  task.hours,
                  task.priority,
                  task.task_type,
                  task.head_task_id,
                  null,
                  task.currentProject,
                  task.currentDepartment,
                  daId,
                  task.level,
                  task.label,
                  true,
                  [],
                  {
                    object: "dispatch_arrived",
                    da_code: res.data.code,
                    id: res.data._id,
                  },
                  1
                )
              )
            );
          }
        })
        .then(
          function () {
            $("#modal_DA_Insert").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
            window.location.href = "/da-details?" + daId;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.insert = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "insert",
        insert_service
      );
    };

    /**multi delete */
    ctrl.prepareMultiDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "multi_delete");
      ctrl._list_delete_id = angular.copy(value);
      ctrl._list_delete_value = angular.copy(ctrl.checkAr);
    };

    function multi_delete_service() {
      var dfd = $q.defer();
      
      var dfdAr = ctrl._list_delete_id.map(function(id) {
        return dispatch_arrived_service.delete(id);
      });

      $q.all(dfdAr).then(
        function () {
            $("#modal_DA_Delete_Multi").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        },
        function (err) {
            dfd.reject(err);
            err = undefined;
        }
      );
    
      return dfd.promise;
    }

    ctrl.multiDelete = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "multi_delete",
        multi_delete_service
      );
    };

    /**delete */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      dispatch_arrived_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_DA_Delete").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
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
        "DA",
        "delete",
        delete_service
      );
    };

    //*Update*//

    ctrl.chooseExpirationDate_update = function (val) {
      if (val) {
        ctrl._update_value.expiration_date = val.getTime();
      } else {
        ctrl._update_value.expiration_date = undefined;
      }
    };
    function getNumber_update(da_code) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.get_number(da_code).then(
          function (res) {
            ctrl._update_value.incoming_number = res.data.number;
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
      if(val.used_values){
        ctrl._numberUsed = val.used_values;
      }else{
        ctrl._numberUsed = [];
      }
      ctrl._update_value.incoming_number = Math.max(...[...ctrl._numberUsed, 0]) + 1;
      ctrl._update_value.invalid_incoming_number = false;
    };

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

    ctrl.prepareUpdate = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "update");
      ctrl._update_value = angular.copy(value);
      ctrl._update_value.incoming_file_remove = [];
      ctrl._update_value.attachments_remove = [];
      ctrl._update_value.department_receiver_ar = [];
      ctrl._update_value.incoming_number_old = ctrl._update_value.incoming_number * 1;
      
      if (ctrl._update_value.department_receiver && ctrl._update_value.department_receiver.length > 0) {
        ctrl._update_value.department_receiver_ar = ctrl._update_value.department_receiver.map(subItem => subItem.department || null);
      } else {
        ctrl._update_value.department_receiver_ar = [];
      }

      load_details_incomming_dispatch(ctrl._update_value.code).then(function(data){
        if(data.used_values){
            ctrl._numberUsed = data.used_values;
        }else{
            ctrl._numberUsed = [];
        }
      });

    };
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
      if(item.task_label && Array.isArray(item.task_label)){
        data.task_label = item.task_label;
      }else{
        data.task_label = [];
      }

      return data;
    }

    function update_service() {
        var dfd = $q.defer();
        let data = genDataUpdate(ctrl._update_value);
        let messageSuccess ='Update successfully';

        dispatch_arrived_service.update(data)
        .then(
            function () {
                ctrl._customToastScope.addToastValue({
                    message: $filter('l')(messageSuccess),
                    type: "success",
                });
                $("#modal_DA_Dir_Update").modal("hide");
                dfd.resolve(true);
                ctrl.refreshData();
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
            'DA',
            'update',
            update_service
        );
    };


    ctrl.prepareForward = function (value) {
      ctrl._forward_value = angular.copy(value);
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "forward");
    };

    function forward_service() {
      var dfd = $q.defer();
      dispatch_arrived_service
        .forward(
          ctrl._forward_value._id,
          ctrl._forward_value.incoming_number,
          ctrl._forward_value.da_code,
          ctrl._forward_value.expiration_date
        )
        .then(
          function () {
            $("#modal_DA_Forward").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.forward = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "update",
        forward_service
      );
    };


    ctrl.export_dispatch_arrived = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "export_dispatch_arrived",
        export_dispatch_arrived_service
      );
    };

    //EXPORT DISPATCH ARRIVED
    ctrl.exportDAReport = function () {
      const table = document.getElementById("daReport");

      // Determine the active tab's name
      let activeTabName = "";
      switch (ctrl.tab) {
        case "created":
          activeTabName = "Created";
          break;
        case "need_to_handle":
          activeTabName = "NeedToHandle";
          break;
        case "forwarded":
          activeTabName = "Forwarded";
          break;
        case "all":
          activeTabName = "All";
          break;
        default:
          activeTabName = "";
      }

      // Clone the table to avoid modifying the original
      const clonedTable = table.cloneNode(true);

      // Remove unwanted text or elements from header cells
      const headers = clonedTable.querySelectorAll("th");
      headers.forEach((header) => {
        // Find and remove .order elements within the header
        const orderElements = header.querySelectorAll("order");
        orderElements.forEach((orderElement) => {
          orderElement.remove();
        });

        // Also remove the unwanted text ".order-active { opacity: 1!important; }" if present
        header.innerHTML = header.innerHTML.replace(
          /\.order-active \{ opacity: 1!important; \}/g,
          ""
        );
      });

      // Convert the cleaned table to a workbook and export it
      const workbook = XLSX.utils.table_to_book(clonedTable);
      XLSX.writeFile(workbook, `${activeTabName}DispatchArrivedReport.xlsx`);
    };
    

}]);

myApp.registerCtrl('dispatch_outgoing_controller', ['dispatch_outgoing_service', '$q', '$rootScope', '$filter', function (dispatch_outgoing_service, $q, $rootScope, $filter) {

  /**declare variable */
  const _statusValueSet = [
      { name: "OD", action: "init" },
      { name: "OD", action: "load" },
      { name: "OD", action: "count" },
      { name: "OD", action: "countPending" },
      { name: "OD", action: "getNumber" },
      { name: "OD", action: "insert" },
      { name: "OD", action: "delete" },
      { name: "OD", action: "multi_delete" },
      { name: "OD", action: "update" },
      { name: "OD", action: "archive" },
  ];
  var ctrl = this;
  var idEditor = "insertOD_excerpt";    
  const Expiration_Date_Error_Msg = $filter('l')('ExpirationDateErrorMsg');
  /** init variable */
  {
      ctrl._ctrlName = "dispatch_outgoing_controller";
      ctrl.tab = "dispatchAway";
      ctrl.numberPending = 0;
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
      ctrl.dispatch_outgoings = [];

      ctrl.Departments =[];
      ctrl._notyetInit = true;
      ctrl.tagList = [];

      ctrl._searchByKeyToFilterData = "";
      ctrl._filterODB= "";
      ctrl._filterODT = "";
      ctrl._filterPriority ="";
      ctrl._filterReceiveMethod = "";
      ctrl._filterODB_insert = "";
      ctrl._filterYear = null;

      ctrl.yearData = Array.from({ length: 2051 - 2000 }, (_, i) => 2000 + i);
      ctrl.could_release = false;

      ctrl._update_value = {};
      ctrl._archive_value = {};
      
      ctrl.OutgoingDispatchBook_Config = {
          master_key: "outgoing_dispatch_book",
          load_details_column: "value"
      };

      ctrl.IncommingDispatchBook_Config = {
          master_key: "incomming_dispatch_book",
          load_details_column: "value"
      };

      ctrl.IncommingDispatchPririoty_Config = {
          master_key: "incomming_dispatch_priority",
          load_details_column: "value"
      };

      ctrl.MethodOfSendingDispatchTo_Config = {
          master_key: "method_of_sending_dispatch_to",
          load_details_column: "value"
      };

      ctrl.DocumentType_Config = {
          master_key: "document_type",
          load_details_column: "value"
      };

       // Security level
       ctrl.securityLevel_Config = {
        master_key: "security_level",
        load_details_column: "value",
      };
      ctrl.function_apply_suggestions = ['odb'];

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


      ctrl._urlInsertModal = FrontendDomain + "/modules/office/dispatch_arrived/views/insert_modal_outgoing.html";
      ctrl._urlDeleteModal = FrontendDomain + "/modules/office/outgoing_dispatch/views/delete_modal.html";
      ctrl._urlMultiDeleteModal = FrontendDomain + "/modules/office/outgoing_dispatch/views/multi_delete_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/outgoing_dispatch_update.html";
      ctrl._urlArchiveModal = FrontendDomain + "/modules/office/dispatch_arrived/directives/outgoing_dispatch_archive.html";
  }

  const RULE_DISPATCH = {
    USE:"Office.DispatchOutgoing.Use",
    MANAGER:"OfficeDG.Manager",
    RELEASE:"Office.DispatchOutgoing.Release",
    VIEW_ODB:"Office.DispatchOutgoing.ViewODB",
    EDIT_ODB:"Office.DispatchOutgoing.EditODB"
  }

  /**function for logic */
  ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
      let today = new Date();
      let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (isInsert) {
          return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
      } else {
          return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
      }
  }

  ctrl.chooseNumberItem = function (val) {
      ctrl.numOfItemPerPage = val;
      ctrl.refreshData();
  }

  ctrl.chooseYear = function (val) {
    ctrl._filterYear = val;
    ctrl.refreshData();
  };
  
  ctrl.pickODB = function(val){
      ctrl._filterODB = val.value;
      ctrl.refreshData();
  }

  ctrl.pickODT = function(val){
      ctrl._filterODT = val.value;
      ctrl.refreshData();
  }

  ctrl.pickODB_insert = function (val){
      ctrl._insert_value.do_code = val.value;     
  }

  ctrl.pickDAT_insert = function(val){
      ctrl._insert_value.type = val.value;
  }

  ctrl.pickField_insert = function(val){
    ctrl._insert_value.field = val.value;
  }

  ctrl.choosePriority_insert = function(val){
      ctrl._insert_value.priority = val.value;
  }

  ctrl.chooseDocumentDate_insert = function (val) {
      ctrl._insert_value.document_date = val.getTime();
  }

  ctrl.chooseTransferDate_insert = function (val) {
      ctrl._insert_value.incomming_date = val.getTime();
  }

  ctrl.chooseExpirationDate_insert = function (val) {
      ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
      ctrl._insert_value.expiration_date = val ? val.getTime() : null;
  }

  ctrl.chooseReleaseDate_insert = function (params) {
    ctrl._insert_value.release_date = params;
  };

  ctrl.chooseSubmissionDepartment = function (val) {
    ctrl._insert_value.submission_department = val.id;
  };

  ctrl.chooseDuration_insert = function (val) {
    // Initialize _insert_value if it doesn't exist
    if (!ctrl._insert_value) {
        ctrl._insert_value = {};
    }
    ctrl._insert_value.date_sign = val.getTime();
};

  ctrl.pick_insert_security_level = function(val){
    ctrl._insert_value.securityLevel = val.value;
  }

  ctrl.pickViewOnlyDepartment_insert = function (val) {
    ctrl._insert_value.view_only_departments = angular.copy(val);
  };

  ctrl.choosePriority = function(val){
      ctrl._filterPriority = val.value;
      ctrl.refreshData();
  }

  ctrl.chooseReceiveMethod = function(val){
      ctrl._filterReceiveMethod = val.value;
      ctrl.refreshData();
  }

  ctrl.switchTab = function (val) {
      ctrl.tab = val;
      ctrl.refreshData();
  }

  ctrl.pickUserAndDepartment_insert = function (val) {
      ctrl._insert_value.userAndDepartment = val;
  }

  ctrl._choose_person_sign = function(param){
    ctrl._insert_value.person_sign = param;
  }

  ctrl.onTagAdded = function (tag) {
    console.log("Tag added:", tag);
  };

  ctrl.onTagRemoved = function (tag) {
      console.log("Tag removed:", tag);
  };

  ctrl.removeOutgoingDocuments_insert = function (item) {
      var temp = [];
      for (var i in ctrl._insert_value.outgoing_file) {
          if (ctrl._insert_value.outgoing_file[i].name != item.name) {
              temp.push(ctrl._insert_value.outgoing_file[i]);
          }
      }
      ctrl._insert_value.outgoing_file = angular.copy(temp);
  }

  ctrl.removeAttachDocuments_insert = function (item) {
      var temp = [];
      for (var i in ctrl._insert_value.attachments) {
          if (ctrl._insert_value.attachments[i].name != item.name) {
              temp.push(ctrl._insert_value.attachments[i]);
          }
      }
      ctrl._insert_value.attachments = angular.copy(temp);
  }

  function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.checkAll = false;
  }

  function generateFilter() {
      var obj = {};
      obj.checks = [];
      
      if (ctrl._searchByKeyToFilterData !== "") {
          obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }

      if (ctrl._filterODB) {
          obj.do_code = angular.copy(ctrl._filterODB);
      }

      if (ctrl._filterODT) {
          obj.type = angular.copy(ctrl._filterODT);
      }

      if (ctrl._filterPriority) {
          obj.priority = angular.copy(ctrl._filterPriority);
      }

      if (ctrl._filterReceiveMethod) {
          obj.receive_method = angular.copy(ctrl._filterReceiveMethod);
      }

      if (ctrl._filterYear) {
        obj.year = angular.copy(ctrl._filterYear);
      }

      if (ctrl.dateStart) {
        obj.dateStart =  (new Date(ctrl.dateStart)).setHours(0,0,0,0);
      }
      if (ctrl.dateEnd) {
        obj.dateEnd = (new Date(ctrl.dateEnd)).setHours(23, 59, 59, 999);
      }

      return obj;
  }

  ctrl.resetFilter = function () {
    ctrl._searchByKeyToFilterData = "";
    ctrl._filterODB = "";
    ctrl._filterODT = "";
    ctrl._filterPriority = "";
    ctrl._filterReceiveMethod = "";
    ctrl._filterYear = null;
    ctrl.dateStart = null;
    ctrl.dateEnd = null;
    ctrl.checkAll = false;
    ctrl.switchCheckAllItem(false);
    ctrl.load();
  }

  ctrl.checkItem = function (params) {
    ctrl.checkIdAr = [];
    ctrl.checkAr=[];
    ctrl.dispatch_outgoings.forEach(item => {
      if (item._id === params.params) {
        item.check = params.value;
      }
      if (item.check) {
        ctrl.checkIdAr.push(item._id);
        ctrl.checkAr.push(item);
      }
    });
    ctrl.checkAll = ctrl.checkIdAr.length === ctrl.dispatch_outgoings.length;
  }

  ctrl.switchCheckAllItem = function (params) {
    ctrl.checkIdAr = [];
    ctrl.checkAr=[];
    ctrl.dispatch_outgoings.forEach(item => {
      item.check = params;
      if (item.check) {
        ctrl.checkIdAr.push(item._id);
        ctrl.checkAr.push(item);
      }
    });
  }
  ctrl.loadPriority_details = function(params){
      var dfd = $q.defer();
      for(var i in ctrl.Priority){
          if(ctrl.Priority[i].key === params.id){
              dfd.resolve(ctrl.Priority[i]);
              break;
          }
      }
      return dfd.promise;
  }

  ctrl.loadReceiveMethod_details = function(params){
      var dfd = $q.defer();
      for(var i in ctrl.ReceiveMethod){
          if(ctrl.ReceiveMethod[i].key === params.id){
              dfd.resolve(ctrl.ReceiveMethod[i]);
              break;
          }
      }
      return dfd.promise;
  }

  function load_service() {
    if (ctrl.dateStart && ctrl.dateEnd) {
      if (ctrl.dateEnd < ctrl.dateStart) {
          let temp = ctrl.dateStart;
          ctrl.dateStart = ctrl.dateEnd;
          ctrl.dateEnd = temp;
      }
    }

    var dfd = $q.defer();
    ctrl.dispatch_outgoings = [];
    ctrl.checkIdAr = [];
    let _filter = generateFilter();
    dispatch_outgoing_service
      .load(
        _filter.search,
        _filter.od_book, 
        _filter.priority,
        _filter.receive_method,
        _filter.type,
        _filter.checks,
        ctrl.tab , 
        ctrl.numOfItemPerPage, 
        ctrl.offset, 
        ctrl.sort.query,
        _filter.dateStart,
        _filter.dateEnd,
        _filter.year
      )
      .then(
        function (res) {
          ctrl.dispatch_outgoings = res.data;
          dfd.resolve(true);
        }, 
        function () {
          dfd.reject(false);
          err = undefined;
        }
      );
    return dfd.promise;
  }

  ctrl.load = function (val) {
      if (val != undefined) { ctrl.offset = angular.copy(val); }
      return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "load", load_service);
  }

  function count_service() {
    var dfd = $q.defer();
    var _filter = generateFilter();
    dispatch_outgoing_service
      .count(
        _filter.search, 
        _filter.od_book,
        _filter.priority,
        _filter.receive_method,
        _filter.type,
        _filter.checks,
        ctrl.tab
      )
      .then(
        function (res) {
          ctrl.totalItems = res.data.count;
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

  ctrl.count = function () {
      return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "count", count_service);
  }

  ctrl.refreshData = function () {
      var dfdAr = [];
      resetPaginationInfo();
      dfdAr.push(ctrl.load());
      dfdAr.push(ctrl.count());
      $q.all(dfdAr);
  }

  function init() {
    if ($filter('hasRule')(RULE_DISPATCH.RELEASE)) {
      ctrl.could_release = true;
    }

    var dfdAr = [];
    dfdAr.push(ctrl.load());
    dfdAr.push(ctrl.count());
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

  /**load File */
  ctrl.loadfile = function (params) {
      return function () {
          var dfd = $q.defer();
          dispatch_outgoing_service.loadFileInfo(params.id, params.name).then(function (res) {
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

  // Insert
  ctrl.prepareInsert = function () {
      $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "insert");
      var today = new Date();
      var yearOnly = today.getFullYear();
      var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      ctrl._insert_value = {
          release_date: yearOnly,
          do_code: "",
          symbol_number: "",
          type: "Officialdocument",
          date_sign: myToday.getTime(),
          expried: myToday.getTime(),
          priority: "Normal",
          securityLevel: "",
          expiration_date: myToday.getTime(),
          excerpt: "",
          self_end: false,
          view_only_departments: [],
          outgoing_file: [],
          attachments: [],
          person_sign: {},
          content: "",
      };
      
      $rootScope.$broadcast("pickModalDirectory:initLoad");

  }

  ctrl.insert = function () {
      return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "insert", insert_OD_service);
  }

  function insert_OD_service() {
      var dfd = $q.defer();

      dispatch_outgoing_service.insert(
          ctrl._insert_value.release_date, // year
          ctrl._insert_value.do_code, // code
          ctrl._insert_value.symbol_number, // symbol_number
          ctrl._insert_value.type, // type
          ctrl._insert_value.date_sign, // date_sign
          ctrl._insert_value.submission_department, // departmemt_write
          ctrl._insert_value.person_sign, // person_sign
          ctrl._insert_value.excerpt, // content
          ctrl._insert_value.expiration_date, // expire_date
          ctrl._insert_value.securityLevel, // security_level
          ctrl._insert_value.priority, // urgency_level
          ctrl._insert_value.view_only_departments, // other_destination
          ctrl._insert_value.document_tag, // text_tags
          ctrl._insert_value.self_end, // auto end
          ctrl._insert_value.outgoing_file,
          ctrl._insert_value.attachments,
      ).then(function () {
          $("#modal_OD_Insert").modal("hide");
          ctrl.load();
          ctrl.switchTab('separateDispatch');
          dfd.resolve(true);
          dfd = undefined;
      }, function (err) {
          dfd.reject(err);
          err = undefined;
      });

      return dfd.promise;
  }

  /**multi delete */
  ctrl.prepareMultiDelete = function (value) {
    $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "multi_delete");
    ctrl._list_delete_id = angular.copy(value);
    ctrl._list_delete_value = angular.copy(ctrl.checkAr);
  };

  function multi_delete_service() {
    var dfd = $q.defer();
    
    var dfdAr = ctrl._list_delete_id.map(function(id) {
      return dispatch_outgoing_service.delete(id);
    });

    $q.all(dfdAr).then(
      function () {
          $("#modal_DO_Delete_Multi").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
          dfd = undefined;
      },
      function (err) {
          dfd.reject(err);
          err = undefined;
      }
    );
  
    return dfd.promise;
  }

  ctrl.multiDelete = function () {
    return $rootScope.statusValue.execute(
      ctrl._ctrlName,
      "OD",
      "multi_delete",
      multi_delete_service
    );
  };

  /**delete */
  ctrl.prepareDelete = function (value) {
    $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "delete");
    ctrl._delete_value = angular.copy(value);
  };

  function delete_service() {
    var dfd = $q.defer();
    dispatch_outgoing_service.delete(ctrl._delete_value._id).then(
      function () {
        $("#modal_DO_Delete").modal("hide");
        dfd.resolve(true);
        ctrl.refreshData();
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
      "OD",
      "delete",
      delete_service
    );
  };

  //*Update*//
  ctrl.prepareUpdate = function (value) {
    $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "update");
    ctrl._update_value = angular.copy(value);
    ctrl._update_value.outgoing_file_remove = [];
    ctrl._update_value.attachments_remove = [];
  };

  ctrl.update = function () {
    return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "update", update_OD_service);
  }

  function update_OD_service() {
    var dfd = $q.defer();

    dispatch_outgoing_service.update(
      ctrl._update_value._id,
        ctrl._update_value.year, // year
        ctrl._update_value.code, // code
        ctrl._update_value.symbol_number, // symbol_number
        ctrl._update_value.type, // type
        ctrl._update_value.date_sign, // date_sign
        ctrl._update_value.departmemt_write, // departmemt_write
        ctrl._update_value.person_sign, // person_sign
        ctrl._update_value.content, // content
        ctrl._update_value.expire_date, // expire_date
        ctrl._update_value.security_level, // security_level
        ctrl._update_value.urgency_level, // urgency_level
        ctrl._update_value.other_destination, // other_destination
        ctrl._update_value.text_tags, // text_tags
        ctrl._update_value.self_end, // auto end
        ctrl._update_value.outgoing_file,
        ctrl._update_value.attachments,
        ctrl._update_value.outgoing_file_remove,
        ctrl._update_value.attachments_remove
    ).then(function () {
        $("#modal_DO_Update").modal("hide");
        ctrl.load();
        ctrl.switchTab('separateDispatch');
        dfd.resolve(true);
        dfd = undefined;
    }, function (err) {
        dfd.reject(err);
        err = undefined;
    });

    return dfd.promise;
  }


  //*Archive*//
  ctrl.removeOutgoingDocuments_archive = function (item) {
    if (item.id) {
      ctrl._archive_value.outgoing_file_remove.push(item.id);
    }
    ctrl._archive_value.outgoing_file = ctrl._archive_value.outgoing_file.filter(file => file.name !== item.name);
  };

  ctrl.removeAttachDocuments_archive = function (item) {
    if (item.id) {
      ctrl._archive_value.attachments_remove.push(item.id);
    }
    ctrl._archive_value.attachments = ctrl._archive_value.attachments.filter(file => file.name !== item.name);
  }

  ctrl._hintNoteSet = [
    'I agree',
    'I approve',
    'Processed'
  ];
  ctrl.set_hint_note = function(note) {
      ctrl._archive_value.note = $filter('l')(note);
  };

  function genDataArchive(item){
    const data = {};
    data.id = item._id;
    data.year = item.year;
    data.code = item.code;
    data.symbol_number = item.symbol_number;
    data.type = item.type;
    data.date_sign = item.date_sign
    data.departmemt_write = item.departmemt_write;
    data.person_sign = item.person_sign;
    data.content = item.content;
    data.expire_date = item.expire_date;
    data.security_level = item.security_level;
    data.urgency_level = item.urgency_level;
    data.other_destination = item.other_destination;
    data.text_tags = item.text_tags;
    data.self_end = item.self_end;
    data.outgoing_file = item.outgoing_file;
    data.attachments = item.attachments;
    data.outgoing_file_remove = item.outgoing_file_remove;
    data.attachments_remove = item.attachments_remove;
    data.note = item.note;
    return data;
  }

  ctrl.prepareArchive = function (value) {
    $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "archive");
    
    ctrl._archive_value = angular.copy(value);
    ctrl._archive_value.note = value.note;
    ctrl._archive_value.outgoing_file_remove = [];
    ctrl._archive_value.attachments_remove = [];
  };

  ctrl.archive = function () {
    return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "update", archive_OD_service);
  }

  function archive_OD_service() {
    var dfd = $q.defer();
    data = genDataArchive(ctrl._archive_value)

    dispatch_outgoing_service.archive_dispatch_outgoing(data)
    .then(function () {
        $("#modal_DO_Archive").modal("hide");
        ctrl.load();
        ctrl.switchTab('separateDispatch');
        dfd.resolve(true);
        dfd = undefined;
    }, function (err) {
        dfd.reject(err);
        err = undefined;
    });

    return dfd.promise;
  }

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

}]);
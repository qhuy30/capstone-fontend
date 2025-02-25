myApp.registerCtrl("notify_controller", [
  "notify_service",
  "$q",
  "$rootScope",
  "$filter",
  "$location",
  'localStorage',
  '$scope',
    function (notify_service, $q, $rootScope, $filter, $location, $localStorage,$scope) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Notify", action: "load" },
      { name: "Notify", action: "count" },
      { name: "Notify", action: "insert" },
      { name: "Notify", action: "edit" },
      { name: "Notify", action: "approve_department" },
      { name: "Notify", action: "delete" },
      { name: "Notify", action: "recall" },
      { name: "Notify", action: "approve" },
      { name: "Notify", action: "reject" },
      { name: "Notify", action: "throw_to_recyclebin" },
      { name: "Notify", action: "restore_from_recyclebin" },
    ];
    var ctrl = this;
    /** init variable */
    {
      ctrl._ctrlName = "notify_controller";
      ctrl.tab = "created";
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.totalItems_created = 0;
      ctrl.totalItems_assigned = 0;
      ctrl.isShowNeedToHandleLevel_2 = false;
      ctrl.isShowNeedToHandleLevel_1 = false;

      
      ctrl.status = '';
      ctrl.offset = 0;
      ctrl.sort = {
        name: "_id",
        value: false,
        query: { _id: -1, priority: -1 },
      };
      ctrl.notifys = [];

      ctrl._notyetInit = true;

      ctrl._searchByKeyToFilterData = "";
      ctrl._filterGroup = "";

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl._urlApproveModal =
        FrontendDomain + "/modules/office/notify/views/approve_modal.html";
      ctrl._urlRejectModal =
        FrontendDomain + "/modules/office/notify/views/reject_modal.html";
      ctrl._urlDeleteModal =
        FrontendDomain + "/modules/office/notify/views/delete_modal.html";
      ctrl._urlRecallModal =
        FrontendDomain + "/modules/office/notify/views/recall_modal.html";
      ctrl._urlEditModal =
        FrontendDomain + "/modules/office/notify/views/notify_edit_modal.html";
      ctrl._urlThrow_to_recyclebinModal =
        FrontendDomain +
        "/modules/office/notify/views/throw_to_recyclebin_modal.html";
      ctrl._urlRestore_from_recyclebinModal =
        FrontendDomain +
        "/modules/office/notify/views/restore_from_recyclebin_modal.html";

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
      ctrl._hintNoteSet = [
        'I agree',
        'I refuse',
        'Incorrect information',
        'Out of cars',
        'Out of cards',
      ];
      ctrl.columns = {
        index:{
            title: 'STT',
            show: true
        },
        dateCreted:{
          title: $filter('l')('Created date'),
          show: true
        },
        title:{
            title: $filter('l')('Title'),
            show: true
        },
        scope:{
          title: $filter('l')('Scope'),
          show: true
        },
        type:{
            title: $filter('l')('Type'),
            show: true
        },
        createdBy:{
            title: $filter('l')('Creator'),
            show: true
        },
        status:{
            title: $filter('l')('Status'),
            show: true
        },
        Approver:{
            title: $filter('l')('Approver'),
            show: true
        },
        ApprovedDate:{
            title: $filter('l')('ApprovedDate'),
            show: true
        },
      }

      ctrl.columnsArray =  Object.keys(ctrl.columns).map(key => {
          return {
              key: key,
              title: ctrl.columns[key].title,
              show: ctrl.columns[key].show
          };
      })

      ctrl.sortNotify = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
      ctrl.show_checkbox_created = false;      
      ctrl.show_checkbox_handled = false;
      ctrl.show_checkbox_need_handle = false;
      ctrl.show_checkbox_reject = false;
      ctrl.show_checkbox_my_notify = false;
      ctrl.show_checkbox_internal = false;
      ctrl.show_checkbox_external = false;

      ctrl.show_checkbox_notseen = false;
      ctrl.show_checkbox_bokmart = false;

      ctrl.checkbox_created = false;      
      ctrl.checkbox_need_handle = false;
      ctrl.checkbox_handled = false;
      ctrl.checkbox_reject = false;
      ctrl.checkbox_my_notify = false;
      ctrl.checkbox_internal = false;
      ctrl.checkbox_external = false;

    }
    $scope.$on("notify:AccessDone", function () {
      ctrl.load();
    });

    ctrl.function_apply_suggestions = ['registration_notify'];

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
    ctrl.checkbox_needhandle = true;
    ctrl.checkbox_responsibility = false;
    ctrl.checkbox_created = false;
    ctrl.checkbox_handled = false;
    ctrl.checkbox_notseen = false;
    ctrl.checkbox_bookmark = false;
    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
      ctrl.numOfItemPerPage = val;
      ctrl.refreshData();
    };

    ctrl.on_pick_notify_group = function (param) {
      ctrl.form_value.group = param.value;
    };

    ctrl.switchTab = function (val) {
      ctrl.tab = val;
      ctrl.refreshData();
    };
    function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
    }

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
      let StatusFromEvent = ""

      if(status_to_show === "Pending"){
        StatusFromEvent = item.event.find(event => event.action === "Created");
        
      }
      else{
        StatusFromEvent = item.event.find(event => event.action === status_to_show);
      }
      let userNameAccess = StatusFromEvent.username;
      let TimeAccess = StatusFromEvent.time;

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
        allowApproveLeadExternal,
        userNameAccess,
        TimeAccess
      }
    }

    function generateFilter() {
      var obj = {};
      if (ctrl._searchByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }

      if (ctrl._filterGroup) {
        obj.group = angular.copy(ctrl._filterGroup);
      }

      obj.checks = [];

      if (ctrl.show_checkbox_created && ctrl.checkbox_created) {
        obj.checks.push("Created");
      }

      if (ctrl.checkbox_need_handle && ctrl.show_checkbox_need_handle) {
        obj.checks.push("NeedToHandle");
      }

      if (ctrl.checkbox_handled && ctrl.show_checkbox_handled) {
        obj.checks.push("Handled");
      }

      if (ctrl.checkbox_reject && ctrl.show_checkbox_reject) {
        obj.checks.push("Rejected");
      }

      if (ctrl.show_checkbox_my_notify && ctrl.checkbox_my_notify) {
        obj.checks.push("MyNotify");
      }

      if (ctrl.checkbox_internal && ctrl.show_checkbox_internal) {
        obj.checks.push("Internal");
      }

      if (ctrl.show_checkbox_external && ctrl.checkbox_external) {
        obj.checks.push("External");
      }

      return obj;
    }

    /* Init and load necessary resource to the module. */
    ctrl.loadEmployee = function (params) {
      var dfd = $q.defer();
      notify_service.loadEmployee(params.id).then(
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

    function load_service() {
      var dfd = $q.defer();
      ctrl.notifys = [];
      let _filter = generateFilter();
      notify_service
        .load(
          _filter.search,
          _filter.checks,
          ctrl.numOfItemPerPage,
          ctrl.offset,
          ctrl.sortNotify.query
        )
        .then(
          function (res) {
            ctrl.notifys = res.data;
            for (let i in ctrl.notifys) {
              ctrl.notifys[i] = { ...ctrl.notifys[i], ...getPermissionProperties(ctrl.notifys[i]) };
            }
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
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "load",
        load_service
      );
    };

    function count_service() {
      var dfd = $q.defer();
      var _filter = generateFilter();
      notify_service.count(_filter.search, _filter.checks).then(
        function (res) {
          ctrl.totalItems = res.data[0].count || 0;
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
        "Notify",
        "count",
        count_service
      );
    };

    ctrl.refreshData = function () {
      var dfdAr = [];
      resetPaginationInfo();
      dfdAr.push(ctrl.load());
      if(ctrl._edit_value){
        ctrl._edit_value.addedFiles = [];
        ctrl._edit_value.removedFiles = [];
      }
      dfdAr.push(ctrl.count());
      $q.all(dfdAr);
    };

    const getTextSearch = () => {
      let q = $location.search().q;
      if(q){ return q;}
      if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'notify') {
          let temp = $rootScope.detailsInfo.url.split("?")[1];
          $location.search('q', null);
          if(temp.indexOf("q")!==-1){
              q = temp.split("=")[1];
              $rootScope.detailsInfo.url = $rootScope.detailsInfo.url.split("?")[0];

              return q;
          }
      }
      return undefined;
    };
    
    ctrl.updateColumnVisibility = function(key, show) {
      ctrl.columns[key].show = show;
      saveShowColumn();
    };

    function saveShowColumn(){
      $localStorage.setItem(`${ctrl._ctrlName}_columns_show`, ctrl.columns)
    }
    
    function getShowColumn(){
      return $localStorage.getItem(`${ctrl._ctrlName}_columns_show`)
    }

    init();
    function init() {

      if(getShowColumn()){
        ctrl.columns = getShowColumn();
      }else{
          saveShowColumn()
      }

      ctrl.columnsArray =  Object.keys(ctrl.columns).map(key => {
        return {
            key: key,
            title: ctrl.columns[key].title,
            show: ctrl.columns[key].show
        };
      })

      ctrl._searchByKeyToFilterData = getTextSearch();
      var dfdAr = [];

      if($filter('hasRule')(NOTIFY_RULE.USE)){
        ctrl.show_checkbox_my_notify = true;
        ctrl.show_checkbox_internal = true;
        ctrl.show_checkbox_external = true;
      }

      if($filter('hasRule')(NOTIFY_RULE.CREATE)){
        ctrl.show_checkbox_my_notify = true;
        ctrl.show_checkbox_internal = true;
        ctrl.show_checkbox_external = true;
        ctrl.show_checkbox_created = true;
        ctrl.checkbox_created = true;
      }

      if($filter('hasRule')(NOTIFY_RULE.APPROVE_DEPARTMENT)){
        ctrl.checkbox_need_handle = true;
        ctrl.checkbox_created = false;

        ctrl.show_checkbox_handled = true;
        ctrl.show_checkbox_need_handle = true;
        ctrl.show_checkbox_reject = true;
        ctrl.show_checkbox_my_notify = true;
        ctrl.show_checkbox_internal = true;
        ctrl.show_checkbox_external = true;
      }

      if($filter('hasRule')(NOTIFY_RULE.APPROVE_LEAD)){
        ctrl.checkbox_need_handle = true;
        ctrl.checkbox_created = false;

        ctrl.show_checkbox_handled = true;
        ctrl.show_checkbox_need_handle = true;
        ctrl.show_checkbox_reject = true;
        ctrl.show_checkbox_my_notify = true;
        ctrl.show_checkbox_internal = true;
        ctrl.show_checkbox_external = true;
      }

      if($filter('hasRule')(NOTIFY_RULE.APPROVE_LEAD_EXTERNAL)){
        ctrl.checkbox_need_handle = true;
        ctrl.checkbox_created = false;

        ctrl.show_checkbox_handled = true;
        ctrl.show_checkbox_need_handle = true;
        ctrl.show_checkbox_reject = true;
        ctrl.show_checkbox_my_notify = true;
        ctrl.show_checkbox_internal = true;
        ctrl.show_checkbox_external = true;
      }


      dfdAr.push(ctrl.load());
      dfdAr.push(ctrl.count());


      $q.all(dfdAr).then(
        function () {
          ctrl._notyetInit = false;
        },
        function (err) {
          console.log(err);
          err = undefined;
        }
      );

      const ruleApprovalLevel_2 = $rootScope.logininfo.data.rule.find(
        (rule) => rule.rule === "Office.Notify.ApprovalLevel_2"
      );
      ctrl.isShowNeedToHandleLevel_2 =
        ruleApprovalLevel_2 &&
        ["All", "Specific", "Working"].includes(
          ruleApprovalLevel_2.details.type
        );

        const ruleApprovalLevel_1 = $rootScope.logininfo.data.rule.find(
          (rule) => rule.rule === "Office.Notify.ApprovalLevel_1"
        );
        ctrl.isShowNeedToHandleLevel_1 = !!ruleApprovalLevel_1;
        
    }

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        notify_service.load_file_info(params.code, params.name).then(
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

    // ** Edit **
    ctrl.on_pick_notify_group = function (param) {
      ctrl._edit_value.group = param.value || null;
    };

    ctrl.chooseType_edit = function (val) {
      ctrl._edit_value.type = val;
    };

    ctrl.pickEmployee_edit = function (val) {
      ctrl._edit_value.to_employee = angular.copy(val);
    };

    ctrl.chooseDepartment_edit = function (val) {
      ctrl._edit_value.to_department = angular.copy(val);
    };

    ctrl.pickdirector_edit = function (param) {
      ctrl._edit_value.to_director = angular.copy(param);
    };

    function edit_service() {
      var dfd = $q.defer();

      const content = $("#edit_notify_content").summernote("code");

      // Process added files
      const addFilePromises = ctrl._edit_value.addedFiles.map(function (file) {
        return notify_service.pushFile(file, ctrl._edit_value._id).then();
      });

      // Process removed files
      const removeFilePromises = ctrl._edit_value.removedFiles.map(function (
        filename
      ) {
        return notify_service.removeFile(ctrl._edit_value._id, filename);
      });

      notify_service
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
               $('#notify_edit_modal').modal('hide');
                ctrl.refreshData();
                ctrl._customToastScope.addToastValue({
                  message: $filter('l')('Update news successfully'),
                  type:"success"
                });
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

    function approve_department_service() {
      var dfd = $q.defer();
      const content = $("#edit_notify_content").summernote("code");


      // Process added files
      const addFilePromises = ctrl._edit_value.addedFiles.map(function (file) {
        return notify_service.pushFile(file, ctrl._edit_value._id).then();
      });

      // Process removed files
      const removeFilePromises = ctrl._edit_value.removedFiles.map(function (
        filename
      ) {
        return notify_service.removeFile(ctrl._edit_value._id, filename);
      });
      console.log(ctrl._edit_value.note);
      

      notify_service
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
            $('#notify_edit_modal').modal('hide');
            $q.all(addFilePromises.concat(removeFilePromises)).then(
              function () {
                ctrl.refreshData();
                ctrl._customToastScope.addToastValue({
                  message: $filter('l')('Approval news successfully'),
                  type:"success"
                });
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
      ctrl.action = action;
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

      $("#edit_notify_content").summernote({
        callbacks: {
          onChange: function (contents, $editable) {
            if ($(contents).find("img").length === 0) {
            }
          },
        },
      });

      $("#edit_notify_content").summernote("code", ctrl._edit_value.content);
      if(action !== 'edit'){
        $("#edit_notify_content").summernote("disable");
      }
    };

    ctrl.edit = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "edit",
        edit_service
      );
    };

    ctrl.approve_department = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "approve_department",
        approve_department_service
      );
    };

    /**delete */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      notify_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Notify_Delete").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
          ctrl._customToastScope.addToastValue({
            message: $filter('l')('Delete news successfully'),
            type:"success"
          });
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
        delete_service
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

    function throw_to_recyclebin_service() {
      var dfd = $q.defer();
      notify_service
        .throw_to_recyclebin(ctrl._throw_to_recyclebin_value._id)
        .then(
          function () {
            $("#modal_Notify_Throw_to_recyclebin").modal("hide");
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

    ctrl.throw_to_recyclebin = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "throw_to_recyclebin",
        throw_to_recyclebin_service
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

    function restore_from_recyclebin_service() {
      var dfd = $q.defer();
      notify_service
        .restore_from_recyclebin(ctrl._restore_from_recyclebin_value._id)
        .then(
          function () {
            $("#modal_Notify_Restore_from_recyclebin").modal("hide");
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

    ctrl.restore_from_recyclebin = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "restore_from_recyclebin",
        restore_from_recyclebin_service
      );
    };

    ctrl.prepareApprove = function (item) {
      ctrl.status = 'approve';
      $rootScope.statusValue.generate(ctrl._ctrlName, "Notify", "approve");
      ctrl._approve_value = angular.copy(item);
      ctrl._approve_value.files = item.attachments;
      ctrl._approve_value._access_edit = true;

      $("#approval_notify_content").summernote({
        callbacks: {
          onChange: function (contents, $editable) {
            if ($(contents).find("img").length === 0) {
            }
          },
        },
      });

      $("#approval_notify_content").summernote("code", ctrl._approve_value.content);
      if(ctrl._approve_value._access_edit){
        $("#approval_notify_content").summernote("disable");
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

      $("#approval_notify_content").summernote({
        callbacks: {
          onChange: function (contents, $editable) {
            if ($(contents).find("img").length === 0) {
            }
          },
        },
      });

      $("#approval_notify_content").summernote("code", ctrl._approve_value.content);
      if(ctrl._approve_value._access_edit){
        $("#approval_notify_content").summernote("disable");
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
        approve_service
      );
    };

    ctrl.reject = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "reject",
        reject_service
      );
    };

    function approve_service() {
      var dfd = $q.defer();
      const note = ctrl._approve_value.note;
      notify_service.approve(ctrl._approve_value._id, note).then(
        function () {
          $("#notify_approve_modal").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
          ctrl._customToastScope.addToastValue({
            message: $filter('l')('Approval news successfully'),
            type:"success"
          });
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
      notify_service
        .reject(ctrl._approve_value._id, ctrl._approve_value.note)
        .then(
          function () {
            $("#notify_reject_modal").modal("hide");
            $("#notify_approve_modal").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            ctrl._customToastScope.addToastValue({
              message: $filter('l')('Reject news successfully'),
              type:"success"
            });
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

    function recall_service() {
      var dfd = $q.defer();
      notify_service.recall(ctrl._recall_value._id, ctrl._recall_value.reason).then(
        function () {
          $("#modal_Notify_Recall").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
          ctrl._customToastScope.addToastValue({
            message: $filter('l')('Recall news successfully'),
            type:"success"
          });
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
        recall_service
      );
    };

    ctrl.set_hint_note = function(note) {
      ctrl._approve_value.note = $filter('l')(note);
    }

    ctrl.set_hint_note_approve = function(note) {
      ctrl._edit_value.note = $filter('l')(note);
    }

    // PUSH FILE
    ctrl.pushfile_update = function (param) {
      ctrl._edit_value.addedFiles.push(param);
    };

    // REMOVE FILE
    ctrl.on_remove_attachment_file_edit = function (param) {
      ctrl._edit_value.removedFiles.push(param.name);
      ctrl._edit_value.files = ctrl._edit_value.files.filter(
        (file) => file.name !== param.name
      );
    };
  },
]);

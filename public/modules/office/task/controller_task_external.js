myApp.registerCtrl("task_external_controller", ["task_service", "$q", "$rootScope", "$scope", "$filter", "$location", function (task_service, $q, $rootScope, $scope, $filter, $location) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Task", action: "init" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "update" },
      { name: "Task", action: "cancel" },
      { name: "Task", action: "delete" },
      { name: "Task", action: "load" },
      { name: "Task", action: "count" },
    ];
    const ctrl = this;

    ctrl._urlInsertHeadTaskModal = FrontendDomain + "/modules/office/task/views/insert_head_task_modal_2.html";
    ctrl._urlUpdateHeadTaskModal = FrontendDomain + "/modules/office/task/views/update_head_task_modal_2.html";
    ctrl._urlCancelHeadTaskModal = FrontendDomain + "/modules/office/task/views/cancel_modal_head_task.html";
    ctrl._urlDeleteHeadTaskModal = FrontendDomain + "/modules/office/task/views/delete_head_task_modal.html";

    const TASK_RULE = {
      CREATE_TASK_DEPARTMENT: "Office.Task.Create_Task_Department", //Tạo công việc trong đơn vị
      CREATE_EXTERNAL: "Office.Task.CreateExternal", //Tạo công việc cấp 1
      OBSERVER_EXTERNAL: "Office.Task.observerExternal", // Giám sát công việc cấp 1
      RECEIVE_EXTERNAL: "Office.Task.ReceiveExternal", // Tiếp nhận công việc cấp 1
      RECEIVE_TASK: "Office.Task.Receive_task", // Tiếp nhận công việc từ phòng ban khác
    } ;


    //Init value
    {
      ctrl._ctrlName = "task_external_controller";

      ctrl._idEditor = "insertHeadTask_content";
      ctrl._idEditor_update = "updateHeadTask_content";

      ctrl._insert_value = {};
      ctrl._update_value = {};
      ctrl._cancel_value = {};
      ctrl._delete_value = {};
      ctrl.TaskPriority = {
        master_key: "task_priority",
        load_details_column: "value",
      };
      ctrl.function_apply_suggestions = ['task'];

      ctrl._filterFromDate = $filter('getSpecificDateRange')('startOfMonth');
      ctrl._filterToDate = $filter('getSpecificDateRange')('endOfMonth');

      ctrl.numOfItemPerPage = 10;
      ctrl.totalItems = 0;
      ctrl.totalHeadTaskItems = 0;
      ctrl.currentHeadTaskPage = 1;
      ctrl.offset = 0;
      ctrl.sortTask = { name: "_id", value: false, query: { _id: -1, date_created: -1 } };
      ctrl.headTasks = [];
      ctrl.fromDate_update_ErrorMsg = "";

      ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
    }
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


    $rootScope.$on('importTask:accessDone', function () {
      ctrl.refreshData();
    });

    const TASK_STATUS = {
      NOT_SEEN: "NotSeen",
      PROCESSING: "Processing",
      PENDING_APPROVAL: "PendingApproval",
      WAITING_FOR_APPROVAL: "WaitingForApproval",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
      WAITING_RECEIVE: "WaitingReceive"
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

    //Start Insert
    ctrl.prepareInsert = function () {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
      var today = new Date();
      var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      $("#" + ctrl._idEditor).summernote({
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

      ctrl._insert_value = {
          files: [],
          code:"",
          task_list: [],
          main_person:[],
          participant: [],
          observer: $filter('hasRule')(TASK_RULE.OBSERVER_EXTERNAL) ? [$rootScope.logininfo.username] : [],
          parent: [],
          label:[],
          da_book:"",
          number:1,
          from_date: myToday.getTime(),
          author: "",
          agency_promulgate: "",
          to_date:endDay.getTime(),
          note: "",
          type: 1,
          priority: $filter('taskPriorityTransform')("Medium").value,
          is_legal: false,
          is_assign_task: false,
          excerpt: "",
          level: "HeadTask",
          _filterTaskPriority: "",
          currentDepartment: null,
          estimate: 1,
      };
    }

    ctrl.chooseFromDate_insert = function (val) {
      ctrl._insert_value.from_date = val ? val.getTime() : undefined;
      if(ctrl._insert_value.from_date >= ctrl._insert_value.to_date){
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date);
      }else{
        ctrl.fromDate_ErrorMsg = '';
      }
    };

    ctrl.chooseToDate_insert = function (val) {
      ctrl._insert_value.to_date = val ? val.getTime() : undefined;
      if(ctrl._insert_value.from_date >= ctrl._insert_value.to_date){
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, ctrl._insert_value.from_date, ctrl._insert_value.to_date);
      }else{
        ctrl.fromDate_ErrorMsg = '';
      }
    };

    ctrl.chooseDepartment_insert = function(val){
      ctrl._insert_value.currentDepartment = val.id;
    }

    ctrl.chooseTaskPriority_insert = function (val) {
      const priority = $filter('taskPriorityTransform')(val.value);
      ctrl._insert_value.priority = priority.key;
    };

    ctrl.pickLabel_insert = function (value) {
      ctrl._insert_value.label = value;
    };

    ctrl.removeFile_insert = function (item) {
      ctrl._insert_value.files = ctrl._insert_value.files.filter(
        (e) => e.name !== item.name
      );
    };

    ctrl.pickObserver_insert = function(val){
      ctrl._insert_value.observer = val;
    }

    ctrl.insert = function(){
      return $rootScope.statusValue.execute( ctrl._ctrlName, "Task", "insert", insert_service);
    }

    function insert_service() {
      const dfd = $q.defer();
      task_service.insert_head_task(
        ctrl._insert_value.files, //1
        ctrl._insert_value.title, //1
        "",
        $("#" + ctrl._idEditor).summernote('code'), //1
        ctrl._insert_value.task_list, //1
        ctrl._insert_value.main_person, //1
        ctrl._insert_value.participant, //1
        ctrl._insert_value.observer, //1
        ctrl._insert_value.from_date, //1
        ctrl._insert_value.to_date, //1
        ctrl._insert_value.has_time, //1
        ctrl._insert_value.hours, //1
        $filter('taskPriorityTransform')(ctrl._insert_value.priority).key, //1
        ctrl._insert_value.type, //1
        ctrl._insert_value.head_task_id, //1
        null, //parent_id
        ctrl._insert_value.currentProject, //1
        ctrl._insert_value.currentDepartment, //1
        undefined, //dispatch_arrived_id
        ctrl._insert_value.level, //1
        ctrl._insert_value.label, //1
        false, //is_draft
        [], //parents
        {}, //parent
        1, //source_id,
        ctrl._insert_value.estimate, //estimate,
      ).then(function(res){
        ctrl.refreshData();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Create task successfully'),
          type:"success"
        });
        $('#modal_Head_Task_Insert_In_Department_Dashboard_2').modal('hide');
        dfd.resolve(true);
      }, function(err){
        dfd.reject(err);
      });
      return dfd.promise;
    }
    //End Insert

    //Load

    ctrl.load_priority_filter = function (params) {
      return new Promise((resolve, reject) => {
        const priorityList = [
          { _id: 1, title: "Critical" },
          { _id: 2, title: "High" },
          { _id: 3, title: "Medium" },
          { _id: 4, title: "Low" },
        ];
        return resolve(priorityList);
      });
    };

    ctrl.load_status_filter = function (params) {
      return new Promise((resolve, reject) => {
        const statusListFilter = [
          {
            _id: 'NotSeen',
            title: 'NotSeen'
          },
          {
            _id: 'Processing',
            title: 'Processing'
          },
          {
            _id: 'PendingApproval',
            title: 'PendingApproval'
          },
          {
            _id: 'WaitingForApproval',
            title: 'WaitingForApproval'
          },
          {
            _id: 'Completed',
            title: 'Completed'
          },
          {
            _id: 'Cancelled',
            title: 'Cancelled'
          }
        ];

        return resolve(statusListFilter)
      })
    }

    ctrl.load_state_filter = function (params) {
      return new Promise((resolve, reject) => {
        const stateListFilter = [
          {
            _id: "Open",
            title: "Open",
          },
          {
            _id: "OnSchedule",
            title: "OnSchedule",
          },
          {
            _id: "GonnaLate",
            title: "GonnaLate",
          },
          {
            _id: "Overdue",
            title: "Overdue",
          },
          {
            _id: "Early",
            title: "Early",
          },
          {
            _id: "Late",
            title: "Late",
          },
        ];
        return resolve(stateListFilter);
      });
    };

    ctrl.loadLabel = function ({ search, top, offset, sort }) {
      var dfd = $q.defer();
      task_service.load_label(ctrl.departmentId, search, top, offset, sort).then(
        function (res) {
          res.data.forEach(function (element) {
            if (element.child_labels && element.child_labels.length > 0) {
              element.expand = true;
              element.open = true;
            }
          });
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

    ctrl.load_department_filter = function (params) {
      var dfd = $q.defer();
      task_service.load_deparment(1).then(
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

    ctrl.load_role_filter = function (params) {
      return new Promise((resolve, reject) => {
        const roleFilter = [
          {
            _id: "observer",
            title: "Observer",
          },
          {
            _id: "creator",
            title: "Creator",
          },
        ];
        return resolve(roleFilter);
      });
    };

    ctrl.pickRole = function(value){
      ctrl._filter_value_role = value;
      ctrl.refreshData();
    }

    ctrl.pickPriority = function (value) {
      ctrl._filter_value_priority = value;
      ctrl.refreshData();
    };

    ctrl.pickStatus = function (value) {
      ctrl._filter_value_status = value;
      ctrl.refreshData();
    };

    ctrl.pickState = function (value) {
      ctrl._filter_value_state = value;
      ctrl.refreshData();
    };

    ctrl.pickLabelFilter = function (value) {
      ctrl._filter_value_label = value;
      ctrl.refreshData();
    };

    ctrl.pickDepartmentFilter = function (value) {
      ctrl._filter_value_department = value;
      ctrl.refreshData();
    };

    ctrl.load = function(val){

      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }

      return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'load', load_service);
    };

    ctrl.count = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'count', count_service);
    };

    function generateFilter() {
      var obj = {};
      if (ctrl._searchHeadTaskByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchHeadTaskByKeyToFilterData);
      }


      if (ctrl._filterFromDate) {
        obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
      }

      if (ctrl._filterToDate) {
        obj.to_date = angular.copy(ctrl._filterToDate.getTime());
      }

      if (ctrl._filter_value_priority) {
        obj.priority_filter = angular.copy(ctrl._filter_value_priority);
      }

      if (ctrl._filter_value_status) {
        obj.status_filter = angular.copy(ctrl._filter_value_status);
      }

      if (ctrl._filter_value_state) {
        obj.state_filter = angular.copy(ctrl._filter_value_state);
      }

      if (ctrl._filter_value_label) {
        obj.label_filter = angular.copy(ctrl._filter_value_label);
      }

      if (ctrl._filter_value_department) {
        obj.department_filter = angular.copy(ctrl._filter_value_department);
      }

      if (ctrl._filter_value_role) {
        obj.role_filter = angular.copy(ctrl._filter_value_role);
      }

      return obj;
    }

    function load_service(){
      const dfd = $q.defer();
      const _filter = generateFilter();
      task_service.load_task_external(
        ctrl.numOfItemPerPage,
        ctrl.offset,
        ctrl.sortTask.query,
        _filter.search,
        _filter.from_date,
        _filter.to_date,
        _filter.status_filter,
        _filter.priority_filter,
        _filter.state_filter,
        _filter.label_filter,
        _filter.department_filter,
        _filter.role_filter
      ).then(function(res){
        ctrl.headTasks = res.data.map(item => ({
          ...item,
          permissions: { ...$filter('getPermissionTask')(item) },
        }));

        dfd.resolve(res.data);
      }, function(err){
        console.log(err)
        dfd.reject(err);
      });

      return dfd.promise;
    }

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

    function count_service(){
      const dfd = $q.defer();
      const _filter = generateFilter();
      task_service.count_task_external(
        _filter.search,
        _filter.from_date,
        _filter.to_date,
        _filter.status_filter,
        _filter.priority_filter,
        _filter.state_filter,
        _filter.label_filter,
        _filter.department_filter,
        _filter.role_filter
      ).then(function(res){
        ctrl.totalHeadTaskItems = res.data[0].count;
        dfd.resolve(res.data);
      }, function(err){
        console.log(err)
        dfd.reject(err);
      });

      return dfd.promise;
    }

    ctrl.refreshData = function(){
      $q.all([ctrl.load(), ctrl.count()]);
    }

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        task_service.loadFileInfo(params.id, params.name).then(
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

    //End Load


    //Update
    ctrl.prepareUpdate = function(item){
      ctrl._update_value = angular.copy(item);
      ctrl._update_value.new_files = [];
      ctrl._update_value.remove_attachment = [];
      ctrl._update_value.priority = $filter('taskPriorityTransform')(ctrl._update_value.priority).value
      $("#" + ctrl._idEditor_update).summernote({
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
      $("#" + ctrl._idEditor_update).summernote('code', item.content);
    }

    ctrl.chooseFromDate_update = function (val) {
      ctrl._update_value.from_date = val ? val.getTime() : undefined;
      if(ctrl._update_value.from_date >= ctrl._update_value.to_date){
        ctrl.fromDate_update_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date);
      }else{
        ctrl.fromDate_update_ErrorMsg = '';
      }
    };

    ctrl.chooseToDate_update = function (val) {
      ctrl._update_value.to_date = val ? val.getTime() : undefined;
      if(ctrl._update_value.from_date >= ctrl._update_value.to_date){
        ctrl.fromDate_update_ErrorMsg = $rootScope.isValidFromDate(true, ctrl._update_value.from_date, ctrl._update_value.to_date);
      }else{
        ctrl.fromDate_update_ErrorMsg = '';
      }
    };

    ctrl.chooseDepartment_update = function(val){
      ctrl._update_value.department = val.id;
    }

    ctrl.pickObserver_update = function(val){
      ctrl._update_value.observer = val;
    }

    ctrl.chooseTaskPriority_update = function (val) {
      const priority = $filter('taskPriorityTransform')(val.value);
      ctrl._update_value.priority = priority.key;
    };

    ctrl.pickLabel_update = function (value) {
      ctrl._update_value.label = value;
    };

    ctrl.removeFile_update = function (item) {
      ctrl._update_value.attachment = ctrl._update_value.attachment.filter(
        (e) => e.name !== item.name
      );
      ctrl._update_value.remove_attachment.push(item.name)
    };

    ctrl.removeNewFile_update = function (item) {
      ctrl._update_value.new_files = ctrl._update_value.new_files.filter(
        (e) => e.name !== item.name
      );
    };

    ctrl.update = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'update', update_service);
    }

    function update_service(){
      const dfd = $q.defer();
      task_service.update_head_task(
        ctrl._update_value.code, //code
        ctrl._update_value.new_files, //new file
        ctrl._update_value.remove_attachment, //remove_file
        ctrl._update_value.title, //title
        $("#" + ctrl._idEditor_update).summernote('code'), //content
        ctrl._update_value.observer, //observer
        ctrl._update_value.from_date, //from_date
        ctrl._update_value.to_date, //to_date
        $filter('taskPriorityTransform')(ctrl._update_value.priority).key, //priority
        ctrl._update_value.department, //1
        ctrl._update_value.label, //label
        ctrl._update_value.estimate, //estimate,
      ).then(function(res){
        ctrl.refreshData();
        ctrl._customToastScope.addToastValue({
          message: $filter('l')('Update successfully'),
          type:"success"
        });
        $('#modal_Head_Task_Update_In_Department_Dashboard_2').modal('hide');
        dfd.resolve(true);
      }, function(err){
        dfd.reject(err);
      });

      return dfd.promise;
    }
    //End update

    //Cancel

    ctrl.prepareCancel = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
      ctrl._cancel_value = angular.copy(value);
    };

    ctrl.cancelTask = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "cancel",
        cancel_service
      );
    };

    function cancel_service() {
      var dfd = $q.defer();
      task_service.cancel(ctrl._cancel_value._id, ctrl._cancel_value.reason).then(
        function (res) {
          $("#modal_Head_Task_Cancel").modal("hide");
          ctrl.refreshData();
          ctrl._customToastScope.addToastValue({
            message: $filter('l')('Cancel task successfully'),
            type:"success"
          });
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
    //End cancel

    //Delete
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "delete");
      ctrl._delete_value = angular.copy(value);
    };
    ctrl.delete = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "delete",
        delete_service
      );
    };

    function delete_service() {
      var dfd = $q.defer();
      task_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Head_Task_Delete").modal("hide");
          ctrl.refreshData();
          ctrl._customToastScope.addToastValue({
            message: $filter('l')('Delete task successfully'),
            type:"success"
          });
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
    //End delete

    function init() {
      const dfdAr = [];
      dfdAr.push(ctrl.load());
      dfdAr.push(ctrl.count());
      $q.all(dfdAr).then(function(){

      }, function(err){
        console.log(err);
      });
    }
    init();
  },
]);

myApp.registerCtrl("add_task_with_template_controller", ["task_service", "$q", "$rootScope", "$scope", 'FileSaver', function (task_service, $q, $rootScope, $scope, FileSaver) {
  /**declare variable */
  const _statusValueSet = [
    { name: "Task", action: "init" },
    { name: "Task", action: "insert" },
    { name: "Task", action: "pushFile" },
    { name: "Task", action: "removeFile" },
    { name: "Task", action: "loadTemplate" },
    { name: "Task", action: "loadDepartments" },
    { name: "Task", action: "loadObservers" },
    { name: "Task", action: "import_excel_task" },

  ];
  const ctrl = this;

  //Init value
  {
    ctrl._ctrlName = "add_task_with_template_controller";

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    ctrl._notyetInit = true;
    ctrl.collapseTask = true;
    ctrl.collapseProject = true;
    ctrl.collapseManagementLabel = true;
    ctrl.showPopup = false;
    ctrl.handleDataForDepartment = false
    ctrl.dataExcelJsonImported = [];
    ctrl.dataExcelConverted = [];
    ctrl._search = '';
    ctrl.department = [];
    ctrl.observer = [];
    ctrl.project = [];
    ctrl.task_type = [{key: 1, value: 'Công việc'}, {key: 2, value: 'Trình ký'}, {key: 3, value: 'Thông báo'}];
    ctrl.dataSendToBe = [];
    ctrl.groupData = [];
    ctrl.message = [];
    ctrl.insertedData = [];
    ctrl._filterSeries = null;
    ctrl.sort_Project = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
    ctrl.errorEmpty = "Dữ liệu không được để trống!";
    ctrl.templateHeader = ['title', 'from_date', 'to_date', 'department', 'priority', 'content', 'task_list'];
    ctrl.requiredPropertiesDepartment = ['title', 'from_date', 'to_date', 'department', 'priority'];
    ctrl.requiredPropertiesProject = ['title', 'from_date', 'to_date', 'project', 'priority'];
    ctrl.priorityListImport = [
        {
            title: 'Thấp', value: 4
        },
        {
            title: 'Trung bình', value: 3
        },
        {
            title: 'Quan trọng', value: 2
        },
        {
            title: 'Nghiêm trọng', value: 1
        }
    ];
    

    // Pagination variables
    ctrl.currentPage = 1;
    ctrl.numOfItemPerPage = 5;
  }

  function loadTemplate_service() {
    var dfd = $q.defer();
    ctrl.loadingTemplate = true;
    ctrl.handleDataForDepartment = false;
    task_service.load_template_for_departments().then(
        function (res) {
          
            FileSaver.saveAs(res.data, 'Tep-tin-mau-Them-cong-viec.xlsx');
            dfd.resolve(true);
        },
        function (err) {
            dfd.reject(err);
        }
    ).finally(() => {
        ctrl.loadingTemplate = false;
    });
    return dfd.promise;
  }

  ctrl.loadTemplate = function () {
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadTemplate", loadTemplate_service);
  };

  ctrl.removeExcelFile_insert = function (item) {

    var temp = [];
    ctrl._insertExcel.excelFile = angular.copy(temp);
    ctrl.dataExcelConverted = angular.copy(temp);
    ctrl.isWatched = false;
    ctrl.groupData = [];
    ctrl.message = [];
    ctrl.insertedData = [];
    ctrl.handleDataForDepartment = false;
  }

  ctrl.loadDepartments = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadDepartments", loadDepartment_service);
  }
  function loadDepartment_service() {
      var dfd = $q.defer();
      task_service.loadAllDepartment(1).then((res) => {
        ctrl.department = res.data.map(item => ({
            ...item,
            optionTitle: item.title['vi-VN'],
        }));
        dfd.resolve(true);
      }, function () {
        dfd.reject(false);
        err = undefined;
      })
      return dfd.promise;
  }

  ctrl.loadObservers = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadObservers", loadObserver_service);
  }
  function loadObserver_service() {
      var dfd = $q.defer();
      task_service.loadUserByRule().then((res) => {
        ctrl.observer = res.data;
        dfd.resolve(true);
      }, function () {
        dfd.reject(false);
        err = undefined;
      })
      return dfd.promise;
  }

  ctrl.insertNewTaskExcel = function (file) {
    if (file) {
        var fileType = file.name.split('.').pop().toLowerCase();
        if (fileType == 'xlsx' || fileType == 'xls') {
            if (file.file.size >= 5 * 1024 * 1024) {
                openPopup("Cảnh báo", "Tệp của bạn đang vượt quá dung lượng được cho phép (Tối đa < 5mb)", "error");
                return;
            }
            else {
                ctrl.closePopup();

            }
        }
        else {
            openPopup("Cảnh báo", "Định dạng tệp của bạn không đúng, vui lòng thử lại", "error");
            return;
        }
        ctrl.isWatched = false;
        ctrl.dataExcelConverted = [];
        ctrl.loadData(file.file).then(() => {
            const keysData = Object.keys(ctrl.dataExcelJsonImported[0]);
            const isSameArrayForDepartment =
                ctrl.templateHeader.every(element => keysData.includes(element)) && keysData.length === ctrl.templateHeader.length;
            if(isSameArrayForDepartment) {
                ctrl.handleDataForDepartment = isSameArrayForDepartment;
                ctrl.validateDataImport();
            } else {
                openPopup("Cảnh báo", "Template của bạn không đúng, vui lòng thử lại", "error");
                return;
            }
        })
    }
    ctrl.showPopup = false;
    $rootScope.$apply();
  }

  openPopup = (title, content, type) => {
    ctrl.showPopup = true;
    ctrl.titleInputExcelPopup = title;
    ctrl.contentinputExcelPopup = content;
    ctrl.titleType = type;
    // $rootScope.$apply();
  }

  ctrl.closePopup = function () {
    ctrl.showPopup = false;
  }

  ctrl.loadData = function (params) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var firstSheetName = workbook.SheetNames[0];
            var thirdSheetName = workbook.SheetNames[2];
            var fourthSheetName = workbook.SheetNames[3];
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            var jsonPriority = XLSX.utils.sheet_to_json(workbook.Sheets[thirdSheetName]);
            var jsonTaskType = XLSX.utils.sheet_to_json(workbook.Sheets[fourthSheetName]);
            ctrl.dataExcelJsonImported = jsonData;
            ctrl.priorityDataExcel = jsonPriority;
            ctrl.taskTypeDataExcel = jsonTaskType;

            resolve()
        }
        reader.readAsBinaryString(params);
    })
  }

  ctrl.validateDataImport = function (isSameArrayForDepartment) {
    let newTask = {}
    ctrl.dataExcelConverted = [];
    ctrl.isWatched = true;
    let dataExcel = ctrl.dataExcelJsonImported;
    for (let i = 0; i < dataExcel.length; i++) {
      if (i > 1) {
          if(ctrl.handleDataForDepartment) {
              newTask = {
                  idx: i-2,
                  id: Math.random().toString(36).substring(2, 9),
                  title: dataExcel[i].title,
                  content: dataExcel[i].content,
                  from_date: ctrl.converttoISOString(dataExcel[i].from_date),
                  to_date: ctrl.converttoISOString(dataExcel[i].to_date),
                  orig_department: dataExcel[i].department,
                  department: dataExcel[i].department,
                  // orig_dispatch_arrived_code: dataExcel[i].dispatch_arrived_code,
                  dispatch_arrived_code: dataExcel[i].dispatch_arrived_code,
                  priority: ctrl.getValuePriority(dataExcel[i].priority),
                  task_type: ctrl.convertTaskType(dataExcel[i].task_type),
                  has_time: dataExcel[i].hours ? true : false,
                  // hours: dataExcel[i].hours,
                  task_list: dataExcel[i].task_list ? dataExcel[i].task_list.split('\n').map(function (item) {
                      return {
                          title: item.trim(),
                          id: Math.random().toString(36).substring(2, 9),
                          status: false
                      }
                  }) : []
              }
          } else {
              newTask = {
                  idx: i-2,
                  id: Math.random().toString(36).substring(2, 9),
                  title: dataExcel[i].title,
                  content: dataExcel[i].content,
                  from_date: ctrl.converttoISOString(dataExcel[i].from_date),
                  to_date: ctrl.converttoISOString(dataExcel[i].to_date),
                  orig_project: dataExcel[i].project,
                  project: dataExcel[i].project,
                  priority: ctrl.getValuePriority(dataExcel[i].priority),
                  task_type: ctrl.convertTaskType(dataExcel[i].task_type),
                  has_time: dataExcel[i].hours ? true : false,
                  // hours: dataExcel[i].hours,
                  task_list: dataExcel[i].task_list ? dataExcel[i].task_list.split('\n').map(function (item) {
                      return {
                          title: item.trim(),
                          id: Math.random().toString(36).substring(2, 9),
                          status: false
                      }
                  }) : []
              }
          }
          ctrl.dataExcelConverted.push(newTask);
        }
      }
      groupData();
    ctrl.validateProperties(ctrl.dataExcelConverted);
    $rootScope.$apply();
  }

  ctrl.validateProperties = function (arrayImportedItem) {
    const format = "DD/MM/YYYY";
    let isValidFormatFromDate = false;
    let isValidFormatToDate = false;
    const indexes = [];
    arrayImportedItem.forEach((object, index) => {
        for (const key in object) {
          if (key === 'department' && !object[key] && !!object.orig_department) {
              indexes.push({ index, property: key, details: `Không tìm thấy Phòng ban "${object.orig_department}"` });
              continue;
          }
          if (ctrl.requiredPropertiesDepartment.includes(key) && !object[key]) {
              indexes.push({ index, property: key, details: ctrl.errorEmpty });
          }
        }

        const itemDepartment = ctrl.department.find((department) => department.optionTitle === object.orig_department);
        const itemObserver = itemDepartment ? ctrl.observer.find((ob) => ob.departmentId === itemDepartment.id) : undefined;
        object.observer =  itemObserver ? itemObserver.username : undefined;

        if (object.from_date) {
            ctrl.converttoISOString(object.from_date);
            isValidFormatFromDate = moment(object.from_date, format, true).isValid();
            if (!isValidFormatFromDate) {
                indexes.push({ index, property: 'from_date', details: "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy)." })
            }
        }
        if (object.to_date) {
            isValidFormatToDate = moment(object.to_date, format, true).isValid();
            if (!isValidFormatToDate) {
                indexes.push({ index, property: 'to_date', details: "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy)." })
            }
        }

        if (isValidFormatFromDate && isValidFormatToDate && moment(object.from_date, format).unix() > moment(object.to_date, format).unix()) {
            indexes.push({ index, property: 'from_date', details: "Trường 'Từ ngày' phải nhỏ hơn trường 'Đến ngày'" })
        }
    });
    if (indexes.length > 0) {
        ctrl.listErrorExcelImport = indexes;
    } else {
        ctrl.listErrorExcelImport = [];
        console.log("All properties are defined in all objects.");
    }
  }

  function groupData (){
    ctrl.insertedData = ctrl.dataExcelConverted;
  }

  ctrl.converttoISOString = function (dateString) {
    if (typeof dateString === 'string') {
        var dateParts = dateString.split('/');
        var dateObject = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
        return dateObject;
    }
  }

  ctrl.getValuePriority = function (data) {
    let newValue = '';
    let list = [...ctrl.priorityDataExcel];
    for (let i = 0; i < ctrl.priorityDataExcel.length; i++) {
        if (i > 0) {
            if (list[i].value === data) {
                newValue = list[i].priority
            }
        }
    }
    return newValue;
  }

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

  ctrl.import_excel_task_external = function(){
    if (ctrl.listErrorExcelImport.length) {
        alert('File của bạn có lỗi, xin vui lòng cập nhật trước khi thêm mới.');
        return;
    }
    return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'import_excel_task', import_excel_task_external_service)
  }

  function import_excel_task_external_service(){
    const dfd = $q.defer();
    ctrl.dataSendToBe = JSON.parse(JSON.stringify(ctrl.dataExcelConverted));
    ctrl.dataSendToBe.map((item) => {
      let dateFromDate = new Date(item.from_date);
      let dateToDate = new Date(item.to_date);
      const selectedDepartment = ctrl.department.find((department) => department.optionTitle === item.department);
      
      item.from_date = dateFromDate.getTime();
      item.to_date = dateToDate.getTime();
      item.department = selectedDepartment ? selectedDepartment.id : undefined;
      delete item.$$hashKey;
      delete item.idx;
      delete item.orig_department;
      delete item.orig_project;
      delete item.orig_dispatch_arrived_code;
      delete item.dispatch_arrived_code;
      delete item.task_type;
    });

    task_service.insert_task_external({data: ctrl.dataSendToBe}).then((res) => {
      $rootScope.$broadcast("importTask:accessDone");

        openPopup(
            'Thành công',
            `Có ${ctrl.insertedData.length} công việc trong tệp của bạn đã được thêm thành công vào hệ thống`,
            'success'
        );
        dfd.resolve(true);
    }, function(err){
        dfd.reject(err);
    })

    return dfd.promise;
  }

  ctrl.valueImportChange = function () {
    ctrl.validateProperties(ctrl.dataExcelConverted);
  }

  ctrl.handleInvalidDepartment = function (item) {
    item.department = undefined;
    groupData();
    ctrl.validateProperties(ctrl.dataExcelConverted);
  };

  ctrl.chooseDepartment = function (item, department) {
      item.orig_department = undefined;
      item.department = department.title ? department.title['vi-VN'] : undefined;
      groupData();
      ctrl.validateProperties(ctrl.dataExcelConverted);
  };

  ctrl.chooseObserver = function (item, observer) {
      item.observer = observer.username;
      groupData();
      ctrl.validateProperties(ctrl.dataExcelConverted);
  };

  ctrl.handleInvalidObserver = function (item) {
    item.observer = undefined;
    groupData();
    ctrl.validateProperties(ctrl.dataExcelConverted);
  };

  ctrl.selectOption = function (index, option, id, type) {
    ctrl.selectedValue = option;
    ctrl.isDropdownOpen = false;
    if (ctrl.dataExcelConverted[index].id === id) {
        if (type === 'priority') {
            ctrl.dataExcelConverted[index][type] = option;
        }
        else {
            ctrl.dataExcelConverted[index][type].push(option);
            ctrl.userLists = ctrl.userLists.filter(item => !ctrl.dataExcelConverted[index][type].some(item2 => item.username === item2.username));
        }
    }
    ctrl.activeItemId = '';
    ctrl.validateProperties(ctrl.dataExcelConverted);
  };

  ctrl.updatePaginatedData = function () {
    const start = (ctrl.currentPage - 1) * ctrl.numOfItemPerPage;
    const end = start + ctrl.numOfItemPerPage;
    let tempArray = ctrl?.insertedData;
    if (ctrl._searchByDataExcel) {
      tempArray = tempArray.filter((item) => { 
        return (item.title.toLowerCase()).includes(ctrl._searchByDataExcel.toLowerCase())
      });
    }
    ctrl.totalItems = tempArray.length;
    ctrl.totalPages = Math.ceil(ctrl.totalItems / ctrl.numOfItemPerPage);
    ctrl.pages = Array.from({ length: ctrl.totalPages }, (v, k) => k + 1);
    ctrl.paginatedData = tempArray?.slice(start, end);
  };

  // Function to set the current page
  ctrl.setPage = function (page) {
    if (page >= 1 && page <= ctrl.totalPages) {
      ctrl.currentPage = page;
      ctrl.updatePaginatedData();
    }
  };

  ctrl.previousPage = function () {
    if (ctrl.currentPage > 1) {
      ctrl.currentPage--;
      ctrl.updatePaginatedData();
    }
  };

  // Function to go to the next page
  ctrl.nextPage = function () {
    if (ctrl.currentPage < ctrl.totalPages) {
      ctrl.currentPage++;
      ctrl.updatePaginatedData();
    }
  };

  // Watch for changes in insertedData to update pagination
  $scope.$watch(
    function () {
      return ctrl.insertedData;
    },
    function (newVal) {
      if (newVal) {
        ctrl.totalItems = newVal.length;
        ctrl.totalPages = Math.ceil(ctrl.totalItems / ctrl.numOfItemPerPage);
        ctrl.pages = Array.from({ length: ctrl.totalPages }, (v, k) => k + 1);
        ctrl.updatePaginatedData();
      }
    }
  );

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

  ctrl.pickLabel_InsertTranferTask = function (value, item) {
      item.label = value;
  };

  function init() {
    const dfdAr = [];
    dfdAr.push(ctrl.loadDepartments());
    dfdAr.push(ctrl.loadObservers())
    $q.all(dfdAr).then(function(){
        ctrl._notyetInit = false;
    }, function(err){
        err = undefined;
    })
  }
  init();
},
]);

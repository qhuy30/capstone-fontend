myApp.registerCtrl("task_department_controller", [
  "task_service",
  "workflow_play_service",
  "notify_service",
  "$q",
  "$rootScope",
  "$scope",
  "$filter",
  "$location",
  "FileSaver",
  "Blob",
  function (
    task_service,
    workflow_play_service,
    notify_service,
    $q,
    $rootScope,
    $scope,
    $filter,
    $location,
    FileSaver,
    Blob
  ) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Task", action: "init" },
      { name: "Task", action: "load" },
      { name: "Task", action: "load_head_task" },
      { name: "Task", action: "count" },
      { name: "Task", action: "count_head_task" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "update" },
      { name: "Task", action: "delete" },
      { name: "Task", action: "cancel" },
      { name: "Task", action: "alertPopupExcel" },
      { name: "Task", action: "pushFile" },
      { name: "Task", action: "removeFile" },
      { name: "Task", action: "assign" },

      { name: "Task", action: "insertTaskExcel" },
      { name: "Task", action: "export" },
      { name: "Task", action: "loadTemplate" },

      { name: "Task", action: "loadGanttChartData" },
      { name: "Task", action: "receive_task" },
      { name: "Task", action: "reject_receive_task" },
      { name: "Task", action: "import_excel_task" },
      { name: "Task", action: "reject_approval_receive_task" },
      { name: "Task", action: "approval_receive_task" },
    ];

    const TASK_RULE = {
      FOLLOW_DEPARTMENT:"Office.Task.Follow_Task_Department",
      IMPORT_DEPARTMENT:"Office.Task.Import_Task_Department",
      DELETE_DEPARTMENT:"Office.Task.Delete_Task_Department",
      DELETE_PROJECT:"Office.Task.Delete_Task_Project",
      COMPLETED_DEPARTMENT:"Office.Task.Complete_Task_Department",
      COMPLETED_PROJECT:"Office.Task.Complete_Task_Project",
      EDIT_DEPARTMENT:"Office.Task.Edit_Task_Department",
      EDIT_PROJECT:"Office.Task.Edit_Task_Project",
      NOTIFY_DEPARTMENT: "Office.Task.Notify_Task_Department",
      DIRECTOR_MANAGE: "Office.Task.Director_Manage",
      LEADER_MANAGE: "Office.Task.Leader_Mangage",
      DEPARTMENT_LEADER_MANAGE: "Office.Task.Department_Leader_Manage",
      RECEIVE_TASK: "Office.Task.Receive_task",
    }

    const TASK_STATUS = {
      NOT_SEEN: "NotSeen",
      PROCESSING: "Processing",
      PENDING_APPROVAL: "PendingApproval",
      WAITING_FOR_APPROVAL: "WaitingForApproval",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
      WAITING_RECEIVE: "WaitingReceive",
      WAITING_LEAD_DEPARTMENT_APPROVE_RECEIVE: "WaitingLeadDepartmentApproveReceive",
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

    $scope.forms = {};

    var ctrl = this;
    var idEditor = "insertTask_content";
    const idEditor_update = "updateTask_content";
    var idEditor_headTask = "insertHeadTask_content";
    var idEditor_cancel = "cancelTask_content";
    /** init variable */
    {
      ctrl._ctrlName = "task_department_controller";
      ctrl.task_type = [{key: 1, value: 'Công việc'}, {key: 2, value: 'Trình ký'}, {key: 3, value: 'Thông báo'}];
      ctrl.sortTask = { name: "_id", value: false, query: { _id: -1, date_created: -1 } };
      ctrl.collapseStrategic = true;
      ctrl.collapseTask = true;

      ctrl._insertExcel = {
        excelFile: []
      }

      ctrl.statusList = [
        {
          title: 'All'
        },
        {
          title: 'Processing'
        },
        {
          title: 'Completed'
        },
        {
          title: 'NotSeen'
        },
        {
          title: 'Cancelled'
        },
        {
          title: 'WaitingForApproval'
        }
      ];

      ctrl.stateList = [
        {
          title: 'All'
        },
        {
          title: 'Open'
        },
        {
          title: 'OnSchedule'
        },
        {
          title: 'GonnaLate'
        },
        {
          title: 'Overdue'
        },
        {
          title: 'Early'
        },
        {
          title: 'Late'
        },
      ]

      ctrl.sortByList = [
        { title: "DepartmentName", value: "title" },
        { title: "CurrentTask", value: "open" },
        { title: "CompletedTask", value: "closed" },
        { title: "Overdue", value: "over_due" },
        { title: "GonnaLate", value: "gonna_late" },
        { title: "Open", value: "on_schedule" }
      ];

      ctrl.sortingOrderList = [
        { title: "Ascending(A->Z)", value: 1 },
        { title: "Descending(Z->A)", value: -1 }
      ];

      // $scope.$watchGroup([
      //   function() { return $scope.updateForm ? $scope.updateForm.$invalid : undefined; },
      //   'ctrlChild.toDate_ErrorMsg',
      //   'ctrlChild.fromDate_ErrorMsg',
      //   'ctrlChild._update_value.status'
      // ], function(newValues) {
      //   console.log('Form invalid:', newValues[0]);
      //   console.log('To Date Error Message:', newValues[1]);
      //   console.log('From Date Error Message:', newValues[2]);
      //   console.log('Task Status:', newValues[3]);
      // });

      /** LOAD PRIORITY OPTIONS */
      ctrl.TaskPriority = {
        master_key: "task_priority",
        load_details_column: "value"
      };
      ctrl.TaskType = {
        master_key: "task_type",
        load_details_column: "value"
      };
      ctrl.errorEmpty = "Dữ liệu không được để trống!"
      ctrl.errorInvalidUser = "Có người không tìm thấy trong phòng ban!"
      ctrl._notyetInit = true;
      ctrl.Departments = [];

      ctrl.wikis = [];

      ctrl.currentDepartment = {
      };
      ctrl.departmentId = "";

      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.offset = 0;

      ctrl.function_apply_suggestions = ['task']

      ctrl.currentPage_Wiki = 1;
      ctrl.numOfItemPerPage_Wiki = 30;
      ctrl.totalItems_Wiki = 0;
      ctrl.offset_Wiki = 0;

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


      ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task/views/delete_modal.html";
      ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/views/cancel_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task/views/update_modal.html";
      ctrl._urlAlertModal = FrontendDomain + "/modules/office/task/views/alert_modal.html";
      ctrl._urlInsertHeadTaskModal = FrontendDomain + "/modules/office/task/views/insert_head_task_modal.html";

      ctrl._urlDepartmentDetails = FrontendDomain + "/modules/office/task/views/department_view.html";
      ctrl._urlReceiveTaskModal = FrontendDomain + "/modules/office/task/views/receive_task_modal.html";
      ctrl._urlAssignmentModal = FrontendDomain + "/modules/office/task/views/assignment_modal.html";

      ctrl.statistic_count = {
        percent: 0,
        data: [],
        label: [
          $filter('l')('WaitingReceive'),
          $filter('l')('NotSeen'),
          $filter('l')('Processing'),
          $filter('l')('WaitingForApproval'),
          $filter('l')('Completed'),
          $filter('l')('Cancelled'),
        ],
        options: {
          cutoutPercentage: 70,
          responsive: true,
          legend: {
            position: 'right',
            display: true
          },
          title: {
            display: true,
            text: $filter('l')('SummaryOfWorkStatus'),
            fullSize: true,
            padding: 15
          },
          events: ['click'],
          onClick: function (event, elements) {
            

            $scope.$apply(function(){
              //
              let statusArray = [
                TASK_STATUS.NOT_SEEN,
                TASK_STATUS.PROCESSING,
                TASK_STATUS.PENDING_APPROVAL,
                TASK_STATUS.WAITING_RECEIVE,
                TASK_STATUS.WAITING_FOR_APPROVAL,
                TASK_STATUS.WAITING_LEAD_DEPARTMENT_APPROVE_RECEIVE,
              ]
              var chartElement = elements[0];
              var index = chartElement._index;
              ctrl._filter_value_status_default = [statusArray[index]];
              ctrl.pickStatus([statusArray[index]]);
            })
          }
        },
        colors: ["#33b5e5","#aa66cc", "#ffbb33", "#4285f4" ,"#00c851" ,  "#869fac"]
      };
      ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();

      ctrl.statistic_growth = {
        data: [],
        label: [],

        series: [$filter('l')('Created'), $filter('l')('Completed')],
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  stepSize: 1,
                  suggestedMax: 10
                }
              }
            ]
          },
          responsive: true,
          legend: {
            position: 'left',
            display: true
          },
          title: {
            display: true,
            text: $filter('l')('TaskGrowthChart'),
            fullSize: true,
            padding: 15
          }

        },
        colors: ["#4285f4", "#00c851"]
      };
      ctrl.showPopup = false;
      ctrl.titleInputExcelPopup = '';
      ctrl.contentinputExcelPopup = '';
      ctrl.titleType = '';
      ctrl._searchByDataExcel = "";
      ctrl.dataExcelJsonImported = [];
      ctrl.dataExcelConverted = [];
      ctrl.dataSendToBe = [];
      ctrl.priorityDataExcel = [];
      ctrl.isWatched = false;
      ctrl.listErrorExcelImport = [];


      ctrl._update_object_value = {};

      ctrl._insert_object_value = {};
      ctrl._insert_value = {};
      ctrl._update_value = {};
      ctrl.templateHeader = [
        "title",
        "from_date",
        "to_date",
        "priority",
        "content"
      ];

      ctrl.IncommingDispatchBook_Config = {
        master_key: "incomming_dispatch_book",
        load_details_column: "value",
      };

      //Variables for Workflow insert
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
      ctrl.workflow_plays = [];
      ctrl.notify_detail = null;

      ctrl.WF = [];
      ctrl.WF2 = [];
      ctrl.listUsers = [];
      ctrl.listUsersDefault = [];
      ctrl.departmentDetails = {};
      ctrl.showCount = 5;
      ctrl.showLoadMore = false;
      ctrl._searchByKeyToFilterData = "";
      ctrl._filterWFT = "";
      ctrl._filterStatus = "";

      // Head Task
      ctrl.currentHeadTaskPage = 1;
      ctrl.totalHeadTaskItems = 0;
      ctrl._searchHeadTaskByKeyToFilterData = "";
      ctrl._filterHeadTaskStatus = "";

      // Gantt chart
      ctrl.chart_tab = "overview";

      ctrl.DocumentType_Config = {
        master_key: "document_type",
        load_details_column: "value",
      };

      ctrl.StatusOfSigning_Config = {
        master_key: "status_of_signing",
        load_details_column: "value",
      };
       // Pagination variables
       ctrl.currentPage = 1;
       ctrl.numOfItemPerPage = 10;
    }

    ctrl.searchTasks = function ({ search } = {}) {
      ctrl._searchByDataExcel = search;
      ctrl.updatePaginatedData();
    };

     // Function to update the paginated data
      ctrl.updatePaginatedData = function () {
        const start = (ctrl.currentPage - 1) * ctrl.numOfItemPerPage;
        const end = start + ctrl.numOfItemPerPage;
        let tempArray = ctrl?.dataExcelConverted
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

      // Function to go to the previous page
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

      // Watch for changes in dataExcelConverted to update pagination
      $scope.$watch(
        function () {
          return ctrl.dataExcelConverted;
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

      // Initial call to update paginated data
      ctrl.updatePaginatedData();

    ctrl.handleInvalidTaskType = function (item) {
      item.task_type = undefined;
      ctrl.validateProperties(ctrl.dataExcelConverted);
    };

    //**PREPARE FOR INIT AND LOAD RESOURCE */
    ctrl.toogleCollapseStrategic = function () {
      ctrl.collapseStrategic = !ctrl.collapseStrategic;
    };

    ctrl.toogleCollapseTask = function () {
      ctrl.collapseTask = !ctrl.collapseTask;
    };

    function setValueFilter() {
      var today = new Date();

      if (today.getDate() < 10) {
        ctrl._filterFromDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
          0,
          0,
          0
        );
        ctrl._filterFromDate_Department_Dashboard = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
          0,
          0,
          0
        );
      } else {
        ctrl._filterFromDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
          0,
          0,
          0
        );
        ctrl._filterFromDate_Department_Dashboard = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
          0,
          0,
          0
        );
      }
      ctrl._filterToDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      ctrl._filterToDate_Department_Dashboard = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      ctrl._filterStatus = "All";
      ctrl._filterHeadTaskStatus = "All";
      ctrl._filterTaskStatus = "All";
      ctrl._filterTaskState = "All";
    }

    ctrl.chooseStatusFilter = function (title) {
      ctrl._filterStatus = title;
      ctrl.refreshData();
    };

    ctrl.chooseHeadTaskStatusFilter = function (title) {
      ctrl._filterHeadTaskStatus = title;
      ctrl.refreshHeadTaskData();
    };

    ctrl.chooseHeadTaskStateFilter = function (title) {
      ctrl._filterHeadTaskState = title;
      ctrl.refreshHeadTaskData();
    };

    function generateFilter() {
      var obj = {};
      if (ctrl._searchByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }

      if (ctrl._filterStatus && ctrl._filterStatus !== "All") {
        obj.status = angular.copy(ctrl._filterStatus);
      }

      if (ctrl._filterFromDate) {
        obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
      }

      if (ctrl._filterToDate) {
        obj.to_date = angular.copy(ctrl._filterToDate.getTime());
      }

      if (ctrl._filter_value_employees) {
        obj.employees_filter = angular.copy(ctrl._filter_value_employees);
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

      if (ctrl._filter_value_taskGroup) {
        obj.taskGroup_filter = angular.copy(ctrl._filter_value_taskGroup);
      }

      if (ctrl._filter_value_taskType) {
        obj.taskType_filter = angular.copy(ctrl._filter_value_taskType);
      }

      if (ctrl._filter_value_taskProject) {
        obj.taskProject_filter = angular.copy(ctrl._filter_value_taskProject);
      }

      return obj;
    }

    function generateHeadTaskFilter() {
      var obj = {};
      if (ctrl._searchHeadTaskByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchHeadTaskByKeyToFilterData);
      }

      if (ctrl._filterHeadTaskStatus && ctrl._filterHeadTaskStatus !== "All") {
        obj.status = angular.copy(ctrl._filterHeadTaskStatus);
      }

      if (ctrl._filterHeadTaskState && ctrl._filterHeadTaskState !== "All") {
        obj.state = angular.copy(ctrl._filterHeadTaskState);
      }

      if (ctrl._filterFromDate) {
        obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
      }

      if (ctrl._filterToDate) {
        obj.to_date = angular.copy(ctrl._filterToDate.getTime());
      }

      if (ctrl._filter_value_employees) {
        obj.employees_filter = angular.copy(ctrl._filter_value_employees);
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

      if (ctrl._filter_value_taskGroup) {
        obj.taskGroup_filter = angular.copy(ctrl._filter_value_taskGroup);
      }

      if (ctrl._filter_value_taskType) {
        obj.taskType_filter = angular.copy(ctrl._filter_value_taskType);
      }

      if (ctrl._filter_value_taskProject) {
        obj.taskProject_filter = angular.copy(ctrl._filter_value_taskProject);
      }

      return obj;
    }

    ctrl.loadEmployee = function (params) {
      var dfd = $q.defer();
      task_service.loadEmployee(params.id).then(
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

    ctrl.load_employee_filter = function ({ search, top, offset }) {
      var dfd = $q.defer();
      task_service
        .load_employee_filter(ctrl.currentDepartment.id, search, top, offset)
        .then(
          function (res) {
            dfd.resolve(
              res.data.map((item) =>
                Object.assign(item, { _id: item.username })
              )
            );
          },
          function (e) {
            dfd.reject(false);
            err = undefined;
          }
        );
      return dfd.promise;
    };

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

        if($filter('hasRule')(TASK_RULE.RECEIVE_TASK)){
          statusListFilter.push({
            _id: "WaitingReceive",
            title: "WaitingReceive",
          });
          statusListFilter.push({
            _id: "WaitingLeadDepartmentApproveReceive",
            title: "WaitingLeadDepartmentApproveReceive",
          });
        }

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

    ctrl.load_taskLevel_filter = function (params) {
      return new Promise((resolve, reject) => {
        const taskLevelListFilter = [
          {
            _id: "HeadTask",
            title: "HeadTask",
          },
          {
            _id: "TransferTicket",
            title: "TransferTicket",
          },
          {
            _id: "Task",
            title: "Task",
          },
        ];
        return resolve(taskLevelListFilter);
      });
    };

    ctrl.load_taskGroup_filter = function (params) {
      return new Promise((resolve, reject) => {
        const taskGroupListFilter = [
          {
            _id: "department",
            title: "Department",
          },
          {
            _id: "project",
            title: "Project",
          },
        ];
        return resolve(taskGroupListFilter);
      });
    };

    ctrl.load_taskType_filter = function (params) {
      return new Promise((resolve, reject) => {
        const taskTypeListFilter = [
          { _id: 1, title: "Task" },
          { _id: 2, title: "WorkflowPlay" },
          { _id: 3, title: "Notify" },
          { _id: 4, title: "GeneralAdministrativeProceduresForStudents" },
        ];
        return resolve(taskTypeListFilter);
      });
    };

    ctrl.load_project_by_department = function ({ search, top, offset }) {
      var dfd = $q.defer();
      task_service
        .load_project_by_department(
          ctrl.currentDepartment.id,
          search,
          top,
          offset
        )
        .then(
          function (res) {
            dfd.resolve(res.data);
          },
          function (e) {
            dfd.reject(false);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    /**LOAD , COUNT  FOR TASK */
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
          if(isCreator){
            permission.allow_edit = true;
            permission.allow_remove_task = true;
            permission.allow_assignment = true;
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

    function load_head_task_service() {
      var dfd = $q.defer();
      ctrl.headTasks = [];
      ctrl.checkIdAr = [];
      let _filter = generateHeadTaskFilter();
      task_service
        .load_base_department(
          _filter.search,
          "all",
          _filter.status_filter,
          _filter.state_filter,
          _filter.from_date,
          _filter.to_date,
          ctrl.currentDepartment.id,
          ctrl.numOfItemPerPage,
          ctrl.offset,
          _filter.employees_filter,
          _filter.priority_filter,
          _filter.taskType_filter,
          _filter.label_filter,
          _filter.taskGroup_filter,
          _filter.taskProject_filter,
          ctrl.sortTask.query
        )
        .then(
          function (res) {
            ctrl.headTasks = res.data;

            ctrl.headTasks = ctrl.headTasks.map(task =>({
              ...task,
              ...$filter('getPermissionTask')(task),
            }))

            ctrl.checkImportPermission = $filter('hasRule')('Office.Task.Import_Multiple_Departments');
            dfd.resolve(true);
          },
          function () {
            dfd.reject(false);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.load_head_task = function (val) {
      
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "load_head_task",
        load_head_task_service
      );
    };

    function count_head_task_service() {
      var dfd = $q.defer();
      var _filter = generateHeadTaskFilter();
      task_service
        .count_base_department(
          _filter.search,
          "all",
          _filter.status_filter,
          _filter.state,
          _filter.from_date,
          _filter.to_date,
          ctrl.currentDepartment.id,
          _filter.employees_filter,
          _filter.priority_filter,
          _filter.taskType_filter,
          _filter.label_filter,
          _filter.taskGroup_filter,
          _filter.taskProject_filter
        )
        .then(
          function (res) {
            ctrl.totalHeadTaskItems = res.data.count;
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

    ctrl.count_head_task = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "count_head_task",
        count_head_task_service
      );
    };

    ctrl.refreshData = function () {
      ctrl.load_head_task();
      ctrl.count_head_task();

      statistic_count();
      statistic_growth();
      ctrl.load_ganttChart_data();
    };

    ctrl.refreshHeadTaskData = function () {
      ctrl.load_head_task();
      ctrl.count_head_task();
      statistic_count();
      statistic_growth();
      ctrl.load_ganttChart_data();
    };

    ctrl.searchTasks = function ({ search } = {}) {
      ctrl._searchHeadTaskByKeyToFilterData = search;
      ctrl.refreshHeadTaskData();
  };

    /**GANTT CHART FOR DEPARTMENT TASK */
    ctrl.load_ganttChart_data = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "loadGanttChartData",
        load_ganttChart_data_service
      );
    };

    function load_ganttChart_data_service() {
      var dfd = $q.defer();
      var _filter = generateHeadTaskFilter();
      task_service
        .ganttChart_base_department(
          ctrl.currentDepartment.id,
          _filter.from_date,
          _filter.to_date,
          _filter.employees_filter,
          _filter.priority_filter,
          _filter.status_filter,
          _filter.state_filter,
          _filter.taskType_filter,
          _filter.label_filter,
          _filter.taskGroup_filter,
          _filter.taskProject_filter
        )
        .then(
          function (res) {
            generateGanttChart_Tasks(res.data);
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

    function generateGanttChart_Tasks(tasks) {
      // try {
        var g = new JSGantt.GanttChart(
          document.getElementById("chart_task"),
          "day"
        );
        g.addLang("newlang", {
          format: $filter("l")("Select"),
          comp: $filter("l")("Progress"),
          day: $filter("l")("Day"),
          week: $filter("l")("Week"),
          month: $filter("l")("Month"),
          quarter: $filter("l")("Quarter"),
          year: $filter("l")("Year"),
          completion: $filter("l")("Progress"),
          duration: $filter("l")("Duration"),
          startdate: $filter("l")("StartDate"),
          enddate: $filter("l")("EndDate"),
          moreinfo: $filter("l")("MoreInfo"),
          notes: $filter("l")("Notes"),
          resource: $filter("l")("Resource"),
        });
        g.setShowComp(0);
        g.setShowStartDate(0);
        g.setShowEndDate(0);
        g.setShowRes(0);
        g.setShowDur(0);
        g.setShowTaskInfoRes(0);
        g.setShowTaskInfoDur(0);
        g.setQuarterColWidth(72);
        g.setShowTaskInfoNotes(0);
        g.setUseSort(0);
        g.setOptions({
          // vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,
          vDateTaskDisplayFormat: "  yyyy - mm - dd", // Shown in tool tip box
          vDayMajorDateDisplayFormat: `mm/yyyy ${$filter("l")("Week")} ww`, // Set format to dates in the "Major" header of the "Day" view
          vWeekMinorDateDisplayFormat: "dd/mm", // Set format to display dates in the "Minor" header of the "Week" view
          vLang: "newlang",
          vShowTaskInfoLink: 0, // Show link in tool tip (0/1)
          vShowEndWeekDate: 0, // Show/Hide the date for the last day of the week in header for daily
          vAdditionalHeaders: {
            // Add data columns to your table
            status: {
              title: $filter("l")("Status"),
            },
            priority: {
              title: $filter("l")("Priority"),
            },
          },
          vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
          vFormatArr: ["Day", "Week", "Month", "Quarter"], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers,
          vScrollTo: new Date(),
          vTooltipDelay: 150,
        });

        function getPriorityColor(priority) {
          switch (priority) {
            case 1:
              return "badge-danger";
            case 2:
              return "badge-warning";
            case 3:
              return "badge-primary";
            case 4:
              return "badge-light";
            case 5:
              return "badge-gray-200";
          }
        }

        function getStatusColor(status) {
          switch (status) {
            case "NotSeen":
              return "badge-secondary";
            case "Processing":
              return "badge-warning";
            case "Completed":
              return "badge-success";
            case "Cancelled":
              return "badge-gray-200";
          }
        }

        function getStateProgressBarColor(state) {
          switch (state) {
            case "Overdue":
              return "gtaskred";
            case "GonnaLate":
              return "gtaskyellow";
            case "Open":
              return "gtaskblue";
            default:
              return "gtaskgreen";
          }
        }

        for (var i in tasks) {
          
          g.AddTaskItemObject({
            pID: tasks[i]._id,
            pName: tasks[i].title,
            pStart: genDate(tasks[i].from_date),
            pEnd: `${genDate(tasks[i].to_date)} 23:59`,
            // pPlanStart: "2017-04-01",
            // pPlanEnd: "2017-04-15 12:00",
            pClass: getStateProgressBarColor(tasks[i].state),
            pLink: "",
            pMile: 0,
            pRes: "",
            pComp: tasks[i].progress,
            pGroup: 1,
            pParent: 0,
            pOpen: 1,
            pDepend: "",
            pCaption: "",
            pCost: Math.floor(
              tasks[i].to_date - tasks[i].from_date / (24 * 3600 * 1000)
            ),
            // pNotes: "Some Notes text",
            priority: `<span class='badge ${getPriorityColor(
              tasks[i].priority
            )}'
                    style="width: 65px;"
                    >
                    ${tasks[i].priority?$filter("l")(
              task_service.taskPriorityTransform(tasks[i].priority).value
            ):""}
                    <span/>`,
            status: `<span class='badge ${getStatusColor(tasks[i].status)}'
                    style="width: 65px;"
                    >
                        ${$filter("l")(tasks[i].status)}
                    <span/>`,
          });
          for (var j in tasks[i].childTask) {
            g.AddTaskItemObject({
              pID: tasks[i].childTask[j]._id,
              pName: tasks[i].childTask[j].title,
              pStart: genDate(tasks[i].childTask[j].from_date),
              pEnd: `${genDate(tasks[i].childTask[j].to_date)} 23:59`,
              // pPlanStart: "2017-04-01",
              // pPlanEnd: "2017-04-15 12:00",
              pClass: getStateProgressBarColor(tasks[i].childTask[j].state),
              pLink: "",
              pMile: 0,
              pRes: "",
              pComp: tasks[i].childTask[j].progress,
              pGroup: 0,
              pParent: tasks[i]._id,
              pOpen: 1,
              pDepend: "",
              pCaption: "",
              // pCost: Math.floor(tasks[i].childTask[j].to_date - tasks[i].childTask[j].from_date / (24 * 3600 * 1000)),
              // pNotes: "Some Notes text",
              priority: `<span class='badge ${getPriorityColor(
                tasks[i].childTask[j].priority
              )}'
                                style="width: 65px;"
                                >
                                ${$filter("l")(
                task_service.taskPriorityTransform(
                  tasks[i].childTask[j].priority
                ).value
              )}
                                <span/>`,
              status: `<span class='badge ${getStatusColor(
                tasks[i].childTask[j].status
              )}'
                                style="width: 65px;"
                                >
                                    ${$filter("l")(
                tasks[i].childTask[j].status
              )}
                                <span/>`,
            });
          }
        }

        g.Draw();
      // } catch (error) {
      //   console.log(error);
      // }
    }

    ctrl.changeChartTab = function (tab) {
      ctrl.chart_tab = tab;
    };

    ctrl.isActiveChartTab = function (tab) {
      return ctrl.chart_tab === tab;
    };

    function genDate(timeString) {
      const myDate = new Date(timeString);
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${myDate.getDate().toString().padStart(2, "0")}`;
    }

    /**INIT */
    function init() {
      // const TASK_STATUS = {
      //   NOT_SEEN: "NotSeen",
      //   PROCESSING: "Processing",
      //   PENDING_APPROVAL: "PendingApproval",
      //   WAITING_FOR_APPROVAL: "WaitingForApproval",
      //   CANCELLED: "Cancelled",
      //   COMPLETED: "Completed",
      //   WAITING_RECEIVE: "WaitingReceive"
      // };
      const DefaultStatusLoad = [
        // TASK_STATUS.NOT_SEEN,
        // TASK_STATUS.PROCESSING,
        // TASK_STATUS.PENDING_APPROVAL,
        // TASK_STATUS.WAITING_RECEIVE,
        // TASK_STATUS.WAITING_FOR_APPROVAL,
        // TASK_STATUS.WAITING_LEAD_DEPARTMENT_APPROVE_RECEIVE,
        // TASK_STATUS.COMPLETED,
        // TASK_STATUS.CANCELLED,
      ];
      ctrl.departmentId = $rootScope.detailsInfo.department ? $rootScope.detailsInfo.department.id : '';
      ctrl._filter_value_status = DefaultStatusLoad;
      ctrl._filter_value_status_default = DefaultStatusLoad ;
      if ($location.path().includes("task-department-details")) {
        ctrl.currentDepartment = {
          id: $location.search().id,
          _id: $location.search()._id,
        };
      } else {
        let params = $rootScope.detailsInfo.url.split("?")[1];
        let paramsTerm = params.split("&");
        for (let i in paramsTerm) {
          let splitParamsTerm = paramsTerm[i].split("=");
          switch (splitParamsTerm[0]) {
            case "id":
              ctrl.currentDepartment.id = splitParamsTerm[1];
              break;
            case "_id":
              ctrl.currentDepartment._id = splitParamsTerm[1];
              break;
          }
        }
      }

      setValueFilter();
      ctrl.refreshData();
      loadDispatchArrived();
    }

    init();

    //**STATISTIC */
    function statistic_count() {
      var _filter = generateFilter();
      task_service.statistic_department_count(ctrl.currentDepartment.id, _filter.from_date, _filter.to_date, _filter.employees_filter, _filter.priority_filter, [],
        _filter.taskType_filter, _filter.label_filter, _filter.taskGroup_filter, _filter.taskProject_filter).then(function (res) {
          if (res.data.all > 0) {
            ctrl.statistic_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
          } else {
            ctrl.statistic_count.percent = 100;
          }
          ctrl.statistic_count.data = [];
          ctrl.statistic_count.label[0] = res.data.waiting_receive + " " + $filter('l')('WaitingReceive');
          ctrl.statistic_count.label[1] = res.data.not_seen + " " + $filter('l')('NotSeen');
          ctrl.statistic_count.label[2] = res.data.process + " " + $filter('l')('Processing');
          ctrl.statistic_count.label[3] = res.data.waitting + " " + $filter('l')('WaitingForApproval');
          ctrl.statistic_count.label[4] = res.data.completed + " " + $filter('l')('Completed');
          ctrl.statistic_count.label[5] = res.data.cancelled + " " + $filter('l')('Cancelled');


          ctrl.statistic_count.data.push(res.data.waiting_receive);
          ctrl.statistic_count.data.push(res.data.not_seen);
          ctrl.statistic_count.data.push(res.data.process);
          ctrl.statistic_count.data.push(res.data.waitting);
          ctrl.statistic_count.data.push(res.data.completed);
          ctrl.statistic_count.data.push(res.data.cancelled);
        }, function (err) { console.log(err) });

    }

    function calculateNumberOfDays(from_date, to_date) {
      try {
        var myToDate = {};
        var today = new Date();
        var d = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        );
        if (to_date.getTime() > d.getTime()) {
          myToDate = d;
        } else {
          myToDate = to_date;
        }

        var difference = Math.abs(myToDate - from_date);
        var days = difference / (1000 * 3600 * 24);
        return {
          number_days: Math.round(days),
          myToDate,
        };
      } catch (error) {
        console.log(error);
        return {
          number_days: 1,
          myToDate: new Date(),
        };
      }
    }

    function NumberToStringForDate(input) {
      input = input + "";
      input = parseInt(input);
      if (input > 9) {
        return input + "";
      } else {
        return "0" + input;
      }
    }

    function generateDataForGrowth(data_created, data_completed) {
      try {
        var { number_days, myToDate } = calculateNumberOfDays(
          ctrl._filterFromDate,
          ctrl._filterToDate
        );
        var myFromDate = angular.copy(ctrl._filterFromDate);
        var type = "date";
        var data = [[], []];
        var labels = [];
        switch (type) {
          case "date":
            while (myFromDate.getTime() < myToDate.getTime()) {
              var thisLabel =
                myFromDate.getFullYear() +
                "/" +
                NumberToStringForDate(myFromDate.getMonth() + 1) +
                "/" +
                NumberToStringForDate(myFromDate.getDate());
              labels.push(
                NumberToStringForDate(myFromDate.getDate()) +
                "/" +
                NumberToStringForDate(myFromDate.getMonth() + 1) +
                "/" +
                myFromDate.getFullYear()
              );
              var check = { created: true, completed: true };
              for (var i in data_created) {
                if (data_created[i]._id === thisLabel) {
                  data[0].push(data_created[i].count);
                  check.created = false;
                  break;
                }
              }

              for (var i in data_completed) {
                if (data_completed[i]._id === thisLabel) {
                  data[1].push(data_completed[i].count);
                  check.completed = false;
                  break;
                }
              }

              if (check.created) {
                data[0].push(0);
              }
              if (check.completed) {
                data[1].push(0);
              }

              myFromDate.setDate(myFromDate.getDate() + 1);
            }
            break;
          case "month":
            break;
        }
        return {
          data,
          labels,
        };
      } catch (error) {
        console.log(error);
        return {
          data: [],
          labels: [],
        };
      }
    }

    function statistic_growth() {
      var _filter = generateFilter();
      task_service
        .statistic_department_growth(
          ctrl.currentDepartment.id,
          _filter.from_date,
          _filter.to_date,
          _filter.employees_filter,
          _filter.priority_filter,
          [],
          _filter.taskType_filter,
          _filter.label_filter,
          _filter.taskGroup_filter,
          _filter.taskProject_filter
        )
        .then(
          function (res) {
            var generate = generateDataForGrowth(
              res.data.created,
              res.data.completed
            );
            ctrl.statistic_growth.data = generate.data;
            ctrl.statistic_growth.label = generate.labels;
          },
          function (err) {
            console.log(err);
          }
        );
    }

    //*EXPORT FILE */
    function export_tasks_service() {
      var dfd = $q.defer();
      let _filter = generateFilter();
      task_service
        .export_task_department(
          _filter.search,
          _filter.status_filter,
          _filter.from_date,
          _filter.to_date,
          ctrl.currentDepartment.id
        )
        .then(
          function (res) {
            task_service.exportExcelFile(res.data);
            dfd.resolve(true);
          },
          function () {
            dfd.reject(false);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.export_tasks = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "export",
        export_tasks_service
      );
    };

    function export_tasks_template_service() {
      var dfd = $q.defer(res.data);
      task_service.export_template_add_task(ctrl.currentDepartment.id).then(
        function (res) {
          const blob = new Blob([res.data], {
            type: "application/octet-stream",
          });

          const url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.href = url;
          link.download = "/";
          link.click();
          URL.revokeObjectURL(url);
          dfd.resolve(true);
        },
        function (err) {
          console.log(err);
          dfd.reject(false);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl.export_template_tasks = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "export",
        export_tasks_template_service
      );
    };

    ctrl.import_excel_task = function(){
      if (ctrl.listErrorExcelImport.length) {
        alert("File của bạn có lỗi, xin vui lòng cập nhật trước khi thêm mới.");
        return;
      }
      return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'import_excel_task' , import_excel_task_service)
    }

    function import_excel_task_service(){
      const dfd = $q.defer();
      ctrl.dataSendToBe = JSON.parse(JSON.stringify(ctrl.dataExcelConverted));
      ctrl.dataSendToBe.map((item) => {
        item.department = ctrl.departmentId;
        let dateFromDate = new Date(item.from_date);
        item.from_date = dateFromDate.getTime();
        let dateToDate = new Date(item.to_date);
        item.to_date = dateToDate.getTime();
        item.has_time = item.hours > 0;
        delete item.$$hashKey;
        delete item.searching;
        delete item.check_main_person;
        delete item.check_observer;
        delete item.check_participant;
      });
      task_service
        .insert_task_from_template({ data: ctrl.dataSendToBe })
        .then((res) => {
          let total = ctrl.dataSendToBe.length;
          ctrl.dataExcelConverted = angular.copy([]);
          openPopup(
            "Thành công",
            `${total} công việc đã được thêm thành công vào hệ thống.`,
            "success"
          );
          dfd.resolve(true);
      });
      return dfd.promise;
    }

    /**LOAD FILE */

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

    ctrl.choosePriority = function (val) {
      const priority = task_service.taskPriorityTransform(val.value);
      ctrl._insert_value.priority = priority.key;
      ctrl._filterPriority = priority.value;
      if (
        ctrl._filterPriority === "Critical" ||
        ctrl._filterPriority === "High"
      ) {
        ctrl._insert_value.has_time = true;
        ctrl._isRequiredTime = true;
      } else {
        ctrl._isRequiredTime = false;
      }
    };

    ctrl.chooseTaskType = function (item, task_type) {
      item.task_type = task_type?.key || item?.ordernumber;
      ctrl.validateProperties(ctrl.dataExcelConverted);
  };

    //*INSERT TASK*/
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

    ctrl.loadTaskChild = function (parentID, ids) {
      if (ids && ids.length > 0) {
        for (var i in ctrl.tasks) {
          if (ctrl.tasks[i]._id === parentID) {
            if (!ctrl.tasks[i].childTask) {
              task_service.load_child(ids).then(
                function (res) {
                  for (var i in ctrl.tasks) {
                    if (ctrl.tasks[i]._id === parentID) {
                      ctrl.tasks[i].childTask = res.data;
                      break;
                    }
                  }
                },
                function (err) {
                  console.log(err);
                }
              );
            }
            break;
          }
        }
      }
    };

    ctrl.loadHeadTaskChild = function (parentID, ids) {
      if (ids && ids.length > 0) {
        for (var i in ctrl.headTasks) {
          if (ctrl.headTasks[i]._id === parentID) {
            if (!ctrl.headTasks[i].childTask) {
              task_service.load_child(ids).then(
                function (res) {
                  for (var i in ctrl.headTasks) {
                    if (ctrl.headTasks[i]._id === parentID) {
                      ctrl.headTasks[i].childTask = res.data;
                      break;
                    }
                  }
                },
                function (err) {
                  console.log(err);
                }
              );
            }
            break;
          }
        }
      }
    };

    ctrl.chooseEndDate_insert = function (val) {
      ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(
        true,
        ctrl._insert_value.expired_date,
        val
      );
      ctrl._insert_value.expired_date = val ? val.getTime() : null;
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

    ctrl.chooseHasEndDateRepetitive_insert = function (val) {
      ctrl._insert_value.has_expired = val;
      if (val === false) {
        ctrl._insert_value.has_expired = null;
      }
    };

    ctrl.pickCycle_insert = function (val) {
      ctrl._insert_value.cycle = val;
    };

    ctrl.pickMainperson_insert = function (val) {
      ctrl._insert_value.main_person = [val];
    };

    ctrl.pickParticipant_insert = function (val) {
      ctrl._insert_value.participant = val;
    };

    ctrl.pickObserver_insert = function (val) {
      ctrl._insert_value.observer = val;
    };

    ctrl.pickDispatchArrived_insert = function (item) {
      ctrl._insert_value.dispatch_arrived = item._id;
    };

    ctrl.prepareInsert = function (val) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");

      if (val) {
        ctrl._parentID = val._id;
        ctrl._parentTitle = val.title;
      } else {
        ctrl._parentID = undefined;
        ctrl._parentTitle = undefined;
      }

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
      $("#" + idEditor).summernote("code", "");
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
      ctrl._filterPriority = "";
      ctrl._filterTaskType = "";
      ctrl._insert_value = {
        files: [],
        title: "",
        task_list: [],
        main_person: [""],
        participant: [],
        observer: [$rootScope.logininfo.username],
        from_date: myToday.getTime(),
        to_date: endDay.getTime(),
        has_time: false,
        hours: 0,
        priority: 1,
        level: "Task",
        label: [],
        dispatch_arrived: "",
      };
    };

    ctrl.prepareInsertHeadTask = function (val) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
      if (val) {
        ctrl._parentID = val._id;
        ctrl._parentTitle = val.title;
      } else {
        ctrl._parentID = undefined;
        ctrl._parentTitle = undefined;
      }

      $("#" + idEditor_headTask).summernote({
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
              $("#" + idEditor_headTask).summernote('insertNode', thisImage[0]);
            }, function (err) {

            })
          }
        }
      });
      $("#" + idEditor_headTask).summernote('code', '');
      var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        ctrl._filterPriority = "";
        ctrl._filterTaskType = "Task";
        ctrl._insert_value = {
            files: [],
            title: "",
            task_list: [],
            main_person: [],
            participant: [],
            observer: [$rootScope.logininfo.username],
            from_date: myToday.getTime(),
            to_date: endDay.getTime(),
            has_time: false,
            hours: 0,
            priority: "Medium",
            level: "HeadTask",
            label: [],
            dispatch_arrived: '',

            has_repetitive: false,
            per: 1,
            cycle: "day",
            has_expired: false,
            expired_date: endDay.getTime(),
        };
    }

    ctrl.removeFile_insert = function (item) {
      var temp = [];
      for (var i in ctrl._insert_value.files) {
        if (ctrl._insert_value.files[i].name != item.name) {
          temp.push(ctrl._insert_value.files[i]);
        }
      }
      ctrl._insert_value.files = angular.copy(temp);
    };

    ctrl.removeExcelFile_insert = function (item) {
      var temp = [];
      ctrl._insertExcel.excelFile = angular.copy(temp);
      ctrl.dataExcelConverted = angular.copy(temp);
      ctrl.isWatched = false;
    };

    function loadDispatchArrived(search) {
      var dfd = $q.defer();
      task_service.loadDispatchArrived(search || "").then(
        function (res) {
          ctrl.dispatchArrived = res.data.map((item) => ({
            ...item,
            optionTitle: `[${item.code}] ${item.title}`,
          }));
          dfd.resolve(true);
        },
        function () {
          dfd.reject(false);
        }
      );
      return dfd.promise;
    }

    function insert_service() {
      var dfd = $q.defer();
      let source_id = 2;
      if($rootScope.logininfo.data && $rootScope.logininfo.data.department_details && $rootScope.logininfo.data.department_details.type){
        switch($rootScope.logininfo.data.department_details.type){
          case "department":
            source_id = 2;
            break;
          case "temporary_department":
            source_id = 3;
            break;
          case "board":
            source_id = 4;
            break;
        }
      }

      task_service.insert(
          ctrl._insert_value.estimate,
          ctrl._insert_value.files,
          ctrl._insert_value.title,
          ctrl._insert_value.departmentId,
          $("#" + idEditor_headTask).summernote("code"),
          ctrl._insert_value.task_list,
          ctrl._insert_value.main_person,
          ctrl._insert_value.participant,
          ctrl._insert_value.observer,
          ctrl._insert_value.from_date,
          ctrl._insert_value.to_date,
          ctrl._insert_value.has_time,
          ctrl._insert_value.hours,
          task_service.taskPriorityTransform(ctrl._insert_value.priority).key,
          task_service.taskTypeTransform(ctrl._insert_value.task_type).key,
          undefined,
          ctrl._parentID,
          undefined,
          ctrl.currentDepartment.id,
          ctrl._insert_value.dispatch_arrived,
          ctrl._insert_value.level,
          ctrl._insert_value.label,
          false,
          [],
          {},
          source_id,
          ctrl._insert_value.has_repetitive,
          ctrl._insert_value.per,
          ctrl._insert_value.cycle,
          ctrl._insert_value.has_expired,
          ctrl._insert_value.expired_date
        )
        .then(
          function () {
            if (ctrl._insert_value.level === "HeadTask") {
              $("#modal_Head_Task_Insert").modal("hide");
            } else {
              $("#modal_Task_Insert").modal("hide");
            }
            ctrl.refreshData();
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

    ctrl.insert = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "insert",
        insert_service
      );
    };

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
      ctrl._insert_value.label = value;
    };

    ctrl.pickEmployees = function (value) {
      ctrl._filter_value_employees = value;
      ctrl.refreshData();
    };

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

    ctrl.pickTaskLevel = function (value) {
      ctrl._filter_value_taskLevel = value;
      ctrl.refreshData();
    };

    ctrl.pickLabelFilter = function (value) {
      ctrl._filter_value_label = value;
      ctrl.refreshData();
    };

    ctrl.pickTaskGroup = function (value) {
      ctrl._filter_value_taskGroup = value;
      ctrl.refreshData();
    };

    ctrl.pickTaskTypeFilter = function (value) {
      ctrl._filter_value_taskType = value;
      ctrl.refreshData();
    };

    ctrl.pickProjectFilter = function (value) {
      ctrl._filter_value_taskProject = value;
      ctrl.refreshData();
    };

    ctrl.pickLabel_update = function (value) {
      ctrl._update_value.label = value;
    };

    ctrl.closePopup = function () {
      ctrl.showPopup = false;
    };

    openPopup = (title, content, type) => {
      ctrl.showPopup = true;
      ctrl.titleInputExcelPopup = title;
      ctrl.contentinputExcelPopup = content;
      ctrl.titleType = type;
    };

    ctrl.insertNewTaskExcel = function (file) {
      if (file) {
        var fileType = file.name.split(".").pop().toLowerCase();
        if (fileType == "xlsx" || fileType == "xls") {
          if (file.file.size >= 5 * 1024 * 1024) {
            openPopup(
              "Cảnh báo",
              "Tệp của bạn đang vượt quá dung lượng được cho phép (Tối đa < 5mb)",
              "error"
            );
            return;
          } else {
            ctrl.closePopup();
          }
        } else {
          openPopup(
            "Cảnh báo",
            "Định dạng tệp của bạn không đúng, vui lòng thử lại",
            "error"
          );
          return;
        }
        ctrl.isWatched = false;
        ctrl.dataExcelConverted = [];
        ctrl.loadData(file.file).then(() => {
          const keysData = Object.keys(ctrl.dataExcelJsonImported[0]);
          const isSameArray =
            ctrl.templateHeader.every((element) =>
              keysData.includes(element)
            ) && keysData.length === ctrl.templateHeader.length;
          if (isSameArray) {
            ctrl.validateDataImport();
          } else {
            openPopup(
              "Cảnh báo",
              "Template của bạn không đúng, vui lòng thử lại",
              "error"
            );
          }
        });
        load_employee_office();
      }
      ctrl.showPopup = false;
      $rootScope.$apply();
    };

    /**DELETE TASK */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      task_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Task_Delete").modal("hide");
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
        "Task",
        "delete",
        delete_service
      );
    };

    /**CANCEL TASK */
    ctrl.prepareCancel = function (value) {
      ctrl.cancelTask_reason = '';
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
      ctrl._cancel_value = angular.copy(value);

      $("#" + idEditor_cancel).summernote({
        placeholder: $filter("l")("InputContentHere"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor_update).summernote("insertNode", thisImage[0]);
              },
              function (err) {}
            );
          },
        },
      });
      $("#" + idEditor_cancel).summernote("code", value.content);
    };

    function cancel_service() {
      var dfd = $q.defer();
      task_service
        .cancel(
          ctrl._cancel_value._id,
          ctrl.cancelTask_reason,
        )
        .then(
          function () {
            $("#modal_Task_Cancel").modal("hide");
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

    ctrl.cancel = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "cancel",
        cancel_service
      );
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
      // if (!ctrl._update_value.has_repetitive) {
      //   ctrl._update_value.has_repetitive = {
      //       has_endDate: false,
      //       per: 1,
      //       cycle: "day",
      //       endDate: null
      //   };
      // }

      ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(
        true,
        ctrl._update_value.expired_date,
        val
      );
      ctrl._update_value.expired_date = val ? val.getTime() : null;
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

    ctrl.pickPriorityUpdate = function (val) {
      ctrl._update_value.priority = task_service.taskPriorityTransform(
        val.value
      ).value;
    };

    ctrl.pickPriorityAssess = function (val) {
      ctrl._assess_value.priority = task_service.taskPriorityTransform(
        val.value
      ).value;
    };

    ctrl.pickTaskTypeUpdate = function (val) {
      ctrl._update_value.task_type = task_service.taskTypeTransform(
        val.value
      ).value;
    };

    ctrl.pickDispatchArrived_update = function (val) {
      ctrl._update_value.dispatch_arrived = val;
    };

    ctrl.chooseHasEndDateRepetitive_update = function (val) {
      ctrl._update_value.has_expired = val;
      if (val === false) {
        ctrl._update_value.expired_date = null;
      }
    };

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
            $("#modal_Task_Update").modal("hide");
            $("#modal_Task_Assignment").modal("hide");
            ctrl.refreshData();
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

    /**TASK - PUSH FILE FOR UPDATE MODAL */

    function pushFile_service(file) {
      return function () {
        var dfd = $q.defer();
        task_service.pushFile(file, ctrl._update_value._id).then(
          function (res) {
            ctrl._update_value.attachment.push(res.data);
            ctrl.refreshData();
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
        task_service.removeFile(ctrl._update_value._id, filename).then(
          function (res) {
            var temp = [];
            for (var i in ctrl._update_value.attachment) {
              if (ctrl._update_value.attachment[i].name !== filename) {
                temp.push(ctrl._update_value.attachment[i]);
              }
            }
            ctrl._update_value.attachment = temp;
            ctrl.refreshData();
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
          function (err) {}
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
              // task_type: ctrl.convertTaskType(dataExcel[i].task_type),
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
          ctrl.dataExcelJsonImported = jsonData.map(item => {
            if(item.from_date && !item.to_date){
              item.to_date = $filter('addDaysAndFormat')(item.from_date, 30);
            }
            return item
          });
          ctrl.priorityDataExcel = jsonPriority;
          ctrl.taskTypeDataExcel = jsonTaskType;
          resolve();
        };
        reader.readAsBinaryString(params);
      });
    };


    /* IMPORT TASKS */

    function load_employee_office() {
      var dfd = $q.defer();
      
      task_service.load_employee(ctrl.departmentId).then(
        function (res) {
          ctrl.listEmployeeAPI = res.data;
          dfd.resolve(true);
          currentId = undefined;
        },
        function () {
          dfd.reject(false);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    function loadTemplate_service() {
      var dfd = $q.defer();
      ctrl.loadingTemplate = true;
      task_service
        .load_template(ctrl.currentDepartment.id)
        .then(
          function (res) {
            FileSaver.saveAs(res.data, "Tep-tin-mau-Them-cong-viec.xlsx");
            dfd.resolve(true);
          },
          function (err) {
            dfd.reject(err);
          }
        )
        .finally(() => {
          ctrl.loadingTemplate = false;
        });
      return dfd.promise;
    }

    ctrl.loadTemplate = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "loadTemplate",
        loadTemplate_service
      );
    };

    ctrl.pickMainUser = function (item, emp, e, type) {
      e.preventDefault();
      e.stopPropagation();
      item[type] = item[type] || [];
      if (item[type].indexOf(emp.username) === -1) {
        item[type].push(emp.username);
      } else {
        item[type].splice(item[type].indexOf(emp.username), 1);
      }
      ctrl.validateProperties(ctrl.dataExcelConverted);
    };
    ctrl.stopPropagation = function (e) {
      e.stopPropagation();
    };

    ctrl.reloadPage = function () {
      location.reload();
    };

    // INSERT WORKFLOW FOR UPDATING TASK
    ctrl.handleInsertWFPSuccess = function (data) {
      ctrl._update_value.workflowPlay_id = data[0]._id;
      ctrl.workflow_plays = data;
    };

    ctrl.handle_insert_notify_success = function (data) {
      $(".task-department-feature #notify_insert_modal").modal("hide");
      ctrl._update_value.notify_detail = data.data;
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
          function (err) {}
        );
        return dfd.promise;
      };
    };


    // ctrl.prepareReceive_Task = function ({item}) {
    //   ctrl._assess_value = item;
    //   ctrl._assess_value.note = '';
    //   ctrl._assess_value.priority = $filter('taskPriorityTransform')(ctrl._assess_value.priority).value
    // };

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

    ctrl.receive_task = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "receive_task", receive_task_service);
    }

    function receive_task_service(){
      const dfd = $q.defer();
      task_service.receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
        function(){
          $("#modal_Receive_Task_Assess").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
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

    ctrl.reject_receive_task = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "reject_receive_task", reject_receive_task_service);
    }

    function reject_receive_task_service(){
      const dfd = $q.defer();
      task_service.reject_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
        function(){
          $("#modal_Receive_Task_Assess").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
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

    ctrl.approval_receive_task = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "approval_receive_task", approval_receive_task_service);
    }
  
    function approval_receive_task_service(){
      const dfd = $q.defer();
      task_service.approval_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
        function(){
          $("#modal_Receive_Task_Assessl").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
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
          $("#modal_Receive_Task_Assess").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
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

  },
]);


myApp.registerCtrl('task_personal_controller', ['task_service', 'workflow_play_service', '$q', '$rootScope', '$scope', '$filter', function (task_service, workflow_play_service, $q, $rootScope, $scope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" },
        { name: "Task", action: "load_created" },
        { name: "Task", action: "load_assigned" },
        { name: "Task", action: "count_created" },
        { name: "Task", action: "count_assigned" },
        { name: "Task", action: "insert" },
        { name: "Task", action: "update" },
        { name: "Task", action: "delete" },
        { name: "Task", action: "cancel" },
        { name: "Task", action: "pushFile" },
        { name: "Task", action: "removeFile" },
        { name: "Task", action: "export_created" },
        { name: "Task", action: "export_assigned" },

        { name: "WFP", action: "loadUserAndDepartment" },
        { name: "WFP", action: "loadCustomTemplatePreview" },
        { name: "WFP", action: "insert" },

    ];
    var ctrl = this;
    var idEditor = "insertTask_content";
    var idEditor_update = "updateTask_content";
    var idEditor_cancel = "cancelTask_content";
    /** init variable */
    {
        ctrl._ctrlName = "task_personal_controller";
        ctrl.collapseStrategic = true;
        // ctrl.collapseTask = true;
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

        /** LOAD PRIORITY OPTIONS */
        ctrl.TaskPriority = {
            master_key: "task_priority",
            load_details_column: "value"
        };

        ctrl.TaskType = {
            master_key: "task_type",
            load_details_column: "value"
        };

        ctrl.Departments = [];
        ctrl.tasks_created = [];
        ctrl.tasks_assigned = [];
        // console.log(window.pattern.draw('diamond',"#aa66cc"));
        ctrl.statistic_count_created = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('NotSeen'),
                $filter('l')('Processing'),
                $filter('l')('WaitingForApproval'),
                $filter('l')('Completed'),
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
                }

            },
            colors: ["#aa66cc", "#ffbb33", "#4285f4", "#00c851"]
        };
        ctrl.statistic_count_assigned = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('NotSeen'),
                $filter('l')('Processing'),
                $filter('l')('WaitingForApproval'),
                $filter('l')('Completed'),
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
                }

            },
            colors: ["#aa66cc", "#ffbb33", "#4285f4", "#00c851"]
        };

        ctrl._update_strategic_value = {};
        ctrl._update_object_value = {};
        ctrl._insert_strategic_value = {};
        ctrl._insert_object_value = {};
        ctrl._insert_value = {};
        ctrl._update_value = {};

        ctrl.statistic_growth_created = {
            data: [],
            label: [],
            // override: [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }],

            series: [$filter('l')('Created'), $filter('l')('Completed')],
            options: {
                // scales: {
                //     yAxes: [
                //         {
                //             id: 'y-axis-1',
                //             type: 'linear',
                //             display: true,
                //             position: 'left'
                //         },
                //         {
                //             id: 'y-axis-2',
                //             type: 'linear',
                //             display: true,
                //             position: 'right'
                //         }
                //     ]
                // }
                // ,
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

        ctrl.statistic_growth_assigned = {
            data: [],
            label: [],
            series: [$filter('l')('Assigned'), $filter('l')('Completed')],
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

        ctrl.tab = 'responsible';
        ctrl._notyetInit = true;

        ctrl.currentPage_created = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems_created = 0;
        ctrl.offset_created = 0;

        ctrl.currentPage_assigned = 1;
        ctrl.totalItems_assigned = 0;
        ctrl.offset_assigned = 0;

        ctrl.showChart_created = true;
        ctrl.showChart_assigned = true;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        $scope.forms = {};

        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl.workflow_plays = [];

        ctrl.WF = [];
        ctrl.WF2 = [];
        ctrl.listUsers = [];
        ctrl.listUsersDefault = [];
        ctrl.departmentDetails = {};
        ctrl._notyetInit = true;
        ctrl.showCount = 5;
        ctrl.showLoadMore = false;
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterWFT = "";
        ctrl._filterStatus = "";

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };


        ctrl._urlInsertModal = FrontendDomain + "/modules/office/task/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task/views/update_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/views/cancel_modal.html";
        ctrl._urlQuickReportCreatedTaskModal = FrontendDomain + "/modules/office/task/views/quick_report_created_task_modal.html";
        ctrl._urlQuickReportOwnTaskModal = FrontendDomain + "/modules/office/task/views/quick_report_own_task_modal.html";
    }

    function setValueFilter() {
        var today = new Date();
        if (today.getDate() < 10) {
            ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
            ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        } else {
            ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
            ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        }


        ctrl._filterToDate_created = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus_created = "All";


        ctrl._filterToDate_assigned = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus_assigned = "All";

        ctrl._filterState_created = "All";
        ctrl._filterState_assigned = "All";

    }

    ctrl.chooseStatusFilter_created = function (title) {
        ctrl._filterStatus_created = title;
        ctrl.refreshData_created();
    }

    ctrl.chooseStatusFilter_assigned = function (title) {
        ctrl._filterStatus_assigned = title;
        ctrl.refreshData_assigned();
    }

    ctrl.chooseStateFilter_created = function (title) {
        ctrl._filterState_created = title;
        ctrl.refreshData_created();
    }

    ctrl.chooseStateFilter_assigned = function (title) {
        ctrl._filterState_assigned = title;
        ctrl.refreshData_assigned();
    }

    function generateFilter_created() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData_create !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData_create);
        }

        if (ctrl._filterStatus_created && ctrl._filterStatus_created !== "All") {
            obj.status = angular.copy(ctrl._filterStatus_created);
        }

        if (ctrl._filterState_created && ctrl._filterState_created !== "All") {
            obj.state = angular.copy(ctrl._filterState_created);
        }

        if (ctrl._filterFromDate_created) {
            obj.from_date = angular.copy(ctrl._filterFromDate_created.getTime());
        }

        if (ctrl._filterToDate_created) {
            obj.to_date = angular.copy(ctrl._filterToDate_created.getTime());
        }

        if (ctrl._filter_value_priority_created) {
            obj.priority_filter = angular.copy(ctrl._filter_value_priority_created);
        }

        if (ctrl._filter_value_status_created) {
            obj.status_filter = angular.copy(ctrl._filter_value_status_created);
        }

        if (ctrl._filter_value_state_created) {
            obj.state_filter = angular.copy(ctrl._filter_value_state_created);
        }

        if (ctrl._filter_value_label_created) {
            obj.label_filter = angular.copy(ctrl._filter_value_label_created);
        }

        if (ctrl._filter_value_taskType_created) {
            obj.taskType_filter = angular.copy(ctrl._filter_value_taskType_created);
        }

        if (ctrl._filter_value_taskGroup_created) {
            obj.taskGroup_filter = angular.copy(ctrl._filter_value_taskGroup_created);
        }

        if (ctrl._filter_value_taskProject_created) {
            obj.taskProject_filter = angular.copy(ctrl._filter_value_taskProject_created);
        }
        return obj;
    }

    ctrl.pickPriorityCreated = function (value) {
        ctrl._filter_value_priority_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickStatusCreated = function (value) {
        ctrl._filter_value_status_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickStateCreated = function (value) {
        ctrl._filter_value_state_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickLabelFilterCreated = function (value) {
        ctrl._filter_value_label_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickTaskTypeFilterCreated = function (value) {
        ctrl._filter_value_taskType_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickTaskGroupCreated = function (value) {
        ctrl._filter_value_taskGroup_created = value;
        ctrl.refreshData_created()
    }

    ctrl.pickProjectFilterCreated = function (value) {
        ctrl._filter_value_taskProject_created = value;
        ctrl.refreshData_created()
    }



    ctrl.load_taskGroup_filter = function (params) {
        return new Promise((resolve, reject) => {
            const taskGroupListFilter = [
                {
                    _id: 'department',
                    title: 'Department'
                },
                {
                    _id: 'project',
                    title: 'Project'
                }
            ];
            return resolve(taskGroupListFilter)
        })
    }

    ctrl.load_project_by_personal =  function ({search, top, offset}) {
        var dfd = $q.defer();
        task_service.load_project_by_personal(search, top, offset).then(function (res) {
            dfd.resolve(res.data)
        }, function (e) {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadLabel = function ({search, top, offset, sort}) {
        var dfd = $q.defer();
        task_service.load_label(search, top, offset, sort).then(function (res) {
            dfd.resolve(res.data);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_priority_filter = function (params) {
        return new Promise((resolve, reject) => {
            const priorityList = [
                {_id: 1, title: 'Critical'},
                {_id: 2, title: 'High'},
                {_id: 3, title: 'Medium'},
                {_id: 4, title: 'Low'}
            ];
            return resolve(priorityList)
        })
    }

    ctrl.load_status_filter = function (params) {
        return new Promise((resolve, reject) => {
            const statusListFilter = [
                {
                    _id: 'NotSeen',
                    title: 'NotSeen'
                },
                {
                    _id: 'PendingApproval',
                    title: 'PendingApproval'
                },
                {
                    _id: 'Processing',
                    title: 'Processing'
                },
                {
                    _id: 'Completed',
                    title: 'Completed'
                },
                {
                    _id: 'WaitingForApproval',
                    title: 'WaitingForApproval'
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
                    _id: 'Open',
                    title: 'Open'
                },
                {
                    _id: 'OnSchedule',
                    title: 'OnSchedule'
                },
                {
                    _id: 'GonnaLate',
                    title: 'GonnaLate'
                },
                {
                    _id: 'Overdue',
                    title: 'Overdue'
                },
                {
                    _id: 'Early',
                    title: 'Early'
                },
                {
                    _id: 'Late',
                    title: 'Late'
                },
            ];
            return resolve(stateListFilter)
        })
    }

    ctrl.load_taskType_filter = function (params) {
        return new Promise((resolve, reject) => {
            const taskTypeListFilter = [
                {_id: 1, title: 'Task'},
                {_id: 2, title: 'WorkflowPlay'},
                {_id: 3, title: 'Notify'},
                {_id: 4, title: 'GeneralAdministrativeProceduresForStudents'}
            ];
            return resolve(taskTypeListFilter)
        })
    }

    function generateFilter_assigned() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData_assigned !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData_assigned);
        }

        if (ctrl._filterStatus_assigned && ctrl._filterStatus_assigned !== "All") {
            obj.status = angular.copy(ctrl._filterStatus_assigned);
        }

        if (ctrl._filterState_assigned && ctrl._filterState_assigned !== "All") {
            obj.state = angular.copy(ctrl._filterState_assigned);
        }

        if (ctrl._filterFromDate_assigned) {
            obj.from_date = angular.copy(ctrl._filterFromDate_assigned.getTime());
        }

        if (ctrl._filterToDate_assigned) {
            obj.to_date = angular.copy(ctrl._filterToDate_assigned.getTime());
        }

        if (ctrl._filter_value_priority_assigned) {
            obj.priority_filter = angular.copy(ctrl._filter_value_priority_assigned);
        }

        if (ctrl._filter_value_status_assigned) {
            obj.status_filter = angular.copy(ctrl._filter_value_status_assigned);
        }

        if (ctrl._filter_value_state_assigned) {
            obj.state_filter = angular.copy(ctrl._filter_value_state_assigned);
        }

        if (ctrl._filter_value_label_assigned) {
            obj.label_filter = angular.copy(ctrl._filter_value_label_assigned);
        }

        if (ctrl._filter_value_taskType_assigned) {
            obj.taskType_filter = angular.copy(ctrl._filter_value_taskType_assigned);
        }

        if (ctrl._filter_value_taskGroup_assigned) {
            obj.taskGroup_filter = angular.copy(ctrl._filter_value_taskGroup_assigned);
        }

        if (ctrl._filter_value_taskProject_assigned) {
            obj.taskProject_filter = angular.copy(ctrl._filter_value_taskProject_assigned);
        }
        return obj;
    }

    ctrl.pickPriorityAssigned = function (value) {
        ctrl._filter_value_priority_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickStatusAssigned = function (value) {
        ctrl._filter_value_status_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickStateAssigned = function (value) {
        ctrl._filter_value_state_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickLabelFilterAssigned = function (value) {
        ctrl._filter_value_label_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickTaskTypeFilterAssigned = function (value) {
        ctrl._filter_value_taskType_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickTaskGroupAssigned = function (value) {
        ctrl._filter_value_taskGroup_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.pickProjectFilterAssigned = function (value) {
        ctrl._filter_value_taskProject_assigned = value;
        ctrl.refreshData_assigned()
    }

    ctrl.switchTab = function(val){
        ctrl.tab = val;
        ctrl.refreshData_assigned();
    }

    function load_department_service(department_id, department_grade) {
        var dfd = $q.defer();
        task_service.load_department(department_id, department_grade).then(function (res) {
            ctrl.Departments = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadEmployee = function (params) {
        var dfd = $q.defer();
        task_service.loadEmployee(params.id).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function load_task_created_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_created();
        task_service.load_task("created", _filter.search, _filter.from_date, _filter.to_date, ctrl.numOfItemPerPage, ctrl.offset_created,
            _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter, _filter.taskGroup_filter, _filter.taskProject_filter).then(function (res) {
            ctrl.tasks_created = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_task_created = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "load_created", load_task_created_service);
    }

    function count_task_created_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_created();
        task_service.count_task("created", _filter.search, _filter.from_date, _filter.to_date,
            _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter).then(function (res) {
            ctrl.totalItems_created = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count_task_created = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "count_created", count_task_created_service);
    }


    ctrl.refreshData_created = function () {
        ctrl.load_task_created();
        ctrl.count_task_created();
        statistic_personal_count();
        statistic_personal_growth();
    }


    function load_task_assigned_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_assigned();
        task_service.load_task(ctrl.tab, _filter.search,_filter.from_date, _filter.to_date, ctrl.numOfItemPerPage, ctrl.offset_assigned,
            _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter, _filter.taskGroup_filter, _filter.taskProject_filter).then(function (res) {
            ctrl.tasks_assigned = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_task_assigned = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "load_assigned", load_task_assigned_service);
    }

    function count_task_assigned_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_assigned();
        task_service.count_task(ctrl.tab, _filter.search, _filter.from_date, _filter.to_date,
            _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter, _filter.taskGroup_filter, _filter.taskProject_filter).then(function (res) {
            ctrl.totalItems_assigned = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count_task_assigned = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "count_assigned", count_task_assigned_service);
    }

    ctrl.refreshData = function () {
        ctrl.load_task_assigned();
        ctrl.count_task_assigned();
        ctrl.load_task_created();
        ctrl.count_task_created();
        statistic_personal_count();
        statistic_personal_growth();
    }

    ctrl.refreshData_assigned = function () {
        ctrl.load_task_assigned();
        ctrl.count_task_assigned();
        statistic_personal_count();
        statistic_personal_growth();
    }

    function statistic_personal_count() {
        var _filter_created = generateFilter_created();
        var _filter_assigned = generateFilter_assigned();
        var dfdAr = [];
        dfdAr.push(task_service.statistic_personal_count("created", _filter_created.from_date, _filter_created.to_date));
        dfdAr.push(task_service.statistic_personal_count("mytask", _filter_assigned.from_date, _filter_assigned.to_date));
        $q.all(dfdAr).then(function (res) {
            if (res[0].data.all > 0) {
                ctrl.statistic_count_created.percent = Math.round((res[0].data.completed / res[0].data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_count_created.percent = 100;
            }

            ctrl.statistic_count_created.data = [];

            ctrl.statistic_count_created.label[0] = res[0].data.not_seen + " " + $filter('l')('NotSeen');
            ctrl.statistic_count_created.label[1] = res[0].data.process + " " + $filter('l')('Processing');
            ctrl.statistic_count_created.label[2] = res[0].data.waitting + " " + $filter('l')('WaitingForApproval');
            ctrl.statistic_count_created.label[3] = res[0].data.completed + " " + $filter('l')('Completed');

            ctrl.statistic_count_created.data.push(res[0].data.notstart);
            ctrl.statistic_count_created.data.push(res[0].data.process);
            ctrl.statistic_count_created.data.push(res[0].data.waitting);
            ctrl.statistic_count_created.data.push(res[0].data.completed);
            if (res[1].data.all > 0) {
                ctrl.statistic_count_assigned.percent = Math.round((res[1].data.completed / res[1].data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_count_assigned.percent = 100;
            }

            ctrl.statistic_count_assigned.data = [];
            ctrl.statistic_count_assigned.label[0] = res[1].data.not_seen + " " + $filter('l')('NotSeen');
            ctrl.statistic_count_assigned.label[1] = res[1].data.process + " " + $filter('l')('Processing');
            ctrl.statistic_count_assigned.label[2] = res[1].data.waitting + " " + $filter('l')('WaitingForApproval');
            ctrl.statistic_count_assigned.label[3] = res[1].data.completed + " " + $filter('l')('Completed');

            ctrl.statistic_count_assigned.data.push(res[1].data.not_seen);
            ctrl.statistic_count_assigned.data.push(res[1].data.process);
            ctrl.statistic_count_assigned.data.push(res[1].data.waitting);
            ctrl.statistic_count_assigned.data.push(res[1].data.completed);
        }, function (err) { console.log(err) });

    }

    function calculateNumberOfDays(from_date, to_date) {
        try {
            var myToDate = {};
            var today = new Date();
            var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            if (to_date.getTime() > d.getTime()) {
                myToDate = d;
            } else {
                myToDate = to_date;
            }

            var difference = Math.abs(myToDate - from_date);
            var days = difference / (1000 * 3600 * 24);
            return {
                number_days: Math.round(days),
                myToDate
            }
        } catch (error) {
            console.log(error);
            return {
                number_days: 1,
                myToDate: new Date()
            }
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

    function generateDataForGrowth(data_created, data_completed, table) {
        try {
            var { number_days, myToDate } = table === 'created' ? calculateNumberOfDays(ctrl._filterFromDate_created, ctrl._filterToDate_created) : calculateNumberOfDays(ctrl._filterFromDate_assigned, ctrl._filterToDate_assigned);
            var myFromDate = table === 'created' ? angular.copy(ctrl._filterFromDate_created) : angular.copy(ctrl._filterFromDate_assigned);
            var type = 'date';
            var data = [
                [],
                []
            ];
            var labels = [];
            switch (type) {
                case "date":
                    while (myFromDate.getTime() < myToDate.getTime()) {
                        var thisLabel = myFromDate.getFullYear() + "/" + NumberToStringForDate((myFromDate.getMonth() + 1)) + "/" + NumberToStringForDate(myFromDate.getDate());
                        labels.push(NumberToStringForDate(myFromDate.getDate()) + "/" + NumberToStringForDate((myFromDate.getMonth() + 1)) + "/" + myFromDate.getFullYear());
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
                data, labels
            }
        } catch (error) {
            console.log(error);
            return {
                data: [], labels: []
            };
        }

    }

    function statistic_personal_growth() {
        var _filter_created = generateFilter_created();
        var _filter_assigned = generateFilter_assigned();
        var dfdAr = [];
        dfdAr.push(task_service.statistic_personal_growth("created", _filter_created.from_date, _filter_created.to_date));
        dfdAr.push(task_service.statistic_personal_growth("mytask", _filter_assigned.from_date, _filter_assigned.to_date));
        $q.all(dfdAr).then(function (res) {

            var generate_created = generateDataForGrowth(res[0].data.created, res[0].data.completed, 'created');
            var generate_assigned = generateDataForGrowth(res[1].data.created, res[1].data.completed, 'assigned');

            ctrl.statistic_growth_created.data = generate_created.data;
            ctrl.statistic_growth_created.label = generate_created.labels;
            ctrl.statistic_growth_assigned.data = generate_assigned.data;
            ctrl.statistic_growth_assigned.label = generate_assigned.labels;

        }, function (err) { console.log(err) });

    }

    function init() {
        setValueFilter();
        load_department_service(undefined, 0);
        ctrl._filter_value_status_created = ["NotSeen", "Processing"];
        ctrl._filter_value_status_assigned = ["NotSeen", "Processing"];

        var dfdAr = [
            ctrl.load_task_assigned(),
            ctrl.count_task_assigned(),
            ctrl.load_task_created(),
            ctrl.count_task_created(),
            statistic_personal_count(),
            statistic_personal_growth(),
            statistic_tasks_person(),
        ];
        dfdAr.push();
        $q.all(dfdAr).then(function () {
            ctrl._notyetInit = false;
        });

    }

    init();

    //*EXPORT FILE */
    function export_tasks_created_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_created();
        const tab = "created";
        task_service.export_task_personal(tab, _filter.search, _filter.status, _filter.from_date, _filter.to_date).then(function (res) {
            task_service.exportExcelFile(res.data, tab);
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function export_tasks_assigned_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_assigned();
        const tab = "assigned";
        task_service.export_task_personal(tab, _filter.search, _filter.status, _filter.from_date, _filter.to_date).then(function (res) {
            task_service.exportExcelFile(res.data, tab);
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }



    ctrl.export_tasks_created = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "export_created", export_tasks_created_service);
    }

    ctrl.export_tasks_assigned = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "export_assigned", export_tasks_assigned_service);
    }

    /**LOAD FILE */

    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            task_service.loadFileInfo(params.id, params.name).then(function (res) {
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

    ctrl.loadfileWFP = function (params) {
        return function () {
            var dfd = $q.defer();
            workflow_play_service.loadFileInfo(params.id, params.name).then(function (res) {
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

    ctrl.reloadModalBox = function(params) {
        $("body").addClass("modal-open");
    }

    ctrl.choosePriority = function(val){
        const priority = task_service.taskPriorityTransform(val.value);
        ctrl._insert_value.priority = priority.key;
        ctrl._filterPriority = priority.value;
        if(ctrl._filterPriority === 'Critical' || ctrl._filterPriority === 'High'){
            ctrl._insert_value.has_time = true;
            ctrl._isRequiredTime = true
        } else {
            ctrl._isRequiredTime = false
        }
    }

    ctrl.chooseTaskType = function (val) {
        const taskType = task_service.taskTypeTransform(val.value);
        ctrl._insert_value.task_type = taskType.key;
        ctrl._filterTaskType = taskType.value;
    }

    //*INSERT TASK*/

    ctrl.addCheckList_insert = function () {
        var d = new Date();
        ctrl._insert_value.task_list.push({
            title: "",
            status: false,
            id: d.getTime().toString()
        });
        ctrl._insert_value.focusChecklist = d.getTime().toString();
    }

    ctrl.removeCheckList_insert = function (id) {
        ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(e => e.id !== id);
    }

    ctrl.loadChild = function (parentID, ids) {
        if (ids && ids.length > 0) {
            for (var i in ctrl.tasks) {
                if (ctrl.tasks[i]._id === parentID) {
                    if (!ctrl.tasks[i].childTask) {
                        task_service.load_child(ids).then(function (res) {
                            for (var i in ctrl.tasks) {
                                if (ctrl.tasks[i]._id === parentID) {
                                    ctrl.tasks[i].childTask = res.data;
                                    break;
                                }
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    break;
                }
            }

        }

    }

    ctrl.chooseEndDate_insert = function(val) {
        ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(true, ctrl._insert_value.repetitive.endDate, val);
        ctrl._insert_value.repetitive.endDate = val ? val.getTime() : null;
    }

    ctrl.chooseFromDate_insert = function (val) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date);
        ctrl._insert_value.from_date = val ? val.getTime() : undefined;;
    }

    ctrl.chooseToDate_insert = function (val) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(true, ctrl._insert_value.from_date, val);
        ctrl._insert_value.to_date = val ? val.getTime() : undefined;;
    }

    ctrl.chooseHasEndDateRepetitive_insert = function (val) {
        ctrl._insert_value.repetitive.has_endDate = val;
        if(val === false) {
            ctrl._insert_value.repetitive.endDate = null
        }
    }

    ctrl.pickMainperson_insert = function (val) {
        var dfd = $q.defer();

        ctrl._insert_value.main_person = [val];
        dfd.resolve(true);
        return dfd.promise;

    }
    ctrl.pickParticipant_insert = function (val) {
        var dfd = $q.defer();
        ctrl._insert_value.participant = val;
        dfd.resolve(true);
        return dfd.promise;
    }
    ctrl.pickObserver_insert = function (val) {
        var dfd = $q.defer();
        ctrl._insert_value.observer = val;
        dfd.resolve(true);
        return dfd.promise;
    }

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
        $("#" + idEditor).summernote('code', '');
        var today = new Date();

        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        ctrl._filterPriority = "";
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
            priority: 1,
            level: 'Task',
            has_repetitive: false,
            repetitive: {
                has_endDate: false,
                per: 1,
                cycle: "day", // allow: day, week, month, year
                endDate: null // null or "" khi ko hết hạn
            },
            label: []
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
    }

    function insert_service() {
        var dfd = $q.defer();
        task_service.insert(
            ctrl._insert_value.files,
            ctrl._insert_value.title,
            ctrl._insert_value.department_id,
            $("#" + idEditor).summernote('code'),
            ctrl._insert_value.task_list,
            ctrl._insert_value.main_person,
            ctrl._insert_value.participant,
            ctrl._insert_value.observer,
            ctrl._insert_value.from_date,
            ctrl._insert_value.to_date,
            ctrl._insert_value.has_time,
            ctrl._insert_value.hours,
            ctrl._insert_value.priority,
            ctrl._insert_value.task_type,
            undefined,
            ctrl._parentID,
            undefined,
            null,
            undefined,
            ctrl._insert_value.level,
            ctrl._insert_value.label
        ).then(function () {
            $("#modal_Task_Insert").modal("hide");
            ctrl.load_task_assigned();
            ctrl.count_task_assigned();
            ctrl.load_task_created();
            ctrl.count_task_created();
            statistic_personal_count();
            statistic_personal_growth();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insert", insert_service);
    }

    ctrl.insertLabel = function (item) {
        var dfd = $q.defer();
        task_service.insert_label(item).then(function (res) {
            dfd.resolve(res.data);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadLabel = function ({search, top, offset, sort}) {
        var dfd = $q.defer();
        task_service.load_label(search, top, offset, sort).then(function (res) {
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
        task_service.loadLabel_details(ids).then(function (res) {
            dfd.resolve(res.data);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.pickLabel = function (value) {
        ctrl._insert_value.label = value;
    }

    ctrl.pickLabel_update = function (value) {
        ctrl._update_value.label = value;
    }

    /**DELETE TASK */
    ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "delete");
        ctrl._delete_value = angular.copy(value);
    }

    function delete_service() {
        var dfd = $q.defer();
        task_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_Task_Delete").modal("hide");
            dfd.resolve(true);
            ctrl.load_task_assigned();
            ctrl.count_task_assigned();
            ctrl.load_task_created();
            ctrl.count_task_created();
            statistic_personal_count();
            statistic_personal_growth();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "delete", delete_service);
    }

    /**CANCEL TASK */
    ctrl.prepareCancel = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
        ctrl._cancel_value = angular.copy(value);

        $("#" + idEditor_cancel).summernote({
            placeholder: $filter("l")("InputContentHere"),
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    task_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor_update).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor_cancel).summernote('code', value.content);
    }

    function cancel_service() {
        var dfd = $q.defer();
        task_service.cancel(ctrl._cancel_value._id, $("#" + idEditor_cancel).summernote('code')).then(function () {
            $("#modal_Task_Cancel").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.cancel = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "cancel", cancel_service);
    }

    /**UPDATE TASK */
    ctrl.addCheckList_update = function () {
        var d = new Date();
        ctrl._update_value.task_list.push({
            title: "",
            status: false,
            id: d.getTime().toString()
        });
        ctrl._update_value.focusChecklist = d.getTime().toString();
    }

    ctrl.removeCheckList_update = function (id) {
        ctrl._update_value.task_list = ctrl._update_value.task_list.filter(e => e.id !== id);
    }

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
    }

    ctrl.chooseEndDate_update = function(val) {
        if (!ctrl._update_value.repetitive) {
            ctrl._update_value.repetitive = {
                has_endDate: false,
                per: 1,
                cycle: "day",
                endDate: null
            };
          }

        ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(
            true, 
            ctrl._update_value.repetitive.endDate, 
            val);
        ctrl._update_value.repetitive.endDate = val ? val.getTime() : null;
    }

    ctrl.chooseFromDate_update = function (val) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(false, val, ctrl._update_value.to_date);
        ctrl._update_value.from_date = val ? val.getTime() : undefined;;
    }

    ctrl.chooseToDate_update = function (val) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._update_value.from_date, val);
        ctrl._update_value.to_date = val ? val.getTime() : undefined;;
    }

    ctrl.chooseStatus_update = function (val) {
        ctrl._update_value.status = angular.copy(val.key);
    }

    ctrl.pickMainperson_update = function (val) {
        ctrl._update_value.main_person = [val];
    }
    ctrl.pickParticipant_update = function (val) {
        ctrl._update_value.participant = val;
    }
    ctrl.pickObserver_update = function (val) {
        ctrl._update_value.observer = val;
    }

    ctrl.pickPriorityUpdate = function (val) {
        ctrl._update_value.priority = task_service.taskPriorityTransform(val.value).value;
    }

    ctrl.pickTaskTypeUpdate = function (val) {
        ctrl._update_value.task_type = task_service.taskTypeTransform(val.value).value;
    }

    ctrl.chooseHasEndDateRepetitive_update = function (val) {
        ctrl._update_value.repetitive.has_endDate = val;
        if(val === false) {
            ctrl._update_value.repetitive.endDate = null
        }
    }

    ctrl.prepareUpdate = function (value) {
        ctrl.workflow_plays = [];
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");
        if(value.workflowPlay) {
            ctrl.workflow_plays = [value.workflowPlay];
        }
        if(!value.repetitive){
            value.repetitive = {
                has_endDate: false,
                per: 1,
                cycle: "day", // allow: days, weeks, months, years
                endDate: null // null or "" khi ko hết hạn
            }
        }
        ctrl._update_value = angular.copy(value);
        ctrl._update_value.priority = task_service.taskPriorityTransform(ctrl._update_value.priority).value;
        ctrl._update_value.task_type = (task_service.taskTypeTransform(ctrl._update_value.task_type) || {}).value;
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
        task_service.update(
            ctrl._update_value._id,
            ctrl._update_value.title,
            $("#" + idEditor_update).summernote('code'),
            ctrl._update_value.task_list,
            ctrl._update_value.main_person,
            ctrl._update_value.participant,
            ctrl._update_value.observer,
            ctrl._update_value.from_date,
            ctrl._update_value.to_date,
            ctrl._update_value.status,
            ctrl._update_value.has_time,
            task_service.taskPriorityTransform(ctrl._update_value.priority).key,
            (task_service.taskTypeTransform(ctrl._update_value.task_type) || {}).key,
            (ctrl._update_value.workflowPlay_id || ''),
            ctrl._update_value.label,
        ).then(function () {
            $("#modal_Task_Update").modal("hide");
            ctrl.load_task_assigned();
            ctrl.count_task_assigned();
            ctrl.load_task_created();
            ctrl.count_task_created();
            statistic_personal_count();
            statistic_personal_growth();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "update", update_service);
    }

    /**TASK - PUSH FILE FOR UPDATE MODAL */

    function pushFile_service(file) {
        return function () {
            var dfd = $q.defer();
            task_service.pushFile(file, ctrl._update_value._id).then(function (res) {
                ctrl._update_value.attachment.push(res.data);
                ctrl.refreshData();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushFile_update = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "pushFile", pushFile_service(file));
    }

    /**TASK - REMOVE FILE FOR UPDATE MODAL */
    function removeFile_service(filename) {
        return function () {
            var dfd = $q.defer();
            task_service.removeFile(ctrl._update_value._id, filename).then(function (res) {
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
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.removeFile_update = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "removeFile", removeFile_service(item.name));
    }

    // INSERT WORKFLOW FOR UPDATING TASK
    ctrl.handleInsertWFPSuccess = function (data) {
        ctrl._update_value.workflowPlay_id = data[0]._id;
        ctrl.workflow_plays = data;
    };

    // PERSONAL STATISTICSS
    function statistic_tasks_person() {
        var dfd = $q.defer();
        ctrl.statistic_tasks_person = [];
            task_service.statistic_tasks_person().then(
                function (res) {
                    ctrl.statistic_tasks_person = res.data.result;
                },
                function (err) {
                    console.log(err);
                },
            );
        
        return dfd.promise;
    }
}]);

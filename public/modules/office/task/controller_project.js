myApp.registerCtrl('task_project_controller', ['task_service', 'workflow_play_service', 'notify_service', '$q', '$rootScope', '$filter', '$location', function (task_service, workflow_play_service, notify_service, $q, $rootScope, $filter, $location) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" },
        { name: "Task", action: "load" },
        { name: "Task", action: "count" },
        { name: "Task", action: "insert" },
        { name: "Task", action: "update" },
        { name: "Task", action: "delete" },
        { name: "Task", action: "cancel" },
        { name: "Task", action: "pushFile" },
        { name: "Task", action: "removeFile" },
        { name: "Task", action: "load_head_task" },
        { name: "Task", action: "count_head_task" },

        { name: "Task", action: "loadProject" },
        { name: "Task", action: "countProject" },
        { name: "Task", action: "insertProject" },
        { name: "Task", action: "updateProject" },
        { name: "Task", action: "deleteProject" },
        { name: "Task", action: "startProject" },
        { name: "Task", action: "closeProject" },


        { name: "Task", action: "loadWiki" },
        { name: "Task", action: "countWiki" },
        { name: "Task", action: "insertWiki" },
        { name: "Task", action: "updateWiki" },
        { name: "Task", action: "deleteWiki" },
        { name: "Task", action: "export" },
        { name: "Task", action: "loadConfigTable" },
        { name: "Task", action: "insertConfigTable" },
        { name: "Task", action: "updateConfigTable" },

        { name: "Task", action: "loadGanttChartData" },

        { name: "WFP", action: "loadUserAndDepartment" },
        { name: "WFP", action: "loadCustomTemplatePreview" },
        { name: "WFP", action: "insert" },
    ];
    var ctrl = this;
    var idEditor = "insertTask_content";
    var idEditor_headTask = "insertHeadTask_content";
    var idEditor_update = "updateTask_content";
    var idEditor_wiki = "insertWiki_content";
    var idEditor_update_wiki = "updateWiki_content";
    var idEditor_cancel = "cancelTask_content";
    /** init variable */
    {
        ctrl._ctrlName = "task_project_controller";
  
        ctrl.collapseTask = true;
        ctrl.collapseWiki = true;
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

        /** LOAD PRIORITY OPTIONS */
        ctrl.TaskPriority = {
            master_key: "task_priority",
            load_details_column: "value"
        };

        ctrl.TaskType = {
            master_key: "task_type",
            load_details_column: "value"
        };

        ctrl._notyetInit = true;

        ctrl.Departments = [];
        ctrl.Projects = [];
        ctrl.strategics = [];
        ctrl.wikis = [];
        ctrl.currentProject = {};
        ctrl.tab = "wfp";

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.currentHeadTaskPage = 1;
        ctrl.totalItems = 0;
        ctrl.totalHeadTaskItems = 0;
        ctrl.offset = 0;



        ctrl.currentPage_Wiki = 1;
        ctrl.numOfItemPerPage_Wiki = 30;
        ctrl.totalItems_Wiki = 0;
        ctrl.offset_Wiki = 0;

        ctrl.currentPage_Project = 1;
        ctrl.numOfItemPerPage_Project = 100;
        ctrl.totalItems_Project = 0;
        ctrl.offset_Project = 0;

        ctrl._searchHeadTaskByKeyToFilterData = '';
        ctrl._filterHeadTaskStatus = '';

        ctrl.sort_Project = { name: "_id", value: false, query: { _id: -1, priority: -1 } };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInsertProjectModal = FrontendDomain + "/modules/office/task/views/insert_project_modal.html";
        ctrl._urlUpdateProjectModal = FrontendDomain + "/modules/office/task/views/update_project_modal.html";
        ctrl._urlDeleteProjectModal = FrontendDomain + "/modules/office/task/views/delete_project_modal.html";
        ctrl._urlStartProjectModal = FrontendDomain + "/modules/office/task/views/start_project_modal.html";
        ctrl._urlCloseProjectModal = FrontendDomain + "/modules/office/task/views/close_project_modal.html";






        
        ctrl._urlInsertHeadTaskModal = FrontendDomain + "/modules/office/task/views/insert_head_task_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task/views/update_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/views/cancel_modal.html";

        ctrl._urlInsertWikiModal = FrontendDomain + "/modules/office/task/views/insert_wiki_modal.html";
        ctrl._urlUpdateWikiModal = FrontendDomain + "/modules/office/task/views/update_wiki_modal.html";
        ctrl._urlDeleteWikiModal = FrontendDomain + "/modules/office/task/views/delete_wiki_modal.html";

        ctrl.statistic_count = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('NotSeen'),
                $filter('l')('Processing'),
                $filter('l')('PendingApproval'),
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
                }

            },
            colors: ["#aa66cc", "#ffbb33", "#ff3547","#4285f4", "#00c851", "#869fac"]
        };

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

        ctrl.listParticipant = [];
        ctrl._filterParticipant = "All";
        ctrl.listMainPerson = [];
        ctrl._filterObserver = "All";
        ctrl.listObserver = [];
        ctrl._filterMainPerson = "All";
        ctrl._updateConfigTable = [];
        ctrl._useConfigTable = [];
        ctrl._configTable = [];

        // variables for WFP
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
        ctrl._notyetInit = true;
        ctrl.showCount = 5;
        ctrl.showLoadMore = false;
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterWFT = "";
        ctrl._filterStatus = "";
        ctrl._filterTaskState = "";
        ctrl._filterHeadTaskState = "";

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };

        ctrl.IncommingDispatchBook_Config = {
            master_key: "incomming_dispatch_book",
            load_details_column: "value"
        };

        ctrl._update_strategic_value = {};
        ctrl._update_object_value = {};
        ctrl._insert_strategic_value = {};
        ctrl._insert_object_value = {};
        ctrl._insert_value = {};
        ctrl._insert_project_value = {};
        ctrl._update_project_value = {};
        ctrl._update_value = {};

        ctrl.chart_tab = 'overview';
    }




    //**PREPARE FOR INIT AND LOAD RESOURCE */



    ctrl.toogleCollapseTask = function () {
        ctrl.collapseTask = !ctrl.collapseTask;
    }

    ctrl.toogleCollapseWiki = function () {
        ctrl.collapseWiki = !ctrl.collapseWiki;
    }


    function setValueFilter() {
        var today = new Date();
        if (today.getDate() < 10) {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        } else {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        }

        ctrl._filterToDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus = "All";
        ctrl._filterHeadTaskStatus = "All";
        ctrl._filterTaskState = "All";
        ctrl._filterHeadTaskState = "All";
    }



    function setValueFilter_Wiki() {

    }


    ctrl.chooseStatusFilter = function (title) {
        ctrl._filterStatus = title;
        ctrl.refreshData();
    }

    ctrl.chooseHeadTaskStatusFilter = function (title) {
        ctrl._filterHeadTaskStatus = title;
        ctrl.refreshHeadTaskData();
    }

    ctrl.chooseParticipantFilter = function (title) {
        ctrl._filterParticipant = title;
        ctrl.refreshData();
    }

    ctrl.chooseMainPersonFilter = function (title) {
        ctrl._filterMainPerson = title;
        ctrl.refreshData();
    }

    ctrl.chooseObserverFilter = function (title) {
        ctrl._filterObserver = title;
        ctrl.refreshData();
    }

    ctrl.chooseTaskStateFilter = function (title) {
        ctrl._filterTaskState = title;
        ctrl.refreshData();
    }

    ctrl.chooseHeadTaskStateFilter = function (title) {
        ctrl._filterHeadTaskState = title;
        ctrl.refreshHeadTaskData();
    }

    ctrl.updateRule = function (val) {
        const index = ctrl._updateConfigTable.findIndex((item) => item.value === val.value);

        if (index !== -1) {
            ctrl._updateConfigTable[index].model = val.model;
        } else {
            // Nếu không tồn tại thì push vào mảng
            ctrl._updateConfigTable.push(val);
        }
    }

    ctrl.isTableEnabled = function (value) {
        if (ctrl._useConfigTable && ctrl._useConfigTable.length > 0) {
            var item = ctrl._useConfigTable.find((item) => item.value === value);
            if (item) {
                return item.model;
            }
            return false;
        }
        return false;
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterStatus && ctrl._filterStatus !== "All") {
            obj.status = angular.copy(ctrl._filterStatus);
        }

        if (ctrl._filterTaskState && ctrl._filterTaskState !== "All") {
            obj.state = angular.copy(ctrl._filterTaskState);
        }

        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
        }

        if (ctrl._filterToDate) {
            obj.to_date = angular.copy(ctrl._filterToDate.getTime());
        }

        if (ctrl._filterParticipant && ctrl._filterParticipant !== "All") {
            obj.participant = angular.copy(ctrl._filterParticipant);
        }

        if (ctrl._filterMainPerson && ctrl._filterMainPerson !== "All") {
            obj.main_person = angular.copy(ctrl._filterMainPerson);
        }

        if (ctrl._filterObserver && ctrl._filterObserver !== "All") {
            obj.observer = angular.copy(ctrl._filterObserver);
        }

        if (ctrl._filter_value_participant) {
            obj.participant_filter = angular.copy(ctrl._filter_value_participant);
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

        if (ctrl._filter_value_taskType) {
            obj.taskType_filter = angular.copy(ctrl._filter_value_taskType);
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

        if (ctrl._filter_value_participant) {
            obj.participant_filter = angular.copy(ctrl._filter_value_participant);
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

        if (ctrl._filter_value_taskType) {
            obj.taskType_filter = angular.copy(ctrl._filter_value_taskType);
        }
        return obj;
    }

  

    function generateFilter_Wiki() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData_Wiki !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData_Wiki);
        }
        return obj;
    }

    function generateFilter_Project() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData_Project !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData_Project);
        }
        return obj;
    }

    function load_department_service(department_id, department_grade) {
        var dfd = $q.defer();
        task_service.load_department(department_id, department_grade).then(function (res) {
            ctrl.Departments = res.data;
            if (ctrl.Departments[0]) {
                ctrl.chooseDepartment(ctrl.Departments[0]);
            }

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

    ctrl.loadEmployee_Project = function (params) {
        var dfd = $q.defer();
        task_service.loadEmployee_Project(params.id).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }


    //**LOAD, COUNT FOR TASK */

    function load_head_task_service() {
        var dfd = $q.defer();
        ctrl.headTasks = [];
        ctrl.checkIdAr = [];
        let _filter = generateHeadTaskFilter();
        task_service.load_base_project(_filter.search, 'all',  _filter.from_date, _filter.to_date, ctrl.currentProject._id, ctrl.numOfItemPerPage, ctrl.offset,
            _filter.participant_filter, _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter
        ).then(function (res) {
            ctrl.headTasks = res.data.filter(task => task.project && task.project === ctrl.currentProject._id);
            dfd.resolve(true);
        }, function (e) {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_head_task = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "load_head_task", load_head_task_service);
    }



    function count_head_task_service() {
        var dfd = $q.defer();
        var _filter = generateHeadTaskFilter();
        task_service.count_base_project(_filter.search, 'all', _filter.from_date, _filter.to_date, ctrl.currentProject._id,
            _filter.participant_filter, _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter).then(function (res) {
            ctrl.totalHeadTaskItems = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count_head_task = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "count_head_task", count_head_task_service);
    }

    ctrl.refreshData = function () {
        if (ctrl.currentProject && ctrl.currentProject._id) {
          
           
            ctrl.count_head_task();
            ctrl.load_head_task();
            ctrl.loadConfigTable();
            ctrl.load_ganttChart_data();
            statistic_count();
            statistic_growth();
        }
    }

    ctrl.refreshHeadTaskData = function () {
        ctrl.load_head_task();
        ctrl.count_head_task();
        statistic_count();
        statistic_growth();
    }

    ctrl.load_ganttChart_data = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadGanttChartData", load_ganttChart_data_service);
    }

    function load_ganttChart_data_service() {
        var dfd = $q.defer();
        var _filter = generateHeadTaskFilter();
        task_service.ganttChart_base_project(ctrl.currentProject._id, _filter.from_date, _filter.to_date, _filter.participant_filter, _filter.priority_filter, _filter.status_filter, _filter.state_filter, _filter.taskType_filter, _filter.label_filter).then(function (res) {
            generateGanttChart_Tasks(res.data);
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function generateGanttChart_Tasks(tasks) {
        try {
            var g = new JSGantt.GanttChart(document.getElementById('chart_task'), 'day');
            g.addLang('newlang', {
                'format': $filter('l')('Select'),
                'comp': $filter('l')('Progress'),
                'day': $filter('l')('Day'),
                'week': $filter('l')('Week'),
                'month': $filter('l')('Month'),
                'quarter': $filter('l')('Quarter'),
                'year': $filter('l')('Year'),
                'completion': $filter('l')('Progress'),
                'duration': $filter('l')('Duration'),
                'startdate': $filter('l')('StartDate'),
                'enddate': $filter('l')('EndDate'),
                'moreinfo': $filter('l')('MoreInfo'),
                'notes': $filter('l')('Notes'),
                'resource': $filter('l')('Resource')
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
                vDateTaskDisplayFormat: '  yyyy - mm - dd', // Shown in tool tip box
                vDayMajorDateDisplayFormat: `mm/yyyy ${$filter('l')('Week')} ww`,// Set format to dates in the "Major" header of the "Day" view
                vWeekMinorDateDisplayFormat: 'dd/mm', // Set format to display dates in the "Minor" header of the "Week" view
                vLang: 'newlang',
                vShowTaskInfoLink: 0, // Show link in tool tip (0/1)
                vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily
                vAdditionalHeaders: { // Add data columns to your table
                    status: {
                        title: $filter('l')('Status')
                    },
                    priority: {
                        title: $filter('l')('Priority')
                    }
                },
                vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
                vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers,
                vScrollTo: new Date(),
                vTooltipDelay: 150,
            });

            function getPriorityColor(priority) {
                switch (priority) {
                    case 1:
                        return 'badge-danger';
                    case 2:
                        return 'badge-warning';
                    case 3:
                        return 'badge-primary';
                    case 4:
                        return 'badge-light';
                    case 5:
                        return 'badge-gray-200';
                }
            }

            function getStatusColor(status) {
                switch (status) {
                    case 'NotSeen':
                        return 'badge-secondary';
                    case 'Processing':
                        return 'badge-warning';
                    case 'PendingApproval':
                        return 'badge-danger';
                    case 'Completed':
                        return 'badge-success';
                    case 'Cancelled':
                        return 'badge-gray-200';
                }
            }

            function getStateProgressBarColor(state) {
                switch (state) {
                    case 'Overdue':
                        return 'gtaskred';
                    case 'GonnaLate':
                        return 'gtaskyellow';
                    case 'Open':
                        return 'gtaskblue';
                    default:
                        return 'gtaskgreen';

                };
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
                    pCost: Math.floor(tasks[i].to_date - tasks[i].from_date / (24 * 3600 * 1000)),
                    // pNotes: "Some Notes text",
                    priority: `<span class='badge ${getPriorityColor(tasks[i].priority)}' 
                    style="width: 65px;"
                    >
                    ${$filter('l')(task_service.taskPriorityTransform(tasks[i].priority).value)}
                    <span/>`,
                    status: `<span class='badge ${getStatusColor(tasks[i].status)}' 
                    style="width: 65px;"
                    >
                        ${$filter('l')(tasks[i].status)}
                    <span/>`
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
                        priority: `<span class='badge ${getPriorityColor(tasks[i].childTask[j].priority)}' 
                                style="width: 65px;"
                                >
                                ${$filter('l')(task_service.taskPriorityTransform(tasks[i].childTask[j].priority).value)}
                                <span/>`,
                        status: `<span class='badge ${getStatusColor(tasks[i].childTask[j].status)}' 
                                style="width: 65px;"
                                >
                                    ${$filter('l')(tasks[i].childTask[j].status)}
                                <span/>`
                    });
                }

            }

            g.Draw();
        } catch (error) {
            console.log(error);
        }

    }

    ctrl.changeChartTab = function (tab) {
        ctrl.chart_tab = tab;
    }

    ctrl.isActiveChartTab = function (tab) {
        return ctrl.chart_tab === tab;
    }

    //**LOAD, COUNT FOR PROJECT */
    ctrl.chooseProject = function (project) {
        ctrl.currentProject = project;
        ctrl.breadcrumb = [
            ...(ctrl.currentProject.parents || []).reverse(),
            { object: 'project', code: ctrl.currentProject.code },
        ];
        $location.search('code', project.code);
        ctrl._filter_value_status = ["NotSeen", "Processing"];
        
        ctrl.refreshData_Wiki();
      
    
        statistic_count();
        statistic_growth();
        ctrl.load_ganttChart_data();
    }

    function load_project_service() {
        var dfd = $q.defer();
        ctrl.Projects = [];
        let _filter = generateFilter_Project();
        task_service.load_project(_filter.search, ctrl.numOfItemPerPage_Project, ctrl.offset_Project, ctrl.sort_Project.query).then(function (res) {
            ctrl.Projects = res.data;
            let currentCode = $location.search().code;
            if (ctrl.Projects && currentCode) {
                let currentProject = ctrl.Projects.find(prj => prj.code === currentCode);
                if (currentProject) {
                    $location.search('code', currentCode);
                    ctrl.chooseProject(currentProject);
                } else {
                    $location.search('code', null);
                }
                currentProject = undefined;
            }
            dfd.resolve(true);
            currentCode = undefined;
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadProject = function (val) {
        if (val != undefined) { ctrl.offset_Project = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadProject", load_project_service);
    }

    function load_config_table_service() {
        var dfd = $q.defer();
        task_service.loadConfigTable(ctrl.currentProject._id).then(function (res) {
            let tempConfigTable = [
                {
                    value: 'Creator',
                    model: false
                },
                {
                    value: 'MainPerson',
                    model: false
                },
                {
                    value: 'Participant',
                    model: false
                },
                {
                    value: 'Observer',
                    model: false
                },
                {
                    value: 'NumberOfHours',
                    model: false
                },
            ];
            let tempConfig = [];
            if (res.data[0] && res.data[0].config.length > 0) {
                tempConfig = res.data[0].config;

            } else {
                tempConfig = tempConfigTable;
            }
            ctrl._useConfigTable = angular.copy(tempConfig)
            ctrl._configTable = angular.copy(tempConfig)
            ctrl._updateConfigTable = angular.copy(tempConfig)
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadConfigTable = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadConfigTable", load_config_table_service);
    }

    function update_config_table_service() {
        var dfd = $q.defer();
        task_service.updateConfigTable(ctrl.currentProject._id, undefined, ctrl._updateConfigTable).then(function (res) {
            dfd.resolve(true);
            ctrl.refreshData();
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.updateConfigTable = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "updateConfigTable", update_config_table_service);
    }

    function count_project_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_Project();
        task_service.count_project(_filter.search).then(function (res) {
            ctrl.totalItems_Project = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "count", count_project_service);
    }



    ctrl.refreshData_Project = function () {
        ctrl.loadProject();
        ctrl.countProject();
    }

    /**LOAD, COUNT AND GENERATE GANTT CHART FOR STRATEGIC */
  




    function genDate(timeString) {
        const myDate = new Date(timeString);
        return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')}`;
    }

 



    /**LOAD, COUNT  FOR WIKI */
    function load_wiki_service() {
        var dfd = $q.defer();
        ctrl.wikis = [];
        let _filter = generateFilter_Wiki();
        task_service.loadWiki(_filter.search, undefined, ctrl.currentProject._id, ctrl.numOfItemPerPage_Wiki, ctrl.offset_Wiki).then(function (res) {
            ctrl.wikis = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_wiki = function (val) {
        if (val != undefined) { ctrl.offset_Strategic = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "loadWiki", load_wiki_service);
    }


    function count_wiki_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_Wiki();
        task_service.countWiki(_filter.search, undefined, ctrl.currentProject._id).then(function (res) {
            ctrl.totalItems_Wiki = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count_wiki = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "countWiki", count_wiki_service);
    }



    ctrl.refreshData_Wiki = function () {
        if (ctrl.currentProject && ctrl.currentProject._id) {
            ctrl.load_wiki();
            ctrl.count_wiki();
        }
    }


    //**INIT */
    function init() {
        setValueFilter();
       
        setValueFilter_Wiki();
        ctrl._notyetInit = false;
        ctrl.loadProject();
        ctrl.countProject();
        load_department_service(undefined, 0);
        loadDispatchArrived()
    }

    init();




    /** STATISTIC */
    function statistic_count() {
        var _filter = generateFilter();
        task_service.statistic_project_count(ctrl.currentProject._id, _filter.from_date, _filter.to_date, _filter.participant_filter, _filter.priority_filter, _filter.status_filter, _filter.taskType_filter, _filter.label_filter).then(function (res) {
            if (res.data.all > 0) {
                ctrl.statistic_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_count.percent = 100;
            }
            ctrl.statistic_count.data = [];
            ctrl.statistic_count.label[0] = res.data.not_seen + " " + $filter('l')('NotSeen');
            ctrl.statistic_count.label[1] = res.data.process + " " + $filter('l')('Processing');
            ctrl.statistic_count.label[2] = res.data.pending_approval + " " + $filter('l')('PendingApproval');
            ctrl.statistic_count.label[3] = res.data.waitting + " " + $filter('l')('WaitingForApproval');
            ctrl.statistic_count.label[4] = res.data.completed + " " + $filter('l')('Completed');
            ctrl.statistic_count.label[5] = res.data.cancelled + " " + $filter('l')('Cancelled');
            
            ctrl.statistic_count.data.push(res.data.not_seen);
            ctrl.statistic_count.data.push(res.data.process);
            ctrl.statistic_count.data.push(res.data.pending_approval);
            ctrl.statistic_count.data.push(res.data.waitting);
            ctrl.statistic_count.data.push(res.data.cancelled);
            ctrl.statistic_count.data.push(res.data.completed);
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

    function generateDataForGrowth(data_created, data_completed) {
        try {
            var { number_days, myToDate } = calculateNumberOfDays(ctrl._filterFromDate, ctrl._filterToDate);
            var myFromDate = angular.copy(ctrl._filterFromDate);
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

    function statistic_growth() {
        var _filter = generateFilter();
        task_service.statistic_project_growth(ctrl.currentProject._id, _filter.from_date, _filter.to_date, _filter.participant_filter, _filter.priority_filter, _filter.status_filter, _filter.taskType_filter, _filter.label_filter).then(function (res) {
            var generate = generateDataForGrowth(res.data.created, res.data.completed);
            ctrl.statistic_growth.data = generate.data;
            ctrl.statistic_growth.label = generate.labels;

        }, function (err) { console.log(err) });

    }
    //*EXPORT FILE */
    function export_tasks_service() {
        var dfd = $q.defer();
        let _filter = generateFilter();
        task_service.export_task_project(_filter.search, _filter.status, _filter.from_date, _filter.to_date, ctrl.currentProject._id).then(function (res) {
            task_service.exportExcelFile(res.data);
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.export_tasks = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "export", export_tasks_service);
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

    /**LOAD FILE WIKI*/

    ctrl.loadfile_wiki = function (params) {
        return function () {
            var dfd = $q.defer();
            task_service.loadFileInfo_wiki(params.id, params.name).then(function (res) {
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

    //*OBTAINED OBJECT*/

    function obtained_object_service() {
        var dfd = $q.defer();
        task_service.obtained_object(
            ctrl._update_object_value.strategic_id,
            ctrl._update_object_value.id
        ).then(function () {
            $("#modal_Task_ObtainedObject").modal("hide");
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "obtainedObject");
          
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.obtainedObject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "obtainedObject", obtained_object_service);
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

    ctrl.pickMainperson_insert = function (val) {
        var dfd = $q.defer();

        ctrl._insert_value.main_person = val;
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

    ctrl.chooseHasEndDateRepetitive_insert = function (val) {
        ctrl._insert_value.repetitive.has_endDate = val;
        if(val === false) {
            ctrl._insert_value.repetitive.endDate = null
        }
    }

    ctrl.chooseWFP = function (val) {
        ctrl._insert_project_value.workflowPlay_id = val._id;
    }

    ctrl.pickParticipant = function (val) {
        ctrl._insert_project_value.participant = val;
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
        ctrl._filterTaskType = "";
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
            level: '',
            has_repetitive: false,
            repetitive: {
                has_endDate: false,
                per: 1,
                cycle: "day", // allow: days, weeks, months, years
                endDate: null // null or "" khi ko hết hạn
            },
            label: [],
            dispatch_arrived: '',
        };
    }

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
            taskType: "Task",
            label: [],
            dispatch_arrived: '',
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
            $("#" + idEditor).summernote('code'),
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
            null,
            ctrl._parentID,
            ctrl.currentProject._id,
            null,
            ctrl._insert_value.dispatch_arrived,
            ctrl._insert_value.level,
            ctrl._insert_value.label,
            false,
            [],
            {},
            5
        ).then(function () {
            if(ctrl._insert_value.level === 'HeadTask') {
                $("#modal_Head_Task_Insert").modal("hide");
            } else {
                $("#modal_Task_Insert").modal("hide");
            }
            ctrl.refreshData();
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

    ctrl.pickParticipants = function (value) {
        ctrl._filter_value_participant = value;
        ctrl.refreshData()
    }

    ctrl.pickPriority = function (value) {
        ctrl._filter_value_priority = value;
        ctrl.refreshData()
    }

    ctrl.pickStatus = function (value) {
        ctrl._filter_value_status = value;
        ctrl.refreshData()
    }

    ctrl.pickState = function (value) {
        ctrl._filter_value_state = value;
        ctrl.refreshData()
    }

    ctrl.pickLabelFilter = function (value) {
        ctrl._filter_value_label = value;
        ctrl.refreshData()
    }

    ctrl.pickTaskTypeFilter = function (value) {
        ctrl._filter_value_taskType = value;
        ctrl.refreshData()
    }

    ctrl.load_participant_filter = function ({search, top, offset}) {
        return new Promise((resolve, reject) => {
            const participantsList = ctrl.currentProject.participant.map((username) => ({
                _id: username,
                title: username
            }));
            return resolve(participantsList)
        })
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
            ctrl.refreshData();
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
        ctrl._update_value.main_person = val;
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

    ctrl.pickDispatchArrived_insert = function (item) {
        ctrl._insert_value.dispatch_arrived = item._id;
    }

    ctrl.chooseHasEndDateRepetitive_update = function (val) {
        ctrl._update_value.repetitive.has_endDate = val;
        if(val === false) {
            ctrl._update_value.repetitive.endDate = null
        }
    }

    ctrl.pickDispatchArrived_update = function (val) {
        ctrl._update_value.dispatch_arrived = val;
    }

    function loadDispatchArrived(search) {
        var dfd = $q.defer();
        task_service.loadDispatchArrived(search || '').then(function (res) {
            ctrl.dispatchArrived = res.data.map(item => ({
                ...item,
                optionTitle: `[${item.code}] ${item.title}`,
            }));
            dfd.resolve(true);
        }, function () {
            console.log('err');
            dfd.reject(false);
        });
        return dfd.promise;
    }

    ctrl.prepareUpdate = function (value) {
        ctrl.workflow_plays = [];
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");
        if (value.workflowPlay) {
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
        ctrl.notify_detail = value.notify_detail || null;

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

        if (ctrl._update_value.dispatch_arrived === undefined || Object.keys(ctrl._update_value.dispatch_arrived).length === 0) {
            ctrl._update_value.dispatch_arrived = ctrl._update_value.dispatch_arrived || {};
            ctrl._update_value.dispatch_arrived._id = '';
        }

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
            ctrl._update_value.dispatch_arrived._id
        ).then(function () {
            $("#modal_Task_Update").modal("hide");
            ctrl.refreshData();
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

    /**
     * INSERT PROJECT
     * By default, the value of to_date must be greater than from_date and at least 1 day
     */
    ctrl.prepareInsertProject = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insertProject");
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59, 59);
        ctrl._insert_project_value = {
            title: "",
            from_date: myToday.getTime(),
            to_date: endDay.getTime(),
            participant: [],
            workflowPlay_id: ''
        };
    }

    ctrl.chooseFromDate_insert_project = function (val) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_project_value.to_date);
        ctrl._insert_project_value.from_date = val ? val.getTime() : undefined;;
    }

    ctrl.chooseToDate_insert_project = function (val) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(true, ctrl._insert_project_value.from_date, val);
        ctrl._insert_project_value.to_date = val ? val.getTime() : undefined;;
    }

    function insert_project_service() {
        var dfd = $q.defer();
        task_service.insert_project(
            ctrl._insert_project_value.title,
            ctrl._insert_project_value.from_date,
            ctrl._insert_project_value.to_date,
            ctrl._insert_project_value.participant,
            ctrl._insert_project_value.workflowPlay_id,
        ).then(function () {
            $("#modal_Task_InsertProject").modal("hide");
            ctrl.refreshData_Project();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insertProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insertProject", insert_project_service);
    }

    //**UPDATE PROJECT */

    ctrl.prepareUpdateProject = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "updateProject");
        ctrl._update_project_value = angular.copy(ctrl.currentProject);
        ctrl._update_project_value.workflowPlay_id = (ctrl.currentProject.workflow_play && ctrl.currentProject.workflow_play._id) || ''
    }

    ctrl.chooseFromDate_update_project = function (val) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(false, val, ctrl._update_project_value.to_date);
        ctrl._update_project_value.from_date = val ? val.getTime() : undefined;
    }

    ctrl.chooseToDate_update_project = function (val) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._update_project_value.from_date, val);
        ctrl._update_project_value.to_date = val ? val.getTime() : undefined;
    }

    ctrl.chooseWFP_update_project = function (val) {
        ctrl._update_project_value.workflowPlay_id = val._id;
    }

    function update_project_service() {
        var dfd = $q.defer();
        task_service.update_project(
            ctrl._update_project_value._id,
            ctrl._update_project_value.title,
            ctrl._update_project_value.from_date,
            ctrl._update_project_value.to_date,
            ctrl._update_project_value.workflowPlay_id
        ).then(function () {
            $("#modal_Task_UpdateProject").modal("hide");
            ctrl.refreshData_Project();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.updateProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "updateProject", update_project_service);
    }

    //**DELETE PROJECT */
    ctrl.prepareDeleteProject = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "deleteProject");
    }
    function delete_project_service() {
        var dfd = $q.defer();
        task_service.delete_project(ctrl.currentProject._id, ctrl.currentProject.retype).then(function () {
            $("#modal_Task_DeleteProject").modal("hide");
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "deleteProject");
            dfd.resolve(true);
            ctrl.currentProject = {};
            ctrl.strategics = [];
            ctrl.tasks = [];
            ctrl.refreshData_Project();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.deleteProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "deleteProject", delete_project_service);
    }

    //**UPDATE PARTICIPANT FOR PROJECT */

    ctrl.pickParticipant_project_update = function (val) {
        task_service.update_participant_project(ctrl._update_project_value._id, val).then(function () {
            ctrl.refreshData_Project();
        }, function (err) { console.log(err); });
    }

    //**START PROJECT */

    function start_project_service() {
        var dfd = $q.defer();
        task_service.start_project(ctrl.currentProject._id).then(function () {
            $("#modal_Task_StartProject").modal("hide");
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "startProject");
            dfd.resolve(true);
            ctrl.refreshData_Project();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.startProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "startProject", start_project_service);
    }

    //**CLOSE  PROJECT */

    function close_project_service() {
        var dfd = $q.defer();
        task_service.close_project(ctrl.currentProject._id).then(function () {
            $("#modal_Task_CloseProject").modal("hide");
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "closeProject");
            dfd.resolve(true);
            ctrl.refreshData_Project();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.closeProject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "closeProject", close_project_service);
    }


    /**INSERT WIKI */

    ctrl.prepareInsertWiki = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insertWiki");
        $("#" + idEditor_wiki).summernote({
            height: 100,
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
                    task_service.uploadImage_wiki(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data);
                        $("#" + idEditor_wiki).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });

        ctrl._insert_wiki_value = {
            files: [],
            title: ""
        };
    }

    ctrl.removeFile_insert_wiki = function (item) {
        var temp = [];
        for (var i in ctrl._insert_wiki_value.files) {
            if (ctrl._insert_wiki_value.files[i].name != item.name) {
                temp.push(ctrl._insert_wiki_value.files[i]);
            }
        }
        ctrl._insert_wiki_value.files = angular.copy(temp);
    }

    function insert_wiki_service() {
        var dfd = $q.defer();
        task_service.insertWiki(
            ctrl._insert_wiki_value.files,
            ctrl._insert_wiki_value.title,
            $("#" + idEditor_wiki).summernote('code'),
            undefined,
            ctrl.currentProject._id
        ).then(function () {
            $("#modal_Task_InsertWiki").modal("hide");
            ctrl.refreshData_Wiki();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert_wiki = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insertWiki", insert_wiki_service);
    }

    /**DELETE WIKI */
    ctrl.prepareDeleteWiki = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "deleteWiki");
        ctrl._delete_wiki_value = angular.copy(value);
    }

    function delete_wiki_service() {
        var dfd = $q.defer();
        task_service.deleteWiki(ctrl._delete_wiki_value._id).then(function () {
            $("#modal_Task_DeleteWiki").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData_Wiki();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.deleteWiki = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "deleteWiki", delete_wiki_service);
    }


    /**UPDATE WIKI */

    ctrl.prepareUpdateWiki = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "updateWiki");
        ctrl._update_wiki_value = angular.copy(value);
        $("#" + idEditor_update_wiki).summernote({
            height: 100,
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
                    task_service.uploadImage_wiki(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data);
                        $("#" + idEditor_update_wiki).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor_update_wiki).summernote('code', value.content);
    }

    function update_wiki_service() {
        var dfd = $q.defer();
        task_service.updateWiki(
            ctrl._update_wiki_value._id,
            ctrl._update_wiki_value.title,
            $("#" + idEditor_update_wiki).summernote('code')
        ).then(function () {
            $("#modal_Task_UpdateWiki").modal("hide");
            ctrl.refreshData_Wiki();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_wiki = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "updateWiki", update_wiki_service);
    }


    /**WIKI - PUSH FILE FOR UPDATE MODAL */

    function pushFile_wiki_service(file) {
        return function () {
            var dfd = $q.defer();
            task_service.pushFile_wiki(file, ctrl._update_wiki_value._id).then(function (res) {
                ctrl._update_wiki_value.attachment.push(res.data);
                ctrl.refreshData_Wiki();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushFile_wiki_update = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "pushFile", pushFile_wiki_service(file));
    }

    /**WIKI - REMOVE FILE FOR UPDATE MODAL */
    function removeFile_wiki_service(filename) {
        return function () {
            var dfd = $q.defer();
            task_service.removeFile_wiki(ctrl._update_wiki_value._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl._update_wiki_value.attachment) {
                    if (ctrl._update_wiki_value.attachment[i].name !== filename) {
                        temp.push(ctrl._update_wiki_value.attachment[i]);
                    }
                }
                ctrl._update_wiki_value.attachment = temp;
                ctrl.refreshData_Wiki();
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

    ctrl.removeFile_wiki_update = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "removeFile", removeFile_wiki_service(item.name));
    }

    // INSERT WORKFLOW FOR UPDATING TASK
    ctrl.handleInsertWFPSuccess = function (data) {
        ctrl._update_value.workflowPlay_id = data[0]._id;
        ctrl.workflow_plays = data;
    };

    ctrl.load_WFP = function (params) {
        let dfd = $q.defer();
        workflow_play_service.load(params.search, undefined, undefined, 'all', 10, 0, { _id: -1 }, ["Approved", "SaveODB"]).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.count_WFP = function (params) {
        let dfd = $q.defer();
        workflow_play_service.count(params.search, undefined, 'Approved', 'all').then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadWFP_details = function (params) {
        let dfd = $q.defer();
        workflow_play_service.loadWFP_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.handle_insert_notify_success = function(data) {
        $('.task-project-feature #notify_insert_modal').modal('hide')
        ctrl._update_value.notify_detail = data.data;
        ctrl.notify_detail = data.data;
    }

    ctrl.load_notify_file = function (params) {
        return function () {
            var dfd = $q.defer();
            notify_service.loadFileInfo(params.id, params.name).then(function (res) {
                dfd.resolve({
                    display: res.data.display,
                    embedUrl: res.data.url,
                    guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
            }, function (err) {
            });
            return dfd.promise;
        }
    }

}]);
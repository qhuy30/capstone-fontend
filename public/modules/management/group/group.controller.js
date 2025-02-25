


myApp.registerCtrl('group_controller', ['group_service', '$q', '$rootScope', '$timeout', '$filter', function (group_service, $q, $rootScope, $timeout, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Group", action: "load" },
        { name: "Group", action: "count" },
        { name: "Group", action: "insert" },
        { name: "Group", action: "update" },
        { name: "Group", action: "delete" },
        { name: "Group", action: "loadDetails" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = 'group_controller';
        ctrl.groups = [];
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: 'title', value: false, query: { title: 1 } };
        ctrl._notyetInit = true;
        ctrl._checkActive = false;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = '';
        ctrl.Role_Config = {
            master_key: 'role',
            load_details_column: 'value',
        };

        ctrl.Modules = [
            { key: "ProjectAndTask" },
            { key: "LeaveForm" },
            { key: "Notify" },
            { key: "User" },
            { key: "Group" },
            { key: "DepartmentGroup" },
            { key: "Menu" },
            { key: "Settings" },
            { key: "MasterDirectory" },
            { key: "Directory" },
            { key: "Department" },
            { key: "DesignWorkflow" },
            { key: "RecycleBin" },
            { key: "LaborContract" },
            { key: "HumanResourceManagement" },
            { key: "Signing" },
            { key: "DispatchArrived" },
            { key: "DispatchOutgoing" },
            { key: "JourneyTimeForm" },
            { key: "Document" },
            { key: "Storage" },
            { key: "WaitingStorage" },
            { key: "RecordAccess" },
            { key: "StudyPlan" },
            { key: "ExamSchedule" },
            { key: "QuestionAnswer" },
            { key: "TrainingPoint" },
            { key: "StudentAdministrativeProcedures" },
            { key: "WorkflowForm" },
            { key: "AdministrativeProcedures" },
            { key: "MeetingRoom" },
            { key: "EventCalendar" },
            { key: "CarTicketManagement" },
            { key: "AdvancedSearch" },
        ];

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlFilterModal = FrontendDomain + '/modules/management/group/views/groupfilter_modal.html';
        ctrl._urlInfoModal = FrontendDomain + '/modules/management/group/views/info_modal.html';
        ctrl._urlInsertModal = FrontendDomain + '/modules/management/group/views/insert_modal.html';
        ctrl._urlUpdateModal = FrontendDomain + '/modules/management/group/views/update_modal.html';
        ctrl._urlDeleteModal = FrontendDomain + '/modules/management/group/views/delete_modal.html';

        ctrl._urlTask_Department_Permission = FrontendDomain + '/modules/management/user/views/task_department_permission.html';
        ctrl._urlTask_Project_Permission = FrontendDomain + '/modules/management/user/views/task_project_permission.html';
        ctrl._urlTask_Personal_Permission = FrontendDomain + '/modules/management/user/views/task_personal_permission.html';
        ctrl._urlTask_Statistic_Permission = FrontendDomain + '/modules/management/user/views/task_statistic_permission.html';
        ctrl._urlTask_Management_Permission = FrontendDomain + '/modules/management/user/views/task_management_permission.html';

        ctrl.Competence_Config = {
            master_key: 'competence',
            load_details_column: 'value',
        };
    }

    /**function for logic */
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilterLoadGroup() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }
    /**interact with view */
    ctrl.changeCheckActive = function (val) {
        ctrl._checkActive = val;
        ctrl.loadGroup();
    }
    ctrl.changeActiveFilterData = function (val) {
        ctrl._activeFilterData = val;
        if (ctrl._checkActive === true) {
            ctrl.refreshData();
        }
    }
    function loadGroup_service() {
        var dfd = $q.defer();
        ctrl.groups = [];
        var filter = generateFilterLoadGroup();
        group_service.loadGroup(filter.search, filter.isactive, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(function (res) {
            ctrl.groups = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadGroup = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Group", "load", loadGroup_service);
    }

    function countGroup_service() {
        var dfd = $q.defer();
        ctrl.groups = [];
        var filter = generateFilterLoadGroup();
        group_service.countGroup(filter.search, filter.isactive).then(function (res) {
            ctrl.totalItems = res.data.count;

            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countGroup = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Group", "count", countGroup_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        setModules();
        resetPaginationInfo();
        dfdAr.push(ctrl.loadGroup());
        dfdAr.push(ctrl.countGroup());
        $q.all(dfdAr);
    }

    function setModules() {
        for (var i in ctrl.SubModules) {
            if ($filter('checkRule')([ctrl.SubModules[i].rule])) {
                for (var j in ctrl.SubModules[i].keys) {
                    // check exist key in ctrl.Modules
                    if (ctrl.Modules.filter(e => e.key === ctrl.SubModules[i].keys[j].key).length == 0) {
                        ctrl.Modules.push(ctrl.SubModules[i].keys[j]);
                    }
                }
            }
        }
    }

    function init() {
        setModules();
        var dfdAr = [];
        dfdAr.push(ctrl.loadGroup());
        dfdAr.push(ctrl.countGroup());
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
    /**show Infomation Details*/
    ctrl.assignInfo = function (val) {
        ctrl._info_value = angular.copy(val);
    }
    /** Insert*/

    function generate_resetInsertValue() {
        ctrl._insert_value = {
            title: "",
            url: "",
            isactive: true
        };
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Group", "insert");
        generate_resetInsertValue();
    }


    function insert_service() {
        var dfd = $q.defer();
        group_service.insert(ctrl._insert_value.title, ctrl._insert_value.isactive).then(function () {
            ctrl.refreshData();
            $timeout(function () {
                $("#modal_Group_Insert").modal("hide");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }


    ctrl.insert_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Group", "insert", insert_service);
    }

    /**UPDATE GROUP GENERAL */


    ctrl.chooseRole_update = function (val) {
        ctrl._update_value.role = val;
    }

    ctrl.chooseUser_update = function (val) {
        ctrl._update_value.user = val;
    }

    ctrl.chooseCompetence_update = function (val) {
        ctrl._update_value.competence = val;
    }

    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        ctrl._update_value.competence = val.competence || []
        ctrl.chooseModule(ctrl.Modules[0]);
        setRule();
        $rootScope.statusValue.generate(ctrl._ctrlName, "Group", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        group_service.update(ctrl._update_value._id,
            ctrl._update_value.title,
            ctrl._update_value.isactive,
            ctrl._update_value.user,
            ctrl._update_value.role,
            ctrl._update_value.competence
        ).then(function () {
            ctrl.loadGroup();
            dfd.resolve(true);
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Group", "update");

            }, 1000);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.update_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Group", "update", update_service);
    }

    /**DELETE GROUP */

    function generate_resetDeleteValue(val) {
        ctrl._delete_value = angular.copy(val);
    }

    ctrl.prepareDelete = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Group", "delete");
        generate_resetDeleteValue(val);
    }

    function delete_service() {
        var dfd = $q.defer();
        group_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_Group_Delete").modal('hide');
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.delete_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Group", "delete", delete_service);
    }


    /**PERMISSION */

    ctrl.loadProject = function (params) {
        var dfd = $q.defer();
        group_service.loadProject(params.sort, params.top, params.offset).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.countProject = function (params) {
        var dfd = $q.defer();
        group_service.countProject(params.search).then(function (res) {
            dfd.resolve(res.data.count);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadProject_details_m = function (params) {
        var dfd = $q.defer();
        group_service.loadProject_details_m(params._ids).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }


    ctrl.loadDepartment = function (params) {
        var dfd = $q.defer();
        group_service.loadDepartment(params.level, params.id).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        group_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartment_details_multi = function (params) {
        let dfd = $q.defer();
        group_service.loadDepartment_details_multi(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function pushRule(rule) {
        group_service.pushRule(ctrl._update_value._id, rule).then(function () { ctrl.loadGroup(); }, function (err) { console.log(err) });
    }

    function removeRule(rule) {
        group_service.removeRule(ctrl._update_value._id, rule).then(function () { ctrl.loadGroup(); }, function (err) { console.log(err) });
    }

    function setPermissionUrl() {
        switch (ctrl._selectedModule.key) {
            case "ProjectAndTask":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/task_permission.html";
                break;
            case "User":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/user_permission.html";
                break;
            case "Group":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/group_permission.html";
                break;
            case "Menu":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/menu_permission.html";
                break;
            case "Settings":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/settings_permission.html";
                break;
            case "MasterDirectory":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/master_directory_permission.html";
                break;
            case "Directory":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/directory_permission.html";
                break;

            case "Department":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/department_permission.html";
                break;
            case "DesignWorkflow":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/design_workflow_permission.html";
                break;
            case "RecycleBin":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/recycle_bin_permission.html";
                break;

            case "LaborContract":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/labor_contract_permission.html";
                break;

            case "HumanResourceManagement":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/human_resource_management_permission.html";
                break;
            case "Signing":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/signing_permission.html";
                break;

            case "DispatchArrived":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/dispatch_arrived_permission.html";
                break;

            case "DispatchOutgoing":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/dispatch_outgoing_permission.html";
                break;

            case "LeaveForm":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/leave_form_permission.html";
                break;

            case "Notify":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/notify_permission.html";
                break;

            case "JourneyTimeForm":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/journey_time_form_permission.html";
                break;

            case "Document":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/document_permission.html";
                break;

            case "StudyPlan":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/study_plan_permission.html";
                break;
            case "ExamSchedule":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/exam_schedule_permission.html";
                break;
            case "QuestionAnswer":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/question_answer_permission.html";
                break;
            case "TrainingPoint":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/training_point_permission.html";
                break;
            case "MeetingRoom":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/meeting_room_permission.html";
                break;
            case "EventCalendar":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/event_calendar_permission.html";
                break;
            case "Storage":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/storage_permission.html";
                break;
            case "CarTicketManagement":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/car_management_permission.html";
                break;
            case "AdvancedSearch":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/advanced_search_permission.html";
                break;
        }
    }

    ctrl.chooseModule = function (val) {
        ctrl.ready_to_update_permission = false;
        ctrl._selectedModule = val;
        setPermissionUrl();
        $timeout(function () {
            ctrl.ready_to_update_permission = true;
        }, 300);
    }




    var ruleArray = [
        /**USER RULES */
        { name: "Management.User.Use", type: "checkbox" },
        { name: "Management.User.AssignPermission", type: "checkbox" },
        { name: "Management.User.DeleteUser", type: "checkbox" },
        /**END USER RULES */

        /**GROUP RULES */
        { name: "Management.Group.Use", type: "checkbox" },
        { name: "Management.Group.Use", type: "checkbox" },
        { name: "Management.Group.AssignPermission", type: "checkbox" },
        { name: "Management.Group.DeleteGroup", type: "checkbox" },
        /**END GROUP RULES */

        /**DEPARTMENT GROUP RULES */
        { name: "Management.DepartmentGroup.Use", type: "checkbox" },
        /**END DEPARTMENT GROUP RULES */

        /**MENU RULES */
        { name: "Management.Menu.Use", type: "checkbox" },
        /**END MENU RULES */

        /**SETTINGS RULES */
        { name: "Management.Settings.Use", type: "checkbox" },
        /**END SETTINGS RULES */

        /**MASTER DIRECTORY RULES */
        { name: "Management.MasterDirectory.Use", type: "checkbox" },
        /**END MASTER DIRECTORY RULES */

        /** DIRECTORY RULES */
        { name: "Management.Directory.Use", type: "checkbox" },
        /**END DIRECTORY RULES */

        /**DEPARTMENT RULES */
        { name: "Management.Department.Use", type: "checkbox" },
        /**END DEPARTMENT RULES */

        /**DESIGN WORKFLOW RULES */
        { name: "Management.DesignWorkflow.Use", type: "checkbox" },
        { name: "Management.DesignWorkflow.Management_MinorLabels_Department", type: "radio_design_workflow" },
        { name: "Management.DesignWorkflow.Edit", type: "radio_design_workflow" },
        { name: "Management.DesignWorkflow.Delete", type: "radio_design_workflow" },
        { name: "Management.DesignWorkflow.See", type: "radio_design_workflow" },
        /**END DESIGN WORKFLOW RULES */

        /**RECYCLEBIN RULES */
        { name: "Management.RecycleBin.Use", type: "checkbox" },
        /**END RECYCLEBIN RULES */

        /**LABOR CONTRACT RULES */
        { name: "Office.LaborContract.Use", type: "checkbox" },
        { name: "Office.LaborContract.Approval", type: "checkbox" },
        /**END LABOR CONTRACT RULES */

        /**HUMAN MANAGEMENT RESOURCE RULES */
        { name: "Office.HumanResourceManagement.Use", type: "checkbox" },
        { name: "Office.HumanResourceManagement.Education", type: "checkbox" },
        { name: "Office.HumanResourceManagement.Salary", type: "checkbox" },
        { name: "Office.HumanResourceManagement.Mission", type: "checkbox" },
        { name: "Office.HumanResourceManagement.User", type: "checkbox" },
        /**END HUMAN MANAGEMENT RESOURCE RULES */

        /**SIGNING RULES */
        { name: "Office.Signing.Use", type: "checkbox" },
        { name: "Office.Signing.Department_Leader_Manage", type: "radio_department" },
        { name: "Office.Signing.Leader_Manage", type: "radio_department" },
        /**END SIGNING RULES */

        /**DISPATCH ARRIVED RULES */
        { name: "Office.DispatchArrived.Use", type: "checkbox" },
        { name: "OfficeDA.Manager", type: "checkbox" },
        { name: "Office.DispatchArrived.Manager", type: "checkbox" },
        { name: "Office.DispatchArrived.Lead", type: "checkbox" },
        { name: "Office.DispatchArrived.FollowDA", type: "checkbox"},
        { name: "Office.DispatchArrived.Confirm", type: "radio_department"},
        { name: "Office.DispatchArrived.ApproveLevel1", type: "checkbox"},
        /**END DISPATCH ARRIVED RULES */

        /**DISPATCH OUTGOING RULES */
        { name: "Office.DispatchOutgoing.Use", type: "checkbox" },
        { name: "OfficeDG.Manager", type: "checkbox" },
        { name: "Office.DispatchOutgoing.Release", type: "checkbox" },
        { name: "Office.DispatchOutgoing.EditODB", type: "radio_department" },
        { name: "Office.DispatchOutgoing.ViewODB", type: "radio_department"},
        /**END DISPATCH GONE RULES */

        /**LEAVE FORM RULES */
        { name: "Office.LeaveForm.Use", type: "checkbox" },
        { name: "Office.LeaveForm.Manager", type: "checkbox" },
        /**END LEAVE FORM RULES */
        
        /**NOTIFY RULES */
        { name: "Office.Notify.Use", type: "checkbox" },
        { name: "Office.Notify.Create", type: "checkbox" },
        { name: "Office.Notify.NotifyDepartment", type: "radio_department" },
        { name: "Office.Notify.ApprovalLevel_1", type: "checkbox" },
        { name: "Office.Notify.ApprovalLevel_2", type: "radio_department" },
        { name: "Office.Notify.ApproveExternal", type: "checkbox" },
        // { name: "Office.Notify.Manager", type: "radio_department" },
        // { name: "Office.Notify.Cancel", type: "radio_department" },
        { name: "Office.Notify.BoardOfDirectors", type: "checkbox" },
        /**END NOTIFY RULES */

        /**JOURNEY TIME FORM RULES */
        { name: "Office.JourneyTimeForm.Use", type: "checkbox" },
        { name: "Office.JourneyTimeForm.Approval", type: "checkbox" },
        /**END JOURNEY TIME FORM RULES */

        /**TASK RULES */
        { name: "Office.Task.AuthorizationToAssignWorkToSuperiors", type: "checkbox" },
        { name: "Office.Task.Show_DepartmentTab", type: "checkbox" },
        { name: "Office.Task.Show_ProjectTab", type: "checkbox" },
        { name: "Office.Task.Show_StatisticTab", type: "checkbox" },
        { name: "Office.Task.Use", type: "checkbox" },
        { name: "Office.Task.Create_Project", type: "checkbox" },
        { name: "Office.Task.CreateExternal", type: "checkbox" },
        { name: "Office.Task.observerExternal", type: "checkbox" },
        { name: "Office.Task.ReceiveExternal", type: "checkbox" },
        
        { name: "Office.Task.Delete_Task_Department", type: "radio_department" },
        { name: "Office.Task.Follow_Task_Department", type: "radio_department" },
        { name: "Office.Task.Create_Task_Department", type: "radio_department" },
        { name: "Office.Task.Edit_Task_Department", type: "radio_department" },
        { name: "Office.Task.Notify_Task_Department", type: "radio_department" },
        { name: "Office.Task.Import_Task_Department", type: "radio_department" },
        { name: "Office.Task.Complete_Task_Department", type: "radio_department" },
        { name: "Office.Task.View_Task_Department", type: "radio_department" },
        { name: "Office.Task.Create_RepetitiveCycle_Department", type: "checkbox" },
        { name: "Office.Task.Management_MajorLabels_Department", type: "checkbox" },
        { name: "Office.Task.Management_MinorLabels_Department", type: "radio_department" },

        { name: "Office.Task.Follow_Project", type: "radio_project" },
        { name: "Office.Task.Edit_Project", type: "radio_project" },
        { name: "Office.Task.Follow_Object_Project", type: "radio_project" },
        { name: "Office.Task.Create_Object_Project", type: "radio_project" },
        { name: "Office.Task.Edit_Object_Project", type: "radio_project" },
        { name: "Office.Task.Follow_Task_Project", type: "radio_project" },
        { name: "Office.Task.Create_Task_Project", type: "radio_project" },
        { name: "Office.Task.Edit_Task_Project", type: "radio_project" },
        /**END TASK RULES */
        /**DOCUMENT RULES */
        { name: "Office.File.Use", type: "radio_project" },
        { name: "Office.File.Create_Folder_Department", type: "radio_department" },
        { name: "Office.File.Update_Folder_Department", type: "radio_department" },
        { name: "Office.File.Delete_Folder_Department", type: "radio_department" },
        { name: "Office.File.Create_File_Department", type: "radio_department" },
        { name: "Office.File.Update_File_Department", type: "radio_department" },
        { name: "Office.File.Delete_File_Department", type: "radio_department" },
        { name: "Office.File.Create_Folder_Project", type: "radio_project" },
        { name: "Office.File.Update_Folder_Project", type: "radio_project" },
        { name: "Office.File.Delete_Folder_Project", type: "radio_project" },
        { name: "Office.File.Create_File_Project", type: "radio_project" },
        { name: "Office.File.Update_File_Project", type: "radio_project" },
        { name: "Office.File.Delete_File_Project", type: "radio_project" },
        { name: "UtilitiesTool.CalculateDimensions.Use", type: "checkbox" },
        { name: "UtilitiesTool.PDFToExcel.Use", type: "checkbox" },
        { name: "UtilitiesTool.RemoveContextPdf.Use", type: "checkbox" },
        /**END DOCUMENT RULES */
        /**STUDY PLAN RULES */
        { name: "Education.StudyPlan.Use", type: "checkbox" },
        /**STUDY PLAN RULES */
        /**Exam Schedule RULES */
        { name: "Education.ExamSchedule.Use", type: "checkbox" },
        { name: "Education.QnA.Use", type: "checkbox" },
        { name: "Education.FrequentlyQuestion.Use", type: "checkbox" },
        { name: "Education.StudentQuestion.Use", type: "checkbox" },
        { name: "Education.TypeQuestion.Use", type: "checkbox" },
        { name: "Education.ForwardQuestion.Use", type: "checkbox" },
        /**Exam Schedule RULES */

        /* TASKMANAGEMENT RULES */
        { name: "Office.Task.Show_TaskManagementTab", type: "checkbox" },
        { name: "Office.Task.Import_Multiple_Departments", type: "checkbox" },
        { name: "Office.Task.Import_Multiple_Projects", type: "checkbox" },
        { name: "Office.TaskTemplate.Use", type: "checkbox" },
        { name: "Office.Task.Director_Manage", type: "checkbox" },
        { name: "Office.Task.Leader_Mangage", type: "radio_project" },
        { name: "Office.Task.Department_Leader_Manage", type: "radio_project" },
        /* TASKMANAGEMENT RULES */

        /* STORAGE RULES */
        {name: "Office.Storage.Use", type: "checkbox" },
        /* END STORAGE RULES */

        /**Training Point RULES */
        { name: "Education.TrainingPoint.Use", type: "checkbox" },
        /**Training Point  RULES */

        
        /** STUDENT ADMINISTRATIVE PROCEDURES  RULES */
        { name: "Education.StudentAdministrativeProcedures.Use", type: "checkbox" },
        { name: "Education.WorkflowForm.Use", type: "checkbox" },
        { name: "Education.AdministrativeProcedures.Use", type: "checkbox" },
          /** END STUDENT ADMINISTRATIVE PROCEDURES  RULES */

        /* MEETING ROOM RULES */
        { name: "Office.MeetingRoom.Use", type: "checkbox" },
        { name: "Office.MeetingRoomSchedule.Use", type: "checkbox" },
        { name: "Office.MeetingRoomSchedule.register", type: "checkbox" },
        { name: "Office.MeetingRoomSchedule.Approval", type: "checkbox" },
        { name: "Office.LectureHallClassroom.Approval", type: "checkbox" },
        { name: "Office.MeetingRoomSchedule.Confirm", type: "checkbox" },
        { name: "Office.LectureHallClassroom.Confirm", type: "checkbox" },
        { name: "Office.MeetingRoom.NotifyDepartment", type: "radio_department" },
        { name: "Office.RoomSchedule.ApprovalDepartment", type: "radio_department" },
        { name: "Office.RoomSchedule.Manange", type: "radio_department" },
        { name: "Office.RoomSchedule.RequestCancel", type: "radio_department" },
        { name: "Office.RoomSchedule.ReceiveInformarion", type: "radio_department" },
        { name: "Office.MeetingRoomSchedule.Butler", type: "checkbox" },
        { name: "Office.LectureHallClassroom.Butler", type: "checkbox" },
        /* MEETING ROOM RULES */

         /* EVENT CALENDAR */
         { name: "Office.EventCalendar.Use", type: "checkbox" },
         { name: "Office.EventCalendar.Create", type: "checkbox" },
         { name: "Office.EventCalendar.NotifyDepartment", type: "radio_department" },
         { name: "Office.EventCalendar.ApprovalDepartment", type: "radio_department" },
         { name: "Office.EventCalendar.OtherApproval", type: "checkbox" },
         { name: "Office.EventCalendar.FinalApproval", type: "checkbox" },
         { name: "Office.EventCalendar.Manage", type: "checkbox" },
         /* EVENT CALENDAR */
        /* CAR MANAGEMENT RULES */
        { name: "Office.CarManagement.Use", type: "checkbox" },
        { name: "Office.CarManagement.Create", type: "checkbox" },
        { name: "Office.CarManagement.Review", type: "radio_department" },
        { name: "Office.CarManagement.NotifyDepartment", type: "radio_department" },
        { name: "Office.CarManagement.CardDelivery", type: "checkbox" },
        { name: "Office.CarManagement.Confirm", type: "checkbox" },
        { name: "Office.CarManagement.Approve", type: "checkbox" },
        { name: "Office.CarManagement.Callendar", type: "checkbox" },
        { name: "Office.CarManagement.ApproveExternal", type: "checkbox" }
    ];


    function setRule() {
        ctrl.rule = {};
        for (var i in ruleArray) {
            switch (ruleArray[i].type) {
                case "checkbox":
                    if (ctrl._update_value.rule.filter(e => e.rule === ruleArray[i].name).length == 0) {
                        ctrl.rule[ruleArray[i].name] = {};
                        ctrl.rule[ruleArray[i].name].value = false;
                    } else {
                        ctrl.rule[ruleArray[i].name] = {};
                        ctrl.rule[ruleArray[i].name].value = true;
                    }
                    break;

                case "radio_department":
                    var item = ctrl._update_value.rule.filter(e => e.rule === ruleArray[i].name)[0];

                    if (item) {
                        ctrl.rule[ruleArray[i].name] = {};
                        ctrl.rule[ruleArray[i].name].value = item.details.type;
                        if (item.details && item.details.type && item.details.type == "Specific") {
                            ctrl.rule[ruleArray[i].name].department = item.details.department;
                        }

                    }
                    break;

                case "radio_project":
                    var item = ctrl._update_value.rule.filter(e => e.rule === ruleArray[i].name)[0];

                    if (item) {
                        ctrl.rule[ruleArray[i].name] = {};
                        ctrl.rule[ruleArray[i].name].value = item.details.type;
                        if (item.details && item.details.type && item.details.type == "Specific") {
                            ctrl.rule[ruleArray[i].name].project = item.details.project;
                        }

                    }
                    break;
                case "radio_design_workflow":
                    var item = ctrl._update_value.rule.filter(e => e.rule === ruleArray[i].name)[0];
                    if (item) {
                        ctrl.rule[ruleArray[i].name] = {};
                        ctrl.rule[ruleArray[i].name].value = item.details.type;
                    }
                    break;
            }
        }
    }

    ctrl.update_Department_Permission = function (val) {
        ctrl.rule[val.value].department = val.model;
        pushRule({
            rule: val.value,
            details: {
                type: "Specific",
                department: val.model
            }
        });
    }

    ctrl.update_Project_Permission = function (val) {
        ctrl.rule[val.value].project = val.model;
        pushRule({
            rule: val.value,
            details: {
                type: "Specific",
                project: val.model
            }
        });
    }

    ctrl.updateRule = function (val) {
        if (ctrl._update_value && ctrl._update_value._id && ctrl.ready_to_update_permission) {

            var item = ruleArray.filter(e => e.name === val.value)[0];
            switch (item.type) {
                case "checkbox":

                    if (val.model === false) {
                        removeRule({
                            rule: val.value
                        });
                    } else {
                        pushRule({
                            rule: val.value
                        });
                    }
                    break;

                case "radio_department":
                    ctrl.rule[val.value].department = [];
                    pushRule({
                        rule: val.value,
                        details: {
                            type: val.model
                        }
                    });
                    break;
                case "radio_project":
                    ctrl.rule[val.value].project = [];
                    pushRule({
                        rule: val.value,
                        details: {
                            type: val.model
                        }
                    });
                    break;
                case "radio_design_workflow":
                    ctrl.rule[val.value].design_workflow = [];
                    pushRule({
                        rule: val.value,
                        details: {
                            type: val.model
                        }
                    });
                    break;
            }
        }
    }


    /** TASK PERMISION*/
    ctrl.tabTask = "department";

    ctrl.switchTaskTab = function (val) {
        ctrl.tabTask = val;
    }

}]);



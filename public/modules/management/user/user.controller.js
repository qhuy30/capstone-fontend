


myApp.registerCtrl('user_controller', ['user_service', '$q', '$rootScope', '$timeout', '$filter', 'FileSaver', 'Blob', function (user_service, $q, $rootScope, $timeout, $filter, FileSaver, Blob) {
    /**declare variable */
    const _statusValueSet = [
        { name: "User", action: "load" },
        { name: "User", action: "loadDetails" },
        { name: "User", action: "count" },
        { name: "User", action: "insert" },
        { name: "User", action: "import" },
        { name: "User", action: "update" },
        { name: "User", action: "delete" },
        { name: "User", action: "assignUser" },
        { name: "User", action: "loadImportUserTemplate" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "user_controller";
        ctrl.users = [];
        ctrl.Rules = [];
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "title", value: false, query: { title: 1 } };
        ctrl._notyetInit = true;
        ctrl._checkActive = false;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";
        ctrl.ready_to_update_permission = false;
        ctrl.rule = {};

        ctrl.Role_Config = {
            master_key: "role",
            load_details_column: "value"
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

        //! Add more modules when have another product
        ctrl.SubModules = [
            {
                rule: "UtilitiesTool.PDFToExcel.Use",
                keys: [
                    { key: "PdfToExcel" },
                    { key: "RemovePdf" },
                    { key: "CalculateDimensions" },
                ]
            }
        ]

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlFilterModal = FrontendDomain + "/modules/management/user/views/userfilter_modal.html";
        ctrl._urlInsertModal = FrontendDomain + "/modules/management/user/views/insert_modal.html";
        ctrl._urlImportModal = FrontendDomain + "/modules/management/user/views/import_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/management/user/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/management/user/views/delete_modal.html";
        ctrl._urlResetPasswordModal = FrontendDomain + "/modules/management/user/views/reset_password_modal.html";
        ctrl._urlResetPermissionModal = FrontendDomain + "/modules/management/user/views/reset_permission_modal.html";

        ctrl._urlTask_Department_Permission = FrontendDomain + "/modules/management/user/views/task_department_permission.html";
        ctrl._urlTask_Project_Permission = FrontendDomain + "/modules/management/user/views/task_project_permission.html";
        ctrl._urlTask_Personal_Permission = FrontendDomain + "/modules/management/user/views/task_personal_permission.html";
        ctrl._urlTask_Statistic_Permission = FrontendDomain + "/modules/management/user/views/task_statistic_permission.html";
        ctrl._urlTask_Management_Permission = FrontendDomain + "/modules/management/user/views/task_management_permission.html";

        ctrl._urlDocument_Department_Permission = FrontendDomain + "/modules/management/user/views/document_department_permission.html";
        ctrl._urlDocument_Project_Permission = FrontendDomain + "/modules/management/user/views/document_project_permission.html";
        ctrl._urlDocument_Personal_Permission = FrontendDomain + "/modules/management/user/views/document_personal_permission.html";
        ctrl._urlDocument_General_Permission = FrontendDomain + "/modules/management/user/views/document_general_permission.html";
        ctrl._urlDocument_Share_Permission = FrontendDomain + "/modules/management/user/views/document_share_permission.html";
        ctrl._urlDocument_Study_Plan_Permission = FrontendDomain + "/modules/management/user/views/study_plan_permission.html";
        ctrl._urlDocument_Question_Answer_Permission = FrontendDomain + "/modules/management/user/views/question_answer_permission.html";
        ctrl._urlDocument_Training_Point_Permission = FrontendDomain + "/modules/management/user/views/training_point_permission.html";
        ctrl._urlEvent_Calendar_Permission = FrontendDomain + "/modules/management/user/views/event_calendar_permission.html";
        ctrl._urlCard_Management_Permission = FrontendDomain + "/modules/management/user/views/card_management.html";
    }

    /**function for logic */
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilterLoadUser() {
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
        ctrl.loadUser();
    }
    ctrl.changeActiveFilterData = function (val) {
        ctrl._activeFilterData = val;
        if (ctrl._checkActive === true) {
            ctrl.refreshData();
        }
    }

    ctrl.loadProject = function (params) {
        var dfd = $q.defer();
        user_service.loadProject(params.search, params.top, params.offset, ctrl.sort.query).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.countProject = function (params) {
        var dfd = $q.defer();
        user_service.countProject(params.search).then(function (res) {
            dfd.resolve(res.data.count);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadProject_details_m = function (params) {
        var dfd = $q.defer();
        user_service.loadProject_details_m(params._ids).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadUser_service() {
        var dfd = $q.defer();
        ctrl.users = [];
        var filter = generateFilterLoadUser();
        user_service.loadUser(filter.search, filter.isactive, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(function (res) {
            ctrl.users = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadUser = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "load", loadUser_service);
    }

    function loadDetails_service(action) {
        return function () {
            var dfd = $q.defer();

            user_service.loadDetails(action == 'info' ? ctrl._info_value.username : ctrl._update_value.username).then(function (res) {
                for (var i in $rootScope.Persons) {
                    if ($rootScope.Persons[i]._id === res.data.person) {
                        res.data.person = angular.copy($rootScope.Persons[i]);
                        break;
                    }
                }
                switch (action) {
                    case "info":
                        ctrl._info_value = res.data;
                        break;
                    case "update":
                        ctrl._update_value = res.data;
                        break;
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
    }

    ctrl.loadDetails = function (val) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "loadDetails", loadDetails_service(val));
    }

    function countUser_service() {
        var dfd = $q.defer();
        ctrl.users = [];
        var filter = generateFilterLoadUser();
        user_service.countUser(filter.search, filter.isactive).then(function (res) {
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

    ctrl.countUser = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "count", countUser_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        setModules();
        dfdAr.push(ctrl.loadUser());
        dfdAr.push(ctrl.countUser());

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
        dfdAr.push(ctrl.loadUser());
        dfdAr.push(ctrl.countUser());
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


    /**INSERT */
    ctrl.chooseDepartment = function (val) {
        ctrl._insert_value.department = angular.copy(val.id);
    }


    function generate_resetInsertValue() {
        ctrl._insert_value = {
            title: "",
            username: "",
            password: "",
            isactive: true
        };
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "insert");
        generate_resetInsertValue();
    }


    function insert_service() {
        var dfd = $q.defer();
        user_service.insert(
            ctrl._insert_value.title,
            ctrl._insert_value.username,
            ctrl._insert_value.password,
            ctrl._insert_value.language,
            ctrl._insert_value.isactive,
            ctrl._insert_value.department
        ).then(function () {
            ctrl.loadUser();
            dfd.resolve(true);
            $rootScope.statusValue.generate(ctrl._ctrlName, "User", "insert");
            $("#modal_User_Insert").modal("hide");
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "insert", insert_service);
    }

    /**UPDATE GENERAL */

    function generate_resetUpdateValue(val) {
        ctrl._update_value = angular.copy(val);
        ctrl.chooseModule(ctrl.Modules[0]);
        setRule();
    }

    ctrl.prepareUpdate = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "update");
        generate_resetUpdateValue(val);
        ctrl.loadDetails('update');
    }

    ctrl.chooseRole_update = function (val) {
        ctrl._update_value.role = val;
    }

    ctrl.chooseUser_update = function (val) {
        ctrl._update_value.user = val;
    }

    function update_service() {
        var dfd = $q.defer();
        user_service.update(ctrl._update_value._id,
            ctrl._update_value.title,
            ctrl._update_value.isactive,
            ctrl._update_value.role).then(function () {
                ctrl.loadUser();
                $timeout(function () {
                    $rootScope.statusValue.generate(ctrl._ctrlName, "User", "update");

                }, 1000);

                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.update_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "update", update_service);
    }

    /**DELETE */

    function generate_resetDeleteValue(val) {
        ctrl._delete_value = angular.copy(val);
    }

    ctrl.prepareDelete = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "delete");
        generate_resetDeleteValue(val);
    }

    function delete_service() {
        var dfd = $q.defer();
        user_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_User_Delete").modal('hide');
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "delete", delete_service);
    }

    /**RESET PASSWORD */

    function generate_resetResetPasswordValue(val) {
        ctrl._reset_password_value = angular.copy(val);
    }


    /**RESET PERMISSION */

    function generate_resetResetPermissionValue(val) {
        ctrl._reset_permission_value = angular.copy(val);
    }

    ctrl.prepareResetPassword = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "update");
        generate_resetResetPasswordValue(val);
    }

    ctrl.prepareResetPermission = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "update");
        generate_resetResetPermissionValue(val);
    }

    function reset_password_service() {
        var dfd = $q.defer();
        user_service.reset_password(ctrl._reset_password_value.username).then(function () {
            $("#modal_User_ResetPassword").modal('hide');
            ctrl.loadUser();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.reset_password = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "update", reset_password_service);
    }

    function reset_permission_service() {
        var dfd = $q.defer();
        user_service.reset_permission(ctrl._reset_permission_value.username).then(function () {
            $("#modal_User_ResetPermission").modal('hide');
            ctrl.loadUser();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.reset_permission = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "update", reset_permission_service);
    }

    /**PERMISSION */
    function pushRule(rule) {
        user_service.pushRule(ctrl._update_value._id, rule).then(function () { ctrl.loadUser(); }, function (err) { console.log(err) });
    }

    function removeRule(rule) {
        user_service.removeRule(ctrl._update_value._id, rule).then(function () { ctrl.loadUser(); }, function (err) { console.log(err) });
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
            case "DepartmentGroup":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/department_group_permission.html";
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
            case "Storage":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/storage_permission.html";
                break;
            case "WorkflowForm":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/workflow_form_permission.html";
                break;
            case "AdministrativeProcedures":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/administrative_procedures_permission.html";
                break;
            case "MeetingRoom":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/meeting_room_permission.html";
                break;
            case "EventCalendar":
                ctrl._urlPermission = FrontendDomain + "/modules/management/user/views/event_calendar_permission.html";
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
        { name: "Office.Signing.Department_Leader_Manage", type: "radio_project" },
        { name: "Office.Signing.Leader_Manage", type: "radio_project" },
        /**END SIGNING RULES */

        /**DISPATCH ARRIVED RULES */
        { name: "Office.DispatchArrived.Use", type: "checkbox" },
        { name: "OfficeDA.Manager", type: "checkbox" },
        { name: "Office.DispatchArrived.Manager", type: "checkbox" },
        { name: "Office.DispatchArrived.Lead", type: "checkbox" },
        { name: "Office.DispatchArrived.FollowDA", type: "checkbox" },
        { name: "Office.DispatchArrived.Confirm", type: "radio_department" },
        { name: "Office.DispatchArrived.ApproveLevel1", type: "checkbox" },
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
        { name: "Office.Task.Receive_task", type: "checkbox" },
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

        { name: "Office.Task.Show_StatisticExternal", type: "checkbox" },
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

        //Office.MeetingRoom.NotifyDepartment
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
        { name: "Office.CarManagement.ApproveExternal", type: "checkbox" },
        { name: "Office.CarManagement.Callendar", type: "checkbox" },

        /* ADVANCED SEARCH RULES */
        {name: "Office.AdvancedSearch.Use", type: "checkbox" },
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

    /** DOCUMENT PERMISION*/
    ctrl.tabDocument = "department";

    ctrl.switchDocumentTab = function (val) {
        ctrl.tabDocument = val;
    }

    function generate_resetImportValue() {
        ctrl.imported_users = []
        ctrl.importedFile = null
    }

    ctrl.chooseDepartmentImport = function (params, index) {
        ctrl.imported_users[index].department = params;
    };

    ctrl.prepareImport = function () {
        generate_resetImportValue();
        $rootScope.statusValue.generate(ctrl._ctrlName, "User", "import");
    }

    ctrl.validateXlsxFields = function (data) {
        for (let row of data) {
            for (let key in row) {
                if (!row[key]) {
                    return false;
                }
            }
        }
        return true;
    };


    ctrl.handleFile = function (params) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: "binary" });
            var firstSheetName = workbook.SheetNames[0];
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            $timeout(function() {
                ctrl.imported_users = jsonData.map((user) => ({
                    title: user.title,
                    username: user.username,
                    password: '' + user.password,
                    department: user.department,
                    email: user.email,
                    phone: user.phone,
                    isactive: true // Default value for isactive
                }));
                ctrl.imported_users.shift();
            });
          }
        reader.readAsBinaryString(params.file)
    };

    function import_service() {
        var promises = ctrl.imported_users.map(user =>  user_service.insert(
            user.title,
            user.username,
            user.password,
            user.language,
            user.isactive,
            user.department
        ));
    
        return $q.all(promises).then(function () {
            ctrl.loadUser();
            $rootScope.statusValue.generate(ctrl._ctrlName, "User", "import");
            $("#modal_User_Import").modal("hide");

            ctrl.showPopup = true;
            ctrl.titlePopup = 'Info';
            ctrl.contentPopup = `Import user template sucess`;
            ctrl.typePopup = 'success';
            $rootScope.$apply();
            return true;
        }).catch(function (err) {
            console.error("Error importing users:", err);
            if (err?.data?.mes == 'UserIsExists') {
                const username = `: ${JSON.parse(err.config.data).account} `;
                ctrl.showPopupImport = true;
                ctrl.titlePopup = `Warning`;
                ctrl.usernameError = username;
                ctrl.contentPopup = `UserIsExists`;
                ctrl.typePopup = 'warning';
                $rootScope.$apply();
            }
            return $q.reject(err);
        });
    }

  /**IMPORT USERS */
  ctrl.import_func = function () {
    return $rootScope.statusValue.execute(ctrl._ctrlName, "User", "import", import_service);
}

    ctrl.removeImportedUser = function (index) {
        ctrl.imported_users.splice(index, 1);
    };
    ctrl.closePopup = function () {
        ctrl.showPopup = false;
        ctrl.showPopupImport = false;
    };

    ctrl.removeExcelFile_insert = function () {
        var temp = [];
        ctrl.importedFile = angular.copy(temp);
        ctrl.isWatched = false;
    };
    
    function loadImportUserTemplate_service() {
        var dfd = $q.defer();
        ctrl.loadingTemplate = true;
        user_service
          .load_import_user_template()
          .then(
            function (res) {
              FileSaver.saveAs(res.data, "tep-tin-mau-them-nguoi-dung.xlsx");
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
    
    ctrl.loadUserImportTemplate = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "User",
          "loadImportUserTemplate",
          loadImportUserTemplate_service
        );
      };
    
}]);



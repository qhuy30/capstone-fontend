myApp.registerCtrl('task_quick_handle_controller', 
    ['task_service', 
    'workflow_play_service',
    'notify_service',
    '$q',
    '$rootScope', 
    '$filter',
    '$location', 
    '$timeout',
    'languageValue', 
    'registration_service', 
    'dispatch_arrived_service',
    'da_details_service',
    '$scope',
    function (
        task_service,
        workflow_play_service, 
        notify_service, 
        $q,
        $rootScope,
        $filter,
        $location, 
        $timeout,
        $languageValue,
        registration_service, 
        dispatch_arrived_service,
        da_details_service,
        $scope
    ) {
    /**declare variable */
    const _statusValueSet = [
        { name: "task_quick_handle_controller", action: "init" },
        { name: "Workflow", action: "load" },
        { name: "Workflow", action: "count" },
        { name: "Workflow", action: "approval" },
        { name: "Workflow", action: "reject" },
        { name: "Workflow", action: "return" },
        { name: "Workflow", action: "resubmit" },
        { name: "Workflow", action: "signAFile" },

        { name: "Workflow", action: "sign" },
        { name: "WFP", action: "approval" },
        { name: "WFP", action: "reject" },
        { name: "WFP", action: "return" },
        { name: "WFP", action: "resubmit" },

        { name: "Task", action: "insert" },
        { name: "Task", action: "load" },
        { name: "Task", action: "loadDetails" },
        { name: "Task", action: "count" },
        { name: "Task", action: "insertChallenge" },
        { name: "Task", action: "loadChallengeDetail" },
        { name: "Task", action: "insertGuidChallenge" },
        { name: "Task", action: "resolveChallenge" },
        { name: "Task", action: "comment" },
        { name: "Task", action: "receive_task" },
        { name: "Task", action: "reject_receive_task" },

        { name: "DispatchArrived", action: "load" },
        { name: "DispatchArrived", action: "count" },
        { name: "DispatchArrived", action: "forward" },
        { name: "DispatchArrived", action: "forward_CVP" },
        { name: "DispatchArrived", action: "return_CVP" },
        { name: "DispatchArrived", action: "forward_BGHOpinion" },
        { name: "DispatchArrived", action: "forward_unit" },
        { name: "DispatchArrived", action: "transfer_department_approve" },
        { name: "DispatchArrived", action: "seen_work" },


        { name: "News", action: "load" },
        { name: "News", action: "count" },
        { name: "News", action: "approve" },
        { name: "News", action: "reject" },
        { name: "News", action: "edit" },
        { name: "News", action: "approve_department" },

        { name: "Registration", action: "load" },
        { name: "Registration", action: "count" },
        { name: "Registration", action: "changeStatusRegistrationRoom" },
        { name: "Room", action: "loadRooms" },

        //Registration room
        { name: "MeetingRoom", action: "approve_department" },
        { name: "MeetingRoom", action: "reject_department" },
        { name: "MeetingRoom", action: "approve_management" },
        { name: "MeetingRoom", action: "reject_management" },
        { name: "MeetingRoom", action: "approve_lead" },
        { name: "MeetingRoom", action: "reject_lead" },
        { name: "MeetingRoom", action: "load_room_type" },

        { name: "MeetingRoom", action: "approve_recall_department" },
        { name: "MeetingRoom", action: "reject_recall_department" },
        { name: "MeetingRoom", action: "approve_recall_management" },
        { name: "MeetingRoom", action: "reject_recall_management" },
        { name: "MeetingRoom", action: "approve_recall_lead" },
        { name: "MeetingRoom", action: "reject_recall_lead" },

        //Event calendar
        { name: "EventCalendar", action: "approve_department"},
        { name: "EventCalendar", action: "reject_department"},
        { name: "EventCalendar", action: "approve_host"},
        { name: "EventCalendar", action: "reject_host"},
        { name: "EventCalendar", action: "approve_recall_department"},
        { name: "EventCalendar", action: "reject_recall_department"},
        { name: "EventCalendar", action: "approve_recall_host"},
        { name: "EventCalendar", action: "reject_recall_host"},

        //Car
        { name: "CarManagement", action: "approve_department" },
        { name: "CarManagement", action: "reject_department" },
        { name: "CarManagement", action: "approve_car_management" },
        { name: "CarManagement", action: "reject_car_management" },
        { name: "CarManagement", action: "approve_lead" },
        { name: "CarManagement", action: "reject_lead" },
        { name: "CarManagement", action: "approve_card_management" },
        { name: "CarManagement", action: "edit_card_management" },
        { name: "CarManagement", action: "reject_card_management" },
        { name: "CarManagement", action: "manager_assign_card" },
        { name: "CarManagement", action: "creator_receive_card" },
        { name: "CarManagement", action: "creator_return_card" },
        { name: "CarManagement", action: "manager_receive_card" },
        { name: "CarManagement", action: "load_driver_list" },
        { name: "CarManagement", action: "approve_lead_external" },
        { name: "CarManagement", action: "reject_lead_external" },
        // Recall
        { name: "CarManagement", action: "request_cancel" },
        { name: "CarManagement", action: "reject_recall" },
        { name: "CarManagement", action: "approve_recall_department" },
        { name: "CarManagement", action: "approve_recall_car_management" },
        { name: "CarManagement", action: "approve_recall_lead" },
    ];

    const idEditor_comment = "Task_comment";
    const idEditor_guidChallenge = "Task_guidChallenge";

    const TASK_RULE = {
        DIRECTOR_MANAGE: "Office.Task.Director_Manage",
        LEADER_MANAGE: "Office.Task.Leader_Mangage",
        DEPARTMENT_LEADER_MANAGE: "Office.Task.Department_Leader_Manage"
    }

    const TASK_STATUS = {
        WAITING_FOR_APPROVAL: "WaitingForApproval",
        WAITING_FOR_ACCEPT: "WaitingForAccept",
        REJECTED: "Rejected",
        PENDING_APPROVAL: "PendingApproval",
        NOT_STARTED_YET: "NotStartedYet",
        PROCESSING: "Processing",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
        DONE: "Done",
        NOT_SEEN: "NotSeen",
    };

    var ctrl = this;
    ctrl._rooms = []
    ctrl.Departments = [];
    ctrl._insert_value = {};
    ctrl.challengeFiles = [];
    ctrl.guidChallengeFiles = [];
    ctrl.$languageValue = $languageValue;
    ctrl._customToastScope = angular.element(document.querySelector('#custom-toast-container')).scope();
    var idEditor = "insertTask_inDepartmentDashboard_content";
    var idEditor_challenge = "insertChallenge_content";
    ctrl.collapseWorkFlow = false;
    ctrl.collapseTask = false;
    ctrl.collapseRoom = false;
    ctrl.collapseNews = false;
    ctrl.collapseDocument = false;

    ctrl.now = new Date();

    ctrl.logininfo = $rootScope.logininfo;

    ctrl._urlInsertHeadTaskModal = FrontendDomain +
        "/modules/office/task/views/insert_head_task_in_department_dashboard.html";

    ctrl._urlHandleModal_workflow = FrontendDomain +
        "/modules/office/task/views/quick_handle/workflow_modal.html";

    ctrl._urlWorkflowPart = FrontendDomain +
        "/modules/office/task/views/quick_handle/workflow_part.html";

    ctrl._urlTaskPart = FrontendDomain +
        "/modules/office/task/views/quick_handle/task_part.html";

    ctrl._urlDocumentPart = FrontendDomain +
        "/modules/office/task/views/quick_handle/document_part.html";

    ctrl._urlCommentModal = FrontendDomain +
        "/modules/office/task/views/quick_handle/task_comment_modal.html";

    ctrl._urlComment = FrontendDomain +
        "/modules/office/task/views/quick_handle/task_part_comment.html";

    ctrl._urlNewsPart = FrontendDomain +
        "/modules/office/task/views/quick_handle/news_part.html";

    ctrl._urlRoomPart = FrontendDomain +
        "/modules/office/task/views/quick_handle/room_part.html";

    ctrl._urlChangeStatusRegistrationRoomModal = FrontendDomain +
        "/modules/office/task/views/change_status_room_modal.html";

    ctrl._ctrlName = "task_quick_handle_controller";
    ctrl._urlInsertChallengeModal = FrontendDomain + "/modules/office/task/views/insert_challenge_modal.html";
    ctrl._urlDetailChallengeModal = FrontendDomain + "/modules/office/task/views/detail_challenge_modal.html";

    ctrl._urlEditModal_news =
        FrontendDomain + "/modules/office/task/views/edit_modal_news.html";
    ctrl._urlApproveModal_news =
        FrontendDomain + "/modules/office/task/views/approve_modal_news.html";
    ctrl._urlRejectModal_news =
        FrontendDomain + "/modules/office/task/views/reject_modal_news.html";
    ctrl._urlAssessModal_Task_Receiver = FrontendDomain + "/modules/office/task/views/Task_receiver_acsses.html";
    

    //Registration
    ctrl._urlAssessModal_room = FrontendDomain + "/modules/office/task/views/quick_handle/registration/assess_room_modal.html";
    ctrl._urlAssessModal_DepartmentApprove_room = FrontendDomain + "/modules/office/task/views/quick_handle/registration/room_department_approve.html";
    ctrl._urlAssessModal_event_calendar = FrontendDomain + "/modules/office/task/views/quick_handle/registration/assess_event_calendar_modal.html";
    ctrl._urlAssessModal_car = FrontendDomain + "/modules/office/task/views/quick_handle/registration/assess_car_modal.html";
    ctrl._urlAssessModal_DepartmentApprove_car = FrontendDomain + "/modules/office/task/views/quick_handle/registration/car_registration_lead_deparment_approve.html";

    // Dispatch Arrived
    ctrl._urlForwardModal = FrontendDomain + "/modules/office/task/views/quick_handle/registration/dispatch_arrived_forward.html";
    ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


    ctrl.numOfItemPerPage = 5;

    ctrl.totalItems_workflow = 0;
    ctrl.totalItems_task = 0;
    ctrl.totalItems_registration = 0;
    ctrl.totalItems_document = 0;
    ctrl.totalItems_news = 0;

    ctrl.offset_workflow = 0;
    ctrl.offset_task = 0;
    ctrl.offset_registration = 0;
    ctrl.offset_document = 0;
    ctrl.offset_news = 0;

    ctrl.sort_workflow = { name: "_id", value: false, query: { _id: -1 } };
    ctrl.sort_task = { name: "_id", value: false, query: { _id: -1 } };
    ctrl.sort_registration = { name: "_id", value: false, query: { _id: -1 } };
    ctrl.sort_document = { name: "_id", value: false, query: { _id: -1 } };
    ctrl.sort_news = { name: "_id", value: false, query: { _id: -1 } };

    ctrl._searchFilter_workflow = "";
    ctrl._searchFilter_task = "";
    ctrl._searchFilter_registration = "";
    ctrl._searchFilter_document = "";
    ctrl._searchFilter_news = "";

    ctrl.currentPage_workflow = 1;
    ctrl.currentPage_task = 1;
    ctrl.currentPage_registration = 1;
    ctrl.currentPage_document = 1;
    ctrl.currentPage_news = 1;

    ctrl.workflows = [];
    ctrl.tasks = [];
    ctrl.registrations = [];
    ctrl.documents = [];
    ctrl.news = [];

    ctrl.comment_workflow = "";
    ctrl.selectedItem_workflow = {};
    ctrl.selectedItem_task = {};
    ctrl.action_workflow = "";
    ctrl.relatedFiles_workflow = [];

    ctrl._notyetInit_workflow = true;
    ctrl._notyetInit_document = true;
    ctrl._notyetInit_registration = true;
    ctrl._notyetInit_task = true;
    ctrl._notyetInit_news = true;
    ctrl.isToastVisible = false;

    ctrl.checkbox_gonnalate_task = true;
    ctrl.checkbox_overdue_task = true;
    ctrl.checkbox_is_get_all = false;
    ctrl.checkbox_dispatch_task = false;
    ctrl.checkbox_receiver_task = false;
    ctrl.checkbox_approval_receiver_task = false;

    ctrl.checkbox_filter_room = true;
    ctrl.checkbox_filter_vehicle = true;
    ctrl.checkbox_filter_work_schedule = true;
    ctrl.reason_reject_registration = '';
    ctrl._assess_registration_value = {};

    $scope.$on("notify:AccessDone", function () {
        ctrl.load_news();
    });

    ctrl.hostScopes = [
        {
            val: 'internal',
            label: 'Internal school unit'
        },
        {
            val: 'external',
            label: 'External school unit'
        }
    ];

    ctrl.driverList = [];
    ctrl._roomTypes = [];

    ctrl._hintNoteSet = [
        'I agree',
        'I refuse',
        'Incorrect information',
        'Out of cars',
        'Out of cards',
    ];
    ctrl.commentFiles = [];

    ctrl._forward_value = {}
    ctrl.checkbox_needtohandle_document = true;
    ctrl.checkbox_gonnalate_document = false;

    ctrl.checkbox_needtohandle_work_flow_play = true;
    ctrl.checkbox_gonnalate_work_flow_play = false;

    function removeHtmlTags(str) {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    }

    $rootScope.$watch('reloadObj', function (value) {
        if (value && value.type) {
            switch (value.type) {
              case "workflow_play":
                if ((ctrl.selectedItem_workflow.code = value.value)) {
                  ctrl.load_workflow_play();
                }
                $rootScope.clearReloadObj();
                break;

              case "task":
                if ((ctrl.selectedItem_task.code = value.value)) {
                  ctrl.load_task();
                }
                $rootScope.clearReloadObj();
                break;
            }
        }
    })

    ctrl.prepareDetailChallenge = function (challenge, taskId) {
        ctrl.challenge = challenge;
        ctrl.thisTaskId = taskId;
        ctrl.loadChallengeDetail();
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
                function (err) {
                    res = undefined;
                    dfd = undefined;
                }
            );
            return dfd.promise;
        };
    };

    ctrl.resetChallengeFileInput = function () {
        var fileInput = document.getElementById("file-challenge-upload");
        fileInput.value = "";
    };

    ctrl.removeChallengeFiles = function (name) {
        ctrl.challengeFiles = ctrl.challengeFiles.filter((e) => e.name !== name);
        ctrl.resetChallengeFileInput();
    };

    ctrl.blurPushChanllenge = function () {
        ctrl.challengeFiles = [];
        ctrl.resetChallengeFileInput();
    };

    ctrl.prepareInsertChallenge = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insertChallenge");
        if (val) {
            ctrl.thisTaskId = val.item._id;
            ctrl.from_department = val.item.from_department
            ctrl._parentChanllengeTitle = val.item.title;
        } else {
            ctrl.thisTaskId = undefined;
            ctrl.from_department = undefined
            ctrl._parentChanllengeTitle = undefined;
        }
        $("#" + idEditor_challenge).summernote({
            placeholder: $filter("l")("InputContentHere"),
            height: 300,
            toolbar: [
                ['style', ['style']],
                ['style', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']],
                ['misc', ['fullscreen', 'help']]
            ]
        });
        $("#" + idEditor_challenge).summernote('code', '');
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
            repetitive: {
                has_endDate: false,
                per: 1,
                cycle: "day",
                endDate: null
            },
        };
    }

    //INSERT
    ctrl.TaskPriority = {
        master_key: "task_priority",
        load_details_column: "value",
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
    ctrl.chooseFromDate_insert = function (val) {
        ctrl._insert_value.from_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseToDate_insert = function (val) {
        ctrl._insert_value.to_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseDepartment_insert = function (val) {
        ctrl._insert_value.currentDepartment = val.id;
    };
    ctrl.chooseTaskPriority_insert = function (val) {
        const priority = task_service.taskPriorityTransform(val.value);
        ctrl._insert_value.priority = priority.key;
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

    ctrl.removeFile_insert = function (item) {
        ctrl._insert_value.files = ctrl._insert_value.files.filter(
            (e) => e.name !== item.name
        );
    };

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
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

        ctrl._insert_value = {
            files: [],
            code: "",
            task_list: [],
            main_person: [],
            participant: [],
            observer: [],
            parent: [],
            label: [],
            da_book: "",
            number: 1,
            to_date: myToday.getTime(),
            author: "",
            agency_promulgate: "",
            to_date: endDay.getTime(),
            note: "",
            type: 1,
            priority: "Medium",
            is_legal: false,
            is_assign_task: false,
            excerpt: "",
            level: "HeadTask",
            _filterTaskPriority: ""
        };
    }

    function insert_service() {
        return task_service.insert(
            ctrl._insert_value.files,
            ctrl._insert_value.title,
            ctrl._insert_value.note,
            ctrl._insert_value.task_list,
            ctrl._insert_value.main_person,
            ctrl._insert_value.participant,
            ctrl._insert_value.observer,
            ctrl._insert_value.from_date,
            ctrl._insert_value.to_date,
            ctrl._insert_value.has_time,
            ctrl._insert_value.hours,
            task_service.taskPriorityTransform(ctrl._insert_value.priority).key,
            ctrl._insert_value.type,
            ctrl._insert_value.head_task_id,
            null,
            ctrl._insert_value.currentProject,
            ctrl._insert_value.currentDepartment,
            undefined,
            ctrl._insert_value.level,
            ctrl._insert_value.label,
            false,
            [],
            {}
        );
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "insert",
            insert_service
        );
    };

    function insertChallenge_service() {
        var dfd = $q.defer();
        if ($("#" + idEditor_challenge).summernote("code")) {
            task_service
                .comment(
                    $("#" + idEditor_challenge).summernote("code"),
                    type = 'Challenge',
                    '',
                    ctrl.thisTaskId,
                    ctrl.challengeFiles,
                )
                .then(
                    function (res) {
                        dfd.resolve(true);
                        $("#" + idEditor_challenge).summernote("code", "");
                        $("#modal_Task_InsertChallenge").modal("hide");
                        ctrl.challengeFiles = [];
                        ctrl._customToastScope.addToastValue({
                            message: $filter('l')('AddChallengeSuccess'),
                            type: 'success'
                        });
                        ctrl.loadDetails().then(function () {
                            ctrl.tasks = ctrl.tasks.map(task => task._id === ctrl.Item._id ? ctrl.Item : task);
                        });
                    }
                )
                .catch(function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
                );
        }
        return dfd.promise;
    }

    function loadDetails_Service() {
        var dfd = $q.defer();
        task_service.loadDetails(ctrl.thisTaskId, undefined, ctrl.from_department).then(function (res) {
            ctrl.Item = res.data;
            dfd.resolve(ctrl.Item);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadDetails",
            loadDetails_Service
        );
    }

    ctrl.insertChallenge = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "insertChallenge",
            insertChallenge_service
        );
    }
    //Load resource

    function load_employee_detail() {
        var dfd = $q.defer();
        task_service.loadEmployeeDetail($rootScope.logininfo.data.employee).then(function (res) {
            ctrl.sign = res.data.signature.link;
            ctrl.quotationMark = res.data.quotationMark.link;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.toogleCollapseWorkFlow = function () {
        ctrl.collapseWorkFlow = !ctrl.collapseWorkFlow;
    };

    ctrl.toogleCollapseTask = function () {
        ctrl.collapseTask = !ctrl.collapseTask;
    };

    ctrl.toogleCollapseDocument = function () {
        ctrl.collapseDocument = !ctrl.collapseDocument;
    };

    ctrl.toogleCollapseNews = function () {
        ctrl.collapseNews = !ctrl.collapseNews;
    };

    ctrl.toogleCollapseRoom = function () {
        ctrl.collapseRoom = !ctrl.collapseRoom;
    };

    // WORKFLOW
    ctrl.DocumentType_Config = {
        master_key: "document_type",
        load_details_column: "value"
    };

    ctrl.function_apply_suggestions = ['signing'];
    ctrl.function_apply_suggestions_car = ['registration_car'];

    const WORKFLOW_PLAY_RULE = {
        DEPARTMENT_LEADER_MANAGE: "Office.Signing.Department_Leader_Manage",
        LEADER_MANAGE: "Office.Signing.Leader_Manage",
        USE: "Office.Signing.Use",
    };

    const WORKFLOW_PLAY_STATUS = {
        PENDING: "Pending",
        REJECTED: "Rejected",
        SAVED_ODB: "SaveODB",
        APPROVED: "Approved",
        RETURNED: "Returned",
        COMPLETED: "Completed",
        EXPLOITED_DOCUMENT: "ExploitedDocument"
    };

    const NODE_TYPE = {
        ONE: "one",
        ALL: "all",
        PROCESS: "process",
        RECEIVER: "receiver"
    };

    function getPermissionPropertiesWFP(item) {
        if(item.status === 'Rejected'){
            return {}
        }
        
        let allow_assess = false;
        let allow_assessVT = false;
        let allow_sign = false;
        let allow_return = false;
        let allow_create_dispatch_out = false;
        let allow_additional_document = false;
        let currentNode;

        if(item.node!== -1){
            currentNode = item.flow[item.node -1];
        }

        
        
        if(currentNode){

            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type !=='process'){
                allow_assess = true;
                if(item.node !== 1 && item.node !== -1){
                    allow_return = true;
                }
            }
    
            if(allow_assess && currentNode && currentNode.items[0].signature  && currentNode.type !=='process'){
                const sign = item.signatureTags.find(s => s.label === currentNode.items[0].signature);
                if(sign && !sign.isSigned){
                    allow_sign = true;
                }
            }
    
            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type ==='process' && item.status !== 'Waiting_Additional_Documents'){
                allow_create_dispatch_out = true;
            }

            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type ==='process' && item.status === 'Waiting_Additional_Documents'){
                allow_additional_document = true;
            }

            // if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type ==='one' && item.status === 'Pending'){
            //     allow_assessVT = true;
            // }

        }

        return {
            allow_assess,
            allow_sign,
            allow_return,
            allow_create_dispatch_out,
            allow_additional_document,
            // allow_assessVT,
        }
    }

    function generateFilter_workflow() {
        const obj = {};
        obj.checks = [];

        if (ctrl._searchFilter_workflow !== "") {
            obj.search = angular.copy(ctrl._searchFilter_workflow);
        }

        const needToHandleWFP = ctrl.checkbox_needtohandle_document;
        const gonnaLateWFP = ctrl.checkbox_gonnalate_document;

        if (!needToHandleWFP && !gonnaLateWFP) {
            obj.checks.push(CHECKS_ON_UI.NEED_HANDLE, CHECKS_ON_UI.GONNA_LATE);
        } else {
            if (needToHandleWFP) {
                obj.checks.push(CHECKS_ON_UI.NEED_HANDLE);
            }
            if (gonnaLateWFP) {
                obj.checks.push(CHECKS_ON_UI.GONNA_LATE);
            }
        }

        return obj;
    }

    function resetPaginationInfo_workflows() {
        ctrl.currentPage_workflow = 1;
        ctrl.offset_workflow = 0;
    }

    function load_workflow_play_service() {
        var dfd = $q.defer();
        ctrl.workflows = [];
        let _filter = generateFilter_workflow();
        task_service
            .load_workflowplay_tohandle(
                _filter.search,
                _filter.documentType,
                ctrl.numOfItemPerPage,
                ctrl.offset_workflow,
                ctrl.sort_workflow.query,
                _filter.checks
            )
            .then(
                function (res) {
                    ctrl.workflows = res.data;
                    ctrl.workflows.forEach((item, index) => {
                        if (item.content) {
                            item.content = removeHtmlTags(item.content);
                        }
                        ctrl.workflows[index] = {
                            ...item,
                            ...getPermissionPropertiesWFP(item)
                        }
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

    ctrl.load_workflow_play = function (val) {
        if (val != undefined) { ctrl.offset_workflow = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "load", load_workflow_play_service);
    }

    function count_workflow_play_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_workflow();
        task_service
            .count_workflowplay_tohandle(
                _filter.search,
                _filter.checks,
            )
            .then(
                function (res) {
                    ctrl.totalItems_workflow = res.data.count;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_workflow_play = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "count", count_workflow_play_service);
    }

    ctrl.refreshData_workflow = function () {
        var dfdAr = [];
        resetPaginationInfo_workflows();
        dfdAr.push(ctrl.load_workflow_play());
        dfdAr.push(ctrl.count_workflow_play());
        return $q.all(dfdAr);
    }



    ctrl.loadfile_workflow = function (params) {
        return function () {
            var dfd = $q.defer();
            task_service.loadFileInfo_workflow(params.id, params.name).then(function (res) {
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

    function approval_workflow_service() {
        var dfd = $q.defer();
        task_service.approval(ctrl.selectedItem_workflow._id, ctrl.comment_workflow, ctrl.relatedFiles_workflow).then(function (res) {
            dfd.resolve(true);
            ctrl.refreshData_workflow();
            $("#quick_handle_workflow").modal("hide");
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.approval_workflow = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "approval", approval_workflow_service);
    }

    function reject_workflow_service() {
        var dfd = $q.defer();
        task_service.reject(ctrl.selectedItem_workflow._id, ctrl.comment_workflow, ctrl.relatedFiles_workflow).then(function (res) {
            dfd.resolve(true);
            ctrl.refreshData_workflow();
            $("#quick_handle_workflow").modal("hide");
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.reject_workflow = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "reject", reject_workflow_service);
    }


    function return_workflow_service() {
        var dfd = $q.defer();
        task_service.return(ctrl.selectedItem_workflow._id, ctrl.comment_workflow, ctrl.relatedFiles_workflow).then(function (res) {
            dfd.resolve(true);
            ctrl.refreshData_workflow();
            $("#quick_handle_workflow").modal("hide");

            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.return_workflow = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "return", return_workflow_service);
    }

    function signAFile_workflow_service(params) {
        let fileName = params.name;
        return function () {
            var dfd = $q.defer();
            task_service.signAFile(ctrl.selectedItem_workflow._id, fileName).then(function (res) {
                dfd.resolve(true);
                ctrl.refreshData_workflow();
                $("#quick_handle_workflow").modal("hide");
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.signAFile_workflow = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "signAFile", signAFile_workflow_service(ctrl.selectedItem_workflow.attachment[0]));
    }


    ctrl.prepareToHandle_workflow = function (item, action) {
        ctrl.comment_workflow = "";
        ctrl.action_workflow = action;
        ctrl.selectedItem_workflow = item;
        ctrl.relatedFiles_workflow = [];
    }

    ctrl.removeRelatedFile_workflow = function (item) {
        ctrl.relatedFiles_workflow = ctrl.relatedFiles_workflow.filter(e => e.name !== item.name);
    }

    function resubmit_workflow_service() {
        var dfd = $q.defer();
        task_service.resubmit(ctrl.selectedItem_workflow._id, ctrl.comment_workflow, ctrl.relatedFiles_workflow).then(function (res) {
            dfd.resolve(true);
            ctrl.refreshData_workflow();
            $("#quick_handle_workflow").modal("hide");
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.resubmit = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "resubmit", resubmit_workflow_service);
    }

    //TASK
    ctrl.prepareToHandle_task = function (item) {
        ctrl.selectedItem_task = item;
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
  
    ctrl.receive_task_quick_handlde = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "receive_task", receive_task_service);
    }

    function receive_task_service(){
        const dfd = $q.defer();
        task_service.receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
            function(){
            $("#modal_Receive_Task_Assess_QH_detail").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData_task();
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
    
    ctrl.reject_receive_task_quickhandle = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "reject_receive_task", reject_receive_task_service);
    }

    function reject_receive_task_service(){
    const dfd = $q.defer();
    task_service.reject_receive_task(ctrl._assess_value.code, ctrl._assess_value.note).then(
        function(){
        $("#modal_Receive_Task_Assess_QH_detail").modal("hide");
        dfd.resolve(true);
        ctrl.refreshData_task();
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
            $("#modal_Receive_Task_Assess_QH_detail").modal("hide");
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
            $("#modal_Receive_Task_Assess_QH_detail").modal("hide");
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
  

    function generateFilter_task() {
        var obj = {};
        if (ctrl._searchFilter_task !== "") {
            obj.search = angular.copy(ctrl._searchFilter_task);
        }
        obj.state = [];

        if (ctrl.checkbox_gonnalate_task) {
            obj.state.push("GonnaLate");
        }

        if (ctrl.checkbox_overdue_task) {
            obj.state.push("Overdue");
        }
        
        if (ctrl.checkbox_dispatch_task) {
            obj.is_dispatch_arrived = true; 
        }

        if (ctrl.checkbox_receiver_task) {
            obj.is_receiver_task = true; 
        }

        if (ctrl.checkbox_approval_receiver_task) {
            obj.is_approval_receiver_task = true; 
        }

        if (ctrl.checkbox_is_get_all) {
            obj.is_get_all = true;
        }
        return obj;
    }

    function resetPaginationInfo_task() {
        ctrl.currentPage_task = 1;
        ctrl.offset_task = 0;
    }


    function load_task_service() {
        var dfd = $q.defer();
        ctrl.tasks = [];
        let _filter = generateFilter_task();
        task_service
            .load_task_quickhandle(
                _filter.search,
                _filter.state,
                _filter.is_dispatch_arrived,
                _filter.is_receiver_task,
                _filter.is_approval_receiver_task,
                _filter.is_get_all,
                ctrl.numOfItemPerPage,
                ctrl.offset_task,
            )
            .then(
                function (res) {
                    ctrl.tasks = res.data.map(
                      (task) => (task = { ...task, ...$filter('getPermissionTask')(task), })
                    );

                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.load_task = function (val) {
        if (val != undefined) { ctrl.offset_task = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "load", load_task_service);
    }

    function count_task_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_task();
        task_service
            .count_task_quickhandle(
                _filter.search,
                _filter.state,
                _filter.is_dispatch_arrived,
                _filter.is_receiver_task,
                _filter.is_get_all
            )
            .then(
                function (res) {
                    ctrl.totalItems_task = res.data[0]?.count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_task = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "count", count_task_service);
    }

    ctrl.refreshData_task = function () {
        if (!ctrl._notyetInit_task) {
            var dfdAr = [];
            resetPaginationInfo_task();
            dfdAr.push(ctrl.load_task());
            dfdAr.push(ctrl.count_task());
            return $q.all(dfdAr);
        }
    }

    ctrl.loadfile_task = function (params) {
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
                function (err) { }
            );
            return dfd.promise;
        };
    };

    //QUICK_HANDLE_CHALLENGE
    ctrl.focusGuidChallenge = function () {
        ctrl.showPushGuidChallenge = true;
        $("#" + idEditor_guidChallenge).summernote('code', '');
    }

    ctrl.blurPushGuidChallenge = function () {
        ctrl.showPushGuidChallenge = false;
        $("#" + idEditor_guidChallenge).summernote('code', '');
    }

    ctrl.resetGuidChallengeFileInput = function () {
        var fileInput = document.getElementById("file-guid-challenge-upload");
        fileInput.value = "";
    };

    ctrl.removeGuidChallengeFiles = function (name) {
        ctrl.guidChallengeFiles = ctrl.guidChallengeFiles.filter((e) => e.name !== name);
        ctrl.resetGuidChallengeFileInput();
    };

    ctrl.insertGuidChallenge = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "insertGuidChallenge",
            insertGuidChallenge_service
        );
    }

    function insertGuidChallenge_service() {
        var dfd = $q.defer();
        if ($("#" + idEditor_guidChallenge).summernote("code")) {
            task_service
                .comment(
                    $("#" + idEditor_guidChallenge).summernote("code"),
                    type = 'GuidToResolveChallenge',
                    ctrl.challenge.id,
                    ctrl.thisTaskId,
                    ctrl.guidChallengeFiles,
                )
                .then(
                    function (res) {
                        $("#" + idEditor_guidChallenge).summernote("code", "");
                        ctrl.guidChallengeFiles = [];
                        ctrl.blurPushGuidChallenge();
                        ctrl.resetGuidChallengeFileInput();
                        ctrl.loadChallengeDetail();
                        dfd.resolve(true);
                        res = undefined;
                        dfd = undefined;
                    },
                    function (err) {
                        dfd.reject(err);
                        err = undefined;
                        dfd = undefined;
                    }
                );
        }
        return dfd.promise;
    }

    function resolveChallenge_service() {
        var dfd = $q.defer();
        task_service
            .comment(
                content = '',
                type = 'ChallengeResolver',
                ctrl.challenge.id,
                ctrl.thisTaskId
            )
            .then(
                function (res) {
                    dfd.resolve(true);
                    $("#" + idEditor_guidChallenge).summernote("code", "");
                    ctrl.guidChallengeFiles = [];
                    ctrl.blurPushGuidChallenge();
                    ctrl.resetGuidChallengeFileInput();
                    $('#modal_Task_DetailChallenge').modal('hide');
                    ctrl._customToastScope.addToastValue({
                        message: $filter('l')('ChallengeResolved'),
                        type: 'success'
                    });
                    ctrl.loadDetails().then(function () {
                        ctrl.tasks = ctrl.tasks.map(task => task._id === ctrl.Item._id ? ctrl.Item : task);
                    });
                }
            )
            .catch(function (err) {
                dfd.reject(err);
                err = undefined;
            }
            );
        return dfd.promise;
    }

    ctrl.resolveChallenge = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "resolveChallenge");
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "resolveChallenge",
            resolveChallenge_service
        );
    }

    //QUICK_HANDLE_COMMENT
    ctrl.focusComment = function () {
        ctrl.showPushComment = true;
        $("#" + idEditor_comment).summernote('code', '');
    }

    ctrl.resetFileInput = function () {
        var fileInput = document.getElementById("file-upload");
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


    ctrl.prepareComment = function (item) {
        ctrl.thisTaskId = item._id;
        ctrl.from_department = item.from_department;
        ctrl.loadDetails();
    }

    function loadDetails_Service() {
        var dfd = $q.defer();
        task_service.loadDetails(ctrl.thisTaskId, undefined, ctrl.from_department).then(function (res) {
            ctrl.Item = res.data;
            ctrl.Item.sortedComments = $filter('groupAndSortComments')(ctrl.Item.comment);
            dfd.resolve(ctrl.Item);
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadDetails",
            loadDetails_Service
        );
    }

    function loadChallengeDetail_Service() {
        var dfd = $q.defer();
        task_service.loadDetails(ctrl.thisTaskId, undefined, ctrl.from_department).then(function (res) {
            ctrl._challenge = res.data;
            ctrl._guidChallenges = ctrl._challenge.comment.filter((comment) =>
                comment.type === "GuidToResolveChallenge" && comment.challenge_id === ctrl.challenge.id
            )
            ctrl._countGuidChallenges = ctrl._guidChallenges.length
            dfd.resolve(ctrl._challenge);
            dfd = undefined;
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
            dfd = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadChallengeDetail = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadChallengeDetail",
            loadChallengeDetail_Service
        );
    }

    function pushComment_service() {
        var dfd = $q.defer();

        if ($("#" + idEditor_comment).summernote("code")) {
            task_service.comment($("#" + idEditor_comment).summernote("code"),
             'Comment', '', ctrl.thisTaskId, ctrl.commentFiles).then(function (res) {
                $("#" + idEditor_comment).summernote("code", "");
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

    ctrl.pushComment = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "comment",
            pushComment_service
        );
    };

    function pushRemindComment_Service() {
        var dfd = $q.defer();
        task_service.comment('Reminder of work due date', 'Remind', '', ctrl.thisTaskId).then(function () {
            dfd.resolve(true);
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('ReminderSuccessful'),
                type: 'success'
            });
        });
        return dfd.promise;
    }

    ctrl.pushRemindComment = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "comment",
            pushRemindComment_Service
        );
    }

    ctrl.countRemindCmtByUser = function (item) {
        if (!item || !Array.isArray(item.comment)) {
            return $filter('l')('YouHaveNotReminded');
        }
    
        var filterCommentsRemindByUser = item.comment.filter(function (comment) {
            return comment.type === 'Remind' && comment.username === ctrl.logininfo.username;
        });
    
        var count_RemindCmtByUser = filterCommentsRemindByUser.length;
    
        if (count_RemindCmtByUser > 0) {
            return $filter('l')('YouHaveReminded') + ': ' + count_RemindCmtByUser;
        } else {
            return $filter('l')('YouHaveNotReminded');
        }
    };

    ctrl.checkLatestCommentUser = function (item) {
        if (!item || !Array.isArray(item.comment) || item.comment.length === 0) {
            return '';
        } 
        var latestCommentUser = item.comment[0].username;
        if (latestCommentUser === ctrl.logininfo.username) {
            return $filter('l')('YouJustCommented') + '.';
        } else {
            return '';
        }
    };
    

    ctrl.getCommentCountWithoutCancel = function (comments) {
        var nonCancelComments = (comments || []).filter(function (comment) {
            return comment.type !== 'Cancelled';
        });
        return nonCancelComments.length;
    }

    //DOCUMENT - DISPATCH ARRIVED
    ctrl.function_apply_suggestions_da = ['da'];
    ctrl.function_apply_suggestions = ['da'];
    
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
        APPROVED: "Approved"
    };

    const CHECKS_ON_UI = {
        NEED_HANDLE: "need_handle",
        GONNA_LATE: "gonna_late"
    }

    ctrl.IncommingDispatchBook_Config = {
        master_key: "incomming_dispatch_book",
        load_details_column: "value",
    };
    ctrl.KindOfDispatchTo_Config = {
        master_key: "document_type",
        load_details_column: "value",
    };
    ctrl.Field_Config = {
        master_key: "field",
        load_details_column: "value"
    };

    ctrl.function_apply_suggestions_room = ['registration_room'];

    ctrl.securityLevel_Config = {
        master_key: "security_level",
        load_details_column: "value",
    };
    ctrl.IncommingDispatchPririoty_Config = {
        master_key: "incomming_dispatch_priority",
        load_details_column: "value"
    };
    ctrl.notify_group_config = {
        master_key: "notify_group",
        load_details_column: "value",
      };

    ctrl.loadLabel = function ({ search, top, offset, sort }) {
        var dfd = $q.defer();
        task_service.load_label2(search, top, offset, sort).then(
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
        ctrl._forward_value.task_label = value;
    };

    ctrl.chooseReleaseDate_forward = function (params) {
        ctrl._forward_value.release_date = params;
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
    ctrl.change_incoming_number_forward = function(){
        if(ctrl._numberUsed.filter(item => item !== ctrl._forward_value.incoming_number_old).includes(ctrl._forward_value.incoming_number * 1) || ctrl._forward_value.incoming_number * 1 === 0){
          ctrl._forward_value.invalid_incoming_number = true;
        }else{
          ctrl._forward_value.invalid_incoming_number = false;
        }
    }
    ctrl.chooseIncommingDate_forward = function (val) {
        ctrl._forward_value.incomming_date = val.getTime();
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
    ctrl.pickUrgencyLevel_forward = function(val){
        ctrl._forward_value.urgency_level = val.value;
    }
    ctrl.chooseDateSign_forward = function (val) {
        ctrl._forward_value.date_sign = val.getTime();
    };
    ctrl.chooseExpried_forward = function (val) {
        ctrl._forward_value.expried = val.getTime();
    };
    ctrl.removeFile_forward = function (item) {
        if (item.id) {
            ctrl._forward_value.incoming_file_remove.push(item.id);
        }
        ctrl._forward_value.incoming_file = ctrl._forward_value.incoming_file.filter((file) => file.name !== item.name);
    }
    ctrl.removeFileAttachment_forward = function (item) {
        if (item.id) {
          ctrl._forward_value.attachments_remove.push(item.id);
        }
        ctrl._forward_value.attachments = ctrl._forward_value.attachments.filter(file => file.name !== item.name);
    };
    ctrl.pickViewOnlyDepartment_forward = function (val) {
        ctrl._forward_value.department_receiver_ar = angular.copy(val);
    };
    ctrl.chooseSubmissionDepartment_forward = function (val) {
        ctrl._forward_value.department_execute = val.id;
    }

    function checkRuleSeenWork(item) {
        if(!$filter('checkRuleCheckbox')(RULE_DISPATCH.FOLLOW)){
            return false;
        }
        // Kiểm tra nếu không có department_receiver hoặc mảng rỗng
        if (!item.department_receiver || item.department_receiver.length === 0) {
            return false;
        }
    
        // Tìm phòng ban đáp ứng điều kiện rule dispatch
        const unreviewedDepartment = item.department_receiver.find(department => {
            return department.department === $rootScope.logininfo.data.department && !department.seen;
        });
    
        // Trả về true nếu tìm thấy phòng ban chưa xem và thỏa mãn điều kiện rule
        return !!unreviewedDepartment;
    }

    ctrl.forward_BGHOpinion = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "forward_BGHOpinion", access_service_DA("forward_BGHOpinion"));
    }
    ctrl.return_CVP = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "return_CVP", access_service_DA("return_CVP"));
    }
    ctrl.forward_unit = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "forward_unit", access_service_DA("forward_unit"));
    }
    ctrl.forward_CVP = function () {
      return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "forward_CVP", access_service_DA("forward_CVP"));
    }
    ctrl.transfer_department_approve = function (params) {
        ctrl._forward_value = params.approveParams;
        ctrl._forward_value.note = params.note;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "transfer_department_approve", access_service_DA("transfer_department_approve"));
    }
    ctrl.seen_work = function (params) {
        ctrl._forward_value = params.approveParams;
        ctrl._forward_value.note = params.note;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "seen_work", access_service_DA("seen_work"));
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

    function access_service_DA(action) {
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
            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_document();
                ctrl._customToastScope.addToastValue({
                    message: $filter('l')(messageSuccess),
                    type:"success"
                });
                $rootScope.statusValue.generate(ctrl._ctrlName, "DispatchArrived", action);
                $("#modal_DA_Forward_quick").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.prepareAssessDA = function ({ item, action }) {
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
        $rootScope.statusValue.generate(ctrl._ctrlName, "DispatchArrived", action);
    }

    function getPermissionPropertiesDA(item) {
        let statusShow = "";
        let allow_delete = false;
        let allow_edit = false;
        let allow_forward_CVP = false;
        let allow_forward_BGH = false;
        let allow_forward_unit = false;
        let allow_reciver_work = false;
        let allow_seen_work = false;
        let allow_return_CVP = false;

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
        }
    }
    
    function load_details_incomming_dispatch(value) {
        const dfd = $q.defer();
  
        da_details_service.load_detail_incomming_dispatchBook(value).then(function(res){
            dfd.resolve(res.data[0]);
        }, function(err){ dfd.reject(err); });
  
        return dfd.promise;
    }

    function generateFilter_document() {
        const obj = {};
        obj.checks = [];

        if (ctrl._searchFilter_document !== "") {
            obj.search = angular.copy(ctrl._searchFilter_document);
        }
        
        const needToHandle = ctrl.checkbox_needtohandle_document;
        const gonnaLate = ctrl.checkbox_gonnalate_document;
        if (!needToHandle && !gonnaLate) {
            obj.checks.push(CHECKS_ON_UI.NEED_HANDLE, CHECKS_ON_UI.GONNA_LATE);
        } else {
            if (needToHandle) {
                obj.checks.push(CHECKS_ON_UI.NEED_HANDLE);
            }
            if (gonnaLate) {
                obj.checks.push(CHECKS_ON_UI.GONNA_LATE);
            }
        }

        return obj;
    }

    function resetPaginationInfo_document() {
        ctrl.currentPage_document = 1;
        ctrl.offset_document = 0;
    }


    function load_document_service() {
        var dfd = $q.defer();
        ctrl.documents = [];
        let _filter = generateFilter_document();
        task_service
            .load_dispatch_arrived(
                _filter.search,
                ctrl.numOfItemPerPage,
                ctrl.offset_document,
                ctrl.sort_document.query,
                _filter.checks
            )
            .then(
                function (res) {
                    ctrl.documents = res.data;
                    ctrl.documents.forEach((item, index) => {
                        if (item.content) {
                            item.content = removeHtmlTags(item.content);
                        }
                        ctrl.documents[index] = { 
                            ...item, 
                            ...getPermissionPropertiesDA(item) 
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

    ctrl.load_document = function (val) {
        if (val != undefined) { ctrl.offset_document = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "load", load_document_service);
    }

    function count_document_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_document();
        task_service
            .count_dispatch_arrived(
                _filter.search, _filter.checks
            )
            .then(
                function (res) {
                    ctrl.totalItems_document = res.data[0]?.count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_document = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "DispatchArrived", "count", count_document_service);
    }

    ctrl.refreshData_document = function () {
        if (!ctrl._notyetInit_document) {
            var dfdAr = [];
            resetPaginationInfo_document();
            dfdAr.push(ctrl.load_document());
            dfdAr.push(ctrl.count_document());
            return $q.all(dfdAr);
        }
    }

    ctrl.loadfile_document = function (params) {
        return function () {
            var dfd = $q.defer();
            task_service.loadFileInfo_dispatch_arrived(params.id, params.name).then(
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


    //NEWS
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
          allowApproveLeadExternal
        }
      }

    function getTaskPermissionProperties(item) {
        // Status allow to mark as complete [TASK_STATUS.DONE, TASK_STATUS.PROCESSING]
        const sourceId =  +item.source_id
        const SOURCE_ID_LEVEL_1 = [1];
        const SOURCE_ID_LEVEL_2 = [2, 3, 4, 5];
        let allowMarkAsComplete = false;
        let allowMarkDone = false;

        const isDirectorManage = $filter("checkRuleCheckbox")(TASK_RULE.DIRECTOR_MANAGE)
        const isLeaderAllowMarkAsComplete =
            $filter("checkRuleDepartmentRadio")(
                item.department,
                TASK_RULE.LEADER_MANAGE
        )
        
        const isALlowMarkDone = TASK_STATUS.PROCESSING == item.status && item.progress == 100

        const isDepartmentLeaderAllowMarkAsComplete =
            $filter("checkRuleDepartmentRadio")(
                item.department,
                TASK_RULE.DEPARTMENT_LEADER_MANAGE
        )

        if (SOURCE_ID_LEVEL_1.indexOf(sourceId) !== -1) {
            if (TASK_STATUS.WAITING_FOR_APPROVAL == item.status) {
                allowMarkAsComplete = isDirectorManage || isLeaderAllowMarkAsComplete;
            }

            if (isALlowMarkDone) {
                allowMarkDone = isDepartmentLeaderAllowMarkAsComplete;
            }
        } else {
            if (
                TASK_STATUS.WAITING_FOR_APPROVAL == item.status &&
                ((item.level == "TransferTicket" && item.department_assign_id == $rootScope.logininfo.data.department) ||
                (item.level != "TransferTicket" && item.department == $rootScope.logininfo.data.department))
            ) {
                allowMarkAsComplete = true;
            }
                
            if (isALlowMarkDone) {
                allowMarkDone = isDepartmentLeaderAllowMarkAsComplete;
            }
        }

      return {
          allowMarkAsComplete,
          allowMarkDone
      };
    }

    ctrl.complete = function (item) {
        ctrl.thisTaskId = item._id;
        ctrl.from_department = item.from_department
        task_service.complete(item._id, item.code).then(() => {
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('MarkAsCompleteSuccess'),
                type: 'success'
            });
            ctrl.loadDetails().then(function () {
                ctrl.tasks = ctrl.tasks.filter(task => task._id !== ctrl.Item._id);
            });
            ctrl.totalItems_task--
        },
            (err) => {
                dfd.reject(err);
                err = undefined;
            })
    }

    ctrl.done = function (item) {
        ctrl.thisTaskId = item._id;
        ctrl.from_department = item.from_department
        task_service.done(item._id, item.code).then(() => {
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('MarkDoneSuccess'),
                type: 'success'
            });
            ctrl.loadDetails().then(function (rs) {
                ctrl.tasks = ctrl.tasks.map(task => task._id === ctrl.Item._id ? ctrl.Item : task);

            });
        },
            (err) => {
                dfd.reject(err);
                err = undefined;
            })
    }

    function generateFilter_news() {
        var obj = {};
        if (ctrl._searchFilter_news !== "") {
            obj.search = angular.copy(ctrl._searchFilter_news);
        }

        return obj;
    }

    function resetPaginationInfo_news() {
        ctrl.currentPage_news = 1;
        ctrl.offset_news = 0;
    }


    function load_news_service() {
        var dfd = $q.defer();
        ctrl.news = [];
        let _filter = generateFilter_news();
        task_service
            .load_news(
                _filter.search,
                ctrl.numOfItemPerPage,
                ctrl.offset_news,
                ctrl.sort_news.query
            )
            .then(
                function (res) {
                    ctrl.news = res.data;
                    for (let i in ctrl.news) {
                        ctrl.news[i] = { ...ctrl.news[i], ...getPermissionProperties(ctrl.news[i]) };
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

    ctrl.load_news = function (val) {
        if (val != undefined) { ctrl.offset_news = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "News", "load", load_news_service);
    }

    function count_news_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_news();
        task_service.count_news(
            _filter.search
        )
            .then(
                function (res) {
                    ctrl.totalItems_news = res.data[0]?.count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_news = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "News", "count", count_news_service);
    }

    ctrl.refreshData_news = function () {
        if (!ctrl._notyetInit_news) {
            var dfdAr = [];
            resetPaginationInfo_news();
            dfdAr.push(ctrl.load_news());
            dfdAr.push(ctrl.count_news());
            return $q.all(dfdAr);
        }
    }

    ctrl.loadfile_news = function (params) {
        return function () {
            var dfd = $q.defer();
            task_service.loadFileInfo_news(params.code, params.name).then(function (res) {
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
    function approve_department_service() {
        var dfd = $q.defer();

        const content = $("#edit_notify_content_QH").summernote("code");
  
        // Process added files
        const addFilePromises = ctrl._edit_value_news.addedFiles.map(function (file) {
          return notify_service.pushFile(file, ctrl._edit_value_news._id).then();
        });
  
        // Process removed files
        const removeFilePromises = ctrl._edit_value_news.removedFiles.map(function (filename) {
          return notify_service.removeFile(ctrl._edit_value_news._id, filename);
        });
  
        notify_service
          .approve_department(
            ctrl._edit_value_news._id,
            ctrl._edit_value_news.title,
            content,
            ctrl._edit_value_news.group,
            ctrl._edit_value_news.type,
            ctrl._edit_value_news.to_employee,
            ctrl._edit_value_news.to_department,
            ctrl._edit_value_news.to_director,
            ctrl._edit_value_news.task_id,
            ctrl._edit_value_news.note,
            ctrl._edit_value_news.is_internal_notify,
          )
          .then(
            function (res) {
              $('#notify_edit_modal').modal('hide');
              $q.all(addFilePromises.concat(removeFilePromises)).then(
                function () {
                    ctrl.refreshData_news();
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
    ctrl.approve_department_news = function () {
        return $rootScope.statusValue.execute(
          ctrl._ctrlName,
          "News",
          "approve_department",
          approve_department_service
        );
      };

    ctrl.prepareEdit_news = function (item, action = 'edit') {
        ctrl.action=action;
        $rootScope.statusValue.generate(ctrl._ctrlName, "News", "edit");
        ctrl._edit_value_news = angular.copy(item);
        ctrl._edit_value_news.action = action;
        ctrl._edit_value_news.files = item.attachments;
        ctrl._edit_value_news.removedFiles = [];
        ctrl._edit_value_news.addedFiles = [];

        ctrl._edit_value_news._access_edit = false;
        if(action !== 'edit'){
            ctrl._edit_value_news._access_edit = true;
        }

        $("#edit_notify_content_QH").summernote({
            callbacks: {
            onChange: function (contents, $editable) {
                if ($(contents).find("img").length === 0) {
                }
            },
            },
        });

        $("#edit_notify_content_QH").summernote("code", ctrl._edit_value_news.content);
        if(action !== 'edit'){
            $("#edit_notify_content_QH").summernote("disable");
        }
    };

    ctrl.prepareApprove_news = function (item) {
        ctrl.status = 'approve';
        $rootScope.statusValue.generate(ctrl._ctrlName, "News", "approve");
        ctrl._approve_value_news = angular.copy(item);
        ctrl._approve_value_news.files = item.attachments;

        ctrl._approve_value_news._access_edit = true;

        $("#approval_notify_content_QH").summernote({
            callbacks: {
            onChange: function (contents, $editable) {
                if ($(contents).find("img").length === 0) {
                }
            },
            },
        });

        $("#approval_notify_content_QH").summernote("code", ctrl._approve_value_news.content);
        if(ctrl._approve_value_news._access_edit){
            $("#approval_notify_content_QH").summernote("disable");
        }

        if (item.allowApprove_recall) {
            const pendingRecalledEvent = item.event.find(event => event.status === "PendingRecalled");
            const reason = pendingRecalledEvent ? pendingRecalledEvent.reason : null;

            ctrl._approve_value_news.recall_reason = reason;
        }
    };
    ctrl.prepareRecall_news = function (item) {
        ctrl.status = 'recall';
        $rootScope.statusValue.generate(ctrl._ctrlName, "News", "approve");
        ctrl._approve_value_news = angular.copy(item);
        ctrl._approve_value_news.files = item.attachments;

        ctrl._approve_value_news._access_edit = true;

        $("#approval_notify_content_QH").summernote({
            callbacks: {
            onChange: function (contents, $editable) {
                if ($(contents).find("img").length === 0) {
                }
            },
            },
        });

        $("#approval_notify_content_QH").summernote("code", ctrl._approve_value_news.content);
        if(ctrl._approve_value_news._access_edit){
            $("#approval_notify_content_QH").summernote("disable");
        }
  
        if (item.allowApprove_recall) {
          const pendingRecalledEvent = item.event.find(event => event.status === "PendingRecalled");
          const reason = pendingRecalledEvent ? pendingRecalledEvent.reason : null;
  
          ctrl._approve_value_news.recall_reason = reason;
        }
    };
    
    // PUSH FILE
    ctrl.pushfile_update = function (param) {
        ctrl._edit_value_news.addedFiles.push(param);
    };
    
        // REMOVE FILE
    ctrl.on_remove_attachment_file_edit = function (param) {
        ctrl._edit_value_news.removedFiles.push(param.name);
        ctrl._edit_value_news.files = ctrl._edit_value_news.files.filter(
            (file) => file.name !== param.name
        );
    };

    ctrl.prepareReject_news = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "News", "reject");
        ctrl._reject_value_news = angular.copy(value);
    };

    ctrl.set_hint_note_new = function(note) {
        ctrl._approve_value_news.note = $filter('l')(note);
    }

    ctrl.approve_news = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "News",
            "approve",
            approve_service_news
        );
    };

    ctrl.reject_news = function () {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "News",
            "reject",
            reject_service_news
        );
    };

    function approve_service_news() {
        var dfd = $q.defer();
        const note = ctrl._approve_value_news.note;
        task_service.approve_news(ctrl._approve_value_news._id, note).then(
            function () {
                $("#notify_approve_modal").modal("hide");
                dfd.resolve(true);
                ctrl.refreshData_news();
                dfd = undefined;
            },
            function (err) {
                dfd.reject(err);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    function reject_service_news() {
        var dfd = $q.defer();
        task_service.reject_news(ctrl._approve_value_news._id, ctrl._approve_value_news.note)
            .then(
                function () {
                    // $("#notify_reject_modal").modal("hide");
                    $("#notify_approve_modal").modal("hide");
                    dfd.resolve(true);
                    ctrl.refreshData_news();
                    dfd = undefined;
                },
                function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.pickdirector_edit_news = function (param) {
        ctrl._edit_value_news.to_director = angular.copy(param);
    };

    ctrl.pickEmployee_edit_news = function (val) {
        ctrl._edit_value_news.to_employee = angular.copy(val);
      };
  
      ctrl.chooseDepartment_edit_news = function (val) {
        ctrl._edit_value_news.to_department = angular.copy(val);
      };



    //Registration
    const TYPE_REGISTRATION = {
        ROOM: 'room',
        EVENT_CALENDAR: 'event_calendar',
        CAR: 'car'
    }

    function generateFilter_registration() {
        var obj = {};
        if (ctrl._searchFilter_registration !== "") {
            obj.search = angular.copy(ctrl._searchFilter_registration);
        }

        obj.feature = [];
        if (ctrl.checkbox_filter_room) {
            obj.feature.push(TYPE_REGISTRATION.ROOM);
        }

        if (ctrl.checkbox_filter_vehicle) {
            obj.feature.push(TYPE_REGISTRATION.CAR);
        }

        if (ctrl.checkbox_filter_work_schedule) {
            obj.feature.push(TYPE_REGISTRATION.EVENT_CALENDAR);
        }

        return obj;
    }

    function resetPaginationInfo_registration() {
        ctrl.currentPage_registration = 1;
        ctrl.offset_registration = 0;
    }


    function load_registration_service() {
        var dfd = $q.defer();
        ctrl.registrations = [];
        let _filter = generateFilter_registration();
        task_service.load_registration(
            _filter.search,
            _filter.feature,
            ctrl.numOfItemPerPage,
            ctrl.offset_registration,
            ctrl.sort_registration.query
        )
            .then(
                function (res) {
                    ctrl.registrations = res.data.map(item =>{
                        if(item.feature === TYPE_REGISTRATION.ROOM){
                            return {
                                ...item,
                                ...getPermissionRoomProperties(item)
                            };
                        }

                        if(item.feature === TYPE_REGISTRATION.EVENT_CALENDAR){
                            return {
                                ...item,
                                showRoom: $filter('showRoomEventCalendar')(item.meeting_room_registration),
                                showCar: $filter('showCarEventCalendar')(item.vehicle_registration),
                                ...getPermissionEventCalendarProperties(item)
                            };
                        }

                        if(item.feature === TYPE_REGISTRATION.CAR){
                            return {
                                ...item,
                                ...getPermissionCarProperties(item)
                            };
                        }

                        return item;
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

    ctrl.load_registration = function (val) {
        if (val != undefined) { ctrl.offset_registration = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Registration", "load", load_registration_service);
    }

    function count_registration_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_registration();
        task_service.count_registration(
            _filter.search,
            _filter.feature,
        )
            .then(
                function (res) {
                    ctrl.totalItems_registration = res.data[0]?.count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_registration = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Registration", "count", count_registration_service);
    }

    ctrl.refreshData_registration = function () {
        if (!ctrl._notyetInit_registration) {
            var dfdAr = [];
            resetPaginationInfo_registration();
            dfdAr.push(ctrl.load_registration());
            dfdAr.push(ctrl.count_registration());
            return $q.all(dfdAr);
        }
    }

    //Room registration

    ctrl.onRoomTypeChange_update = function (val) {
        ctrl._assess_registration_value.filter_room = [ { room_type: val } ];
        ctrl._assess_registration_value.room = null;
    };

    ctrl.pick_room_update = (val) => {
        ctrl._assess_registration_value.room = val.value;
    }
    
    ctrl.isInvalidHost_update = function (host_scope) {
        if (host_scope === 'external') {
            return ctrl._assess_registration_value.host_external === '';
        }
        if (host_scope === 'internal') {
            return Object.keys(ctrl._assess_registration_value.host).length === 0 || ctrl._assess_registration_value.host === '';
        }
        return false;
    };

    ctrl.chooseDateStart_room = function (val) {
        if (ctrl.isInitializing) {
            return;
        }

        if(ctrl._assess_registration_value !== undefined){
            ctrl._assess_registration_value.date_start = val.getTime();
            ctrl.updateDateTime_assess('start');
            ctrl.updateDateTime_assess('end')
        }
    }

    ctrl.chooseDateEnd_room = function (val) {
        if(ctrl._assess_registration_value !== undefined){
            ctrl._assess_registration_value.date_end = val.getTime();
        }
    }

    ctrl.room_list_config = {
        master_key: "meeting_room",
        load_details_column: "value",
    };

    ctrl.load_room_type = function (){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load_room_type", load_room_type_service);
    }

    function load_room_type_service(){
        var dfd = $q.defer();
        registration_service.load_room_type().then(function (res) {
            dfd.resolve(true);
            ctrl._roomTypes = res.data.map(type=>({
                label: type.title,
                val: type.value
            }));
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl._choose_host_approve_department_room = function(param){
        ctrl._assess_registration_value.host = param;
    }

    ctrl.pickEmployee_approve_department_room = (params) => {
        ctrl._assess_registration_value.participants = params;
    }

    ctrl.chooseDepartment_approve_department_room = function (val) {
        ctrl._assess_registration_value.to_department = angular.copy(val);
    };

    ctrl.add_other_host_approve_department_room = function(){
        if(!ctrl._assess_registration_value.otherHost){
            return;
        }
        if(!ctrl._assess_registration_value.otherHosts){
            ctrl._assess_registration_value.otherHosts = [];
        }
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        ctrl._assess_registration_value.otherHosts.push({
            id:id,
            name:ctrl._assess_registration_value.otherHost
        });
        ctrl._assess_registration_value.otherHost='';
    }

    ctrl.delete_other_host_approve_department_room = function(id){
        ctrl._assess_registration_value.otherHosts = ctrl._assess_registration_value.otherHosts.filter(host => host.id !== id);
    }

    ctrl.removeFileAttachment_department_room = function(item){
        if (item.id) {
            ctrl._assess_registration_value.removeAtachments.push(item.id);
        }
        ctrl._assess_registration_value.attachments = ctrl._assess_registration_value.attachments.filter(file => file.name !== item.name);
    }

    // ctrl.removeFileUpdate_department_room = function(item){
    //     ctrl._assess_registration_value.files = ctrl._assess_registration_value.files.filter((file)=>file.name!=item.name);
    //     console.log("updated", ctrl._assess_registration_value);
    // }

    ctrl.loadfileRoom = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_info_room(params.id, params.name).then(
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

    const ROOM_FLOW_STATUS ={
        APPROVE:"approve",
        CANCEL:"cancel"
    }

    const ROOM_TYPE = {
        MEETING: "MeetingRoom",
        CLASS: "LectureHallClassroom"
    }

    const ROOM_RULE = {
        REGISTERED_ROOM: "Office.MeetingRoomSchedule.Use",
        APPROVE_LEVEL_DEPARTMENT: "Office.RoomSchedule.ApprovalDepartment",
        CLASS_ROOM_APPROVE_LEAD: "Office.LectureHallClassroom.Approval",
        CLASS_ROOM_CONFIRM: "Office.LectureHallClassroom.Confirm",
        MEETING_ROOM_APPROVE_LEAD: "Office.MeetingRoomSchedule.Approval",
        MEETING_ROOM_CONFIRM: "Office.MeetingRoomSchedule.Confirm",
        MANAGE_INFORMATION: "Office.RoomSchedule.Manange",
        REQUEST_CANCEL:"Office.RoomSchedule.RequestCancel",
    }

    const MEETING_ROOM_SCHEDULE_STATUS = {
        REGISTERED: "Registered",
        APPROVED: "Approved",
        DEPARTMENT_APPROVED: "DepartmentApproved",
        CONFIRMED: "Confirmed",
        REQUEST_CANCEL: "RequestCancel",
        CANCELLED: "Cancelled",
        REJECTED: "Rejected"
    }

    ctrl.getTextStatusByFlow = function(status, flow) {
        switch (status) {
            case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Registered');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('RegisteredRecall');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('DepartmentApproved');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('ApprovedRecallByDepartmentLeader');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Confirmed');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('ConfirmedRoomRecall');
                }
                break;

            case MEETING_ROOM_SCHEDULE_STATUS.APPROVED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Approved');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.CANCELLED:
                return $filter('l')('cancelled');
            case MEETING_ROOM_SCHEDULE_STATUS.REJECTED:
                return $filter('l')('RejectedRegistration');
        }
    }

    function getPermissionRoomProperties(item) {
        let allow_edit = false;
        let allow_delete = false;
        let allow_approve_department = false;
        let allow_approve_management = false;
        let allow_approve_lead = false;
        let allow_request_cancel = false;
        let allow_approve_recall_department = false;
        let allow_approve_recall_management = false;
        let allow_approve_recall_lead = false;
        let status_show;
        let filter_room = [ { room_type: item.type } ];

        if(item.flow === ROOM_FLOW_STATUS.APPROVE){
            switch(item.status){
                case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_approve_department = true;
                    }

                    status_show = 'Registerd';
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                    status_show = 'DepartmentApproved';
                    // if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                    //     allow_approve_lead = true;
                    //    break; 
                    // }  

                    // if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                    //     allow_approve_lead = true;
                    //     break;
                    // }

                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_CONFIRM)){
                        allow_approve_management = true;
                        //
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)){
                        allow_approve_management = true;
                        //
                    }

                    
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                        allow_approve_lead = true;
                        //
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                        allow_approve_lead = true;
                        //
                    }
                    status_show = 'ManagermentConfirmed';
                    break;
            }
        }else{
            switch(item.status){
                case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_approve_recall_department = true;
                    }

                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                       break; 
                    }  

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                        break;
                    }

                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_CONFIRM)){
                        allow_approve_recall_management = true;
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)){
                        allow_approve_recall_management = true;
                    }
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                    }
                    break;
            }
        }

        if(item.end_time < new Date()){
            return {
                status_show
            }
        }

        return {
            allow_approve_department,
            allow_approve_management,
            allow_edit,
            allow_delete,
            allow_approve_lead,
            allow_request_cancel,
            allow_approve_recall_department,
            allow_approve_recall_management,
            allow_approve_recall_lead,
            status_show,
            filter_room
        }
    }

    ctrl.prepareRoomDepartmentApproval = ({item}) =>{
        ctrl.isInitializing = true; // Đặt cờ khởi tạo

        if(!ctrl._roomTypes.length>0){
            ctrl.load_room_type();
        }

        const { _id, other_participants } = item;
    
        ctrl._assess_registration_value = {
            ...item,
            id: _id,
            _host_update: '',
            time_start: new Date(item.date_start),
            time_end: new Date(item.date_end),
            otherHosts: other_participants.map(name => ({
                id: `${Date.now()}${Math.random().toString(36).substr(2, 8)}`,
                name,
            })),
            otherHost: '',
            files: [],
            removeAtachments: [],
        };
        
        $timeout(() => (ctrl.isInitializing = false), 100); // Tắt cờ sau khi khởi tạo hoàn tất

        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "approve_department");
    }

    ctrl.updateDateTime_assess = function (type) {
        if (!ctrl._assess_registration_value.date_start) {
            ctrl._assess_registration_value.date_start = new Date();
        }
        if (!ctrl._assess_registration_value.date_end) {
            ctrl._assess_registration_value.date_end = new Date();
        }
    
        // Lấy ngày hiện tại từ date_start
        let date = new Date(ctrl._assess_registration_value.date_start);
    
        // Lấy giờ và phút từ đối tượng Date time_start hoặc time_end
        let time = type === 'start' ? ctrl._assess_registration_value.time_start : ctrl._assess_registration_value.time_end;
    
        if (time instanceof Date) {
            date.setHours(time.getHours(), time.getMinutes(), 0, 0); // Cập nhật giờ và phút từ Date
        }
    
        // Gán lại giá trị timestamp
        if (type === 'start') {
            ctrl._assess_registration_value.date_start = date.getTime(); // Chuyển thành timestamp
        } else {
            ctrl._assess_registration_value.date_end = date.getTime(); // Chuyển thành timestamp
        }
    };

    ctrl.approve_department_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_department", approve_department_room_service);
    };

    function approve_department_room_service() {
        var dfd = $q.defer();
        const dataUpdate = genDataApproveDepartment();
        registration_service.approve_department_room(dataUpdate).then(function () {
            dfd.resolve(true);
            $("#modal_RoomRegistration_DepartmentApproval").modal("hide");
            ctrl.refreshData_registration();
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('UpdateRoomSCheduleSuccess'),
                type:"success",
            });
            
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function genDataApproveDepartment(){
        const data = {
            id: ctrl._assess_registration_value._id,
            title: ctrl._assess_registration_value.title,
            date_start: (new Date(ctrl._assess_registration_value.date_start)).getTime(),
            date_end: (new Date(ctrl._assess_registration_value.date_end)).getTime(),
            type: ctrl._assess_registration_value.type,
            host: ctrl._assess_registration_value.host,
            participants: ctrl._assess_registration_value.participants,
            to_department: ctrl._assess_registration_value.to_department,
            other_participants: ctrl._assess_registration_value.otherHosts.map(host => host.name),
            content: ctrl._assess_registration_value.content,
            person: ctrl._assess_registration_value.person,
            service_proposal: ctrl._assess_registration_value.service_proposal,
            service_proposal_text: ctrl._assess_registration_value.service_proposal_text,
            helpdesk: ctrl._assess_registration_value.helpdesk,
            helpdesk_text: ctrl._assess_registration_value.helpdesk_text,
            teabreak: ctrl._assess_registration_value.teabreak,
            teabreak_text: ctrl._assess_registration_value.teabreak_text,
            note: ctrl._assess_registration_value.note,
            removeAtachments: ctrl._assess_registration_value.removeAtachments,
            attachments: ctrl._assess_registration_value.attachments,
            room: ctrl._assess_registration_value.room,
            host_scope: ctrl._assess_registration_value.host_scope,
            host_external: ctrl._assess_registration_value.host_external
        };
        
        // if(ctrl._assess_registration_value.files){
        //     data.file = ctrl._assess_registration_value.files;
        // }

        // if(ctrl._assess_registration_value.removeAtachments){
        //     data.removeAtachments = ctrl._assess_registration_value.removeAtachments;
        // }
        return data;
    }

    ctrl.pick_room_assess_room = (val) =>{
        ctrl._assess_registration_value.room = val.value;
    }

    ctrl.function_apply_suggestions_event_calendar = ['registration_event_calendar'];
    
    ctrl.set_hint_note = function(note) {
        ctrl._assess_registration_value.note = $filter('l')(note);
    }

    ctrl.prepareAssess_room = function ({ item, action }) {
        ctrl.isInitializing = true; // Đặt cờ khởi tạo

        ctrl._assess_registration_value = angular.copy(item);
        ctrl._assess_registration_value.original_current_room = ctrl._assess_registration_value.room;
        ctrl._assess_registration_value.action = action;
        ctrl._assess_registration_value.note = "";
        ctrl._assess_registration_value.note_required = true;
        ctrl._assess_registration_value.assign_room = false;
        switch (action) {
            case "reject_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_registration_value.assign_room = true;
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_registration_value.assign_room = true;
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "request_cancel":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for request cancel');
                break;

            case "approve_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                break;

        }
        
        $timeout(() => (ctrl.isInitializing = false), 100); // Tắt cờ sau khi khởi tạo hoàn tất

        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
        return;
    }

    ctrl.reject_department_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_department", access_room_service("reject_department"));
    }

    ctrl.approve_management_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_management", access_room_service("approve_management"));
    }

    ctrl.reject_management_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_management", access_room_service("reject_management"));
    }

    ctrl.approve_lead_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_lead", access_room_service("approve_lead"));
    }

    ctrl.reject_lead_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_lead", access_room_service("reject_lead"));
    }

    ctrl.request_cancel_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "request_cancel", access_room_service("request_cancel"));
    }

    //Recall
    ctrl.approve_recall_department_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_department", access_room_service("approve_recall_department"));
    }
    ctrl.reject_recall_department_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_department", access_room_service("reject_recall_department"));
    }

    ctrl.approve_recall_management_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_management", access_room_service("approve_recall_management"));
    }

    ctrl.reject_recall_management_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_management", access_room_service("reject_recall_management"));
    }

    ctrl.approve_recall_lead_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_lead", access_room_service("approve_recall_lead"));
    }

    ctrl.reject_recall_lead_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_lead", access_room_service("reject_recall_lead"));
    }
    //End recall

    function access_room_service(action) {
        return function () {
            var dfd = $q.defer();
            let dfdAr = [];
            let messageSuccess = '';
            switch (action) {
                case "reject_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_department_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "approve_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_management_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note, ctrl._assess_registration_value.room));
                    break;
                case "reject_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_management_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "approve_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_lead_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note, ctrl._assess_registration_value.room));
                    break;
                case "reject_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_lead_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "request_cancel":
                    messageSuccess = $filter('l')('Requestcanceled');
                    dfdAr.push(registration_service.request_cancel_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                //recall
                case "approve_recall_department":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_recall_department_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "reject_recall_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_recall_department_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "approve_recall_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_recall_management_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "reject_recall_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_recall_management_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "approve_recall_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_recall_lead_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
                case "reject_recall_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_recall_lead_room(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                    break;
            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_registration();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
                $("#modal_RoomRegistration_Assess").modal('hide');
                ctrl._customToastScope.addToastValue({
                    message: messageSuccess,
                    type: 'success',
                })
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    //End room

    //Event calendar

    $rootScope.$on('event_calendar::access', function() {
        ctrl.refreshData_registration();
    });
    $rootScope.$on('room::access', function() {
        ctrl.refreshData_registration();
    });
    const FLOW_STATUS = {
        APPROVE: "Approve",
        CANCEL: "Cancel",
    };

    const STATUS_EVENT_CALENDAR = {
        CREATED: "Registered",
        LEADER_DEPARTMENT_APPROVED: "DepartmentApproved",
        CONFIRMER_APPROVED: "ManagerApproved",
        LEAD_APPROVED: "OrganizationApproved",
        REQUEST_CANCEL: "RequestCancel",
        CANCELLED: "Cancelled",
        REJECTED: "Rejected",
    };
  
    const RULE_EVENT_CALENDAR = {
        APPROVE_DEPARTMENT: "Office.EventCalendar.ApprovalDepartment", // TP duyệt
        CONFIRM: "Office.EventCalendar.OtherApproval", // Quản lý lịch công tác duyệt
        APPROVE_LEAD: "Office.EventCalendar.FinalApproval", // Lãnh đạo đơn vị duyệt
        CREATE: "Office.EventCalendar.Create", // Tạo mới lịch công tác
        EDIT: "Office.EventCalendar.Edit", // Chỉnh sửa lịch công tác
        USE: "Office.EventCalendar.Use", // Sử dụng lịch công tác
        DELETE: "Office.EventCalendar.Delete", // Xóa lịch công tác
        MANAGE: "Office.EventCalendar.Manage", // Quản lý lịch công tác
    };

    const LEVEL_EVENT_CALENDAR = {
        LEVEL_1: "Level_1",
        LEVEL_2: "Level_2",
    }

    ctrl.loadfileEventCalendar = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_info_event_calendar(params.id, params.name).then(
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

    function getPermissionEventCalendarProperties(item) {
        let allow_assess_department = false;
        let allow_assess_host = false;
        let allow_assesst_recall_department = false;
        let allow_assess_host_recall = false;
        let allow_assess_recall_host = false;
        
        let status_show = '';
  
        if(item.flow_status === FLOW_STATUS.APPROVE){
          switch(item.status){
            case STATUS_EVENT_CALENDAR.CREATED:
              if ($filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)) {
                allow_assess_department = true;
              }
              status_show = "Registered";
              break;
  
            case STATUS_EVENT_CALENDAR.LEADER_DEPARTMENT_APPROVED:
              if(item.level === LEVEL_EVENT_CALENDAR.LEVEL_2){
                status_show = 'Approved';
                break;
              }
  
              // Nếu là cấp 1 thì ban giám hiệu/ người chủ trì phải duyệt
              status_show = 'DepartmentApproved';
              if($rootScope.logininfo.username === item.main_person){
                allow_assess_host = true;
              }
  
              break;
          }
        }else if(item.flow_status === FLOW_STATUS.CANCEL){
          switch(item.status) {
            case STATUS_EVENT_CALENDAR.CREATED:
              if ($filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)) {
                allow_assesst_recall_department = true;
              }
              status_show = 'Requestcanceled';
              break;
            case STATUS_EVENT_CALENDAR.LEADER_DEPARTMENT_APPROVED:
  
              status_show = 'DepartmentApprovedCancel';
              if($rootScope.logininfo.username === item.main_person){
                allow_assess_recall_host = true;
              }
              break;
          }
        }
  
        return {
          allow_assess_department,
          allow_assess_host,
          status_show,
          allow_assess_host_recall,
          allow_assesst_recall_department,
          allow_assess_recall_host
        }
    }

    ctrl.prepareAssessEventCalendar = function ({ item, action }) {
        ctrl._assess_registration_value = angular.copy(item);
        ctrl._assess_registration_value.action = action;
        ctrl._assess_registration_value.note = "";
        ctrl._assess_registration_value.note_required = true;
        switch (action) {
            case "approve_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "approve_host":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_host":
              ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
              ctrl._assess_registration_value.note_required = true;
              break;
            
            case "approve_recall_department":
              ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
              break;
            case "reject_recall_department":
              ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
              ctrl._assess_registration_value.note_required = true;
              break;
            case "approve_recall_host":
              ctrl._assess_registration_value.note_placeholder =$filter('l')('You can note for accept');
              break;
            case "reject_recall_host":
              ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
              ctrl._assess_registration_value.note_required = true;
              break;
        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "EventCalendar", action);
    }

    ctrl.approve_department_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_department", access_event_calendar_service("approve_department"));
    }

    ctrl.reject_department_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_department", access_event_calendar_service("reject_department"));
    }

    ctrl.approve_host_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_host", access_event_calendar_service("approve_host"));
    }

    ctrl.reject_host_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_host", access_event_calendar_service("reject_host"));
    }

    ctrl.approve_recall_department_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_recall_department", access_event_calendar_service("approve_recall_department"));
    }

    ctrl.reject_recall_department_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_recall_department", access_event_calendar_service("reject_recall_department"));
    }

    ctrl.approve_recall_host_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_recall_host", access_event_calendar_service("approve_recall_host"));
    }

    ctrl.reject_recall_host_event_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_recall_host", access_event_calendar_service("reject_recall_host"));
    }

    function access_event_calendar_service(action) {
        return function () {
            var dfd = $q.defer();
            let dfdAr = [];
            switch (action) {
                case "approve_department":
                  dfdAr.push(registration_service.approve_department_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "reject_department":
                  dfdAr.push(registration_service.reject_department_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "approve_host":
                  dfdAr.push(registration_service.approve_host_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "reject_host":
                  dfdAr.push(registration_service.reject_host_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "approve_recall_department":
                  dfdAr.push(registration_service.approve_recall_department_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "reject_recall_department":
                  dfdAr.push(registration_service.reject_recall_department_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "approve_recall_host":
                  dfdAr.push(registration_service.approve_recall_host_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
                case "reject_recall_host":
                  dfdAr.push(registration_service.reject_recall_host_event_calendar(ctrl._assess_registration_value._id, ctrl._assess_registration_value.note));
                  break;
            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_registration();
                $rootScope.statusValue.generate(ctrl._ctrlName, "EventCalendar", action);
                $("#modal_EventCalendarRegistration_Assess").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    //Car registration
    const STATUS_FLOW = {
        REGISTER: "register",
        RECALL: "recall"
    };

    const STATUS_CAR = {
        CREATED: "Created",
        LEADER_DEPARTMENT_APPROVED: "reviewer_approved",
        CONFIRMER_APPROVED: "manager_approved",
        LEAD_APPROVED_CAR: "head_approved_car",
        LEAD_EXTERNAL_APPROVED: "head_external_approved",
        CREATOR_RECEIVED_CARD: 'creator_received_card',
        CREATOR_RETURNED_CARD: 'creator_returned_card',
        MANAGER_RECEIVED_CARD: 'manager_received_card',
        REJECTED: "rejected",
        CANCELLED: "cancelled",
        RECALLED:"recalled",
    };

    const RULE_CAR = {
        APPROVE_DEPARTMENT: "Office.CarManagement.Review",
        CONFIRM: "Office.CarManagement.Confirm",
        APPROVE_LEAD: "Office.CarManagement.Approve",
        APPROVE_LEAD_EXTERNAL: "Office.CarManagement.ApproveExternal",
    };

    $rootScope.$on('updateStatusFromLoadDetailCar', function() {
        ctrl.refreshData_registration();
    });

    ctrl.loadfileCar = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_info_car(params.code, params.name).then(
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

    ctrl.loadfileInvoiceCar = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_invoice_car(params.code, params.name).then(
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

    ctrl.location_config = {
        master_key: "location_list",
        load_details_column: "value",
    };

    ctrl.vehicle_list_config = {
        master_key: "vehicle_list",
        load_details_column: "value",
    };

    ctrl.card_list_config = {
        master_key: "card_list",
        load_details_column: "value",
    };

    ctrl.filterCardCredit = [
        { status: true }
    ]

    ctrl.pick_card_assess_car = function (data) {
        ctrl._assess_registration_value.card = data.value;
    }

    ctrl.pick_contact_passenger_car = function (val) {
        ctrl._assess_registration_value.contact_passenger = val;
        if(ctrl._assess_registration_value.min_of_people > ctrl._assess_registration_value.number_of_people){
            ctrl._assess_registration_value.number_of_people = ctrl._assess_registration_value.min_of_people;
        }         
    }

    ctrl.pick_vehicle_assess_car = function (data) {
        ctrl._assess_registration_value.car = data.value;
    }

    ctrl.pick_driver_assess_car = function (data) {
        ctrl._assess_registration_value.driverData = data;
        ctrl._assess_registration_value.driver = data.username;
    }

    function load_driver_list() {
        var dfd = $q.defer();
        ctrl.driverList = [];
        registration_service
            .loadDriverList()
            .then(
                function (res) {
                    ctrl.driverList = res.data;
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

    ctrl.load_driver_list = function (val) {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "CarManagement",
            "load_driver_list",
            load_driver_list
        );
    };

    function getPermissionCarProperties(item) {
        let allow_edit = false;
        let allow_assess_department = false;
        let allow_assess_car_management = false;
        let allow_assess_lead = false;
        let allow_assess_card_management = false;
        let allow_manager_assign_card = false;
        let allow_creator_receive_card = false;
        let allow_creator_return_card = false;
        let allow_manager_receive_card = false;
        let allow_delete = false;
        let allow_recall = false;
        let allow_cancel = false;
        let allow_assess_lead_external = false;

        //recall
        let allow_assess_recall_department = false;
        let allow_assess_recall_car_management = false;
        let allow_assess_recall_lead = false;
        let allow_request_cancel = false;
        let allow_reject_recall = false;


        let allow_edit_card = false;

        let statusShow = "";

        if (item.flow_status === STATUS_FLOW.REGISTER) {
            switch (item.status) {
                case STATUS_CAR.CREATED:
                    if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                        allow_assess_department = true;
                    }

                    if ($rootScope.logininfo.username === item.username) {
                        allow_edit = true;
                        allow_delete = true;
                    }
                    statusShow = "Registered";
                    break;
                case STATUS_CAR.LEADER_DEPARTMENT_APPROVED:
                    if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                        allow_assess_car_management = true;
                    }

                    if ($rootScope.logininfo.username === item.username && item.time_to_go*1 > Date.now()) {
                        allow_cancel = true;
                    }

                    statusShow = "DepartmentLeaderApproved";
                    break;
                case STATUS_CAR.CONFIRMER_APPROVED:
                    if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                        allow_assess_lead = true;
                    }

                    if ($rootScope.logininfo.username === item.username && item.time_to_go*1 > Date.now()) {
                        allow_cancel = true;
                    }

                    statusShow = "VehicleManagementSpecialistApproved";
                    break;
                case STATUS_CAR.LEAD_APPROVED_CAR:
                    statusShow = "LeadApproved";

                    if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD_EXTERNAL)) {
                        allow_assess_lead_external = true;
                    }

                    break;
                
                case STATUS_CAR.LEAD_EXTERNAL_APPROVED:
                    if (!item.assign_card) {
                        statusShow = "Approved";
                    } else {
                        statusShow = "LeadExternalApproved";
                    }

                    if ($rootScope.logininfo.username === item.username && item.assign_card) {
                        allow_creator_receive_card = true;
                    }

                    //Request cancel
                    if ($rootScope.logininfo.username === item.username) {
                        allow_request_cancel = true;
                    }

                    if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                        allow_request_cancel = true;
                    }

                    if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                        allow_request_cancel = true;
                    }

                    // if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                    //     allow_request_cancel = true;
                    // }

                    break;
                case STATUS_CAR.CREATOR_RECEIVED_CARD:
                    statusShow = "DepartmentReceivedCard";
                    if ($rootScope.logininfo.username === item.username) {
                        allow_creator_return_card = true;
                    }
                    break;
                case STATUS_CAR.CREATOR_RETURNED_CARD:
                    statusShow = "DepartmentReturnedCard";
                    if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                        allow_manager_receive_card = true;
                    }

                    if ($rootScope.logininfo.username === item.username && new Date().getTime() < item.time_to_go) {
                        allow_recall = true;
                    }

                    break;
                case STATUS_CAR.MANAGER_RECEIVED_CARD:
                    statusShow = "Completed";
                    break;
                case STATUS_CAR.CANCELLED:
                    statusShow = "Cancelled";
                    break;
            }

        } else {
            switch (item.status) {
                case STATUS_CAR.CREATED:
                    statusShow = "RequestedRecall";
                    if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                        allow_assess_recall_department = true;
                    }

                    break;
                case STATUS_CAR.LEADER_DEPARTMENT_APPROVED:
                    statusShow = "DepartmentLeaderApprovedRecall";

                    if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                        allow_assess_recall_car_management = true;
                    }

                    break;
                case STATUS_CAR.CONFIRMER_APPROVED:
                    if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                        allow_assess_recall_lead = true;
                    }
                    statusShow = "VehicleManagementSpecialistApprovedRecall";
                    break;
                case STATUS_CAR.RECALLED:
                    statusShow = "Recalled";
                    break;
            }
        }

        if (item.status === STATUS_CAR.REJECTED) {
            statusShow = "Rejected";
        }

        if(allow_assess_recall_department || allow_assess_recall_car_management || allow_assess_recall_lead){
            allow_reject_recall = true;
        }

        return {
            allow_edit,
            allow_assess_department,
            allow_assess_car_management,
            allow_assess_lead,
            allow_assess_card_management,
            allow_manager_assign_card,
            allow_creator_receive_card,
            allow_creator_return_card,
            allow_manager_receive_card,
            allow_delete,
            allow_recall,
            statusShow,
            allow_edit_card,
            allow_cancel,
            allow_assess_lead_external,

            allow_assess_recall_department,
            allow_assess_recall_car_management,
            allow_assess_recall_lead,
            allow_request_cancel,
            allow_reject_recall
        }
    }

    //Department approval
    ctrl.prepareLeadDepartmentApprove_car = function ({item}) {
        ctrl._assess_registration_value = angular.copy(item);
        ctrl._assess_registration_value.files = [];
        ctrl._assess_registration_value.removed_attachments = [];
        ctrl._assess_registration_value.init_passenger = angular.copy(item.passenger);
        ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
    }

    ctrl.pick_starting_place_car = function (val) {
        ctrl._assess_registration_value.starting_place = val.value;
    }

    ctrl.pick_passenger_car = function (val) {
        ctrl._assess_registration_value.passenger = angular.copy(val);
    }

    ctrl.pick_department_car = function (val) {
        ctrl._assess_registration_value.to_department = angular.copy(val);
    }

    ctrl.chooseTimeToGo_car = function (val) {
        ctrl._assess_registration_value.time_to_go = val.getTime();
    }

    ctrl.choosePickUpTime_car = function (val) {
        if (val === null) {
            ctrl._assess_registration_value.pick_up_time = null;
        } else {
            ctrl._assess_registration_value.pick_up_time = val.getTime ? val.getTime() : val;
        }
    }

    ctrl.removeAttachment_update = function (val) {
        ctrl._assess_registration_value.removed_attachments.push(val);
        ctrl._assess_registration_value.attachments = ctrl._assess_registration_value.attachments.filter(e => e.id !== val.id);
    }

    ctrl.removeFile_car = function (item) {
        var temp = [];
        for (var i in ctrl._assess_registration_value.files) {
            if (ctrl._assess_registration_value.files[i].name != item.name) {
                temp.push(ctrl._assess_registration_value.files[i]);
            }
        }
        ctrl._assess_registration_value.files = angular.copy(temp);
    }

    ctrl.removeAttachment_car = function (val) {
        ctrl._assess_registration_value.removed_attachments.push(val);
        ctrl._assess_registration_value.attachments = ctrl._assess_registration_value.attachments.filter(e => e.id !== val.id);
    }

    ctrl.approve_department_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_department", approve_department_car_service);
    }

    function approve_department_car_service() {
        var dfd = $q.defer();
        registration_service.approve_department_car(
            ctrl._assess_registration_value.code,
            ctrl._assess_registration_value.note,
            ctrl._assess_registration_value.files,
            ctrl._assess_registration_value.starting_place,
            ctrl._assess_registration_value.destination,
            ctrl._assess_registration_value.passenger,
            ctrl._assess_registration_value.contact_passenger,
            ctrl._assess_registration_value.number_of_people,
            ctrl._assess_registration_value.time_to_go,
            ctrl._assess_registration_value.pick_up_time,
            ctrl._assess_registration_value.to_department,
            ctrl._assess_registration_value.content,
            ctrl._assess_registration_value.removed_attachments,
            ctrl._assess_registration_value.title,
        ).then(function () {
            dfd.resolve(true);
            ctrl.refreshData_registration();
            $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "approve_department");
            $("#modal_CarRegistration_LeadDepartment_Approval").modal('hide');
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.prepareAssess_car = function ({ item, action }) {
        ctrl._assess_registration_value = angular.copy(item);
        ctrl._assess_registration_value.action = action;
        ctrl._assess_registration_value.note = "";
        ctrl._assess_registration_value.note_required = true;
        ctrl._assess_registration_value.return_card = false;
        ctrl._assess_registration_value.edit_car_card = false;
        ctrl._assess_registration_value.showChooseProtocal = false;
        switch (action) {
            case "reject_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "approve_car_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                ctrl._assess_registration_value.showChooseProtocal = true;
                ctrl._assess_registration_value.type = 'car';
                break;
            case "reject_car_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                ctrl._assess_registration_value.note_required = true;
                
                break;
            case "approve_lead":
                ctrl._assess_registration_value.edit_car_card = true;
                ctrl._assess_registration_value.type = ctrl._assess_registration_value.assign_card ? 'card' : 'car';
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                ctrl._assess_registration_value.edit_card = true;
                ctrl._assess_registration_value.driverData = ctrl.driverList.find(item => item.username === ctrl._assess_registration_value.driver);
                ctrl._assess_registration_value.type = ctrl._assess_registration_value.assign_card ? 'card' :'car';
                break;
            case "reject_lead":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                ctrl._assess_registration_value.note_required = true;
               
                break;
            case "edit_card_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for edit card car');
                ctrl._assess_registration_value.showChooseCard = true;
                break;
            case "approve_lead_external":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead_external":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for reject');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "creator_receive_card":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for receive card');
                break;
            case "creator_return_card":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for return card');
                ctrl._assess_registration_value.return_card = true;
                ctrl._assess_registration_value.return_card_value = {
                    km: 10,
                    money: 1 * 100000,
                    invoices: [],
                    attachments: [],
                    truth: false,
                }
                ctrl._assess_registration_value.removeInvoice = function(item){
                    ctrl._assess_registration_value.return_card_value.invoices = ctrl._assess_registration_value.return_card_value.invoices.filter(file => file.name !== item.name);
                }
                break;
            case "manager_receive_card":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You can note for manager receive card');
                break;
            case "creator_cancel":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for cancel registration');
                ctrl._assess_registration_value.note_required = true;
                break;

            // recall
            case "request_cancel":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for cancel registration');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "reject_recall":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for approve reject recall registration');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "approve_recall_department":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "approve_recall_car_management":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                ctrl._assess_registration_value.note_required = true;
                break;
            case "approve_recall_lead":
                ctrl._assess_registration_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                ctrl._assess_registration_value.note_required = true;
                break;

        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
    }

    ctrl.loadfile_car = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_info_car(params.code, params.name).then(
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

    ctrl.loadfileInvoice_car = function (params) {
        return function () {
            var dfd = $q.defer();
            registration_service.load_file_invoice_car(params.code, params.name).then(
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

    ctrl.pick_driver_car = function (data) {
        ctrl._assess_registration_value.driverData = data;
        ctrl._assess_registration_value.driver = data.username;
    }

    ctrl.pick_vehicle_car = function (data) {
        ctrl._assess_registration_value.car = data.value;
    }

    //Start assess
    ctrl.reject_department_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_department", access_service_car("reject_department"));
    }

    ctrl.approve_car_management_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_car_management", access_service_car("approve_car_management"));
    }

    ctrl.reject_car_management_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_car_management", access_service_car("reject_car_management"));
    }

    ctrl.approve_lead_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_lead", access_service_car("approve_lead"));
    }

    ctrl.reject_lead_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_lead", access_service_car("reject_lead"));
    }

    ctrl.approve_lead_external_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_lead_external", access_service_car("approve_lead_external"));
    }

    ctrl.reject_lead_external_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_lead_external", access_service_car("reject_lead_external"));
    }

    ctrl.reject_card_management_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_card_management", access_service_car("reject_card_management"));
    }

    ctrl.creator_receive_card_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "creator_receive_card", access_service_car("creator_receive_card"));
    }

    ctrl.creator_return_card_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "creator_return_card", access_service_car("creator_return_card"));
    }

    ctrl.manager_receive_card_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "manager_receive_card", access_service_car("manager_receive_card"));
    }

    // Recall
    ctrl.request_cancel_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "request_cancel", access_service_car("request_cancel"));
    }
    ctrl.reject_recall_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_recall", access_service_car("reject_recall"));
    }

    ctrl.approve_recall_department_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_department", access_service_car("approve_recall_department"));
    }

    ctrl.approve_recall_car_management_car = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_car_management", access_service_car("approve_recall_car_management"));
    }

    ctrl.approve_recall_lead_car= function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_lead", access_service_car("approve_recall_lead"));
    }

    function access_service_car(action) {
        return function () {
            var dfd = $q.defer();
            let dfdAr = [];
            let car = undefined;
            let driver = undefined;
            let card = undefined;
            let assign_card = false;
            let messageSuccess = '';
            switch (action) {
                case "approve_department":
                    dfdAr.push(registration_service.approve_department_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    messageSuccess = $filter('l')('Accept registration successfully');
                    break;
                case "reject_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_department_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_car_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    if(ctrl._assess_registration_value.type === 'car'){
                        car = ctrl._assess_registration_value.car;
                        driver = ctrl._assess_registration_value.driver;
                    }else{
                        assign_card = true;
                        card = ctrl._assess_registration_value.card;
                    }
                    dfdAr.push(registration_service.approve_car_management_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note,
                        assign_card, card, car, driver));
                    break;
                case "reject_car_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_car_management_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    if(ctrl._assess_registration_value.type === 'car'){
                        car =ctrl._assess_registration_value.car;
                        driver = ctrl._assess_registration_value.driver;
                    }else{
                        assign_card = true;
                        card = ctrl._assess_registration_value.card;
                    }
                    dfdAr.push(registration_service.approve_lead_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note, assign_card, card, car, driver));
                    break;
                case "reject_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_lead_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_lead_external":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.approve_lead_external_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "reject_lead_external":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_lead_external_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "creator_receive_card":
                    messageSuccess = $filter('l')('card_received');
                    dfdAr.push(registration_service.creator_receive_card_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "creator_return_card":
                    messageSuccess = $filter('l')('CreatorReturnedCard');
                    dfdAr.push(registration_service.creator_return_card_car(
                        ctrl._assess_registration_value.code,
                        ctrl._assess_registration_value.note,
                        ctrl._assess_registration_value.return_card_value.money,
                        ctrl._assess_registration_value.return_card_value.km,
                        ctrl._assess_registration_value.return_card_value.invoices
                    ));
                    break;    
                case "reject_card_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(registration_service.reject_card_management_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "manager_assign_card":
                    dfdAr.push(registration_service.manager_assign_card_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note, ctrl._assess_registration_value.card));
                    break;
                case "manager_receive_card":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(registration_service.manager_receive_card_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;

                case "request_cancel":
                    messageSuccess = $filter('l')('registration_room_request_cancel');
                    dfdAr.push(registration_service.request_cancel_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "reject_recall":
                    messageSuccess = $filter('l')('RejectedRecalled');
                    dfdAr.push(registration_service.reject_recall_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_recall_department":
                    messageSuccess = $filter('l')('ApprovedRecalled');
                    dfdAr.push(registration_service.approve_recall_department_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_recall_car_management":
                    messageSuccess = $filter('l')('ApprovedRecalled');
                    dfdAr.push(registration_service.approve_recall_car_management_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;
                case "approve_recall_lead":
                    messageSuccess = $filter('l')('ApprovedRecalled');
                    dfdAr.push(registration_service.approve_recall_lead_car(ctrl._assess_registration_value.code, ctrl._assess_registration_value.note));
                    break;

            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_registration();
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
                $("#modal_CarRegistration_Assess").modal('hide');
                ctrl._customToastScope.addToastValue({
                    message: messageSuccess,
                    type:"success"
                });
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    //init
    function init() {
        let dfdAr_workflow = [];
        resetPaginationInfo_workflows();
        dfdAr_workflow.push(load_employee_detail());
        dfdAr_workflow.push(ctrl.load_workflow_play());
        dfdAr_workflow.push(ctrl.count_workflow_play());
        $q.all(dfdAr_workflow).then(function () {
            ctrl._notyetInit_workflow = false;
        });

        let dfdAr_task = [];
        resetPaginationInfo_task();
        dfdAr_task.push(ctrl.load_task());
        dfdAr_task.push(ctrl.count_task());
        $q.all(dfdAr_task).then(function () {
            ctrl._notyetInit_task = false;
        });

        let dfdAr_document = [];
        resetPaginationInfo_document();
        dfdAr_document.push(ctrl.load_document());
        dfdAr_document.push(ctrl.count_document());
        $q.all(dfdAr_document).then(function () {
            ctrl._notyetInit_document = false;
        });

        let dfdAr_news = [];
        resetPaginationInfo_news();
        dfdAr_news.push(ctrl.load_news());
        dfdAr_news.push(ctrl.count_news());
        $q.all(dfdAr_news).then(function () {
            ctrl._notyetInit_news = false;
        });

        let dfdAr_room = [];
        resetPaginationInfo_registration();
        dfdAr_room.push(ctrl.load_registration());
        dfdAr_room.push(ctrl.count_registration());
        dfdAr_room.push(ctrl.load_driver_list());
        $q.all(dfdAr_room).then(function () {
            ctrl._notyetInit_registration = false;
        });

        let dfdAr_all = dfdAr_workflow.concat(dfdAr_task, dfdAr_document, dfdAr_news, dfdAr_room);
        $q.all(dfdAr_all).then(function () {

            const collapseMetrics =
            {
                totalItems_workflow: "collapseWorkFlow",
                totalItems_task: "collapseTask",
                totalItems_document: "collapseDocument",
                totalItems_news: "collapseNews",
                totalItems_room: "collapseRoom"
            };

            let hasItems = false;

            for (let i in collapseMetrics) {
                if (ctrl[i] > 0) {
                    ctrl[collapseMetrics[i]] = true;
                    hasItems = true;
                    break;
                }
            }
            ctrl.hasNoItems = !hasItems;

        });
    }

    init();

}]);
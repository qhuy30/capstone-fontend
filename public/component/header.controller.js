

myApp.controller('header_controller', ['header_service', '$q', '$cookies','fRoot', '$rootScope', '$timeout', '$filter', function (header_service, $q, $cookies, fRoot, $rootScope, $timeout, $filter) {
    /**declare variable */

    var ctrl = this;
    var count_service = [
        // {
        //     name: "notify_count_pending", rule: ["Office.Notify.Approval"]
        // },
        // {
        //     name: "notify_count_not_seen", rule: []
        // },
        // {
        //     name: "task_count_created", rule: []
        // },
        // {
        //     name: "task_count_assigned", rule: []
        // },
        // {
        //     name: "dispatch_arrived_count_pending", rule: []
        // },
        // {
        //     name: "work_play_count_pending", rule: []
        // },
        // {
        //     name: "leave_form_count_pending", rule: []
        // },
        // {
        //     name: "journey_time_form_count_pending", rule: ["Office.JourneyTimeForm.Approval"]
        // },
        // {
        //     name: "labor_contract_count_pending", rule: ['Office.LaborContract.Approval']
        // }
    ];
    {
        ctrl._ctrlName = "header_controller";
        ctrl.countAr = [];
        ctrl.countRingBellItem = 0;
        ctrl.ringbellitems = [];
        ctrl.tab='notseen';
        ctrl.showSeenAll = false;
        ctrl.accounts = [];

        ctrl.currentPage_ringbellitem = 1;
        ctrl.numOfItemPerPage_ringbellitem = 20;
        ctrl.totalItems_ringbellitem = 0;
        ctrl.offset_ringbellitem = 0;
        ctrl.ringbellview ={};
        ctrl.ringbellview.da_forward_to_head_of_office = FrontendDomain + "/component/ringbell/da_forward_to_head_of_office.html";
        ctrl.ringbellview.da_forward_to_board_of_directors = FrontendDomain + "/component/ringbell/da_forward_to_board_of_directors.html";
        ctrl.ringbellview.da_forward_to_departments = FrontendDomain + "/component/ringbell/da_forward_to_departments.html";
        ctrl.ringbellview.da_department_accept_dispatch_arrived = FrontendDomain + "/component/ringbell/da_department_accept_dispatch_arrived.html";
        ctrl.ringbellview.da_department_reject_dispatch_arrived = FrontendDomain + "/component/ringbell/da_department_reject_dispatch_arrived.html";
        ctrl.ringbellview.da_department_read_dispatch_arrived = FrontendDomain + "/component/ringbell/da_department_read_dispatch_arrived.html";
        ctrl.ringbellview.da_new_task = FrontendDomain + "/component/ringbell/da_new_task.html";
        ctrl.ringbellview.task_assigned_main_person = FrontendDomain + "/component/ringbell/task_assigned_main_person.html";
        ctrl.ringbellview.task_assigned_participant = FrontendDomain + "/component/ringbell/task_assigned_participant.html";
        ctrl.ringbellview.task_assigned_observer = FrontendDomain + "/component/ringbell/task_assigned_observer.html";
        ctrl.ringbellview.task_assigned_department = FrontendDomain + "/component/ringbell/task_assigned_department.html";
        ctrl.ringbellview.project_create = FrontendDomain + "/component/ringbell/project_create.html";
        ctrl.ringbellview.project_update_info = FrontendDomain + "/component/ringbell/project_update_info.html";
        ctrl.ringbellview.task_add_comment = FrontendDomain + "/component/ringbell/task_add_comment.html";
        ctrl.ringbellview.task_update_comment = FrontendDomain + "/component/ringbell/task_update_comment.html";
        ctrl.ringbellview.task_updated_status = FrontendDomain + "/component/ringbell/task_updated_status.html";
        ctrl.ringbellview.task_add_proof = FrontendDomain + "/component/ringbell/task_add_proof.html";
        ctrl.ringbellview.task_remove_proof = FrontendDomain + "/component/ringbell/task_remove_proof.html";
        ctrl.ringbellview.task_push_file = FrontendDomain + "/component/ringbell/task_push_file.html";
        ctrl.ringbellview.task_remove_file = FrontendDomain + "/component/ringbell/task_remove_file.html";
        ctrl.ringbellview.task_updated_progress = FrontendDomain + "/component/ringbell/task_updated_progress.html";
        ctrl.ringbellview.task_updated = FrontendDomain + "/component/ringbell/task_updated.html";
        ctrl.ringbellview.workflow_need_approve = FrontendDomain + "/component/ringbell/workflow_need_approve.html";
        ctrl.ringbellview.workflow_approved = FrontendDomain + "/component/ringbell/workflow_approved.html";
        ctrl.ringbellview.workflow_rejected = FrontendDomain + "/component/ringbell/workflow_rejected.html";
        ctrl.ringbellview.workflow_returned = FrontendDomain + "/component/ringbell/workflow_returned.html";
        ctrl.ringbellview.workflow_rejected_creator = FrontendDomain + "/component/ringbell/workflow_rejected_creator.html";
        ctrl.ringbellview.workflow_approved_creator = FrontendDomain + "/component/ringbell/workflow_approved_creator.html";
        ctrl.ringbellview.workflow_returned_creator = FrontendDomain + "/component/ringbell/workflow_returned_creator.html";
        ctrl.ringbellview.workflow_deleted = FrontendDomain + "/component/ringbell/workflow_deleted.html";
        ctrl.ringbellview.workflow_done = FrontendDomain + "/component/ringbell/workflow_done.html";
        ctrl.ringbellview.workflow_transform_sign = FrontendDomain + "/component/ringbell/workflow_transform_sign.html";
        ctrl.ringbellview.task_receive_to_know = FrontendDomain + "/component/ringbell/task_receive_to_know.html";
        ctrl.ringbellview.obd_released = FrontendDomain + "/component/ringbell/obd_released.html";
        ctrl.ringbellview.task_overdue_notify = FrontendDomain + "/component/ringbell/task_overdue_notify.html";
        ctrl.ringbellview.task_upcoming_deadline_daily = FrontendDomain + "/component/ringbell/task_upcoming_deadline_daily.html";
        ctrl.ringbellview.task_upcoming_deadline_weekly = FrontendDomain + "/component/ringbell/task_upcoming_deadline_weekly.html";
        ctrl.ringbellview.notify_late_workflow_play = FrontendDomain + "/component/ringbell/notify_late_workflow_play.html";
        ctrl.ringbellview.project_update_status = FrontendDomain + "/component/ringbell/project_update_status.html";
        ctrl.ringbellview.task_transfered_leader_department = FrontendDomain + "/component/ringbell/task_transfered_leader_department.html";
    
        ctrl.ringbellview.notify_approved_recall = FrontendDomain + "/component/ringbell/notify_approved_recall.html";
        ctrl.ringbellview.notify_approved = FrontendDomain + "/component/ringbell/notify_approved.html";
        ctrl.ringbellview.notify_need_approve = FrontendDomain + "/component/ringbell/notify_need_approve.html";
        ctrl.ringbellview.notify_need_approve_recall = FrontendDomain + "/component/ringbell/notify_need_approve_recall.html";
        ctrl.ringbellview.notify_rejected = FrontendDomain + "/component/ringbell/notify_rejected.html";
        ctrl.ringbellview.notify_approved_to_user = FrontendDomain + "/component/ringbell/notify_approved_to_user.html";

        //Car registration
        ctrl.ringbellview.car_need_to_approve = FrontendDomain + "/component/ringbell/car_need_to_approve.html";
        ctrl.ringbellview.car_approve = FrontendDomain + "/component/ringbell/car_approve.html";
        ctrl.ringbellview.car_registration_reject = FrontendDomain + "/component/ringbell/car_registration_reject.html";
        ctrl.ringbellview.car_need_review = FrontendDomain + "/component/ringbell/car_need_review.html";
        ctrl.ringbellview.car_registration_request_cancel = FrontendDomain + "/component/ringbell/car_registration_request_cancel.html";
        ctrl.ringbellview.car_registration_approve_recall = FrontendDomain + "/component/ringbell/car_registration_approve_recall.html";
        ctrl.ringbellview.car_registration_letter = FrontendDomain + "/component/ringbell/car_registration_letter.html";
        ctrl.ringbellview.car_registration_reject_recall = FrontendDomain + "/component/ringbell/car_registration_reject_recall.html";

        ctrl.ringbellview.registration_room_approve = FrontendDomain + "/component/ringbell/registration_room_approve.html";
        ctrl.ringbellview.registration_room_approve_recall = FrontendDomain + "/component/ringbell/registration_room_approve_recall.html";
        ctrl.ringbellview.registration_room_reject = FrontendDomain + "/component/ringbell/registration_room_reject.html";
        ctrl.ringbellview.registration_room_reject_recall = FrontendDomain + "/component/ringbell/registration_room_reject_recall.html";
        ctrl.ringbellview.registration_room_request_cancel = FrontendDomain + "/component/ringbell/registration_room_request_cancel.html";
    
        ctrl.ringbellview.registration_room_letter = FrontendDomain + "/component/ringbell/registration_room_letter.html";

        //Event calendar
        ctrl.ringbellview.event_calendar_need_approve = FrontendDomain + "/component/ringbell/event_calendar_need_approve.html";
        ctrl.ringbellview.event_calendar_need_approve_recall = FrontendDomain + "/component/ringbell/event_calendar_need_approve_recall.html";
        ctrl.ringbellview.event_calendar_approve = FrontendDomain + "/component/ringbell/event_calendar_approve.html";
        ctrl.ringbellview.event_calendar_reject = FrontendDomain + "/component/ringbell/event_calendar_reject.html";
        ctrl.ringbellview.event_calendar_reject_recall = FrontendDomain + "/component/ringbell/event_calendar_reject_recall.html";
        
        //Task
        ctrl.ringbellview.need_approve_receive_task = FrontendDomain + "/component/ringbell/need_approve_receive_task.html";
        ctrl.ringbellview.need_approve_department_receive_task = FrontendDomain + "/component/ringbell/need_approve_department_receive_task.html";
        ctrl.ringbellview.receive_task = FrontendDomain + "/component/ringbell/receive_task.html";
        ctrl.ringbellview.reject_receive_task = FrontendDomain + "/component/ringbell/reject_receive_task.html";
        ctrl.ringbellview.reject_approval_receive_task = FrontendDomain + "/component/ringbell/reject_approval_receive_task.html";
    }

    function resetRingBellVariable(){
        ctrl.countRingBellItem = 0;
        ctrl.ringbellitems = [];

        ctrl.currentPage_ringbellitem = 1;
        ctrl.numOfItemPerPage_ringbellitem = 20;
        ctrl.totalItems_ringbellitem = 0;
        ctrl.offset_ringbellitem = 0;
    }

    function count(name) {
        var dfd = $q.defer();
        header_service[name]().then(function (res) {
            dfd.resolve(res.data.count);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadRingBellItem() {
        if ($filter('checkRule')(['Authorized'])) {
            header_service.loadRingBellItem(ctrl.tab,ctrl.numOfItemPerPage_ringbellitem, (ctrl.currentPage_ringbellitem - 1) * ctrl.numOfItemPerPage_ringbellitem).then(function (res) {
                for(let i in res.data){
                    ctrl.ringbellitems.push(res.data[i]);
                }
                ctrl.ringbellitems.sort(function(a, b) {
                    return b.notify_time - a.notify_time;
                });
                res = undefined;
            }, function (err) {
                console.log(err);
                err = undefined;
            });
        }
    }

    function countRingBellItem() {
        if ($filter('checkRule')(['Authorized'])) {
            header_service.countRingBellItem().then(function (res) {
                ctrl.countRingBellItem = res.data.count;
                res = undefined;
            }, function (err) {
                console.log(err);
                err = undefined;
            });
        }
    }

    function countAllRingBellItem() {
        if ($filter('checkRule')(['Authorized'])) {
            header_service.countAllRingBellItem(ctrl.tab).then(function (res) {
                ctrl.totalItems_ringbellitem = res.data.count;
                if(ctrl.tab ==='notseen'  && ctrl.totalItems_ringbellitem>0){
                    ctrl.showSeenAll = true;
                }
                res = undefined;
            }, function (err) {
                console.log(err);
                err = undefined;
            });
        }
    }

    ctrl.addAnotherAccount = function() {
        let logginArray = fRoot.getCookies(window.cookieKey.logginArray).data;
    
        if (logginArray) {
            logginArray = JSON.parse(logginArray);
        } else {
            logginArray = [];
        }
    
        const newAccount = {
            username: $rootScope.logininfo.username,
            tenantlLogin: fRoot.getCookies(window.cookieKey.token).data,
            title: $rootScope.logininfo.data.title,
            imageUrl: $rootScope.logininfo.data.avatar.url
        };

        const isExistingAccount = logginArray.some(account => 
            account.username === newAccount.username && 
            account.tenantlLogin === newAccount.tenantlLogin
        );
    
        if (!isExistingAccount) {
            logginArray.push(newAccount);
            fRoot.setCookies(window.cookieKey.logginArray, JSON.stringify(logginArray));
        } else {
            console.log('Account already exists');
        }

        fRoot.delCookies(window.cookieKey.token);
        fRoot.delCookies(window.cookieKey.refreshToken);
        fRoot.delCookies(window.cookieKey.currentPath);
        window.location.href = '/login';
    }

    ctrl.switchAccount = function(account) {
        let logginArray = fRoot.getCookies(window.cookieKey.logginArray).data;

        if (logginArray) {
            logginArray = JSON.parse(logginArray);
        } else {
            logginArray = [];
        }
    
        const tenantlLogin = fRoot.getCookies(window.cookieKey.token).data;
        logginArray.push({
            username: $rootScope.logininfo.username,
            tenantlLogin: tenantlLogin,
            title:  $rootScope.logininfo.data.title,
            imageUrl: $rootScope.logininfo.data.avatar.url
        });

        logginArray = logginArray.filter(accountItem => 
            !(accountItem.username === account.username && accountItem.tenantlLogin === account.tenantlLogin)
        );
        
        fRoot.setCookies(window.cookieKey.logginArray, JSON.stringify(logginArray));
        fRoot.setCookies(window.cookieKey.token, account.tenantlLogin);
        window.location.reload();
    }

    function loadUserSwicth() {
        const cookieData = fRoot.getCookies(window.cookieKey.logginArray);

        if (cookieData && cookieData.data) {
            ctrl.accounts = JSON.parse(cookieData.data);
        } else {
            ctrl.accounts = [];
        }
    }    

    function initCountData() {
        var dfdAr = [];
        var temp = [];
        for (var i in count_service) {
            if (count_service[i].rule.length === 0) {
                dfdAr.push(count(count_service[i].name));
                temp.push(count_service[i]);
            } else {
                if ($filter('checkRule')(count_service[i].rule)) {

                    dfdAr.push(count(count_service[i].name));
                    temp.push(count_service[i]);
                }
            }

        }

        $q.all(dfdAr).then(function (data) {
            ctrl.countAr = [];
            for (var i in temp) {
                if (data[i] > 0) {
                    ctrl.countAr.push({
                        name: temp[i].name,
                        count: data[i]
                    });
                }

            }
        }, function (err) {
            console.log(err);
        });
    }
    function init() {
        loadUserSwicth();
        initCountData();
        countRingBellItem();
        countAllRingBellItem();
        loadRingBellItem();
    }

    $rootScope.$on('newRingbellItemReceived', function() {
        resetData();
    });

    function resetData(){
        ctrl.ringbellitems = [];
        initCountData();
        countRingBellItem();
        countAllRingBellItem();
        loadRingBellItem();
    }

    init();
    ctrl.clickProfile = function () {
        if ($("#myapp")) {
            $("#myapp").addClass("aside-menu-hidden");
            $("#myapp").removeClass("aside-menu-show");
        }

    }

    ctrl.switchTab = function(val){
        ctrl.tab = val;
        resetData();
    }

    $rootScope.$watch('Settings',function(){
        if($rootScope.Settings){
            
            for (var i in $rootScope.Settings) {
                switch ($rootScope.Settings[i].key) {
                    case "logo":
                       
                        ctrl.logo = $rootScope.Settings[i].value;
                        break;
    
                }
            }
        }
    })
    
    ctrl.loadMoreRingBellItem = function () {
        if (ctrl.totalItems_ringbellitem > (ctrl.currentPage_ringbellitem * ctrl.numOfItemPerPage_ringbellitem)) {
            ctrl.currentPage_ringbellitem++;
            loadRingBellItem();
        }
    }
    
    ctrl.seenRingBellItem = function (item) {
        ctrl.isOpenRingbell = false;
        if(!item.seen || item.seen.indexOf($rootScope.logininfo.username)===-1){
            header_service.seenRingBellItem(item._id).then(function () {
                resetRingBellVariable();
                countRingBellItem();
                countAllRingBellItem();
                loadRingBellItem();
             }, function (err) { console.log(err) });
        }
    }

    ctrl.countDateDiff = function (day){
        var specificDate = new Date(day);
        var currentDate = new Date();
        return Math.ceil((Math.abs(currentDate.getTime() - specificDate.getTime())) / (1000 * 3600 * 24));
    }

    ctrl.formatDate = function (date) {
        return moment(date).format("DD/MM/YYYY");
    }

    ctrl.hideRingbell = function(){
        if(ctrl.isOpenRingbell){
            ctrl.isOpenRingbell = false;
        }
    }

    ctrl.seenAll = function(){
        ctrl.showSeenAll = false;
        header_service.seenAllRingBellItem().then(function(){
           
            resetData();
        },function(err){console.log(err);})
    }
}]);



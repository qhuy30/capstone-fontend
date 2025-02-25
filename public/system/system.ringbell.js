myApp.factory('componentRingbellNotify', ['socket', '$rootScope', 'fRoot', 'PushNotifyFactory', '$filter', '$q',
    function (socket, $rootScope, fRoot, PushNotifyFactory, $filter, $q) {
        var obj = {};
        const pushFunc ={};

        function getuserInformation(username) {
            var dfd = $q.defer();
            fRoot.requestHTTP({
                url: BackendDomain + "/management/user/loadfordirective",
                method: "POST",
                data: JSON.stringify({ account: username.toString().trim() }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json;odata=verbose"
                }
            }).then(function (data) {
                dfd.resolve(data.data);
            }, function (err) {
                dfd.reject(err);
            });
            return dfd.promise;
        }

        pushFunc.project_update_info = async function (data) {
            const userDetails = await getuserInformation(data.params.username_update);
            const nameUser = userDetails.title;
            switch (data.params.action) {
                case "workflow play":
                    PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                        `${$filter('l')('is updated signature link by')} ${nameUser}`,
                        `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
                    break;
                case "updateParticipants":
                    PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                        `${$filter('l')('just updated participants by')} ${nameUser}`,
                        `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
                    break;
                case "title":
                    PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('updated title to')} ${data.params.to_title}`,
                        `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
                    break;
                case "project implementation time":
                    PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('updated time')}`,
                        `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
                    break;
            }
        }

        pushFunc.task_add_comment = async function (data) {
            const userDetails = await getuserInformation(data.params.username_add_comment);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('added comment to task')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_updated_status = async function (data) {
            const userDetails = await getuserInformation(data.params.username_updated_status);
            const nameUser = userDetails.title;

            switch (data.params.action) {
                case "startTask":
                    PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('started task')}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
                    break;
                case "doneTask":
                    PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${nameUser}  ${$filter('l')('done task')}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
                    break;
                case "completedTask":
                    PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('marked to completed task')}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
                    break;
                case "cancelTask":
                    PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('cancel task')}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
                    break;
            }
        }

        pushFunc.task_add_proof = async function (data) {
            const userDetails = await getuserInformation(data.params.username_add_proof);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('added proof to task')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_remove_proof =  async function (data) {
            const userDetails = await getuserInformation(data.params.username_remove_proof);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('removed proof from task')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_push_file =  async function (data) {
            const userDetails = await getuserInformation(data.params.username_push_file);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('pushed file')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_remove_file =  async function (data) {
            const userDetails = await getuserInformation(data.params.username_remove_file);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('removed file')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_updated_progress =  async function (data) {
            const userDetails = await getuserInformation(data.params.username_updated_progress);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('updated progress from')} ${data.params.from_progress}% ${$filter('l')('to progress')} ${data.params.to_progress}%`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_updated =  async function (data) {
            const userDetails = await getuserInformation(data.params.username_update_task);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('updated information')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.workflow_approved = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('approved the signature')}`,
                `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_need_approve = async function (data) {
            switch (data.params.action) {
                case "process":
                    PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        $filter('l')('Need you to review and record it in the official document registry'),
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
                    break;
                case "all":
                    PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        $filter('l')('Need you to approve'),
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
                    break;
                case "one":
                    PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        $filter('l')('Need you to approve'),
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
                    break;
            }
        }

        pushFunc.workflow_rejected = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('rejected the signature')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_returned =  async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
            `${nameUser} ${$filter('l')('returned the signature')}`,
            `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_rejected_creator = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('rejected your signature')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_approved_creator = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('approved your signature')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_returned_creator = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
            `${nameUser} ${$filter('l')('returned your signature')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_deleted = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
            `${nameUser} ${$filter('l')('deleted the signature')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }
        
        pushFunc.workflow_done = async function (data) {
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
            `${$filter('l')('has been completed')}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.workflow_transform_sign = async function (data) {
            const userDetails = await getuserInformation(data.params.actionBy);
            const nameUser = userDetails.title;
            const assignedUserDetails = await getuserInformation(data.params.assignee);
            const nameAssignedUser = assignedUserDetails.title;
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        `${nameUser} ${$filter('l')('has forwarded')} ${$filter('l')('Signature WF')} ${$filter('l')('to')} ${nameAssignedUser}`,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.task_receive_to_know = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        $filter('l')('Need to review'),
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_assigned_main_person = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        $filter('l')('Need you to lead'),
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_assigned_participant = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        $filter('l')('Need your coordination'),
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_assigned_observer = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        $filter('l')('Need you to supervision'),
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_assigned_department = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        $filter('l')('AssignedToYourDepartment'),
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.project_create = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                        $filter('l')('Need your coordination'),
                        `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
        }

        pushFunc.da_forward_to_head_of_office = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        $filter('l')('Need you to review and provide guidance'),
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }

        pushFunc.da_forward_to_board_of_directors = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        $filter('l')('Need you to review and provide guidance'),
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }

        pushFunc.da_department_accept_dispatch_arrived = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        `${data.params.department_title[$rootScope.Language.current]} ${$filter('l')('accept the processing of incoming official document')}`,
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }

        pushFunc.da_new_task = async function(data){
            PushNotifyFactory.push(`${$filter('l')('Task')} ${data.params.taskCode} ${data.params.task_title}`,
                        `${data.params.department_title[$rootScope.Language.current]} ${$filter('l')('is assigned a task')}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.da_department_reject_dispatch_arrived = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        `${data.params.department_title[$rootScope.Language.current]} ${$filter('l')('refuse the processing of incoming official document')}`,
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }
        
        pushFunc.da_department_read_dispatch_arrived = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        `${data.params.department_title[$rootScope.Language.current]} ${$filter('l')('read')} ${data.params.code}`,
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }

        pushFunc.da_forward_to_departments = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchArrived')} ${data.params.code}`,
                        `${$filter('l')('Need you to review and provide your opinion')}`,
                        `${window.primaryDomain}/da-details?code=${data.params.code}`);
        }

        pushFunc.obd_released = async function(data){
            PushNotifyFactory.push(`${$filter('l')('DispatchAway')} ${data.params.code} ${data.params.title}`,
                        `${$filter('l')('is released')}`,
                        `${window.primaryDomain}/odb-details?code=${data.params.code}`);
        }

        pushFunc.notify_need_approve = async function (data) {
          PushNotifyFactory.push(
            `${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
            $filter("l")("Need you to review and approve notify"),
            `${window.primaryDomain}/notify-details?code=${data.params.code}`
          );
        };

        pushFunc.notify_rejected = async function (data) {
            const userDetails = await getuserInformation(data.params.action_by);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('rejected the notify')}`,
                        `${window.primaryDomain}/notify-details?code=${data.params.code}`);
        }

        pushFunc.notify_approved = async function (data) {
            const userDetails = await getuserInformation(data.params.action_by);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('approved the notify')}`,
                        `${window.primaryDomain}/notify-details?code=${data.params.code}`);
        }

        pushFunc.notify_approved_recall = async function (data) {
            const userDetails = await getuserInformation(data.params.action_by);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('approved recall the notify')}`,
                        `${window.primaryDomain}/notify-details?code=${data.params.code}`);
        }

        pushFunc.notify_approved = async function (data) {
            const userDetails = await getuserInformation(data.params.action_by);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('approved the notify')}`,
                        `${window.primaryDomain}/notify-details?code=${data.params.code}`);
        }

        pushFunc.notify_approved_to_user = async function (data) {
            const userDetails = await getuserInformation(data.params.action_by);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
                       `${nameUser} ${$filter('l')('There is a news notify that has not been viewed yet')}`,
                        `${window.primaryDomain}/notify-details?code=${data.params.code}`);
        }

        pushFunc.notify_need_approve_recall = async function (data) {
            PushNotifyFactory.push(
              `${$filter('l')('Notify')} [${data.params.code}] ${data.params.title}`,
              $filter("l")("Need you to review and approve recall notify"),
              `${window.primaryDomain}/notify-details?code=${data.params.code}`
            );
          };

        const countDateDiff = function (day){
            var specificDate = new Date(day);
            var currentDate = new Date();
            return Math.ceil((Math.abs(currentDate.getTime() - specificDate.getTime())) / (1000 * 3600 * 24));
        }

        const showTime = function(time){
            var d = new Date();
            let result = "";
            d.setTime(time);
            result += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
            result += "/";
            result += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
            result += "/";
            result += d.getFullYear();
            return result;
        }

        pushFunc.task_overdue_notify = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${$filter('l')('Overdue')} ${countDateDiff(data.params.to_date)} ${$filter('l')('Days')} ${$filter('l')('FromDate')} ${showTime(data.params.to_date)}`,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_upcoming_deadline_daily = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                        `${$filter('l')('Task is due tomorrow',{title: `[${data.params.code}] ${data.params.title}`})} `,
                        `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }

        pushFunc.task_upcoming_deadline_weekly = async function (data) {
            PushNotifyFactory.push(`${$filter('l')('You have number tasks with upcoming deadlines this week',{number: data.params.length})}`,
                        `${$filter('l')('Need to review')} `,
                        `${window.primaryDomain}/task?tab=personal`);
        }

        pushFunc.notify_late_workflow_play = async function (data) {
            PushNotifyFactory.push(`[${data.params.code}] ${data.params.title}`,
                        `${$filter('l')( data.params.mes,{title: `[${data.params.code}] ${data.params.title}`, from_date: ctrlHeaders.formatDate(data.params.from_date),to_date: ctrlHeaders.formatDate(data.params.to_date)} )} `,
                        `${window.primaryDomain}/signing-details?code=${data.params.code}`);
        }

        pushFunc.project_update_status = async function (data) {
            const userDetails = await getuserInformation(data.params.username_update);
            const nameUser = userDetails.title;
            let action ="";
            switch(data.params.action){
                case "startProject":
                    action = `${nameUser} ${$filter('l')('started project')}`
                    break;
                case "closeProject":
                    action = `${nameUser} ${$filter('l')('closed project')}`
                    break;
            }
            PushNotifyFactory.push(`${$filter('l')('Project')} [${data.params.code}] ${data.params.title}`,
                    action,
                    `${window.primaryDomain}/task?tab=project&id=${data.params.projectId}`);
        }

        pushFunc.car_ticket_status = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('Car')} [${data.to_username}] ${$filter('l')(data.params.status)}`,
                `${data.params.destination} - ${data.params.car}`,
                `${nameUser} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_need_to_approve = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${nameUser}] ${$filter('l')(data.from_action)}`,
                `${data.params.destination} - ${data.params.code}`,
                `${nameUser} ${$filter('l')(data.from_action)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_approve = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${nameUser}] ${$filter('l')(data.from_action)}`,
                `${data.params.destination} - ${data.params.code}`,
                `${nameUser} ${$filter('l')(data.from_action)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_registration_reject = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${nameUser}] ${$filter('l')(data.from_action)}`,
                `${data.params.destination} - ${data.params.code}`,
                `${nameUser} ${$filter('l')(data.from_action)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_registration_request_cancel = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${nameUser}] ${$filter('l')(data.from_action)}`,
                `${data.params.destination} - ${data.params.code}`,
                `${nameUser} ${$filter('l')(data.from_action)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_registration_approve_recall = async function (data) {
            const userDetails = await getuserInformation(data.username);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${nameUser}] ${$filter('l')(data.from_action)}`,
                `${data.params.destination} - ${data.params.code}`,
                `${nameUser} ${$filter('l')(data.from_action)}`,
                `${window.primaryDomain}/car_management`
            );
        }

        pushFunc.car_registration_letter = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.car_registration_reject_recall = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('CarRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }
        
        pushFunc.registration_room_approve = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

         pushFunc.registration_room_letter = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.registration_room_approve_recall = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.registration_room_reject = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.registration_room_reject_recall = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.registration_room_request_cancel = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('RoomRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/meeting-room`
            );
        }

        pushFunc.event_calendar_need_approve = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('EventCalendarRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/event-calendar`
            );
        }

        pushFunc.event_calendar_need_approve_recall = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('EventCalendarRegisterRecall')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/event-calendar`
            );
        }

        pushFunc.event_calendar_approve = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('EventCalendarRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/event-calendar-details?code=${data.params.code}`
            );
        }

        pushFunc.event_calendar_reject = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('EventCalendarRegister')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/event-calendar-details?code=${data.params.code}`
            );
        }

        pushFunc.event_calendar_reject_recall = async function (data){
            const userDetails = await getuserInformation(data.username);
            PushNotifyFactory.push(
                `${$filter('l')('EventCalendarRegisterRecall')} [${userDetails.title}]`,
                `${userDetails.title} ${$filter('l')(data.params.status)}`,
                `${window.primaryDomain}/event-calendar-details?code=${data.params.code}`
            );
        }

        pushFunc.task_update_comment = async function (data){
            const userDetails = await getuserInformation(data.params.username_update_comment);
            const nameUser = userDetails.title;
            PushNotifyFactory.push(`${$filter('l')('Task')} [${data.params.taskCode}] ${data.params.title}`,
                `${nameUser} ${$filter('l')('updated comment to task')}`,
                `${window.primaryDomain}/task-details?code=${data.params.taskCode}`);
        }


        obj.pushNotify = async function (data) {
            if(pushFunc[data.action]){
                pushFunc[data.action](data);
            }else{
                console.log(`Has not define notification ${data.action}`);
            }
        }

        return obj;
    }]);
myApp.registerCtrl('meeting_room_controller', ['meeting_room_service', '$q', '$rootScope', '$filter', '$location', 'languageValue', 'localStorage', '$timeout', function (meeting_room_service, $q, $rootScope, $filter, $location, $languageValue, $localStorage, $timeout) {

    const _statusValueSet = [
        { name: "MeetingRoom", action: "load" },
        { name: "MeetingRoom", action: "getOrderNumber" },
        { name: "MeetingRoom", action: "count" },
        { name: "MeetingRoom", action: "insert" },
        { name: "MeetingRoom", action: "update" },
        { name: "MeetingRoom", action: "delete" },
        { name: "MeetingRoom", action: "register" },
        { name: "MeetingRoom", action: "loadForUpdate" },
        { name: "MeetingRoom", action: "changeStatus" },
        { name: "MeetingRoom", action: "loadSchedule" },
        { name: "MeetingRoom", action: "countSchedule" },
        { name: "MeetingRoom", action: "loadCalendar" },
        { name: "MeetingRoom", action: "loadRoomType" },
        { name: "MeetingRoom", action: "loadRoomRegister" },
        { name: "Registration", action: "delete" },
        { name: "Register", action: "load" },
        { name: "Register", action: "loadHost" },
        { name: "Register", action: "loadRoom" },
        { name: "Update", action: "load" },

        { name: "MeetingRoom", action: "approve_department" },
        { name: "MeetingRoom", action: "reject_department" },
        { name: "MeetingRoom", action: "approve_management" },
        { name: "MeetingRoom", action: "reject_management" },
        { name: "MeetingRoom", action: "approve_lead" },
        { name: "MeetingRoom", action: "reject_lead" },

        { name: "MeetingRoom", action: "approve_recall_department" },
        { name: "MeetingRoom", action: "reject_recall_department" },
        { name: "MeetingRoom", action: "approve_recall_management" },
        { name: "MeetingRoom", action: "reject_recall_management" },
        { name: "MeetingRoom", action: "approve_recall_lead" },
        { name: "MeetingRoom", action: "reject_recall_lead" },

        { name: "MeetingRoom", action: "export_excel" },

        { name: "MeetingRoom", action: "getMasterDirectoryItem" },

        { name: "MeetingRoom", action: "loadButler" },
        { name: "MeetingRoom", action: "countButler" },
    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "meeting_room_controller";
        ctrl.validPermission = $filter('checkRuleCheckbox')('Office.MeetingRoom.Use');
        ctrl.master_key = 'meeting_room';
        ctrl.tab = 'schedule';
        ctrl.$languageValue = $languageValue;
        ctrl._departments = [];

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 20;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.sort_bulter = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.meetingRooms = [];
        ctrl.listRooms = [];
        ctrl._roomCalendar = [];
        ctrl._roomTypes = [];
        ctrl.weekDays = [];
        ctrl._rooms = [];
        ctrl._room_types = [];
        ctrl.roomTypes_filter_data = [];
        ctrl.selectedRoomType = '';

        ctrl.master_directory_item = {};

        ctrl._start_date_butler_filter = $filter('getSpecificDateRange')('startOfWeek');
        ctrl._end_date_butler_filter = $filter('getSpecificDateRange')('endOfWeek');

        ctrl.currentPageButler= 1;
        ctrl.totalItemsButler= 0;
        ctrl.offsetButler= 0;
        ctrl.numOfItemPerPageButler= 10;
        ctrl.butlerList = [];

        ctrl.numDateShowCalendar = 20;
        ctrl.currentPageRegistered = 1;
        ctrl.numOfItemPerPageRegistered = 20;
        ctrl.totalItemsRegistered = 0;
        ctrl.offsetRegistered = 0;
        ctrl.sortRegistered = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.registeredList = [];
        ctrl._notyetInit = true;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";
        ctrl._filter = []
        ctrl._idEdit = "";
        ctrl._idCancel = "";
        ctrl.rooms = [];
        ctrl.selectedRoom = null;
        ctrl.selectedRoomId = null;
        ctrl._assess_value = {};

        ctrl.checkbox_responsibility = false;
        ctrl.checkbox_created = false;
        ctrl.checkbox_handled = false;
        ctrl.checkbox_rejected = false;
        ctrl.checkbox_needhandle = true;
        ctrl._searchFilter_schedule = "";

        ctrl.show_checkbox_handled = false;
        ctrl.show_checkbox_rejected = false;
        ctrl.show_checkbox_approved = false;
        ctrl.show_checkbox_needhandle = false;
        ctrl.show_checkbox_created = false;
        ctrl.show_checkbox_responsibility = false;

        ctrl.calendar_checkbox_created = false;
        ctrl.calendar_checkbox_responsibility = false;
        ctrl.calendar_checkbox_my = false;
        ctrl.calendar_checkbox_all = false;

        ctrl.calendar_checkbox_host = false;
        ctrl.calendar_checkbox_participants = false;

        ctrl.show_calendar_checkbox_to_department = false;
        ctrl.calendar_checkbox_to_department = false;

        ctrl.show_calendar_checkbox_created = false;
        ctrl.show_calendar_checkbox_responsibility = false;
        ctrl.show_calendar_checkbox_my = false;
        ctrl.show_calendar_checkbox_all = false;

        ctrl.tab_my_calendar = true;

        ctrl.room_list_config = {
            master_key: "meeting_room",
            load_details_column: "value",
        };
        ctrl.columns = {
            index:{
                title: 'STT',
                show: true
            },
            dateCreated:{
                title: $filter('l')('Created date'),
                show: true
            },
            title:{
                title: $filter('l')('Title'),
                show: true
            },
            startDate:{
                title: $filter('l')('StartDate'),
                show: true
            },
            endDate:{
                title: $filter('l')('EndDate'),
                show: true
            },
            type:{
                title: $filter('l')('Type'),   
                show: true
            },
            createdBy:{
                title: $filter('l')('Created by'),
                show: true
            },
            hostPerson:{
                title: $filter('l')('HostPerson'),
                show: true
            },
            numberOfParticipants:{
                title: $filter('l')('NumberOfParticipants'),
                show: true
            },
            room:{
                title: $filter('l')('Room'),
                show: true
            },
            status:{
                title: $filter('l')('Status'),
                show: true
            },
            approvalTime:{
                title: $filter('l')('ApprovalTime'),
                show: true
            }
        }

        ctrl.columnsArray =  Object.keys(ctrl.columns).map(key => {
            return {
                key: key,
                title: ctrl.columns[key].title,
                show: ctrl.columns[key].show
            };
        })

        
        // Modal 
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/meeting_room/views/insert_room_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/meeting_room/views/update_room_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/meeting_room/views/delete_room_modal.html";
        ctrl._urlRegisterModal = FrontendDomain + "/modules/office/meeting_room/views/room_registration_modal.html";
        ctrl._urlUpdateRegisterModal = FrontendDomain + "/modules/office/meeting_room/views/update_room_registration_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/meeting_room/views/cancel_registration_modal.html";

        ctrl._urlDepartmentApprove = FrontendDomain + "/modules/office/meeting_room/views/department_approve.html";
        ctrl._urlRoomAssess = FrontendDomain + "/modules/office/meeting_room/views/room_assess_modal.html";
        
        ctrl._customToastScope = angular.element(document.querySelector('#custom-toast-container')).scope();
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl.tabPermission = {
            'Management': false,
            'RoomList': false,
            'MyOwn': true,
            'GeneralRoomList': true,
            'Calendar': false,
            'Butler': false,
        }

        ctrl.now = new Date();

        ctrl.calendar_checkbox_room_type = {};
        ctrl.calendar_tab_room_type = {};

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
    }

    ctrl.set_hint_note = function(note) {
        ctrl._assess_value.note = $filter('l')(note);
    }

    ctrl.set_hint_note_department = function(note) {
        ctrl._update_register_value.note = $filter('l')(note);
    }

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


    const MEETING_ROOM_SCHEDULE_STATUS = {
        REGISTERED: "Registered",
        APPROVED: "Approved",
        DEPARTMENT_APPROVED: "DepartmentApproved",
        CONFIRMED: "Confirmed",
        REQUEST_CANCEL: "RequestCancel",
        CANCELLED: "Cancelled",
        REJECTED: "Rejected"
    }

    const ROOM_TYPE = {
        MEETING: "MeetingRoom",
        CLASS: "LectureHallClassroom"
    }

    const ROOM_RULE = {
        USE: "Office.MeetingRoomSchedule.Use",
        REGISTERED_ROOM: "Office.MeetingRoomSchedule.register", // quyền của chuyên viên đăng ký
        APPROVE_LEVEL_DEPARTMENT: "Office.RoomSchedule.ApprovalDepartment", // quyền phê duyệt trưởng đơn vị
        NOTIFY_DEPARTMENT: "Office.MeetingRoom.NotifyDepartment", // Nhận thông báo thuộc về phòng ban
        MANAGE_LIST_ROOM: "Office.MeetingRoom.Use", // quản lý danh sách phòng
        MEETING_ROOM_CONFIRM: "Office.MeetingRoomSchedule.Confirm", // xác nhận cho phòng họp
        CLASS_ROOM_CONFIRM: "Office.LectureHallClassroom.Confirm", // xác nhận cho giảng đường, phòng học
        MEETING_ROOM_APPROVE_LEAD: "Office.MeetingRoomSchedule.Approval", // duyệt cho phòng họp (cấp lãnh đạo)
        CLASS_ROOM_APPROVE_LEAD: "Office.LectureHallClassroom.Approval", // phê duyệt cho giảng đường, phòng học (cấp lãnh đạo)
        
        MANAGE_INFORMATION: "Office.RoomSchedule.Manange",
        REQUEST_CANCEL:"Office.RoomSchedule.RequestCancel",

        BUTLER_CLASS_ROOM:"Office.LectureHallClassroom.Butler",
        BUTLER_MEETING_ROOM:"Office.MeetingRoomSchedule.Butler",
        
    }

    const ROOM_FLOW_STATUS ={
        APPROVE:"approve",
        CANCEL:"cancel"
    }
    /** Start Load */
    ctrl.load_room = function (val) {
        if (val != undefined) {
            ctrl.offset = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", load_service_room);
    }

    ctrl.count_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "count", count_service_room);
    }

    ctrl.loadListByStatus = function (val) {
        if (val != undefined) {
            ctrl.offsetRegistered = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", loadServiceByStatus);
    }

    ctrl.countRegistered = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "count", countRegisteredService);
    }

    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = (Object.keys(val).length === 0) ? 20 : val;
        ctrl.refreshData_Room();
    }

    ctrl.chooseRoomType = function (val) {
        ctrl.selectedRoomType = (Object.keys(val).length === 0) ? null : val;

        // Tìm đối tượng có key 'room_type' trong mảng ctrl._filter và cập nhật giá trị của nó
        const roomTypeIndex = ctrl._filter.findIndex(item => item.room_type !== undefined);

        if (roomTypeIndex !== -1) {
            if (ctrl.selectedRoomType) {
                // Nếu không phải là đối tượng rỗng, cập nhật giá trị 'room_type'
                ctrl._filter[roomTypeIndex].room_type = val;
            } else {
                // Nếu tìm thấy room_type là null, xóa nó khỏi mảng
                ctrl._filter.splice(roomTypeIndex, 1);
            }
        } else if (ctrl.selectedRoomType) {
            // Nếu không tìm thấy, thêm mới đối tượng với key 'room_type'
            ctrl._filter.push({ room_type: val });
        }
        
        ctrl.refreshData_Room();
    }

    ctrl.onRoomSelected = function () {

        if (ctrl.selectedRoom) {
            ctrl.selectedRoomId = ctrl.selectedRoom.code;
        } else {
            ctrl.selectedRoomId = null;
        }
    };

    ctrl.refreshData_Room = function () {
        var dfdAr = [];
        resetPaginationInfo_Room();
        dfdAr.push(ctrl.load_room());
        dfdAr.push(ctrl.count_room());

        $q.all(dfdAr);
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        $location.url("/meeting-room?tab=" + val);
        setUrlContent();
    }
    
    ctrl.switchSubTab = function (tabName) {
        ctrl.tab_my_calendar = false;
        ctrl.calendar_checkbox_host = false;
        ctrl.calendar_checkbox_participants = false;
        ctrl.calendar_checkbox_to_department = false;
        switch (tabName) {
            case 'my_calendar':
                ctrl.tab_my_calendar = true;
                ctrl.calendar_checkbox_host = true;
                ctrl.calendar_checkbox_participants = true;
                break;
            case 'responsibility':
                ctrl.calendar_checkbox_to_department = true;
                break;
            default:
                ctrl.tab_my_calendar = true;
                ctrl.calendar_checkbox_host = true;
                ctrl.calendar_checkbox_participants = true;
                break;
        }

        ctrl.load_calendar();
    }
    
    ctrl.areAllRoomTypesInactive = function () {
        return !Object.values(ctrl.calendar_tab_room_type).includes(true);
    };

    ctrl.switchSubTab_manageRoom = function (tabName) {
        const isAllTab = tabName === 'all';
        ctrl._roomTypes.forEach(({ val }) => {
            const isActive = isAllTab || tabName === val;
            ctrl.calendar_checkbox_room_type[val] = isActive;
            ctrl.calendar_tab_room_type[val] = !isAllTab && tabName === val;
        });

        ctrl.load_calendar();
    }

    ctrl.areAllRoomTypesInactive = function () {
        return !Object.values(ctrl.calendar_tab_room_type).includes(true);
    };

    ctrl.switchSubTab_manageRoom = function (tabName) {
        const isAllTab = tabName === 'all';
        ctrl._roomTypes.forEach(({ val }) => {
            const isActive = isAllTab || tabName === val;
            ctrl.calendar_checkbox_room_type[val] = isActive;
            ctrl.calendar_tab_room_type[val] = !isAllTab && tabName === val;
        });

        ctrl.load_calendar();
    }

    function setUrlContent() {
        ctrl.tab = ctrl.tabPermission[ctrl.tab] ? ctrl.tab : 'MyOwn';

        switch (ctrl.tab) {
            case "Management":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/schedule.html";
                break;
            case "RoomList":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/list.html";
                break;
            case "GeneralRoomList":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/general_list.html";
                break;
            case "Calendar":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/room_meeting_calendar.html";
                break;
            case "MyOwn":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/room_meeting_calendar_my_own.html";
                break;
            case "Butler":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/butler.html";
                break;
            default:
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/room_meeting_calendar_my_own.html";
                break;
        }
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

    function load_service_room() {
        var dfd = $q.defer();
        var filter = generateFilterLoad_Room();
        meeting_room_service
            .load_room(
                filter.filter,
                filter.search, 
                ctrl.master_key, 
                ctrl.numOfItemPerPage, 
                ctrl.offset, 
                ctrl.sort.query
            ).then(function (res) {
                ctrl.listRooms = res.data;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    function count_service_room() {
        var dfd = $q.defer();
        var filter = generateFilterLoad_Room();
        meeting_room_service
            .count_room(
                filter.filter,
                filter.search,
                ctrl.master_key
            ).then(function (res) {
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

    function countRegisteredService() {
        var dfd = $q.defer();
        meeting_room_service.countRegistered(ctrl.subTab).then(function (res) {
            ctrl.totalItemsRegistered = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function generateFilterLoad_Room() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        if (ctrl._filter.length > 0) {
            obj.filter = angular.copy(ctrl._filter);
        }
        return obj;
    }

    function resetPaginationInfo_Room() {
        if (ctrl.tab === 'RoomList' || ctrl.tab === 'GeneralRoomList') {
            ctrl.currentPage = 1;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
        } else if (ctrl.tab === 'schedule') {
            ctrl.currentPageRegistered = 1;
            ctrl.totalItemsRegistered = 0;
            ctrl.offsetRegistered = 0;
        }

    }

    ctrl.export_excel = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "export_excel", export_excel_service);
    }

    function export_excel_service(){
        const dfd = $q.defer();

        let filter = generateFilter_calendar();
        meeting_room_service
        .export_excel(
            filter.search,
            filter.tab,
            filter.checks, //need handle
            filter.room_type, //need handle
            0,
            0,
            ctrl.sortRegistered.query,
            filter.dateStart,
            filter.dateEnd,
        )
            .then(function (res) {
                const file_name = `${$filter('l')('MeetingRoomScheduleConferenceRoom')}_${$filter('showDate')(filter.date_start)}_to_${$filter('showDate')(filter.date_end)}`;
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file_name}.xlsx`;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                a.remove();

                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    function generateFilter_export() {
        var obj = {};
        obj.checks = [];
        obj.room_type = [];
        const CHECKS_ON_UI = {
            CREATED: "Created",
            RESPOSIBILITY_DEPARTMENT: "Responsibility",
        }

        if (ctrl.calendar_checkbox_created && ctrl.show_calendar_checkbox_created) {
            obj.checks.push(CHECKS_ON_UI.CREATED);
        }

        if (ctrl.calendar_checkbox_responsibility && ctrl.show_calendar_checkbox_responsibility) {
            obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
        }

        Object.keys(ctrl.calendar_checkbox_room_type).forEach(key => {
            if (ctrl.calendar_checkbox_room_type[key]) {
                obj.room_type.push(key);
            }
        });

        obj.date_start = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
        obj.date_end = $filter('convertToStartOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();
        return obj;
    }

    function calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const timeDifference = end - start;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
    
        return dayDifference + 1; // Cộng thêm 1 để bao gồm cả ngày đầu và ngày cuối
    }

    function getMonday(){
        let currentDate = new Date();
        let dayOfWeek = currentDate.getDay(); 
        let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
        return new Date(currentDate.setDate(currentDate.getDate() - diff));
    }

    ctrl.generateWeekDays = function () {
        const days = [];
        let currentDate = getMonday();
        let numDateShow = 7;
        if(ctrl.weekDays!==undefined && ctrl.weekDays.length> 1){
            const start = new Date(ctrl.weekDays[0].date);
            const end = new Date(ctrl.weekDays[ctrl.weekDays.length - 1].date);
            numDateShow = calculateDays(start,end);
            currentDate = new Date(start);
        }
        //get monday
        const dayKeyMap = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

        for (let i = 0; i < numDateShow; i++) {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
            const dayKey = dayKeyMap[dayOfWeek];
            days.push({
                date: new Date(currentDate),
                dayKey: dayKey,
                day: currentDate.getDate(),
                fullDate: currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    // Get the week days

    ctrl.previousWeek = function () {
        load_service_calendar();
    };

    ctrl.nextWeek = function () {
        load_service_calendar();
    };

    ctrl.shiftWeek = function (direction) {
        ctrl.weekDays = ctrl.weekDays.map(day => {
            let newDate = new Date(day.date);
            newDate.setDate(newDate.getDate() + (direction * 7));
            return {
                ...day,
                date: newDate,
                fullDate: newDate.toISOString().split('T')[0], // Update the full date format
                day: newDate.getDate()
            };
        });

        // No need to refresh other data; the date shifting will just update the UI
    };

    // A method to filter events based on the date for each room
    ctrl.getEventsForDay = function (room, day) {
        if (!ctrl._roomCalendar || !Array.isArray(ctrl._roomCalendar)) {
            return [];
        }
        // Filter and sort events based on room code and matching dates
        return ctrl._roomCalendar
            .filter(event =>
                event.room == room.value &&
                (new Date(event.date_start)).toDateString() === day.date.toDateString()
            )
            .sort((a, b) => new Date(a.date_start) - new Date(b.date_start)) // Sort by start time
            .map(event => {
                // Format the start and end times in 24-hour format
                const startTime = new Date(event.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const endTime = new Date(event.date_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const event_text = `${startTime} - ${endTime}: ${event.title}`;
                return {
                    ...event,
                    event_text,
                    startTime,
                    endTime
                };
            });
    };


    ctrl.load_file = function (params) {
    return function () {
        var dfd = $q.defer();
        meeting_room_service.load_file(params.id, params.name).then(function (res) {
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



    /** Start Insert */
    ctrl.chooseDateStart_insert = function (val) {
        if (ctrl.isInitializing) {
            return;
        }
        if(ctrl._register_value !== undefined) {
            ctrl._register_value.date_start = val.getTime();
            ctrl._register_value.time_start = val;
            ctrl.updateDateTime('start');
            ctrl.updateDateTime('end');
        }
    }

    ctrl.chooseDateEnd_insert = function (val) {
        if(ctrl._register_value !== undefined) {
            ctrl._register_value.date_end = val.getTime();
        }
    }

    ctrl.updateDateTime = function (type) {
        // ctrl._register_value.room = null;

        if (!ctrl._register_value.date_start) {
            ctrl._register_value.date_start = new Date();
        }
        if (!ctrl._register_value.date_end) {
            ctrl._register_value.date_end = new Date();
        }
    
        // Lấy ngày hiện tại từ date_start
        let date = new Date(ctrl._register_value.date_start);
    
        // Lấy giờ và phút từ đối tượng Date time_start hoặc time_end
        let time = type === 'start' ? ctrl._register_value.time_start : ctrl._register_value.time_end;
    
        if (time instanceof Date) {
            date.setHours(time.getHours(), time.getMinutes(), 0, 0); // Cập nhật giờ và phút từ Date
        }
    
        // Gán lại giá trị timestamp
        if (type === 'start') {
            ctrl._register_value.date_start = date.getTime(); // Chuyển thành timestamp
        } else {
            ctrl._register_value.date_end = date.getTime(); // Chuyển thành timestamp
        }
    };

    ctrl.updateDateTime_update = function (type) {
        // ctrl._update_register_value.room = null;

        if (ctrl._update_register_value.date_start === undefined) {
            ctrl._update_register_value.date_start = new Date();
        }
        if (ctrl._update_register_value.date_end === undefined) {
            ctrl._update_register_value.date_end = new Date();
        }
    
        // Lấy ngày hiện tại từ date_start
        let date = new Date(ctrl._update_register_value.date_start);
    
        // Lấy giờ và phút từ đối tượng Date time_start hoặc time_end
        let time = type === 'start' ? ctrl._update_register_value.time_start : ctrl._update_register_value.time_end;
    
        if (time instanceof Date) {
            date.setHours(time.getHours(), time.getMinutes(), 0, 0); // Cập nhật giờ và phút từ Date
        }
    
        // Gán lại giá trị timestamp
        if (type === 'start') {
            ctrl._update_register_value.date_start = date.getTime(); // Chuyển thành timestamp
        } else {
            ctrl._update_register_value.date_end = date.getTime(); // Chuyển thành timestamp
        }
    };

    // Insert Room (Directory)
    ctrl.getMasterDirectoryItem = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "getMasterDirectoryItem", loadDetailsMasterDirectory_service);
    }

    function loadDetailsMasterDirectory_service() {
        let dfd = $q.defer();
        meeting_room_service.loadDetails_MasterDirectory(ctrl.master_key).then(function (data) {
            ctrl.master_directory_item = data.data;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }

    function getOrderNumber_service() {
        let dfd = $q.defer();
        meeting_room_service.getOrderNumber(ctrl.master_key).then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "getOrderNumber", getOrderNumber_service);
    }

    function generate_InsertValue() {
        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                'vi-VN': '',
                'en-US': '',
            },
            key: '',
            extend: '',
            item: {
            },
            isactive: true,
        };
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getMasterDirectoryItem();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "insert");
    }

    ctrl.pickExtend = function(val,fields){
        if(Array.isArray(val)){
            ctrl._insert_value.item[fields.name] = val;
        }else{
            ctrl._insert_value.item[fields.name] = val.value;
        }
    }

    function insert_service() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            camelize(ctrl._insert_value.title['en-US']), // ctrl._insert_value.value
            ctrl._insert_value.item,
            ctrl._insert_value.isactive,
            ctrl.master_key
        ).then(function () {
            $("#modal_MeetingRoom_Insert").modal("hide");
            ctrl.refreshData_Room();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "insert", insert_service);
    }

    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '') +'-'+ Date.now().toString() + Math.random().toString(36).substring(2,4);
    }

    // Update Room (Directory)
    ctrl.prepareUpdate = function (item) {
        ctrl.getMasterDirectoryItem();

        ctrl._update_value = angular.copy(item);
        ctrl._update_value.item = {};

        for(var i in ctrl.master_directory_item.extend){
            ctrl._update_value.item[ctrl.master_directory_item.extend[i].name] = ctrl._update_value[ctrl.master_directory_item.extend[i].name];
        }

        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "update");
    }

    ctrl.pickExtend_update = function(val,fields){
        if(Array.isArray(val)){
            ctrl._update_value.item[fields.name] = val;
        }else{
            ctrl._update_value.item[fields.name] = val.value;
        }
    }

    function update_service() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            ctrl._update_value.value,
            ctrl._update_value.item,
            ctrl._update_value.isactive
            ).then(function () {
                $("#modal_MeetingRoom_Update").modal('hide');
                ctrl.refreshData_Room();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "update", update_service);
    }

    ctrl.load_room_type = function (){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomType", load_room_type_service);
    }

    function load_room_type_service(){
        var dfd = $q.defer();
        meeting_room_service.load_room_type().then(function (res) {
            dfd.resolve(true);
            ctrl._roomTypes = res.data.map(type=>({
                label: type.title,
                val: type.value
            }));

            ctrl._roomTypes.forEach(({ val }) => {
                ctrl.roomTypes_filter_data.push(val);
                ctrl.calendar_checkbox_room_type[val] = true;
                ctrl.calendar_tab_room_type[val] = false;
            });
            
            ctrl._insert_value.item.room_type = ctrl._roomTypes[0].val;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    /** Start Delete */
    ctrl.prepareDelete = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "delete");
        generateResetDeleteValue(val);
    };

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "delete", deleteService);
    };

    function generateResetDeleteValue(val) {
        ctrl._delete_value = angular.copy(val);
    }

    function deleteService() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_MeetingRoom_Delete").modal('hide');
            ctrl.refreshData_Room();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    /** End Delete */

    /** Start Register */
    ctrl.prepareRegister = function () {
        generateResetRegisterValue();
        ctrl.load_department_register();
        ctrl.load_room_register();
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "register");
    };

    ctrl.register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "register", register_service);
    };

    function register_service() {
        var dfd = $q.defer();
        const dataRegister = {
            title: ctrl._register_value.title,
            date_start: (new Date(ctrl._register_value.date_start)).getTime(),
            date_end: (new Date(ctrl._register_value.date_end)).getTime(),
            type: ctrl._register_value.type,
            host: Object.keys(ctrl._register_value.host).length === 0 ? '' : ctrl._register_value.host,
            participants: ctrl._register_value.join_employees,
            other_participants: ctrl._register_value.otherHosts.map(person => person.name),
            to_department: ctrl._register_value.to_department,
            content: ctrl._register_value.content,
            person: ctrl._register_value.person,
            teabreak: ctrl._register_value.teabreak,
            helpdesk: ctrl._register_value.helpdesk,
            service_proposal: ctrl._register_value.service_proposal,
            files: ctrl._register_value.files,
            room: ctrl._register_value.room,
            host_scope: ctrl._register_value.host_scope,
            host_external: ctrl._register_value.host_external
        }

        if(dataRegister.teabreak){
            dataRegister.teabreak_text = ctrl._register_value.teabreak_text;
        }

        if(dataRegister.helpdesk){
            dataRegister.helpdesk_text = ctrl._register_value.helpdesk_text;
        }

        if(dataRegister.service_proposal){
            dataRegister.service_proposal_text = ctrl._register_value.service_proposal_text;
        }
        meeting_room_service.register(dataRegister).then(function (response) {
            $("#modal_MeetingRoomSchedule_Register").modal("hide");
            ctrl.refreshData_Schedule();
            dfd.resolve(true);
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('RegisterRoomSCheduleSuccess'),
                type: 'success'
            });
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.onRoomTypeChange = function (val) {
        ctrl._register_value.filter_room = [ { room_type: val } ];
        ctrl._register_value.room = null;
    };

    ctrl.pick_room_register = (val) =>{
        ctrl._register_value.room = val.value;
    }

    ctrl.removeFileRegister = function (item) {
        ctrl._register_value.files = ctrl._register_value.files.filter(file => file.name !== item.name);
    };

    function generateResetRegisterValue() {
        ctrl.isInitializing = true; // Đặt cờ khởi tạo

        let today = new Date();
        let now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes() + 30, 0);

        ctrl._register_value = {
            host_scope: 'internal',
            filter_room: [ { room_type: ROOM_TYPE.MEETING } ],
            _rooms:[],
            _filteredRooms:[],
            _departments: [],
            _hosts:[],
            _has_rule_choose_room: false,

            service_proposal: false,
            host:{},
            host_external:'',
            room:{},
            choosedDepartments: [],
            isOrtherHosts: false,
            otherHosts: [],
            date_start: now.getTime(),
            date_end: now.getTime(),
            time_start: now,
            helpdesk: false,
            teabreak: false,
            files: [],
            email: '',
            phone_number: '',
            type: ROOM_TYPE.MEETING,
            content: '',
            title: '',
            person: 10,
            service_proposal_text: '',
            helpdesk_text: '',
            teabreak_text: '',
            join_employees:[],
            to_department:[],
        };

        $timeout(() => (ctrl.isInitializing = false), 100); // Tắt cờ sau khi khởi tạo hoàn tất
    }

    ctrl.function_apply_suggestions = ['registration_room'];

    ctrl.chooseDepartment_register = function (val) {
        ctrl._register_value.to_department = angular.copy(val);
    };

    ctrl.chooseDepartment_update = function (val) {
        ctrl._update_register_value.to_department = angular.copy(val);
    };


    ctrl.isInvalidHost = function (host_scope) {
        if (host_scope === 'external') {
            return ctrl._register_value.host_external === '';        
        }
        if (host_scope === 'internal') {
            return Object.keys(ctrl._register_value.host).length === 0 || ctrl._register_value.host === '';
        }
        return false;
    };

    ctrl.invalidRegister = function() {
        if(true && empty(ctrl._register_value.host)){
            return true;
        }
        return false;
    }

    function load_department_register_service(){
        let dfd = $q.defer();
        meeting_room_service.load_department().then(
            function (res) {
                ctrl._register_value._departments = res.data;
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_department_register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Register", "load", load_department_register_service);
    }

    ctrl.pickEmployee_register = (params) => {
        ctrl._register_value.join_employees = params;
    }

    ctrl.load_room_register = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Register", "loadRoom", load_room_register_service);
    }

    function load_room_register_service(){
        let dfd = $q.defer();
        meeting_room_service.load_room_register().then(
            function (res) {
                ctrl._rooms = res.data;
                ctrl._register_value._rooms = res.data;
                ctrl._register_value._filteredRooms = ctrl._register_value._rooms.filter((room)=> room.room_type === ctrl._register_value.type);
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.add_other_host_register = function(){
        if(!ctrl._register_value.otherHost){
            return;
        }
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        ctrl._register_value.otherHosts.push({
            id:id,
            name:ctrl._register_value.otherHost
        });
        ctrl._register_value.otherHost='';
    }

    ctrl.delete_other_host_register = function(id){
        ctrl._register_value.otherHosts = ctrl._register_value.otherHosts.filter(host => host.id !== id);
    }

    ctrl._choose_host_register = function(param){
        ctrl._register_value.host = param;
    }

    ctrl._choose_room_register = function(room){
        ctrl._register_value.room = room;
    }

    ctrl.prepareDeleteRegistration = function(id){
        ctrl._delete_registration_value = {};
        ctrl._delete_registration_value = ctrl.registeredList.find(registration => registration._id === id);
        $('#detele_registration_modal').modal('show');
    }

    ctrl.delete_registration = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Registration", "delete", delete_registration_service);
    }

    function delete_registration_service(){
        let dfd = $q.defer();
        meeting_room_service.delete_registration(ctrl._delete_registration_value._id).then(
            function (res) {
                ctrl.load_schedule();
                ctrl._customToastScope.addToastValue({
                    message:'Xóa thành công',
                    type: 'success'
                });
                $('#detele_registration_modal').modal('hide');
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.confirm_request_cancel = function(){
        $('#cancelReasonModalLabel').modal('show');
    }

    /** End Register */

    /** Start Update Registered */

    ctrl.onRoomTypeChange_update = function (val) {
        ctrl._update_register_value.filter_room = [ { room_type: val } ];
        ctrl._update_register_value.room = null;
    };

    ctrl.pick_room_update = (val) => {
        ctrl._update_register_value.room = val.value;
    }
    
    ctrl.isInvalidHost_update = function (host_scope) {
        if (host_scope === 'external') {
            return ctrl._update_register_value.host_external === '';        
        }
        if (host_scope === 'internal') {
            return Object.keys(ctrl._update_register_value.host).length === 0 || ctrl._update_register_value.host === '';
        }
        return false;
    };

    ctrl.chooseDateStart_update = function (val) {
        if (ctrl.isInitializing) {
            return;
        }
    
        if (ctrl._update_register_value !== undefined) {
            ctrl._update_register_value.date_start = val.getTime();
            ctrl._update_register_value.time_start = val;
            ctrl.updateDateTime_update('start');
            ctrl.updateDateTime_update('end');
        }
    }

    ctrl.chooseDateEnd_update = function (val) {
        if(ctrl._update_register_value !== undefined){
            ctrl._update_register_value.date_end = val.getTime();
        }
    }

    ctrl.prepareUpdateRoomRegistration = function (val) {
        ctrl._idEdit = val._id;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadForUpdate", loadDetailForUpdateService);
    };

    ctrl._choose_host_update = function(param){
        ctrl._update_register_value.host = param;
    }

    function load_department_update_service(){
        let dfd = $q.defer();
        meeting_room_service.load_department().then(
            function (res) {
                ctrl._update_register_value._departments = res.data;
                ctrl._update_register_value.choosedDepartments = ctrl._update_register_value._departments.filter(department =>ctrl._update_register_value.departments.includes(department.id));
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_department_update= function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Update", "load", load_department_update_service);
    }

    ctrl.load_room_register = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomRegister", load_room_register_service);
    }

    ctrl._choose_room_update = function(params){
        ctrl._update_register_value.room_update = params.value;
    }

    function load_room_update_service(){
        let dfd = $q.defer();
        meeting_room_service.load_room_register().then(
            function (res) {
                ctrl._update_register_value.room_text='';
                ctrl._update_register_value._rooms = res.data;
                if(ctrl._update_register_value.room){
                    ctrl._update_register_value.room_text = res.data.find(room => room.id == ctrl._update_register_value.room).title;
                }
                ctrl._update_register_value._filteredRooms = res.data.filter((room)=> room.room_type === ctrl._update_register_value.type);
                dfd.resolve(res);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_room_update = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomRegister", load_room_update_service);
    }

    ctrl.add_other_host_update = function(){
        if(!ctrl._update_register_value.otherHost){
            return;
        }
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        ctrl._update_register_value.otherHosts.push({
            id:id,
            name:ctrl._update_register_value.otherHost
        });
        ctrl._update_register_value.otherHost='';
    }

    ctrl.delete_other_host_update = function(id){
        ctrl._update_register_value.otherHosts = ctrl._update_register_value.otherHosts.filter(host => host.id !== id);
    }

    ctrl.removeFileUpdate = function(item){
        if (item.id) {
            ctrl._update_register_value.removeAtachments.push(item.id);
        }
        ctrl._update_register_value.attachments = ctrl._update_register_value.attachments.filter(file => file.name !== item.name);
    }

    // ctrl.removeFileUpdateRegister = function (item) {
    //     ctrl._update_register_value.files = ctrl._update_register_value.files.filter((file)=>file.name!=item.name);
    // };

    function loadDetailForUpdateService() {
        ctrl.isInitializing = true; // Đặt cờ khởi tạo
        ctrl._update_value = {};
        
        return meeting_room_service.loadDetailForUpdate(ctrl._idEdit)
            .then((res) => {
                const { 
                    _id,
                    date_start, date_end,
                    other_participants, 
                    service_proposal, helpdesk, teabreak, 
                    service_proposal_text, helpdesk_text, teabreak_text,
                    ...rest
                } = res.data;
                
                ctrl._update_register_value = {
                    ...rest,
                    id: _id,
                    _host_update: '',
                    date_start, 
                    date_end, 
                    other_participants, 
                    time_start: new Date(date_start),
                    time_end: new Date(date_end),
                    otherHosts: other_participants.map(name => ({
                        id: `${Date.now()}${Math.random().toString(36).substring(2, 10)}`,
                        name,
                    })),
                    otherHost: '',
                    files: [],
                    removeAtachments: [],
                    ...getPermissionProperties(res.data),
                    service_proposal, 
                    helpdesk, 
                    teabreak,
                    service_proposal_text: service_proposal ? service_proposal_text : "",
                    helpdesk_text: helpdesk ? helpdesk_text : "",
                    teabreak_text: teabreak ? teabreak_text : ""
                };
            })
            .finally(() => $timeout(() => (ctrl.isInitializing = false), 100)); // Tắt cờ sau khi khởi tạo hoàn tất
    }

    ctrl.update_register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "register", update_register_service);
    };

    function update_register_service() {
        var dfd = $q.defer();
        const dataUpdate = genDataUpdate();
        meeting_room_service.update_register(dataUpdate).then(function () {
            dfd.resolve(true);
            $(`#${ctrl._ctrlName}-modal_MeetingRoomSchedule_Update`).modal("hide");
            ctrl.refreshData_Schedule();
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('UpdateRoomSCheduleSuccess'),
                type:"success",
            })
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function genDataUpdate(){
        const data = {
            id: ctrl._update_register_value.id,
            title: ctrl._update_register_value.title,
            date_start: ctrl._update_register_value.date_start,
            date_end: ctrl._update_register_value.date_end,
            type: ctrl._update_register_value.type,
            host: Object.keys(ctrl._update_register_value.host).length === 0 ? '' : ctrl._update_register_value.host,
            participants: ctrl._update_register_value.participants,
            to_department: ctrl._update_register_value.to_department,
            other_participants: ctrl._update_register_value.otherHosts.map(host => host.name),
            content: ctrl._update_register_value.content,
            person: ctrl._update_register_value.person,
            service_proposal: ctrl._update_register_value.service_proposal,
            service_proposal_text: ctrl._update_register_value.service_proposal_text,
            helpdesk: ctrl._update_register_value.helpdesk,
            helpdesk_text: ctrl._update_register_value.helpdesk_text,
            teabreak: ctrl._update_register_value.teabreak,
            teabreak_text: ctrl._update_register_value.teabreak_text,
            removeAtachments: ctrl._update_register_value.removeAtachments,
            attachments: ctrl._update_register_value.attachments,
            room: ctrl._update_register_value.room,
            host_scope: ctrl._update_register_value.host_scope,
            host_external: ctrl._update_register_value.host_external
        };

        if(ctrl._update_register_value._host_update.username){
            data.host = ctrl._update_register_value._host_update.username;
        }
        
        // if(ctrl._update_register_value.files){
        //     data.file = ctrl._update_register_value.files;
        // }

        // if(ctrl._update_register_value.removeAtachments){
        //     data.removeAtachments = ctrl._update_register_value.removeAtachments.map((file)=>file.id);
        // }
        return data;
    }

    ctrl.pickEmployee_update = (params) => {
        ctrl._update_register_value.participants = params;
    }

    ctrl.changeUpdateRegisterType = function (val) {
        ctrl._update_register_value.type = val;
        ctrl._update_register_value._filteredRooms = ctrl._update_register_value._rooms.filter((room)=> room.room_type === ctrl._update_register_value.type);
    }


    //Start assess
    function getPermissionProperties(item) {
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

                    if(item.username === $rootScope.logininfo.username){
                        allow_edit = true;
                        allow_delete = true;
                    }

                    status_show = 'Registerd';
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                    status_show = 'DepartementApproved';
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
                case MEETING_ROOM_SCHEDULE_STATUS.APPROVED:
                    status_show = 'Approved';

                    if(item.username === $rootScope.logininfo.username){
                        allow_request_cancel = true;
                    }
                    
                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_request_cancel = true;
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)){
                        allow_request_cancel = true;
                    }
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
                    // if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                    //     allow_approve_recall_lead = true;
                    //    break; 
                    // }  

                    // if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                    //     allow_approve_recall_lead = true;
                    //     break;
                    // }

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

    ctrl.prepareDepartmentApproval = ({ item }) => {
        ctrl.isInitializing = true; // Đặt cờ khởi tạo
    
        const { _id, other_participants } = item;
    
        ctrl._update_register_value = {
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
    
        return $rootScope.statusValue.generate(ctrl._ctrlName, 'MeetingRoom', 'approve_department');
    };    

    function genDataApproveDepartment(){
        const data = {
            id: ctrl._update_register_value.id,
            room: ctrl._update_register_value.room,
            title: ctrl._update_register_value.title,
            date_start: (new Date(ctrl._update_register_value.date_start)).getTime(),
            date_end: (new Date(ctrl._update_register_value.date_end)).getTime(),
            type: ctrl._update_register_value.type,
            host: Object.keys(ctrl._update_register_value.host).length === 0 ? '' : ctrl._update_register_value.host,
            participants: ctrl._update_register_value.participants,
            to_department: ctrl._update_register_value.to_department,
            other_participants: ctrl._update_register_value.otherHosts.map(host => host.name),
            content: ctrl._update_register_value.content,
            person: ctrl._update_register_value.person,
            service_proposal: ctrl._update_register_value.service_proposal,
            service_proposal_text: ctrl._update_register_value.service_proposal_text,
            helpdesk: ctrl._update_register_value.helpdesk,
            helpdesk_text: ctrl._update_register_value.helpdesk_text,
            teabreak: ctrl._update_register_value.teabreak,
            teabreak_text: ctrl._update_register_value.teabreak_text,
            note: ctrl._update_register_value.note,
            removeAtachments: ctrl._update_register_value.removeAtachments,
            attachments: ctrl._update_register_value.attachments,
            room: ctrl._update_register_value.room,
            host_scope: ctrl._update_register_value.host_scope,
            host_external: ctrl._update_register_value.host_external
        };

        if(ctrl._update_register_value._host_update.username){
            data.host = ctrl._update_register_value._host_update.username;
        }
        
        // if(ctrl._update_register_value.files){
        //     data.file = ctrl._update_register_value.files;
        // }

        // if(ctrl._update_register_value.removeAtachments){
        //     data.removeAtachments = ctrl._update_register_value.removeAtachments.map((file)=>file.id);
        // }
        return data;
    }

    ctrl.approve_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_department", approve_department_service);
    };

    function approve_department_service() {
        var dfd = $q.defer();
        const dataUpdate = genDataApproveDepartment();
        meeting_room_service.approve_department(dataUpdate).then(function () {
            dfd.resolve(true);
            $(`#${ctrl._ctrlName}-modal_RoomRegistration_DepartmentApproval`).modal("hide");
            ctrl.refreshData_Schedule();
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

    ctrl.pick_room_assess = (val) =>{
        ctrl._assess_value.room = val.value;
    }

    ctrl.prepareAssess = function ({ item, action }) {
        ctrl._assess_value = angular.copy(item);
        ctrl._assess_value.original_current_room = ctrl._assess_value.room;
        ctrl._assess_value.action = action;
        ctrl._assess_value.note = "";
        ctrl._assess_value.note_required = true;
        ctrl._assess_value.assign_room = false;
        switch (action) {
            case "reject_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_value.assign_room = true;
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_value.assign_room = true;
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "request_cancel":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for request cancel');
                break;

            case "approve_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;

        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
    }

    ctrl.reject_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_department", access_service("reject_department"));
    }

    ctrl.approve_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_management", access_service("approve_management"));
    }

    ctrl.reject_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_management", access_service("reject_management"));
    }

    ctrl.approve_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_lead", access_service("approve_lead"));
    }

    ctrl.reject_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_lead", access_service("reject_lead"));
    }

    ctrl.request_cancel = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "request_cancel", access_service("request_cancel"));
    }

    //Recall
    ctrl.approve_recall_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_department", access_service("approve_recall_department"));
    }
    ctrl.reject_recall_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_department", access_service("reject_recall_department"));
    }

    ctrl.approve_recall_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_management", access_service("approve_recall_management"));
    }

    ctrl.reject_recall_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_management", access_service("reject_recall_management"));
    }

    ctrl.approve_recall_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_lead", access_service("approve_recall_lead"));
    }

    ctrl.reject_recall_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_lead", access_service("reject_recall_lead"));
    }
    //End recall

    function access_service(action) {
        return function () {
            var dfd = $q.defer();
            let dfdAr = [];
            let messageSuccess = '';
            switch (action) {
                case "reject_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_management(ctrl._assess_value._id, ctrl._assess_value.note, ctrl._assess_value.room));
                    break;
                case "reject_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_lead(ctrl._assess_value._id, ctrl._assess_value.note, ctrl._assess_value.room));
                    break;
                case "reject_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "request_cancel":
                    messageSuccess = $filter('l')('Requestcanceled');
                    dfdAr.push(meeting_room_service.request_cancel(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                //recall
                case "approve_recall_department":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_recall_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_recall_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_Schedule();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
                $(`#${ctrl._ctrlName}-modal_RoomRegistration_Assess`).modal('hide');
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

    //end assess

    // LOAD SCHEDULE
    function generateFilter_schedule() {
        var obj = {};
        if (ctrl._searchFilter_task !== "") {
            obj.search = angular.copy(ctrl._searchFilter_task);
        }
        obj.checks = [];

        if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
            obj.checks.push("Responsibility");
        }

        if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
            obj.checks.push("Created");
        }

        if (ctrl.checkbox_needhandle && ctrl.show_checkbox_needhandle) {
            obj.checks.push("NeedToHandle");
        }

        if (ctrl.checkbox_handled && ctrl.show_checkbox_handled) {
            obj.checks.push("Handled");
        }

        if (ctrl.checkbox_rejected && ctrl.show_checkbox_rejected) {
            obj.checks.push("Rejected");
        }

        if (ctrl.checkbox_approved && ctrl.show_checkbox_approved) {
            obj.checks.push("Approved");
        }

        obj.tab = ctrl.tab;
        return obj;
    }

    function resetPaginationInfo_Schedule() {
        ctrl.currentPageRegistered = 1;
        ctrl.totalItemsRegistered = 0;
        ctrl.offsetRegistered = 0;
    }

    function load_service_schedule() {
        var dfd = $q.defer();
        ctrl.registeredList = [];
        let _filter = generateFilter_schedule();
        meeting_room_service
            .load_schedule(
                _filter.search,
                _filter.tab,
                _filter.checks,
                undefined,
                ctrl.numOfItemPerPage,
                ctrl.offsetRegistered,
                ctrl.sortRegistered.query,
                ctrl.services_required
            )
            .then(
                function (res) {
                    ctrl.registeredList = res.data;
                    for (let i in ctrl.registeredList) {
                        Object.assign(ctrl.registeredList[i], getPermissionProperties(ctrl.registeredList[i]));
                    }
                    ctrl.registeredList = ctrl.registeredList.map(registration =>({
                        ...registration,
                        ...getPermissionProperties(registration),
                    }))
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.load_schedule = function (val) {
        if (val != undefined) { ctrl.offsetRegistered = angular.copy(val); }
        if(!ctrl._roomTypes.length>0){
            ctrl.load_room_type();
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadSchedule", load_service_schedule);
    }

    ctrl.load_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadCalendar", load_service_calendar);
    }

    ctrl.load_calendar_check_date = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadCalendar", load_service_calendar);
    }
    ctrl.my_calendars = [];
    function load_service_calendar(){
        var dfd = $q.defer();
        ctrl.weekDays = ctrl.generateWeekDays();
        let _filter = generateFilter_calendar();
        meeting_room_service
        .load_schedule(
            _filter.search,
            _filter.tab,
            _filter.checks, //need handle
            _filter.room_type, //need handle
            0,
            0,
            ctrl.sortRegistered.query,
            null,
            _filter.dateStart,
            _filter.dateEnd,
        )
        .then(
            function (res) {
                ctrl._roomCalendar = res.data;
                ctrl.my_calendars = [];
                ctrl.weekDays.forEach(day =>{
                    let events = ctrl._roomCalendar.filter(item => isSameDay(item.date_start, day.date.getTime()));
                    events = events.sort((a, b) => new Date(a.date_start) - new Date(b.date_start)) // Sort by start time
                    .map(event => {
                        // Format the start and end times in 24-hour format
                        const startTime = new Date(event.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const endTime = new Date(event.date_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const event_text = `${startTime} - ${endTime}: ${event.title}`;
                        return {
                            ...event,
                            event_text,
                            startTime,
                            endTime
                        };
                    });
                    ctrl.my_calendars.push(({day: day, events: $filter('markOverlappingEvents')(events, 'date_start', 'date_end')}))
                })
                dfd.resolve(true);
                ctrl.load_room_calendar();

            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );

        return dfd.promise;
    }

    function isSameDay(timestamp1, timestamp2) {
        const date1 = new Date(timestamp1);
        const date2 = new Date(timestamp2);

        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    ctrl.load_room_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", load_service_room_calendar);
    }

    function load_service_room_calendar(){
        var dfd = $q.defer();
        ctrl.meetingRooms = [];
        // ctrl.calendar_checkbox_room_type;

        meeting_room_service.load_room_register().then(function (res) {
            ctrl.meetingRooms = res.data.filter(item => ctrl.calendar_checkbox_room_type[item.room_type]);
            ctrl.meetingRooms.forEach(room =>{
               ctrl.getRoomEvents(room)
            })
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.getRoomEvents = function(room){
        room.events = [];
        ctrl.weekDays.forEach(day =>{
            room.events.push(ctrl.getEventsForDay(room, day));
        })
    }

    ctrl.hasEvents = function (events) {
        return events && events.some(function (day) {
            return day.length > 0;
        });
    };

    function generateFilter_calendar() {
        var obj = {};
        if (ctrl._searchFilter_task !== "") {
            obj.search = angular.copy(ctrl._searchFilter_task);
        }
        obj.checks = [];
        obj.room_type = [];

        if (ctrl.show_calendar_checkbox_responsibility && ctrl.calendar_checkbox_responsibility) {
            obj.checks.push("Responsibility");
        }

        if (ctrl.show_calendar_checkbox_created && ctrl.calendar_checkbox_created) {
            obj.checks.push("Created");
        }

        if (ctrl.show_calendar_checkbox_all && ctrl.calendar_checkbox_all) {
            obj.checks.push("All");
        }

        if (ctrl.show_calendar_checkbox_my && ctrl.calendar_checkbox_my) {
            obj.checks.push("MyCalendar");
        }

        if(ctrl.weekDays.length > 0){
            //reset to time start date
            obj.dateStart =  (new Date(ctrl.weekDays[0].date)).setHours(0,0,0,0);

            //reset to time end date
            obj.dateEnd = (new Date( ctrl.weekDays[ctrl.weekDays.length - 1].date)).setHours(23, 59, 59, 999);
        }

        if (ctrl.tab === "MyOwn") {
            obj.tab = "Calendar";
            obj.checks = ["MyCalendar"];
            if (ctrl.calendar_checkbox_host) {
                obj.checks.push("Host");
            }
            if (ctrl.calendar_checkbox_participants) {
                obj.checks.push("Participants");
            }
            if (ctrl.show_calendar_checkbox_to_department && ctrl.calendar_checkbox_to_department) {
                obj.checks.push("ToDepartment");
            }
        } else {
            obj.tab = ctrl.tab;
        }

        Object.keys(ctrl.calendar_checkbox_room_type).forEach(key => {
            if (ctrl.calendar_checkbox_room_type[key]) {
                obj.room_type.push(key);
            }
        });
        
        return obj;
    }

    function count_service_schedule() {
        var dfd = $q.defer();
        let _filter = generateFilter_schedule();
        meeting_room_service
            .count_schedule(
                _filter.search,
                _filter.tab,
                _filter.checks,
            )
            .then(
                function (res) {
                    ctrl.totalItemsRegistered = res.data?.count[0].count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_schedule = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "countSchedule", count_service_schedule);
    }

    ctrl.refreshData_Schedule = function () {
        var dfdAr = [];
        resetPaginationInfo_Schedule();

        dfdAr.push(ctrl.load_schedule());
        dfdAr.push(ctrl.count_schedule());

        $q.all(dfdAr);
    }

    ctrl.refreshData_Calendar = function () {
        var dfdAr = [];

        dfdAr.push(ctrl.load_schedule());
        dfdAr.push(ctrl.count_schedule());

        $q.all(dfdAr);
    }

    ctrl.getNameRoom = function (id){
        return ctrl._rooms.find(room=>room.id == id);
    }

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

    /** End Request cancel Registered */


    //Butler
    function resetPaginationInfo_Butler() {
        ctrl.currentPageButler= 1;
        ctrl.totalItemsButler= 0;
        ctrl.offsetButler= 0;
    }

    ctrl.load_butler = function (val) {
        if (val != undefined) { ctrl.offsetButler = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadButler", load_butler_service);
    }

    function load_butler_service() {
        const dfd = $q.defer();
        const date_start = ctrl._start_date_butler_filter.getTime();
        const date_end = ctrl._end_date_butler_filter.getTime();
        meeting_room_service.load_butler(
            '',
            ctrl.numOfItemPerPageButler,
            ctrl.offsetButler,
            ctrl.sort_bulter.query,
            date_start,
            date_end
        ).then(function(res){
            ctrl.butlerList = res.data;
            dfd.resolve(true);
        }, function(err){
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.count_butler = function (val) {
        if (val != undefined) { ctrl.offsetButler = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "countButler", count_butler_service);
    }

    function count_butler_service() {
        const dfd = $q.defer();
        const date_start = ctrl._start_date_butler_filter.getTime();
        const date_end = ctrl._end_date_butler_filter.getTime();
        meeting_room_service.count_butler(
            '',
            date_start,
            date_end
        ).then(function(res){
            console.log(res)
            ctrl.totalItemsButler = res.data.count[0].count;
            dfd.resolve(true);
        }, function(err){
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.refreshData_bulter = function () {
        var dfdAr = [];
        resetPaginationInfo_Butler();
        dfdAr.push(ctrl.load_butler());
        dfdAr.push(ctrl.count_butler());

        $q.all(dfdAr);
    }

    $rootScope.$on('room::access', function () {
        ctrl.refreshData_Schedule();
    });

    function init() {
        // ctrl.show_checkbox_rejected = true;
        // ctrl.show_checkbox_approved = true;

        const rulesToPermissions = {
            [ROOM_RULE.REGISTERED_ROOM]: ['Management'],
            [ROOM_RULE.APPROVE_LEVEL_DEPARTMENT]: ['Management'],
        
            [ROOM_RULE.MANAGE_LIST_ROOM]: ['RoomList'],
        
            [ROOM_RULE.CLASS_ROOM_CONFIRM]: ['Management', 'Calendar'],
            [ROOM_RULE.MEETING_ROOM_CONFIRM]: ['Management', 'Calendar'],
        
            [ROOM_RULE.MEETING_ROOM_APPROVE_LEAD]: ['Management', 'Calendar'],
            [ROOM_RULE.CLASS_ROOM_APPROVE_LEAD]: ['Management', 'Calendar'],
            
            [ROOM_RULE.BUTLER_CLASS_ROOM]: ['Butler'],
            [ROOM_RULE.BUTLER_MEETING_ROOM]: ['Butler'],
        };
        
        
        Object.entries(rulesToPermissions).forEach(([rule, permissions]) => {
            if ($filter('hasRule')(rule)) {
                permissions.forEach(permission => {
                    ctrl.tabPermission[permission] = true;
                });
            }
        });
        
        //Management
        if($filter('hasRule')(ROOM_RULE.USE)){
            // ctrl.show_checkbox_created = true;
            // ctrl.checkbox_created = true;
            
            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
            ctrl.calendar_checkbox_host = true;
            ctrl.calendar_checkbox_participants = true;
        }

        if($filter('hasRule')(ROOM_RULE.REGISTERED_ROOM)){
            ctrl.show_checkbox_created = true;
            ctrl.checkbox_created = true;
            
            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
            
            ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.calendar_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_all = true;
        }

        if($filter('hasRule')(ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)){            
            ctrl.show_checkbox_created = true;
            ctrl.show_checkbox_needhandle = true;
            ctrl.show_checkbox_responsibility = true;
            // ctrl.show_checkbox_rejected = true;
            // ctrl.show_checkbox_approved = true;
            ctrl.show_checkbox_handled = true;

            ctrl.show_calendar_checkbox_to_department = true;
            ctrl.calendar_checkbox_to_department = false;

            ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.calendar_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_all = true;

            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
        }

        if(
            $filter('hasRule')(ROOM_RULE.MANAGE_LIST_ROOM)
        ){
            // ctrl.show_checkbox_created = true;
            ctrl.show_checkbox_needhandle = true;

            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
            ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_all = true;
            ctrl.show_checkbox_handled = true;

        }

        if(
            $filter('hasRule')(ROOM_RULE.CLASS_ROOM_CONFIRM) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)
        ){
            // ctrl.show_checkbox_created = true;
            ctrl.show_checkbox_needhandle = true;

            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
            // ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_all = true;
            ctrl.calendar_checkbox_all = true;
            ctrl.show_checkbox_handled = true;
            ctrl.show_export = true;

        }

        if(
            $filter('hasRule')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)
        ){
            // ctrl.show_checkbox_created = true;
            ctrl.show_checkbox_needhandle = true;
            ctrl.show_checkbox_rejected = true;
            ctrl.show_checkbox_approved = true;

            // ctrl.show_calendar_checkbox_my = true;
            // ctrl.calendar_checkbox_my = true;
            // ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_all = true;
            ctrl.calendar_checkbox_all = true;
            ctrl.show_checkbox_handled = true;
            ctrl.show_export = true;

        }

        
        // if(
        //     $filter('checkRuleCheckbox')(ROOM_RULE.MANAGE_INFORMATION)
        // ){
        //     ctrl.show_export = true;
        //     ctrl.show_calendar_checkbox_responsibility = true;
        // }

        if(
            $filter('checkRuleCheckbox')(ROOM_RULE.NOTIFY_DEPARTMENT)
        ){
            ctrl.show_calendar_checkbox_to_department = true;
            ctrl.calendar_checkbox_to_department = false;
        }

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

        var dfdAr = [];
        var tab = $location.search().tab;
        ctrl.tab = tab || "MyOwn";

        if(ctrl.tabPermission['Management']){
            ctrl.tab = tab || "Management";
        }
        
        setUrlContent();

        ctrl.load_room_type().then(function () {
            switch (ctrl.tab) {
                case "Management":
                    ctrl._searchFilter_task = getTextSearch();
                    resetPaginationInfo_Schedule();
                    dfdAr.push(ctrl.load_schedule());
                    dfdAr.push(ctrl.count_schedule());
                    break;
                case "Calendar":
                    dfdAr.push(ctrl.load_calendar());
                    break;
                case "RoomList":
                    dfdAr.push(ctrl.load_room());
                    dfdAr.push(ctrl.count_room());
                    break;
                case "GeneralRoomList":
                    dfdAr.push(ctrl.load_room());
                    dfdAr.push(ctrl.count_room());
                    break;
                case "MyOwn":
                    dfdAr.push(ctrl.load_calendar());
                    break;
                case "Butler":
                    resetPaginationInfo_Butler();
                    dfdAr.push(ctrl.load_butler());
                    dfdAr.push(ctrl.count_butler());
                    break;
            };
            $q.all(dfdAr).then(
                function () {
                    ctrl._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                }
            );
        }, function (err) {
            console.log(err);
            err = undefined;
        });
    }

    init();
}]);

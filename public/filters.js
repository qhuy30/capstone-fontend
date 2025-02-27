myApp.filter('countProperty', function () {
    return function (input) {
        if (!input) { return 0; }
        var count = 0;
        for (var i in input) {
            count++;
        }
        return count;
    }
});
/**filter dùng để hạn chế số chữ hiển thị và thay thế bằng ký hiệu khai báo từ development */
myApp.filter('subString', function () {
    return function (input, number, replacementString) {
        if (!input) { return ""; }
        if (!number) { return input; }
        if (!replacementString) {
            return input.substring(0, number);
        } else {
            if (input.length <= number) {
                return input.substring(0, number);
            } else {
                return input.substring(0, number) + replacementString;
            }

        }
    }
});
/**filter dung de phan trang */
myApp.filter('mypaging_getmax', function () {
    return function (index, dm, per) {

        if (!index && index != 0) { return 0; }
        if (!dm && dm != 0) { return 0; }
        if (!per && per != 0) { return 0; }

        if (dm < per) { return dm };
        if (dm >= (index + 1) * per) { return (index + 1) * per; }
        return dm;
    }
});
/**filter trả về 1 trường dữ liệu từ 1 mảng dữ liệu từ việc so sánh 1 trường*/
myApp.filter("getField", function () {
    return function (val, fma, f, Ar) {

        if (!Ar || !f || !val || !fma) { return "" }
        for (var i in Ar) {
            if (Ar[i][fma] == val) {
                if (Ar[i][f]) { return Ar[i][f]; }
            }
        }
        return "";
    }
});

myApp.filter("getFieldL", ['$rootScope', function ($rootScope) {
    return function (val, fma, f, Ar) {

        if (!Ar || !f || !val || !fma) { return "" }
        for (var i in Ar) {
            if (Ar[i][fma] == val) {
                if (Ar[i][f]) { return Ar[i][f][$rootScope.Language.current]; }
            }
        }
        return "";
    }
}]);

/**Lấy ra 1 mảng con từ việc so sánh 1 trường dữ liệu */
myApp.filter('subArray', function () {
    return function (array, f, val) {
        if (!array
            || !array.length) {
            return [];
        }
        if (!f
            || !val) { return []; }
        var temp = [];
        for (var i in array) {
            if (array[i][f] == val) {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});
myApp.filter("chooseUserGroup", function () {
    return function (ar, dachon, fma) {
        if (!ar
            || !ar.length) { return []; }
        if (!dachon
            || !dachon.length) { return ar; }
        var temp = [];
        for (var i in ar) {
            var check = true;
            for (var j in dachon) {
                if (dachon[j] == ar[i][fma]) {
                    check = false;
                    break;
                }
            }
            if (check) { temp.push(ar[i]); }
        }
        return temp;

    }
});
myApp.filter('childArray', function () {
    return function (number, data) {
        if (!data
            || !data.length) { return []; }
        if (!number) { return data; }
        var temp = [];
        for (var i = 0; i < number; i++) {
            if (i >= data.length) {
                return temp;
            }
            temp.push(data[i]);
        }
        return temp;
    }
});
myApp.filter('test', function () {
    return function (input) {

        return input;
    }

});

/**lấy ra các tính năng có trạng thái sử dụng */
myApp.filter('sudung', function () {
    return function (array) {
        if (!array
            || !array.length) { return []; }
        temp = [];
        for (var i in array) {
            if (array[i].mode == "yes") {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});
/**lấy ra 1 mảng con loại trừ mảng đã chọn*/
myApp.filter('dachon', function () {
    return function (ar, dachon, fma) {
        if (!ar
            || !ar.length) { return []; }
        if (!dachon
            || !dachon.length) { return ar; }
        var temp = [];
        for (var i in ar) {
            var check = true;
            for (var j in dachon) {
                if (dachon[j][fma] == ar[i][fma]) {
                    check = false;
                    break;
                }
            }
            if (check) { temp.push(ar[i]); }
        }
        return temp;
    }
});

/**trả về tên class theo từng loại file */
myApp.filter('fileType', function () {
    return function (url) {
        if (!url) { return ""; }
        var filetype = url.split(".")[url.split(".").length - 1];
        switch (filetype) {
            case "pdf":
                return 'fa-file-pdf';
                break;
            case "doc", "docx":
                return 'fa-file-word';
                break;
            case "xls", "xlsx":
                return 'fa-file-excel';
                break;
        }
    }
});

/** trả về mảng dữ liệu với cặp điều kiến lớn hơn hoặc bằng và nhỏ hơn hoặc bằng*/
myApp.filter('GTEandLTE', function () {
    return function (input, gte, lte, F) {
        if (!input) { return []; }
        var temp = [];
        for (var i in input) {
            if (input[i][F] >= gte && input[i][F] <= lte) {
                temp.push(input[i]);
            }
        }
        return temp;
    };
});

/**trả về giá trị thời điểm của 1 đối tượng Date */
myApp.filter('getTime', function () {
    return function (input) {
        if (!input || !input.getTime()) { return 0; }
        return input.getTime();
    }
});

/**trả về chuỗi hiển thị ngày giờ từ giá trị thời điểm đưa vào */
myApp.filter('showTime', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(parseInt(input));
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    }
});
myApp.filter('showDate', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(input);

        return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    }
});


myApp.filter('showDate2', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date(input);
        return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    }
});
myApp.filter('showFullDateTime', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(input);
        return d.getHours() + " giờ " + d.getMinutes() + " phút " + d.getSeconds() + " giây " + " - " + "Ngày " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }
});
/**trả về mảng chứa các phần tử của 2 mảng */

myApp.filter('conceptArray', function () {
    return function (one, two) {
        if (!one && !two) { return []; }
        if (!one) { return two; }
        if (!two) { return one; }
        var temp = one;
        for (var i in two) {
            temp.push(two[i]);
        }
        return temp;
    }
});

/**localization */

myApp.filter('l', ['languageValue', function (languageValue) {
    function localization(key, param) {
        if (!key) { return "nonekey" }
        var value;
        for (var i in languageValue.details) {
            if (languageValue.details[i].key == key) { value = languageValue.details[i]; break; }
        }
        if (!value || !value.value) { return "Please Regist For :" + key; }
        if (!param) { return value.value };
        var result = value.value;
        for (var i in param) {
            result = result.replace("{{" + i + "}}", param[i]);
        }
        return result;
    }
    localization.$stateful = true;
    return localization;
}]);

myApp.filter('byteFormat', function () {
    return function (bytes) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (bytes === 0) return '0 KB';

        var k = 1024;
        var sizes = ['KB', 'MB', 'GB'];

        var i = Math.floor(Math.log(bytes) / Math.log(k));
        var formattedSize = (bytes / Math.pow(k, i)).toFixed(2);

        return formattedSize + ' ' + sizes[i - 1];
    };
});

myApp.filter('checkRule', ['$rootScope', function ($rootScope) {
    return function (rule) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
        ) { return false; }

        if ($rootScope.logininfo.data.rule.filter(e => e.rule === "*").length > 0 || rule.length === 0) {
            return true;
        }

        for (var i in rule) {
            if ($rootScope.logininfo.data.rule.filter(e => e.rule === rule[i]).length > 0) {
                return true;
            }
        }

        return false;
    }
}]);

myApp.filter('getFriendUsername', ['$rootScope', function ($rootScope) {
    return function (members) {
        if (!members) {
            return "";
        }
        for (var i in members) {
            if (members[i] !== $rootScope.logininfo.username) {
                return members[i];
            }
        }
        return true;
    }
}]);

myApp.filter('getName', ['$rootScope', function ($rootScope) {
    return function (title) {
        if (!title) { return "---"; }
        var name = title.split(" ")[title.split(" ").length - 1];
        if (name.length > 10) {
            name = name.substring(0, 9) + "..";
        }
        return name;
    }
}]);

myApp.filter('isMe', ['$rootScope', function ($rootScope) {
    return function (username) {
        if (!username) { return false; }
        return username === $rootScope.logininfo.username;
    }
}]);

myApp.filter('showNormTimeUnit', ['$filter', function ($filter) {
    return function (unit) {
        let value = '';
        switch (unit) {
            case "business_day":
                value = "BusinessDay";
                break;
            case "day":
                value = "Day";
                break;
            case "hour":
                value = "Hour";
                break;
            case "minute":
                value = "Mintue";
                break;
        }
        return $filter('l')(value);
    }
}]);

myApp.filter('checkRuleCreateTaskAll', ['$rootScope', function ($rootScope) {
    return function () {
        let rule = $rootScope.logininfo.data.rule.filter(e => e.rule === "Office.Task.Create_Task_Department")

        if (rule[0] && rule[0].details.type === "All") {
            return true
        }
        return false;
    }
}]);

myApp.filter('checkRuleDepartmentRadio', ['$rootScope', function ($rootScope) {
    return function (department, rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (ruleDetails && ruleDetails.details) {
            switch (ruleDetails.details.type) {
                case "All":
                    return true;
                    break;
                case "Working":
                    if($rootScope.logininfo.data.department === department){
                        return true;
                    }
                    break;
                case "Specific":
                    if(ruleDetails.details.department.indexOf(department)!==-1){
                        return true;
                    }
                    break;
            }
        }

        return false;
    }
}]);

myApp.filter('hasRuleRadio', ['$rootScope', function ($rootScope) {
    return function (rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (!ruleDetails || !ruleDetails.details || ruleDetails.details.type === 'None') {
            return false;
        }

        return true;
    }
}]);

myApp.filter('checkRuleCheckbox', ['$rootScope', function ($rootScope) {
    return function (rule) {
        return $rootScope.logininfo.data.rule.some(e => e.rule === rule);
    }
}]);

myApp.filter('checkLessThan',  function () {
    return function (model,val) {
        return model<val;
    }
});

myApp.filter('currencyFormat',  function () {
    return function (amount, currency = 'VND') {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
    }
});


myApp.filter('convertToStartOfDay',  function () {
    return function (date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
});

myApp.filter('convertToEndOfDay',  function () {
    return function (date) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 59);
        return d;
    }
});

myApp.filter('isDateInRange', function () {
    return function (startDate, endDate, checkDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const check = new Date(checkDate); 
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        check.setHours(0, 0, 0, 0);

        return check >= start && check <= end;
      }
})

myApp.filter('compareDate', function () {
    return function (date1,date2) {
        const d1 = new Date(date1).setHours(0, 0, 0, 0);
        const d2 = new Date(date2).setHours(0, 0, 0, 0);
        return Math.sign(d1 - d2);
      }
})
myApp.filter('groupAndSortComments', function () {
    return function (listComments) {
        const comments = angular.copy(listComments);
        const groupedComments = new Map();
        comments.forEach(comment => {
            if (!comment.challenge_id) {
            groupedComments.set(comment.id, {
                ...comment,
                reply: [],
            });
            } else if (groupedComments.has(comment.challenge_id)) {
                groupedComments.get(comment.challenge_id).reply.push(comment);
            }
        });
        const sortedComments = Array.from(groupedComments.values()).map(challenge => {
            challenge.reply.sort((a, b) => b.time - a.time); 
            return challenge;
        });
        sortedComments.sort((a, b) => b.time - a.time);
        return sortedComments;
    }
});

myApp.filter('checkLessThan',  function () {
    return function (model,val) {
        return model<val;
    }
});

myApp.filter('currencyFormat',  function () {
    return function (amount, currency = 'VND') {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
    }
});

myApp.filter('checkStringNull',  function () {
    return function (str) {
        return !!!(typeof str === 'string' && str.length > 0);
    }
});

myApp.filter('checkObjNull',  function () {
    return function (obj) {
        return Object.keys(obj).length > 0;
    }
});

myApp.filter('getStringRandom',  function () {
    return function () {
        const timestamp = Date.now(); // Lấy thời gian hiện tại
        const randomString = Math.random().toString(36).substring(2, 8); // Tạo chuỗi ngẫu nhiên (6 ký tự)
        return timestamp + randomString;
    }
});

myApp.filter('hasRule', ['$rootScope', function ($rootScope) {
    return function (rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if(!ruleDetails){
            return false;
        }

        if(ruleDetails && ruleDetails.details && ruleDetails.details.type === 'None'){
            return false;
        }
        return true;
    }
}]);

myApp.filter('markOverlappingEvents',  function () {
    return function (events, keyStart, keyEnd) {
        events.forEach(event => (event.isOverlap = false));

        // Duyệt qua từng phần tử để kiểm tra sự trùng lặp
        for (let i = 0; i < events.length; i++) {
            for (let j = i + 1; j < events.length; j++) {
            // Nếu thời gian bắt đầu của sự kiện j nhỏ hơn thời gian kết thúc của sự kiện i
            // và thời gian kết thúc của sự kiện j lớn hơn thời gian bắt đầu của sự kiện i
            const endTime1 = events[i][keyEnd] ? events[i][keyEnd] : events[i][keyStart];
            const endTime2 = events[j][keyEnd] ? events[j][keyEnd] : events[j][keyStart];
            if (
                Number(events[j][keyStart]) < Number(endTime1) &&
                Number(endTime2) > Number(events[i][keyStart])
            ) {
                // Đánh dấu cả hai sự kiện là trùng
                events[i].isOverlap = true;
                events[j].isOverlap = true;
            }
            }
        }
        return events;
    }
});

myApp.filter('filter_distinct', function () {
    return function (items, key) {
        if (!items || !key) return items;

        let set = new Set();
        return items.filter(item => {
            if (!item[key]) return true;
            if (set.has(item[key])) return false;
            set.add(item[key]);
            return true;
        });
    };
});

myApp.filter('regexLink', function () {
    return function (text) {
        const regex = /(?:https?:\/\/|www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?/g;

        return text.replace(regex, url => {
            // Nếu URL không bắt đầu bằng 'http' hoặc 'https', thêm 'http://'
            const href = url.startsWith('http') ? url : `http://${url}`;
            return `<a target="_blank" href="${href}">${url}</a>`;
        });
    };
});

myApp.filter('showRoomEventCalendar', ['$filter', function ($filter) {
    return function (details) {
        const MEETING_ROOM_SCHEDULE_STATUS = {
            REGISTERED: "Registered",
            APPROVED: "Approved",
            DEPARTMENT_APPROVED: "DepartmentApproved",
            CONFIRMED: "Confirmed",
            REQUEST_CANCEL: "RequestCancel",
            CANCELLED: "Cancelled",
            REJECTED: "Rejected"
        }

        const ROOM_FLOW_STATUS ={
            APPROVE:"approve",
            CANCEL:"cancel"
        }

        if(details.status === MEETING_ROOM_SCHEDULE_STATUS.APPROVED){
            return details.room;
        }

        if(details.flow===ROOM_FLOW_STATUS.CANCEL && details.status!== MEETING_ROOM_SCHEDULE_STATUS.CANCELLED){
            return details.room;
        }

        return null;
    };
}]);

myApp.filter('showCarEventCalendar', ['$filter', function ($filter) {
    return function (details) {
        const STATUS_FLOW = {
            REGISTER: "register",
            RECALL: "recall"
        };

        const STATUS_CAR = {
            CREATED: "Created",
            LEADER_DEPARTMENT_APPROVED: "reviewer_approved",
            CONFIRMER_APPROVED: "manager_approved",
            LEAD_APPROVED_CAR: "head_approved_car",
            LEAD_EXTERNAL_APPROVED: "head_external_approved",  //1
            CREATOR_RECEIVED_CARD: 'creator_received_card',    //1
            CREATOR_RETURNED_CARD: 'creator_returned_card',    //1
            MANAGER_RECEIVED_CARD: 'manager_received_card',    //1
            REJECTED: "rejected",
            CANCELLED: "cancelled",
            RECALLED:"recalled",
        };

        const statusActive = [
            STATUS_CAR.LEAD_EXTERNAL_APPROVED,
            STATUS_CAR.CREATOR_RECEIVED_CARD,
            STATUS_CAR.CREATOR_RETURNED_CARD,
            STATUS_CAR.MANAGER_RECEIVED_CARD,
        ]

        switch(details.flow_status){
            case STATUS_FLOW.REGISTER:
                if(statusActive.includes(details.status)){
                    return true;
                }
                break;
            case STATUS_FLOW.RECALL:
                if(details.status === STATUS_CAR.CANCELLED){
                    return false;
                }
                break;
        }
        return false;
    };
}]);

myApp.filter('addDaysAndFormat', function () {
    return function (inputDate, daysToAdd, outputFormat = "DD/MM/YYYY") {
        // Tách ngày, tháng, năm từ chuỗi
        const [day, month, year] = inputDate.split("/").map(Number);
        
        // Tạo đối tượng Date từ ngày, tháng, năm
        const date = new Date(year, month - 1, day); // Tháng trong Date bắt đầu từ 0
        
        // Cộng thêm số ngày
        date.setDate(date.getDate() + daysToAdd);
        
        // Các hàm hỗ trợ format
        const formatParts = {
            DD: () => String(date.getDate()).padStart(2, "0"),
            D: () => String(date.getDate()),
            MM: () => String(date.getMonth() + 1).padStart(2, "0"),
            M: () => String(date.getMonth() + 1),
            YYYY: () => String(date.getFullYear()),
            YY: () => String(date.getFullYear()).slice(-2),
        };
        
        // Thực hiện format theo yêu cầu
        let result = outputFormat;
        Object.entries(formatParts).forEach(([pattern, formatter]) => {
            result = result.replace(pattern, formatter());
        });
        
        return result;
}});

myApp.filter('taskPriorityTransform', function () {
    return function (search) {
        const priorityList = [
            { key: 1, value: 'Critical' },
            { key: 2, value: 'High' },
            { key: 3, value: 'Medium' },
            { key: 4, value: 'Low' },
        ];
        return priorityList.find(item => item.key === search || item.value === search) || '';
    };
});

myApp.filter('joinByColumn', function () {
    return function (arr, column, char = ', ') {
        return arr.map(item => item[column]).filter(item => item).join(char);
    };
});


myApp.filter('checkLimitProcess', function () {
    return function (listWorkItems) {
        let limit_progress = 100;
        for (let item of listWorkItems) {
            if (item.status !== 'Completed') {
                limit_progress = 99;
                break; 
            }
        }
        return limit_progress;
    }
});

myApp.filter('getSpecificDateRange', function () {
    return function (type, date = new Date()) {
        const inputDate = new Date(date);
        switch (type) {
            case "startOfWeek": {
                const startOfWeek = new Date(inputDate);
                startOfWeek.setDate(inputDate.getDate() - inputDate.getDay() + 1);
                return startOfWeek;
            }
            case "endOfWeek": {
                const startOfWeek = new Date(inputDate);
                startOfWeek.setDate(inputDate.getDate() - inputDate.getDay() + 1);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return endOfWeek;
            }
            case "startOfMonth": {
                return new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
            }
            case "endOfMonth": {
                return new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);
            }
            default:
                return inputDate;
        }
    };
});

myApp.filter('getPermissionTask', ['$rootScope', '$filter', function ($rootScope, $filter) {
    return function (item) {
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

        const TASK_RULE = {
            CREATE_TASK_DEPARTMENT: "Office.Task.Create_Task_Department", //Tạo công việc trong đơn vị
            CREATE_EXTERNAL: "Office.Task.CreateExternal", //Tạo công việc cấp 1
            OBSERVER_EXTERNAL: "Office.Task.observerExternal", // Giám sát công việc cấp 1
            RECEIVE_EXTERNAL: "Office.Task.ReceiveExternal", // Tiếp nhận công việc cấp 1
            RECEIVE_TASK: "Office.Task.Receive_task", // Tiếp nhận công việc từ phòng ban khác
            FOLLOW_DEPARTMENT:"Office.Task.Follow_Task_Department", // Theo dõi công việc của phòng ban
        };

        const permission = {};
        const currentUser = $rootScope.logininfo.data;
        const isMainPerson = item.main_person.includes(currentUser.username);
        const isObserver = item.observer.includes(currentUser.username);
        const isParticipant = item.participant.includes(currentUser.username);
        const isCreator = item.username.includes(currentUser.username);
        const isFollower = $filter('checkRuleDepartmentRadio')(item.department, TASK_RULE.FOLLOW_DEPARTMENT);

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
        permission.allow_follow_otherTask = isFollower;
        permission.allow_comment = isMainPerson || isObserver || isParticipant;

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
                if($filter('checkRuleCheckbox')(TASK_RULE.RECEIVE_TASK) && currentUser.department === item.to_department){
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
            case TASK_STATUS.WAITING_LEAD_DEPARTMENT_APPROVE_RECEIVE:
                if(isMainPerson){
                    permission.allow_remove_task;
                }
                if($filter('checkRuleCheckbox')(TASK_RULE.RECEIVE_TASK) && currentUser.department === item.from_department){
                    permission.allow_approve_recive_task = true;
                }
                break;
            case TASK_STATUS.WAITING_FOR_APPROVAL:
                if(isObserver){
                    permission.allow_approve_complete = true;
                }
                break;
        }

        return permission;
    };
}]);


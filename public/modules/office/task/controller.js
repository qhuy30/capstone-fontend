myApp.registerCtrl('task_controller', ['$location', '$rootScope', '$filter', function ($location, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" }
    ];
    var ctrl = this;
    const From_Date_Error_Msg = $filter('l')('FromDateErrorMsg');
    const To_Date_Error_Msg = $filter('l')('ToDateErrorMsg');
    const End_Date_Error_Msg = "Ngày kết thúc phải lớn hơn ngày hiện tại"

    /** init variable */
    {
        ctrl._ctrlName = "task_controller";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    $rootScope.isValidEndDate = function (isInsert, endDate) {
        let today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        if (isInsert) {
            return (!endDate || endDate < currentDate) ? End_Date_Error_Msg : '';
        } else {
            return endDate < currentDate ? End_Date_Error_Msg : '';
        }
    }

    $rootScope.isValidFromDate = function (isInsert, fromDate, toDate) {
        if (isInsert) {
            return (!fromDate || fromDate > toDate) ? From_Date_Error_Msg : '';
        } else {
            return fromDate > toDate ? From_Date_Error_Msg : '';
        }
    }

    $rootScope.isValidToDate = function (isInsert, fromDate, toDate) {
        if (isInsert) {
            return (!toDate || fromDate > toDate) ? To_Date_Error_Msg : '';
        } else {
            return fromDate > toDate ? To_Date_Error_Msg : '';
        }
    }

    function setUrlContent() {
        switch (ctrl.tab) {
            case "department":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/department_homepage.html";
                break;

            case "project":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/project_view.html";
                break;

            case "personal":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/personal_view.html";
                break;

            case "statistic":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/statistic_view.html";
                break;

            case "taskmanagement":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/task_management_view.html";
                break;
            case "quickhandle":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/quick_handle_view.html";
                break;
            case "my_calendar":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/my_calendar.html";
                break;
            case "task_external":
                ctrl._urlContent = FrontendDomain + "/modules/office/task/views/task_external.html";
                break;
        }
    }

    ctrl.switchTab = function (val) {
        $location.url("/task?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
    }

    function init() {
        var tab = $location.search().tab;
        if (tab && ["department", "project", "personal", "statistic", "taskmanagement","quickhandle", "my_calendar", "task_external"].indexOf(tab) !== -1) {
            ctrl.tab = tab;
            setUrlContent();
        } else {
            ctrl.tab = "quickhandle";
            setUrlContent();
        }
    }

    init();

}]);

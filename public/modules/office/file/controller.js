myApp.registerCtrl('file_controller', ['$location', 'file_service', '$rootScope', '$q', '$filter', function ($location, file_service, $rootScope, $q, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" }
    ];
    var ctrl = this;
    {
        ctrl._ctrlName = "file_controller";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    function setUrlContent() {
        switch (ctrl.tab) {
            case "general":
                ctrl._urlContent = FrontendDomain + "/modules/office/file/views/general_view.html";
                break;

            case "department":
                ctrl._urlContent = FrontendDomain + "/modules/office/file/views/department_homepage.html";
                break;

            case "project":
                ctrl._urlContent = FrontendDomain + "/modules/office/file/views/project_view.html";
                break;

            case "personal":
                ctrl._urlContent = FrontendDomain + "/modules/office/file/views/personal_view.html";
                break;

            case "shareWithMe":
                ctrl._urlContent = FrontendDomain + "/modules/office/file/views/share_view.html";
                break;
        }
    }

    ctrl.switchTab = function (val) {
        $location.url("/file?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
    }

    function init() {
        var tab = $location.search().tab;
        if (tab && ["general", "department", "project", "personal", "shareWithMe"].indexOf(tab) !== -1) {
            ctrl.tab = tab;
            setUrlContent();
        } else {
            ctrl.tab = "personal";
            setUrlContent();
        }
    }

    init();

}]);

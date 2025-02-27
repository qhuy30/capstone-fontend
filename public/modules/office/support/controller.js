myApp.registerCtrl('support_controller', ['$location', '$rootScope', '$filter', function ($location, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "support", action: "init" }
    ];

    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "support_controller";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    function setUrlContent() {
        switch (ctrl.tab) {
            case "faq":
                ctrl._urlContent = FrontendDomain + "/modules/office/support/views/faq.html";
                break;

            case "user_manual":
                ctrl._urlContent = FrontendDomain + "/modules/office/support/views/user_manual.html";
                break;

            case "contact_support":
                ctrl._urlContent = FrontendDomain + "/modules/office/support/views/contact_support.html";
                break;

            default:
                ctrl._urlContent = FrontendDomain + "/modules/office/support/views/faq.html";
                break;
        }
    }

    ctrl.switchTab = function (val) {
        $location.url("/support?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
    }

    function init() {
        var tab = $location.search().tab || "faq";
        ctrl.tab = tab;
        setUrlContent();
    }

    init();

}]);

myApp.registerCtrl('faq_controller', ['$location', '$rootScope', '$filter', '$q', 'support_service', function ($location, $rootScope, $filter, $q, support_service) {

    /**declare variable */
    const _statusValueSet = [
        { name: "FAQ", action: "load" }
    ];

    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "faq_controller";
        ctrl.faq_list = [];
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    function init() {
        var dfd = $q.defer();
        support_service.load_FAQs().then(function (res) {
            dfd.resolve(true);

            ctrl.faq_list = res.data
                .filter(faq => faq.language === $rootScope.logininfo.data.language.current)
                .map(faq => ({
                    ...faq,
                    isCollapsed: true
                }));

        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    init();

}]);

myApp.registerCtrl('user_manual_controller', ['$location', '$rootScope', '$filter', 'FileSaver', '$q', 'support_service', function ($location, $rootScope, $filter, FileSaver, $q, support_service) {

    /**declare variable */
    const _statusValueSet = [
        { name: "UserManual", action: "init" },
        { name: "UserManual", action: "download" }
    ];

    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "user_manual_controller";
        ctrl.user_manual_list = [];
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.load_file_info = function (params) {
        return function () {
            var dfd = $q.defer();
            support_service.load_file_info(params).then(function (res) {
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

    ctrl.downloadfile = function (attachment) {
        var dfd = $q.defer();
        ctrl.downloading = true;
        support_service.downloadfile(attachment).then(
            function (res) {
                FileSaver.saveAs(res.data, attachment.name);
                dfd.resolve(true);
            },
            function (err) {
                dfd.reject(err);
            }
        ).finally(() => {
            ctrl.downloading = false;
        });
        return dfd.promise;
    }

    function init() {
        var dfd = $q.defer();
        support_service.load_user_manuals().then(function (res) {
            dfd.resolve(true);
            ctrl.user_manual_list = res.data;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    init();
}]);
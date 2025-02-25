myApp.registerCtrl('training_point_controller', ['$location', '$rootScope', '$filter', function ($location, $rootScope, $filter) {

    const _statusValueSet = [
        { name: "TrainingPoint", action: "init" },
        { name: "TrainingPoint", action: "load" }
    ];
    var ctrl = this;

    /** init variable */
        ctrl._ctrlName = "training_point_controller";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    function setUrlContent() {
        switch (ctrl.tab) {
            case "event":
                ctrl._urlContent = FrontendDomain + "/modules/education/training_point/views/event.html";
                break;
            case "student":
                ctrl._urlContent = FrontendDomain + "/modules/education/training_point/views/student.html";
                break;
        }
    }

    ctrl.switchTab = function (val) {
        $location.url("/training-point?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
    }

    function init() {
        var tab = $location.search().tab;
        if (tab && ["event", "student"].indexOf(tab) !== -1) {
            ctrl.tab = tab;
            setUrlContent();
        } else {
            ctrl.tab = "event";
            setUrlContent();
        }
    }

    init();

}]);
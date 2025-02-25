
myApp.registerCtrl('common_question_controller', ['question_answer_service', '$q', '$rootScope', '$scope', '$filter', function (question_answer_service, $q, $rootScope, $scope, $filter) {
    var ctrl = this;
    var idEditor = "updateQuestion_content";
    const _statusValueSet = [
        { name: "QuestionAnswer", action: "init" },
        { name: "QuestionAnswer", action: "count_created" },
        { name: "QuestionAnswer", action: "load_created" },
    ];
    ctrl._ctrlName = "common_question_controller";
    ctrl.collapseStrategic = true;
    ctrl.currentPage_created = 1;
    ctrl.totalItems_created = 0;
    ctrl.totalItems_created = 3;
    ctrl.numOfItemPerPage = 30;
    ctrl.commonQuesions = [
    ];
    ctrl._urlUpdateModal = FrontendDomain + "/modules/education/question_answer/view/update_modal.html";

    // ctrl.load_common_question = function (val) {
    //     if (val != undefined) { ctrl.offset = angular.copy(val); }
    //     return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "load_question", load_task_created_service);
    // }

    function setValueFilter() {
        var today = new Date();
        ctrl._filterToDate_created = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus_created = "All";
        if (today.getDate() < 10) {
            ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
            ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        } else {
            ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
            ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        }


        ctrl._filterToDate_created = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus_created = "All";


        ctrl._filterToDate_assigned = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        ctrl._filterStatus_assigned = "All";

    }
    function init() {
        setValueFilter();
    }
    init();
    ctrl.count_task_created = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "count_created", count_task_created_service);
    }
    ctrl.prepareUpdate = function (value) {
        console.log(value);
    }


}]);
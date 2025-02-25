myApp.registerCtrl('question_answer_controller', ['$location', '$rootScope', '$filter', function ($location, $rootScope, $filter) {

    const _statusValueSet = [
        { name: "QuestionAnswer", action: "init" },
        { name: "QuestionAnswer", action: "load" }
    ];
    var ctrl = this;

    /** init variable */
        ctrl._ctrlName = "question_answer_controller";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    function setUrlContent() {
        switch (ctrl.tab) {
            case "commonQuestion":
                ctrl._urlContent = FrontendDomain + "/modules/education/question_answer/view/common_question.html";
                break;

            case "studentAnswer":
                ctrl._urlContent = FrontendDomain + "/modules/education/question_answer/view/student_answer.html";
                break;

            case "settings":
                ctrl._urlContent = FrontendDomain + "/modules/education/question_answer/view/settings.html";
                break;
        }
    }

    ctrl.switchTab = function (val) {
        $location.url("/question-answer?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
    }

    function init() {
        var tab = $location.search().tab;
        if (tab && ["commonQuestion", "studentAnswer", "settings"].indexOf(tab) !== -1) {
            ctrl.tab = tab;
            setUrlContent();
        } else {
            ctrl.tab = "commonQuestion";
            setUrlContent();
        }
    }

    init();

}]);
myApp.registerCtrl('student_details_controller', ['question_details_service', '$q', '$rootScope', '$timeout', '$window', function (question_details_service, $q, $rootScope, $timeout, $window) {

    var ctrl = this;
    ctrl.Item = {};
    ctrl.tab = 'event'
    var idAnswer = 'answer_content';
    ctrl._filterDepartment = {};
    ctrl._update_value = {};
    const _statusValueSet = [
        { name: "QuestionAnswer", action: "loadStudentQuestionDetails" },
        { name: "QuestionAnswer", action: "updateStudentQuestionDetails" },
        { name: "ForwordQuestionAnswer", action: "update" },
    ];
    ctrl._ctrlName = "student_details_controller";
    ctrl.thisId = '';
    // ctrl._urlUpdateModal = FrontendDomain + "/modules/education/question_answer/view/update_student_questions_modal.html";
    ctrl._urlForwardModal = FrontendDomain + "/modules/education/question_answer/view/forward_modal_detail.html";

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "loadStudentQuestionDetails", loadDetails_service);
    }
    ctrl.forward_common_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ForwordQuestionAnswer", "update", forward_service);
    }
    function loadDetails_service() {
        var dfd = $q.defer();
        question_details_service.loadStudentQuestionsDetails(ctrl.thisId).then(function (res) {
            ctrl.Item = res.data;
            // $('#' + idAnswer).html(function () {
            //     return ctrl.Item.answer;
            // })
            // console.log(ctrl.Item.answer)
            // $timeout(function () {
            //     ctrl._notyetInit = false;
            // }, 1000);

            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.prepareUpdate = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "updateStudentQuestionDetails");
        ctrl._update_value = angular.copy(value);
    }
    ctrl.prepareForward = function (value) {
        ctrl._update_value = angular.copy(value);
    }


    ctrl.update_student_question = function (value) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "updateStudentQuestionDetails", update_service);

    }

    function update_service() {
        var dfd = $q.defer();
        question_details_service.updateStudentQuestionsDetails(ctrl.thisId, ctrl._update_value.answer,'answered', false ).then(function (res) {
            
            ctrl.Item = res.data;
            // $('#' + idAnswer).html(function () {
            //     return ctrl.Item.answer;
            // })
            // $timeout(function () {
            //     ctrl._notyetInit = false;
            // }, 1000);

            dfd.resolve(true);
            ctrl.loadDetails(ctrl.thisId);
            $('#modal_Student_Question_Update').modal('hide');
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }
    ctrl.chooseDepartment = function (department) {
        ctrl._filterDepartment.id = department.id;  // Assuming 'id' is the correct property for the department ID
    }
    
    function forward_service() {
        var dfd = $q.defer();
        question_details_service.forward_common_question(
            ctrl.Item._id,
            ctrl.Item.question,
            ctrl._filterDepartment.id,
            ctrl.Item.status
        ).then(function () {
            ctrl.loadDetails();
            $("#modal_Forward_Detail").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    function init() {
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'student-question-details') {
            ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !== 24) {
                $rootScope.urlPage = urlNotFoundPage;
            } else {
                ctrl.loadDetails(ctrl.thisId);
            }
        }
        else {
            ctrl.thisId = $rootScope.currentPath.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !== 24) {
                $rootScope.urlPage = urlNotFoundPage;
            } else {
                ctrl.loadDetails();
            }
        }
    }
    init()

}]);

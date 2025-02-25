myApp.registerCtrl('qna_details_controller', ['question_details_service', '$q', '$rootScope', '$timeout', '$window', function (question_details_service, $q, $rootScope, $timeout, $window) {

    var ctrl = this;
    ctrl.Item = {};
    ctrl.tab = 'event'
    var idAnswer = 'answer_content';
    const _statusValueSet = [
        { name: "QuestionAnswer", action: "loadDetails" },
    ];
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "loadDetails", loadDetails_service);
    }
    function loadDetails_service() {
        var dfd = $q.defer();
        question_details_service.loadDetails(ctrl.thisId).then(function (res) {
            console.log('res', res);
            ctrl.Item = res.data;
            $('#' + idAnswer).html(function () {
                return ctrl.Item.answer;
            })
            console.log(ctrl.Item.answer)
            $timeout(function () {
                ctrl._notyetInit = false;
            }, 1000);

            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function init() {
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'question-details') {
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

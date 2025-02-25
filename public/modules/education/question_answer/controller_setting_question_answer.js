myApp.registerCtrl('setting_question_answer_controller', ['question_answer_service', '$q', '$rootScope', '$scope', '$filter', function (question_answer_service, $q, $rootScope, $scope, $filter) {
    var ctrl = this;
    ctrl._ctrlName = "setting_question_answer_controller";
    const _statusValueSet = [
        { name: "QuestionAnswer", action: "init" },
        { name: "QuestionAnswer", action: "insert" },
        { name: "QuestionAnswer", action: "update" },
        { name: "QuestionAnswer", action: "load_type_question" },
        { name: "QuestionAnswer", action: "delete" },
        { name: "QuestionAnswer", action: "load" },
        { name: "QuestionAnswer", action: "count_type_question" },
    ];
    ctrl._insert_value = {};
    ctrl._update_value = {};
    ctrl._delete_value = {};
    ctrl._urlUpdateModal = FrontendDomain + "/modules/education/question_answer/view/update_group_qna_modal.html";
    ctrl._urlInsertModal = FrontendDomain + "/modules/education/question_answer/view/insert_group_qna_modal.html";
    ctrl._urlDeleteModal = FrontendDomain + "/modules/education/question_answer/view/delete_group_qna_modal.html";
    ctrl.typeQuestions = [];
    ctrl.currentPage = 1;
    ctrl.totalItems = 0;
    ctrl.offset = 0;
    ctrl.numOfItemPerPage = 30;
    ctrl._notyetInit = true;
    ctrl._searchByKeyToFilterData = "";
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    ctrl.refreshData = function () {
        resetPaginationInfo();
        ctrl.load_type_question();
        ctrl.count_question();
    }

    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }
    
    ctrl.load_type_question = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "load_type_question", load_type_question_service);
    }

    function load_type_question_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_created();
        question_answer_service.load_type_questions(_filter.search, ctrl.numOfItemPerPage, ctrl.offset).then(function (res) {
            ctrl.typeQuestions = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function generateFilter_created() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== '') {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "delete", delete_service);
    }

    ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "delete");
        ctrl._delete_value = angular.copy(value);
        console.log('ctrl._delete_value', ctrl._delete_value);
    }

    function delete_service() {
        var dfd = $q.defer();
        question_answer_service.delete_type_question(
            ctrl._delete_value._id,
        ).then(function () {
            ctrl.refreshData();
            $("#modal_Type_Delete").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert_func = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "insert", insert_service);
    }

    function insert_service() {
        var dfd = $q.defer();
        question_answer_service.insert_type_question(
            ctrl._insert_value.id = new Date().getTime().toString(),
            ctrl._insert_value.title_vi,
            ctrl._insert_value.title_en,
            ctrl._insert_value.value,
            ctrl._insert_value.active
        ).then(function () {
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "insert");

        ctrl._insert_value = {

        };
    }

    ctrl.insert_type_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "insert", insert_service);
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "update", update_service);
    }

    function update_service() {
        var dfd = $q.defer();
        question_answer_service.update_type_question(
            ctrl._update_value.id,
            ctrl._update_value.title_vi,
            ctrl._update_value.title_en,
            ctrl._update_value.value,
            ctrl._update_value.active
        ).then(function () {
            dfd.resolve(true);
            ctrl.load_type_question();
            $("#modal_Group_Qna_Update").modal("hide");
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.prepareUpdate = function (value) {
        ctrl._update_value = {
            id: value._id,
            title_vi: value.title_vi,
            title_en: value.title_en,
            value: value.value,
            active: value.active
        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "update");
        console.log(ctrl._update_value);
    }

    ctrl.count_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "count_type_question", count_type_question_service);
    }

    function count_type_question_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_created();
        question_answer_service.count_type_question(_filter.search).then(function (res) {
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

    function init() {
        var dfdAr = [ctrl.load_type_question()];
        var dfdAr = [ctrl.count_question()];
        dfdAr.push();
        $q.all(dfdAr).then(function () {
            ctrl._notyetInit = false;
        });
    }
    init();
}]);
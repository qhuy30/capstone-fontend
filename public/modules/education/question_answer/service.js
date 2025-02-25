myApp.registerFtr('question_answer_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load_common_question = function (search, from_date, to_date, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/loadListFrequentlyQuestions",
            method: "POST",
            data: JSON.stringify({
                search,
                from_date,
                to_date,
                "top": top,
                offset,
                "sort": ""
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.insert_common_question = function (question, answer, type_question) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/createFrequentlyQuestions",
            method: "POST",
            data: JSON.stringify({ question, answer, type_question }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_common_question = function (id, question, answer, type_question) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/updateFrequentlyQuestions",
            method: "POST",
            data: JSON.stringify({ id, question, answer, type_question }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.forward_common_question = function (_id, question, department, status) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/forwardQuestion",
            method: "POST",
            data: JSON.stringify({ _id, question, department, status }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete_common_question = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/deleteFrequentlyQuestions",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_common_question = function (search, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/countFrequentlyQuestions",
            method: "POST",
            data: JSON.stringify({ search, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_type_question = function (id, title_vi, title_en, value, active) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/createListQuestions",
            method: "POST",
            data: JSON.stringify({ id, title_vi, title_en, value, active }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_type_questions = function (search, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/loadListTypeOfQuestions",
            method: "POST",
            data: JSON.stringify({ search, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_type_question = function (id, title_vi, title_en, value, active) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/updateListTypeOfQuestions",
            method: "POST",
            data: JSON.stringify({ id, title_vi, title_en, value, active }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete_type_question = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/deleteListTypeOfQuestions",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_type_question = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/countTypeQuestions",
            method: "POST",
            data: JSON.stringify({ search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_student_questions = function (search, from_date, to_date, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/loadStudentQuestions",
            method: "POST",
            data: JSON.stringify({ search, from_date, to_date, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_student_question = function (search, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/question_answer/countStudentQuestions",
            method: "POST",
            data: JSON.stringify({ search, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
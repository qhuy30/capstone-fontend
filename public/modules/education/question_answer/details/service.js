myApp.registerFtr('question_details_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};

        obj.loadDetails = function (id) {
            console.log(id);
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/question_answer/loadDetailsFrequentlyQuestion',
                method: 'POST',
                data: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.loadStudentQuestionsDetails = function (id) {
            console.log(id);
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/question_answer/loadStudentQuestionsDetails',
                method: 'POST',
                data: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.updateStudentQuestionsDetails = function (_id, answer , status, isStudent) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/question_answer/answerQuestions',
                method: 'POST',
                data: JSON.stringify({ _id, answer, status, isStudent }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

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
        
        return obj;
    },
]);

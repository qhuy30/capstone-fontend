
myApp.registerFtr('administrative_procedure_details_service', ['fRoot', '$q', '$cookies', function (fRoot, $q, $cookies) {
    var obj = {};

    obj.getCookies = function (key) {

        if ($cookies.get(key)) {
            //  if(window.localStorage.getItem(key)){
            return {
                status: true,
                data: $cookies.get(key)
                // data: window.localStorage.getItem(key)
            };
        } else {
            return { status: false };
        }
    }

    obj.loadDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCompetence_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type: "value", id, master_key: "competence" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadWFDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/workflow-form/load-detail",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.requireAdditionalDocuments = function (id, username, comment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/requireAdditionalDocuments",
            method: "POST",
            data: JSON.stringify({ id, username, comment }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.approval = function (id, username, comment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/approval",
            method: "POST",
            data: JSON.stringify({ id, username, comment }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.reject = function (id, username, comment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/reject",
            method: "POST",
            data: JSON.stringify({ id, username, comment }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.resumeProcessing = function (id, username, comment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/resumeProcessing",
            method: "POST",
            data: JSON.stringify({ id, username, comment }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.addFeedback = function (id, username, content) {
        var formData = new FormData();
        formData.append('id', id);
        formData.append('username', username);
        formData.append('content', content);
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/administrative_procedures/feedback/add",
            method: "POST",
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': undefined
            }
        });
    }

    return obj;
}]);
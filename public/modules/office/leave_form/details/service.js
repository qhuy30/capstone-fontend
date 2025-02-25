
myApp.registerFtr('leaveform_details_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.loadEmployee_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/loaddetails_d",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/loaddetails",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.loadDepartment_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadRole_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type: "value", id, master_key: "role" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.approval = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/approval",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/reject",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(title,number_day,leave_form,note){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/journey_time_form/insert",
            method: "POST",
            data: JSON.stringify({title,number_day,leave_form,note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.cancel = function(id,note){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/journey_time_form/cancel",
            method: "POST",
            data: JSON.stringify({id,note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
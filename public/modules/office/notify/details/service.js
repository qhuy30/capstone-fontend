
myApp.registerFtr('notify_details_service', ['fRoot','$q', function (fRoot,$q) {
    var obj = {};

    obj.load_details = function (code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_details",
            method: "POST",
            data: JSON.stringify({code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reload_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/reload_details",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_file_info",
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
            url: BackendDomain + "/office/notify/approval",
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
            url: BackendDomain + "/office/notify/reject",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.like = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/like",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.unlike = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/unlike",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/approval",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.reject = function (id, reason) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/reject",
            method: "POST",
            data: JSON.stringify({ id, reason }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.edit = function (id, title, content, group, type, to_employee, to_department, to_director, task_id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/update",
            method: "POST",
            data: JSON.stringify({ id, title, content, group, type, to_employee, to_department,to_director, task_id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_department = function (id, title, content, group, type, to_employee, to_department, to_director, task_id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/approve_department",
            method: "POST",
            data: JSON.stringify({ id, title, content, group, type, to_employee, to_department, to_director, task_id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.throw_to_recyclebin = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/throw_to_recyclebin",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.restore_from_recyclebin = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/restore_from_recyclebin",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.removeFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/removefile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushFile = function (file, id) {
        var formData = new FormData();
        formData.append('file', file.file, file.name);
        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/pushfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.recall = function (id, recall_reason) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/recall",
            method: "POST",
            data: JSON.stringify({ id, recall_reason }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.uploadImage = function (formData) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/uploadimage",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }
    
    return obj;
}]);
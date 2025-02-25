myApp.registerFtr('notify_service', ['fRoot', function (fRoot) {
    var obj = {};



    obj.load_file_info = function (code, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_file_info",
            method: "POST",
            data: JSON.stringify({ code, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }




    obj.loadEmployee = function (department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_employee",
            method: "POST",
            data: JSON.stringify({ department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.load = function (search, checks, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load",
            method: "POST",
            data: JSON.stringify({ search, checks, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search, checks) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count",
            method: "POST",
            data: JSON.stringify({ search, checks }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.count_not_seen = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count_not_seen",
            method: "POST",
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

    obj.insert = function (files, title, content, group, type, to_employee, to_department, to_director, task_id) {
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }

        formData.append("title", title);
        formData.append("content", content);
        formData.append("group", group);
        formData.append("type", type);
        formData.append("to_employee", JSON.stringify(to_employee));
        formData.append("to_department", JSON.stringify(to_department));
        formData.append("to_director", JSON.stringify(to_director));
        formData.append("task_id", task_id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/insert",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

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


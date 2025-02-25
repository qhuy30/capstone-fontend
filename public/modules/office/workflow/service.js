myApp.registerFtr('workflow_service', ['fRoot', function (fRoot) {
    var obj = {};



    obj.loadJob = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({ 
                master_key: "job",
                        offset: 0,
                        top: 5000
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadJob_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type: "value",id,master_key:"job"}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment = function (level, id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/load_for_workflow",
            method: "POST",
            data: JSON.stringify({ level, id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    


    obj.loadWF = function (key, search ,department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/load_follow_department",
            method: "POST",
            data: JSON.stringify({ key, search,department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadRole = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/role/load",
            method: "POST",
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

    obj.loadCompetence = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({ 
                master_key: "competence",
                        offset: 0,
                        top: 5000
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCompetence_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type: "value",id,master_key:"competence"}),
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

    obj.parseCustomTemplate = function (file) {
        const formData = new FormData();
        formData.append('file', file.file, file.name);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/workflow/template-parser',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    };
    
    obj.insert = function (title, key, flow, department_scope, department, is_personal, is_department, competence, job, role, fileType, allowAppendix, allowChooseDestination, files, templateTags, fee, estimateTime, receiveTime) {
        var formData = new FormData();
        for (var i in flow) {
            delete flow[i].$$hashKey;
            for (var j in flow[i].items) {
                delete flow[i].items[j].$$hashKey;
            }
        }

        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }
        formData.append('title', JSON.stringify(title));
        formData.append('key', key);
        formData.append('flow', JSON.stringify(flow));
        formData.append('department_scope', department_scope);
        formData.append('department', department);
        formData.append('is_personal', is_personal);
        formData.append('is_department', is_department);
        formData.append('competence', JSON.stringify(competence));
        formData.append('job', JSON.stringify(job));
        formData.append('role', JSON.stringify(role));
        formData.append('file_type', fileType);
        formData.append('allow_appendix', allowAppendix);
        formData.append('allow_choose_destination', allowChooseDestination);
        formData.append('fee', fee);
        formData.append('estimate_time', estimateTime);
        formData.append('receive_time', receiveTime);

        for (var i in templateTags) {
            delete templateTags[i].$$hashKey;
        }
        formData.append('templateTags', JSON.stringify(templateTags));

        return fRoot.requestHTTP({
            url: BackendDomain + '/office/workflow/insert',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            },
        });
    };

    obj.update = function (id, title,key,flow,department_scope,department,is_personal,is_department,competence,job,role, fileType, allowAppendix, allowChooseDestination, templateFiles, files, templateTags, fee, estimateTime, receiveTime) {
        var formData = new FormData();
        for(var i in flow){
            delete flow[i].$$hashKey;
            for(var  j in flow[i].items){
                delete flow[i].items[j].$$hashKey;
            }
        }

        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }

        formData.append('id', id);
        formData.append('title', JSON.stringify(title));
        formData.append('key', key);
        formData.append('flow', JSON.stringify(flow));
        formData.append('department_scope', department_scope);
        formData.append('department', department);
        formData.append('is_personal', is_personal);
        formData.append('is_department', is_department);
        formData.append('competence', JSON.stringify(competence));
        formData.append('job', JSON.stringify(job));
        formData.append('role', JSON.stringify(role));
        formData.append('file_type', fileType);
        formData.append('templateFiles', JSON.stringify(templateFiles));
        formData.append('allow_appendix', allowAppendix);
        formData.append('allow_choose_destination', allowChooseDestination);
        formData.append('fee', fee);
        formData.append('estimate_time', estimateTime);
        formData.append('receive_time', receiveTime);

        for (var i in templateTags) {
            delete templateTags[i].$$hashKey;
        }
        formData.append('templateTags', JSON.stringify(templateTags));

        return fRoot.requestHTTP({
            url: BackendDomain + '/office/workflow/update',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            },
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
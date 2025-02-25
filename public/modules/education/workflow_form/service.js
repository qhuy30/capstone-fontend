myApp.registerFtr('workflow_form_service', ['fRoot', function (fRoot) {
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
    return obj;
}])
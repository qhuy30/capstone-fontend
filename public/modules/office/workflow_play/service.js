myApp.registerFtr('workflow_play_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(checks, search, document_type, status, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/load",
            method: "POST",
            data: JSON.stringify({ 
                checks, search, document_type, status, top, offset, sort
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.count = function (search,document_type,status,checks) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/count",
            method: "POST",
            data: JSON.stringify({ search,document_type,status,checks}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    
    obj.loadWorkflow_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadWFP_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.init = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/init",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCustomTemplatePreview = function (workflowId, tagsValue) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/custom-template-preview",
            method: "POST",
            data: JSON.stringify({ workflowId, tagsValue }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose",
            },
        });
    };

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

    obj.insert = function (
        files,
        relatedFiles,
        appendixFiles,
        title,
        flowInfo,
        flow,
        documentType,
        tagsValue,
        archivedDocuments,
        parents,
        parent,
        DepartmentDestination,
        is_personal,
        is_department,
        transfer_ticket,
    ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }
        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }

        for(var i in appendixFiles) {
            formData.append(
                "appendix",
                appendixFiles[i].file,
                appendixFiles[i].name
            )
        }

        parents && formData.append('parents', JSON.stringify(parents));   
        parent && formData.append('parent', JSON.stringify(parent));   
        title && formData.append("title", title);
        flowInfo && formData.append("flow_info", JSON.stringify(flowInfo));
        flowInfo && formData.append("flow", JSON.stringify(flow));
        documentType && formData.append("document_type", documentType);
        archivedDocuments && formData.append("archived_documents", JSON.stringify(archivedDocuments));
        tagsValue && formData.append("tags_value", JSON.stringify(tagsValue));
        DepartmentDestination && formData.append("department_destination", JSON.stringify(DepartmentDestination));
        is_personal && formData.append("is_personal", is_personal);
        is_department && formData.append("is_department", is_department);
        transfer_ticket && formData.append("transfer_ticket",  JSON.stringify(transfer_ticket));

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/insert",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            },
        });
    };

    obj.resubmit = function (
        id,
        title,
        files,
        relatedFiles,
        preserveRelatedFiles,
        tagsValue,
        comment
    ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }
        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }

        formData.append("id", id);
        formData.append("title", title);
        formData.append("preserve_relatedfile", JSON.stringify(preserveRelatedFiles));
        formData.append("tags_value", JSON.stringify(tagsValue));
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/resubmit",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            },
        });
    };

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileTemplateInfo = function(name){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/loadfiletemplateinfo",
            method: "POST",
            data: JSON.stringify({name}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/approval",
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
            url: BackendDomain + "/office/workflow_play/reject",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    
    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/delete",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadUsersByDepartment = function(request){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_for_pick_user_directive",
            method: "POST",
            data: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadAllUser = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load",
            method: "POST",
            data: JSON.stringify({ isactive: true, offset: 0, top: 0, sort: {} }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDirectories = function (master_key) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({master_key, top: 999, offset: 0}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartmentDetails = function(id){
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

    obj.loadEmployeeDetail = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/loaddetails",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadArchivedDocumentByCode = function (code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadArchivedDocument",
            method: "POST",
            data: JSON.stringify({ code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_Dispatch_Arrived_Details = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/loaddetails",
            method: "POST",
            data: JSON.stringify({id, code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_do_wfp = function (
        workflow_id,
        workflow_code,
        parents,
        release_date,
        do_code,
        symbol_number,
        type,
        date_sign,
        department_execute,
        person_sign,
        excerpt,
        expiration_date,
        security_level,
        priority,
        view_only_departments,
        document_tag,
        self_end,
        outgoing_file,
        attachments,
        number
    ) {
            var formData = new FormData();
            
            if (outgoing_file) {
                outgoing_file.forEach(function(file) {
                    formData.append('outgoing_file', file.file, file.name);
                });
            }

            if (attachments) {
                attachments.forEach(function(file) {
                    formData.append('attachments', file.file, file.name);
                });
            }

            formData.append('workflow_id', workflow_id); // id work flow play
            formData.append('workflow_code', workflow_code); // code work flow play
            formData.append('parents', JSON.stringify(parents)); // parents
            formData.append('year', release_date);
            formData.append('code', do_code);
            formData.append('symbol_number', symbol_number);
            formData.append('number', number);
            formData.append('type', type);
            formData.append('date_sign', date_sign); // Ngày ký
            formData.append('departmemt_write', department_execute);
            formData.append('person_sign', person_sign); // person_sign
            formData.append('content', excerpt);
            formData.append('expire_date', expiration_date); // Thời hạn
            formData.append('security_level', security_level); // Độ mật
            formData.append('urgency_level', priority); // Độ khẩn
            formData.append('other_destination', JSON.stringify(view_only_departments)); // Phòng bạn nhận biết
            
            // formData.append('text_tags', document_tag);
            // formData.append('self_end', self_end);

            // for (const [key, value] of formData.entries()) {
            //     console.log(`Form ${key}:`, value);
            // }

            return fRoot.requestHTTP({
                url: BackendDomain + "/office/outgoing_dispatch/insert_waiting_archive",
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            });
    }

    obj.return_creator_additional_document = function(id, waiting_archive_id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/return_creator_additional_document",
            method: "POST",
            data: JSON.stringify({id, waiting_archive_id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_additional_document = function(id, waiting_archive_id, files, note){
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }
        formData.append("id", id);
        formData.append("note", note);
        formData.append("waiting_archive_id", waiting_archive_id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/creator_additional_document",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }
    
    return obj;
}]);
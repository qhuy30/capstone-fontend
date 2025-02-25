
myApp.registerFtr('sign_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetails = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loaddetails",
            method: "POST",
            data: JSON.stringify({ id, code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfoTask = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
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
            url: BackendDomain + "/office/workflow_play/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.approval = function(id,comment,note,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);
        formData.append("note", note);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/approval",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.signOther = function(id,comment,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/signOther",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.reject = function(id,comment,note,relatedFiles){

        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);
        formData.append("note", note);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/reject",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.return = function(id,comment,note,relatedFiles){

        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);
        formData.append("note", note);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/return",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.pushAttachment = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/pushattachment",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeAttachment = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/removeattachment",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushRelatedFile = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/pushrelatedfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeRelatedFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/removerelatedfile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.signAFile = function (workflowPlayId, fileName) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/workflow_play/${workflowPlayId}/sign`,
            method: "POST",
            data: JSON.stringify({ fileName }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_number = function (odb_book) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/get_number",
            method: "POST",
            data: JSON.stringify({ odb_book}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_odb_detail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadDetail",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.transformSignOther = function (id, receiver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/transformSignOther",
            method: "POST",
            data: JSON.stringify({ id, receiver}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertODB = function (
        outgoing_dispatch_book,
        workflow_play_id,
        document_date,
        outgoing_documents,
        attach_documents,
        excerpt,
        signers,
        draft_department,
        receiver_notification,
        department_notification,
        document_quantity,
        transfer_date,
        note,
        expiration_date,
        priority,
        outgoing_dispatch_id,
        old_outgoing_documents,
        old_attach_documents,
        parents,
        parent,
        code,
        number
    ) {
        var formData = new FormData();
        for (var i in outgoing_documents) {
            formData.append("outgoing_documents", outgoing_documents[i].file, outgoing_documents[i].name);
        }
        for (var i in attach_documents) {
            formData.append("attach_documents", attach_documents[i].file, attach_documents[i].name);
        }
        if(parents){
            formData.append('parents', JSON.stringify(parents));   
        }

        if(parent){
            formData.append('parent', JSON.stringify(parent));   
        }
        formData.append('outgoing_dispatch_book', outgoing_dispatch_book);
        formData.append('workflow_play_id', workflow_play_id);
        formData.append('document_date', document_date);
        formData.append('excerpt', excerpt);
        formData.append('signers', JSON.stringify(signers));
        formData.append('draft_department', draft_department);
        formData.append('receiver_notification', JSON.stringify(receiver_notification));
        formData.append('department_notification', JSON.stringify(department_notification));
        formData.append('document_quantity', document_quantity);
        formData.append('transfer_date', transfer_date);
        formData.append('note', note);
        formData.append('expire_date', expiration_date);
        formData.append('priority', priority);
        formData.append('outgoing_dispatch_id', outgoing_dispatch_id);
        formData.append('old_outgoing_documents', JSON.stringify(old_outgoing_documents));
        formData.append('old_attach_documents', JSON.stringify(old_attach_documents));
        formData.append('code', code);
        formData.append('number', number);
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/workflow_play/process",
          method: "POST",
          data: formData,
          headers: {
            'Content-Type':  undefined
          },
        });
    };

    obj.updateODB = function (
        id,
        odb_book,
        signed_date,
        type,
        excerpt,
        expiration_date,
        priority
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'origin',
              odb_book,
              signed_date,
              type,
              excerpt,
              expiration_date,
              priority
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.updateReferencesODB = function (
        id,
        references
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update-references",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'origin',
              references
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.updateReleaseInfo = function (
        id,
        notification_departments,
        notification_recipients
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'transfer',
              notification_departments,
              notification_recipients
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.releaseODB = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/release",
            method: "POST",
            data: JSON.stringify({ id }),
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

    obj.insertToStorage = function (
        title,
        organ_id,
        file_notation,
        language,
        rights,
        year,
        description,
        maintenance_time,
        reference
      ) {
        var dataInsert = JSON.stringify({
            title,
            organ_id,
          file_notation,
            language,
            rights,
            year,
            description,
            maintenance_time,
            reference
        })
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/briefcase/insert",
          method: "POST",
          data: dataInsert,
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          },
        });
      };

    obj.complete = function (id, comment, relatedFiles) {
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/complete",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }


    obj.receiver = function(id,comment,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/receiver",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.loadDepartmentDetails = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.getDerectoryDetails = function(type,id,master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type,id,master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.searchReference = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/search-reference",
            method: "POST",
            data: JSON.stringify({search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

myApp.registerFtr('task_service', ['fRoot', '$filter', '$rootScope', function (fRoot, $filter, $rootScope) {
    var obj = {};
   
    obj.insert = function (
      files,
      title,
      to_department,
      content,
      task_list,
      main_person,
      participant,
      observer,
      from_date,
      to_date,
      has_time,
      hours,
      priority,
      task_type,
      head_task_id,
      parent_id,
      project,
      currentDepartment,
      dispatch_arrived_id,
      level,
      label,
      is_draft,
      parents,
      parent,
      source_id,
      has_repetitive,
      per,
      cycle,
      has_expired,
      expired_date,
      child_work_percent,
    ) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      for (var i in task_list) {
        delete task_list[i].$$hashKey;
      }

      if ((!has_repetitive, !per, !cycle, !has_expired, !expired_date)) {
        has_repetitive = false;
        per = 0;
        cycle = "";
        has_expired = false;
        expired_date = 0;
      }

      project && formData.append("project", project);
      parent_id && formData.append("parent_id", parent_id);
      parents && formData.append("parents", JSON.stringify(parents));
      parent && formData.append("parent", JSON.stringify(parent));
      source_id && formData.append("source_id", JSON.stringify(source_id));
      title && formData.append("title", title);
      to_department && formData.append("to_department", to_department);
      content && formData.append("content", content);
      has_time && formData.append("has_time", has_time);
      hours && formData.append("hours", hours);
      task_list && formData.append("task_list", JSON.stringify(task_list));
      main_person &&
        formData.append("main_person", JSON.stringify(main_person));
      participant &&
        formData.append("participant", JSON.stringify(participant));
      observer && formData.append("observer", JSON.stringify(observer));
      from_date && formData.append("from_date", from_date);
      to_date && formData.append("to_date", to_date);
      priority && formData.append("priority", priority);
      task_type && formData.append("task_type", task_type);
      head_task_id && formData.append("head_task_id", head_task_id);
      currentDepartment && formData.append("department", currentDepartment);
      dispatch_arrived_id &&
        formData.append("dispatch_arrived_id", dispatch_arrived_id);
      level && formData.append("level", level);
      JSON && formData.append("label", JSON.stringify(label));
      is_draft && formData.append("is_draft", is_draft);
      has_repetitive && formData.append("has_repetitive", has_repetitive);
      per && formData.append("per", per);
      cycle && formData.append("cycle", cycle);
      has_expired && formData.append("has_expired", has_expired);
      expired_date && formData.append("expired_date", expired_date);
      child_work_percent &&
        formData.append("child_work_percent", child_work_percent);
     

      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/insert",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };
    obj.loadDetails = function (id, code, currentDepartment) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/loaddetails",
          method: "POST",
          data: JSON.stringify({ id, code, department: currentDepartment }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
      };
   

    return obj;
}]);

myApp.registerFtr('workflow_play_service', ['fRoot', '$filter', '$rootScope', function (fRoot, $filter, $rootScope) {
    var obj = {};
   
    obj.update = function (
        id,
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
        userAndDepartmentDestination,
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

        id && formData.append('id', id);   
        parents && formData.append('parents', JSON.stringify(parents));   
        parent && formData.append('parent', JSON.stringify(parent));   
        title && formData.append("title", title);
        flowInfo && formData.append("flow_info", JSON.stringify(flowInfo));
        flowInfo && formData.append("flow", JSON.stringify(flow));
        documentType && formData.append("document_type", documentType);
        archivedDocuments && formData.append("archived_documents", JSON.stringify(archivedDocuments));
        tagsValue && formData.append("tags_value", JSON.stringify(tagsValue));
        userAndDepartmentDestination && formData.append("user_and_department_destination", JSON.stringify(userAndDepartmentDestination));
        is_personal && formData.append("is_personal", is_personal);
        is_department && formData.append("is_department", is_department);
        transfer_ticket && formData.append("transfer_ticket",  JSON.stringify(transfer_ticket));

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/update",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            },
        });
    };

    obj.insert_do_wfp = function (
        workflow_id,
        workflow_code,
        parents,
        release_date,
        do_code,
        symbol_number,
        type,
        date_sign,
        department_write,
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
        number,
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
            formData.append('departmemt_write', department_write);
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



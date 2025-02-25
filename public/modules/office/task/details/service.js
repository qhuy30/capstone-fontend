myApp.registerFtr("task_details_service", [
  "fRoot",
  function (fRoot) {
    var obj = {};

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

    obj.load_receive_task = function(code){
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/load_receive_task",
          method: "POST",
          data: JSON.stringify({ code }),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
    }

    obj.loadLabel_details = function (ids) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load-multiple",
            method: "POST",
            data: JSON.stringify({ ids }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.loadFileInfoWFP = function(id,filename){
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

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.uploadImage = function (formData) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/uploadimage",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.start = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/start",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.done = function (id, code, content, files, worktimes, subAttachment) {
      var formData = new FormData();
      formData.append("id", id);
      formData.append("code", code);
      formData.append("content", content);

      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }

      formData.append("worktimes", worktimes);
      
      formData.append("subAttachment", JSON.stringify(subAttachment));

      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/done",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.complete = function (id, code, content, files) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      formData.append("id", id);
      formData.append("code", code);
      formData.append("content", content);
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/complete",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.refune = function (id, code, content, files, progress) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      formData.append("id", id);
      formData.append("code", code);
      formData.append("content", content);
      formData.append("progress", progress);
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/refune",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };
    
    obj.update_task_list_status = function(id,task_list_id,value){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/update_task_list_status",
            method: "POST",
            data: JSON.stringify({id,task_list_id,value}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_task_list = function(id,task_list){
        for(var i in task_list){
            delete task_list[i].$$hashKey;
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/update_task_list",
            method: "POST",
            data: JSON.stringify({id,task_list}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadProjectById = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_project_by_id",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.comment = function(id,content,files, type, code){
        var formData =  new FormData();
        for (var i in files){
            formData.append('file',files[i].file,files[i].name);
        }

        formData.append('id',id);
        formData.append('content',content);
        formData.append('type',type);
        formData.append('challenge_id','');
        formData.append('code', code)
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/comment",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.updateComment = function(task_id,comment_id,content,files, type){
      var formData = new FormData();
      for (var i in files){
          formData.append('file',files[i].file,files[i].name);
      }

      formData.append('task_id',task_id);
      formData.append('comment_id',comment_id);
      formData.append('content',content);
      formData.append('type',type);
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/update_comment",
          method: "POST",
          data: formData,
          headers: {
              'Content-Type': undefined
          }
      });
    }

    obj.add_proof = function (id, code, content, files) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }

      formData.append("id", id);
      formData.append("code", code);
      formData.append("content", content);
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/addproof",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.remove_proof = function (id, proofId) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/removeproof",
        method: "POST",
        data: JSON.stringify({ id, proofId }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.update_progress = function (id, progress) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/update_progress",
        method: "POST",
        data: JSON.stringify({ id, progress }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete_task_receiver = function (id) {
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/delete_task_receiver",
          method: "POST",
          data: JSON.stringify({ id }),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
  }

    obj.pushFile = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/pushfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile = function (id, filename) {
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/removefile",
          method: "POST",
          data: JSON.stringify({ id, filename }),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
    }
  
    obj.update = function (estimate, id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, priority, task_type, workflowPlay_id, label, dispatch_arrived_id, department, has_repetitive, per, cycle, has_expired, expired_date, action_access) {
      for (var i in task_list) {
          delete task_list[i].$$hashKey;
      }

      var data = { estimate, id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, priority, task_type, workflowPlay_id, label, dispatch_arrived_id, department, has_repetitive };

      if (has_repetitive) {
          data.per = per;
          data.cycle = cycle;
          data.has_expired = has_expired;
          data.expired_date = expired_date;
      }
      if (action_access) {
          data.action_access = action_access;
      }

      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/update",
          method: "POST",
          data: JSON.stringify(data),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
  }

    obj.taskPriorityTransform = function (search) {
      const priorityList = [
        { key: 1, value: "Critical" },
        { key: 2, value: "High" },
        { key: 3, value: "Medium" },
        { key: 4, value: "Low" },
      ];
      return priorityList.find(
        (item) => item.key === search || item.value === search
      );
    };

    obj.taskTypeTransform = function (search) {
      const taskTypeList = [
        { key: 1, value: "Task" },
        { key: 2, value: "WorkflowPlay" },
        { key: 3, value: "Notification" },
      ];
      return (
        taskTypeList.find(
          (item) => item.key === search || item.value === search
        ) || taskTypeList[0]
      );
    };

    obj.transfer_ticket_preview = function (
      department_assign_id,
      transfer_ticket_values,
      department
    ) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/transfer_ticket_preview",
        method: "POST",
        data: JSON.stringify({
          department_assign_id,
          transfer_ticket_values,
          department
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.signAFile = function (transferTicket_id) {
      return fRoot.requestHTTP({
        url: BackendDomain + `/office/task/${transferTicket_id}/sign`,
        method: "POST",
        data: {},
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.loadEmployeeDetail = function (id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/human/employee/loaddetails",
        method: "POST",
        data: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

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
      title_transferTicket,
      decree,
      proposal_text,
      transferTicket_content,
      head_task_id,
      parent_id,
      project,
      parents,
      parent
    ) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      if (parent_id) {
        formData.append("parent_id", parent_id);
      }
      if (project) {
        formData.append("project", project);
      }
      for (var i in task_list) {
        delete task_list[i].$$hashKey;
      }

      if (parents) {
        formData.append("parents", JSON.stringify(parents));
      }

      if (parent) {
        formData.append("parent", JSON.stringify(parent));
      }
      formData.append("title", title);
      formData.append("to_department", to_department)
      formData.append("content", content);
      formData.append("has_time", has_time);
      formData.append("hours", hours);
      formData.append("task_list", JSON.stringify(task_list));
      formData.append("main_person", JSON.stringify(main_person));
      formData.append("participant", JSON.stringify(participant));
      formData.append("observer", JSON.stringify(observer));
      formData.append("from_date", from_date);
      formData.append("to_date", to_date);
      formData.append("priority", priority);
      formData.append("task_type", task_type);
      formData.append("title_transferTicket", title_transferTicket);
      formData.append("decree", decree);
      formData.append("proposal_text", proposal_text);
      formData.append("transferTicket_content", transferTicket_content);
      formData.append("head_task_id", head_task_id);
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/insert",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.cancel = function (id, comment) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/cancel",
        method: "POST",
        data: JSON.stringify({ id, comment }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.insert_transfer_ticket = function (
      files,
      title,
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
      transfer_ticket_values,
      department_assign_id,
      department,
      head_task_id,
      parent_id,
      project,
      parents,
      parent,
      source_id
    ) {

      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      if (parent_id) {
        formData.append("parent_id", parent_id);
      }
      if (project) {
        formData.append("project", project);
      }
      for (var i in task_list) {
        delete task_list[i].$$hashKey;
      }

      if (parents) {
        formData.append("parents", JSON.stringify(parents));
      }

      if (parent) {
        formData.append("parent", JSON.stringify(parent));
      }

      if (source_id) {
        formData.append("source_id", source_id);
      }

      formData.append("title", title);
      formData.append("content", content);
      formData.append("has_time", has_time);
      formData.append("hours", hours);
      formData.append("task_list", JSON.stringify(task_list));
      formData.append("main_person", JSON.stringify(main_person));
      formData.append("participant", JSON.stringify(participant));
      formData.append("observer", JSON.stringify(observer));
      formData.append("from_date", from_date);
      formData.append("to_date", to_date);
      formData.append("priority", priority);
      formData.append("task_type", task_type);
      formData.append(
        "transfer_ticket_values",
        JSON.stringify(transfer_ticket_values)
      );

      formData.append("department_assign_id", department_assign_id);
      formData.append("department", department);
      formData.append("head_task_id", head_task_id);
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/insert_transfer_ticket",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.link_workflow_play = function (id, workflowPlay_id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/link_workflow_play",
        method: "POST",
        data: JSON.stringify({ id, workflowPlay_id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

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

    obj.insert_transferTicketTask = function({
      title,
      priority,
      to_date,
      from_date,
      files,
      to_department,
      parent_code,
      parent,
      label,
      level,
      source_id,
      content,
      estimate
    }){
      const formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }

      formData.append("title", title);
      formData.append("priority", priority);
      formData.append("to_date", to_date);
      formData.append("from_date", from_date);
      formData.append("to_department", to_department);
      formData.append("parent_code", parent_code);
      formData.append("parent", JSON.stringify(parent));
      formData.append("content", content);
      formData.append("level", level);
      formData.append("source_id", source_id);
      formData.append("estimate", estimate);
      formData.append("label", JSON.stringify(label));
      
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/task/insert_transferTicketTask",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": undefined,
          },
      });
    }

    return obj;
  },
]);

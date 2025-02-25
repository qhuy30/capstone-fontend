
myApp.registerFtr('da_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetails = function (id, code) {
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

    obj.loadDepartment = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_department",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfor = function (id, filename) {
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

    obj.loadEmployee = function(department){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_employee",
            method: "POST",
            data: JSON.stringify({ department}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_task = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_department",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEmployee_task = function(department){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_employee",
            method: "POST",
            data: JSON.stringify({ department}),
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
            url: BackendDomain + "/office/dispatch_arrived/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.handling = function(id,comment,forward){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/handling",
            method: "POST",
            data: JSON.stringify({id,comment,forward}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_task = function(id,title,content,main_person,participant,observer,from_date,to_date,priority){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/insert_task",
            method: "POST",
            data: JSON.stringify({id,title,content,main_person,participant,observer,from_date,to_date,priority}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.taskPriorityTransform = function (search) {
        const priorityList = [
            {key: 1, value: 'Critical'},
            {key: 2, value: 'High'},
            {key: 3, value: 'Medium'},
            {key: 4, value: 'Low'}
        ];
        return priorityList.find(item => item.key === search || item.value === search);
    }

    obj.updateTask = function (id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, hours, priority) {
        for (var i in task_list) {
            delete task_list[i].$$hashKey;
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/update",
            method: "POST",
            data: JSON.stringify({ id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, hours, priority }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

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

    obj.signAcknowledge = function (id, note, with_task) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/sign_acknowledge",
            method: "POST",
            data: JSON.stringify({ id, note, with_task }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.processFormData = function (data, url) {
        var formData = new FormData();
    
        // Xử lý attachments
        if (data.attachments && data.attachments.length > 0) {
            data.attachments = data.attachments.filter(attachment => !attachment.id);
            data.attachments.forEach(file => {
                formData.append('attachments', file.file, file.name);
            });
        }
    
        // Xử lý incoming_file
        if (data.incoming_file && data.incoming_file.length > 0) {
            data.incoming_file = data.incoming_file.filter(file => !file.id);
            data.incoming_file.forEach(file => {
                formData.append('incoming_file', file.file, file.name);
            });
        }
    
        // Thêm các trường cơ bản
        const fields = [
            'id', 'year', 'code', 'incoming_number', 'incomming_date',
            'symbol_number', 'sending_place', 'type', 'field', 'security_level',
            'urgency_level', 'date_sign', 'expried', 'content', 'note', 'department_execute'
        ];
    
        fields.forEach(field => {
            if (data[field] !== undefined) {
                formData.append(field, data[field]);
            }
        });
    
        // Xử lý department_receiver
        if (data.department_receiver && data.department_receiver.length > 0) {
            formData.append('department_receiver', JSON.stringify(data.department_receiver));
        }

        // Xử lý department_receiver
        if (data.task_label) {
            formData.append('task_label', JSON.stringify(data.task_label));
        }
    
        // Xử lý incoming_file_remove và attachments_remove
        ['incoming_file_remove', 'attachments_remove'].forEach(field => {
            if (data[field] && data[field].length > 0) {
                formData.append(field, JSON.stringify(data[field]));
            }
        });
    
        return fRoot.requestHTTP({
            url: BackendDomain + url,
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };
    
    // Sử dụng chung cho các hành động
    obj.forward_CVP = function (data) {
        return obj.processFormData(data, '/office/dispatch_arrived/send_lead_department');
    };
    
    obj.forward_BGHOpinion = function (data) {
        return obj.processFormData(data, '/office/dispatch_arrived/send_lead_external');
    };
    
    obj.forwar_unit = function (data) {
        return obj.processFormData(data, '/office/dispatch_arrived/transfer_department');
    };
    
    obj.return_CVP = function (data) {
        return obj.processFormData(data, '/office/dispatch_arrived/return_lead_department');
    };

    obj.update = function(data){
        var formData = new FormData();

        if (data.attachments && data.attachments.length > 0) {
            data.attachments = data.attachments.filter(attachment => !attachment.id);
            data. attachments.forEach(function(file) {
                formData.append('attachments', file.file, file.name);
            });
        }

        if (data.incoming_file && data.incoming_file.length > 0) {
            data.incoming_file = data.incoming_file.filter(incoming_file => !incoming_file.id);
            data.incoming_file.forEach(function(file) {
                formData.append('incoming_file', file.file, file.name);
            });    
        }

        // id 
        formData.append('id', data.id);
        // Năm 
        formData.append('year', data.year);
        // Số văn bản
        formData.append('code', data.code);
        // Số đến
        formData.append('incoming_number', data.incoming_number);
        // Ngày đến
        formData.append('incomming_date', data.incomming_date);
        // Số ký hiệu
        formData.append('symbol_number', data.symbol_number);
        // Cơ quan ban hành
        formData.append('sending_place', data.sending_place);
        // Loại văn bản
        formData.append('type', data.type);
        // Lĩnh vực
        formData.append('field', data.field);
        // Độ mật
        formData.append('security_level', data.security_level);
        // Độ khẩn
        formData.append('urgency_level', data.urgency_level);
        // Ngày ký 
        formData.append('date_sign', data.date_sign);
        //Thời hạn
        formData.append('expried', data.expried);
        // Nội dung
        formData.append('content', data.content);
        // Phòng ban thực thi

        if(data.department_execute){
            formData.append('department_execute', data.department_execute);
        }

        if(data.department_receiver && data.department_receiver.length > 0){
            formData.append('department_receiver', JSON.stringify(data.department_receiver));
        }

        if (data.task_label) {
            formData.append('task_label', JSON.stringify(data.task_label));
        }

        if (data.incoming_file_remove && data.incoming_file_remove.length > 0) {
            formData.append('incoming_file_remove', JSON.stringify(data.incoming_file_remove));
        }
        
        if (data.attachments_remove && data.attachments_remove.length > 0) {
            formData.append('attachments_remove', JSON.stringify(data.attachments_remove));
        }
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/dispatch_arrived/update',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    }

    obj.transfer_department_approve = function(id,note){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/transfer_department_approve",
            method: "POST",
            data: JSON.stringify({id,note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.seen_work = function(id,note){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/seen_work",
            method: "POST",
            data: JSON.stringify({id,note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_detail_incomming_dispatchBook = function(value){
        const filter = [{ value: { "$eq": value } }]
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({ filter, top: 0, offset: 0, master_key:"incomming_dispatch_book" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_label = function (department = "", search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load",
            method: "POST",
            data: JSON.stringify({ department, search, top, offset, sort, isLarge:true, isExternal: true }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
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

    return obj;
}]);

myApp.registerFtr('odb_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetail = function (id, code) {
        
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadDetail",
            method: "POST",
            data: JSON.stringify({id, code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
myApp.registerFtr('dispatch_arrived_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,da_book,priority,receive_method,type,checks,scope,top,offset,sort,date_start,date_end,year){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load",
            method: "POST",
            data: JSON.stringify({ search,incoming_number:da_book,urgency_level:priority,receive_method,type,checks,scope,top,offset,sort,date_start,date_end,year}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,da_book,priority,receive_method,type,checks,scope) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/count",
            method: "POST",
            data: JSON.stringify({ search,incoming_number:da_book,urgency_level:priority,receive_method,type,checks,scope}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_number = function (da_book) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/get_number",
            method: "POST",
            data: JSON.stringify({da_book}),
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

    obj.load_label = function (search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort }),
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

    obj.insert_label = function (title, parent_label, is_has_department, departments) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/insert",
            method: "POST",
            data: JSON.stringify({ title, parent_label, is_has_department, departments }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.update_label = function (id, title, parent_label, is_has_department, departments) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/update",
            method: "POST",
            data: JSON.stringify({ id, title, parent_label, is_has_department, departments }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.insert = function (scope, release_date, da_code, incoming_number, incomming_date, symbol_number, sending_place, type, field, security_level, priority, content, date_sign, expried, department_execute, view_only_departments, incoming_file, attachment_files, is_legal, is_assign_task, task_label) {
        var formData = new FormData();

        if (attachment_files) {
            attachment_files.forEach(function(file) {
                formData.append('attachments', file.file, file.name);
            });
        }

        if (incoming_file) {
            incoming_file.forEach(function(file) {
                formData.append('incoming_file', file.file, file.name);
            });
        }

        // Scope 
        formData.append('scope', scope);
        // Năm 
        formData.append('year', release_date);
        // Số văn bản
        formData.append('code', da_code);
        // Số đến
        formData.append('incoming_number', incoming_number);
        // Ngày đến
        formData.append('incomming_date', incomming_date);
        // Số ký hiệu
        formData.append('symbol_number', symbol_number);
        // Cơ quan ban hành
        formData.append('sending_place', sending_place);
        // Loại văn bản
        formData.append('type', type);
        // Lĩnh vực
        formData.append('field', field);
        // Độ mật
        formData.append('security_level', security_level);
        // Độ khẩn
        formData.append('urgency_level', priority);
        // Ngày ký 
        formData.append('date_sign', date_sign);

        //Thời hạn
        formData.append('expried', expried);
        // Nội dung
        formData.append('content', content);

        if(Array.isArray(task_label)){
            formData.append('task_label', JSON.stringify(task_label));
        }

        // // Phòng ban thực thi
        // formData.append('department_execute', department_execute);
        // // Phòng ban nhận để biết 
        // formData.append('department_receiver', JSON.stringify(view_only_departments));
        
        // formData.append('is_legal', is_legal);
        // formData.append('is_assign_task', is_assign_task);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/dispatch_arrived/insert',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
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

        if(data.department_receiver){
            formData.append('department_receiver', JSON.stringify(data.department_receiver));
        }

        if (data.incoming_file_remove && data.incoming_file_remove.length > 0) {
            formData.append('incoming_file_remove', JSON.stringify(data.incoming_file_remove));
        }
        
        if (data.attachments_remove && data.attachments_remove.length > 0) {
            formData.append('attachments_remove', JSON.stringify(data.attachments_remove));
        }

        if(data.task_label){
            formData.append('task_label', JSON.stringify(data.task_label));
        }

        
        // formData.append('is_legal', is_legal);
        // formData.append('is_assign_task', is_assign_task);
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/dispatch_arrived/update',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
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

    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.receive = function(id, odb_id, note, code, incoming_number, field){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/receive",
            method: "POST",
            data: JSON.stringify({ id, odb_id, note, code, incoming_number, field }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.forward = function (id, to, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/forward",
            method: "POST",
            data: JSON.stringify({ id, to, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.response = function (id, type, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/response",
            method: "POST",
            data: JSON.stringify({ id, type, note }),
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
            url: BackendDomain + "/office/dispatch_arrived/pushfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/removefile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
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

myApp.registerFtr('dispatch_outgoing_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,od_book,priority,receive_method,type,checks,tab,top,offset,sort,date_start,date_end,year){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/load",
            method: "POST",
            data: JSON.stringify({ search,symbol_number:od_book,urgency_level:priority,receive_method,type,checks,tab,top,offset,sort,date_start,date_end,year}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,od_book,priority,receive_method,type,checks,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/count",
            method: "POST",
            data: JSON.stringify({ search,symbol_number:od_book,urgency_level:priority,receive_method,type,checks,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function (
        release_date,
        do_code,
        symbol_number,
        type,
        signing_date,
        department_execute,
        person_sign,
        excerpt,
        date_sign,
        security_level,
        priority,
        view_only_departments,
        document_tag,
        self_end,
        outgoing_file,
        attachments
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

            formData.append('year', release_date);
            formData.append('code', do_code);
            formData.append('symbol_number', symbol_number);
            formData.append('type', type);
            formData.append('date_sign', signing_date); // Ngày ký
            formData.append('departmemt_write', department_execute);
            formData.append('person_sign', person_sign); // person_sign
            formData.append('content', excerpt);
            formData.append('expire_date', date_sign); // Thời hạn
            formData.append('security_level', security_level); // Độ mật
            formData.append('urgency_level', priority); // Độ khẩn
            formData.append('other_destination', JSON.stringify(view_only_departments));
            // formData.append('text_tags', document_tag);
            // formData.append('self_end', self_end);

            // for (const [key, value] of formData.entries()) {
            //     console.log(`Form ${key}:`, value);
            // }

            return fRoot.requestHTTP({
                url: BackendDomain + "/office/outgoing_dispatch/insert",
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (
        id,
        year, 
        code,
        symbol_number,
        type,
        date_sign,
        departmemt_write,
        person_sign,
        content,
        expire_date,
        security_level, 
        urgency_level,
        other_destination,
        text_tags,
        self_end,
        outgoing_file,
        attachments,
        outgoing_file_remove,
        attachments_remove
    ) {
        var formData = new FormData();

        if (attachments && attachments.length > 0) {
            attachments = attachments.filter(attachment => !attachment.id);
            attachments.forEach(function(file) {
                formData.append('attachments', file.file, file.name);
            });
        }

        if (outgoing_file && outgoing_file.length > 0) {
            outgoing_file = outgoing_file.filter(outgoing_file => !outgoing_file.id);
            outgoing_file.forEach(function(file) {
                formData.append('outgoing_file', file.file, file.name);
            });    
        }

        formData.append('id', id);
        formData.append('year', year);
        formData.append('code', code);
        formData.append('symbol_number', symbol_number);
        formData.append('type', type);
        formData.append('date_sign', date_sign); // Ngày ký
        formData.append('departmemt_write', departmemt_write);
        formData.append('person_sign', person_sign); // person_sign
        formData.append('content', content);
        formData.append('expire_date', expire_date); // Thời hạn
        formData.append('security_level', security_level); // Độ mật
        formData.append('urgency_level', urgency_level); // Độ khẩn
        formData.append('other_destination', JSON.stringify(other_destination));
        // formData.append('text_tags', text_tags);
        // formData.append('self_end', self_end);
        
        if (outgoing_file_remove.length > 0) {
            formData.append('outgoing_file_remove', JSON.stringify(outgoing_file_remove));
        }
        
        if (attachments_remove.length > 0) {
            formData.append('attachments_remove', JSON.stringify(attachments_remove));
        }
        
        // for (const [key, value] of formData.entries()) {
        //     console.log(`Form ${key}:`, value);
        // }

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/update",
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.archive_dispatch_outgoing = function(data){
        var formData = new FormData();

        if (data.attachments && data.attachments.length > 0) {
            data.attachments = data.attachments.filter(attachment => !attachment.id);
            data.attachments.forEach(function(file) {
                formData.append('attachments', file.file, file.name);
            });
        }

        if (data.outgoing_file && data.outgoing_file.length > 0) {
            data.outgoing_file = data.outgoing_file.filter(outgoing_file => !outgoing_file.id);
            data.outgoing_file.forEach(function(file) {
                formData.append('outgoing_file', file.file, file.name);
            });    
        }

        formData.append('id', data.id);
        formData.append('year', data.year);
        formData.append('code', data.code);
        formData.append('symbol_number', data.symbol_number);
        formData.append('type', data.type);
        formData.append('date_sign', data.date_sign); // Ngày ký
        formData.append('departmemt_write', data.departmemt_write);
        formData.append('person_sign', data.person_sign); // person_sign
        formData.append('content', data.content);
        formData.append('expire_date', data.expire_date); // Thời hạn
        formData.append('security_level', data.security_level); // Độ mật
        formData.append('urgency_level', data.urgency_level); // Độ khẩn
        formData.append('other_destination', JSON.stringify(data.other_destination));
        // formData.append('text_tags', text_tags);
        // formData.append('self_end', self_end);
        
        if (data.outgoing_file_remove && data.outgoing_file_remove.length > 0) {
            formData.append('outgoing_file_remove', JSON.stringify(data.outgoing_file_remove));
        }
        
        if (data.attachments_remove && data.attachments_remove.length > 0) {
            formData.append('attachments_remove', JSON.stringify(data.attachments_remove));
        }
        // Note
        formData.append('note', data.note);
        
        // formData.append('is_legal', is_legal);
        // formData.append('is_assign_task', is_assign_task);
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/outgoing_dispatch/archive',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    }


    return obj;
}]);
myApp.registerFtr('meeting_room_service', ['fRoot', function (fRoot) {

    var obj = {};

    obj.loadDetails_MasterDirectory = function(key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/master_directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.getOrderNumber = function(master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/get_ordernumber",
            method: "POST",
            data: JSON.stringify({ master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.insert = function(ordernumber, title, value, item, isactive, master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/insert",
            method: "POST",
            data: JSON.stringify({ ordernumber, title, value, item, isactive, master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(id, ordernumber, title, value, item, isactive){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/update",
            method: "POST",
            data: JSON.stringify({ id, ordernumber, title, value, item, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_schedule = function (search,tab,checks,room_types,top,offset,sort, services_required = null, date_start = null, date_end = null) {    
        const data = { search, tab, checks, top, offset, sort, room_types };
        if(date_start && date_end){
            data.date_start = date_start;
            data.date_end = date_end;
        }

        if (services_required) {
            data.services_required = services_required;
        }
        
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_schedule = function (search,tab,checks) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/count",
            method: "POST",
            data: JSON.stringify({ search,tab,checks }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_room = function(filter, search, master_key, top, offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ filter, search, master_key, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_room = function(filter, search, master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/count",
            method: "POST",
            data: JSON.stringify({ filter, search, master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetailForUpdate = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_detail_for_update",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_register = function (dataUpdate) {
        var formData = new FormData();
        // for (var i in dataUpdate.file) {
        //     formData.append('file', dataUpdate.file[i].file, dataUpdate.file[i].name);
        // }
        
        // Xử lý attachments
        if (dataUpdate.attachments && dataUpdate.attachments.length > 0) {
            dataUpdate.attachments = dataUpdate.attachments.filter(attachment => !attachment.id);
            dataUpdate.attachments.forEach(file => {
                formData.append('file', file.file, file.name);
            });
        }
        
        formData.append('id', dataUpdate.id);
        formData.append('title', dataUpdate.title);
        formData.append('room', dataUpdate.room);
        formData.append('host_scope', dataUpdate.host_scope);
        formData.append('host_external', dataUpdate.host_external);
        formData.append('date_start', dataUpdate.date_start);
        formData.append('date_end', dataUpdate.date_end);
        formData.append('type', dataUpdate.type);
        formData.append('host', dataUpdate.host);
        formData.append('participants', JSON.stringify(dataUpdate.participants));
        formData.append('other_participants', JSON.stringify(dataUpdate.other_participants));
        formData.append('to_department', JSON.stringify(dataUpdate.to_department));
        formData.append('content', dataUpdate.content);
        formData.append('person', dataUpdate.person);
        formData.append('service_proposal', dataUpdate.service_proposal);
        formData.append('service_proposal_text', dataUpdate.service_proposal_text);
        formData.append('helpdesk', dataUpdate.helpdesk);
        formData.append('helpdesk_text', dataUpdate.helpdesk_text);
        formData.append('teabreak', dataUpdate.teabreak);
        formData.append('teabreak_text', dataUpdate.teabreak_text);
        formData.append('removeAtachments', JSON.stringify(dataUpdate.removeAtachments));
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/update_registered",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.delete_registration = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/delete_registered",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //Assess
    obj.approve_department = function (dataUpdate) {
        var formData = new FormData();
        // for (var i in dataUpdate.file) {
        //     formData.append('file', dataUpdate.file[i].file, dataUpdate.file[i].name);
        // }

        // Xử lý attachments
        if (dataUpdate.attachments && dataUpdate.attachments.length > 0) {
            dataUpdate.attachments = dataUpdate.attachments.filter(attachment => !attachment.id);
            dataUpdate.attachments.forEach(file => {
                formData.append('file', file.file, file.name);
            });
        }

        formData.append('id', dataUpdate.id);
        formData.append('title', dataUpdate.title);
        formData.append('room', dataUpdate.room);
        formData.append('host_scope', dataUpdate.host_scope);
        formData.append('host_external', dataUpdate.host_external);
        formData.append('date_start', dataUpdate.date_start);
        formData.append('date_end', dataUpdate.date_end);
        formData.append('type', dataUpdate.type);
        formData.append('host', dataUpdate.host);
        formData.append('participants', JSON.stringify(dataUpdate.participants));
        formData.append('other_participants', JSON.stringify(dataUpdate.other_participants));
        formData.append('to_department', JSON.stringify(dataUpdate.to_department));
        formData.append('content', dataUpdate.content);
        formData.append('person', dataUpdate.person);
        formData.append('service_proposal', dataUpdate.service_proposal);
        formData.append('service_proposal_text', dataUpdate.service_proposal_text);
        formData.append('helpdesk', dataUpdate.helpdesk);
        formData.append('helpdesk_text', dataUpdate.helpdesk_text);
        formData.append('teabreak', dataUpdate.teabreak);
        formData.append('teabreak_text', dataUpdate.teabreak_text);
        formData.append('removeAtachments', JSON.stringify(dataUpdate.removeAtachments));
        formData.append('note', dataUpdate.note);
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_department",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.reject_department = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_department",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_management = function (id, note, room) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_management",
            method: "POST",
            data: JSON.stringify({ id, note, room }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_management = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_management",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead = function (id, note, room) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_lead",
            method: "POST",
            data: JSON.stringify({ id, note, room }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_lead",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.request_cancel = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/request_cancel",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //recall
    obj.approve_recall_department= function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_department = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_department",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_management = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_management",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_management = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_management",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_lead = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_lead",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_lead = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_lead",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    //end recall

    //Add scheduled
    obj.load_department = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/load",
            method: "POST",
            data: JSON.stringify({ level:1 }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_host_register = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_host_meeting_room",
            method: "POST",
            data: JSON.stringify({
                offset:0,
                top:0,
                sort:{
                    title:1
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_room_register = function(filter){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({
                master_key:"meeting_room",
                top:0,
                offset:0,
                filter
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.register = function({
        title,
        date_start,
        date_end,
        type,
        host,
        participants,
        other_participants,
        to_department,
        content,
        person,
        teabreak,
        teabreak_text,
        helpdesk,
        helpdesk_text,
        service_proposal,
        service_proposal_text,
        files,
        room,
        host_scope,
        host_external
    }) {
        var formData = new FormData();
        formData.append('title', title);
        formData.append('room', room);
        formData.append('host_scope', host_scope);
        formData.append('host_external', host_external);
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        formData.append('type', type);
        formData.append('host', host);
        formData.append('participants', JSON.stringify(participants));
        formData.append('other_participants', JSON.stringify(other_participants));
        formData.append('to_department', JSON.stringify(to_department));
        formData.append('content', content);
        formData.append('person', person);

        formData.append('teabreak', teabreak);
        if(teabreak){
            formData.append('teabreak_text', teabreak_text);
        }

        formData.append('helpdesk',helpdesk);
        if(helpdesk){
            formData.append('helpdesk_text', helpdesk_text);
        }

        formData.append('service_proposal', service_proposal);
        if(service_proposal){
            formData.append('service_proposal_text', service_proposal_text);
        }

        for (let i in files) {
            formData.append('file', files[i].file, files[i].name);
        }

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/register",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.load_room_type = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({
                master_key:"room_type",
                top:0,
                offset:0
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.export_excel = function (search,tab,checks,room_types,top,offset,sort, date_start = null, date_end = null) {
        const data = { search, tab, checks, top, offset, sort, room_types};
        if(date_start && date_end){
            data.date_start = date_start;
            data.date_end = date_end;
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/export-excel",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose",
            },
            responseType: 'blob'
        });
    }

    obj.load_butler = function(search, top, offset, sort, date_start, date_end){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_butler",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort, date_start, date_end }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_butler = function(search, date_start, date_end){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/count_butler",
            method: "POST",
            data: JSON.stringify({ search, date_start, date_end }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;

}]);
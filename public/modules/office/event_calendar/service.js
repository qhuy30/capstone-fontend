myApp.registerFtr("event_calendar_service", [
  "fRoot",
  function (fRoot) {
    var obj = {};

    obj.load = function (tab, offset, top, search, sort, checks, levels = [], from_date = null, to_date = null, tab_child, filter_employee) {
      const data = {tab, offset, top, search, sort, checks, levels, tab_child, filter_employee };
        if(from_date && to_date){
            data.from_date = from_date;
            data.to_date = to_date;
        }
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/load",
        method: "POST",
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.count = function (tab, checks, search, levels = []) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/count",
        method: "POST",
        data: JSON.stringify({ tab, checks, search, levels }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.insert = function (data) {
      var formData = new FormData();
      for (var i in data.attachments) {
        formData.append('file', data.attachments[i].file, data.attachments[i].name);
      }

      formData.append('title', data.title);
      formData.append('start_date', data.start_date);
      formData.append('end_date', data.end_date);
      formData.append('main_person', data.main_person);
      formData.append('departments', JSON.stringify(data.departments));
      formData.append('participants', JSON.stringify(data.participants));
      formData.append('content', data.content);
      formData.append('type', data.type);
      formData.append('meeting_link', data.meeting_link);
      formData.append('room_booking_id', data.room_booking_id);
      formData.append('vehicle_booking_id', data.vehicle_booking_id);
      formData.append('other_info', data.other_info);
      formData.append('level', data.level);
    
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/insert",
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': undefined,
        },
      });
    };

    obj.creator_update = function (data) {
      var formData = new FormData();
      for (var i in data.new_attachments) {
        formData.append('file', data.new_attachments[i].file, data.new_attachments[i].name);
      }

      formData.append('id', data.id);
      formData.append('title', data.title);
      formData.append('start_date', data.start_date);
      formData.append('end_date', data.end_date);
      formData.append('main_person', data.main_person);
      formData.append('departments', JSON.stringify(data.departments));
      formData.append('participants', JSON.stringify(data.participants));
      formData.append('content', data.content);
      formData.append('type', data.type);
      formData.append('meeting_link', data.meeting_link);
      formData.append('room_booking_id', data.room_booking_id);
      formData.append('vehicle_booking_id', data.vehicle_booking_id);
      formData.append('other_info', data.other_info);
      formData.append('level', data.level);
      if(data.remove_attachments){
        formData.append('remove_attachments', JSON.stringify(data.remove_attachments));
      }
    
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/creator_update",
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': undefined,
        },
      });
    };

    obj.approve = function (id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/approve",
        method: "POST",
        data: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.reject = function (id, reason) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/reject",
        method: "POST",
        data: JSON.stringify({ id, reason }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.approve_department = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/approve_department",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.reject_department = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/reject_department",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.approve_host = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/approve_host",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.reject_host = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/reject_host",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.request_cancel = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/request_cancel",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.approve_recall_department = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/approve_recall_department",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.reject_recall_department = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/reject_recall_department",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.approve_recall_host = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/approve_recall_host",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.reject_recall_host = function (id, note) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/reject_recall_host",
        method: "POST",
        data: JSON.stringify({ id, note }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.creator_delete = function (id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/creator_delete",
        method: "POST",
        data: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.delete = function (id) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/delete",
        method: "POST",
        data: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.loadUserInformation = function (username) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/management/user/loadfordirective",
        method: "POST",
        data: JSON.stringify({ account: username.trim() }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

    obj.loadDepartments = function () {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/load_departments",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };   
    
    obj.load_file_info = function(id,filename){
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/event_calendar/load_file_info",
          method: "POST",
          data: JSON.stringify({id,filename}),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
    }

    obj.pushFile = function (file, id) {
      var formData = new FormData();
      formData.append("file", file.file, file.name);
      formData.append("id", id);

      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/pushfile",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.removeFile = function (id, filename) {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/removefile",
        method: "POST",
        data: JSON.stringify({ id, filename }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;odata=verbose",
        },
      });
    };

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

    obj.registerRegistrationRoom = function({
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

  obj.export_excel = function (from_date, to_date, checks, levels, tab_child, filter_employee) {
    return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/export-excel",
        method: "POST",
        data: JSON.stringify({ from_date, to_date, checks, levels, tab_child, filter_employee }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json;odata=verbose",
        },
        responseType: 'blob'
    });
  }

  obj.load_calendar = function (from_date, to_date, checks, levels) {
    return fRoot.requestHTTP({
        url: BackendDomain + "/office/event_calendar/load-calendar",
        method: "POST",
        data: JSON.stringify({ from_date, to_date, checks, levels }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json;odata=verbose",
        },
    });
  }

  obj.load_list_card = function (master_key, filter) {
    const top = 0;
    const offset = 0;
    return fRoot.requestHTTP({
        url: BackendDomain + "/management/directory/load_for_directive",
        method: "POST",
        data: JSON.stringify({ master_key, top, offset, filter }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json;odata=verbose"
        }
    });
  }
  obj.load_employee_filter = function (department, search, top, offset) {
    return fRoot.requestHTTP({
        url: BackendDomain + `/office/organization/load_multiple_employee`,
        method: "POST",
        data: JSON.stringify({ department, search, top, offset }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json;odata=verbose"
        }
    });
}

  return obj;
}]);

myApp.registerFtr("car_registration_service",[
  "fRoot",
  function(fRoot) {
    var obj = {};

    obj.insert = function (files, starting_place, destination, passenger, contact_passenger,
      number_of_people, time_to_go, pick_up_time, to_department, content, title) {
      var formData = new FormData();
      for (var i in files) {
          formData.append('file', files[i].file, files[i].name);
      }

      if (passenger) {
          formData.append('passenger', JSON.stringify(passenger));
      }

      if (contact_passenger) {
        formData.append('contact_passenger', JSON.stringify(contact_passenger));
      }

      if (to_department) {
          formData.append('to_department', JSON.stringify(to_department));
      }

      formData.append('starting_place', starting_place);
      formData.append('destination', destination);

      formData.append('number_of_people', number_of_people);
      formData.append('time_to_go', time_to_go);
      formData.append('pick_up_time', pick_up_time);

      formData.append('content', content);
      formData.append('title', title);
      return fRoot.requestHTTP({
          url: BackendDomain + '/office/car_management/insert',
          method: 'POST',
          data: formData,
          headers: {
              'Content-Type': undefined,
          },
      });
  };

    return obj;
  }
]);

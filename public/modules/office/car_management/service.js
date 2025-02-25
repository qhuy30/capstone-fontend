myApp.registerFtr('car_list_service', ['fRoot', function (fRoot) {

    var obj = {};

    obj.load = function (search, master_key, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ search, master_key, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_list_car = function (master_key, filter) {
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

    obj.count = function (search, master_key) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/count",
            method: "POST",
            data: JSON.stringify({ search, master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumber = function (master_key) {
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

    obj.insert = function (ordernumber, title, value, item, master_key, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/insert",
            method: "POST",
            data: JSON.stringify({ ordernumber, title, value, item, master_key, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id, ordernumber, title, item, value, isactive) {
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

    return obj;

}]);

myApp.registerFtr('car_service', ['fRoot', function (fRoot) {

    var obj = {};
    obj.load = function (search, from_date, to_date, checks, top, offset, sort) {
        const tab = 'Management';
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load",
            method: "POST",
            data: JSON.stringify({ search, tab,from_date, to_date, checks, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_calendar = function (from_date, to_date, checks) {
        const top = 0;
        const offset = 0;
        const tab = 'Calendar';
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load",
            method: "POST",
            data: JSON.stringify({ from_date, tab, to_date, checks, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search, from_date, to_date, checks) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/count",
            method: "POST",
            data: JSON.stringify({ search, from_date, to_date, checks }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

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

        if (pick_up_time) {
            formData.append('pick_up_time', pick_up_time);
        }

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

    obj.update = function (code, files, starting_place, destination, passenger,
        number_of_people, time_to_go, pick_up_time, to_department, content,removed_attachments, title, contact_passenger ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }

        if (passenger) {
            formData.append('passenger', JSON.stringify(passenger));
        }

        if (removed_attachments) {
            formData.append('removed_attachments', JSON.stringify(removed_attachments));
        }

        if (to_department) {
            formData.append('to_department', JSON.stringify(to_department));
        }

        if (contact_passenger) {
            formData.append('contact_passenger', JSON.stringify(contact_passenger));
        }

        formData.append('code', code);
        formData.append('starting_place', starting_place);
        formData.append('destination', destination);

        formData.append('number_of_people', number_of_people);
        formData.append('time_to_go', time_to_go);

        if (pick_up_time) {
            formData.append('pick_up_time', pick_up_time);
        }

        formData.append('content', content);
        formData.append('title', title);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/car_management/update',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };


    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadTicketsByDate = function (startDate) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load-ticket-callendar",
            method: "POST",
            data: JSON.stringify({ startDate }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCarList = function (master_key, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ master_key, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCardVehicleList = function (offset, top, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/card_vehical/load",
            method: "POST",
            data: JSON.stringify({ offset, top, sort }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.loadDriverList = function () {
        const query = { role: 'Driver' }
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_by_role",
            method: "POST",
            data: JSON.stringify(query),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.load_file_info = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load_file_info",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_invoice = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load_file_invoice",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_department = function (code, note, files, starting_place, destination, passenger, contact_passenger,
        number_of_people, time_to_go, pick_up_time, to_department, content,removed_attachments, title ) {
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

        if (removed_attachments) {
            formData.append('removed_attachments', JSON.stringify(removed_attachments));
        }

        if (to_department) {
            formData.append('to_department', JSON.stringify(to_department));
        }
        formData.append('code', code);
        formData.append('note', note);
        formData.append('starting_place', starting_place);
        formData.append('destination', destination);

        formData.append('number_of_people', number_of_people);
        formData.append('time_to_go', time_to_go);
        formData.append('pick_up_time', pick_up_time);

        formData.append('content', content);
        formData.append('title', title);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/car_management/approve_department',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };

    obj.reject_department = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_department",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.approve_car_management = function (code,note, assign_card, card, car, driver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_car_management",
            method: "POST",
            data: JSON.stringify({ code,note, assign_card, card, car, driver }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_car_management = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_car_management",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead = function (code, note, assign_card, card, car, driver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_lead",
            method: "POST",
            data: JSON.stringify({ code, note, assign_card, card, car, driver }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_lead",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead_external = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_lead_external",
            method: "POST",
            data: JSON.stringify({ code, note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead_external = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_lead_external",
            method: "POST",
            data: JSON.stringify({ code, note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_card_management = function (code,note, card) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_card_management",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.edit_card_management = function (code,note, card) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/edit_card_management",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.receive_card = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/creator_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_return_card = function (code, note, money, km, invoices) {
        var formData = new FormData();
        formData.append('code', code);
        formData.append('note', note);
        formData.append('money', money);
        formData.append('km', km);
        
        for (var i in invoices) {
            formData.append('invoices', invoices[i].file, invoices[i].name);
        }
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/car_management/creator_return_card',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    }

    obj.reject_card_management = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_card_management",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.manager_assign_card = function (code,note,card) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/manager_assign_card",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_receive_card = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/creator_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.manager_receive_card = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/manager_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_cancel = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/creator_cancel",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.request_cancel = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/request_cancel",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_department = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_recall_department",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_car_management = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_recall_management",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_lead = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_recall_lead",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_recall",
            method: "POST",
            data: JSON.stringify({ code, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.export_excel = function (from_date, to_date, checks) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/export-excel",
            method: "POST",
            data: JSON.stringify({ from_date, to_date, checks }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose",
            },
            responseType: 'blob'
        });
    }
    
    return obj;
}]);

myApp.registerFtr('card_list_service', ['fRoot', function (fRoot) {

    var obj = {};

    obj.load = function (search, master_key, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ search, master_key, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search, master_key) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/count",
            method: "POST",
            data: JSON.stringify({ search, master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.getOrderNumber = function (master_key) {
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

    obj.insert = function (ordernumber, title, value, item, master_key, isactive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/insert",
            method: "POST",
            data: JSON.stringify({ ordernumber, title, value, item, master_key, isactive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id, ordernumber, title, item, value, isactive) {
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

    return obj;

}]);


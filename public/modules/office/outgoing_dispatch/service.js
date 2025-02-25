myApp.registerFtr('dispatch_outgoing_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,da_book,priority,receive_method,type,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/load",
            method: "POST",
            data: JSON.stringify({ search,da_book,priority,receive_method,type,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,da_book,priority,receive_method,type,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/count",
            method: "POST",
            data: JSON.stringify({ search,da_book,priority,receive_method,type,tab}),
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
        signers,
        excerpt,
        date_sign,
        security_level,
        priority,
        document_tag,
        self_end,
        view_only_departments,
        // outgoing_documents,
        attach_documents) {
            var formData = new FormData();

            // for (var i in outgoing_documents) {
            //     formData.append("outgoing_documents", outgoing_documents[i].file, outgoing_documents[i].name);
            // }

            for (var i in attach_documents) {
                formData.append("attach_documents", attach_documents[i].file, attach_documents[i].name);
            }

            formData.append('year', release_date);
            formData.append('code', do_code);
            formData.append('symbol_number', symbol_number);
            formData.append('type', type);
            formData.append('date_sign', signing_date); // Ngày ký
            formData.append('departmemt_write', department_execute);
            formData.append('person_sign', JSON.stringify(signers)); // person_sign
            formData.append('content', excerpt);
            formData.append('expire_date', date_sign); // Thời hạn
            formData.append('security_level', security_level); // Độ mật
            formData.append('urgency_level', priority); // Độ khẩn
            formData.append('text_tags', document_tag);
            formData.append('self_end', self_end);
            formData.append('other_destination', JSON.stringify(view_only_departments));

            return fRoot.requestHTTP({
                url: BackendDomain + "/office/outgoing_dispatch/insertSepatate",
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            });
        }

    return obj;
}]);
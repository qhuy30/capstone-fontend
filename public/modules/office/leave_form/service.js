myApp.registerFtr('leave_form_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(search,type,from_date,to_date,status,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/load",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,status,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.count = function (search,type,from_date,to_date,status,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/count",
            method: "POST",
            data: JSON.stringify({ search,type,from_date,to_date,status,tab}),
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

    obj.init = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/init",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.insert = function(files,flow,from_date,to_date,type,content,number_day,use_jtf){
        var formData =  new FormData();
        for (var i in files){
            formData.append('file',files[i].file,files[i].name);
        }

        formData.append('flow',flow);
        formData.append('from_date',from_date);
        formData.append('to_date',to_date);
        formData.append('type',type);
        formData.append('content',content);
        formData.append('number_day',number_day);
        formData.append('use_jtf',use_jtf);
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/insert",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/loadfileinfo",
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
            url: BackendDomain + "/office/leave_form/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/approval",
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
            url: BackendDomain + "/office/leave_form/reject",
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
            url: BackendDomain + "/office/leave_form/delete",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    return obj;
}]);
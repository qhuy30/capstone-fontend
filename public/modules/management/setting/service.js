myApp.registerFtr('setting_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.loadDepartment = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/load_department",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadModule = function (module) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/load_module",
            method: "POST",
            data: JSON.stringify({ module }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadGeneral = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/load_general",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (itemAr) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/update",
            method: "POST",
            data: JSON.stringify({
                itemAr
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_nursing_report = function (id,value) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/update_nursing_report",
            method: "POST",
            data: JSON.stringify({
                id,value
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.uploadImage = function(file,id,image){
        var formData =  new FormData();
        formData.append('file',file.file,file.name);
        
        formData.append('id',id);
        if(image){
            formData.append('image',image);
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/upload_image",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }
    return obj;
}]);
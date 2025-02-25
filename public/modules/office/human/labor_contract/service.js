myApp.registerFtr('labor_contract_service', ['fRoot', function (fRoot) {
    var obj = {};




    obj.load = function(search,type,specialized,it,degree_english,department,status,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/load",
            method: "POST",
            data: JSON.stringify({ search,type,specialized,it,degree_english,department,status,top,offset,sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,type,specialized,it,degree_english,department,status) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/count",
            method: "POST",
            data: JSON.stringify({ search,type,specialized,it,degree_english,department,status }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(files,
        basic_salary,type, lastname,midname, firstname,birth_date,  living, permanent_address, type_residence,
        phonenumber, email,idcard, nationality, religion,
        training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english,
        department, competence, 
        from_date,to_date,
        nameFolder
        ){
        var formData =  new FormData();
        // formData.append('file',files);
        for (var i in files){
            formData.append('file',files[i].file,files[i].name);
         
        }

        // formData.append('file',files[files.length-1].file,files[files.length-1].name);
        formData.append('basic_salary',basic_salary);
        formData.append('type',type);
        formData.append('lastname',lastname);
        formData.append('midname',midname);
        formData.append('firstname',firstname);
        formData.append('birth_date',birth_date);

        formData.append('living',living);
        formData.append('permanent_address',permanent_address);
        formData.append('type_residence',type_residence);

        formData.append('phonenumber',phonenumber);
        formData.append('email',email);
        formData.append('idcard',idcard);

        formData.append('nationality',nationality);
        formData.append('religion',religion);

        formData.append('training_school',training_school);
        formData.append('graduation_year',graduation_year);
        formData.append('education',education);
        formData.append('degree',degree);
        formData.append('specialized',specialized);
        formData.append('state_management',state_management);
        formData.append('political_theory',political_theory);
        formData.append('it',it);
        formData.append('degree_english',degree_english);

        formData.append('department',department);
        formData.append('competence',competence);

        formData.append('from_date',from_date);
        formData.append('to_date',to_date);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/insert/"+nameFolder,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(id,basic_salary,type, lastname,midname, firstname,birth_date,  living, permanent_address, type_residence,
        phonenumber, email,idcard, nationality, religion,
        training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english,
        department, competence, 
        from_date,to_date){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/update",
            method: "POST",
            data: JSON.stringify({ id,basic_salary,type, lastname,midname, firstname,birth_date,  living, permanent_address, type_residence,
                phonenumber, email,idcard, nationality, religion,
                training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english,
                department, competence, 
                from_date,to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function(id,basic_salary,type, lastname,midname, firstname,birth_date,  living, permanent_address, type_residence,
        phonenumber, email,idcard, nationality, religion,
        training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english,
        department, competence, 
        from_date,to_date){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/approval",
            method: "POST",
            data: JSON.stringify({ id,basic_salary,type, lastname,midname, firstname,birth_date,  living, permanent_address, type_residence,
                phonenumber, email,idcard, nationality, religion,
                training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english,
                department, competence, 
                from_date,to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.pushFile = function(file,id,nameFolder){
        var formData =  new FormData();
        // formData.append('file',files);
        formData.append('file',file.file,file.name);

        formData.append('id',id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/pushfile/"+nameFolder,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/removefile",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.delete_multi = function (idar) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/delete_multi",
            method: "POST",
            data: JSON.stringify({ idar }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    
    return obj;
}]);
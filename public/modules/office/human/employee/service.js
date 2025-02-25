myApp.registerFtr('employee_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadListOfEmployee = function(idar){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/load_list_of_employee",
            data: JSON.stringify({ idar}),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.loadFileInfo_LaborContract = function(id,filename){
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

    obj.load = function(search,type,specialized,it,degree_english,department,status,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/load",
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
            url: BackendDomain + "/office/human/employee/count",
            method: "POST",
            data: JSON.stringify({ search,type,specialized,it,degree_english,department,status }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/loaddetails",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(lastname, midname, firstname,birth_date, phonenumber, email, idcard,department, competence){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/insert",
            method: "POST",
            data: JSON.stringify({lastname, midname, firstname,birth_date, phonenumber, email, idcard,department, competence}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.attach_labor = function(files,id,
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
        formData.append('id',id);
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
            url: BackendDomain + "/office/human/labor_contract/attach_labor/"+nameFolder,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.update_background_general = function(id,  lastname, midname, firstname,birth_date,
        living, permanent_address,domicile,place_birth, type_residence,
       phonenumber, email, idcard, nationality, religion,folk){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_background_general",
            method: "POST",
            data: JSON.stringify({ id,  lastname, midname, firstname,birth_date,
                living, permanent_address,domicile,place_birth, type_residence,
               phonenumber, email, idcard, nationality, religion,folk}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.push_background_family = function(id,childid,fullname,job,born_in,relationship,t8_1945,tdPhap,n1955){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/push_background_family",
            method: "POST",
            data: JSON.stringify({ id,childid,fullname,job,born_in,relationship,t8_1945,tdPhap,n1955}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.remove_background_family = function(id,childid){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/remove_background_family",
            method: "POST",
            data: JSON.stringify({ id,childid}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_background_family = function(id,childid,fullname,job,born_in,relationship,t8_1945,tdPhap,n1955){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_background_family",
            method: "POST",
            data: JSON.stringify({ id,childid,fullname,job,born_in,relationship,t8_1945,tdPhap,n1955}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.update_signature = function(file,id,nameFolder,oldfile){
        var formData =  new FormData();
        // formData.append('file',files);
        formData.append('file',file.file,file.name);

        formData.append('id',id);
        if(oldfile){
            formData.append('oldfile',JSON.stringify(oldfile));
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_signature/"+nameFolder,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }
    
    obj.update_quotation_mark = function(file,id,nameFolder,oldfile){
        var formData =  new FormData();
        formData.append('file',file.file,file.name);

        formData.append('id',id);
        if(oldfile){
            formData.append('oldfile',JSON.stringify(oldfile));
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_quotation_mark/"+nameFolder,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.update_education_general = function(id, training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_education_general",
            method: "POST",
            data: JSON.stringify({ id,  training_school, graduation_year, education, degree, specialized, state_management, political_theory, it, degree_english}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_mission_general = function(id, department, competence){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_mission_general",
            method: "POST",
            data: JSON.stringify({ id, department, competence  }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_salary_general = function(id,  basic_salary){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/update_salary_general",
            method: "POST",
            data: JSON.stringify({ id, basic_salary  }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.checkExist = function (account) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/checkexist",
            method: "POST",
            data: JSON.stringify({ account }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_user = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/load_user",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.register_user = function(id, user){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/register_account",
            method: "POST",
            data: JSON.stringify({ id, user }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.import = function(data){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/insert_many",
            method: "POST",
            data: JSON.stringify({ data }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/delete",
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
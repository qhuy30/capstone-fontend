myApp.registerFtr('user_profile_general_service', ['fRoot', function (fRoot) {
    var obj = {};


    obj.updateAvatar = function (file, username) {
        var formData = new FormData();
        formData.append('file', file.file, username + "." + file.name.split(".")[file.name.split(".").length - 1]);
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/updateavatar",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    return obj;
}]);

myApp.registerFtr('user_profile_selfdeclaration_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.loadListOfEmployee = function(idar){
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/labor_contract/load_list_of_employee",
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
            url: BackendDomain + "/human/labor_contract/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCompetence = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/competence/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCompetence_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/competence/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment = function(level,id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/organization/load_department_branch",
            method: "POST",
            data: JSON.stringify({ level,id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.loadTypeLaborContract = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/type_labor_contract/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadTypeLaborContract_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/type_labor_contract/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadTrainingSchool = function(search,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/training_school/load",
            method: "POST",
            data: JSON.stringify({ search,top,offset,sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.countTrainingSchool = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/training_school/count",
            method: "POST",
            data: JSON.stringify({ search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetails_TrainingSchool = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/training_school/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadTypeResidence = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/type_residence/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadTypeResidence_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/type_residence/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadSpecialized = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/specialized/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadSpecialized_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/specialized/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCity = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/city/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadNationality = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/nationality/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadNationality_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/nationality/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadReligion = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/religion/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadReligion_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/religion/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.loadEducation = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEducation_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDegree = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/degree/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDegree_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/degree/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadStateManagement = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/state_management/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadStateManagement_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/state_management/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadIT = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/it/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadIT_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/it/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDegreeEnglish = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/degree_english/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDegreeEnglish_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/degree_english/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadPoliticalTheory = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/political_theory/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadPoliticalTheory_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/political_theory/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFolk = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/folk/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFolk_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/folk/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadRelationship = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/relationship/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadRelationship_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/relationship/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadJob = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/job/load",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadJob_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/job/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
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

            method: "POST",
            obj.update_background_general = function(id,  lastname, midname, firstname,birth_date,
        living, permanent_address,domicile,place_birth, type_residence,
       phonenumber, email, idcard, nationality, religion,folk){
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/employee/update_background_general",
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
            url: BackendDomain + "/human/employee/push_background_family",
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
            url: BackendDomain + "/human/employee/remove_background_family",
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
            url: BackendDomain + "/human/employee/update_background_family",
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
            url: BackendDomain + "/human/employee/update_education_general",
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
            url: BackendDomain + "/human/employee/update_mission_general",
            method: "POST",
            data: JSON.stringify({ id, department, competence  }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    return obj;
}]);
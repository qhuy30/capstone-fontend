myApp.registerFtr('labor_contract_details_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.loadDetails = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/human/labor_contract/load_details",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function(id,filename){
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
    
    return obj;
}]);
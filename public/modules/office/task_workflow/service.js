myApp.registerFtr('task_workflow_service', ['fRoot', function (fRoot) {
    var obj = {};
    //**TASK */

    obj.load_task_workflow = function(search,status,top,offset,sort  ){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_workflow/load",
            method: "POST",
            data: JSON.stringify({ search,status,top,offset,sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.count_task_workflow = function ( search,status ) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_workflow/count",
            method: "POST",
            data: JSON.stringify({ search, status }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.insert = function(title, status, project, department, flow){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_workflow/insert",
            method: "POST",
            data: JSON.stringify({title, status, project, department, flow}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function(id,title, status, project, department, flow){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_workflow/update",
            method: "POST",
            data: JSON.stringify({id,title, status, project, department, flow}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_workflow/delete",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    //**PROJECT */
    obj.load_project = function(search,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/load",
            method: "POST",
            data: JSON.stringify({ search,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_project = function(search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/count",
            method: "POST",
            data: JSON.stringify({ search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    //**DEPARTMENT */
    obj.load_department = function(department_id, department_grade){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_department",
            method: "POST",
            data: JSON.stringify({ department_id, department_grade}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
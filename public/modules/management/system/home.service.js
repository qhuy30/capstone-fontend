myApp.registerFtr('system_home_service', ['fRoot','$q', function(fRoot,$q) {
    var obj={};
    
    obj.load_task = function(tab){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load",
            method: "POST",
            data: JSON.stringify({ tab, top : 30, offset: 0 }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_notify = function(search, department ,top,offset,sort, start_date, end_date, news_type){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load",
            method: "POST",
            data: JSON.stringify({search, department, checks:["Home"],top,offset,sort, start_date, end_date, news_type}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_bookmark_notify = function(search,department,top,offset,sort, start_date, end_date, news_type){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load",
            method: "POST",
            data: JSON.stringify({search, department, checks:["Bookmark"],top,offset,sort, start_date, end_date, news_type}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_notify = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count",
            method: "POST",
            data: JSON.stringify({ search, checks:["Home"]}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo_notify = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.like_notify = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/like",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.save_bookmark = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/save_bookmark",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.unsave_bookmark = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/unsave_bookmark",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.like = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/like",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.unlike = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/unlike",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

     
    obj.load_file_info = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_file_info",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    return obj;
}]);
myApp.registerFtr('training_point_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load_events = function (search, status, start_date, end_date, top, offset, sort) {
        console.log(top);
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/training_point/load",
            method: "POST",
            data: JSON.stringify({
                search, status, start_date, end_date, top, offset, sort
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_event = function (search, status, start_date, end_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/training_point/count",
            method: "POST",
            data: JSON.stringify({
                search, status, start_date, end_date
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function (title, content, quantity, start_registered_date, end_registered_date, start_date, end_date, point) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/training_point/insert",
            method: "POST",
            data: JSON.stringify({
                title, content, quantity, start_registered_date, end_registered_date, start_date, end_date, point
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id, title, content, quantity, start_registered_date, end_registered_date, start_date, end_date, point, status) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/training_point/update",
            method: "POST",
            data: JSON.stringify({
                id, title, content, quantity, start_registered_date, end_registered_date, start_date, end_date, point, status
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/education/training_point/delete",
            method: "POST",
            data: JSON.stringify({
                id
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
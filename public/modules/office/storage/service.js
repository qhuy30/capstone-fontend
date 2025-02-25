myApp.registerFtr('storage_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load = function(top, limit, from_date, to_date, dispatch_arrived_id, outgoing_dispatch_id, state, search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/load",
            method: "POST",
            data: JSON.stringify({ top, limit, dispatch_arrived_id, outgoing_dispatch_id, state, search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    obj.searchReference = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/search-reference",
            method: "POST",
            data: JSON.stringify({search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    obj.update = function (
        id,
        title,
        organ_id,
        file_notation,
        maintenance_time,
        usage_mode,
        language,
        storage_name,
        storage_position,
        year,
        description,
        references
    ) {
        var dataUpdate = JSON.stringify({
            id,
            title,
            organ_id,
            file_notation,
            maintenance_time,
            usage_mode,
            language,
            storage_name,
            storage_position,
            year,
            description,
            references
        })
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/update",
            method: "POST",
            data: dataUpdate,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.cancel = function (id, reason) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/cancel",
            method: "POST",
            data: JSON.stringify({id, reason}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

myApp.registerFtr('organization_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};

        obj.load = function (level, id) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/organization/load',
                method: 'POST',
                data: JSON.stringify({ level, id }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.insert = function (ordernumber, title, abbreviation, icon, parent, level, isactive, leader, departmentLeader,type) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/organization/insert',
                method: 'POST',
                data: JSON.stringify({ ordernumber, title, abbreviation, icon, parent, level, isactive, leader, departmentLeader,type }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.update = function (id, ordernumber, title, abbreviation, icon, parent, level, isactive, leader, departmentLeader,type) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/organization/update',
                method: 'POST',
                data: JSON.stringify({ id, ordernumber, title, abbreviation, icon, parent, level, isactive, leader, departmentLeader,type }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.delete = function (id) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/organization/delete',
                method: 'POST',
                data: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.loadUser = function (department) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/management/user/load_by_department',
                method: 'POST',
                data: JSON.stringify({ department }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        return obj;
    },
]);

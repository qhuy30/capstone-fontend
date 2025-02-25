myApp.registerFtr('file_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};

        //**FILE */
        obj.load_list_file = function (
            path,
            tab,
            search,
            from_date,
            last_update_date,
            top,
            offset,
            sort,
            department = '',
            project = '',
        ) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/load',
                method: 'POST',
                data: JSON.stringify({ path, tab, search, from_date, last_update_date, top, offset, sort, department, project }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.count_size = function (data) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/countSize',
                method: 'POST',
                data: JSON.stringify({ data: data }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.download = function (item) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/download',
                method: 'POST',
                data: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.insert = function (item) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/insert',
                method: 'POST',
                data: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.update = function (item) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/update',
                method: 'POST',
                data: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.insert_file = function (item) {
            var formData = new FormData();
            for (var i in item.files) {
                formData.append('file', item.files[i].file, item.files[i].name);
                formData.append(item.files[i].name, item.files[i].file.size);
            }

            formData.append('name', item.name);
            formData.append('version', item.version);
            formData.append('type', item.type);
            formData.append('department', item.department);
            formData.append('isGeneral', item.isGeneral);
            formData.append('project', item.project);
            formData.append('share', JSON.stringify(item.share));
            formData.append('value', JSON.stringify(item.value));
            formData.append('from_date', item.from_date);
            formData.append('last_update_date', item.last_update_date);
            formData.append('path', JSON.stringify(item.path));
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/insert_file',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined,
                },
            });
        };

        obj.delete = function (id) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/delete',
                method: 'POST',
                data: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        /** DEPARTMENT */
        obj.load_department = function (department_id, department_grade) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/file/load_department',
                method: 'POST',
                data: JSON.stringify({ department_id, department_grade }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };
        //**DEPARTMENT */

        /**PROJECT */
        obj.load_project = function (search, top, offset, sort) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/office/project/project/load',
                method: 'POST',
                data: JSON.stringify({ search, top, offset, sort }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };
        /**PROJECT */

        return obj;
    },
]);

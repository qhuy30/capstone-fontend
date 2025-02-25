myApp.registerFtr('exam_schedule_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};

        obj.import_file = function (item) {
            var formData = new FormData();
            formData.append('file', item.file, item.name);

            return fRoot.requestHTTP({
                url: BackendDomain + '/education/exam_schedule/import',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined,
                },
            });
        };

        obj.upload = function (item, id) {
            var formData = new FormData();
            formData.append('file', item.files.file, item.files.name);
            formData.append('upload_date', item.upload_date);
            formData.append('id', id || '');

            return fRoot.requestHTTP({
                url: BackendDomain + '/education/exam_schedule/upload',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined,
                },
            });
        };

        obj.getFilesUpload = function (search, offset, top, sort) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/exam_schedule/getFilesUpload',
                method: 'POST',
                data: {search, offset, top, sort},
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.countFiles = function (search) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/exam_schedule/countFilesUpload',
                method: 'POST',
                data: {search},
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        obj.delete_exam_schedule = function (id) {
            return fRoot.requestHTTP({
                url: BackendDomain + '/education/exam_schedule/deleteExamSchedule',
                method: 'POST',
                data: { id },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json;odata=verbose',
                },
            });
        };

        return obj;
    },
]);

myApp.registerFtr('remove_pdf_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};
        obj.removeContextPdf = function (files) {
            var formData = new FormData();
            for (var i in files) {
                formData.append('files', files[i].file, files[i].name);
            }

            return fRoot.requestHTTP({
                url: BackendDomain + '/utilities_tools/remove_pdf/removeContextPdf',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined,
                },
            });
        };

        return obj;
    },
]);

myApp.registerFtr('pdf_to_excel_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};
        obj.convertPdf2Excel = function (files) {
            var formData = new FormData();
            for (var i in files) {
                formData.append('files', files[i].file, files[i].name);
            }

            return fRoot.requestHTTP({
                url: BackendDomain + '/utilities_tools/pdf_to_excel/convertPdf2Excel',
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

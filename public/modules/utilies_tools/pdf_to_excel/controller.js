myApp.registerCtrl('pdf_to_excel_controller', [
    'pdf_to_excel_service',
    '$q',
    '$rootScope',
    function (pdf_to_excel_service, $q, $rootScope) {
        /**declare variable */
        const _statusValueSet = [
            { name: 'Pdf2Excel', action: 'convert' },
            { name: 'Pdf2Excel', action: 'remove' },
        ];
        var ctrl = this;
        {
            ctrl._ctrlName = 'pdf_to_excel_controller';
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        }

        ctrl.getFile = function (files) {
            ctrl._files = files.files;
        };

        ctrl.convertFile = function (val) {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'Pdf2Excel', 'convert', convert_Pdf2Excel_Service);
        };

        ctrl.reset = function (val) {
            return ctrl._files = [];
        };

        function convert_Pdf2Excel_Service() {
            var dfd = $q.defer();
            ctrl.Projects = [];
            $rootScope.isLoading = true;
            pdf_to_excel_service.convertPdf2Excel(ctrl._files).then(
                function (res) {
                    var wb = res.data.wb;
                    var ws = res.data.ws;
                    XLSX.utils.book_append_sheet(wb, ws, 'Combine Data');
                    var excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    var blob = new Blob([excelData], { type: 'application/octet-stream' });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = 'result.xlsx';
                    $rootScope.isLoading = false;
                    link.click();
                    ctrl._files = [];
                    URL.revokeObjectURL(url);
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
            return dfd.promise;
        }
    },
]);

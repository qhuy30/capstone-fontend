myApp.registerCtrl('remove_pdf_controller', [
    'remove_pdf_service',
    '$q',
    '$rootScope',
    function (remove_pdf_service, $q, $rootScope) {
        /**declare variable */
        const _statusValueSet = [
            { name: 'RemovePdf', action: 'remove' },
        ];
        var ctrl = this;
        {
            ctrl._ctrlName = 'remove_pdf_controller';
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        }

        const date = new Date().toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        ctrl.getFile = function (files) {
            ctrl._files = files.files;
        };

        ctrl.removePdf = function (val) {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'RemovePdf', 'remove', remove_context_pdf_service);
        };

        ctrl.reset = function (val) {
            return ctrl._files = [];
        };

        function remove_context_pdf_service() {
            const today = date.replace(/\//g, '.').slice(0, 5);
            var dfd = $q.defer();
            ctrl.Projects = [];
            $rootScope.isLoading = true;
            remove_pdf_service.removeContextPdf(ctrl._files).then(
                function (res) {
                    if (ctrl._files.length > 1) {
                        var uint8Array = new Uint8Array(res.data[0].buffer.data);
                        var blob = new Blob([uint8Array], { type: 'application/zip' });
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.download = `PDF_${today}.zip`;
                        $rootScope.isLoading = false;
                        link.click();
                        ctrl._files = [];
                        URL.revokeObjectURL(url);
                        dfd.resolve(true);
                    } else {
                        var uint8Array = new Uint8Array(res.data[0].buffer);
                        var blob = new Blob([uint8Array], { type: 'application/pdf' });
                        const name = ctrl._files[0].file.name.split('.')[0];
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.download = `${name}_${today}.pdf`;
                        $rootScope.isLoading = false;
                        link.click();
                        URL.revokeObjectURL(url);
                        ctrl._files = [];
                        dfd.resolve(true);
                    }
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

myApp.registerCtrl('calculate_dimensions_controller', [
    'calculate_dimensions_service',
    '$q',
    '$rootScope',
    function (calculate_dimensions_service, $q, $rootScope) {
        /**declare variable */
        const _statusValueSet = [{ name: 'CD', action: 'calculate' }];
        var ctrl = this;
        {
            ctrl._ctrlName = 'calculate_dimensions_controller';
            ctrl._calculate_value = {
                width: 0,
                height: 0,
            };
            ctrl._files_fail = [];
            ctrl._files = [];
            ctrl._show_modal = false;
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        }

        ctrl.getFile = function (files) {
            ctrl._files = [...ctrl._files, ...files.files];
        };

        ctrl.reset = function (val) {
            ctrl._files = [];
            ctrl._files_fail = [];
            ctrl._calculate_value = {
                width: 0,
                height: 0,
            };
        };

        ctrl.calculate_func = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'CD', 'calculate', calculate_dimensions_Service);
        };

        ctrl.close_modal_func = function () {
            ctrl._show_modal = false;
        };

        function calculate_dimensions_Service() {
            var dfd = $q.defer();
            ctrl.Projects = [];
            calculate_dimensions_service.checkImageDimensions(ctrl._files, ctrl._calculate_value.width, ctrl._calculate_value.height).then(
                function (res) {
                    ctrl._files_fail = ctrl._files.filter((i) => res.includes(i.name));
                    ctrl._show_modal = true;
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

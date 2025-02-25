myApp.registerCtrl('study_plan_controller', [
    '$location',
    'study_plan_service',
    '$rootScope',
    '$q',
    '$filter',
    function ($location, study_plan_service, $rootScope, $q, $filter) {
        /**declare variable */
        const _statusValueSet = [
            { name: 'StudyPlan', action: 'init' },
            { name: 'StudyPlan', action: 'load' },
            { name: 'StudyPlan', action: 'count' },
            { name: 'StudyPlan', action: 'insert' },
            { name: 'StudyPlan', action: 'update' },
            { name: 'StudyPlan', action: 'delete' },
        ];
        var ctrl = this;
        {
            ctrl._ctrlName = 'study_plan_controller';

            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.currentPage = 1;
            ctrl.numOfItemPerPage = 10;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
            ctrl.sort = { name: 'upload_date', value: false, query: { upload_date: 1 } };
            ctrl._searchByKeyToFilterData = "";
            ctrl._import_study_plan_value = {};
            ctrl.list_files = [];
            ctrl.file_history = {};
            ctrl._selected_file = {};
            ctrl._urlUpdateModal = FrontendDomain + '/modules/education/study_plan/views/update_modal.html';
            ctrl._urlDeleteModal = FrontendDomain + '/modules/education/study_plan/views/delete_modal.html';
        }

        ctrl.getFile = function (params) {
            ctrl._import_study_plan_value.files = params.file;
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'StudyPlan', 'insert', import_service);
        };

        ctrl.getFileUpdate = function (params) {
            ctrl._import_study_plan_value.files = params.file;
        };

        ctrl.update = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'StudyPlan', 'update', import_service);
        };

        ctrl.delete = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'StudyPlan', 'delete', delete_service);
        };

        function import_service() {
            var dfd = $q.defer();
            ctrl.file_ErrorMsg = '';
            study_plan_service.import_file(ctrl._import_study_plan_value.files).then(
                function (res) {
                    var today = new Date();
                    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

                    ctrl._import_study_plan_value.upload_date = myToday.getTime();
                    study_plan_service.upload(ctrl._import_study_plan_value, ctrl.file_history._id).then(
                        function () {
                            load_all_service();
                            dfd.resolve(true);
                            dfd = undefined;
                        },
                        function (error) {
                            dfd.reject(error);
                            error = undefined;
                        }
                    );
                },
                function (err) {
                    if (err.status === 500) {
                        let errMsg = err.data.mes;
                        errMsg = errMsg.replaceAll('[', '');
                        errMsg = errMsg.replaceAll(']', '');
                        ctrl.file_ErrorMsg = errMsg;
                    } else {
                        let errMsg = JSON.stringify(err.data.data);
                        errMsg = errMsg.replaceAll('[', '');
                        errMsg = errMsg.replaceAll(']', '');
                        errMsg = errMsg.replaceAll('\\', '');
                        errMsg = errMsg.replaceAll('","', '",\n"');
                        ctrl.file_ErrorMsg = errMsg.replace(/\n/g, '<br>');
                    }
                    dfd.reject(err);
                    err = undefined;
                }
            );

            return dfd.promise;
        }

        function delete_service() {
            var dfd = $q.defer();
            study_plan_service.delete_study_plan(ctrl._selected_file._id).then(
                function (res) {
                    load_all_service();
                    dfd.resolve(true);
                    dfd = undefined;
                    res = undefined;
                },
                function (err) {
                    load_all_service();
                    dfd.reject(err);
                    err = undefined;
                }
            );
            return dfd.promise;
        }

        ctrl.loadAllFiles = function (val) {
            if (val != undefined) { ctrl.offset = angular.copy(val); }
            return $rootScope.statusValue.execute(ctrl._ctrlName, "StudyPlan", "load", load_all_service);
        }

        function load_all_service() {
            var dfd = $q.defer();
            var filter = generateFilterLoadFiles();
            study_plan_service.getFilesUpload(filter.search, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(
                function (res) {
                    ctrl.list_files = res.data;
                    ctrl.file_history = {};
                    ctrl._selected_file = {};
                    ctrl._import_study_plan_value = {};
                    $('#modal_Study_Update').modal('hide');
                    $('#modal_Study_Delete').modal('hide');
                    dfd.resolve(true);
                },
                function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
            );

            return dfd.promise;
        }

        function generateFilterLoadFiles() {
            var obj = {};
            if (ctrl._searchByKeyToFilterData !== "") {
                obj.search = angular.copy(ctrl._searchByKeyToFilterData);
            }
            return obj;
        }

        function countFiles_service() {
            var dfd = $q.defer();
            ctrl.users = [];
            var filter = generateFilterLoadFiles();
            study_plan_service.countFiles(filter.search).then(function (res) {
                ctrl.totalItems = res.data.count;
    
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
    
        }
    
        ctrl.countFiles = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, "StudyPlan", "count", countFiles_service);
        }

        ctrl.loadAllFiles = function (val) {
            if (val != undefined) { ctrl.offset = angular.copy(val); }
            return $rootScope.statusValue.execute(ctrl._ctrlName, "StudyPlan", "load", load_all_service);
        }

        /**function for logic */
        function resetPaginationInfo() {
            ctrl.currentPage = 1;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
        }

        ctrl.prepareEdit = function (val) {
            ctrl.file_history = val;
            $rootScope.statusValue.generate(ctrl._ctrlName, 'StudyPlan', 'update');
        };

        ctrl.prepareDelete = function (val) {
            ctrl._selected_file = val;
            $rootScope.statusValue.generate(ctrl._ctrlName, 'StudyPlan', 'delete');
        };

        ctrl.loadFile_studyPlan = function (params) {
            window.open(window.BackendDomain + '/files/' + params.folderPath + '/' + params.name);
        };

        ctrl.refreshData = function () {
            var dfdAr = [];
            resetPaginationInfo();
            dfdAr.push(ctrl.loadAllFiles());
            dfdAr.push(ctrl.countFiles());
            $q.all(dfdAr);
        };

        function init() {
            var dfdAr = [];
            dfdAr.push(ctrl.loadAllFiles());
            dfdAr.push(ctrl.countFiles());
            $q.all(dfdAr).then(
                function () {
                    ctrl._notyetInit = false;
                },
                function (err) {
                    console.log(err);
                    err = undefined;
                }
            );
        }

        init();
    },
]);

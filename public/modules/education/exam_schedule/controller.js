myApp.registerCtrl('exam_schedule_controller', [
    '$location',
    'exam_schedule_service',
    '$rootScope',
    '$q',
    '$filter',
    function ($location, exam_schedule_service, $rootScope, $q, $filter) {
        /**declare variable */
        const _statusValueSet = [
            { name: 'ExamSchedule', action: 'init' },
            { name: 'ExamSchedule', action: 'load' },
            { name: 'ExamSchedule', action: 'count' },
            { name: 'ExamSchedule', action: 'insert' },
            { name: 'ExamSchedule', action: 'update' },
            { name: 'ExamSchedule', action: 'delete' },
        ];
        var ctrl = this;
        {
            ctrl._ctrlName = 'exam_schedule_controller';

            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.currentPage = 1;
            ctrl.numOfItemPerPage = 10;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
            ctrl.sort = { name: 'upload_date', value: false, query: { upload_date: 1 } };
            ctrl._searchByKeyToFilterData = "";
            ctrl._import_exam_schedule_value = {};
            ctrl.list_files = [];
            ctrl.file_history = {};
            ctrl._selected_file = {};
            ctrl._urlUpdateModal = FrontendDomain + '/modules/education/exam_schedule/views/update_modal.html';
            ctrl._urlDeleteModal = FrontendDomain + '/modules/education/exam_schedule/views/delete_modal.html';
        }

        ctrl.getFile = function (params) {
            ctrl._import_exam_schedule_value.files = params.file;
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'ExamSchedule', 'insert', import_service);
        };

        ctrl.getFileUpdate = function (params) {
            ctrl._import_exam_schedule_value.files = params.file;
        };

        ctrl.update = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'ExamSchedule', 'update', import_service);
        };

        ctrl.delete = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'ExamSchedule', 'delete', delete_service);
        };

        function import_service() {
            var dfd = $q.defer();
            ctrl.file_ErrorMsg = '';
            exam_schedule_service.import_file(ctrl._import_exam_schedule_value.files).then(
                function (res) {
                    var today = new Date();
                    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

                    ctrl._import_exam_schedule_value.upload_date = myToday.getTime();
                    exam_schedule_service.upload(ctrl._import_exam_schedule_value, ctrl.file_history._id).then(
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
                    ctrl.file_ErrorMsg = JSON.parse(JSON.stringify(err.data.data));
                    dfd.reject(err);
                    err = undefined;
                }
            );

            return dfd.promise;
        }

        function delete_service() {
            var dfd = $q.defer();
            exam_schedule_service.delete_exam_schedule(ctrl._selected_file._id).then(
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
            return $rootScope.statusValue.execute(ctrl._ctrlName, "ExamSchedule", "load", load_all_service);
        }

        function load_all_service() {
            var dfd = $q.defer();
            var filter = generateFilterLoadFiles();
            exam_schedule_service.getFilesUpload(filter.search, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(
                function (res) {
                    ctrl.list_files = res.data;
                    ctrl.file_history = {};
                    ctrl._selected_file = {};
                    ctrl._import_exam_schedule_value = {};
                    $('#modal_Exam_Update').modal('hide');
                    $('#modal_Exam_Delete').modal('hide');
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
            exam_schedule_service.countFiles(filter.search).then(function (res) {
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
            return $rootScope.statusValue.execute(ctrl._ctrlName, "ExamSchedule", "count", countFiles_service);
        }

        ctrl.loadAllFiles = function (val) {
            if (val != undefined) { ctrl.offset = angular.copy(val); }
            return $rootScope.statusValue.execute(ctrl._ctrlName, "ExamSchedule", "load", load_all_service);
        }

        /**function for logic */
        function resetPaginationInfo() {
            ctrl.currentPage = 1;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
        }

        ctrl.prepareEdit = function (val) {
            ctrl.file_history = val;
            $rootScope.statusValue.generate(ctrl._ctrlName, 'ExamSchedule', 'update');
        };

        ctrl.prepareDelete = function (val) {
            ctrl._selected_file = val;
            $rootScope.statusValue.generate(ctrl._ctrlName, 'ExamSchedule', 'delete');
        };

        ctrl.loadFile_examSchedule = function (params) {
            window.open(window.BackendDomain + '/files/' + params.folderPath +'/' + params.name);
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

myApp.registerCtrl('file_personal_controller', [
    'file_service',
    '$q',
    '$rootScope',
    '$filter',
    '$window',
    function (file_service, $q, $rootScope, $filter, $window) {
        var ctrl = this;
        /**declare variable */

        const _statusValueSet = [
            { name: 'File', action: 'init' },
            { name: 'File', action: 'loadProject' },
            { name: 'File', action: 'loadListFile' },
            { name: 'File', action: 'download' },
            { name: 'File', action: 'insert' },
            { name: 'File', action: 'update' },
            { name: 'File', action: 'delete' },
        ];
        /** init variable */
        {
            ctrl._ctrlName = 'file_personal_controller';

            ctrl.Projects = [];
            ctrl.Files = [];
            ctrl.rootFiles = [];
            ctrl.pathSearch = '';
            ctrl.pathInsert = [];
            ctrl.pathSelected = '';
            ctrl.numOfItemPerPage_Project = 10;

            ctrl.offset_Project = 0;
            ctrl.item_download = {};
            ctrl.sort_Project = { name: '_id', value: false, query: { name: 1 } };
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.offset_File = 0;
            ctrl.numOfItemPerPage_File = 15;
            ctrl.currentPage = 1;
            ctrl.totalItems = 0;

            ctrl._urlInsertFolderModal = FrontendDomain + '/modules/office/file/views/insert_folder_modal.html';
            ctrl._urlUpdateFolderModal = FrontendDomain + '/modules/office/file/views/update_folder_modal.html';
            ctrl._urlDeleteFolderModal = FrontendDomain + '/modules/office/file/views/delete_folder_modal.html';
        }

        /** Filter */
        function setValueFilter() {
            var today = new Date();
            if (today.getDate() < 10) {
                ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
                ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
            } else {
                ctrl._filterFromDate_created = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                ctrl._filterFromDate_assigned = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
            }

            ctrl._filterToDate_created = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

            ctrl._filterToDate_assigned = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        }

        function generateFilter_created() {
            var obj = {};
            if (ctrl._searchByKeyToFilterData_create !== '') {
                obj.search = angular.copy(ctrl._searchByKeyToFilterData_create);
            }

            if (ctrl._filterFromDate_created) {
                obj.from_date = angular.copy(ctrl._filterFromDate_created.getTime());
            }

            if (ctrl._filterToDate_created) {
                obj.last_update_date = angular.copy(ctrl._filterToDate_created.getTime());
            }
            return obj;
        }

        /** END Filter */

        /** Load */
        ctrl.load_list_file_created = function (val) {
            if (val != undefined) {
                ctrl.offset_Project = angular.copy(val);
            }
            return $rootScope.statusValue.execute(
                ctrl._ctrlName,
                'File',
                'loadListFile',
                load_list_file_created_service
            );
        };
        function load_list_file_created_service() {
            var dfd = $q.defer();
            let dfdArray = [];
            ctrl.Projects = [];
            let _filter = generateFilter_created();
            file_service
                .load_list_file(
                    ctrl.pathSearch,
                    'created',
                    _filter.search,
                    _filter.from_date,
                    _filter.last_update_date,
                    ctrl.numOfItemPerPage_File,
                    ctrl.offset_File,
                    ctrl.sort_Project.query
                )
                .then(
                    function (response) {
                        ctrl.Files = response.data;

                        // ** Count Size For Folders** //
                        let listFolderChildren = ctrl.Files.filter((item) => item.type === 'folder') || [];

                        if (listFolderChildren.length > 0) {
                            file_service.count_size(listFolderChildren).then(
                                (res) => {
                                    ctrl.Files = ctrl.Files.map((item1) => {
                                        var matchedItem = res.data.find((item2) => item2._id === item1._id);

                                        if (matchedItem) {
                                            return matchedItem;
                                        } else {
                                            return item1;
                                        }
                                    });
                                    dfd.resolve(true);
                                    res = undefined;
                                    response = undefined;
                                },
                                (error) => {
                                    dfd.reject(false);
                                    error = undefined;
                                    response = undefined;
                                }
                            );
                        }

                        dfd.resolve(true);
                        response = undefined;
                    },
                    function (err) {
                        dfd.reject(false);
                        err = undefined;
                    }
                );
            return dfd.promise;
        }

        /** END Load */

        /** Download */
        ctrl.downloadFile = function (itemDownload) {
            ctrl.item_download = angular.copy(itemDownload);
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'File', 'download', download_file_service);
        };
        function download_file_service() {
            var dfd = $q.defer();
            ctrl.Projects = [];
            let _filter = generateFilter_created();
            file_service.download(ctrl.item_download).then(
                function (res) {
                    let url = res.data;
                    let link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.download = ctrl.item_download.value.name;
                    link.click();
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
        /** End Download */

        /** Redirect */

        ctrl.chooseFile = function (name) {
            ctrl.pathSearch = name;

            ctrl.pathInsert.push(ctrl.pathSearch);
            ctrl.pathSelected = ctrl.pathInsert.join(' / ');

            ctrl.load_list_file_created();
        };

        ctrl.backParentFile = function () {
            ctrl.pathInsert.pop();
            ctrl.pathSearch = ctrl.pathInsert[ctrl.pathInsert.length - 1];
            ctrl.pathSelected = addSpace(ctrl.pathInsert.join(''));

            ctrl.load_list_file_created();
        };
        /** END Redirect */

        // ** Insert **//
        ctrl.insert = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'File', 'insert', insert_service);
        };

        ctrl.prepareInsertFolder = function (type) {
            $rootScope.statusValue.generate(ctrl._ctrlName, 'File', 'insert');

            var today = new Date();

            var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            ctrl._insert_folder_value = {
                name: '',
                size: 0,
                version: '1.0',
                type: type,
                department: '',
                isGeneral: false,
                project: '',
                share: [],
                value: {},
                from_date: myToday.getTime(),
                last_update_date: myToday.getTime(),
                path: ctrl.pathInsert,
                files: [],
            };
        };

        /** END Insert */

        ctrl.getFile = function (files) {
            ctrl._insert_folder_value.files = files.files;
        };

        function insert_service() {
            var dfd = $q.defer();
            let item = {
                name: ctrl._insert_folder_value.name,
                size: ctrl._insert_folder_value.size,
                version: ctrl._insert_folder_value.version,
                type: ctrl._insert_folder_value.type,
                department: ctrl._insert_folder_value.department,
                isGeneral: ctrl._insert_folder_value.isGeneral,
                project: ctrl._insert_folder_value.project,
                share: ctrl._insert_folder_value.share,
                value: ctrl._insert_folder_value.value,
                from_date: ctrl._insert_folder_value.from_date,
                last_update_date: ctrl._insert_folder_value.last_update_date,
                path: ctrl._insert_folder_value.path,
            };
            if (ctrl._insert_folder_value.type === 'folder') {
                file_service.insert(item).then(
                    function () {
                        $('#modal_Folder_Insert').modal('hide');
                        ctrl.load_list_file_created();
                        dfd.resolve(true);
                        dfd = undefined;
                    },
                    function (err) {
                        dfd.reject(err);
                        err = undefined;
                    }
                );
            } else if (ctrl._insert_folder_value.type === 'file') {
                item.files = ctrl._insert_folder_value.files;
                file_service.insert_file(item).then(
                    function () {
                        $('#modal_Folder_Insert').modal('hide');
                        ctrl.load_list_file_created();
                        dfd.resolve(true);
                        dfd = undefined;
                    },
                    function (err) {
                        dfd.reject(err);
                        err = undefined;
                    }
                );
            }

            return dfd.promise;
        }

        // ** Update **
        ctrl.prepareUpdate = function (value) {
            $rootScope.statusValue.generate(ctrl._ctrlName, 'File', 'update');
            ctrl._update_folder_value = angular.copy(value);
            ctrl._update_folder_value.oldName = value.name;
            ctrl._update_folder_value.tab = 'created';

        };

        ctrl.pickShare_update = function (val) {
            var dfd = $q.defer();

            ctrl._update_folder_value.share = val;
            dfd.resolve(true);
            return dfd.promise;
        };

        ctrl.update = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'File', 'update', update_service);
        };

        function update_service() {
            var dfd = $q.defer();
            var today = new Date();
            ctrl._update_folder_value.last_update_date = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                today.getHours(),
                today.getMinutes(),
                today.getSeconds()
            ).getTime();

            file_service.update(ctrl._update_folder_value).then(
                function () {
                    $('#modal_Folder_Update').modal('hide');
                    dfd.resolve(true);
                    ctrl.load_list_file_created();
                    dfd = undefined;
                },
                function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
            );

            return dfd.promise;
        }
        /** END UPDATE */

        // ** DELETE */
        ctrl.prepareDelete = function (value) {
            $rootScope.statusValue.generate(ctrl._ctrlName, 'File', 'delete');
            ctrl._delete_folder_value = angular.copy(value);
        };

        ctrl.delete = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'File', 'delete', delete_service);
        };
        function delete_service() {
            var dfd = $q.defer();
            file_service.delete(ctrl._delete_folder_value._id).then(
                function () {
                    $('#modal_Folder_Delete').modal('hide');
                    dfd.resolve(true);
                    ctrl.load_list_file_created();
                    dfd = undefined;
                },
                function (err) {
                    dfd.reject(err);
                    err = undefined;
                }
            );
            return dfd.promise;
        }

        /** Utils functions */

        function addSpace(str) {
            return str.replace(' / ');
        }

        ctrl.chooseNumberItem = function (val) {
            ctrl.numOfItemPerPage_File = val;
            ctrl.refreshData_created();
        };

        ctrl.refreshData_created = function () {
            ctrl.load_list_file_created();
        };

        ctrl.pickShare_insert = function (val) {
            var dfd = $q.defer();
            ctrl._insert_folder_value.share = val;
            dfd.resolve(true);
            return dfd.promise;
        };

        /** END Utils */

        //**INIT */
        function init() {
            setValueFilter();

            ctrl.load_list_file_created();
        }

        init();
    },
]);

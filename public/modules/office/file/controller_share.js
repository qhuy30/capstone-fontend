myApp.registerCtrl('file_share_controller', [
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
            { name: 'File', action: 'loadListFile' },
            { name: 'File', action: 'download' },
        ];
        /** init variable */
        {
            ctrl._ctrlName = 'file_share_controller';

            ctrl.Files = [];
            ctrl.rootFiles = [];
            ctrl.pathSearch = '';
            ctrl.pathInsert = [''];
            ctrl.pathSelected = '';
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
            ctrl._filterStatus_created = 'All';

            ctrl._filterToDate_assigned = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
            ctrl._filterStatus_assigned = 'All';
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

        function findParentObjects(arr) {
            let parentObjects = [];

            for (let i = 0; i < arr.length; i++) {
                let isParent = true;

                for (let j = 0; j < arr.length; j++) {
                    if (!isParentObject(arr[i], arr[j])) {
                        isParent = false;
                        break;
                    }
                }
                if (isParent) {
                    parentObjects.push(arr[i]);
                }
            }

            return parentObjects;
        }

        function isParentObject(parentPath, childPath) {
            if (parentPath.path.length === 0) return true;
            let isParent = false;
            isParent = parentPath.path.every((item, index) => item === childPath.path[index]);
            if (!isParent) {
                let matchPath = parentPath.path.includes(childPath.name);
                isParent = !matchPath;
            }
            return isParent;
        }

        function load_list_file_created_service() {
            var dfd = $q.defer();
            let dfdArray = [];
            let _filter = generateFilter_created();
            file_service
                .load_list_file(
                    ctrl.pathSearch,
                    'share',
                    _filter.search,
                    _filter.from_date,
                    _filter.last_update_date,
                    ctrl.numOfItemPerPage_File,
                    ctrl.offset_File,
                    ctrl.sort_Project.query
                )
                .then(
                    function (res) {
                        ctrl.rootFiles = res.data;

                        ctrl.Files = findParentObjects(res.data);
                        // ctrl.rootFiles = ctrl.Files;

                        // ** Count Size for folder
                        count_size(ctrl.Files, ctrl.rootFiles);
                        dfd.resolve(true);
                    },
                    function (err) {
                        dfd.reject(false);
                        err = undefined;
                    }
                );
            return dfd.promise;
        }

        function count_size(current, root) {
            ctrl.Files = current.map((item1) => {
                let matchedItems = root.filter(
                    (item2) => item2.path.includes(item1.name) && item1.type === 'folder'
                );

                if (matchedItems.length > 0) {
                    let count = 0;
                    for (var i in matchedItems) {
                        count += parseInt(matchedItems[i].size);
                    }
                    return { ...item1, size: count };
                } else {
                    return item1;
                }
            });
        }

        function load_list_file_from_root() {
            let filterFromRoot = ctrl.rootFiles;
            if (ctrl.pathSearch && ctrl.pathSearch !== '') {
                filterFromRoot = ctrl.rootFiles.filter((item) => item.path.includes(ctrl.pathSearch));
            }
            let parentList = findParentObjects(filterFromRoot);
            count_size(parentList, filterFromRoot);
        }

        function download_file_service() {
            var dfd = $q.defer();
            file_service.download(ctrl.item_download).then(
                function (res) {
                    let url = res.data;
                    let link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.download = ctrl.item_download.value.name; 
                    link.click();
                    URL.revokeObjectURL(url)
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
            return dfd.promise;
        }

        function addSpace(str) {
            return str.replace(/(?<=\S)\/(?=\S)/g, ' / ');
        }

        ctrl.chooseNumberItem = function (val) {
            ctrl.numOfItemPerPage_File = val;
            ctrl.refreshData_created();
        };

        ctrl.refreshData_created = function () {
            ctrl.load_list_file_created();
        };

        ctrl.chooseFile = function (name) {
            ctrl.pathSearch = name;

            ctrl.pathInsert.push(ctrl.pathSearch);
            ctrl.pathSelected = addSpace(ctrl.pathInsert.join(''));

            load_list_file_from_root();
        };

        ctrl.backParentFile = function () {
            ctrl.pathInsert.pop();
            ctrl.pathSearch = '';
            if (ctrl.pathInsert.length > 0 ) {
                ctrl.pathSearch = ctrl.pathInsert[ctrl.pathInsert.length - 1];
            }
            ctrl.pathSelected = addSpace(ctrl.pathInsert.join(''));

            load_list_file_from_root();
        };

        ctrl.downloadFile = function (itemDownload) {
            ctrl.item_download = angular.copy(itemDownload);
            return $rootScope.statusValue.execute(ctrl._ctrlName, 'File', 'download', download_file_service);
        };

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

        //**INIT */
        function init() {
            setValueFilter();

            ctrl.load_list_file_created();
        }

        init();
    },
]);

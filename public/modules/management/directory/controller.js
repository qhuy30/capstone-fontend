myApp.registerCtrl('directory_controller', ['directory_service', '$q', '$rootScope', '$filter', function (directory_service, $q, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "Directory", action: "getOrderNumber" },
        { name: "Directory", action: "load" },
        { name: "Directory", action: "count" },
        { name: "Directory", action: "insert" },
        { name: "Directory", action: "update" },
        { name: "Directory", action: "delete" }
    ];

    var ctrl = this;
    const From_Date_Error_Msg = $filter('l')('FromDateErrorMsg');
    const To_Date_Error_Msg = $filter('l')('ToDateErrorMsg');
    const Number_Error_Msg = $filter('l')('NumberErrorMsg');

    /** init variable */
    {
        ctrl._ctrlName = "directory_controller";

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.directory = [];
        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";
        ctrl.master_directory = "";
        ctrl.master_directory_item = {};
        ctrl.isDisabledOrderNumberEdit = false;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/management/directory/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/management/directory/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/management/directory/views/update_modal.html";

    }
    function isValidFromDate (isInsert, fromDate, toDate) {
        if (isInsert) {
            return (!fromDate || fromDate > toDate) ? From_Date_Error_Msg : '';
        } else {
            return fromDate > toDate ? From_Date_Error_Msg : '';
        }
    }

    function isValidToDate (isInsert, fromDate, toDate) {
        if (isInsert) {
            return (!toDate || fromDate > toDate) ? To_Date_Error_Msg : '';
        } else {
            return fromDate > toDate ? To_Date_Error_Msg : '';
        }
    }

    function setMasterDirectoryItem(val) {
        ctrl.master_directory = angular.copy(val.key);
        ctrl.master_directory_item = angular.copy(val);

        /**
         * For incoming dispatch book, we use the largest number to set the default value in anywhere when we need to insert it
         * To do it, if the val.key is "incomming_dispatch_book", disable the edit function on the order number in the update/insert form
         */
        if (ctrl.master_directory === 'incomming_dispatch_book') {
            ctrl.isDisabledOrderNumberEdit = true;
        }
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }

    ctrl.loadMasterDirectory = function (params) {
        var dfd = $q.defer();
        directory_service.loadMasterDirectory(params.search, params.top, params.offset).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadDetails_MasterDirectory = function (params) {
        var dfd = $q.defer();
        directory_service.loadDetails_MasterDirectory(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countMasterDirectory = function (params) {
        var dfd = $q.defer();
        directory_service.countMasterDirectory(params.search).then(function (res) {
            dfd.resolve(res.data.count);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }



    function load_service() {
        var dfd = $q.defer();
        let _filter = generateFilter();
        directory_service.load(_filter.search, ctrl.master_directory, ctrl.numOfItemPerPage, ctrl.offset).then(function (res) {
            ctrl.directory = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        directory_service.count(_filter.search, ctrl.master_directory).then(function (res) {
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

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "count", count_service);
    }

    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }


    ctrl.refreshData = function () {
        resetPaginationInfo();
        ctrl.load();
        ctrl.count();
    }
    ctrl.pickMasterDirectory = function (value) {
        setMasterDirectoryItem(value);
        ctrl.refreshData();
    }
    function init() {
        ctrl.loadMasterDirectory({ offset: 0, top: 10 }).then(function (data) {
            if (data[0]) {
                setMasterDirectoryItem(data[0]);
                var dfdAr = [];
                dfdAr.push(ctrl.load());
                dfdAr.push(ctrl.count());
                $q.all(dfdAr).then(
                    function () {
                        ctrl._notyetInit = false;
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    }
                );
            }
        }, function (err) { console.log(err); });

    }
    init();
    //INSERT DIRECTORY
    ctrl.chooseUnit = function (val) {
        ctrl._insert_value.item['unit'] = val;
        if (val === 'external') {
            ctrl._insert_value.item['deparment_used'] = [];
        }
    };

    ctrl.pickUsedDepartment = function (val) {
        ctrl._insert_value.item['deparment_used'] = val;
    };

    ctrl.pickExtend = function(val,fields){
        if(Array.isArray(val)){
            ctrl._insert_value.item[fields.name] = val;
        }else{
            ctrl._insert_value.item[fields.name] = val.value;
        }
    }

    function getOrderNumber_service() {
        let dfd = $q.defer();
        directory_service.getOrderNumber(ctrl.master_directory).then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "getOrderNumber", getOrderNumber_service);
    }

    function generate_InsertValue() {

        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                'vi-VN': '',
                'en-US': '',
            },
            key: '',
            extend: '',
            item: {
            },
            isactive: true,
        };
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "insert");
    }

    ctrl.chooseFromDate_insert = function (val) {
        ctrl.fromDate_ErrorMsg = isValidFromDate(true, val, ctrl.to_date);
        ctrl.from_date = val ? val.getTime() : undefined;
    }

    ctrl.chooseToDate_insert = function (val) {
        ctrl.toDate_ErrorMsg = isValidToDate(true, ctrl.from_date, val);
        ctrl.to_date = val ? val.getTime() : undefined;
    }

    ctrl.onChangeNumber_insert = function () {
        let fromNumber = ctrl._insert_value.from_number ? parseInt(ctrl._insert_value.from_number) : 0;
        let toNumber = ctrl._insert_value.to_number ? parseInt(ctrl._insert_value.to_number) : 0;
        ctrl.Number_Error_Msg = (fromNumber > toNumber) ? Number_Error_Msg : '';
    }
    function insert_service() {
        var dfd = $q.defer();

        directory_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            ctrl._insert_value.value,
            ctrl._insert_value.item,
            ctrl.master_directory,
            ctrl._insert_value.isactive,
            
        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "insert");
            $("#modal_Directory_Insert").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "insert", insert_service);
    }

    //UPDATE MASTER DIRECTORY
    ctrl.chooseUnit_update = function (val) {
        ctrl._update_value.item['unit'] = val;
        // if (val === 'external') {
        //     ctrl._update_value.item['deparment_used'] = [];
        // }
    };

    ctrl.pickUsedDepartment_update = function (val) {
        ctrl._update_value.item['deparment_used'] = val;
    };

    ctrl.changeExtend_update = function(val,fields){
        ctrl._update_value.item[fields.name] = val.value;
    }

    ctrl.pickExtend_update = function(val,fields){
        if(Array.isArray(val)){
            ctrl._update_value.item[fields.name] = val;
        }else{
            ctrl._update_value.item[fields.name] = val.value;
        }
    }

    ctrl.prepareUpdate = function (item) {
        ctrl._update_value = angular.copy(item);
        ctrl._update_value.item ={};

        for(var i in ctrl.master_directory_item.extend){
            ctrl._update_value.item[ctrl.master_directory_item.extend[i].name] = ctrl._update_value[ctrl.master_directory_item.extend[i].name];
        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "update");
    }

    ctrl.chooseFromDate_update = function (val) {
        ctrl.fromDate_ErrorMsg = isValidFromDate(true, val, ctrl.to_date_update);
        ctrl.from_date_update = val ? val.getTime() : undefined;
    }

    ctrl.chooseToDate_update = function (val) {
        ctrl.toDate_ErrorMsg = isValidToDate(true, ctrl.from_date_update, val);
        ctrl.to_date_update = val ? val.getTime() : undefined;
    }

    ctrl.onChangeNumber_update = function () {
        let fromNumber = ctrl._update_value.from_number ? parseInt(ctrl._update_value.from_number) : 0;
        let toNumber = ctrl._update_value.to_number ? parseInt(ctrl._update_value.to_number) : 0;
        ctrl.Number_Error_Msg = (fromNumber > toNumber) ? Number_Error_Msg : '';
    }

    function update_service() {
        var dfd = $q.defer();

        directory_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            ctrl._update_value.value,
            ctrl._update_value.item,
            ctrl._update_value.isactive
            ).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "update");
                $("#modal_Directory_Update").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "update", update_service);
    }

    //DELETE  DIRECTORY

    ctrl.prepareDelete = function (item) {
        ctrl._delete_value = angular.copy(item);
        $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        directory_service.delete(
            ctrl._delete_value._id).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "Directory", "delete");
                $("#modal_Directory_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Directory", "delete", delete_service);
    }

    ctrl.chooseSubmissionDepartment = function (department) {
        ctrl._insert_value.item.submission_department = department.id;
    }

    ctrl.chooseSubmissionDepartment_update = function (department) {
        ctrl._update_value.item.submission_department = department.id;
    }
}]);
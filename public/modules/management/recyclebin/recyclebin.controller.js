


myApp.registerCtrl('recyclebin_controller', ['recyclebin_service', '$q', '$rootScope', function (recyclebin_service, $q, $rootScope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "RecycleBin", action: "load" },
        { name: "RecycleBin", action: "loadDetails" },
        { name: "RecycleBin", action: "loadDetailsForDelete" },
        { name: "RecycleBin", action: "loadDetailsForRestore" },
        { name: "RecycleBin", action: "count" },
        { name: "RecycleBin", action: "restore" },
        { name: "RecycleBin", action: "delete" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "recyclebin_controller";
        ctrl.recyclebins = [];
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 50;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "time", value: false, query: { title: 1 } };
        ctrl._notyetInit = true;
        ctrl._checkActive = false;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInfoModal = FrontendDomain + "/modules/management/recyclebin/views/info_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/management/recyclebin/views/delete_modal.html";
        ctrl._urlRestoreModal = FrontendDomain + "/modules/management/recyclebin/views/restore_modal.html";
        ctrl._urlDeleteAllModal = FrontendDomain + "/modules/management/recyclebin/views/deleteall_modal.html";
        ctrl._urlRestoreAllModal = FrontendDomain + "/modules/management/recyclebin/views/restoreall_modal.html";
    }

    /**function for logic */
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilterLoadRecycleBin() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }
    /**interact with view */
    ctrl.changeCheckActive = function (val) {
        ctrl._checkActive = val;
        ctrl.loadRecycleBin();
    }

    ctrl.changeActiveFilterData = function (val) {
        ctrl._activeFilterData = val;
        if (ctrl._checkActive === true) {
            ctrl.refreshData();
        }
    }

    function loadRecycleBin_service() {
        var dfd = $q.defer();
        ctrl.recyclebins = [];
        var filter = generateFilterLoadRecycleBin();
        recyclebin_service.load(filter.search, filter.isactive, ctrl.offset, ctrl.numOfItemPerPage, ctrl.sort.query).then(function (res) {
            ctrl.recyclebins = res.data;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadRecycleBin = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "load", loadRecycleBin_service);
    }

    function countRecycleBin_service() {
        var dfd = $q.defer();
        ctrl.recyclebins = [];
        var filter = generateFilterLoadRecycleBin();
        recyclebin_service.count(filter.search, filter.isactive).then(function (res) {
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

    ctrl.countRecycleBin = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "count", countRecycleBin_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.loadRecycleBin());
        dfdAr.push(ctrl.countRecycleBin());
        $q.all(dfdAr);
    }

    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.loadRecycleBin());
        dfdAr.push(ctrl.countRecycleBin());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }
    init();

    /**show Infomation Details*/
    function loadDetails_service(id){
        return function(){
            var dfd = $q.defer();
            ctrl._info_value = {};
            recyclebin_service.loadDetails(id).then(function (res) {
                ctrl._info_value = res.data[0];
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.assignInfo = function (val) {
        $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "loadDetails", loadDetails_service(val._id));
    }

    /**delete */
    function loadDetailsForDelete_service(id){
        return function(){
            var dfd = $q.defer();
            ctrl._delete_value = {};
            recyclebin_service.loadDetails(id).then(function (res) {
                ctrl._delete_value = res.data[0];
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    function generate_resetDeleteValue(val) {
        $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "loadDetailsForDelete", loadDetailsForDelete_service(val._id));
    }

    ctrl.openModal_delete = function(){
        $rootScope.statusValue.generate(ctrl._ctrlName, "RecycleBin", "delete");
    }

    ctrl.prepareDelete = function (val) {
        ctrl.openModal_delete();
        generate_resetDeleteValue(val);
    }

    function delete_service(idar) {
        return function(){
            var dfd = $q.defer();
            recyclebin_service.delete(idar).then(function () {
                $("#modal_RecycleBin_Delete").modal('hide');
                ctrl.loadRecycleBin();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.delete_func = function (type) {
        if (type === "all"){
            let idar=[];
            for (var i in ctrl.recyclebins){
                idar.push(ctrl.recyclebins[i]._id);
            }
            return $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "delete", delete_service(idar));
        }else{
            return $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "delete", delete_service([ctrl._delete_value._id]));
        }
    }

    /**restore */
    function loadDetailsForRestore_service(id){
        return function(){
            var dfd = $q.defer();
            ctrl._restore_value = {};
            recyclebin_service.loadDetails(id).then(function (res) {
                ctrl._restore_value = res.data[0];
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    function generate_resetRestoreValue(val) {
        $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "loadDetailsForRestore", loadDetailsForRestore_service(val._id));
    }

    ctrl.openModal_restore = function(){
        $rootScope.statusValue.generate(ctrl._ctrlName, "RecycleBin", "restore");
    }
    ctrl.prepareRestore = function (val) {
        ctrl.openModal_restore();
        generate_resetRestoreValue(val);
    }

    function restore_service(data) {
        return function(){
            var dfd = $q.defer();
            recyclebin_service.restore(data).then(function () {
                $("#modal_RecycleBin_Restore").modal('hide');
                ctrl.loadRecycleBin();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.restore_func = function (type) {
        var data =[];
        if (type === "all"){
            for (var i in ctrl.recyclebins){
                var check  = true;
                for (var j in data){
                    if (data[j].collection === ctrl.recyclebins[i].collection){
                        check = false;
                        data[j].idar.push(ctrl.recyclebins[i]._id);
                        break;
                    }
                }
                if (check){
                    data.push({
                        idar:[ctrl.recyclebins[i]._id],
                        collection: ctrl.recyclebins[i].collection,
                        dbname : ctrl.recyclebins[i].dbname
                    });
                }
            }
        }else{
            data =[
                {
                    idar:[ctrl._restore_value._id],
                    dbname: ctrl._restore_value.dbname,
                    collection : ctrl._restore_value.collection
                }
            ];
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "RecycleBin", "restore", restore_service(data));
    }

}]);



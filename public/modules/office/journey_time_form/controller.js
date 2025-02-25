

myApp.registerCtrl('journey_time_form_controller', ['journey_time_form_service', '$q', '$rootScope','$filter', function (journey_time_form_service, $q, $rootScope,$filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "JTF", action: "init" },
        { name: "JTF", action: "load" },
        { name: "JTF", action: "count" },
        { name: "JTF", action: "countPending" },
        { name: "JTF", action: "insert" },
        { name: "JTF", action: "update" },
        { name: "JTF", action: "delete" }
    ];
    var ctrl = this;
    var idEditor = "insertJTF_content";
    /** init variable */
    {
        ctrl._ctrlName = "journey_time_form_controller";
        ctrl.tab = "my_journey_time_form";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl.journey_time_forms = [];

        ctrl.LFT =[];
        ctrl._notyetInit = true;
        ctrl.LeaveFormType_Config = {
            master_key: "leave_form_type",
            load_details_column: "value"
        };

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl._searchByKeyToFilterData = "";
        ctrl._filterStatus= "";
        ctrl._filterType= "";
        ctrl._filterFromDate = "";
        ctrl._filterToDate = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        //ctrl._urlInsertModal = FrontendDomain + "/modules/journey_time_form/views/insert_modal.html";
    }

    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.chooseFromDate = function(val){
        if(val){
            ctrl._filterFromDate = val.getTime().toString();
        }else{
            ctrl._filterFromDate =val;
        }
      
        ctrl.refreshData();
    }

    ctrl.chooseToDate = function(val){
        if(val){
            ctrl._filterToDate = val.getTime().toString();
        }else{
            ctrl._filterToDate = val;
        }
        ctrl.refreshData();
    }

    ctrl.chooseStatus = function(val){
        ctrl._filterStatus = val.key;
        ctrl.refreshData();
    }

    ctrl.chooseType = function(val){
        ctrl._filterType = val.value;
        ctrl.refreshData();
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        ctrl.refreshData();
    }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate);
        }

        if (ctrl._filterToDate) {
            obj.to_date = angular.copy(ctrl._filterToDate);
        }


        if (ctrl._filterType) {
            obj.type = angular.copy(ctrl._filterType);
        }
        return obj;
    }


 

    /* Init and load necessary resource to the module. */










    function load_service() {
        var dfd = $q.defer();
        ctrl.journey_time_forms = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        if(ctrl.tab ==='journey_time_handle' ){
            journey_time_form_service.loadLF(_filter.search,_filter.type, _filter.from_date,_filter.to_date,ctrl.tab , ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
                ctrl.journey_time_forms = res.data;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        }else{
            journey_time_form_service.load(_filter.search,_filter.type, _filter.from_date,_filter.to_date,ctrl.tab , ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
                ctrl.journey_time_forms = res.data;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        }

        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "JTF", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        if(ctrl.tab ==='journey_time_handle'){
            journey_time_form_service.countLF(_filter.search,_filter.type,  _filter.from_date,_filter.to_date, ctrl.tab ).then(function (res) {
                ctrl.totalItems = res.data.count;
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        }
        else{
            journey_time_form_service.count(_filter.search,_filter.type,  _filter.from_date,_filter.to_date, ctrl.tab ).then(function (res) {
                ctrl.totalItems = res.data.count;
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        }

        return dfd.promise;

    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "JTF", "count", count_service);
    }

    function countPending_service() {
        var dfd = $q.defer();
        journey_time_form_service.countPending().then(function (res) {
            ctrl.numberPending = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countPending = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "JTF", "countPending", countPending_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        if($filter('checkRule')(['Office.JourneyTimeForm.Approval'])){
            dfdAr.push(ctrl.countPending());
        }
        $q.all(dfdAr);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(ctrl.countPending());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

}]);



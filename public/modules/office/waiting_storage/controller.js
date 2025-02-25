

myApp.registerCtrl('waiting_storage_controller', ['waiting_storage_service', '$q', '$rootScope', '$scope', function (waiting_storage_service, $q, $rootScope, $scope) {

    /**declare variable */
    const _statusValueSet = [
        { name: "waiting_storage", action: "init" },
        { name: "waiting_storage", action: "load" },
        { name: "waiting_storage", action: "count" },
        { name: "waiting_storage", action: "countPending" },
        { name: "waiting_storage", action: "getNumber" },

        { name: "WFP", action: "loadDetails" },
    ];

    $scope.forms = {};

    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "waiting_storage_controller";
        ctrl.tab = "waiting_storage";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
        ctrl.dispatch_waiting_storage = [];
        ctrl._insert_value = {};

        ctrl.Departments =[];
        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";
        ctrl._filterODB= "";
        ctrl._filterODT = "";
        ctrl._filterPriority ="";
        ctrl._filterReceiveMethod = "";

        ctrl.IncommingDispatchPririoty_Config = {
            master_key: "incomming_dispatch_priority",
            load_details_column: "value"
        };

        ctrl.MethodOfSendingDispatchTo_Config = {
            master_key: "method_of_sending_dispatch_to",
            load_details_column: "value"
        };

        ctrl.Document_type_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };
        ctrl.OutgoingDispatchBook_Config = {
            master_key: "outgoing_dispatch_book",
            load_details_column: "value",
        };
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/waiting_storage/views/insert_storage_modal.html";
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    /**function for logic */
    ctrl.pickCurrentItem = function (item) {
        ctrl.currentItem = item
    }

    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.pickODT = function(val){
        ctrl._filterODT = val.value;
        ctrl.refreshData();
    }

    ctrl.choosePriority = function(val){
        ctrl._filterPriority = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseReceiveMethod = function(val){
        ctrl._filterReceiveMethod = val.value;
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

        if (ctrl._filterODT) {
            obj.type = angular.copy(ctrl._filterODT);
        }

        if (ctrl._filterPriority) {
            obj.priority = angular.copy(ctrl._filterPriority);
        }

        if (ctrl._filterReceiveMethod) {
            obj.receive_method = angular.copy(ctrl._filterReceiveMethod);
        }

        return obj;
    }
    /* Init and load necessary resource to the module. */

    function load_service() {
        var dfd = $q.defer();
        ctrl.dispatch_waiting_storage = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        waiting_storage_service.load(_filter.search, _filter.priority,_filter.receive_method,_filter.type,
            ctrl.tab , ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.dispatch_waiting_storage = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        waiting_storage_service.count(_filter.search, _filter.od_book, _filter.priority,_filter.receive_method,_filter.type, ctrl.tab).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "count", count_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }

    function init() {
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

    init();

    ctrl.prepareInsert = function (params) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "waiting_storage", "insert");
        var currentYear = new Date().getFullYear();
        ctrl._insert_value = {
          title: params.title,
          organ_id: '000.00.45.429',
          file_notation: `${params.odb_book}-${params.number}`,
          language: "",
          rights: "",
          description: "",
          year: currentYear,
          maintenance_time: {
            amount: 1,
            unit: "day",
          },
          reference: [
            {
              type: "OutgoingDispatch",
              id: params.id,
            },
          ],
        };
    };

    function insert_service() {
        var dfd = $q.defer();
        waiting_storage_service.insert(
            ctrl._insert_value.title,
            ctrl._insert_value.organ_id,
            ctrl._insert_value.file_notation,
            ctrl._insert_value.language,
            ctrl._insert_value.rights,
            ctrl._insert_value.year,
            ctrl._insert_value.description,
            ctrl._insert_value.maintenance_time,
            ctrl._insert_value.reference,
        ).then(function () {
            ctrl.refreshData();
            $(".office-waiting-storage-feature #modal_insert_storage").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "insert", insert_service);
    }

    /**load File */
    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            waiting_storage_service.loadFileInfo(params.id, params.name).then(function (res) {
                dfd.resolve({
                    display: res.data.display,
                    embedUrl: res.data.url,
                    guid: res.data.guid
                });
                res = undefined;
                dfd = undefined;
            }, function (err) {
            });
            return dfd.promise;
        }
    }

    $scope.$on('detailsbox.hide', function () {
        ctrl.refreshData();
    });
}]);



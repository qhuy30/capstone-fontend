myApp.registerCtrl('dispatch_outgoing_controller', ['dispatch_outgoing_service', '$q', '$rootScope', '$filter', function (dispatch_outgoing_service, $q, $rootScope, $filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "OD", action: "init" },
        { name: "OD", action: "load" },
        { name: "OD", action: "count" },
        { name: "OD", action: "countPending" },
        { name: "OD", action: "getNumber" },
        { name: "OD", action: "insert" },
    ];
    var ctrl = this;
    var idEditor = "insertOD_excerpt";    
    const Expiration_Date_Error_Msg = $filter('l')('ExpirationDateErrorMsg');
    /** init variable */
    {
        ctrl._ctrlName = "dispatch_outgoing_controller";
        ctrl.tab = "dispatchAway";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
        ctrl.dispatch_outgoings = [];

        ctrl.Departments =[];
        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";
        ctrl._filterODB= "";
        ctrl._filterODT = "";
        ctrl._filterPriority ="";
        ctrl._filterReceiveMethod = "";
        ctrl._filterODB_insert = "";

        ctrl.OutgoingDispatchBook_Config = {
            master_key: "outgoing_dispatch_book",
            load_details_column: "value"
        };

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.IncommingDispatchBook_Config = {
            master_key: "incomming_dispatch_book",
            load_details_column: "value"
        };

        ctrl.IncommingDispatchPririoty_Config = {
            master_key: "incomming_dispatch_priority",
            load_details_column: "value"
        };

        ctrl.MethodOfSendingDispatchTo_Config = {
            master_key: "method_of_sending_dispatch_to",
            load_details_column: "value"
        };

        ctrl.KindOfDispatchTo_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/office/outgoing_dispatch/views/insert_modal.html";
    }

    /**function for logic */
    ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
        let today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isInsert) {
            return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
        } else {
            return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
        }
    }

    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.pickODB = function(val){
        ctrl._filterODB = val.value;
        ctrl.refreshData();
    }

    ctrl.pickODT = function(val){
        ctrl._filterODT = val.value;
        ctrl.refreshData();
    }

    ctrl.pickODB_insert = function (val){
        ctrl._insert_value.outgoing_dispatch_book = val.value;     
        ctrl.refreshData();
    }

    ctrl.pickDAT_insert = function(val){
        ctrl._insert_value.type = val.value;
    }

    ctrl.choosePriority_insert = function(val){
        ctrl._insert_value.priority = val.value;
    }

    ctrl.chooseDocumentDate_insert = function (val) {
        ctrl._insert_value.document_date = val.getTime();
    }

    ctrl.chooseTransferDate_insert = function (val) {
        ctrl._insert_value.transfer_date = val.getTime();
    }

    ctrl.chooseExpirationDate_insert = function (val) {
        ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
        ctrl._insert_value.expiration_date = val ? val.getTime() : null;
    }

    ctrl.choosePriority = function(val){
        ctrl._filterPriority = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseReceiveMethod = function(val){
        ctrl._filterReceiveMethod = val.value;
        ctrl.refreshData();
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        ctrl.refreshData();
    }

    ctrl.pickUserAndDepartment_insert = function (val) {
        ctrl._insert_value.userAndDepartment = val;
    }

    ctrl.removeOutgoingDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.outgoing_documents) {
            if (ctrl._insert_value.outgoing_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.outgoing_documents[i]);
            }
        }
        ctrl._insert_value.outgoing_documents = angular.copy(temp);
    }

    ctrl.removeAttachDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.attach_documents) {
            if (ctrl._insert_value.attach_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.attach_documents[i]);
            }
        }
        ctrl._insert_value.attach_documents = angular.copy(temp);
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

        if (ctrl._filterODB) {
            obj.da_book = angular.copy(ctrl._filterODB);
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

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr=[];
        for (var i in ctrl.dispatch_outgoings) {
            if (ctrl.dispatch_outgoings[i]._id === params.params) {
                ctrl.dispatch_outgoings[i].check = params.value;
            }
            if (ctrl.dispatch_outgoings[i].check && ctrl.dispatch_outgoings[i].status ==='draft' ) {
                ctrl.checkIdAr.push(ctrl.dispatch_outgoings[i]._id);
                ctrl.checkAr.push(ctrl.dispatch_outgoings[i]);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.dispatch_outgoings.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        ctrl.checkAr=[];
        for (var i in ctrl.dispatch_outgoings) {
            ctrl.dispatch_outgoings[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr=[];
        for (var i in ctrl.dispatch_outgoings) {
            ctrl.dispatch_outgoings[i].check = params;
            if (ctrl.dispatch_outgoings[i].check && ctrl.dispatch_outgoings[i].status ==='draft') {
                ctrl.checkIdAr.push(ctrl.dispatch_outgoings[i]._id);
                ctrl.checkAr.push(ctrl.dispatch_outgoings[i]);
            }
        }
    }
    ctrl.loadPriority_details = function(params){
        var dfd = $q.defer();
        for(var i in ctrl.Priority){
            if(ctrl.Priority[i].key === params.id){
                dfd.resolve(ctrl.Priority[i]);
                break;
            }
        }
        return dfd.promise;
    }

    ctrl.loadReceiveMethod_details = function(params){
        var dfd = $q.defer();
        for(var i in ctrl.ReceiveMethod){
            if(ctrl.ReceiveMethod[i].key === params.id){
                dfd.resolve(ctrl.ReceiveMethod[i]);
                break;
            }
        }
        return dfd.promise;
    }

    function load_service() {
        var dfd = $q.defer();
        ctrl.outgoings_dispatch = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        dispatch_outgoing_service.load(_filter.search, _filter.da_book, _filter.priority,_filter.receive_method,_filter.type,
            ctrl.tab , ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.outgoings_dispatch = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        dispatch_outgoing_service.count(_filter.search, _filter.da_book, _filter.priority,_filter.receive_method,_filter.type, ctrl.tab).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "count", count_service);
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

    /**load File */
    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            dispatch_outgoing_service.loadFileInfo(params.id, params.name).then(function (res) {
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

    // Insert
    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "insert");
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        ctrl._insert_value = {
            code: "",
            orderNumber: "",
            outgoing_dispatch_book: "",
            type: "",
            document_date: myToday.getTime(),
            priority: "",
            transfer_date: myToday.getTime(),
            expiration_date: myToday.getTime(),
            note: "",
            document_quantity: 1,
            department: "",
            userAndDepartment: {
                user: [],
                department: []
            },
            outgoing_documents: [],
            attach_documents: [],
            signers: [],
            excerpt: "",
        };

    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "insert", insert_OD_service);
    }

    function insert_OD_service() {
        var dfd = $q.defer();

        dispatch_outgoing_service.insert(
            ctrl._insert_value.code,
            ctrl._insert_value.orderNumber,
            ctrl._insert_value.outgoing_dispatch_book,
            ctrl._insert_value.type,
            ctrl._insert_value.document_date,
            ctrl._insert_value.priority,
            ctrl._insert_value.transfer_date,
            ctrl._insert_value.expiration_date,
            ctrl._insert_value.note,
            ctrl._insert_value.document_quantity,
            ctrl._insert_value.department,
            ctrl._insert_value.userAndDepartment.user,
            ctrl._insert_value.userAndDepartment.department,
            ctrl._insert_value.outgoing_documents,
            ctrl._insert_value.attach_documents,
            ctrl._insert_value.signers,
            ctrl._insert_value.excerpt
        ).then(function () {
            $("#modal_OD_Insert").modal("hide");
            ctrl.load();
            ctrl.switchTab('separateDispatch');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });

        return dfd.promise;
    }
}]);



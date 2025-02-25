
myApp.registerCtrl('car_main_controller',
    ['$filter','$location', function ($filter, $location) {
        var ctrl = this;
        /** init variable */
        {
            ctrl.tab = "car_registration";
            ctrl.show_tab_car_registration = false;

            ctrl.tabPermission = {
                'car_list': false,
                'car_registration': false,
                'car_calendar': false,
                'my_calendar': false,
                'location_list': false,
                'card_list': false,
            }
        }
        const RULE_CAR = {
            USE:"Office.CarManagement.Use",
            CREATE:"Office.CarManagement.Create",
            APPROVE_DEPARTMENT:"Office.CarManagement.Review",
            CONFIRM:"Office.CarManagement.Confirm",
            APPROVE_LEAD:"Office.CarManagement.Approve",
            APPROVE_LEAD_EXTERNAL:"Office.CarManagement.ApproveExternal",
        };

        const rulesToPermissions = {
            [RULE_CAR.USE]: ['my_calendar'],
            [RULE_CAR.CREATE]: ['car_registration'],
            [RULE_CAR.APPROVE_DEPARTMENT]: ['car_registration'],
            [RULE_CAR.CONFIRM]: ['car_registration', 'car_calendar', 'car_list', 'location_list', 'card_list'],
            [RULE_CAR.APPROVE_LEAD]: ['car_registration', 'car_calendar'],
            [RULE_CAR.APPROVE_LEAD_EXTERNAL]: ['car_registration', 'car_calendar']
        };

        ctrl.switchTab = function (val) {
            ctrl.tab = val;
            $location.url("/car_management?tab=" + val);
            setUrlContent();
        }

        function setUrlContent() {
            ctrl.tab = ctrl.tabPermission[ctrl.tab] ? ctrl.tab : 'my_calendar';
            switch (ctrl.tab) {
                case "car_list":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/car_list/car_list.html";
                    break;
                case "car_registration":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/car_registration/car_registration.html";
                    break;
                case "car_calendar":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/car_calendar/car_calendar.html";
                    break;
                case "my_calendar":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/car_calendar/my_calendar.html";
                    break;
                case "location_list":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/location_list/location_list.html";
                    break;
                case "card_list":
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/card_list/card_list.html";
                    break;
                default:
                    ctrl._urlMain = FrontendDomain + "/modules/office/car_management/views/car_calendar/my_calendar.html";
                    break;
            }
        }

        function init(){
            Object.entries(rulesToPermissions).forEach(([rule, permissions]) => {
                if ($filter('hasRule')(rule)) {
                    permissions.forEach(permission => {
                        ctrl.tabPermission[permission] = true;
                    });
                }
            });

            const tab = $location.search().tab;
            ctrl.tab = tab || "my_calendar";

            if(ctrl.tabPermission['car_registration']){
                ctrl.tab = tab || "car_registration";
            }

            setUrlContent();
        }
        init();
}]);

myApp.registerCtrl('car_list_controller', ['car_list_service', '$q', '$rootScope', '$filter', function (car_list_service, $q, $rootScope, $filter) {

    const _statusValueSet = [

        //carList
        { name: "CarManagement", action: "getOrderNumber" },
        { name: "CarManagement", action: "load" },
        { name: "CarManagement", action: "count" },
        { name: "CarManagement", action: "insert" },
        { name: "CarManagement", action: "update" },
        { name: "CarManagement", action: "delete" },
    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "car_list_controller";
        ctrl.mater_key = "vehicle_list"
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.carManagement = [];

        ctrl._notyetInit = true;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInsertModal = FrontendDomain + '/modules/office/car_management/views/car_list/insert_modal.html';
        ctrl._urlUpdateModal = FrontendDomain + '/modules/office/car_management/views/car_list/update_modal.html';
        ctrl._urlDeleteModal = FrontendDomain + '/modules/office/car_management/views/car_list/delete_modal.html';

    }

    ctrl.load = function (val) {
        if (val != undefined) {
            ctrl.offset = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "load", load_service);
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "getOrderNumber", getOrderNumber_service);
    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "count", count_service);
    }



    function generateFilter() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }


    function count_service() {
        var dfd = $q.defer();
        var filter = generateFilter();
        car_list_service.count(filter.search, ctrl.mater_key).then(function (res) {
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

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }



    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }



    //INSERT 

    function getOrderNumber_service() {
        let dfd = $q.defer();
        car_list_service.getOrderNumber(ctrl.mater_key).then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }


    function generate_InsertValue() {
        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                'vi-VN': '',
                'en-US': '',
            },
            licensePlate: '',
            seatingCapacity: 0,
            isactive: true,
        };
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "insert");
    }

    function insert_service() {
        var dfd = $q.defer();
        var value = ctrl._insert_value.title['en-US'].toLowerCase()
        var item = {
            licensePlate: ctrl._insert_value.licensePlate,
            seatingCapacity: ctrl._insert_value.seatingCapacity
        }

        car_list_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            value,
            item,
            ctrl.mater_key,
            ctrl._insert_value.isactive,

        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "insert");
            $("#modal_CarManagement_Insert").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "insert", insert_service);
    }


    //LOAD

    function load_service() {
        var dfd = $q.defer();
        let _filter = generateFilter();
        ctrl.carManagement = [];
        car_list_service.load(_filter.search, ctrl.mater_key, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.carManagement = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }




    //UPDATE
    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        var item = {
            licensePlate: ctrl._update_value.licensePlate,
            seatingCapacity: ctrl._update_value.seatingCapacity
        }
        car_list_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            item,
            ctrl._update_value.value,
            ctrl._update_value.isactive,
        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
            $("#modal_CarMnanagement_Update").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "update", update_service);
    }

    //DELETE 

    ctrl.prepareDelete = function (val) {
        ctrl._delete_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        car_list_service.delete(
            ctrl._delete_value._id).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "delete");
                $("#modal_CarMnanagement_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "delete", delete_service);
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
}]);

myApp.registerCtrl('car_registration_controller',
    ['car_service', '$q', '$rootScope', '$filter', '$element', '$location', 'localStorage',
        function (car_service, $q, $rootScope, $filter, $element, $location, $localStorage) {

            const _statusValueSet = [

                //carList
                { name: "CarManagement", action: "update" },
                { name: "CarManagement", action: "insert" },
                { name: "CarManagement", action: "load" },
                { name: "CarManagement", action: "count" },
                { name: "CarManagement", action: "delete" },
                { name: "CarManagement", action: "load_car_list_service" },
                { name: "CarManagement", action: "load_card_vehicle_list" },
                { name: "CarManagement", action: "approve_department" },
                { name: "CarManagement", action: "reject_department" },
                { name: "CarManagement", action: "approve_car_management" },
                { name: "CarManagement", action: "reject_car_management" },
                { name: "CarManagement", action: "approve_lead" },
                { name: "CarManagement", action: "reject_lead" },
                { name: "CarManagement", action: "approve_card_management" },
                { name: "CarManagement", action: "edit_card_management" },
                { name: "CarManagement", action: "reject_card_management" },
                { name: "CarManagement", action: "manager_assign_card" },
                { name: "CarManagement", action: "creator_receive_card" },
                { name: "CarManagement", action: "creator_return_card" },
                { name: "CarManagement", action: "manager_receive_card" },
                { name: "CarManagement", action: "load_driver_list" },
                { name: "CarManagement", action: "approve_lead_external" },
                { name: "CarManagement", action: "reject_lead_external" },

                // Recall
                { name: "CarManagement", action: "request_cancel" },
                { name: "CarManagement", action: "reject_recall" },
                { name: "CarManagement", action: "approve_recall_department" },
                { name: "CarManagement", action: "approve_recall_car_management" },
                { name: "CarManagement", action: "approve_recall_lead" },

            ];
            var ctrl = this;

            /** init variable */
            {
                ctrl._ctrlName = "car_registration_controller";
                ctrl.currentPage = 1;
                ctrl.numOfItemPerPage = 15;
                ctrl.totalItems = 0;
                ctrl.offset = 0;
                ctrl.sort = {
                    name: "_id",
                    value: false,
                    query: { _id: -1, priority: -1 }
                };

                ctrl.filterCardCredit = [
                    { status: true }
                ]

                ctrl.sortRegistered = { name: "_id", value: false, query: { _id: -1, priority: -1 } };

                //data
                ctrl._insert_value = {};
                ctrl.carRegistrationList = [];
                ctrl._delete_value = {};
                ctrl.carManagement = [];
                ctrl.cardList = [];
                ctrl._update_value = {};
                ctrl.messageConfirm = '';
                ctrl._searchByKeyToFilterData = "";

                ctrl.checkbox_needhandle = false;
                ctrl.checkbox_handled = false;
                ctrl.checkbox_rejected = false;
                ctrl.checkbox_responsibility = false;
                ctrl.checkbox_created = false;
                ctrl.checkbox_card_delivery = false;

                ctrl.show_checkbox_needhandle = false;
                ctrl.show_checkbox_handled = false;
                ctrl.show_checkbox_rejected = false;
                ctrl.show_checkbox_responsibility = false;
                ctrl.show_checkbox_created = false;
                ctrl.show_checkbox_card_delivery = false;

                ctrl.function_apply_suggestions = ['registration_car'];

                ctrl.now = new Date();

                $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet, 'doing');
                ctrl._urlUpdateModal = FrontendDomain + '/modules/office/car_management/views/car_registration/car_registration_update_modal.html';
                ctrl._urlInsertModal = FrontendDomain + '/modules/office/car_management/views/car_registration/car_registration_insert_modal.html';
                ctrl._urlDeleteModal = FrontendDomain + '/modules/office/car_management/views/car_registration/car_registration_delete_modal.html';
                ctrl._urlAssessModal = FrontendDomain + '/modules/office/car_management/views/car_registration/car_registration_assess_modal.html';
                ctrl._urlDepartmentApprove = FrontendDomain + '/modules/office/car_management/views/car_registration/car_registration_lead_deparment_approve_update.html';
                ctrl._hintNoteSet = [
                    'I agree',
                    'I refuse',
                    'Incorrect information',
                    'Out of cars',
                    'Out of cards',
                ];
                ctrl.location_config = {
                    master_key: "location_list",
                    load_details_column: "value",
                };

                ctrl.vehicle_list_config = {
                    master_key: "vehicle_list",
                    load_details_column: "value",
                };

                ctrl.card_list_config = {
                    master_key: "card_list",
                    load_details_column: "value",
                };

                ctrl.columns = {
                    index:{
                        title: 'STT',
                        show: true
                    },
                    title:{
                        title: $filter('l')('Title'),
                        show: true
                    },
                    timeToGo:{
                        title: $filter('l')('Time to go'),
                        show: true
                    },
                    pickUpTime:{
                        title: $filter('l')('Pick up time'),
                        show: true
                    },
                    startingPlace:{
                        title: $filter('l')('Starting place'),
                        show: true
                    },
                    destination:{
                        title: $filter('l')('Destination'),   
                        show: true
                    },
                    departmentProposed:{
                        title: $filter('l')('Department proposed'),
                        show: true
                    },
                    participatingDepartments:{
                        title: $filter('l')('Participating departments'),
                        show: true
                    },
                    cardCar:{
                        title: $filter('l')('Card/Car'),
                        show: true
                    },
                    driver:{
                        title: $filter('l')('Driver'),
                        show: true
                    },
                    status:{
                        title: $filter('l')('Status'),
                        show: true
                    },
                    action:{
                        title: $filter('l')('Action'),
                        show: true
                    }
                }


                ctrl.columnsArray =  Object.keys(ctrl.columns).map(key => {
                    return {
                        key: key,
                        title: ctrl.columns[key].title,
                        show: ctrl.columns[key].show
                    };
                })
                
                ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
            }

            ctrl.set_hint_note = function(note) {
                ctrl._assess_value.note = $filter('l')(note);
            }

            ctrl.set_hint_note_department = function(note) {
                ctrl._update_value.note = $filter('l')(note);
            }

            ctrl.updateColumnVisibility = function(key, show) {
                ctrl.columns[key].show = show;
                saveShowColumn();
            }; 

            function saveShowColumn(){
                $localStorage.setItem(`${ctrl._ctrlName}_columns_show`, ctrl.columns)
            }

            function getShowColumn(){
                return $localStorage.getItem(`${ctrl._ctrlName}_columns_show`)
            }

            const STATUS_FLOW = {
                REGISTER: "register",
                RECALL: "recall"
            };

            const STATUS_CAR = {
                CREATED: "Created",
                LEADER_DEPARTMENT_APPROVED: "reviewer_approved",
                CONFIRMER_APPROVED: "manager_approved",
                LEAD_APPROVED_CAR: "head_approved_car",
                LEAD_EXTERNAL_APPROVED: "head_external_approved",
                CREATOR_RECEIVED_CARD: 'creator_received_card',
                CREATOR_RETURNED_CARD: 'creator_returned_card',
                MANAGER_RECEIVED_CARD: 'manager_received_card',
                REJECTED: "rejected",
                CANCELLED: "cancelled",
                RECALLED:"recalled",
            };

            const RULE_CAR = {
                USE: "Office.CarManagement.Use",
                CREATED: "Office.CarManagement.Create",
                APPROVE_DEPARTMENT: "Office.CarManagement.Review",
                CONFIRM: "Office.CarManagement.Confirm",
                APPROVE_LEAD: "Office.CarManagement.Approve",
                APPROVE_LEAD_EXTERNAL: "Office.CarManagement.ApproveExternal",
            };

            ctrl.onSelectCar = function () {
                ctrl._update_value.card_vehicle_id = null;
                ctrl._update_value.car_id = null;
            }

            function generateFilter() {
                var obj = {};
                obj.checks = [];
                const CHECKS_ON_UI = {
                    CREATED: "created",
                    NEED_HANDLE: "need_handle",
                    HANDLED: "handled",
                    REJECTED: "rejected",
                    RESPOSIBILITY_DEPARTMENT: "responsibility",
                    CARD_NOT_RETURNED: "card_not_returned",
                }

                if (ctrl.checkbox_needhandle && ctrl.show_checkbox_needhandle) {
                    obj.checks.push(CHECKS_ON_UI.NEED_HANDLE);
                }

                if (ctrl.checkbox_handled && ctrl.show_checkbox_handled) {
                    obj.checks.push(CHECKS_ON_UI.HANDLED);
                }

                if (ctrl.checkbox_rejected && ctrl.show_checkbox_rejected) {
                    obj.checks.push(CHECKS_ON_UI.REJECTED);
                }

                if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
                    obj.checks.push(CHECKS_ON_UI.CREATED);
                }

                if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
                    obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
                }

                if (ctrl.checkbox_card_delivery && ctrl.show_checkbox_card_delivery) {
                    obj.checks.push(CHECKS_ON_UI.CARD_NOT_RETURNED);
                }

                if (ctrl._searchByKeyToFilterData) {
                    obj.search = ctrl._searchByKeyToFilterData;
                }
                return obj;
            }

            function resetPaginationInfo() {
                ctrl.currentPage = 1;
                ctrl.totalItems = 0;
                ctrl.offset = 0;
            }

            ctrl.refreshData = function () {
                var dfdAr = [];
                resetPaginationInfo();
                dfdAr.push(ctrl.load());
                dfdAr.push(ctrl.count());
                dfdAr.push(ctrl.load_car_list_service());
                $q.all(dfdAr);
            }

            //load
            function getPermissionProperties(item) {
                let allow_edit = false;
                let allow_assess_department = false;
                let allow_assess_car_management = false;
                let allow_assess_lead = false;
                let allow_assess_card_management = false;
                let allow_manager_assign_card = false;
                let allow_creator_receive_card = false;
                let allow_creator_return_card = false;
                let allow_manager_receive_card = false;
                let allow_delete = false;
                let allow_recall = false;
                let allow_cancel = false;
                let allow_assess_lead_external = false;

                //recall
                let allow_assess_recall_department = false;
                let allow_assess_recall_car_management = false;
                let allow_assess_recall_lead = false;
                let allow_request_cancel = false;
                let allow_reject_recall = false;


                let allow_edit_card = false;

                let statusShow = "";

                if (item.flow_status === STATUS_FLOW.REGISTER) {
                    switch (item.status) {
                        case STATUS_CAR.CREATED:
                            if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                                allow_assess_department = true;
                            }

                            if ($rootScope.logininfo.username === item.username) {
                                allow_edit = true;
                                allow_delete = true;
                            }
                            statusShow = "Registered";
                            break;
                        case STATUS_CAR.LEADER_DEPARTMENT_APPROVED:
                            if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                                allow_assess_car_management = true;
                            }

                            if ($rootScope.logininfo.username === item.username && item.time_to_go*1 > Date.now()) {
                                allow_cancel = true;
                            }

                            statusShow = "DepartmentLeaderApproved";
                            break;
                        case STATUS_CAR.CONFIRMER_APPROVED:
                            if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                                allow_assess_lead = true;
                            }

                            if ($rootScope.logininfo.username === item.username && item.time_to_go*1 > Date.now()) {
                                allow_cancel = true;
                            }

                            statusShow = "VehicleManagementSpecialistApproved";
                            break;
                        case STATUS_CAR.LEAD_APPROVED_CAR:
                            statusShow = "LeadApproved";

                            if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD_EXTERNAL)) {
                                allow_assess_lead_external = true;
                            }

                            break;
                        
                        case STATUS_CAR.LEAD_EXTERNAL_APPROVED:
                            if (!item.assign_card) {
                                statusShow = "Approved";
                            } else {
                                statusShow = "LeadExternalApproved";
                            }

                            if ($rootScope.logininfo.username === item.username && item.assign_card) {
                                allow_creator_receive_card = true;
                            }

                            //Request cancel
                            if ($rootScope.logininfo.username === item.username) {
                                allow_request_cancel = true;
                            }

                            if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                                allow_request_cancel = true;
                            }

                            if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                                allow_request_cancel = true;
                            }

                            // if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                            //     allow_request_cancel = true;
                            // }

                            break;
                        case STATUS_CAR.CREATOR_RECEIVED_CARD:
                            statusShow = "DepartmentReceivedCard";
                            if ($rootScope.logininfo.username === item.username) {
                                allow_creator_return_card = true;
                            }
                            break;
                        case STATUS_CAR.CREATOR_RETURNED_CARD:
                            statusShow = "DepartmentReturnedCard";
                            if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                                allow_manager_receive_card = true;
                            }

                            if ($rootScope.logininfo.username === item.username && new Date().getTime() < item.time_to_go) {
                                allow_recall = true;
                            }

                            break;
                        case STATUS_CAR.MANAGER_RECEIVED_CARD:
                            statusShow = "Completed";
                            break;
                        case STATUS_CAR.CANCELLED:
                            statusShow = "Cancelled";
                            break;
                    }

                } else {
                    switch (item.status) {
                        case STATUS_CAR.CREATED:
                            statusShow = "RequestedRecall";
                            if ($filter('checkRuleDepartmentRadio')(item.department, RULE_CAR.APPROVE_DEPARTMENT)) {
                                allow_assess_recall_department = true;
                            }

                            break;
                        case STATUS_CAR.LEADER_DEPARTMENT_APPROVED:
                            statusShow = "DepartmentLeaderApprovedRecall";

                            if ($filter('checkRuleCheckbox')(RULE_CAR.CONFIRM)) {
                                allow_assess_recall_car_management = true;
                            }

                            break;
                        case STATUS_CAR.CONFIRMER_APPROVED:
                            if ($filter('checkRuleCheckbox')(RULE_CAR.APPROVE_LEAD)) {
                                allow_assess_recall_lead = true;
                            }
                            statusShow = "VehicleManagementSpecialistApprovedRecall";
                            break;
                        case STATUS_CAR.RECALLED:
                            statusShow = "Recalled";
                            break;
                    }
                }

                if (item.status === STATUS_CAR.REJECTED) {
                    statusShow = "Rejected";
                }

                if(allow_assess_recall_department || allow_assess_recall_car_management || allow_assess_recall_lead){
                    allow_reject_recall = true;
                }

                return {
                    allow_edit,
                    allow_assess_department,
                    allow_assess_car_management,
                    allow_assess_lead,
                    allow_assess_card_management,
                    allow_manager_assign_card,
                    allow_creator_receive_card,
                    allow_creator_return_card,
                    allow_manager_receive_card,
                    allow_delete,
                    allow_recall,
                    statusShow,
                    allow_edit_card,
                    allow_cancel,
                    allow_assess_lead_external,

                    allow_assess_recall_department,
                    allow_assess_recall_car_management,
                    allow_assess_recall_lead,
                    allow_request_cancel,
                    allow_reject_recall
                }
            }

            function loadCarTickets() {
                const dfd = $q.defer();
                const filter = generateFilter();

                car_service.load(
                    filter.search,
                    undefined,
                    undefined,
                    filter.checks,
                    ctrl.numOfItemPerPage,
                    ctrl.offset,
                    ctrl.sortRegistered.query
                )
                    .then(function (res) {
                        ctrl.carRegistrationList = res.data
                        for (let i in ctrl.carRegistrationList) {
                            ctrl.carRegistrationList[i] = { ...ctrl.carRegistrationList[i], ...getPermissionProperties(ctrl.carRegistrationList[i]) }
                        }
                        dfd.resolve(true);
                    }, function () {
                        dfd.reject(false);
                        err = undefined;
                    });
                return dfd.promise;
            }

            ctrl.load = function (val) {
                if (val != undefined) {
                    ctrl.offset = angular.copy(val);
                }
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "load", loadCarTickets);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                car_service.count(filter.search, undefined,
                    undefined,
                    filter.checks).then(function (res) {
                        ctrl.totalItems = res.data[0].count;
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
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "count", count_service);
            }

            function load_car_list_service() {
                var dfd = $q.defer();
                ctrl.carManagement = [];
                car_service.loadCarList("vehicle_list", 0, 0).then(function (res) {
                    ctrl.carManagement = res.data;
                    dfd.resolve(true);
                }, function () {
                    dfd.reject(false);
                    err = undefined;
                });
                return dfd.promise;
            }

            ctrl.load_car_list_service = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "load_car_list_service", load_car_list_service);
            }


            function load_card_vehicle_list() {
                var dfd = $q.defer();
                ctrl.cardList = [];
                car_service
                    .loadCardVehicleList(0, 0, { name: 1 })
                    .then(
                        function (res) {
                            ctrl.cardList = res.data;
                            dfd.resolve(true);
                            res = undefined;
                            dfd = undefined;
                        },
                        function (err) {
                            dfd.reject(err);
                            err = undefined;
                        }
                    );
                return dfd.promise;
            }

            ctrl.load_card_list = function (val) {
                return $rootScope.statusValue.execute(
                    ctrl._ctrlName,
                    "CarManagement",
                    "load_card_vehicle_list",
                    load_card_vehicle_list
                );
            };

            // load driver

            function load_driver_list() {
                var dfd = $q.defer();
                ctrl.driverList = [];
                car_service
                    .loadDriverList()
                    .then(
                        function (res) {
                            ctrl.driverList = res.data;
                            dfd.resolve(true);
                            res = undefined;
                            dfd = undefined;
                        },
                        function (err) {
                            dfd.reject(err);
                            err = undefined;
                        }
                    );
                return dfd.promise;
            }

            ctrl.load_driver_list = function (val) {
                return $rootScope.statusValue.execute(
                    ctrl._ctrlName,
                    "CarManagement",
                    "load_driver_list",
                    load_driver_list
                );
            };

            //insert
            ctrl.pick_starting_place_insert = function (val) {
                ctrl._insert_value.starting_place = val.value;
            }

            ctrl.pick_passenger_insert = function (val) {
                ctrl._insert_value.passenger = val;
                ctrl._insert_value.number_of_people = ctrl._insert_value.passenger.length;
            }
            
            ctrl.pick_contact_passenger_insert = function (val) {
                ctrl._insert_value.contact_passenger = val;   
            }

            ctrl.pick_contact_passenger_update = function (val) {
                ctrl._update_value.contact_passenger = val;
            }

            ctrl.pick_department_insert = function (val) {
                ctrl._insert_value.to_department = angular.copy(val);

            }

            ctrl.chooseTimeToGo_insert = function (val) {
                if (ctrl._insert_value.time_to_go !== undefined) {
                    ctrl._insert_value.time_to_go = val.getTime();
                }
            }

            ctrl.choosePickUpTime_insert = function (val) {
                if (ctrl._insert_value.pick_up_time !== undefined) {
                    ctrl._insert_value.pick_up_time = val.getTime();
                }
            }

            ctrl.removeFile_insert = function (item) {
                ctrl._insert_value.files = ctrl._insert_value.files.filter(file => file.name !== item.name);
            }

            ctrl.prepareInsert = function () {
                var today = new Date();
                var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0);
                ctrl._insert_value.files = [];
                ctrl._insert_value.destination = "";
                ctrl._insert_value.passenger = [];
                ctrl._insert_value.contact_passenger = []
                ctrl._insert_value.time_to_go = myToday.getTime();
                ctrl._insert_value.pick_up_time = null;
                ctrl._insert_value.number_of_people = 1;
                ctrl._insert_value.min_of_people = 1;
                ctrl._insert_value.to_department = [];
                ctrl._insert_value.content = "";
                ctrl._insert_value.title = "";
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "insert");
            }

            function resetPaginationInfo() {
                ctrl.currentPage = 1;
                ctrl.totalItems = 0;
                ctrl.offset = 0;
            }

            ctrl.refreshData = function () {
                var dfdAr = [];
                resetPaginationInfo();
                dfdAr.push(ctrl.load());
                dfdAr.push(ctrl.count());
                $q.all(dfdAr);
            }

            function insert_service() {
                var dfd = $q.defer();
                car_service.insert(
                    ctrl._insert_value.files,
                    ctrl._insert_value.starting_place,
                    ctrl._insert_value.destination,
                    ctrl._insert_value.passenger,
                    ctrl._insert_value.contact_passenger,
                    ctrl._insert_value.number_of_people,
                    ctrl._insert_value.time_to_go,
                    ctrl._insert_value.pick_up_time,
                    ctrl._insert_value.to_department,
                    ctrl._insert_value.content,
                    ctrl._insert_value.title,
                )
                    .then(function () {
                        $("#modal_CarRegistration_Insert").modal("hide");
                        ctrl.refreshData();

                        var directiveElement = angular.element($element[0].querySelector('#pick_passenger_insert'));
                        var directiveScope = directiveElement.isolateScope() || directiveElement.scope();
                        directiveScope.clear();

                        dfd.resolve(true);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                return dfd.promise;
            }


            ctrl.insert = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "insert", insert_service);
            }

            // Update 

            ctrl.pick_starting_place_update = function (val) {
                ctrl._update_value.starting_place = val.value;
            }

            ctrl.pick_passenger_update = function (val) {
                ctrl._update_value.passenger = angular.copy(val);
                ctrl._update_value.number_of_people = ctrl._update_value.passenger.length;
            }

            ctrl.pick_department_update = function (val) {
                ctrl._update_value.to_department = angular.copy(val);

            }

            ctrl.chooseTimeToGo_update = function (val) {
                if (ctrl._update_value.time_to_go !== undefined) {
                    ctrl._update_value.time_to_go = val.getTime();
                }
            }

            ctrl.choosePickUpTime_update = function (val) {
                if (val === null) {
                    ctrl._update_value.pick_up_time = null;
                } else {
                    ctrl._update_value.pick_up_time = val.getTime ? val.getTime() : val;
                }
            }

            ctrl.removeAttachment_update = function (val) {
                ctrl._update_value.removed_attachments.push(val);
                ctrl._update_value.attachments = ctrl._update_value.attachments.filter(e => e.id !== val.id);
            }

            ctrl.removeFile_update = function (item) {
                var temp = [];
                for (var i in ctrl._update_value.files) {
                    if (ctrl._update_value.files[i].name != item.name) {
                        temp.push(ctrl._update_value.files[i]);
                    }
                }
                ctrl._update_value.files = angular.copy(temp);
            }

            ctrl.prepareUpdate = function (val) {
                ctrl._update_value.files = [];
                ctrl._update_value = angular.copy(val);
                ctrl._update_value.removed_attachments = [];
                ctrl._update_value.init_passenger = angular.copy(val.passenger);
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
            }


            function update_service() {
                var dfd = $q.defer();
                car_service.update(
                    ctrl._update_value.code,
                    ctrl._update_value.files,
                    ctrl._update_value.starting_place,
                    ctrl._update_value.destination,
                    ctrl._update_value.passenger,
                    ctrl._update_value.number_of_people,
                    ctrl._update_value.time_to_go,
                    ctrl._update_value.pick_up_time,
                    ctrl._update_value.to_department,
                    ctrl._update_value.content,
                    ctrl._update_value.removed_attachments,
                    ctrl._update_value.title,
                    ctrl._update_value.contact_passenger,
                ).then(function () {
                    dfd.resolve(true);
                    ctrl.refreshData();
                    $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
                    var directiveElement = angular.element($element[0].querySelector('#pick_passenger_update'));
                    var directiveScope = directiveElement.isolateScope() || directiveElement.scope();
                    directiveScope.clear();
                    $("#modal_CarRegistration_Update").modal('hide');

                    dfd = undefined;
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            ctrl.update = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "update", update_service);
            }

            //Delete
            ctrl.prepareDelete = function (val) {
                ctrl._delete_value = angular.copy(val);
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "delete");
            }

            function delete_service() {
                var dfd = $q.defer();
                car_service.delete(
                    ctrl._assess_value._id).then(function () {
                        ctrl.refreshData();
                        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "delete");
                        $("#modal_CarRegistration_Assess").modal('hide');
                        ctrl._customToastScope.addToastValue({
                            message: $filter('l')('Delete successfully'),
                            type:"success"
                        });
                        dfd.resolve(true);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                return dfd.promise;
            }

            ctrl.delete = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "delete", delete_service);
            }


            //ASSESS

            ctrl.pick_vehicle_assess = function (data) {
                ctrl._assess_value.car = data.value;
            }

            ctrl.pick_driver_assess = function (data) {
                ctrl._assess_value.driverData = data;
                ctrl._assess_value.driver = data.username;
            }

            ctrl.pick_card_assess = function (data) {
                ctrl._assess_value.card = data.value;
            }

            ctrl.prepareAssess = function ({ item, action }) {
                ctrl._assess_value = angular.copy(item);
                ctrl._assess_value.action = action;
                ctrl._assess_value.note = "";
                ctrl._assess_value.note_required = true;
                ctrl._assess_value.return_card = false;
                ctrl._assess_value.edit_car_card = false;
                ctrl._assess_value.show_note = true;
                switch (action) {
                    case "reject_department":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "approve_car_management":
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                        ctrl._assess_value.showChooseProtocal = true;
                        ctrl._assess_value.type = 'car';
                        break;
                    case "reject_car_management":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                        ctrl._assess_value.note_required = true;
                        
                        break;
                    case "approve_lead":
                        ctrl._assess_value.edit_car_card = true;
                        ctrl._assess_value.type = ctrl._assess_value.assign_card ? 'card' : 'car';
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                        ctrl._assess_value.edit_card = true;
                        ctrl._assess_value.driverData = ctrl.driverList.find(item => item.username === ctrl._assess_value.driver);
                        ctrl._assess_value.note_required = true;
                        break;
                    case "reject_lead":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                        ctrl._assess_value.note_required = true;
                       
                        break;
                    case "edit_card_management":
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for edit card car');
                        ctrl._assess_value.showChooseCard = true;
                        break;
                    case "approve_lead_external":
                        ctrl._assess_value.show_driver = true;
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                        break;
                    case "reject_lead_external":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "creator_receive_card":
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for receive card');
                        break;
                    case "creator_return_card":
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for return card');
                        ctrl._assess_value.return_card = true;
                        ctrl._assess_value.return_card_value = {
                            km: 10,
                            money: 1 * 100000,
                            invoices: [],
                            attachments: [],
                            truth: false,
                        }
                        ctrl._assess_value.removeInvoice = function(item){
                            ctrl._assess_value.return_card_value.invoices = ctrl._assess_value.return_card_value.invoices.filter(file => file.name !== item.name);
                        }
                        break;
                    case "manager_receive_card":
                        ctrl._assess_value.note_placeholder = $filter('l')('You can note for manager receive card');
                        break;
                    case "creator_cancel":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for cancel registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "request_cancel":
                        ctrl._assess_value.show_driver = true;
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for cancel registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "reject_recall":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for approve reject recall registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "approve_recall_department":
                        ctrl._assess_value.show_driver = true;
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "approve_recall_car_management":
                        ctrl._assess_value.show_driver = true;
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "approve_recall_lead":
                        ctrl._assess_value.show_driver = true;
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for approve recall registration');
                        ctrl._assess_value.note_required = true;
                        break;
                    case "delete":
                        ctrl._assess_value.note_placeholder = $filter('l')('You need to note for delete registration');
                        ctrl._assess_value.show_note = false;
                        break;
 
                }
                $rootScope.$broadcast("pickModalDirectory:initLoad");
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
            }

            function access_service(action) {
                return function () {
                    var dfd = $q.defer();
                    let dfdAr = [];
                    let car = undefined;
                    let driver = undefined;
                    let card = undefined;
                    let assign_card = false;
                    let messageSuccess = '';
                    switch (action) {
                        case "approve_department":
                            dfdAr.push(car_service.approve_department(ctrl._assess_value.code, ctrl._assess_value.note));
                            messageSuccess = $filter('l')('Accept registration successfully');
                            break;
                        case "reject_department":
                            messageSuccess = $filter('l')('RejectedRegistration');
                            dfdAr.push(car_service.reject_department(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_car_management":
                            messageSuccess = $filter('l')('Accept registration successfully');
                            if(ctrl._assess_value.type === 'car'){
                                car = ctrl._assess_value.car;
                                driver =ctrl._assess_value.driver;
                            }else{
                                assign_card = true;
                                card = ctrl._assess_value.card;
                            }
                            dfdAr.push(car_service.approve_car_management(ctrl._assess_value.code, ctrl._assess_value.note,
                                assign_card, card, car, driver));
                            break;
                        case "reject_car_management":
                            messageSuccess = $filter('l')('RejectedRegistration');
                            dfdAr.push(car_service.reject_car_management(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_lead":
                            messageSuccess = $filter('l')('Accept registration successfully');
                            if(ctrl._assess_value.type === 'car'){
                                car =ctrl._assess_value.car;
                                driver = ctrl._assess_value.driver;
                            }else{
                                assign_card = true;
                                card = ctrl._assess_value.card;
                            }
                            dfdAr.push(car_service.approve_lead(ctrl._assess_value.code, ctrl._assess_value.note, assign_card, card, car, driver));
                            break;
                        case "reject_lead":
                            messageSuccess = $filter('l')('RejectedRegistration');
                            dfdAr.push(car_service.reject_lead(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_lead_external":
                            messageSuccess = $filter('l')('Accept registration successfully');
                            dfdAr.push(car_service.approve_lead_external(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "reject_lead_external":
                            messageSuccess = $filter('l')('RejectedRegistration');
                            dfdAr.push(car_service.reject_lead_external(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "edit_card_management":
                            dfdAr.push(car_service.edit_card_management(ctrl._assess_value.code, ctrl._assess_value.note, ctrl._assess_value.card));
                            break;
                        case "creator_receive_card":
                            messageSuccess = $filter('l')('card_received');
                            dfdAr.push(car_service.creator_receive_card(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "creator_return_card":
                            messageSuccess = $filter('l')('CreatorReturnedCard');
                            dfdAr.push(car_service.creator_return_card(
                                ctrl._assess_value.code,
                                ctrl._assess_value.note,
                                ctrl._assess_value.return_card_value.money,
                                ctrl._assess_value.return_card_value.km,
                                ctrl._assess_value.return_card_value.invoices
                            ));
                            break;    
                        case "reject_card_management":
                            messageSuccess = $filter('l')('RejectedRegistration');
                            dfdAr.push(car_service.reject_card_management(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "manager_assign_card":
                            dfdAr.push(car_service.manager_assign_card(ctrl._assess_value.code, ctrl._assess_value.note, ctrl._assess_value.card));
                            break;
                        case "manager_receive_card":
                            messageSuccess = $filter('l')('Accept registration successfully');
                            dfdAr.push(car_service.manager_receive_card(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "creator_cancel":
                            messageSuccess = $filter('l')('Cancelled');
                            dfdAr.push(car_service.creator_cancel(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "request_cancel":
                            messageSuccess = $filter('l')('registration_room_request_cancel');
                            dfdAr.push(car_service.request_cancel(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "reject_recall":
                            messageSuccess = $filter('l')('RejectedRecalled');
                            dfdAr.push(car_service.reject_recall(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_recall_department":
                            messageSuccess = $filter('l')('ApprovedRecalled');
                            dfdAr.push(car_service.approve_recall_department(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_recall_car_management":
                            messageSuccess = $filter('l')('ApprovedRecalled');
                            dfdAr.push(car_service.approve_recall_car_management(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        case "approve_recall_lead":
                            messageSuccess = $filter('l')('ApprovedRecalled');
                            dfdAr.push(car_service.approve_recall_lead(ctrl._assess_value.code, ctrl._assess_value.note));
                            break;
                        
                    }
                    $q.all(dfdAr).then(function () {
                        ctrl.refreshData();
                        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
                        $("#modal_CarRegistration_Assess").modal('hide');
                        ctrl._customToastScope.addToastValue({
                            message: messageSuccess,
                            type:"success"
                        });
                        dfd.resolve(true);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }
            }

            ctrl.reject_department = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_department", access_service("reject_department"));
            }

            ctrl.approve_car_management = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_car_management", access_service("approve_car_management"));
            }

            ctrl.reject_car_management = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_car_management", access_service("reject_car_management"));
            }

            ctrl.approve_lead = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_lead", access_service("approve_lead"));
            }

            ctrl.reject_lead = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_lead", access_service("reject_lead"));
            }

            ctrl.approve_lead_external = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_lead_external", access_service("approve_lead_external"));
            }

            ctrl.reject_lead_external = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_lead_external", access_service("reject_lead_external"));
            }

            ctrl.edit_card_management = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "edit_card_management", access_service("edit_card_management"));
            }

            ctrl.reject_card_management = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_card_management", access_service("reject_card_management"));
            }

            ctrl.manager_assign_card = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "manager_assign_card", access_service("manager_assign_card"));
            }

            ctrl.creator_receive_card = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "creator_receive_card", access_service("creator_receive_card"));
            }

            ctrl.creator_return_card = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "creator_return_card", access_service("creator_return_card"));
            }

            ctrl.manager_receive_card = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "manager_receive_card", access_service("manager_receive_card"));
            }

            ctrl.creator_cancel = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "creator_cancel", access_service("creator_cancel"));
            }

            // Recall
            ctrl.request_cancel = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "request_cancel", access_service("request_cancel"));
            }
            ctrl.reject_recall = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "reject_recall", access_service("reject_recall"));
            }

            ctrl.approve_recall_department = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_department", access_service("approve_recall_department"));
            }

            ctrl.approve_recall_car_management = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_car_management", access_service("approve_recall_car_management"));
            }

            ctrl.approve_recall_lead= function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_recall_lead", access_service("approve_recall_lead"));
            }

            //Department approval
            ctrl.prepareLeadDepartmentApprove = function ({item}) {
                $rootScope.$broadcast("pickModalDirectory:initLoad");
                ctrl._update_value.files = [];
                ctrl._update_value = angular.copy(item);
                ctrl._update_value.removed_attachments = [];
                ctrl._update_value.init_passenger = angular.copy(item.passenger);
                ctrl._update_value.note_placeholder = $filter('l')('You can note for accept');
            }

            function approve_department_service() {
                var dfd = $q.defer();
                car_service.approve_department(
                    ctrl._update_value.code,
                    ctrl._update_value.note,
                    ctrl._update_value.files,
                    ctrl._update_value.starting_place,
                    ctrl._update_value.destination,
                    ctrl._update_value.passenger,
                    ctrl._update_value.contact_passenger,
                    ctrl._update_value.number_of_people,
                    ctrl._update_value.time_to_go,
                    ctrl._update_value.pick_up_time,
                    ctrl._update_value.to_department,
                    ctrl._update_value.content,
                    ctrl._update_value.removed_attachments,
                    ctrl._update_value.title,
                ).then(function () {
                    dfd.resolve(true);
                    ctrl.refreshData();
                    $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "approve_department");
                    $("#modal_CarRegistration_LeadDepartment_Approval").modal('hide');

                    dfd = undefined;
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            ctrl.approve_department = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarManagement", "approve_department", approve_department_service);
            }

            //LOAD FILE 

            ctrl.loadfile = function (params) {
                return function () {
                    var dfd = $q.defer();
                    car_service.load_file_info(params.code, params.name).then(
                        function (res) {
                            dfd.resolve({
                                display: res.data.display,
                                embedUrl: res.data.url,
                                guid: res.data.guid,
                            });
                            res = undefined;
                            dfd = undefined;
                        },
                        function (err) { }
                    );
                    return dfd.promise;
                };
            };

            ctrl.loadfileInvoice = function (params) {
                return function () {
                    var dfd = $q.defer();
                    car_service.load_file_invoice(params.code, params.name).then(
                        function (res) {
                            dfd.resolve({
                                display: res.data.display,
                                embedUrl: res.data.url,
                                guid: res.data.guid,
                            });
                            res = undefined;
                            dfd = undefined;
                        },
                        function (err) { }
                    );
                    return dfd.promise;
                };
            };

            const getTextSearch = () => {
                let q = $location.search().q;
                if(q){ return q;}
                if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'notify') {
                    let temp = $rootScope.detailsInfo.url.split("?")[1];
                    $location.search('q', null);
                    if(temp.indexOf("q")!==-1){
                        q = temp.split("=")[1];
                        $rootScope.detailsInfo.url = $rootScope.detailsInfo.url.split("?")[0];
          
                        return q;
                    }
                }
                return undefined;
            };

            $rootScope.$on('updateStatusFromLoadDetailCar', function() {
                ctrl.refreshData();
            });

            function init() {
                const userInfo = $rootScope.logininfo.data;
                const rules = userInfo.rule;
                const carManagementTab = $rootScope.carManagementTab;
                if(
                    $filter('hasRule')(RULE_CAR.CREATED)
                ){
                    ctrl.checkbox_created = true;
                    ctrl.show_checkbox_created = true;
                    ctrl.show_checkbox_card_delivery = true;
                }

                if(
                    $filter('hasRule')(RULE_CAR.APPROVE_DEPARTMENT)
                ){
                    ctrl.show_checkbox_needhandle = true;
                    ctrl.show_checkbox_handled = true;
                    ctrl.show_checkbox_responsibility = true;
                    ctrl.show_checkbox_card_delivery = true;

                    ctrl.checkbox_created = false;
                    ctrl.checkbox_needhandle = true;
                }


                if($filter('hasRule')(RULE_CAR.CONFIRM)){
                    ctrl.show_checkbox_needhandle = true;
                    ctrl.show_checkbox_handled = true;
                    ctrl.show_checkbox_card_delivery = true;

                    ctrl.checkbox_created = false;
                    ctrl.checkbox_needhandle = true;
                }

                if(
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD_EXTERNAL)
                ){
                    ctrl.checkbox_created = false;
                    ctrl.checkbox_needhandle = true;

                    ctrl.show_checkbox_needhandle = true;
                    ctrl.show_checkbox_handled = true;
                    // ctrl.show_checkbox_rejected = true;
                    // ctrl.show_checkbox_responsibility = true;
                    // ctrl.show_checkbox_card_delivery = true;
                }

                ctrl._searchByKeyToFilterData = getTextSearch();

                if(getShowColumn()){
                    ctrl.columns = getShowColumn();
                }else{
                    saveShowColumn()
                }

                ctrl.columnsArray =  Object.keys(ctrl.columns).map(key => {
                    return {
                        key: key,
                        title: ctrl.columns[key].title,
                        show: ctrl.columns[key].show
                    };
                })

                const dfdAr = [
                    ctrl.load(),
                    ctrl.count(),
                    ctrl.load_car_list_service(),
                    ctrl.load_card_list(),
                    ctrl.load_driver_list()
                ];
                $q.all(dfdAr).then(
                    function () {
                        ctrl._notyetInit = false;
                    }, function (err) {
                        err = undefined;
                    }
                );
            }
            init();
}]);

myApp.registerCtrl('car_callendar_controller',
    ['car_service', 'car_list_service', '$q', '$rootScope', '$filter', 'languageValue',
        function (car_service, car_list_service, $q, $rootScope, $filter, $languageValue) {

            const _statusValueSet = [
                { name: "CarCalendar", action: "load" },
                { name: "CarCalendar", action: "load_list_car" },
                { name: "CarCalendar", action: "load_list_card" },
            ];

            var ctrl = this;
            /** init variable */
            {
                ctrl.$languageValue = $languageValue;
                ctrl.weekDays = [];
                $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet, 'doing');
                ctrl.checkbox_created = false;
                ctrl.checkbox_responsibility = false;
                ctrl.checkbox_all_department = false;
                ctrl.checkbox_my_calendar = false;
                ctrl.checkbox_all_calendar = false;

                ctrl.show_checkbox_created = false;
                ctrl.show_checkbox_responsibility = false;
                ctrl.show_checkbox_department = false;
                ctrl.show_checkbox_my_calendar = false;
                ctrl.show_checkbox_all_calendar = false;

                ctrl.show_export = false;

                ctrl.config_list_car = {
                    master_key: 'vehicle_list',
                    filter:[
                        { isactive: true },
                    ]
                }
                ctrl.config_list_card = {
                    master_key: 'card_list',
                    filter:[
                        { isactive: true },
                    ]
                }

                ctrl.registrations = [];
                ctrl.car_list = [];
                ctrl.card_list = [];
                ctrl.show_btn_export = false;
            }

            const RULE_CAR = {
                USE:"Office.CarManagement.Use",
                CREATE:"Office.CarManagement.Create",
                APPROVE_DEPARTMENT:"Office.CarManagement.Review",
                CONFIRM:"Office.CarManagement.Confirm",
                APPROVE_LEAD:"Office.CarManagement.Approve",
                APPROVE_LEAD_EXTERNAL:"Office.CarManagement.ApproveExternal",
                NOTIFY:"Office.CarManagement.NotifyDepartment",
            };

            ctrl.export_excel = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarCalendar", "load", export_excel_service);
            }

            function export_excel_service(){
                const dfd = $q.defer();
                const filter = generateFilter_export();
                car_service.export_excel(
                    filter.from_date,
                    filter.to_date,
                    filter.checks,
                )
                    .then(function (res) {
                        const file_name = `${$filter('l')('CarScheduleUse')}_${$filter('showDate')(filter.from_date)}_to_${$filter('showDate')(filter.to_date)}`;
                        // Kiểm tra xem API có trả về blob không
                        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);

                        // Tạo thẻ <a> ẩn để tải file
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${file_name}.xlsx`;  // Tên file khi tải về
                        document.body.appendChild(a);
                        a.click();

                        // Sau khi tải xong, giải phóng URL và xóa thẻ <a>
                        window.URL.revokeObjectURL(url);
                        a.remove();

                        // Resolve khi tải thành công
                        dfd.resolve(true);
                    }, function () {
                        dfd.reject(false);
                        err = undefined;
                    });
                return dfd.promise;
            }
        
            function calculateDays(startDate, endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
            
                const timeDifference = end - start;
                const dayDifference = timeDifference / (1000 * 3600 * 24);
            
                return dayDifference + 1; // Cộng thêm 1 để bao gồm cả ngày đầu và ngày cuối
            }
            
            ctrl.refresh_data = function(){
                ctrl.load().then(function(){
                    ctrl.filterEventForDay();
                })
            }

            function getMonday(){
                let currentDate = new Date();
                let dayOfWeek = currentDate.getDay(); 
                let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
                return new Date(currentDate.setDate(currentDate.getDate() - diff));
            }

            ctrl.generateWeekDays = function () {
                const days = [];
                let currentDate = getMonday();
                let numDateShow = 7;
                if(ctrl.weekDays!==undefined && ctrl.weekDays.length> 1){
                    const start = new Date(ctrl.weekDays[0].date);
                    const end = new Date(ctrl.weekDays[ctrl.weekDays.length - 1].date);
                    numDateShow = calculateDays(start,end);
                    currentDate = start;
                }
                //get monday
                const dayKeyMap = {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday'
                };
        
                for (let i = 0; i < numDateShow; i++) {
                    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
                    const dayKey = dayKeyMap[dayOfWeek];
                    days.push({
                        date: new Date(currentDate),
                        dayKey: dayKey,
                        day: currentDate.getDate(),
                        fullDate: currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return days;
            };
        
            // Get the week days
            
            ctrl.previousWeek = function () {
                load_service_calendar();
            };
        
            ctrl.nextWeek = function () {
                load_service_calendar();
            };
        
            ctrl.shiftWeek = function (direction) {
                ctrl.weekDays = ctrl.weekDays.map(day => {
                    let newDate = new Date(day.date);
                    newDate.setDate(newDate.getDate() + (direction * 7));
                    return {
                        ...day,
                        date: newDate,
                        fullDate: newDate.toISOString().split('T')[0], // Update the full date format
                        day: newDate.getDate()
                    };
                });
        
                // No need to refresh other data; the date shifting will just update the UI
            };

            ctrl.refresh_calendar = function(){
                ctrl.weekDays = ctrl.generateWeekDays();
                ctrl.refresh_data();
            }
        
            // A method to filter events based on the date for each room
            

            function load_service() {
                const dfd = $q.defer();
                const filter = generateFilter();

                car_service.load_calendar(
                    filter.from_date,
                    filter.to_date,
                    filter.checks,
                )
                    .then(function (res) {
                        dfd.resolve(true);
                        ctrl.registrations = res.data.map(registration => ({
                            ...registration,
                            time_to_go: registration.time_to_go *1,
                            pick_up_time: registration.pick_up_time *1,
                        }));
                    }, function () {
                        dfd.reject(false);
                        err = undefined;
                    });
                return dfd.promise;
            }

            ctrl.load = function (val) {
                if (val != undefined) {
                    ctrl.offset = angular.copy(val);
                }
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarCalendar", "load", load_service);
            }

            ctrl.load_list_car = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarCalendar", "load_list_car", load_list_car_service);
            }

            function load_list_car_service(){
                let dfd = $q.defer();
                const filter = generateFilterListCar();
                car_list_service.load_list_car(
                    filter.master_key,
                    filter.filter
                ).then(function(res){
                    dfd.resolve(true);
                    ctrl.car_list = res.data;
                }, function(err){ console.log(err) } )
                return dfd.promise;
            }

            ctrl.load_list_card = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarCalendar", "load_list_card", load_list_card_service);
            }

            function load_list_card_service(){
                let dfd = $q.defer();
                const filter = generateFilterListCard();
                car_list_service.load_list_card(
                    filter.master_key,
                    filter.filter
                ).then(function(res){
                    dfd.resolve(true);
                    ctrl.card_list = res.data;
                }, function(err){ console.log(err) } )
                return dfd.promise;
            }

            function generateFilterListCar(){
                const obj = {};
                obj.master_key = ctrl.config_list_car.master_key;
                obj.filter = ctrl.config_list_car.filter;
                return obj;
            }

            function generateFilterListCard(){
                const obj = {};
                obj.master_key = ctrl.config_list_card.master_key;
                obj.filter = ctrl.config_list_card.filter;
                return obj;
            }

            function generateFilter() {
                var obj = {};
                obj.checks = [];
                const CHECKS_ON_UI = {
                    CREATED: "created",
                    NEED_HANDLE: "need_handle",
                    RESPOSIBILITY_DEPARTMENT: "responsibility",
                    CARD_NOT_RETURNED: "card_not_returned",
                    ALL_DEPARTMENT: "all_department",
                    MY_CALENDAR: "my_calendar",
                    ALL_CALENDAR: "all",
                }

                // if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
                //     obj.checks.push(CHECKS_ON_UI.CREATED);
                // }

                // if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
                //     obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
                // }

                // if (ctrl.checkbox_all_department && ctrl.show_checkbox_all_department) {
                //     obj.checks.push(CHECKS_ON_UI.ALL_DEPARTMENT);
                // }

                // if (ctrl.checkbox_my_calendar && ctrl.show_checkbox_my_calendar) {
                //     obj.checks.push(CHECKS_ON_UI.MY_CALENDAR);
                // }

                // if (ctrl.checkbox_all_calendar && ctrl.show_checkbox_all_calendar) {
                //     obj.checks.push(CHECKS_ON_UI.ALL_CALENDAR);
                // }

                obj.checks.push(CHECKS_ON_UI.ALL_CALENDAR);


                obj.from_date = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
                obj.to_date = $filter('convertToEndOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();

                return obj;
            }

            function generateFilter_export() {
                var obj = {};
                obj.checks = [];
                const CHECKS_ON_UI = {
                    CREATED: "created",
                    RESPOSIBILITY_DEPARTMENT: "responsibility",
                    ALL_DEPARTMENT: "all_department",
                    MY_CALENDAR: "my_calendar",
                    ALL: "all"
                }

                // if (ctrl.checkbox_created) {
                //     obj.checks.push(CHECKS_ON_UI.CREATED);
                // }

                // if (ctrl.checkbox_my_calendar) {
                //     obj.checks.push(CHECKS_ON_UI.MY_CALENDAR);
                // }

                // if (ctrl.checkbox_responsibility) {
                //     obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
                // }

                // if (ctrl.checkbox_all_calendar) {
                //     obj.checks.push(CHECKS_ON_UI.ALL);
                // }

                obj.checks.push(CHECKS_ON_UI.ALL);
                
                obj.from_date = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
                obj.to_date = $filter('convertToStartOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();

                return obj;
            }

            function isSameDay(timestamp1, timestamp2) {
                const date1 = new Date(timestamp1);
                const date2 = new Date(timestamp2);
            
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate();
            }

            ctrl.filterEventForDay = function(){
                ctrl.car_list = ctrl.car_list.map(car =>{
                    let events = [];
                    for (let day of ctrl.weekDays){
                        day = day.date;

                        
                        const event = ctrl.registrations.filter(registration => registration.car === car.value && isSameDay(registration.time_to_go*1,day))
                        .sort((a, b) => new Date(a.time_to_go) - new Date(b.time_to_go)) // Sort by start time
                        .map(event => {
                            let text_event = '';
                            let compareToStartDate = $filter('compareDate')(day, event.time_to_go);
                            let compareToEndDate = $filter('compareDate')(day, event.pick_up_time);
                            if(compareToStartDate === 1 && compareToEndDate === -1){
                                text_event = $filter('l')('Allday');
                            }
    
                            if(compareToStartDate === 1 && compareToEndDate === 0){
                                const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                text_event = `${$filter('l')('Early in the day')} - ${endTime}`
                            }
    
                            if(compareToStartDate === 0 && compareToEndDate === -1){
                                const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                text_event = `${startTime} - ${$filter('l')('Until the end of the day')}`
                            }
    
                            if(compareToStartDate === 0 && compareToEndDate === 0){
                                const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                
                                text_event = `${startTime} - ${endTime}`
                            }
                            text_event = `${text_event}: ${event.title}`;
                            return {
                                ...event,
                                text_event
                            };
                        });
                        events.push({day, event});
                    }
                    return {
                        ...car,
                        events
                    }
                });

                ctrl.card_list = ctrl.card_list.map(card =>{
                    let events = [];
                    for (let day of ctrl.weekDays){
                        day = day.date;
                        const event = ctrl.registrations.filter(registration =>
                            registration.card === card.value &&
                            isSameDay(registration.time_to_go, day)
                        )
                        .sort((a, b) => new Date(a.time_to_go) - new Date(b.time_to_go)) // Sort by start time
                        .map(event => {
                            let text_event = '';
                            let compareToStartDate = $filter('compareDate')(day, event.time_to_go);
                            let compareToEndDate = $filter('compareDate')(day, event.pick_up_time);
                            if(compareToStartDate === 1 && compareToEndDate === -1){
                                text_event = $filter('l')('Allday');
                            }
    
                            if(compareToStartDate === 1 && compareToEndDate === 0){
                                const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                text_event = `${$filter('l')('Early in the day')} - ${endTime}`
                            }
    
                            if(compareToStartDate === 0 && compareToEndDate === -1){
                                const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                text_event = `${startTime} - ${$filter('l')('Until the end of the day')}`
                            }
    
                            if(compareToStartDate === 0 && compareToEndDate === 0){
                                const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                
                                text_event = `${startTime} - ${endTime}`
                            }
                            text_event = `${text_event}: ${event.title}`;
                            return {
                                ...event,
                                text_event
                            };
                        });
                        events.push({day, event});
                    }
                    return {
                        ...card,
                        events
                    }
                });
            }

            function init() {
                ctrl.weekDays = ctrl.generateWeekDays();

                // if(
                //     $filter('hasRule')(RULE_CAR.CREATE)||
                //     $filter('hasRule')(RULE_CAR.APPROVE_DEPARTMENT)
                // ){
                //     ctrl.show_btn_export = true;
                // }

                if(
                    $filter('hasRule')(RULE_CAR.USE)
                ){
                    // ctrl.show_checkbox_my_calendar = true; 
                    // ctrl.checkbox_my_calendar = true;  
                    // ctrl.checkbox_created = true;
                }
               
                if(
                    $filter('hasRule')(RULE_CAR.APPROVE_DEPARTMENT),
                    $filter('hasRule')(RULE_CAR.NOTIFY)
                ){
                    // ctrl.checkbox_responsibility = true;

                    // ctrl.show_checkbox_responsibility = true;
                    // ctrl.show_checkbox_department = true;
                    // ctrl.show_checkbox_all_department = true;
                }

                if(
                    $filter('hasRule')(RULE_CAR.CONFIRM) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD_EXTERNAL)
                ){
                    // ctrl.show_checkbox_all_calendar = true; 
                }

                if(
                    $filter('hasRule')(RULE_CAR.CONFIRM) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD_EXTERNAL)
                ){
                    ctrl.show_export = true; 
                }

                const dfdAr = [
                    ctrl.load_list_car(),
                    ctrl.load_list_card(),
                    ctrl.load()
                ];
                $q.all(dfdAr).then(function(){
                        ctrl.filterEventForDay();
                    }
                );
            }
            init();
}]);

myApp.registerCtrl('my_callendar_controller',
    ['car_service', 'car_list_service', '$q', '$rootScope', '$filter', 'languageValue',
        function (car_service, car_list_service, $q, $rootScope, $filter, $languageValue) {

            const _statusValueSet = [
                { name: "MyCalendar", action: "load" },
                { name: "MyCalendar", action: "load_list_car" },
                { name: "MyCalendar", action: "load_list_card" },
            ];

            var ctrl = this;
            /** init variable */
            {
                ctrl.$languageValue = $languageValue;
                ctrl.weekDays = [];
                $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet, 'doing');
                ctrl.checkbox_created = false;
                ctrl.checkbox_responsibility = false;
                ctrl.checkbox_all_department = false;
                ctrl.checkbox_my_calendar = true;
                ctrl.checkbox_all_calendar = false;

                ctrl.show_checkbox_created = false;
                ctrl.show_checkbox_responsibility = false;
                ctrl.show_checkbox_department = false;
                ctrl.show_checkbox_my_calendar = false;
                ctrl.show_checkbox_all_calendar = false;
                ctrl.registration_list = []

                ctrl.show_export = false;

                ctrl.config_list_car = {
                    master_key: 'vehicle_list',
                    filter:[
                        { isactive: true },
                    ]
                }
                ctrl.config_list_card = {
                    master_key: 'card_list',
                    filter:[
                        { isactive: true },
                    ]
                }

                ctrl.registrations = [];
                ctrl.car_list = [];
                ctrl.card_list = [];
                ctrl.show_btn_export = false;
            }

            const RULE_CAR = {
                USE:"Office.CarManagement.Use",
                CREATE:"Office.CarManagement.Create",
                APPROVE_DEPARTMENT:"Office.CarManagement.Review",
                CONFIRM:"Office.CarManagement.Confirm",
                APPROVE_LEAD:"Office.CarManagement.Approve",
                APPROVE_LEAD_EXTERNAL:"Office.CarManagement.ApproveExternal",
                NOTIFY:"Office.CarManagement.NotifyDepartment",
            };

            ctrl.export_excel = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "CarCalendar", "load", export_excel_service);
            }

            function export_excel_service(){
                const dfd = $q.defer();
                const filter = generateFilter_export();
                car_service.export_excel(
                    filter.from_date,
                    filter.to_date,
                    filter.checks,
                )
                    .then(function (res) {
                        const file_name = `${$filter('l')('CarScheduleUse')}_${$filter('showDate')(filter.from_date)}_to_${$filter('showDate')(filter.to_date)}`;
                        // Kiểm tra xem API có trả về blob không
                        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);

                        // Tạo thẻ <a> ẩn để tải file
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${file_name}.xlsx`;  // Tên file khi tải về
                        document.body.appendChild(a);
                        a.click();

                        // Sau khi tải xong, giải phóng URL và xóa thẻ <a>
                        window.URL.revokeObjectURL(url);
                        a.remove();

                        // Resolve khi tải thành công
                        dfd.resolve(true);
                    }, function () {
                        dfd.reject(false);
                        err = undefined;
                    });
                return dfd.promise;
            }
        
            function calculateDays(startDate, endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
            
                const timeDifference = end - start;
                const dayDifference = timeDifference / (1000 * 3600 * 24);
            
                return dayDifference + 1; // Cộng thêm 1 để bao gồm cả ngày đầu và ngày cuối
            }
            ctrl.hasAnyEvent = function (events) {
                return events.some(function (dayEvent) {
                    return Array.isArray(dayEvent.event) && dayEvent.event.length > 0;
                });
            };
            
            ctrl.refresh_data = function(){
                ctrl.load().then(function(){
                    ctrl.filterEventForDay();
                })
            }

            ctrl.switchTab = function (tabName) {
                ctrl.checkbox_my_calendar = false;
                ctrl.checkbox_responsibility = false;

                switch (tabName) {
                    case 'my_calendar':
                        ctrl.checkbox_my_calendar = true;
                        break;
                    case 'responsibility':
                        ctrl.checkbox_responsibility = true;
                        break;
                    default:
                        ctrl.checkbox_my_calendar = true;
                }

                ctrl.refresh_data();
            };
            

            function getMonday(){
                let currentDate = new Date();
                let dayOfWeek = currentDate.getDay(); 
                let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
                return new Date(currentDate.setDate(currentDate.getDate() - diff));
            }

            ctrl.generateWeekDays = function () {
                const days = [];
                let currentDate = getMonday();
                let numDateShow = 7;
                if(ctrl.weekDays!==undefined && ctrl.weekDays.length> 1){
                    const start = new Date(ctrl.weekDays[0].date);
                    const end = new Date(ctrl.weekDays[ctrl.weekDays.length - 1].date);
                    numDateShow = calculateDays(start,end);
                    currentDate = start;
                }
                //get monday
                const dayKeyMap = {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday'
                };
        
                for (let i = 0; i < numDateShow; i++) {
                    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
                    const dayKey = dayKeyMap[dayOfWeek];
                    days.push({
                        date: new Date(currentDate),
                        dayKey: dayKey,
                        day: currentDate.getDate(),
                        fullDate: currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return days;
            };
        
            // Get the week days
            
            ctrl.previousWeek = function () {
                load_service_calendar();
            };
        
            ctrl.nextWeek = function () {
                load_service_calendar();
            };
        
            ctrl.shiftWeek = function (direction) {
                ctrl.weekDays = ctrl.weekDays.map(day => {
                    let newDate = new Date(day.date);
                    newDate.setDate(newDate.getDate() + (direction * 7));
                    return {
                        ...day,
                        date: newDate,
                        fullDate: newDate.toISOString().split('T')[0], // Update the full date format
                        day: newDate.getDate()
                    };
                });
        
                // No need to refresh other data; the date shifting will just update the UI
            };

            ctrl.refresh_calendar = function(){
                ctrl.weekDays = ctrl.generateWeekDays();
                ctrl.refresh_data();
            }
        
            // A method to filter events based on the date for each room
            

            function load_service() {
                const dfd = $q.defer();
                const filter = generateFilter();

                car_service.load_calendar(
                    filter.from_date,
                    filter.to_date,
                    filter.checks,
                )
                    .then(function (res) {
                        dfd.resolve(true);
                        ctrl.registrations = res.data.map(registration => ({
                            ...registration,
                            time_to_go: registration.time_to_go *1,
                            pick_up_time: registration.pick_up_time *1,
                        }));
                        
                    }, function () {
                        dfd.reject(false);
                        err = undefined;
                    });
                return dfd.promise;
            }

            ctrl.load = function (val) {
                if (val != undefined) {
                    ctrl.offset = angular.copy(val);
                }
                return $rootScope.statusValue.execute(ctrl._ctrlName, "MyCalendar", "load", load_service);
            }

            ctrl.load_list_car = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "MyCalendar", "load_list_car", load_list_car_service);
            }

            function load_list_car_service(){
                let dfd = $q.defer();
                const filter = generateFilterListCar();
                car_list_service.load_list_car(
                    filter.master_key,
                    filter.filter
                ).then(function(res){
                    dfd.resolve(true);
                    ctrl.registration_list = res.data;
                }, function(err){ console.log(err) } )
                return dfd.promise;
            }

            ctrl.load_list_card = function(){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "MyCalendar", "load_list_card", load_list_card_service);
            }

            function load_list_card_service(){
                let dfd = $q.defer();
                const filter = generateFilterListCard();
                car_list_service.load_list_card(
                    filter.master_key,
                    filter.filter
                ).then(function(res){
                    dfd.resolve(true);
                    ctrl.registration_list = res.data;
                }, function(err){ console.log(err) } )
                return dfd.promise;
            }

            function generateFilterListCar(){
                const obj = {};
                obj.master_key = ctrl.config_list_car.master_key;
                obj.filter = ctrl.config_list_car.filter;
                return obj;
            }

            function generateFilterListCard(){
                const obj = {};
                obj.master_key = ctrl.config_list_card.master_key;
                obj.filter = ctrl.config_list_card.filter;
                return obj;
            }

            function generateFilter() {
                var obj = {};
                obj.checks = [];
                const CHECKS_ON_UI = {
                    CREATED: "created",
                    NEED_HANDLE: "need_handle",
                    RESPOSIBILITY_DEPARTMENT: "responsibility",
                    CARD_NOT_RETURNED: "card_not_returned",
                    ALL_DEPARTMENT: "all_department",
                    MY_CALENDAR: "my_calendar",
                    ALL_CALENDAR: "all",
                }

                if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
                    obj.checks.push(CHECKS_ON_UI.CREATED);
                }

                if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
                    obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
                }

                if (ctrl.checkbox_all_department && ctrl.show_checkbox_all_department) {
                    obj.checks.push(CHECKS_ON_UI.ALL_DEPARTMENT);
                }

                if (ctrl.checkbox_my_calendar && ctrl.show_checkbox_my_calendar) {
                    obj.checks.push(CHECKS_ON_UI.MY_CALENDAR);
                }

                if (ctrl.checkbox_all_calendar && ctrl.show_checkbox_all_calendar) {
                    obj.checks.push(CHECKS_ON_UI.ALL_CALENDAR);
                }

                obj.from_date = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
                obj.to_date = $filter('convertToEndOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();

                return obj;
            }

            function generateFilter_export() {
                var obj = {};
                obj.checks = [];
                const CHECKS_ON_UI = {
                    CREATED: "created",
                    RESPOSIBILITY_DEPARTMENT: "responsibility",
                    ALL_DEPARTMENT: "all_department",
                    MY_CALENDAR: "my_calendar",
                    ALL: "all"
                }

                if (ctrl.checkbox_created) {
                    obj.checks.push(CHECKS_ON_UI.CREATED);
                }

                if (ctrl.checkbox_my_calendar) {
                    obj.checks.push(CHECKS_ON_UI.MY_CALENDAR);
                }

                if (ctrl.checkbox_responsibility) {
                    obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
                }

                if (ctrl.checkbox_all_calendar) {
                    obj.checks.push(CHECKS_ON_UI.ALL);
                }
                obj.from_date = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
                obj.to_date = $filter('convertToStartOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();

                return obj;
            }

            ctrl.day_events = [];

            ctrl.filterEventForDay = function(){
                ctrl.day_events = [];
                for (let day of ctrl.weekDays){

                    
                    let events = ctrl.registrations.filter(registration => isSameDay(day.date.getTime(), registration.time_to_go * 1));
                    events = events.sort((a, b) => new Date(a.time_to_go) - new Date(b.time_to_go)).map(event => {
                        let text_event = '';
                        let compareToStartDate = $filter('compareDate')(day, event.time_to_go);
                        let compareToEndDate = $filter('compareDate')(day, event.pick_up_time);
                        if(compareToStartDate === 1 && compareToEndDate === -1){
                            text_event = $filter('l')('Allday');
                        }

                        if(compareToStartDate === 1 && compareToEndDate === 0){
                            const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            text_event = `${$filter('l')('Early in the day')} - ${endTime}`
                        }

                        if(compareToStartDate === 0 && compareToEndDate === -1){
                            const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            text_event = `${startTime} - ${$filter('l')('Until the end of the day')}`
                        }

                        if(compareToStartDate === 0 && compareToEndDate === 0){
                            const startTime = new Date(event.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            const endTime = new Date(event.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                            
                            text_event = `${startTime} : ${endTime}`
                        }
                        text_event = `${text_event} : ${event.title}`;
                        return {
                            ...event,
                            text_event
                        };
                    });

                    ctrl.day_events.push({
                        day: day,
                        events: $filter('markOverlappingEvents')(events, 'time_to_go', 'pick_up_time')
                    })
                    
                }
            }

            function isSameDay(timestamp1, timestamp2) {
                const date1 = new Date(timestamp1);
                const date2 = new Date(timestamp2);
            
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate();
            }

            function init() {
                ctrl.weekDays = ctrl.generateWeekDays();
                if(
                    $filter('hasRule')(RULE_CAR.USE)
                ){
                    ctrl.show_checkbox_my_calendar = true; 
                    ctrl.checkbox_my_calendar = true;  
                }
               
                if(
                    $filter('hasRule')(RULE_CAR.APPROVE_DEPARTMENT),
                    $filter('hasRule')(RULE_CAR.NOTIFY)
                ){
                    ctrl.show_checkbox_responsibility = true;
                }

                if(
                    $filter('hasRule')(RULE_CAR.CONFIRM) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD_EXTERNAL)
                ){
                    ctrl.show_checkbox_all_calendar = true; 
                }

                if(
                    $filter('hasRule')(RULE_CAR.CONFIRM) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD) ||
                    $filter('hasRule')(RULE_CAR.APPROVE_LEAD_EXTERNAL)
                ){
                    ctrl.show_export = true; 
                }
                ctrl.show_export = false; 

                const dfdAr = [
                    ctrl.load_list_car(),
                    ctrl.load_list_card(),
                    ctrl.load()
                ];
                $q.all(dfdAr).then(function(){
                        ctrl.filterEventForDay();
                    }
                );
            }
            init();
}]);

myApp.registerCtrl('car_location_controller', ['car_list_service', '$q', '$rootScope', '$filter', function (car_list_service, $q, $rootScope, $filter) {

    const _statusValueSet = [

        //carList
        { name: "Location", action: "getOrderNumber" },
        { name: "Location", action: "load" },
        { name: "Location", action: "count" },
        { name: "Location", action: "insert" },
        { name: "Location", action: "update" },
        { name: "Location", action: "delete" },
    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "car_location_controller";
        ctrl.mater_key = "location_list"
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.locations = [];

        ctrl._notyetInit = true;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInsertModal = FrontendDomain + '/modules/office/car_management/views/location_list/insert_modal_location.html';
        ctrl._urlUpdateModal = FrontendDomain + '/modules/office/car_management/views/location_list/update_modal_location.html';
        ctrl._urlDeleteModal = FrontendDomain + '/modules/office/car_management/views/location_list/delete_modal_location.html';


    }

    ctrl.load = function (val) {
        if (val != undefined) {
            ctrl.offset = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "load", load_service);
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "getOrderNumber", getOrderNumber_service);
    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "count", count_service);
    }



    function generateFilter() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }


    function count_service() {
        var dfd = $q.defer();
        var filter = generateFilter();
        car_list_service.count(filter.search, ctrl.mater_key).then(function (res) {
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

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }



    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }



    //INSERT 

    function getOrderNumber_service() {
        let dfd = $q.defer();
        car_list_service.getOrderNumber(ctrl.mater_key).then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }


    function generate_InsertValue() {
        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                'vi-VN': '',
                'en-US': '',
            },
            licensePlate: '',
            seatingCapacity: 0,
            isactive: true,
        };
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "insert");
    }

    function insert_service() {
        var dfd = $q.defer();
        var value = ctrl._insert_value.title['en-US'].toLowerCase()

        car_list_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            value,
            {},
            ctrl.mater_key,
            ctrl._insert_value.isactive,

        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "insert");
            $("#modal_Location_Insert").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "insert", insert_service);
    }


    //LOAD

    function load_service() {
        var dfd = $q.defer();
        let _filter = generateFilter();
        ctrl.locations = [];
        car_list_service.load(_filter.search, ctrl.mater_key, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.locations = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    //UPDATE
    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "update");
    }

    function update_service() {
        var dfd = $q.defer();
        var item = {
            licensePlate: ctrl._update_value.licensePlate,
            seatingCapacity: ctrl._update_value.seatingCapacity
        }
        car_list_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            item,
            ctrl._update_value.value,
            ctrl._update_value.isactive,
        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "update");
            $("#modal_Location_Update").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "update", update_service);
    }

    //DELETE 

    ctrl.prepareDelete = function (val) {
        ctrl._delete_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        car_list_service.delete(
            ctrl._delete_value._id).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "Location", "delete");
                $("#modal_Location_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Location", "delete", delete_service);
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
}]);

myApp.registerCtrl('card_list_controller', ['card_list_service', '$q', '$rootScope', '$filter', function (card_list_service, $q, $rootScope, $filter) {

    const _statusValueSet = [

        //carList
        { name: "CardManagement", action: "load" },
        { name: "CardManagement", action: "count" },
        { name: "CardManagement", action: "count" },
        { name: "CardManagement", action: "insert" },
        { name: "CardManagement", action: "update" },
        { name: "CardManagement", action: "delete" },
        { name: "CardManagement", action: "getOrderNumber" },

    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "card_list_controller";
        ctrl.mater_key = "card_list"
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.cardManagement = [];

        ctrl._notyetInit = true;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInsertModal = FrontendDomain + '/modules/office/car_management/views/card_list/insert_modal.html';
        ctrl._urlUpdateModal = FrontendDomain + '/modules/office/car_management/views/card_list/update_modal.html';
        ctrl._urlDeleteModal = FrontendDomain + '/modules/office/car_management/views/card_list/delete_modal.html';

    }

    ctrl.load = function (val) {
        if (val != undefined) {
            ctrl.offset = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "load", load_service);
    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "count", count_service);
    }



    function generateFilter() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }


    function count_service() {
        var dfd = $q.defer();
        var filter = generateFilter();
        card_list_service.count(filter.search, ctrl.mater_key).then(function (res) {
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

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }



    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }



    //INSERT 
    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "getOrderNumber", getOrderNumber_service);
    }

    function getOrderNumber_service() {
        let dfd = $q.defer();
        card_list_service.getOrderNumber(ctrl.mater_key).then(function (data) {
            ctrl._insert_value.ordernumber = data.data.ordernumber;
            dfd.resolve(true);
        }, function (err) {
            console.log(err);
            dfd.reject(err);
        });
        return dfd.promise;
    }


    function generate_InsertValue() {
        ctrl._insert_value = {
            ordernumber: 0,
            title: {
                'vi-VN': '',
                'en-US': '',
            },
            isactive: true,
            status:true,
            status_text:"true",
            number_card: '',
        };
    }

    ctrl.change_status_insert = function(val){
        ctrl._insert_value.status = val;
    }

    ctrl.prepareInsert = function () {
        generate_InsertValue();
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "insert");
    }


    function insert_service() {
        var dfd = $q.defer();
        var value = ctrl._insert_value.title['en-US'].toLowerCase()
        var item = {
            status: ctrl._insert_value.status,
            number_card: ctrl._insert_value.number_card
        }
        card_list_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            value,
            item,
            ctrl.mater_key,
            ctrl._insert_value.isactive,

        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "insert");
            $("#modal_CardManagement_Insert").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "insert", insert_service);
    }


    //LOAD

    function load_service() {
        var dfd = $q.defer();
        let _filter = generateFilter();
        ctrl.carManagement = [];
        card_list_service.load(_filter.search, ctrl.mater_key, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.cardManagement = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }


    ctrl.true = true;
    ctrl.false = false;

    //UPDATE
    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        ctrl._update_value.status_value = ctrl._update_value.status?'active':'busy';
        $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "update");
    }
    ctrl.change_status_update = function (val) {
        ctrl._update_value.status = val;
    }

    function update_service() {
        var dfd = $q.defer();
        var item = {
            status:ctrl._update_value.status,
            number_card:ctrl._update_value.number_card,
        }
        card_list_service.update(
            ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            ctrl._update_value.title,
            item,
            ctrl._update_value.value,
            ctrl._update_value.isactive,
        ).then(function () {
            ctrl.refreshData();
            $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "update");
            $("#modal_CardMnanagement_Update").modal('hide');
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "update", update_service);
    }

    //DELETE 

    ctrl.prepareDelete = function (val) {
        ctrl._delete_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        card_list_service.delete(
            ctrl._delete_value._id).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "CardManagement", "delete");
                $("#modal_CardMnanagement_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "CardManagement", "delete", delete_service);
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
}]);

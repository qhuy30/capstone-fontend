myApp.registerCtrl('car_registration_details_controller', ['$location', 'car_registration_details_service', 'car_service', '$q', '$rootScope', '$scope', '$filter', function ($location, car_registration_details_service, car_service, $q, $rootScope, $scope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "CarRegistration", action: "loadDetail" },

        { name: "CarManagement", action: "update" },
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
        ctrl._ctrlName = "car_registration_details_controller";
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
        ctrl._urlUpdateModal = FrontendDomain + '/modules/office/car_management/details/views/car_registration_update_modal.html';
        ctrl._urlAssessModal = FrontendDomain + '/modules/office/car_management/details/views/car_registration_assess_modal.html';
        ctrl._urlDepartmentApprove = FrontendDomain + '/modules/office/car_management/details/views/car_registration_lead_deparment_approve_update.html';

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();

    }
    ctrl.function_apply_suggestions = ['registration_car'];
    ctrl._assess_value = {};

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

    /**show Infomation Details*/
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'car-registration-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
      };

    ctrl.code = getCode();
    ctrl.Item = {};
    ctrl._update_value = {};
    ctrl.load_detail = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "CarRegistration", "loadDetail", load_detail_service);
    }

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

    function load_detail_service(){
      let dfd = $q.defer();
      const code = ctrl.code;
      car_registration_details_service.loadDetail(code)
        .then(
          function (res) {
            dfd.resolve(true);
            try{

              ctrl.Item = {
                ...res.data[0],
                ...getPermissionProperties(res.data[0])
              };
            }catch(e){
              console.log(e);
            }
          },
          function (err) {
            //
          }
        );
      return dfd.promise;
    }

    ctrl.load_file_info = function (params) {
        return function () {
            var dfd = $q.defer();
            car_registration_details_service.load_file_info(params.id, params.name).then(function (res) {
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

    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
    }

    ctrl.prepareLeadDepartmentApprove = function ({item}) {
        $rootScope.$broadcast("pickModalDirectory:initLoad");
        ctrl._update_value = angular.copy(item);
        ctrl._update_value.files = [];
        ctrl._update_value.removed_attachments = [];
        ctrl._update_value.init_passenger = angular.copy(item.passenger);
        ctrl._update_value.note_placeholder = $filter('l')('You can note for accept');
    }

    ctrl.prepareAssess = function ({ item, action }) {
        // $('#modal_CarRegistration_Assess_detail').modal('show');
        ctrl._assess_value = angular.copy(item);
        ctrl._assess_value.action = action;
        ctrl._assess_value.note = "";
        ctrl._assess_value.note_required = true;
        ctrl._assess_value.return_card = false;
        ctrl._assess_value.edit_car_card = false;
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

        }
        $rootScope.$broadcast("pickModalDirectory:initLoad");
        $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
    }

    ctrl.pick_starting_place_update = function (val) {
        ctrl._update_value.starting_place = val.value;
    }

    ctrl.pick_passenger_update = function (val) {
        ctrl._update_value.passenger = angular.copy(val);
        ctrl._update_value.number_of_people = ctrl._update_value.passenger.length;
    }

    ctrl.pick_contact_passenger_update = function (val) {
        ctrl._update_value.contact_passenger = val;
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
        ctrl._update_value = angular.copy(val);
        ctrl._update_value.files = [];
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
            ctrl.load_detail();
            $rootScope.$broadcast('updateStatusFromLoadDetailCar');
            $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "update");
            $("#modal_CarRegistration_Update_detail").modal('hide');

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
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", "delete");
                $("#modal_CarRegistration_Assess_detail").modal('hide');
                window.location.reload();
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
                ctrl.load_detail();
                $rootScope.statusValue.generate(ctrl._ctrlName, "CarManagement", action);
                $rootScope.$broadcast('updateStatusFromLoadDetailCar');
                $("#modal_CarRegistration_Assess_detail").modal('hide');
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
            $("#modal_CarRegistration_LeadDepartment_Approval_detail").modal('hide');

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

    ctrl.load_driver_list = function (val) {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "CarManagement",
            "load_driver_list",
            load_driver_list
        );
    };

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

    function init() {
      var dfdAr = [];
      dfdAr.push(ctrl.load_detail());
      dfdAr.push(ctrl.load_driver_list());
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
  
    
    $scope.$watch(getCode, function (newVal) {
        if (newVal && newVal !== ctrl.code) {
            ctrl.code = newVal;
            init();
        }
    });
    
      init();
}]);

myApp.registerCtrl("card_vehicle_controller", [
  "card_vehicle_service",
  "$q",
  "$rootScope",
  "$timeout",
  "$filter",
  function (card_vehicle_service, $q, $rootScope, $timeout, $filter) {
    /**declare variable */

    const _statusValueSet = [
      { name: "CardVehicle", action: "load" },
      { name: "CardVehicle", action: "count" },
      { name: "CardVehicle", action: "insert" },
      { name: "CardVehicle", action: "update" },
      { name: "CardVehicle", action: "delete" },
    ];

    const relativePage = "/modules/office/card_vehicle/views";

    var ctrl = this;

    /** init variable */
    {
      ctrl._ctrlName = "card_vehicle_controller";
      ctrl.cardList = [];
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl._notyetInit = true;
      ctrl.sort = { name: "name", value: false, query: { name: 1 } };
      ctrl._searchByKeyToFilterData = "";

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl._urlInsertModal =
        FrontendDomain + `${relativePage}/insert_modal.html`;
      ctrl._urlUpdateModal =
        FrontendDomain + `${relativePage}/update_modal.html`;
      ctrl._urlDeleteModal =
        FrontendDomain + `${relativePage}/delete_modal.html`;
    }

    /**function for logic */
    function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
    }

    function generateFilterLoadGroup() {
      var obj = {};
      if (ctrl._searchByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }
      return obj;
    }

    function loadCardVehicleList() {
      var dfd = $q.defer();
      ctrl.cardList = [];
      var filter = generateFilterLoadGroup();
      card_vehicle_service
        .loadCardVehicleList(
          filter.search,
          ctrl.offset,
          ctrl.numOfItemPerPage,
          ctrl.sort.query
        )
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

    ctrl.loadList = function (val) {
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CardVehicle",
        "load",
        loadCardVehicleList
      );
    };

    function countCardVehicleList() {
      var dfd = $q.defer();
      ctrl.cardList = [];
      var filter = generateFilterLoadGroup();
      card_vehicle_service.countCardVehicleList(filter.search).then(
        function (res) {
          ctrl.totalItems = res.data.count;

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

    ctrl.countGroup = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CardVehicle",
        "count",
        countCardVehicleList
      );
    };

    ctrl.refreshData = function () {
      var dfdAr = [];
      resetPaginationInfo();
      dfdAr.push(ctrl.loadList());
      dfdAr.push(ctrl.countGroup());
      $q.all(dfdAr);
    };

    function init() {
      var dfdAr = [];
      dfdAr.push(ctrl.loadList());
      dfdAr.push(ctrl.countGroup());
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

    ctrl.checkExist = function (code) {
      let dfd = $q.defer();
      if (!code || code === "") {
        dfd.resolve(true);
      } else {
        card_vehicle_service.checkExist(code).then(
          function (data) {
            if (data.data.status) {
              dfd.resolve(true);
            } else {
              dfd.reject(false);
            }
          },
          function () {
            dfd.reject(false);
          }
        );
      }

      return dfd.promise;
    };
    /** Insert*/

    function generate_resetInsertValue() {
      ctrl._insert_value = {
        name: "",
        code: "",
      };
    }

    ctrl.prepareInsert = function () {
      $rootScope.statusValue.generate(ctrl._ctrlName, "CardVehicle", "insert");
      generate_resetInsertValue();
    };

    function insert_service() {
      var dfd = $q.defer();
      card_vehicle_service
        .insert(ctrl._insert_value.name, ctrl._insert_value.code)
        .then(
          function () {
            ctrl.refreshData();
            $timeout(function () {
              $("#modal_Card_Insert").modal("hide");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.insert_func = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CardVehicle",
        "insert",
        insert_service
      );
    };

    /**UPDATE GROUP GENERAL */
    ctrl.prepareUpdate = function (val) {
      ctrl._update_value = angular.copy(val);
      $rootScope.statusValue.generate(ctrl._ctrlName, "CardVehicle", "update");
    };

    function update_service() {
      var dfd = $q.defer();
      card_vehicle_service
        .update(ctrl._update_value._id, ctrl._update_value.name)
        .then(
          function () {
            ctrl.refreshData();
            $timeout(function () {
              $("#modal_Card_Update").modal("hide");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }
    ctrl.update_func = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CardVehicle",
        "update",
        update_service
      );
    };

    /**DELETE GROUP */

    ctrl.prepareDelete = function (val) {
      ctrl._delete_value = {
        ...angular.copy(val),
        title: val.name,
      };
      $rootScope.statusValue.generate(ctrl._ctrlName, "CardVehicle", "delete");
    };

    function delete_service() {
      var dfd = $q.defer();
      card_vehicle_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Card_Delete").modal("hide");
          ctrl.refreshData();
          dfd.resolve(true);
          ß;
          dfd = undefined;
        },
        function (err) {
          ß;
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl.delete_func = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CardVehicle",
        "delete",
        delete_service
      );
    };
  },
]);

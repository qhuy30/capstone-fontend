myApp.registerCtrl("storage_details_controller", [
  "storage_details_service",
  "odb_details_service",
  "task_details_service",
  "da_details_service",
  "sign_details_service",
  "$q",
  "$rootScope",
  "$scope",
  function (storage_details_service, odb_details_service, task_details_service, da_details_service, sign_details_service, $q, $rootScope, $scope) {
    /**declare variable */
    const _statusValueSet = [
      { name: "storage", action: "loadDetail" },
      { name: "storage", action: "handling" },
    ];
    var ctrl = this;

    const getCode = () => {
      const matches = $rootScope.currentPath.match(/\/storage\/(.*)/);
      return matches ? matches[1] : null;
    };

    ctrl.code = getCode();

    /** init variable */
    {
      ctrl._ctrlName = "storage_details_controller";
      ctrl.OutgoingDispatchBook_Config = {
        master_key: "outgoing_dispatch_book",
        load_details_column: "value",
      };
      ctrl.viewModes = {
        DETAILS: "Details",
        REFERENCE: "Reference",
      };
      ctrl.viewMode = ctrl.viewModes.DETAILS;
      ctrl.viewItem = undefined;
      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.setView = function (mode, item) {
      ctrl.viewMode = mode;
      ctrl.viewItem = item;
    };

    /**show Infomation Details*/
    function loadDetail_service() {
      var dfd = $q.defer();
      storage_details_service.load_details(ctrl.thisId, ctrl.code).then(
        function (res) {
          ctrl.Item = res.data;
          // console.log(ctrl.Item);
          ctrl.thisId = ctrl.Item._id;
          ctrl.breadcrumb = [
            ...(ctrl.Item.parents || []).reverse(),
            { object: "briefcase", code: ctrl.Item.code },
          ];
          loadDetails()
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          if (err.status === 403) {
            $rootScope.urlPage = urlNotPermissionPage;
          } else {
            $rootScope.urlPage = urlNotFoundPage;
          }
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    function loadDetails(){
      ctrl.Item.parents.forEach(item => {
        switch(item.object){
          case "outgoing_dispatch":
            loadDetails_outgoing_dispatch(item.id).then(function(data){
              item.title_show = data.content;
            }, function(err){ dfd.reject(err); });
            break;
          case "workflow_play":
            loadDetails_wfp(item.id, item.code).then(function(data){
                item.title_show = data.title;
            }, function(err){ dfd.reject(err); });
            break;
          case "dispatch_arrived":
            loadDetails_DA(item.id, item.code).then(function(data){
              item.title_show = data.content;
          }, function(err){ dfd.reject(err); });
            break;
          case "task":
            loadDetails_task(item.id,item.code).then(function(data){
              item.title_show = data.code;
          }, function(err){ dfd.reject(err); });
            break;
        }
      });
    }

    function loadDetails_outgoing_dispatch(id){
      const dfd = $q.defer();
      odb_details_service.loadDetail(id, 'a').then(function(res){
        dfd.resolve(res.data);

      }, function(err){
        dfd.reject(err);
      })
      return dfd.promise;
    }

    function loadDetails_task(id, code){
      const dfd = $q.defer();
      task_details_service.loadDetails(id, code, '').then(function(res){
        dfd.resolve(res.data);

      }, function(err){
        dfd.reject(err);
      })
      return dfd.promise;
    }

    function loadDetails_DA(id, code){
      const dfd = $q.defer();
      da_details_service.loadDetails(id, code).then(function(res){
        dfd.resolve(res.data);

      }, function(err){
        dfd.reject(err);
      })
      return dfd.promise;
    }

    function loadDetails_wfp(id, code){
      const dfd = $q.defer();

      storage_details_service.loadDetails_wfp(id, code).then(function(res){
        dfd.resolve(res.data);

      }, function(err){
        console.log(err)
        dfd.reject(err);
      })
  
      return dfd.promise;
    }

    ctrl.loadDetail = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "storage",
        "loadDetail",
        loadDetail_service
      );
    };

    function init() {
      ctrl.loadDetail();
    }

    if (ctrl.code) {
      init();
    } else if (
      $rootScope.detailsInfo.url &&
      $rootScope.detailsInfo.route === "briefcase-details"
    ) {
      ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
      if (!ctrl.thisId || ctrl.thisId.length !== 24) {
        $rootScope.detailsInfo.urlPage = urlNotFoundPage;
      } else {
        init();
      }
    } else {
      ctrl.thisId = $rootScope.currentPath.split("?")[1];
      if (!ctrl.thisId || ctrl.thisId.length !== 24) {
        $rootScope.urlPage = urlNotFoundPage;
      } else {
        init();
      }
    }

    ctrl.load_file_info = function (params) {
      return function () {
          var dfd = $q.defer();
          storage_details_service.load_file_info(params.id, params.name).then(function (res) {
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
  

    $scope.$watch(getCode, function (newVal) {
      if (newVal && newVal !== ctrl.code) {
        ctrl.code = newVal;
        init();
      }
    });
  },
]);

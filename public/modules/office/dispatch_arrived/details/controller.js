myApp.registerCtrl("da_details_controller", [
  "$rootScope",
  "$scope",
  "$location",
  "da_details_service",
  function ($rootScope, $scope, $location, da_details_service) {
    const _statusValueSet = [

      //carList
      { name: "DA", action: "forward_CVP" },

    ];
    var ctrl = this;

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    const getCode = () => {
      return $location.search().code;
    };

    ctrl.code = getCode();

    ctrl.setBreadcrumb = function name(breadcrumb) {
      ctrl.breadcrumb = breadcrumb;
    };



    if (!ctrl.code) {
      if (
        $rootScope.detailsInfo.url &&
        $rootScope.detailsInfo.route === "da-details"
      ) {
        ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
        if (!ctrl.thisId || ctrl.thisId.length !== 24) {
          $rootScope.detailsInfo.urlPage = urlNotFoundPage;
        }
      } else {
        ctrl.thisId = $rootScope.currentPath.split("?")[1];
        if (!ctrl.thisId || ctrl.thisId.length !== 24) {
          $rootScope.urlPage = urlNotFoundPage;
        }
      }
    }

    $scope.$watch(getCode, function (newVal) {
      if (newVal && newVal !== ctrl.code) {
        ctrl.code = newVal;
      }
    });
  },
]);
myApp.registerCtrl('odb_details_controller', ['$rootScope', '$scope','$location', function ($rootScope, $scope,$location) {
  const _statusValueSet = [

    //carList
    { name: "OD", action: "update" },

  ];
  var ctrl = this;

  $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

  const getCode = () =>{
      return $location.search().code;
  };

  ctrl.code = getCode();

  ctrl.setBreadcrumb = function name(breadcrumb) {
      ctrl.breadcrumb = breadcrumb;
  }

  if (!ctrl.code) {
      if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route==='odb-details') {
          ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
          if (!ctrl.thisId || ctrl.thisId.length !==24){
              $rootScope.detailsInfo.urlPage = urlNotFoundPage;
          }
      } else {
          ctrl.thisId = $rootScope.currentPath.split("?")[1];
          if (!ctrl.thisId || ctrl.thisId.length !==24) {
              $rootScope.urlPage = urlNotFoundPage;
          }
      }
  }

}]);

myApp.registerCtrl('switch_tab_details_controller',
    ['$filter', function ($filter) {
        var ctrl = this;
        ctrl.tab = "Process";
        ctrl.show_tab_process = false;


        ctrl.switchTab = function (tab) {
            switch (tab) {
                case "Process":
                    ctrl.tab = tab;
                    ctrl._urlContent = FrontendDomain + "/modules/office/dispatch_arrived/views/processing_modal.html";
                    break;
                case "HistoryProcess":
                    ctrl.tab = tab;
                    ctrl._urlContent = FrontendDomain + "/modules/office/dispatch_arrived/views/history_processing_modal.html";
                    break;
                case "RelatedDocument":
                    ctrl.tab = tab;
                    ctrl._urlContent = FrontendDomain + "/modules/office/dispatch_arrived/views/related_document_modal.html";
                    break;
                default:
                    ctrl.tab = tab;
                    ctrl._urlContent = FrontendDomain + "/modules/office/dispatch_arrived/views/processing_modal.html";
                    break;
            }
        };

        function init(){
            ctrl.switchTab()
            ctrl.show_tab_process = true;
        }
        init();
}]);

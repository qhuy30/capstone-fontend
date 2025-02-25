myApp.compileProvider.directive("notifyInsertModal", function () {
  return {
    restrict: "E",
    templateUrl:
      FrontendDomain +
      "/modules/office/notify/directives/notify-insert-modal.html",
    scope: {
      initData: "<",
      onSuccess: "&",
      taskId: "=",
    },
    controller: [
      "notify_service",
      "$q",
      "$rootScope",
      "$scope",
      "$filter",
      function (notify_service, $q, $rootScope, $scope,$filter) {
        const _statusValueSet = [{ name: "Notify", action: "insert" }];
        let ctrl = this;
        $scope.ctrl = ctrl;

        {
          ctrl.form_value = {
            files: [],
            to_employee: [],
            to_department: [],
          };
          ctrl._ctrlName = `notify_insert_modal_ctrl${new Date().getTime()}`;

          ctrl._notYetSubmit = true;

          ctrl.notify_group_config = {
            master_key: "notify_group",
            load_details_column: "value",
          };


          $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

          ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();
        }

        ctrl.on_pick_notify_group = function (param) {
          ctrl.form_value.group = param.value || null;
        };

        ctrl.on_pick_received_employee = function (param) {
          ctrl.form_value.to_employee = angular.copy(param);
        };

        ctrl.pickdirector_insert = function (param) {
          ctrl.form_value.to_director = angular.copy(param);
        };

        ctrl.on_pick_received_department = function (param) {
          ctrl.form_value.to_department = angular.copy(param);
        };

        ctrl.on_remove_attachment_file = function (param) {
          ctrl.form_value.files = ctrl.form_value.files.filter(
            (file) => file.name !== param.name
          );
        };

        ctrl.closeModal =  function() {
          var modal = "#" + ctrl._ctrlName;
          $(modal).modal("hide");
        }

        ctrl.submit = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Notify",
            "insert",
            insert_notify
          ).then(function(){
            ctrl._notYetSubmit = false;
            if(!ctrl._notYetSubmit){
              setTimeout( function() {
                ctrl.closeModal();
              }, 300);
            }
          });
        };




        function insert_notify() {
          const dfd = $q.defer();
          const content = $(`#${ctrl._ctrlName}_txt`).summernote("code");

          const to_employee = ctrl.form_value.to_employee.map((e) => e.username);
          notify_service
            .insert(
              ctrl.form_value.files,
              ctrl.form_value.title,
              content,
              ctrl.form_value.group,
              ctrl.form_value.type,
              to_employee,
              ctrl.form_value.to_department,
              ctrl.form_value.to_director,
              angular.isUndefined($scope.taskId) ? null : $scope.taskId
            )
            .then(function (result) {
              $("#notify_insert_modal").modal("hide");
              ctrl._customToastScope.addToastValue({
                message: $filter('l')('Insert news successfully'),
                type:"success"
              });
              dfd.resolve(true);
              if (angular.isFunction($scope.onSuccess))
                $scope.onSuccess({ params: result });
            })
            .catch(function (error) {
              dfd.reject(error);
              $scope.onError();
            });
          return dfd.promise;
        }

        ctrl._prepareInsert = function () {
          $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
          ctrl.form_value =
          {
            files: [],
            to_employee: [],
            to_department: [],
            to_director:[],
            content: '',
            title: '',
            type:"Department"
          };

          $(`#${ctrl._ctrlName}_txt`).summernote("code", "");
        }

        
      }
    ]
  };
});

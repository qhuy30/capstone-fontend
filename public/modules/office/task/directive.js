myApp.compileProvider.directive("statisticOrganization", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/statistic-organization.html",
      scope: {
        myData: "<",
        ctrl: "<",
      },
      link: function (scope) {
        scope.expand = function (item) {
          for (var i in scope.myData) {
            if (scope.myData[i].id === item.id) {
              if (scope.myData[i].expand) {
                scope.myData[i].expand = false;
              } else {
                scope.myData[i].expand = true;
                scope.ctrl.statistic(item.id).then(
                  function (res) {
                    scope.myData[i].item = res.items;
                    scope.myData[i].employees = res.employee;
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              }
              break;
            }
          }
        };
      },
    };
  },
]);

myApp.compileProvider.directive("taskInsertModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/task_insert_modal.html",
      scope: {
        handleSuccessFunc: "&",
        insertHeadTaskId: "<",
        insertCurrentDepartment: "<",
        insertDispatchArrivedId: "<",
        insertCurrentProject: "<",
        draft: "<",
        target: "@",
        noCommit: "<",
        initValue: "<",
        parentItem: "<",
        parentType: "<",
        parentPercentLeft: "<",
        insertCurrentDepartmentId: "<",
      },
      controller: [
        "task_service",
        "$q",
        "$rootScope",
        "$scope",
        "$filter",
        function (task_service, $q, $rootScope, $scope, $filter) {
          $scope.draft = $scope.draft || false;
          $scope.target = $scope.target || "users";
          $scope.noCommit = $scope.noCommit || false;

          const _statusValueSet = [
            { name: "Task", action: "init" },
            { name: "Task", action: "load" },
            { name: "Task", action: "insert" },
            { name: "Task", action: "pushFile" },
            { name: "Task", action: "removeFile" },
          ];
          const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
          const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");

          function emitReloadEvent (code) {
            let obj = {
                type: "task",
                value: code
            }

            $rootScope.emitReloadEvent(obj);
        }

          var ctrl = this;
          var idEditor = "insertTask_dir_content";
          $scope.ctrl = ctrl;
          // init variables
          {
            ctrl._ctrlName = "task_insert_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.TaskPriority = {
              master_key: "task_priority",
              load_details_column: "value",
            };
            ctrl.TaskType = {
              master_key: "task_type",
              load_details_column: "value",
            };
            ctrl._insert_value = {};
          }

          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };

          ctrl.prepareInsert = function (val) {
            ctrl.percentParentLeft = $scope.parentPercentLeft || 10;
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
            if (val) {
              ctrl._parentID = val._id;
              ctrl._parentTitle = val.title;
            } else {
              ctrl._parentID = undefined;
              ctrl._parentTitle = undefined;
            }

            $("#" + idEditor).summernote({
              placeholder: $filter("l")("InputContentHere"),
              toolbar: [
                ['style', ['style']], 
                ['style', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']],
                ['misc', ['fullscreen', 'help']]
              ],
              callbacks: {
                onImageUpload: function (image) {
                  var formData = new FormData();
                  formData.append("type", "image");
                  formData.append("file", image[0], image[0].name);
                  task_service.uploadImage(formData).then(
                    function (res) {
                      var thisImage = $("<img>").attr("src", res.data);
                      $("#" + idEditor).summernote("insertNode", thisImage[0]);
                    },
                    function (err) {}
                  );
                },
              },
            });
            $("#" + idEditor).summernote(
              "code",
              $scope.initValue ? $scope.initValue.note : ""
            );
            var today = new Date();

            var myToday = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              0,
              0,
              0
            );
            var endDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              23,
              59,
              59
            );
            ctrl._filterPriority = $scope.initValue
              ? $scope.initValue._filterPriority
              : "Medium";
            ctrl._filterTaskType = $scope.initValue
              ? $scope.initValue._filterTaskType
              : "Task";
            ctrl._insert_value = $scope.initValue || {
              files: [],
              title: "",
              task_list: [],
              main_person: [],
              participant: [],
              observer: [$rootScope.logininfo.username],
              from_date: myToday.getTime(),
              to_date: endDay.getTime(),
              has_time: false,
              hours: 0,
              priority: "Medium",
              head_task_id: $scope.insertHeadTaskId,
              currentDepartment: $scope.insertCurrentDepartment || undefined,
              currentDepartmentId: $scope.insertCurrentDepartmentId || undefined,
              currentProject: $scope.insertCurrentProject || undefined,
              dispatch_arrived_id: $scope.insertDispatchArrivedId,
              level: "Task",
              label: [],
              child_work_percent: 10
            };

            // custom validate
            $scope.$invalidDepartment =
              $scope.target === "department" &&
              !ctrl._insert_value.currentDepartment;
          };

          ctrl.choosePriority = function (val) {
            const priority = task_service.taskPriorityTransform(val.value);
            ctrl._insert_value.priority = priority.key;
            ctrl._filterPriority = priority.value;
          };

          ctrl.chooseTaskType = function (val) {
            const taskType = task_service.taskTypeTransform(val.value);
            ctrl._insert_value.task_type = taskType.key;
            ctrl._filterTaskType = taskType.value;
          };

          ctrl.addCheckList_insert = function () {
            var d = new Date();
            ctrl._insert_value.task_list.push({
              title: "",
              status: false,
              id: d.getTime().toString(),
            });
            ctrl._insert_value.focusChecklist = d.getTime().toString();
          };

          ctrl.insertLabel = function (item) {
            var dfd = $q.defer();
            task_service.insert_label(item).then(
              function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.loadLabel = function ({ search, top, offset, sort }) {
            var dfd = $q.defer();
            task_service.load_label(search, top, offset, sort).then(
              function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.loadLabel_details = function ({ ids }) {
            var dfd = $q.defer();
            task_service.loadLabel_details(ids).then(
              function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.pickLabel = function (value) {
            ctrl._insert_value.label = value;
          };

          ctrl.removeCheckList_insert = function (id) {
            ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
              (e) => e.id !== id
            );
          };

          ctrl.removeFile_insert = function (item) {
            ctrl._insert_value.files = ctrl._insert_value.files.filter(
              (e) => e.name !== item.name
            );
          };

          ctrl.chooseFromDate_insert = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
            ctrl._insert_value.from_date = val ? val.getTime() : undefined;
            if (ctrl._insert_value.to_date && ctrl._insert_value.from_date >= ctrl._insert_value.to_date) {
              ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date);
            }
            if (!ctrl.fromDate_ErrorMsg === $rootScope.isValidFromDate(true, val, ctrl._insert_value.to_date)) {
              ctrl.chooseToDate_insert(ctrl._insert_value.to_date ? new Date(ctrl._insert_value.to_date) : undefined);
            }
          };
          
          ctrl.chooseToDate_insert = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
            ctrl._insert_value.to_date = val ? val.getTime() : undefined;
            if (ctrl._insert_value.from_date && ctrl._insert_value.to_date <= ctrl._insert_value.from_date) {
              ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._insert_value.from_date, val);
            }
          };
          ctrl.chooseDepartment_insert = function (val) {
            ctrl._insert_value.currentDepartment_orig = val;
            ctrl._insert_value.currentDepartment = val.id;
            $scope.$invalidDepartment = false;
          };
          ctrl.pickMainperson_insert = function (val) {
            ctrl._insert_value.main_person = [val];
          };
          ctrl.pickParticipant_insert = function (val) {
            ctrl._insert_value.participant = val;
          };
          ctrl.pickObserver_insert = function (val) {
            ctrl._insert_value.observer = val;
          };

          /**UPDATE TASK */
          ctrl.addCheckList_update = function () {
            var d = new Date();
            ctrl._update_value.task_list.push({
              title: "",
              status: false,
              id: d.getTime().toString(),
            });
            ctrl._update_value.focusChecklist = d.getTime().toString();
          };

          ctrl.removeCheckList_update = function (id) {
            ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
              (e) => e.id !== id
            );
          };

          function insert_service() {
            if ($scope.noCommit) {
              $("#modal_Task_Dir_Insert").modal("hide");
              $scope.handleSuccessFunc({
                params: {
                  insertValue: {
                    ...ctrl._insert_value,
                    note: $("#" + idEditor).summernote("code"),
                    _filterPriority: ctrl._filterPriority,
                    _filterTaskType: ctrl._filterTaskType,
                  },
                },
              });
              return $q.resolve(true);
            }

            var dfd = $q.defer();
            let parent = {};
            let parents = [];
            if ($scope.parentItem) {
              parent.id = $scope.parentItem._id;
              parent.object = $scope.parentType;
              switch ($scope.parentType) {
                case "task":
                case "dispatch_arrived":
                case "project":
                  parent.code = $scope.parentItem.code;
                  break;
              }
              parents = $scope.parentItem.parents || [];
            }
           
            let department = "";

            if (typeof ctrl._insert_value.currentDepartment === "object") {
              department = ctrl._insert_value.currentDepartment.id;
            } else {
              department = ctrl._insert_value.currentDepartment;
            }
            
            task_service
              .insert(
                ctrl._insert_value.estimate,
                ctrl._insert_value.files,
                ctrl._insert_value.title,
                ctrl._insert_value.departmentId,
                $("#" + idEditor).summernote("code"),
                ctrl._insert_value.task_list,
                ctrl._insert_value.main_person,
                ctrl._insert_value.participant,
                ctrl._insert_value.observer,
                ctrl._insert_value.from_date,
                ctrl._insert_value.to_date,
                ctrl._insert_value.has_time,
                ctrl._insert_value.hours,
                task_service.taskPriorityTransform(ctrl._insert_value.priority)
                  .key,
                task_service.taskTypeTransform(ctrl._insert_value.task_type)
                  .key,
                ctrl._insert_value.head_task_id,
                ctrl._parentID,
                ctrl._insert_value.currentProject,
                department,
                ctrl._insert_value.dispatch_arrived_id,
                ctrl._insert_value.level,
                ctrl._insert_value.label,
                $scope.draft,
                parents,
                parent,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                ctrl._insert_value.child_work_percent
              )
              .then(
                function (res) {
                  $("#modal_Task_Dir_Insert").modal("hide");
                  dfd.resolve(true);
                  dfd = undefined;
                  $scope.handleSuccessFunc({
                    params: {
                      resData: res.data,
                    },
                  });
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          }

          ctrl.insert = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "insert",
              insert_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Task_Dir_Insert",
            function (e) {
              if (e.target.id == "modal_Task_Dir_Insert") {
                $scope.$apply(function () {
                  ctrl.prepareInsert();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("taskUpdateModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/task_update_modal.html",
      scope: {
        handleSuccessFunc: "&",
        insertHeadTaskId: "<",
        insertCurrentDepartment: "<",
        insertDispatchArrivedId: "<",
        insertCurrentProject: "<",
        skipNextInsertModals: "<",
        item: "<",
        target: "@",
        noCommit: "<",
      },
      controller: [
        "task_service",
        "$q",
        "$rootScope",
        "$scope",
        "$filter",
        function (task_service, $q, $rootScope, $scope, $filter) {
          $scope.target = $scope.target || "users";
          $scope.noCommit = $scope.noCommit || false;

          const _statusValueSet = [
            { name: "Task", action: "init" },
            { name: "Task", action: "load" },
            { name: "Task", action: "update" },
            { name: "Task", action: "pushFile" },
            { name: "Task", action: "removeFile" },
          ];
          const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
          const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");

          var ctrl = this;
          var idEditor = "updateTask_dir_content";
          $scope.ctrl = ctrl;
          // init variables
          {
            ctrl._ctrlName = "task_update_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.TaskPriority = {
              master_key: "task_priority",
              load_details_column: "value",
            };
            ctrl.TaskType = {
              master_key: "task_type",
              load_details_column: "value",
            };
            ctrl._update_value = {};

            ctrl.Status = [
              {
                title: {
                  "vi-VN": "Chưa bắt đầu",
                  "en-US": "Not started yet",
                },
                key: "NotStartedYet",
              },
              {
                title: {
                  "vi-VN": "Đang triển khai",
                  "en-US": "Processing",
                },
                key: "Processing",
              },
              {
                title: {
                  "vi-VN": "Hoàn thành",
                  "en-US": "Completed",
                },
                key: "Completed",
              },
              {
                title: {
                  "vi-VN": "Đã huỷ bỏ",
                  "en-US": "Cancelled",
                },
                key: "Cancelled",
              },
            ];
          }

          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };

          ctrl.chooseDepartment_update = function (val) {
            ctrl._update_value.currentDepartment = val.id;
          };

          ctrl.pickPriorityUpdate = function (val) {
            ctrl._update_value.priority = task_service.taskPriorityTransform(
              val.value
            ).value;
          };

          ctrl.pickTaskTypeUpdate = function (val) {
            ctrl._update_value.task_type = task_service.taskTypeTransform(
              val.value
            ).value;
          };

          ctrl.chooseFromDate_update = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              false,
              val,
              ctrl._update_value.to_date
            );
            ctrl._update_value.from_date = val ? val.getTime() : undefined;
          };

          ctrl.chooseToDate_update = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              false,
              ctrl._update_value.from_date,
              val
            );
            ctrl._update_value.to_date = val ? val.getTime() : undefined;
          };

          ctrl.chooseStatus_update = function (val) {
            ctrl._update_value.status = angular.copy(val.key);
          };

          ctrl.pickMainperson_update = function (val) {
            ctrl._update_value.main_person = [val];
          };
          ctrl.pickParticipant_update = function (val) {
            ctrl._update_value.participant = val;
          };
          ctrl.pickObserver_update = function (val) {
            ctrl._update_value.observer = val;
          };

          ctrl.prepareUpdate = function () {
            ctrl.workflow_plays = [];
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");
            if ($scope.item.workflowPlay) {
              ctrl.workflow_plays = [$scope.item.workflowPlay];
            } else {
              ctrl.workflow_plays = [];
            }
            if ($scope.item.notify_detail) {
              ctrl.notify_detail = $scope.item.notify_detail;
            } else {
              ctrl.notify_detail = null;
            }
            if (!$scope.item.repetitive) {
              $scope.item.repetitive = {
                has_expired: false,
                per: 1,
                cycle: "day", // allow: days, weeks, months, years
                expired_date: null, // null or "" khi ko hết hạn
              };
            }
            ctrl._update_value = angular.copy($scope.item);
            ctrl._update_value.attachment = (
              ctrl._update_value.attachment || []
            ).filter((att) => att.nameLib === "task");
            ctrl._update_value.currentDepartment = ctrl._update_value.department
              ? ctrl._update_value.department.id
              : null;
            ctrl._update_value.priority = task_service.taskPriorityTransform(
              ctrl._update_value.priority
            ).value;
            ctrl._update_value.task_type = (
              task_service.taskTypeTransform(ctrl._update_value.task_type) || {}
            ).value;
            $("#" + idEditor).summernote({
              placeholder: $filter("l")("InputContentHere"),
              callbacks: {
                onImageUpload: function (image) {
                  var formData = new FormData();
                  formData.append("type", "image");
                  formData.append("file", image[0], image[0].name);
                  task_service.uploadImage(formData).then(
                    function (res) {
                      var thisImage = $("<img>").attr("src", res.data.data);
                      $("#" + idEditor_update).summernote(
                        "insertNode",
                        thisImage[0]
                      );
                    },
                    function (err) {}
                  );
                },
              },
            });
            $("#" + idEditor).summernote("code", $scope.item.content);
          };

          function pushFile_service(file) {
            return function () {
              var dfd = $q.defer();
              task_service.pushFile(file, ctrl._update_value._id).then(
                function (res) {
                  ctrl._update_value.attachment.push(res.data);
                  ctrl.refreshData();
                  dfd.resolve(true);
                  dfd = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
              return dfd.promise;
            };
          }

          ctrl.pushFile_update = function (file) {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "pushFile",
              pushFile_service(file)
            );
          };

          function removeFile_service(filename) {
            return function () {
              var dfd = $q.defer();
              task_service.removeFile(ctrl._update_value._id, filename).then(
                function (res) {
                  var temp = [];
                  for (var i in ctrl._update_value.attachment) {
                    if (ctrl._update_value.attachment[i].name !== filename) {
                      temp.push(ctrl._update_value.attachment[i]);
                    }
                  }
                  ctrl._update_value.attachment = temp;
                  ctrl.refreshData();
                  temp = undefined;
                  dfd.resolve(true);
                  dfd = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
              return dfd.promise;
            };
          }

          ctrl.removeFile_update = function (item) {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "removeFile",
              removeFile_service(item.name)
            );
          };

          ctrl.choosePriority = function (val) {
            const priority = task_service.taskPriorityTransform(val.value);
            ctrl._update_value.priority = priority.key;
            ctrl._filterPriority = priority.value;
          };

          ctrl.chooseTaskType = function (val) {
            const taskType = task_service.taskTypeTransform(val.value);
            ctrl._update_value.task_type = taskType.key;
            ctrl._filterTaskType = taskType.value;
          };

          ctrl.addCheckList_update = function () {
            var d = new Date();
            ctrl._update_value.task_list.push({
              title: "",
              status: false,
              id: d.getTime().toString(),
            });
            ctrl._update_value.focusChecklist = d.getTime().toString();
          };

          ctrl.loadLabel = function ({ search, top, offset, sort }) {
            var dfd = $q.defer();
            task_service.load_label(search, top, offset, sort).then(
              function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.loadLabel_details = function ({ ids }) {
            var dfd = $q.defer();
            task_service.loadLabel_details(ids).then(
              function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.pickLabel = function (value) {
            ctrl._update_value.label = value;
          };

          ctrl.removeCheckList_update = function (id) {
            ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
              (e) => e.id !== id
            );
          };

          ctrl.chooseFromDate_update = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              true,
              val,
              ctrl._update_value.to_date
            );
            ctrl._update_value.from_date = val ? val.getTime() : undefined;
          };

          ctrl.chooseToDate_update = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              true,
              ctrl._update_value.from_date,
              val
            );
            ctrl._update_value.to_date = val ? val.getTime() : undefined;
          };

          ctrl.pickMainperson_update = function (val) {
            ctrl._update_value.main_person = val;
          };
          ctrl.pickParticipant_update = function (val) {
            ctrl._update_value.participant = val;
          };
          ctrl.pickObserver_update = function (val) {
            ctrl._update_value.observer = val;
          };

          /**UPDATE TASK */
          ctrl.addCheckList_update = function () {
            var d = new Date();
            ctrl._update_value.task_list.push({
              title: "",
              status: false,
              id: d.getTime().toString(),
            });
            ctrl._update_value.focusChecklist = d.getTime().toString();
          };

          ctrl.removeCheckList_update = function (id) {
            ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
              (e) => e.id !== id
            );
          };

          function update_service() {
            if ($scope.noCommit) {
              $("#modal_Task_Dir_Update").modal("hide");
              $scope.handleSuccessFunc({
                params: {
                  updateValue: {
                    ...ctrl._update_value,
                    note: $("#" + idEditor).summernote("code"),
                  },
                },
              });
              return $q.resolve(true);
            }

            const dispatch_arrived_id =
              ctrl._update_value.parent &&
              ctrl._update_value.parent.object === "dispatch_arrived"
                ? ctrl._update_value.parent.value
                : null;

            var dfd = $q.defer();
            task_service
              .update(
                ctrl._update_value._id,
                ctrl._update_value.title,
                $("#" + idEditor).summernote("code"),
                ctrl._update_value.task_list,
                ctrl._update_value.main_person,
                ctrl._update_value.participant,
                ctrl._update_value.observer,
                ctrl._update_value.from_date,
                ctrl._update_value.to_date,
                ctrl._update_value.status,
                ctrl._update_value.has_time,
                task_service.taskPriorityTransform(ctrl._update_value.priority)
                  .key,
                (
                  task_service.taskTypeTransform(
                    ctrl._update_value.task_type
                  ) || {}
                ).key,
                ctrl._update_value.workflowPlay_id || "",
                ctrl._update_value.label,
                dispatch_arrived_id,
                ctrl._update_value.currentDepartment
              )
              .then(
                function (res) {
                  $("#modal_Task_Dir_Update").modal("hide");
                  dfd.resolve(true);
                  dfd = undefined;
                  $scope.handleSuccessFunc({
                    params: {
                      resData: res.data,
                    },
                  });
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          }

          ctrl.update = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "update",
              update_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Task_Dir_Update",
            function (e) {
              if (e.target.id == "modal_Task_Dir_Update") {
                $scope.$apply(function () {
                  ctrl.prepareUpdate();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("recurringTaskInsertModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/recurring_task_insert_modal.html",
      scope: {
        handleSuccessFunc: "&",
      },
      controller: [
        "task_service",
        "$q",
        "$rootScope",
        "$scope",
        "$filter",
        function (task_service, $q, $rootScope, $scope, $filter) {
          const _statusValueSet = [
            { name: "Task", action: "init" },
            { name: "Task", action: "load" },
            { name: "Task", action: "insert" },
          ];

          var ctrl = this;
          var idEditor = "insertTask_dir_content";
          $scope.ctrl = ctrl;
          // init variables
          {
            ctrl._ctrlName = "recurring_task_insert_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.TaskPriority = {
              master_key: "task_priority",
              load_details_column: "value",
            };
            ctrl.TaskType = {
              master_key: "task_type",
              load_details_column: "value",
            };
            ctrl._insert_value = {};
          }

          ctrl.chooseDepartment_insert = function (value) {
            ctrl._insert_value.departments = value;
          };

          ctrl.chooseHasEndDateRepetitive_insert = function (val) {
            ctrl._insert_value.repetitive.has_expired = val;
            if (val === false) {
              ctrl._insert_value.repetitive.expired_date = null;
            }
          };

          ctrl.chooseEndDate_insert = function (val) {
            ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(
              true,
              ctrl._insert_value.repetitive.expired_date,
              val
            );
            ctrl._insert_value.repetitive.expired_date = val
              ? val.getTime()
              : null;
          };

          ctrl.prepareInsert = function (val) {
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");

            var today = new Date();

            var myToday = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              0,
              0,
              0
            );
            var endDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              23,
              59,
              59
            );
            ctrl._filterPriority = "";
            ctrl._filterTaskType = "";
            ctrl._insert_value = {
              title: "",
              from_date: myToday.getTime(),
              to_date: endDay.getTime(),
              priority: 1,
              departments: [],
              level: "Task",
              label: [],
              has_repetitive: false,
              repetitive: {
                has_expired: false,
                per: 1,
                cycle: "day", // allow: days, weeks, months, years
                expired_date: null, // null or "" khi ko hết hạn
              },
            };
          };

          ctrl.choosePriority = function (val) {
            const priority = task_service.taskPriorityTransform(val.value);
            ctrl._insert_value.priority = priority.key;
            ctrl._filterPriority = priority.value;
          };

          ctrl.chooseTaskType = function (val) {
            const taskType = task_service.taskTypeTransform(val.value);
            ctrl._insert_value.task_type = taskType.key;
            ctrl._filterTaskType = taskType.value;
          };
          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };
          ctrl.chooseFromDate_insert = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              true,
              val,
              ctrl._insert_value.to_date
            );
            ctrl._insert_value.from_date = val ? val.getTime() : undefined;
          };

          ctrl.chooseToDate_insert = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              true,
              ctrl._insert_value.from_date,
              val
            );
            ctrl._insert_value.to_date = val ? val.getTime() : undefined;
          };

          /**UPDATE TASK */

          function insert_service() {
            var dfd = $q.defer();
            task_service
              .insert_recurring_task(
                ctrl._insert_value.title,
                ctrl._insert_value.departments,
                ctrl._insert_value.priority,
                ctrl._insert_value.task_type,
                ctrl._insert_value.from_date,
                ctrl._insert_value.to_date,
                ctrl._insert_value.repetitive
              )
              .then(
                function () {
                  $("#modal_Recurring_Task_Dir_Insert").modal("hide");
                  $scope.handleSuccessFunc();
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

          ctrl.insert = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "insert",
              insert_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Recurring_Task_Dir_Insert",
            function (e) {
              if (e.target.id == "modal_Recurring_Task_Dir_Insert") {
                $scope.$apply(function () {
                  ctrl.prepareInsert();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("recurringTaskUpdateModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/recurring_task_update_modal.html",
      scope: {
        handleSuccessFunc: "&",
        item: "<",
      },
      controller: [
        "task_service",
        "$q",
        "$rootScope",
        "$scope",
        "$filter",
        function (task_service, $q, $rootScope, $scope, $filter) {
          const _statusValueSet = [
            { name: "Task", action: "init" },
            { name: "Task", action: "load" },
            { name: "Task", action: "update" },
          ];

          var ctrl = this;
          $scope.ctrl = ctrl;
          // init variables
          {
            ctrl._ctrlName = "recurring_task_update_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl.TaskPriority = {
              master_key: "task_priority",
              load_details_column: "value",
            };
            ctrl.TaskType = {
              master_key: "task_type",
              load_details_column: "value",
            };
            ctrl._update_value = {};
          }

          ctrl.chooseDepartment_update = function (value) {
            ctrl._update_value.departments = value;
          };

          ctrl.chooseEndDate_update = function (val) {
            ctrl.endDate_ErrorMsg = $rootScope.isValidEndDate(
              true,
              ctrl._update_value.repetitive.expired_date,
              val
            );
            ctrl._update_value.repetitive.expired_date = val
              ? val.getTime()
              : null;
          };

          ctrl.prepareUpdate = function () {
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");

            ctrl._update_value = angular.copy($scope.item);
            ctrl._update_value.priority = task_service.taskPriorityTransform(
              ctrl._update_value.priority
            ).value;
            ctrl._update_value.departments = ctrl._update_value.department.map(
              (e) => e.department_id
            );
            ctrl._update_value.task_type = (
              task_service.taskTypeTransform(ctrl._update_value.task_type) || {}
            ).value;
          };

          ctrl.choosePriority = function (val) {
            const priority = task_service.taskPriorityTransform(val.value);
            ctrl._update_value.priority = priority.key;
            ctrl._filterPriority = priority.value;
          };

          ctrl.chooseTaskType = function (val) {
            const taskType = task_service.taskTypeTransform(val.value);
            ctrl._update_value.task_type = taskType.key;
            ctrl._filterTaskType = taskType.value;
          };
          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };
          ctrl.chooseFromDate_update = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              true,
              val,
              ctrl._update_value.to_date
            );
            ctrl._update_value.from_date = val ? val.getTime() : undefined;
          };

          ctrl.chooseToDate_update = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              true,
              ctrl._update_value.from_date,
              val
            );
            ctrl._update_value.to_date = val ? val.getTime() : undefined;
          };

          /**UPDATE TASK */

          function update_service() {
            var dfd = $q.defer();
            task_service
              .update_recurring_task(
                ctrl._update_value._id,
                ctrl._update_value.title,
                ctrl._update_value.departments,
                task_service.taskPriorityTransform(ctrl._update_value.priority)
                  .key,
                (
                  task_service.taskTypeTransform(
                    ctrl._update_value.task_type
                  ) || {}
                ).key,
                ctrl._update_value.from_date,
                ctrl._update_value.to_date,
                ctrl._update_value.repetitive
              )
              .then(
                function () {
                  $("#modal_Recurring_Task_Dir_Update").modal("hide");
                  $scope.handleSuccessFunc();
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

          ctrl.update = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "update",
              update_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Recurring_Task_Dir_Update",
            function (e) {
              if (e.target.id == "modal_Recurring_Task_Dir_Update") {
                $scope.$apply(function () {
                  ctrl.prepareUpdate();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("taskCancelModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/task_cancel_modal.html",
      scope: {
        handleSuccessFunc: "&",
        cancelItem: "<",
      },
      controller: [
        "task_service",
        "$q",
        "$rootScope",
        "$scope",
        "$filter",
        function (task_service, $q, $rootScope, $scope, $filter) {
          const _statusValueSet = [
            { name: "Task", action: "init" },
            { name: "Task", action: "load" },
            { name: "Task", action: "cancel" },
          ];

          var ctrl = this;
          var idEditor = "cancelTask_dir_content";
          $scope.ctrl = ctrl;
          // init variables
          {
            ctrl._ctrlName = "task_cancel_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
          }

          ctrl.prepareCancel = function (value) {
            $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
            ctrl._cancel_value = angular.copy(value);

            $("#" + idEditor).summernote({
              placeholder: $filter("l")("InputContentHere"),
              callbacks: {
                onImageUpload: function (image) {
                  var formData = new FormData();
                  formData.append("type", "image");
                  formData.append("file", image[0], image[0].name);
                  task_service.uploadImage(formData).then(
                    function (res) {
                      var thisImage = $("<img>").attr("src", res.data.data);
                      $("#" + idEditor_update).summernote(
                        "insertNode",
                        thisImage[0]
                      );
                    },
                    function (err) {}
                  );
                },
              },
            });
            $("#" + idEditor).summernote("code", value.content);
          };
          function cancel_service() {
            var dfd = $q.defer();
            task_service
              .cancel(
                $scope.cancelItem._id,
                $("#" + idEditor).summernote("code")
              )
              .then(
                function () {
                  $("#modal_Task_Dir_Cancel").modal("hide");
                  $scope.handleSuccessFunc();
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

          ctrl.cancel = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "cancel",
              cancel_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Task_Dir_Cancel",
            function (e) {
              if (e.target.id == "modal_Task_Dir_Cancel") {
                $scope.$apply(function () {
                  ctrl.prepareCancel($scope.cancelItem);
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("projectInsertModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/project_insert_modal.html",
      scope: {
        taskId: "<",
        handleSuccessFunc: "&",
        parentItem: "<",
        parentType: "<",
      },
      controller: [
        "task_service",
        "workflow_play_service",
        "$q",
        "$rootScope",
        "$filter",
        "$location",
        "$scope",
        function (
          task_service,
          workflow_play_service,
          $q,
          $rootScope,
          $filter,
          $location,
          $scope
        ) {
          const _statusValueSet = [
            { name: "Task", action: "insertProject" },
            { name: "Task", action: "load" },
          ];

          var ctrl = this;
          $scope.ctrl = ctrl;

          const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
          const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");
          {
            ctrl._ctrlName = "project_insert_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl._insert_project_value = {};
          }
          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };
          ctrl.chooseFromDate_insert_project = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              true,
              val,
              ctrl._insert_project_value.to_date
            );
            ctrl._insert_project_value.from_date = val
              ? val.getTime()
              : undefined;
          };

          ctrl.chooseToDate_insert_project = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              true,
              ctrl._insert_project_value.from_date,
              val
            );
            ctrl._insert_project_value.to_date = val
              ? val.getTime()
              : undefined;
          };

          ctrl.prepareInsertProject = function () {
            $rootScope.statusValue.generate(
              ctrl._ctrlName,
              "Task",
              "insertProject"
            );
            var today = new Date();
            var myToday = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              0,
              0,
              0
            );
            var endDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 1,
              23,
              59,
              59
            );
            ctrl._insert_project_value = {
              title: "",
              from_date: myToday.getTime(),
              to_date: endDay.getTime(),
              participant: [],
              workflowPlay_id: "",
            };
          };

          ctrl.pickParticipant = function (val) {
            ctrl._insert_project_value.participant = val;
          };

          function insert_project_service() {
            var dfd = $q.defer();
            let parent = {};
            let parents = [];
            if ($scope.parentItem) {
              parent.id = $scope.parentItem._id;
              parent.object = $scope.parentType;
              switch ($scope.parentType) {
                case "task":
                case "dispatcharrived":
                  parent.code = $scope.parentItem.code;
                  break;
              }
              parents = $scope.parentItem.parents || [];
            }
            task_service
              .insert_project(
                ctrl._insert_project_value.title,
                ctrl._insert_project_value.from_date,
                ctrl._insert_project_value.to_date,
                ctrl._insert_project_value.participant,
                ctrl._insert_project_value.workflowPlay_id,
                $scope.taskId,
                parents,
                parent
              )
              .then(
                function () {
                  $("#modal_Project_Dir_Insert").modal("hide");
                  dfd.resolve(true);
                  dfd = undefined;
                  $scope.handleSuccessFunc();
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          }

          ctrl.insertProject = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "insertProject",
              insert_project_service
            );
          };

          ctrl.chooseWFP = function (val) {
            ctrl._insert_project_value.workflowPlay_id = val._id;
          };

          ctrl.load_WFP = function (params) {
            let dfd = $q.defer();
            workflow_play_service
              .load(
                params.search,
                undefined,
                undefined,
                "all",
                10,
                0,
                { _id: -1 },
                ["Approved", "SaveODB"]
              )
              .then(
                function (res) {
                  dfd.resolve(res.data);
                  res = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          };

          ctrl.count_WFP = function (params) {
            let dfd = $q.defer();
            workflow_play_service
              .count(params.search, undefined, "Approved", "all")
              .then(
                function (res) {
                  dfd.resolve(res.data);
                  res = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          };

          ctrl.loadWFP_details = function (params) {
            let dfd = $q.defer();
            workflow_play_service.loadWFP_details(params.id).then(
              function (res) {
                dfd.resolve(res.data);
                res = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Project_Dir_Insert",
            function (e) {
              if (e.target.id === "modal_Project_Dir_Insert") {
                $scope.$apply(function () {
                  ctrl.prepareInsertProject();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("projectUpdateModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/project_update_modal.html",
      scope: {
        projectInfo: "<",
        handleSuccessFunc: "&",
      },
      controller: [
        "task_service",
        "workflow_play_service",
        "$q",
        "$rootScope",
        "$filter",
        "$location",
        "$scope",
        function (
          task_service,
          workflow_play_service,
          $q,
          $rootScope,
          $filter,
          $location,
          $scope
        ) {
          const _statusValueSet = [
            { name: "Task", action: "updateProject" },
            { name: "Task", action: "load" },
            { name: "Task", action: "loadProject" },
            { name: "Task", action: "count" },
          ];

          var ctrl = this;
          $scope.ctrl = ctrl;

          {
            ctrl._ctrlName = "project_update_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl._update_project_value = {};
          }

          function getIdByObject(data, objectName) {
            const foundObject = data.reference.find(
              (item) => item.object === objectName
            );
            return foundObject ? foundObject.id : "";
          }

          ctrl.prepareUpdateProject = function () {
            $rootScope.statusValue.generate(
              ctrl._ctrlName,
              "Task",
              "updateProject"
            );
            ctrl._update_project_value = angular.copy($scope.projectInfo);
            ctrl._update_project_value.workflowPlay_id = getIdByObject(
              $scope.projectInfo,
              "WorkflowPlay"
            );
          };

          ctrl.chooseWFP_update_project = function (val) {
            ctrl._update_project_value.workflowPlay_id = val._id;
          };

          function load_project_service() {
            var dfd = $q.defer();
            ctrl.Projects = [];
            let _filter = generateFilter_Project();
            task_service
              .load_project(
                _filter.search,
                ctrl.numOfItemPerPage_Project,
                ctrl.offset_Project,
                ctrl.sort_Project.query
              )
              .then(
                function (res) {
                  ctrl.Projects = res.data;
                  let currentId = $location.search().id;
                  if (ctrl.Projects && currentId) {
                    let currentProject = ctrl.Projects.find(
                      (prj) => prj._id === currentId
                    );
                    if (currentProject) {
                      $location.search("id", currentId);
                      ctrl.chooseProject(currentProject);
                    } else {
                      $location.search("id", null);
                    }
                    currentProject = undefined;
                  }
                  dfd.resolve(true);
                  currentId = undefined;
                },
                function () {
                  dfd.reject(false);
                  err = undefined;
                }
              );
            return dfd.promise;
          }

          ctrl.loadProject = function (val) {
            if (val != undefined) {
              ctrl.offset_Project = angular.copy(val);
            }
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "loadProject",
              load_project_service
            );
          };

          function count_project_service() {
            var dfd = $q.defer();
            var _filter = generateFilter_Project();
            task_service.count_project(_filter.search).then(
              function (res) {
                ctrl.totalItems_Project = res.data.count;
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

          ctrl.countProject = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "count",
              count_project_service
            );
          };

          ctrl.load_WFP = function (params) {
            let dfd = $q.defer();
            workflow_play_service
              .load(
                params.search,
                undefined,
                undefined,
                "all",
                10,
                0,
                { _id: -1 },
                ["Approved", "SaveODB"]
              )
              .then(
                function (res) {
                  dfd.resolve(res.data);
                  res = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          };

          ctrl.count_WFP = function (params) {
            let dfd = $q.defer();
            workflow_play_service
              .count(params.search, undefined, "Approved", "all")
              .then(
                function (res) {
                  dfd.resolve(res.data);
                  res = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          };

          ctrl.loadWFP_details = function (params) {
            let dfd = $q.defer();
            workflow_play_service.loadWFP_details(params.id).then(
              function (res) {
                dfd.resolve(res.data);
                res = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };

          ctrl.refreshData_Project = function () {
            ctrl.loadProject();
            ctrl.countProject();
          };

          ctrl.pickParticipant_project_update = function (val) {
            task_service
              .update_participant_project(ctrl._update_project_value._id, val)
              .then(
                function () {
                  ctrl.refreshData_Project();
                },
                function (err) {
                  console.log(err);
                }
              );
          };
          const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
          const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");

          ctrl.isValidFromDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !fromDate || fromDate > toDate ? From_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? From_Date_Error_Msg : "";
            }
          };

          ctrl.isValidToDate = function (isInsert, fromDate, toDate) {
            if (isInsert) {
              return !toDate || fromDate > toDate ? To_Date_Error_Msg : "";
            } else {
              return fromDate > toDate ? To_Date_Error_Msg : "";
            }
          };
          ctrl.chooseFromDate_update_project = function (val) {
            ctrl.fromDate_ErrorMsg = ctrl.isValidFromDate(
              false,
              val,
              ctrl._update_project_value.to_date
            );
            ctrl._update_project_value.from_date = val
              ? val.getTime()
              : undefined;
          };

          ctrl.chooseToDate_update_project = function (val) {
            ctrl.toDate_ErrorMsg = ctrl.isValidToDate(
              false,
              ctrl._update_project_value.from_date,
              val
            );
            ctrl._update_project_value.to_date = val
              ? val.getTime()
              : undefined;
          };

          function update_project_service() {
            var dfd = $q.defer();
            task_service
              .update_project(
                ctrl._update_project_value._id,
                ctrl._update_project_value.title,
                ctrl._update_project_value.from_date,
                ctrl._update_project_value.to_date,
                ctrl._update_project_value.workflowPlay_id
              )
              .then(
                function () {
                  $scope.handleSuccessFunc();
                  $("#modal_Project_Dir_Update").modal("hide");
                  ctrl.refreshData_Project();
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

          ctrl.updateProject = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "updateProject",
              update_project_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Project_Dir_Update",
            function (e) {
              if (e.target.id === "modal_Project_Dir_Update") {
                $scope.$apply(function () {
                  ctrl.prepareUpdateProject();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("projectDeleteModal", [
  "$rootScope",
  "fRoot",
  function ($rootScope, fRoot) {
    return {
      restrict: "E",
      templateUrl:
        FrontendDomain +
        "/modules/office/task/directives/project_delete_modal.html",
      scope: {
        projectInfo: "<",
        handleSuccessFunc: "&",
      },
      controller: [
        "task_service",
        "workflow_play_service",
        "$q",
        "$rootScope",
        "$filter",
        "$location",
        "$scope",
        function (
          task_service,
          workflow_play_service,
          $q,
          $rootScope,
          $filter,
          $location,
          $scope
        ) {
          const _statusValueSet = [
            { name: "Task", action: "deleteProject" },
            { name: "Task", action: "load" },
            { name: "Task", action: "loadProject" },
            { name: "Task", action: "count" },
          ];

          var ctrl = this;
          $scope.ctrl = ctrl;

          {
            ctrl._ctrlName = "project_update_modal_controller";
            $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            ctrl._update_project_value = {};
          }

          ctrl.prepareDeleteProject = function () {
            $rootScope.statusValue.generate(
              ctrl._ctrlName,
              "Task",
              "deleteProject"
            );
            ctrl.currentProject = $scope.projectInfo;
          };

          function delete_project_service() {
            var dfd = $q.defer();
            task_service
              .delete_project(
                ctrl.currentProject._id,
                ctrl.currentProject.retype
              )
              .then(
                function () {
                  $("#modal_Project_Dir_Delete").modal("hide");
                  $rootScope.statusValue.generate(
                    ctrl._ctrlName,
                    "Task",
                    "deleteProject"
                  );
                  $scope.handleSuccessFunc();
                  dfd.resolve(true);
                  ctrl.currentProject = {};
                  ctrl.strategics = [];
                  ctrl.tasks = [];
                  dfd = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
            return dfd.promise;
          }

          ctrl.deleteProject = function () {
            return $rootScope.statusValue.execute(
              ctrl._ctrlName,
              "Task",
              "deleteProject",
              delete_project_service
            );
          };

          $(document).on(
            "show.bs.modal",
            "#modal_Project_Dir_Delete",
            function (e) {
              if (e.target.id === "modal_Project_Dir_Delete") {
                $scope.$apply(function () {
                  ctrl.prepareDeleteProject();
                });
              }
            }
          );
        },
      ],
    };
  },
]);

myApp.compileProvider.directive("taskDetails", function () {
  return {
    restrict: "E",
    templateUrl:
      FrontendDomain + "/modules/office/task/directives/task_details.html",
    scope: {
      itemId: "<",
    },
    controller: [
      "task_details_service",
      "languageValue",
      "notify_service",
      "$q",
      "$rootScope",
      "$scope",
      "$filter",
      "$timeout",
      "$window",
      function (
        task_details_service,
        languageValue,
        notify_service,
        $q,
        $rootScope,
        $scope,
        $filter,
        $timeout,
        $window
      ) {
        /**declare variable */
        const _statusValueSet = [
          { name: "Task", action: "loadDetails" },
          { name: "Task", action: "start" },
          { name: "Task", action: "done" },
          { name: "Task", action: "cancel" },
          { name: "Task", action: "complete" },
          { name: "Task", action: "comment" },
          { name: "Task", action: "updateProgress" },
          { name: "Task", action: "insert" },
          { name: "Task", action: "init" },
          { name: "Task", action: "load" },
          { name: "Task", action: "pushFile" },
          { name: "Task", action: "removeFile" },
          { name: "Task", action: "transferTicketTemplatePreview" },
          { name: "Task", action: "signAFile" },
          { name: "Task", action: "linkWorkflowPlay" },
          { name: "Task", action: "updateProject" },
          { name: "Task", action: "AddProof" },
          { name: "Task", action: "RemoveProof" },
        ];
        var ctrl = this;
        $scope.ctrl = ctrl;

        const idEditor = "insertTransferTicket_content";
        const From_Date_Error_Msg = $filter("l")("FromDateErrorMsg");
        const To_Date_Error_Msg = $filter("l")("ToDateErrorMsg");

        $rootScope.isValidFromDate = function (isInsert, fromDate, toDate) {
          return isInsert
            ? !fromDate || fromDate >= toDate
              ? From_Date_Error_Msg
              : ""
            : fromDate >= toDate
            ? From_Date_Error_Msg
            : "";
        };

        $rootScope.isValidToDate = function (isInsert, fromDate, toDate) {
          return isInsert
            ? !toDate || fromDate >= toDate
              ? To_Date_Error_Msg
              : ""
            : fromDate >= toDate
            ? To_Date_Error_Msg
            : "";
        };

        /** init variable */
        {
          ctrl._ctrlName = "task_details_controller";
          ctrl.Item = {};
          ctrl.tab = "responsibility";
          ctrl.status = "see";
          ctrl.cycle = "";
          ctrl.commentText = "";
          ctrl.proofText = "";
          ctrl.startWatchComment = false;
          ctrl.startWatchProof = false;
          ctrl.files = [];
          ctrl.filesProof = [];
          ctrl.proofErr = "";
          ctrl.proofFileSizeErr = false;
          ctrl._notyetInit = true;
          ctrl.workflow_play = [];
          ctrl.notify_detail = null;
          ctrl._insert_value = {};
          ctrl.showPopup = false;
          ctrl.titlePopup = "";
          ctrl.contentPopup = "";
          ctrl.typePopup = "";

          ctrl.TaskPriority = {
            master_key: "task_priority",
            load_details_column: "value",
          };
          ctrl.TaskType = {
            master_key: "task_type",
            load_details_column: "value",
          };

          ctrl._urlInsertTransferTicketModal =
            FrontendDomain +
            "/modules/office/task/details/views/insert_transfer_ticket_modal.html";

          $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        }

        /** show Attachment */
        ctrl.loadfile = function (params) {
          return function () {
            var dfd = $q.defer();
            task_details_service.loadFileInfo(params.id, params.name).then(
              function (res) {
                dfd.resolve({
                  display: res.data.display,
                  embedUrl: res.data.url,
                  guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
              },
              function (err) {}
            );
            return dfd.promise;
          };
        };

        ctrl.loadfileWFP = function (params) {
          return function () {
            var dfd = $q.defer();
            task_details_service.loadFileInfoWFP(params.id, params.name).then(
              function (res) {
                dfd.resolve({
                  display: res.data.display,
                  embedUrl: res.data.url,
                  guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
              },
              function (err) {}
            );
            return dfd.promise;
          };
        };

        /**show Information Details*/

        function loadDetails_service() {
          var dfd = $q.defer();
          var draftKeyList = Object.keys(localStorage).map((str) =>
            str.substring(6)
          );
          var draftKey = `draft_${draftKeyList.find(
            (id) => id === ctrl.thisId
          )}`;
          ctrl.commentText = $window.localStorage.getItem(draftKey) || "";
          ctrl.startWatchComment = true;
          ctrl.startWatchProof = true;
          let currentDepartment = "";
          ctrl.label = [];
          if ($rootScope.detailsInfo.params) {
            currentDepartment = $rootScope.detailsInfo.params.currentDepartment;
          }
          task_details_service
            .loadDetails(ctrl.thisId, ctrl.thisCode, currentDepartment)
            .then(
              function (res) {
                ctrl.Item = res.data;
                ctrl.task_type = task_details_service.taskTypeTransform(
                  ctrl.Item.task_type
                ).value;
                ctrl.workflow_play = [res.data.workflowPlay] || [];
                ctrl.notify_detail = res.data.notify_detail || null;
                ctrl.cycle = ctrl.Item.repetitive
                  ? ctrl.Item.repetitive.cycle.charAt(0).toUpperCase() +
                    ctrl.Item.repetitive.cycle.slice(1)
                  : "";

                if (ctrl.Item.label && ctrl.Item.label.length > 0) {
                  loadLabel_details();
                }

                switch (ctrl.Item.status) {
                  case "NotStartedYet":
                    ctrl.status = "start";
                    break;
                  case "Processing":
                    ctrl.status = "completed";
                    break;
                  case "Cancelled":
                    ctrl.status = "cancelled";
                    break;
                  default:
                    ctrl.status = "see";
                }
                $timeout(function () {
                  ctrl._notyetInit = false;
                }, 1000);
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
              },
              function (err) {
                $rootScope.urlPage = urlNotFoundPage;
                dfd.reject(err);
                err = undefined;
              }
            );
          return dfd.promise;
        }

        ctrl.loadDetails = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadDetails",
            loadDetails_service
          );
        };

        function loadLabel_details() {
          var dfd = $q.defer();

          task_details_service.loadLabel_details(ctrl.Item.label).then(
            function (res) {
              ctrl.label = res.data;
              dfd.resolve(true);
            },
            function (err) {
              dfd.reject(err);
            }
          );
          return dfd.promise;
        }

        // INSERT WORKFLOW
        ctrl.handleInsertWFPSuccess = function (data) {
          $(".task-insert-directive #modal_WFP_Insert").modal("hide");
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "linkWorkflowPlay",
            linkWorkflowPlay_service(data[0]._id)
          );
        };

        function linkWorkflowPlay_service(workflowPlay_id) {
          task_details_service
            .link_workflow_play(ctrl.thisId, workflowPlay_id)
            .then(
              function (res) {
                ctrl.loadDetails();
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
          load_employee_info();
        }

        //START TASK

        function start_service() {
          var dfd = $q.defer();
          task_details_service.start(ctrl.thisId).then(
            function (res) {
              ctrl.loadDetails();
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

        ctrl.start = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "start",
            start_service
          );
        };

        //DONE TASK

        function done_service() {
          var dfd = $q.defer();
          task_details_service.done(ctrl.thisId).then(
            function (res) {
              ctrl.loadDetails();
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

        ctrl.done = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "done",
            done_service
          );
        };

        //COMPLETE TASK
        function complete_service() {
          var dfd = $q.defer();
          task_details_service.complete(ctrl.thisId).then(
            function (res) {
              ctrl.loadDetails();
              dfd.resolve(true);
              emitReloadEvent($scope.item.code)
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

        ctrl.complete = function () {
          if (
            (!ctrl.Item.proof || ctrl.Item.proof.length === 0) &&
            (!ctrl.Item.comment || ctrl.Item.comment.length === 0)
          ) {
            openPopup(
              "Warning",
              "ProofOrCommentIsRequiredForTheTask",
              "warning"
            );
            return;
          }
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "complete",
            complete_service
          );
        };

        // CANCEL TASK

        function cancel_service() {
          var dfd = $q.defer();
          task_details_service.cancel(ctrl.Item._id).then(
            function (res) {
              ctrl.loadDetails();
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

        ctrl.cancel = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "cancel",
            cancel_service
          );
        };

        function updateProgress() {
          var dfd = $q.defer();
          task_details_service
            .update_progress(ctrl.Item._id, ctrl.Item.progress)
            .then(
              function () {
                ctrl.loadDetails();
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

        ctrl.changeProgressOfTask = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "updateProgress",
            updateProgress
          );
        };

        // Add Proof
        ctrl.removeFilesProof = function (name) {
          ctrl.filesProof = ctrl.filesProof.filter((e) => e.name !== name);
        };

        ctrl.onProofFileExceedsLimit = function (params) {
          if (params.error) {
            ctrl.proofFileSizeErr = true;
          } else {
            ctrl.proofFileSizeErr = false;
          }
        };

        function get_value_error(key) {
          var valueErr = "FailureAction";
          for (var i in languageValue.details) {
            if (languageValue.details[i].key == key) {
              valueErr = languageValue.details[i];
              break;
            }
          }
          return valueErr && valueErr.value ? valueErr.value : "FailureAction";
        }

        function add_proof_service() {
          var dfd = $q.defer();
          if (ctrl.proofText.length > 0) {
            let filesProof = ctrl.filesProof.map((file) => {
              const date = new Date();
              const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
                date.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}${date.getFullYear()}-${date
                .getHours()
                .toString()
                .padStart(2, "0")}.${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}.${date
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;
              let fileExtension = file.name.split(".").pop();
              let fileName = file.name.replace(/\.[^/.]+$/, "");
              return {
                ...file,
                name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
              };
            });
            task_details_service
              .add_proof(ctrl.thisId, ctrl.proofText, filesProof)
              .then(
                function (res) {
                  ctrl.proofErr = "";
                  ctrl.proofText = "";
                  ctrl.filesProof = [];
                  ctrl.proofFileSizeErr = false;
                  ctrl.loadDetails();
                  dfd.resolve(true);
                  res = undefined;
                  dfd = undefined;
                },
                function (err) {
                  ctrl.proofErr = get_value_error(err.data.mes);
                  dfd.reject(err);
                  err = undefined;
                }
              );
          }
          return dfd.promise;
        }
        ctrl.addProof = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "AddProof",
            add_proof_service
          );
        };

        function remove_proof_service(proofId) {
          var dfd = $q.defer();
          if (ctrl.Item.proof.length > 0) {
            task_details_service.remove_proof(ctrl.thisId, proofId).then(
              function (res) {
                ctrl.loadDetails();
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
          }
          return dfd.promise;
        }

        ctrl.removeProof = function (proofId) {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "RemoveProof",
            remove_proof_service(proofId)
          );
        };

        //COMMENT
        ctrl.removeFiles = function (name) {
          ctrl.files = ctrl.files.filter((e) => e.name !== name);
        };

        function comment_service() {
          var dfd = $q.defer();
          var draftKeyList = Object.keys(localStorage).map((str) =>
            str.substring(6)
          );
          var draftKey = `draft_${draftKeyList.find(
            (id) => id === ctrl.thisId
          )}`;

          if (ctrl.commentText.length > 0) {
            var formData = new FormData();
            formData.append("commentText", ctrl.commentText);

            ctrl.files.forEach(function (file) {
              formData.append("files", file);
            });

            task_details_service.comment(ctrl.thisId, formData).then(
              function (res) {
                $window.localStorage.removeItem(draftKey);
                ctrl.commentText = "";
                ctrl.files = [];
                ctrl.loadDetails();
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
          }
          return dfd.promise;
        }

        ctrl.comment = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "comment",
            comment_service
          );
        };

        // UPDATE TASK LIST STATUS
        ctrl.update_task_list_status = function (task_list_id, value) {
          task_details_service.update_task_list_status(
            ctrl.thisId,
            task_list_id,
            value
          );
        };

        //UPDATE TASK LIST
        function update_task_list_service() {
          task_details_service.update_task_list(
            ctrl.thisId,
            ctrl.Item.task_list
          );
        }

        ctrl.removeTaskList = function (id) {
          ctrl.Item.task_list = ctrl.Item.task_list.filter((e) => e.id !== id);
          update_task_list_service();
        };

        ctrl.addTaskList = function () {
          var d = new Date();
          ctrl.Item.task_list.push({
            title: "",
            status: false,
            id: d.getTime().toString(),
          });
          ctrl.Item.focusChecklist = d.getTime().toString();
          update_task_list_service();
        };

        ctrl.changeTextTaskList = function () {
          update_task_list_service();
        };

        ctrl.addTempText = function () {
          var draftKey = `draft_${ctrl.thisId}`;
          var inputStr = ctrl.commentText;
          if (inputStr.length == "") {
            $window.localStorage.removeItem(draftKey);
          } else {
            $window.localStorage.setItem(draftKey, inputStr);
          }
        };

        ctrl.getCommentCountWithoutCancel = function (comments) {
          var nonCancelComments = (comments || []).filter(function (comment) {
            return comment.type !== "Cancelled";
          });

          return nonCancelComments.length;
        };

        ctrl.handleSuccess = function () {
          ctrl.loadDetails();
        };

        // handle function for INSERT TRANSFER TICKET

        ctrl.chooseDepartment = function (val) {
          ctrl._insert_value.department = angular.copy(val.id);
        };

        ctrl.prepareInsertTransferTicket = function (val) {
          $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
          if (val) {
            ctrl._parentID = val._id;
            ctrl._parentTitle = val.title;
          } else {
            ctrl._parentID = undefined;
            ctrl._parentTitle = undefined;
          }

          $("#" + idEditor).summernote({
            placeholder: $filter("l")("InputContentHere"),
            callbacks: {
              onImageUpload: function (image) {
                var formData = new FormData();
                formData.append("type", "image");
                formData.append("file", image[0], image[0].name);
                task_details_service.uploadImage(formData).then(
                  function (res) {
                    var thisImage = $("<img>").attr("src", res.data.data);
                    $("#" + idEditor).summernote("insertNode", thisImage[0]);
                  },
                  function (err) {}
                );
              },
            },
          });
          $("#" + idEditor).summernote("code", "");
          var today = new Date();

          var myToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          );
          var endDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
          );
          ctrl._filterPriority = "";
          ctrl._filterTaskType = "";
          ctrl._insert_value = {
            files: [],
            title: "",
            task_list: [],
            main_person: [],
            participant: [],
            observer: [$rootScope.logininfo.username],
            from_date: myToday.getTime(),
            to_date: endDay.getTime(),
            has_time: false,
            hours: 0,
            priority: 1,
            department: "",
            transfer_ticket_values: {
              title: "",
              base: "",
              perform: "",
              content: "",
              recipient:
                "- Như trên; \n - BGH (để báo cáo); \n - Lưu: VT, (viết tắt người tham mưu).",
            },
          };
        };

        ctrl.choosePriority = function (val) {
          const priority = task_details_service.taskPriorityTransform(
            val.value
          );
          ctrl._insert_value.priority = priority.key;
          ctrl._filterPriority = priority.value;
        };

        ctrl.chooseTaskType = function (val) {
          const taskType = task_details_service.taskTypeTransform(val.value);
          ctrl._insert_value.task_type = taskType.key;
          ctrl._filterTaskType = taskType.value;
        };

        ctrl.addCheckList_insert = function () {
          var d = new Date();
          ctrl._insert_value.task_list.push({
            title: "",
            status: false,
            id: d.getTime().toString(),
          });
          ctrl._insert_value.focusChecklist = d.getTime().toString();
        };

        ctrl.removeCheckList_insert = function (id) {
          ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
            (e) => e.id !== id
          );
        };

        ctrl.chooseFromDate_insert = function (val) {
          ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(
            true,
            val,
            ctrl._insert_value.to_date
          );
          ctrl._insert_value.from_date = val ? val.getTime() : undefined;
        };

        ctrl.chooseToDate_insert = function (val) {
          ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(
            true,
            ctrl._insert_value.from_date,
            val
          );
          ctrl._insert_value.to_date = val ? val.getTime() : undefined;
        };

        ctrl.pickMainperson_insert = function (val) {
          ctrl._insert_value.main_person = val;
        };
        ctrl.pickParticipant_insert = function (val) {
          ctrl._insert_value.participant = val;
        };
        ctrl.pickObserver_insert = function (val) {
          ctrl._insert_value.observer = val;
        };

        /**UPDATE TASK */
        ctrl.addCheckList_update = function () {
          var d = new Date();
          ctrl._update_value.task_list.push({
            title: "",
            status: false,
            id: d.getTime().toString(),
          });
          ctrl._update_value.focusChecklist = d.getTime().toString();
        };

        ctrl.removeCheckList_update = function (id) {
          ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
            (e) => e.id !== id
          );
        };

        function preview_service() {
          var dfd = $q.defer();

          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          $rootScope.FileService.bind({
            display: "",
            embedUrl: "/component/loading.html",
          });
          $rootScope.FileService.show();
          task_details_service
            .transfer_ticket_preview(
              ctrl.Item.department,
              ctrl._insert_value.transfer_ticket_values,
              ctrl._insert_value.department
            )
            .then(
              function (res) {
                $rootScope.FileService.bind({
                  display: "Phiếu chuyển.docx",
                  embedUrl: res.data.url,
                  serviceName: "task",
                  attachmentId: "new",
                });

                dfd.resolve(true);
              },
              function (err) {
                dfd.reject(err);
              }
            );

          return dfd.promise;
        }

        ctrl.transferTicketTemplatePreview = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "transferTicketTemplatePreview",
            preview_service
          );
        };

        function load_employee_info() {
          var dfdAr = [];
          dfdAr.push(load_employee_detail());
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

        function load_employee_detail() {
          var dfd = $q.defer();
          task_details_service
            .loadEmployeeDetail($rootScope.logininfo.data.employee)
            .then(
              function (res) {
                ctrl.sign = res.data.signature.link;
                ctrl.quotationMark = res.data.quotationMark.link;
                dfd.resolve(true);
              },
              function () {
                dfd.reject(false);
                err = undefined;
              }
            );
          return dfd.promise;
        }

        function insert_transferTicket_service() {
          var dfd = $q.defer();
          task_details_service
            .insert_transfer_ticket(
              ctrl._insert_value.files,
              ctrl._insert_value.title,
              $("#" + idEditor).summernote("code"),
              ctrl._insert_value.task_list,
              ctrl._insert_value.main_person,
              ctrl._insert_value.participant,
              ctrl._insert_value.observer,
              ctrl._insert_value.from_date,
              ctrl._insert_value.to_date,
              ctrl._insert_value.has_time,
              ctrl._insert_value.hours,
              ctrl._insert_value.priority,
              ctrl._insert_value.task_type,
              ctrl._insert_value.transfer_ticket_values,
              ctrl.Item.department,
              ctrl._insert_value.department,
              ctrl.Item._id,
              ctrl._parentID,
              undefined
            )
            .then(
              function () {
                ctrl.loadDetails();
                $("#modal_TranferTicket_Insert").modal("hide");
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

        ctrl.insert = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "insert",
            insert_transferTicket_service
          );
        };

        function signAFile_service() {
          return function () {
            var dfd = $q.defer();
            task_details_service.signAFile(ctrl.Item._id).then(
              function (res) {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
              },
              function (err) {
                dfd.reject(err);
                err = undefined;
              }
            );
            return dfd.promise;
          };
        }

        ctrl.signAFile = function (filename) {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "signAFile",
            signAFile_service(filename)
          );
        };

        ctrl.handle_insert_notify_success = function (data) {
          $(".task-details-container #notify_insert_modal").modal("hide");
          ctrl.Item.notify_detail = data.data;
          ctrl._insert_value.notify_detail = data.data;
          ctrl.notify_detail = data.data;
        };

        ctrl.load_notify_file = function (params) {
          return function () {
            var dfd = $q.defer();
            notify_service.loadFileInfo(params.id, params.name).then(
              function (res) {
                dfd.resolve({
                  display: res.data.display,
                  embedUrl: res.data.url,
                  guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
              },
              function (err) {}
            );
            return dfd.promise;
          };
        };

        ctrl.closePopup = function () {
          ctrl.showPopup = false;
        };

        openPopup = (title, content, type) => {
          ctrl.showPopup = true;
          ctrl.titlePopup = title;
          ctrl.contentPopup = content;
          ctrl.typePopup = type;
          $rootScope.$apply();
        };

        $scope.$watch("itemId", (val) => {
          if (val) {
            ctrl.thisId = val;
            ctrl.loadDetails();
          }
        });
      },
    ],
  };
});

myApp.compileProvider.directive("taskView", function () {
  return {
    restrict: "E",
    templateUrl:
      FrontendDomain + "/modules/office/task/directives/task_view.html",
    scope: {
      itemId: "<",
    },
    controller: [
      "task_details_service",
      "$q",
      "$rootScope",
      "$scope",
      "$timeout",
      "$window",
      function (
        task_details_service,
        $q,
        $rootScope,
        $scope,
        $timeout,
        $window
      ) {
        /**declare variable */
        const _statusValueSet = [
          { name: "Task", action: "loadDetails" },
          { name: "Task", action: "comment" },
        ];
        var ctrl = this;
        $scope.ctrl = ctrl;

        const idEditor = "insertTransferTicket_content";
        const idEditor_comment = "Task_comment";
        /** init variable */
        {
          ctrl._ctrlName = "task_details_controller";
          ctrl.Item = {};
          ctrl.tab = "responsibility";
          ctrl.status = "see";
          ctrl.cycle = "";
          ctrl.commentText = "";
          ctrl.proofText = "";
          ctrl.startWatchComment = false;
          ctrl.startWatchProof = false;
          ctrl.files = [];
          ctrl.filesProof = [];
          ctrl.proofErr = "";
          ctrl.proofFileSizeErr = false;
          ctrl._notyetInit = true;
          ctrl.workflow_play = [];
          ctrl.notify_detail = null;
          ctrl._insert_value = {};
          ctrl.showPopup = false;
          ctrl.titlePopup = "";
          ctrl.contentPopup = "";
          ctrl.typePopup = "";

          ctrl.TaskPriority = {
            master_key: "task_priority",
            load_details_column: "value",
          };
          ctrl.TaskType = {
            master_key: "task_type",
            load_details_column: "value",
          };

          ctrl._urlInsertTransferTicketModal =
            FrontendDomain +
            "/modules/office/task/details/views/insert_transfer_ticket_modal.html";
          ctrl._urlComment =
            FrontendDomain + "/modules/office/task/directives/comment.html";

          $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        }

        /** show Attachment */
        ctrl.loadfile = function (params) {
          return function () {
            var dfd = $q.defer();
            task_details_service.loadFileInfo(params.id, params.name).then(
              function (res) {
                dfd.resolve({
                  display: res.data.display,
                  embedUrl: res.data.url,
                  guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
              },
              function (err) {}
            );
            return dfd.promise;
          };
        };

        ctrl.loadfileWFP = function (params) {
          return function () {
            var dfd = $q.defer();
            task_details_service.loadFileInfoWFP(params.id, params.name).then(
              function (res) {
                dfd.resolve({
                  display: res.data.display,
                  embedUrl: res.data.url,
                  guid: res.data.guid,
                });
                res = undefined;
                dfd = undefined;
              },
              function (err) {}
            );
            return dfd.promise;
          };
        };

        /**show Information Details*/

        function loadDetails_service() {
          var dfd = $q.defer();
          var draftKeyList = Object.keys(localStorage).map((str) =>
            str.substring(6)
          );
          var draftKey = `draft_${draftKeyList.find(
            (id) => id === ctrl.thisId
          )}`;
          ctrl.commentText = $window.localStorage.getItem(draftKey) || "";
          ctrl.startWatchComment = true;
          ctrl.startWatchProof = true;
          let currentDepartment = "";
          ctrl.label = [];
          if ($rootScope.detailsInfo.params) {
            currentDepartment = $rootScope.detailsInfo.params.currentDepartment;
          }
          task_details_service
            .loadDetails(ctrl.thisId, ctrl.thisCode, currentDepartment)
            .then(
              function (res) {
                ctrl.Item = res.data;
                ctrl.task_type = task_details_service.taskTypeTransform(
                  ctrl.Item.task_type
                ).value;
                ctrl.workflow_play = [res.data.workflowPlay] || [];
                ctrl.notify_detail = res.data.notify_detail || null;
                ctrl.cycle = ctrl.Item.repetitive
                  ? ctrl.Item.repetitive.cycle.charAt(0).toUpperCase() +
                    ctrl.Item.repetitive.cycle.slice(1)
                  : "";

                if (ctrl.Item.label && ctrl.Item.label.length > 0) {
                  loadLabel_details();
                }

                switch (ctrl.Item.status) {
                  case "NotStartedYet":
                    ctrl.status = "start";
                    break;
                  case "Processing":
                    ctrl.status = "completed";
                    break;
                  case "Cancelled":
                    ctrl.status = "cancelled";
                    break;
                  default:
                    ctrl.status = "see";
                }
                $timeout(function () {
                  ctrl._notyetInit = false;
                }, 1000);
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
              },
              function (err) {
                $rootScope.urlPage = urlNotFoundPage;
                dfd.reject(err);
                err = undefined;
              }
            );
          return dfd.promise;
        }

        ctrl.loadDetails = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadDetails",
            loadDetails_service
          );
        };

        function loadLabel_details() {
          var dfd = $q.defer();

          task_details_service.loadLabel_details(ctrl.Item.label).then(
            function (res) {
              ctrl.label = res.data;
              dfd.resolve(true);
            },
            function (err) {
              dfd.reject(err);
            }
          );
          return dfd.promise;
        }

        //COMMENT
        ctrl.blurPushComment = function () {
          ctrl.showPushComment = false;
        };

        ctrl.addTempTextComment = function () {
          var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
          var inputStr = $("#" + idEditor_comment).summernote("code");
          if (inputStr.length == "") {
            $window.localStorage.removeItem(draftKey);
          } else {
            $window.localStorage.setItem(draftKey, inputStr);
          }
        };

        ctrl.focusComment = function () {
          // if (Object.keys(ctrl.userList).length === 0) {
          //     ctrl.loadMembers().then(function (res) {
          //         ctrl.userList = res;
          //     }).catch(function (err) {
          //         console.log(err);
          //     });
          // }
          var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
          ctrl.showPushComment = true;

          $("#" + idEditor_comment).summernote("height", "350px");
          $("#" + idEditor_comment).summernote(
            "code",
            $window.localStorage.getItem(draftKey) || ""
          );
          $("#" + idEditor_comment).summernote("foreColor", "#151515");

          var isTypingAt = false;
          var isSearching = false;
          var userList = $("<div/>", {
            id: "userList",
            css: {
              position: "absolute",
              "z-index": "9999",
              "max-height": "200px",
              "overflow-y": "auto",
            },
          });
          $(document).keydown(function (e) {
            if (e.key == "Escape") {
              // If the pressed key is ESC
              userList.empty(); // Clear the user list
              isSearching = false;
              $scope.$apply(function () {
                ctrl.showPushComment = false;
              });
            }
          });

          var currentSearch = "";
          $("#" + idEditor_comment).after(userList);
          var currentAtPosition = -1;
          var cursorPosition = 0;
          // var currentSelectedIndex = -1;
          $("#" + idEditor_comment).on("summernote.keyup", function (we, e) {
            debounce(ctrl.addTempTextComment);
            var content = $("#" + idEditor_comment).summernote("code");
            previousAtPosition = currentAtPosition;
            currentAtPosition = content.lastIndexOf("@");
            if (["Tab"].includes(e.key)) {
              currentSearch = "";
              isTypingAt = false;
              isSearching = false;
              userList.empty();
            }
            if (
              ![
                "Shift",
                "Control",
                "Alt",
                "Enter",
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Meta",
                "CapsLock",
              ].includes(e.key)
            ) {
              var text = $("#" + idEditor_comment).summernote("code");

              var atIndex = text.indexOf("@");
              var eKeyIndex = text.lastIndexOf(e.key);

              if (atIndex !== -1 && eKeyIndex !== -1) {
                text = text.substring(atIndex, eKeyIndex + 1);
                cursorPosition = atIndex;
              }

              if (e.key === "@" && e.keyCode !== 8) {
                currentSearch = "";
                isTypingAt = true;
                isSearching = true;
              } else if (isTypingAt && e.key !== " " && e.keyCode !== 8) {
                isSearching = true;
              } else if (e.key === " ") {
                userList.empty();
                isTypingAt = false;
                isSearching = false;
              } else if (e.keyCode === 8 && text.indexOf("@") === -1) {
                userList.empty();
                isTypingAt = false;
                isSearching = false;
              } else {
                isTypingAt = false;
              }
              if (e.key === "Backspace") {
                if (currentSearch.length > 0) {
                  currentSearch = currentSearch.slice(0, -1);
                }
                if (currentSearch.length === 0) {
                  userList.empty();
                  isTypingAt = false;
                } else {
                  isTypingAt = false;
                }
              } else {
                currentSearch += e.key;
                isTypingAt = false;
              }

              if (isTypingAt || isSearching) {
                userList.empty();
                var filteredMembers;

                const members = ctrl.userList;

                var search = currentSearch.replace("@", "").trim();

                if (search === "") {
                  filteredMembers = members;
                } else {
                  filteredMembers = members.filter(function (member) {
                    return (
                      member &&
                      member.title_search
                        .replace(/\s+/g, "")
                        .toUpperCase()
                        .includes(search.trim().toUpperCase())
                    );
                  });
                }

                var range = $("#" + idEditor_comment).summernote("createRange");
                var rangePosition = range.getClientRects()[0];

                userList.css({
                  position: "absolute",
                  left: rangePosition.left - 250 + "px",
                  top: rangePosition.top + rangePosition.height - 70 + "px",
                });
                for (var i = 0; i < filteredMembers.length; i++) {
                  var userDiv = $("<div/>", {
                    "data-username": filteredMembers[i].userName,
                    css: {
                      width: "300px",
                      padding: "10px",
                      cursor: "pointer",
                      display: "flex",
                      "align-items": "center",
                      "background-color": "#ffffff",
                      border: "1px solid #e0e0e0",
                    },
                    hover: function () {
                      $(this).css("background-color", "#e0e0e0");
                    },
                    mouseleave: function () {
                      $(this).css("background-color", "#ffffff");
                    },
                    click: function () {
                      var id = $(this).find("span").attr("id");
                      isSearching = false;
                      isTypingAt = false;
                      var selectedText = $(this).text();
                      var highlightedText =
                        '<span id = "' +
                        id +
                        '" contenteditable="false" style="background-color: #6452c6;color: #f3f3f5;border-radius: 5px;padding: 5px;display: inline-block;">' +
                        selectedText +
                        "</span>";
                      handleUserListSelection(
                        highlightedText,
                        currentSearch,
                        cursorPosition,
                        currentAtPosition
                      );

                      currentSearch = "";
                      userList.empty();
                      var id = $(this).find("span").attr("id");
                      var content = $("#" + idEditor_comment).summernote(
                        "code"
                      );
                      var $content = $("<div>").html(content);
                      var spanIds = $content
                        .find("span")
                        .map(function () {
                          return this.id;
                        })
                        .get();
                      if (!spanIds.includes(id)) {
                      }
                    },
                  });
                  var url = "";

                  if (filteredMembers[i].hasOwnProperty("avatar")) {
                    url = filteredMembers[i].avatar.url;
                  }
                  var url = filteredMembers[i].avatar
                    ? filteredMembers[i].avatar.url
                    : "default_url";
                  var userLogo = $("<img/>", {
                    src: url,
                    css: {
                      width: "30px",
                      height: "30px",
                      "border-radius": "50%",
                      "margin-right": "10px",
                      border: "1px solid #e0e0e0",
                    },
                  });

                  var userName = $("<span/>", {
                    text: filteredMembers[i].title,
                    id: filteredMembers[i].username,
                  });
                  userDiv.append(userLogo, userName);
                  userList.append(userDiv);
                }
                if (filteredMembers.length === 0) {
                  userList.empty();
                }
                if (currentSearch.length > 20) {
                  userList.empty();
                  isSearching = false;
                  isTypingAt = false;
                }
              }
            }
          });
        };

        ctrl.removeFiles = function (name) {
          ctrl.files = ctrl.files.filter((e) => e.name !== name);
        };

        function comment_service() {
          var dfd = $q.defer();
          var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
          if ($("#" + idEditor_comment).summernote("code")) {
            task_details_service
              .comment(
                ctrl.thisId,
                ctrl.code,
                $("#" + idEditor_comment).summernote("code"),
                ctrl.files
              )
              .then(
                function (res) {
                  $window.localStorage.removeItem(draftKey);
                  $window.localStorage.setItem(draftKey, "");
                  $("#" + idEditor_comment).summernote("code", "");
                  ctrl.showPushComment = false;
                  ctrl.files = [];
                  ctrl.loadDetails();
                  dfd.resolve(true);
                  res = undefined;
                  dfd = undefined;
                },
                function (err) {
                  dfd.reject(err);
                  err = undefined;
                }
              );
          }
          return dfd.promise;
        }

        ctrl.comment = function () {
          return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "comment",
            comment_service
          );
        };

        ctrl.getCommentCountWithoutCancel = function (comments) {
          var nonCancelComments = (comments || []).filter(function (comment) {
            return comment.type !== "Cancelled";
          });

          return nonCancelComments.length;
        };

        $scope.$watch("itemId", (val) => {
          if (val) {
            ctrl.thisId = val;
            ctrl.loadDetails();
          }
        });
      },
    ],
  };
});

myApp.compileProvider.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files);
          });
        });
      },
    };
  },
]);


myApp.compileProvider.directive("wfpInsertModalDu", function () {
  return {
      restrict: "E",
      templateUrl:
          FrontendDomain +
          "/modules/office/task/details/views/insert_tranfer_ticket_modal.html",
      scope: {
          insertSuccessFunc: '&',
          parentItem: "<",
          parentType: "<",
          transferTicketItem: "<",
      },
      controller: [
          "task_details_service",
          "workflow_play_service",
          "$q",
          "$rootScope",
          "$scope",
          function (task_details_service, workflow_play_service, $q, $rootScope, $scope) {
              /**declare variable */
              const _statusValueSet = [
                  { name: "WFP", action: "insert" },
                  { name: "WFP", action: "loadUserAndDepartment" },
                  { name: "WFP", action: "loadCustomTemplatePreview" },
                  { name: "WFP", action: "parseTemplate" },
                  { name: "WFP", action: "searchArchivedDocument" },
              ];

              var ctrl = this;
              $scope.ctrl = ctrl;
              $scope.forms = {};

              const TRANSFER_TICKET_TYPE = {
                ASSIGN: 'Assign',
                RESPONSE: 'Response'
              }
              
              {
                  ctrl._ctrlName = "wfp_insert_modal_controller";
                  ctrl._insert_value = {};
                  ctrl.WF = [];
                  ctrl.WF2 = [];
                  ctrl.listUsers = [];
                  ctrl.listUsersDefault = [];
                  ctrl.listAllUser = [];
                  ctrl.departmentDetails = {};
                  ctrl._notyetInit = true;
                  ctrl.offset = 0;
                  ctrl.header = 'AddTransferTicket'                

                  ctrl.DocumentType_Config = {
                      master_key: "document_type",
                      load_details_column: "value",
                  };

                  $rootScope.statusValue.generateSet(
                      ctrl._ctrlName,
                      _statusValueSet
                  );
              }

              
              init();

              function init() {
                  var dfdAr = [];
                  dfdAr.push(init_service());
                  dfdAr.push(load_employee_detail());
                  $q.all(dfdAr).then(
                      function () {
                          ctrl._notyetInit = false;
                      }, function (err) {
                          console.log(err);
                          err = undefined;
                      }
                  );
              }

              function init_service() {
                  var dfd = $q.defer();
                  workflow_play_service.init().then(function (res) {
                      ctrl.WF = res.data.wf;
                      dfd.resolve(true);
                  }, function () {
                      dfd.reject(false);
                      err = undefined;
                  });
                  return dfd.promise;
              }

              function load_employee_detail() {
                  var dfd = $q.defer();
                  workflow_play_service.loadEmployeeDetail($rootScope.logininfo.data.employee).then(function (res) {
                      ctrl.sign = res.data.signature.link;
                      ctrl.quotationMark = res.data.quotationMark.link;
                      dfd.resolve(true);
                  }, function () {
                      dfd.reject(false);
                      err = undefined;
                  });
                  return dfd.promise;
              }

              ctrl.prepareInsert = function () {
                  ctrl.loadUserAndDepartment();

                  $rootScope.statusValue.generate(
                      ctrl._ctrlName,
                      "WFP",
                      "insert"
                );
                const transfer_ticket = {
                  type: TRANSFER_TICKET_TYPE.ASSIGN,
                }
                const parent = {
                  id: $scope.parentItem?.id,
                  code: $scope.parentItem?.code,
                  department: $scope.parentItem?.department?.id,
                  type: 'Assign',
                  object: 'task'
                }
                  ctrl._insert_value = {
                      file: undefined,
                      fileError: undefined,
                      relatedfile: [],
                      title: "",
                      flow: "",
                      document_type: "",
                      to_department: "",
                      templateTags: [],
                      appendixFile: [],
                      archived_documents: [],
                      allow_choose_destination: '',
                    transfer_ticket,
                    parent,
                    parents: $scope?.parentItem?.parents || []
                  };
              };
            
            ctrl.prepareInsertResponse = function () {
              ctrl.header= 'AddTransferTicketResponse'
                ctrl.loadUserAndDepartment();

                $rootScope.statusValue.generate(
                    ctrl._ctrlName,
                    "WFP",
                    "insert"
                );
              
              const transfer_ticket = {
                type: TRANSFER_TICKET_TYPE.RESPONSE,
              }

              const parent = {
                id: $scope.parentItem?.id,
                code: $scope.parentItem?.code,
                department: $scope.parentItem?.department?.id,
                type: 'Response'
              }

              ctrl.reponseTask = {
                id: ctrl.response_task.id,
                code: ctrl.response_task.code,
                department: ctrl.response_task.department,
                type: 'Response'
              }
              
              const parents = [parent, ctrl.reponseTask]

                ctrl._insert_value = {
                    file: undefined,
                    fileError: undefined,
                    relatedfile: [],
                    title: "Phản hồi phiếu chuyển " + $scope.transferTicketItem.title,
                    flow: "",
                    document_type: "",
                    templateTags: [],
                    appendixFile: [],
                    archived_documents: [],
                    allow_choose_destination: '',
                    transfer_ticket,
                  to_department: ctrl.reponseTask?.department,
                  parent,
                  parents
                };
            };

              /**insert */
              ctrl.loadWorkflow_details = function (params) {
                  let dfd = $q.defer();
                  workflow_play_service.loadWorkflow_details(params.id).then(function (res) {
                      dfd.resolve(res.data);
                      res = undefined;
                  }, function (err) {
                      dfd.reject(err);
                      err = undefined;
                  });
                  return dfd.promise;
              }

              ctrl.chooseWFT_insert = function (val) {
                  ctrl._insert_value.document_type = val.value;
                  ctrl.WF2 = [];
                  for (var i in ctrl.WF) {
                      if(val.value == 'archive') {
                          ctrl.WF2.push(ctrl.WF[i]);
                      }
                       else if (val.value === ctrl.WF[i].key){
                          ctrl.WF2.push(ctrl.WF[i]);
                      }
                  }
                  ctrl.listUsers = [];
              };
              ctrl.chooseWF_insert = function (val) {
                  const allowChooseDestination = val.allow_choose_destination === true ? 'true' : 'false';

                  ctrl._insert_value.is_personal = val.is_personal;
                  ctrl._insert_value.is_department = val.is_department;

                  ctrl._insert_value.allow_choose_destination = allowChooseDestination;
                  ctrl._insert_value.userAndDepartmentDestination = {
                      user: [],
                      department: []
                  };

                  val.file_type = val.file_type || (val.customTemplate ? "custom_template" : "file_upload");
                  ctrl.listUsers = [];
                  ctrl._insert_value.key = val._id;
                  ctrl._insert_value.wf = val;
                  ctrl._insert_value.templateTags = angular.copy(
                      val.templateTags.map(tag => {
                          if (tag.pickKey === 'user') {
                              tag.rawValue = $rootScope.logininfo.data.username;
                              tag.value = $rootScope.logininfo.data.username;
                          } else if (tag.pickKey === 'department') {
                              tag.rawValue = ctrl.departmentDetails.id;
                              tag.value = ctrl.departmentDetails.id;
                          }
                          return tag;
                      })
                  );

                  // handle flow

                  ctrl.listUsers = ctrl.listUsersDefault.filter((u) =>
                      val.flow.some((f) =>
                          f.items.some(
                              (i) =>
                                  u.competence &&
                                  i.competence === u.competence.value
                          )
                      )
                  );
                  ctrl.showLoadMore =
                      ctrl.listUsers.length > ctrl.showCount ? true : false;

                  let tempFlow = val.flow;
                  // handle flow
                  for (var i in tempFlow) { 
                      for (var j in tempFlow[i].items) {
                          if (tempFlow[i].items[j].methods === 'flexible' ) {
                              let processType = tempFlow[i].items[j].processType;
                              let processLeader = ctrl.departmentDetails[processType];
                              let employeeLeader = ctrl.listAllUser.find(user => user.username === processLeader);
                              let competenceLeader = employeeLeader ? (employeeLeader.competence.value || employeeLeader.competence) : null;
                              let userInfor = ctrl.listAllUser.find(user => user.username === processLeader);
                              let departmentLeader = userInfor ? userInfor.departmentId : null;
                              let newItem = {
                                  ...tempFlow[i].items[j],
                                  department: departmentLeader,
                                  competence: competenceLeader,
                              }
                              tempFlow[i].items[j] = newItem;

                          } else {
                              tempFlow[i].items[j] = val.flow[i].items[j];
                          }
                      }
                  }
                  val.flow = tempFlow;
                  
              };
                  

              ctrl.pickUserAndDepartment_insert = function (val) {
                  ctrl._insert_value.userAndDepartment = val;
              }

              ctrl.loadFileTemplate = function (params) {
                  return function () {
                      var dfd = $q.defer();
                      workflow_play_service
                          .loadFileTemplateInfo(params.name)
                          .then(
                              function (res) {
                                $rootScope.FileService.bind({
                                  display: params.display,
                                  embedUrl: res.data.url,
                                  serviceName: "workflow",
                                  attachmentId: "new",
                              });

                              dfd.resolve(true);
                              },
                              function (err) { }
                          );
                      return dfd.promise;
                  };
              };

              function parseTemplate_service(file) {
                  return function () {
                      var dfd = $q.defer();
                      workflow_play_service.parseCustomTemplate(file).then(function (res) {
                          const tagNames = ((res.data || {}).tags || []).map(tag => tag.name);
                          const isValidTags = ctrl._insert_value.wf.templateTags.every(tag => tagNames.includes(tag.name));
                          ctrl._insert_value.fileError = isValidTags ? '' : 'File is missing required tags';
                          dfd.resolve(true);
                          dfd = undefined;
                      }, function (err) {
                          ctrl._insert_value.fileError = 'Invalid file format';
                          dfd.reject(err);
                          dfd = undefined;
                      });
                      return dfd.promise;
                  }
              };

              ctrl.handleSelectFile = function (file) {
                  return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "parseTemplate", parseTemplate_service(file));
              };

              ctrl.removeFile_insert = function () {
                  ctrl._insert_value.file = undefined;
                  ctrl._insert_value.fileError = undefined;
              };

              ctrl.removeRelatedFile_insert = function (item) {
                  var temp = [];
                  for (var i in ctrl._insert_value.relatedfile) {
                      if (
                          ctrl._insert_value.relatedfile[i].name != item.name
                      ) {
                          temp.push(ctrl._insert_value.relatedfile[i]);
                      }
                  }
                  ctrl._insert_value.relatedfile = angular.copy(temp);
              };

              ctrl.removeAppendixFile_insert = function (item) {
                  var temp = [];
                  for (var i in ctrl._insert_value.appendixFile) {
                      if (
                          ctrl._insert_value.appendixFile[i].name != item.name
                      ) {
                          temp.push(ctrl._insert_value.appendixFile[i]);
                      }
                  }
                  ctrl._insert_value.appendixFile = angular.copy(temp);
              };

              ctrl.chooseDateTag_insert = function ($index, val) {
                  ctrl._insert_value.templateTags[$index].rawValue =
                      val.getTime();
                  ctrl._insert_value.templateTags[$index].value = dayjs(
                      val.getTime()
                  ).format(ctrl._insert_value.templateTags[$index].format);
              };

              ctrl.chooseDropdownTag_insert = function ($index, val) {
                  ctrl._insert_value.templateTags[$index].rawValue =
                      val.value;
                  ctrl._insert_value.templateTags[$index].value =
                      val.title[$rootScope.Language.current];
              };

              ctrl.chooseArchivedDocumentTag_insert = function ($index, params) {
                  ctrl._insert_value.templateTags[$index].rawValue =
                      params.value;
                  ctrl._insert_value.templateTags[$index].value = params._id;
                  ctrl._insert_value.archived_documents = params.outgoing_documents
              };

              ctrl.chooseDepartment_insert = function (val) {
                ctrl._insert_value.to_department = val.id;
                ctrl._insert_value.currentDepartment_orig = val;
                ctrl._insert_value.currentDepartment = val.id;
                $scope.$invalidDepartment = false;
            };
            
              ctrl.isCustomTagsValid = function () {
                  const tags = ctrl._insert_value.templateTags;

                  for (let i = 0; i < tags.length; i++) {
                      const formField =
                          $scope.forms.insertForm[
                          "templateTags_" + tags[i].name
                          ];
                      if (
                          (tags[i].type === "text" ||
                              tags[i].type === "number") &&
                          (!formField || !formField.$valid)
                      ) {
                          return false;
                      }
                      if (
                          (tags[i].type === "date" ||
                              tags[i].type === "dropdown") &&
                          !tags[i].value
                      ) {
                          return false;
                      }
                  }

                  return true;
              };

              function getTagsValue() {
                  const tagsValue = {};

                  ctrl._insert_value.templateTags.forEach((tag) => {
                      tagsValue[tag.name] = tag.value;
                  });

                  return tagsValue;
              }

              function loadCustomTemplatePreview_service() {
                  var dfd = $q.defer();
                  const workflowId = ctrl._insert_value.wf._id;
                  const tagsValue = getTagsValue();

                  $(".modal-backdrop").remove();
                  $("body").removeClass("modal-open");
                  $rootScope.FileService.bind({
                      display: "",
                      embedUrl: "/component/loading.html",
                  });
                  $rootScope.FileService.show();

                  workflow_play_service
                      .loadCustomTemplatePreview(workflowId, tagsValue)
                      .then(
                          function (res) {
                              $rootScope.FileService.bind({
                                  display: res.data.display,
                                  embedUrl: res.data.url,
                                  serviceName: "workflow",
                                  attachmentId: "new",
                              });

                              dfd.resolve(true);
                          },
                          function (err) {
                              dfd.reject(err);
                          }
                      );

                  return dfd.promise;
              }

              ctrl.loadCustomTemplatePreview = function () {
                  return $rootScope.statusValue.execute(
                      ctrl._ctrlName,
                      "WFP",
                      "loadCustomTemplatePreview",
                      loadCustomTemplatePreview_service
                  );
              };

              function insert_service() {
                  var dfd = $q.defer();
                  const files = ctrl._insert_value.file
                      ? [ctrl._insert_value.file]
                      : [];
                  const flowInfo = {
                      _id: ctrl._insert_value.wf._id,
                      title: ctrl._insert_value.wf.title,
                  };
                  const tagsValue = getTagsValue();
                switch ($scope.parentType) {
                  case "HeadTask":
                    const flow = ctrl._insert_value?.wf?.flow;
                    if (flow) {
                      if (flow[0]) {
                        flow[0].items[0].department = $rootScope.logininfo.data.department;
                      }
                      if (flow[1]) {
                        flow[1].items[0].department = ctrl._insert_value.to_department;
                      }
                      ctrl._insert_value.wf.flow = flow;
                    }
                    break;
                }

                console.log('do day 1111')
                  workflow_play_service
                      .insert_transfer_ticket(
                          files,
                          ctrl._insert_value.relatedfile,
                          ctrl._insert_value.appendixFile,
                          ctrl._insert_value.title,
                          flowInfo,
                          ctrl._insert_value.wf.flow,
                          ctrl._insert_value.document_type,
                          tagsValue,
                          ctrl._insert_value.archived_documents,
                          ctrl._insert_value.parents,
                          ctrl._insert_value.parent,
                          ctrl._insert_value.userAndDepartmentDestination,
                          ctrl._insert_value.is_personal || false,  
                          ctrl._insert_value.is_department || false,
                          ctrl._insert_value.transfer_ticket
                      )
                      .then(
                          function (res) {
                              $("#modal_WFP_Insert").modal("hide");
                              dfd.resolve(true);
                              dfd.refreshData()
                              dfd = undefined;

                              $scope.insertSuccessFunc && $scope.insertSuccessFunc({ params: res.data });
                          },
                          function (err) {
                              dfd.reject(err);
                              err = undefined;
                          }
                      );
                  return dfd.promise;
              }

              ctrl.insert = function () {
                  return $rootScope.statusValue.execute(
                      ctrl._ctrlName,
                      "WFP",
                      "insert",
                      insert_service
                  );
              };

              ctrl.handleClickInsert = function () {
                  // check if this file need a signature from creator
                  const needCreatorSign =
                      ctrl._insert_value.templateTags.some(
                          (tag) =>
                              tag.type === "creator_signature" ||
                              tag.type === "creator_quotation_mark"
                      );
                  if (needCreatorSign) {
                      ctrl.showModalSignAFile = true;
                  } else {
                      ctrl.insert();
                  }
              };

              ctrl.handleHideModalSignAFile = function () {
                  ctrl.showModalSignAFile = false;
              };

              ctrl.handleClickSign_insert = function () {
                  ctrl.insert();
              };

              ctrl.loadUserAndDepartment = function () {
                  return $rootScope.statusValue.execute(
                      ctrl._ctrlName,
                      "WFP",
                      "loadUserAndDepartment",
                      load_users_and_department_service
                  );
              };

              function load_users_and_department_service() {
                  var dfd = $q.defer();
                  let dfdArr = [];

                  if (ctrl.listUsersDefault.length === 0) {
                      let request = {
                          department: $rootScope.logininfo.data.department,
                          top: 0,
                          offset: ctrl.offset,
                          sort: { title: 1 },
                      };
                      dfdArr.push(
                          workflow_play_service.loadUsersByDepartment(request)
                      );
                  }

                  if (Object.keys(ctrl.departmentDetails).length === 0) {
                      dfdArr.push(
                          workflow_play_service.loadDepartmentDetails(
                              $rootScope.logininfo.data.department
                          )
                      );
                  }

                  if (ctrl.listAllUser.length === 0) {
                      dfdArr.push(
                          workflow_play_service.loadAllUser()
                      );
                  }

                  $q.all(dfdArr).then(
                      function (data) {
                          ctrl.listUsersDefault = data[0].data;
                          ctrl.departmentDetails = data[1].data;
                          ctrl.listAllUser = data[2].data;
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

              ctrl.searchArchivedDocument = function (params) {
                  var dfd = $q.defer();
                  if (params) {
                      workflow_play_service.loadArchivedDocumentByCode(params).then(
                          function (data) {
                              dfd.resolve(data);
                              dfd = undefined;
                          },
                          function (err) {
                              dfd.resolve([]);
                              err = undefined;
                          }
                      );
                  } else {
                      dfd.resolve([]);
                  }
                  return dfd.promise;
              }

              $(document).on('show.bs.modal', "#modal_Insert_Tranfer_Ticket", function (e) {
                  if (e.target.id === 'modal_Insert_Tranfer_Ticket') {
                    $scope.$apply(function () {
                      if ($scope.transferTicketItem) {
                        ctrl.response_task = $scope.transferTicketItem.parents.find(i => i.code === $scope.transferTicketItem?.parent?.code && i.type);
                        ctrl.prepareInsertResponse();
                      }
                      else {
                        ctrl.prepareInsert()
                        
                      }
                      });
                  }
              });
          },
      ],
  };
});
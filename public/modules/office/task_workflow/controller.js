myApp.registerCtrl('task_workflow_controller', ['task_workflow_service', '$rootScope', '$q', function (task_workflow_service, $rootScope, $q) {
    /**declare variable */
    const _statusValueSet = [
        { name: "TaskWorkflow", action: "init" },
        { name: "TaskWorkflow", action: "load" },
        { name: "TaskWorkflow", action: "count" },
        { name: "TaskWorkflow", action: "insert" },
        { name: "TaskWorkflow", action: "update" },
        { name: "TaskWorkflow", action: "delete" }
    ];
    var ctrl = this;
    /** init variable */
    defaultFlow = [
        {
            id: "1",
            name: 'New',
            type: "Rectangle",
            x: 250,
            y: 250,
            width: 100,
            height: 46,
            color: "#ede9e9",
            toElement: ["2", "3", "4"]
        },
        {
            id: "2",
            name: 'In Progress',
            type: "Rectangle",
            x: 400,
            y: 450,
            width: 100,
            height: 46,
            color: "#007fff"
        },
        {
            id: "3",
            name: 'QA In Process',
            type: "Rectangle",
            x: 550,
            y: 300,
            width: 100,
            height: 46,
            color: "#4cb399"
        },
        {
            id: "4",
            name: 'Ready For UAT',
            type: "Rectangle",
            x: 100,
            y: 50,
            width: 100,
            height: 46,
            color: "#2e93a1"
        }
    ];
    {
        ctrl.tab = "created";
        ctrl._ctrlName = "task_workflow_controller";
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/task_workflow/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task_workflow/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task_workflow/views/update_modal.html";
        ctrl._notyetInit = true;
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterStatus = "";
        

        ctrl.drawObjectForInsert = {};
        ctrl.drawObjectForUpdate = {};
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.switchTab = function (val) {
        $location.url("/task-workflow?tab=" + val);
        ctrl.tab = val;
        setUrlContent();
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

        if (ctrl._filterStatus) {
            obj.status = angular.copy(ctrl._filterStatus);
        }

        return obj;
    }

    ctrl.chooseStatus = function (val) {
        ctrl._filterStatus = val.value;
        ctrl.refreshData();
    }

    function load_service() {
        var dfd = $q.defer();
        ctrl.task_workflows = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        task_workflow_service.load_task_workflow(_filter.search, _filter.status, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.task_workflows = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TaskWorkflow", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        task_workflow_service.count_task_workflow(_filter.search, _filter.status).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TaskWorkflow", "count", count_service);
    }

    init();
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


    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }



    ctrl.prepareInsert = function () {
        let myDirective = angular.element(document.querySelector('#draw_task_workflow_insert'));
        ctrl.drawObjectForInsert = myDirective.scope();
        ctrl.drawObjectForInsert.startDraw(defaultFlow);
        $rootScope.statusValue.generate(ctrl._ctrlName, "TaskWorkflow", "insert");
        ctrl._insert_value = {
            title: "",
            department: [],
            project: [],
            status: "Draft",
            tab: "general"
        };
    }

    function insert_service() {
        let dfd = $q.defer();
        task_workflow_service.insert(
            ctrl._insert_value.title,
            ctrl._insert_value.status,
            ctrl._insert_value.project,
            ctrl._insert_value.department,
            ctrl.drawObjectForInsert.exportFlow()
        ).then(function () {
            $("#modal_Task_Workflow_Insert").modal("hide");
            ctrl.drawObjectForInsert.stopDraw();
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TaskWorkflow", "insert", insert_service);
    }


    //UPDATE TASK WORKFLOW 

    ctrl.prepareUpdate = function (item) {
        let myDirective = angular.element(document.querySelector('#draw_task_workflow_update'));
        ctrl.drawObjectForUpdate = myDirective.scope();
        ctrl.drawObjectForUpdate.startDraw(item.flow);
        $rootScope.statusValue.generate(ctrl._ctrlName, "TaskWorkflow", "update");
        ctrl._update_value = {
            _id: item._id,
            title: item.title,
            department: item.department,
            project: item.project,
            status: item.status,
            tab: "general"
        };
    }

    function update_service() {
        let dfd = $q.defer();
        task_workflow_service.update(
            ctrl._update_value._id,
            ctrl._update_value.title,
            ctrl._update_value.status,
            ctrl._update_value.project,
            ctrl._update_value.department,
            ctrl.drawObjectForUpdate.exportFlow()
        ).then(function () {
            $("#modal_Task_Workflow_Update").modal("hide");
            ctrl.drawObjectForUpdate.stopDraw();
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TaskWorkflow", "update", update_service);
    }

    //DELETE TASK WORKFLOW

    ctrl.prepareDelete = function (item) {
        ctrl._delete_value = angular.copy(item);
        $rootScope.statusValue.generate(ctrl._ctrlName, "TaskWorkflow", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        task_workflow_service.delete(
            ctrl._delete_value._id).then(function () {
                ctrl.refreshData();
                $rootScope.statusValue.generate(ctrl._ctrlName, "TaskWorkflow", "delete");
                $("#modal_Task_Workflow_Delete").modal('hide');
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TaskWorkflow", "delete", delete_service);
    }



}]);
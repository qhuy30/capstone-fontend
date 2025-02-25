myApp.registerCtrl('event_controller', ['$rootScope', 'training_point_service','$q', function ( $rootScope, training_point_service,$q) {

    const _statusValueSet = [
        { name: "TrainingPoint", action: "init" },
        { name: "TrainingPoint", action: "load_events" },
        { name: "TrainingPoint", action: "count_event" },
        { name: "TrainingPoint", action: "insert" },
        { name: "TrainingPoint", action: "update" },
        { name: "TrainingPoint", action: "delete" }
    ];
    var ctrl = this;
    const idEditor_insert = "Training_Point_Insert";
    const idEditor_update = "Training_Point_Update";

    /** init variable */
    ctrl._ctrlName = "event_controller";
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    ctrl._delete_value = {};
    /** init variable */
    {
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;

        ctrl._searchByKeyToFilterData = "";
        ctrl.events = [];
        ctrl._filterStatus="";

        ctrl._urlInsertModal = FrontendDomain + "/modules/education/training_point/views/insert_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/education/training_point/views/delete_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/education/training_point/views/update_modal.html";
        ctrl._notyetInit = true;
    }

    ctrl.Status =[
        {
            id: "Store",
            title:"Store"
        },
        {
            id:"Active",
            title:"Active"
        }
    ];

    function setValueFilter() {
        const year = new Date().getFullYear();
        ctrl._filterStartDate = new Date(year, 0, 1, 0, 0, 1);
        const lastMonth = 11;
        const date = new Date(year, lastMonth);
        const numDays = date.getDate();
        ctrl._filterEndDate = new Date(year, lastMonth, numDays, 23, 59, 59);
    }

    function resetPagination() {
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function load_event_service() {
        var dfd = $q.defer();
        training_point_service.load_events(
            ctrl._searchByKeyToFilterData,
            ctrl._filterStatus,
            ctrl._filterStartDate.getTime(),
            ctrl._filterEndDate.getTime(),
            ctrl.numOfItemPerPage,
            ctrl.offset,
            { _id: -1 }).then(function (res) {
                ctrl.events = res.data;
                dfd.resolve(true);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;

    }

    ctrl.load_events = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "load_events", load_event_service);
    }

    function count_event_service() {
        var dfd = $q.defer();
        training_point_service.count_event(
            ctrl._searchByKeyToFilterData,
            ctrl._filterStatus,
            ctrl._filterStartDate.getTime().toString(),
            ctrl._filterEndDate.getTime().toString()).then(function (res) {
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

    ctrl.count_event = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "count_event", count_event_service);
    }

    function init() {
        setValueFilter();
        resetPagination();
        var dfdAr = [];
        dfdAr.push(ctrl.load_events());
        dfdAr.push(ctrl.count_event());
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

    ctrl.refreshData = function(){
        ctrl.currentPage = 1;


        ctrl.load_events();
        ctrl.count_event();
    }

    /**Insert  */

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "TrainingPoint", "insert");
        $("#" + idEditor_insert).summernote({
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    training_point_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor_insert).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor_insert).summernote('code', '');

        let now = new Date();
        now.setSeconds(0, 0);

        ctrl._insert_value = {
            title: "",
            quantity: 0,
            start_registered_date: now,
            end_registered_date: now,
            start_date: now,
            end_date: now,
            point: 0
        };

    }

    function insert_service() {
        let dfd = $q.defer();
        training_point_service.insert(
            ctrl._insert_value.title,
            $("#" + idEditor_insert).summernote('code'),
            ctrl._insert_value.quantity,
            ctrl._insert_value.start_registered_date.getTime(),
            ctrl._insert_value.end_registered_date.getTime(),
            ctrl._insert_value.start_date.getTime(),
            ctrl._insert_value.end_date.getTime(),
            ctrl._insert_value.point
        ).then(function () {
            $("#modal_Training_Point_Insert").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "insert", insert_service);
    }

    /**Update */

    ctrl.prepareUpdate = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "TrainingPoint", "update");
        console.log("item",item);
        $("#" + idEditor_update).summernote({
            // placeholder: $filter("l")("InputDescriptionHere"),
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    training_point_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor_update).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor_update).summernote('code', item.content);

        let startRegisteredDate = new Date(parseInt(item.start_registered_date));
        startRegisteredDate.setSeconds(0,0);
        let endRegisteredDate = new Date(parseInt(item.end_registered_date));
        endRegisteredDate.setSeconds(0,0);
        let startDate = new Date(parseInt(item.start_date));
        startDate.setSeconds(0,0);
        let endDate = new Date(parseInt(item.end_date));
        endDate.setSeconds(0,0);

        ctrl._update_value = {
            id: item._id,
            title: item.title,
            quantity : item.quantity,
            start_registered_date: startRegisteredDate,
            end_registered_date: endRegisteredDate,
            start_date: startDate,
            end_date: endDate,
            point: item.point,
            status: item.status
        };

    }

    function update_service() {
        let dfd = $q.defer();
        training_point_service.update(
            ctrl._update_value.id,
            ctrl._update_value.title,
            $("#" + idEditor_update).summernote('code'),
            ctrl._update_value.quantity,
            ctrl._update_value.start_registered_date.getTime(),
            ctrl._update_value.end_registered_date.getTime(),
            ctrl._update_value.start_date.getTime(),
            ctrl._update_value.end_date.getTime(),
            ctrl._update_value.point,
            ctrl._update_value.status
        ).then(function () {
            $("#modal_Training_Point_Update").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "update", update_service);
    }

    /**delete */
    ctrl.prepareDelete = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "TrainingPoint", "delete");

        ctrl._delete_value = {
            id: item._id,
            title: item.title
        }
    }

    function delete_service() {
        let dfd = $q.defer();
        training_point_service.delete(
            ctrl._delete_value.id
        ).then(function () {
            $("#modal_Training_Point_Delete").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "TrainingPoint", "delete", delete_service);
    }

}]);
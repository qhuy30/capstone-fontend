myApp.compileProvider.directive("briefcaseInsertModal", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/waiting_storage/directives/briefcase_insert_modal.html",
        scope: {
            insertSuccessFunc: '&',
            briefcaseInsertItem: '<',
            briefcaseReferenceType: '@'
        },
        controller: [
            "waiting_storage_service",
            'localStorage',
            "$q",
            "$rootScope",
            "$scope",
            function (waiting_storage_service,$localStorage, $q, $rootScope, $scope) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "waiting_storage", action: "insert" },
                    { name: "waiting_storage", action: "save" },
                ];

                var ctrl = this;
                $scope.ctrl = ctrl;
                $scope.forms = {};

                /** init variable */
                {
                    ctrl._insert_value = {};
                    ctrl._waiting_archive = {};

                    ctrl.Departments =[];
                    ctrl._notyetInit = true;

                    ctrl._searchByKeyToFilterData = "";
                    ctrl._filterODB= "";
                    ctrl._filterODT = "";
                    ctrl._filterPriority ="";
                    ctrl._filterReceiveMethod = "";

                    ctrl.IncommingDispatchPririoty_Config = {
                        master_key: "incomming_dispatch_priority",
                        load_details_column: "value"
                    };

                    ctrl.Storage_config = {
                        master_key: "storage_name",
                        load_details_column: "value"
                    };

                    ctrl.MethodOfSendingDispatchTo_Config = {
                        master_key: "method_of_sending_dispatch_to",
                        load_details_column: "value"
                    };

                    ctrl.Document_type_Config = {
                        master_key: "document_type",
                        load_details_column: "value"
                    };

                    ctrl._ctrlName = "briefcase_insert_modal_controller";

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                /* Init and load necessary resource to the module. */
                init();

                function init() {
                    var dfdAr = [];

                    $q.all(dfdAr).then(
                        function () {
                            ctrl._notyetInit = false;
                        }, function (err) {
                            console.log(err);
                            err = undefined;
                        }
                    );
                }

                ctrl.pickStorage = function (storage) {
                    ctrl._insert_value.storage = storage.value;
                }

                function generateNameStorage(name){
                    return `${ctrl._ctrlName}_${name}`
                }

                ctrl.prepareInsert = function (params, referenceType) {
                    $rootScope.statusValue.generate(ctrl._ctrlName, "waiting_storage", "insert");
                    var currentYear = new Date().getFullYear();
                    ctrl._waiting_archive = params;
                    
                    ctrl._insert_value = {
                        id: params._id,
                        outgoing_dispatch_id: params.odb_id,
                        title: params.title,
                        organ_id: '000.00.45.429',
                        file_notation: params.symbol_number,
                        language: $rootScope.Language.current,
                        usage_mode: "",
                        description: "",
                        year: currentYear,
                        maintenance_time: {
                            amount: 1,
                            unit: "day",
                        },
                        storage: "",
                        references: params.references || [],
                        location_storage: "",
                        addtional_documents: params.addtional_documents,
                    };
                    if (ctrl._insert_value && ctrl._insert_value.references) {
                        ctrl._insert_value.references = ctrl._insert_value.references.filter(reference => reference.isDefault === false);
                    }
                    ctrl._insert_value.references = [];
                    

                    waiting_storage_service.getPrepareInsertData()
                        .then(({data}) => {
                            ctrl._insert_value.code = data.code;
                            ctrl._insert_value.organ_id = data.organ_id ? data.organ_id : '000.00.45.429'
                        }).catch(err => console.log(err));

                };

                ctrl.load_file_info_waiting_archive = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        waiting_storage_service.load_file_info_waiting_archive(params.id, params.name).then(function (res) {
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

                ctrl.save = function(){
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "save", save_service);
                }

                function save_service(){
                    const dfd = $q.defer();
                    $localStorage.setItem(generateNameStorage(ctrl._waiting_archive._id), ctrl._insert_value);
                    dfd.resolve(true);
                    return dfd.promise;
                }

                function insert_service() {
                    // let references = ctrl._insert_value.references.map(item => {
                    //     return {
                    //         id: item.id,
                    //         object: item.object,
                    //     }
                    // });
                    var dfd = $q.defer();
                    waiting_storage_service.insert(
                        ctrl._insert_value.id,
                        ctrl._insert_value.outgoing_dispatch_id,
                        ctrl._insert_value.title,
                        ctrl._insert_value.organ_id,
                        ctrl._insert_value.file_notation,
                        ctrl._insert_value.language,
                        ctrl._insert_value.usage_mode,
                        ctrl._insert_value.year,
                        ctrl._insert_value.description,
                        ctrl._insert_value.maintenance_time,
                        ctrl._insert_value.addtional_documents,
                        // references,
                        [],
                        ctrl._insert_value.storage,
                        ctrl._insert_value.location_storage,
                        $scope.briefcaseInsertItem.parents,
                        {
                        }
                    ).then(function () {
                        $("#modal_insert_briefcase").modal("hide");
                        $scope.insertSuccessFunc();
                        dfd.resolve(true);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                ctrl.insert = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "insert", insert_service);
                }

                // ctrl.searchReference = function (search) {
                //     var dfd = $q.defer();
                //     waiting_storage_service.searchReference(search.search)
                //         .then(({ data }) => {
                //             dfd.resolve(data);
                //             dfd = undefined;
                //         }, function (err) {
                //             dfd.reject(err);
                //             err = undefined;
                //         });
                //     return dfd.promise;
                // }
                // ctrl.loadDetailsReference = function (params) {
                //     return $q.resolve(params.ids)
                // }

                // ctrl.chooseReference = function (item) {
                //     ctrl._insert_value.references = item;
                // }

                $(document).on('show.bs.modal', "#modal_insert_briefcase", function (e) {
                    $scope.$apply(function () {
                        ctrl.prepareInsert($scope.briefcaseInsertItem, $scope.briefcaseReferenceType);
                    });
                });
            },
        ],
    };
});

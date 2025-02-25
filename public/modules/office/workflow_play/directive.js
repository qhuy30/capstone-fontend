myApp.compileProvider.directive("wfpInsertModal", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/workflow_play/directives/wfp_insert_modal.html",
        scope: {
            insertSuccessFunc: '&',
            parentItem: "<",
            parentType: "<"
        },
        controller: [
            "workflow_play_service",
            "$q",
            "$rootScope",
            "$scope",
            function (workflow_play_service, $q, $rootScope, $scope) {
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

                /** init variable */
                {
                    ctrl._ctrlName = "wfp_insert_modal_controller";
                    ctrl.WF = [];
                    ctrl.WF2 = [];
                    ctrl.listUsers = [];
                    ctrl.listUsersDefault = [];
                    ctrl.listAllUser = [];
                    ctrl.departmentDetails = {};
                    ctrl._notyetInit = true;
                    ctrl.offset = 0;

                    ctrl.DocumentType_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                /* Init and load necessary resource to the module. */
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

                    ctrl._insert_value = {
                        file: undefined,
                        fileError: undefined,
                        relatedfile: [],
                        title: "",
                        flow: "",
                        document_type: "",
                        templateTags: [],
                        appendixFile: [],
                        archived_documents: [],
                        wf: {
                            title:{}
                        },
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

                    
                    if (ctrl.WF2 && ctrl.WF2.length > 0) {
                        let firstItem = ctrl.WF2[0];
                        
                        ctrl.selectedItem = {
                            title: firstItem.title
                        };
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

                    val.file_type =
                        val.file_type ||
                        (val.customTemplate
                            ? "custom_template"
                            : "file_upload"); // for backward compatible
                    ctrl.listUsers = [];
                    ctrl._insert_value.key = val._id;
                    ctrl._insert_value.wf = val;
                    ctrl._insert_value.templateTags = angular.copy(
                        (val.templateTags || []).map(tag => {
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
                        Array.isArray(val.flow) && val.flow.some((f) =>
                            Array.isArray(f.items) && f.items.some(
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
                                let competenceLeader = employeeLeader.competence.value || employeeLeader.competence;
                                let userInfor = ctrl.listAllUser.find(user => user.username === processLeader);
                                let departmentLeader = userInfor.departmentId;
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
                ctrl.pickViewOnlyDepartment_insert = function (val) {
                    ctrl._insert_value.DepartmentDestination =  angular.copy(val);
                };

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
                                    attachmentId: 'new',
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


                    workflow_play_service
                        .insert(
                            files,
                            ctrl._insert_value.relatedfile,
                            ctrl._insert_value.appendixFile,
                            ctrl._insert_value.title,
                            flowInfo,
                            ctrl._insert_value.wf.flow,
                            ctrl._insert_value.document_type,
                            tagsValue,
                            ctrl._insert_value.archived_documents,
                            parents,
                            parent,
                            ctrl._insert_value.DepartmentDestination,
                            ctrl._insert_value.is_personal || false,  
                            ctrl._insert_value.is_department || false
                        )
                        .then(
                            function (res) {
                                $("#modal_WFP_Insert").modal("hide");
                                $rootScope.isActive = true;
                                dfd.resolve(true);
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

                $(document).on('show.bs.modal', "#modal_WFP_Insert", function (e) {
                    if (e.target.id === 'modal_WFP_Insert') {
                        $scope.$apply(function () {
                            ctrl.prepareInsert();
                        });
                    }
                });
            },
        ],
    };
});

myApp.compileProvider.directive("wfpUpdateModal", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/workflow_play/directives/wfp_update_modal.html",
        scope: {
            item: '<',
            updateSuccessFunc: '&',
        },
        controller: [
            "workflow_play_service",
            "$q",
            "$rootScope",
            "$scope",
            function (workflow_play_service, $q, $rootScope, $scope) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "WFP", action: "update" },
                    { name: "WFP", action: "loadUserAndDepartment" },
                    { name: "WFP", action: "loadCustomTemplatePreview" },
                    { name: "WFP", action: "parseTemplate" },
                ];

                function emitReloadEvent (code) {
                    let obj = {
                        type: "workflow_play",
                        value: code
                    }

                    $rootScope.emitReloadEvent(obj);
                }

                var ctrl = this;
                $scope.ctrl = ctrl;
                $scope.forms = {};

                /** init variable */
                {
                    ctrl._ctrlName = "wfp_update_modal_controller";
                    ctrl.WF = [];
                    ctrl.WF2 = [];
                    ctrl.listUsers = [];
                    ctrl.listUsersDefault = [];
                    ctrl.departmentDetails = {};
                    ctrl._notyetInit = true;
                    ctrl.offset = 0;

                    ctrl.DocumentType_Config = {
                        master_key: "document_type",
                        load_details_column: "value",
                    };

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                /* Init and load necessary resource to the module. */
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

                ctrl.prepareUpdate = function () {
                    ctrl.loadUserAndDepartment();

                    $rootScope.statusValue.generate(
                        ctrl._ctrlName,
                        "WFP",
                        "update"
                    );

                    let relatedFiles = [];
                    if ($scope.item.relatedfile && $scope.item.relatedfile.length) {
                        relatedFiles = $scope.item.relatedfile.map(file => ({
                            origName: file.name,
                            name: file.display,
                        }));
                    }

                    const workflow = ctrl.WF.find(wf => wf._id === $scope.item.flow_info._id);

                    ctrl._update_value = {
                        file: undefined,
                        fileError: undefined,
                        relatedfile: relatedFiles,
                        title: $scope.item.title,
                        flow: $scope.item.flow,
                        document_type: $scope.item.document_type,
                        templateTags: [],
                        comment: '',
                    };

                    ctrl.chooseWFT_update({
                        value: $scope.item.document_type,
                    });

                    ctrl.chooseWF_update(workflow);

                    workflow.templateTags.forEach((tag, index) => {
                        const tagValue = $scope.item.tags_value[tag.name];
                        switch (tag.type) {
                            case 'date':
                                const value = dayjs(tagValue, tag.format);
                                ctrl._update_value.templateTags[index].value = value;
                                ctrl._update_value.templateTags[index].rawValue = value.valueOf();
                                break;
                            case 'dropdown':
                                updateDropdownTagValue(tag, index);
                                break;
                            default:
                                ctrl._update_value.templateTags[index].value = tagValue;
                                break;
                        }
                    });
                };

                function updateDropdownTagValue(tag, index) {
                    const tagValue = $scope.item.tags_value[tag.name];
                    workflow_play_service.loadDirectories(tag.masterKey).then(function (res) {
                        const directory = res.data.find(d => d.title[$rootScope.Language.current] === tagValue);
                        ctrl._update_value.templateTags[index].value = tagValue;
                        ctrl._update_value.templateTags[index].rawValue = directory ? directory.value : undefined;
                    });
                }

                /**update */
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

                ctrl.chooseWFT_update = function (val) {
                    ctrl._update_value.document_type = val.value;
                    ctrl.WF2 = [];
                    for (var i in ctrl.WF) {
                        if (val.value === ctrl.WF[i].key) {
                            ctrl.WF2.push(ctrl.WF[i]);
                        }
                    }
                    ctrl.listUsers = [];
                };
                ctrl.chooseWF_update = function (val) {
                    val.file_type =
                        val.file_type ||
                        (val.customTemplate
                            ? "custom_template"
                            : "file_upload"); // for backward compatible
                    ctrl.listUsers = [];
                    ctrl._update_value.key = val._id;
                    ctrl._update_value.wf = val;
                    ctrl._update_value.templateTags = angular.copy(
                        val.templateTags
                    );
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
                };

                ctrl.loadFileTemplate = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        workflow_play_service
                            .loadFileTemplateInfo(params.name)
                            .then(
                                function (res) {
                                    dfd.resolve({
                                        display: params.display,
                                        embedUrl: res.data.url,
                                    });
                                    res = undefined;
                                    dfd = undefined;
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
                            const isValidTags = ctrl._update_value.wf.templateTags.every(tag => tagNames.includes(tag.name));
                            ctrl._update_value.fileError = isValidTags ? '' : 'File is missing required tags';
                            dfd.resolve(true);
                            dfd = undefined;
                        }, function (err) {
                            ctrl._update_value.fileError = 'Invalid file format';
                            dfd.reject(err);
                            dfd = undefined;
                        });
                        return dfd.promise;
                    }
                };

                ctrl.handleSelectFile = function (file) {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "parseTemplate", parseTemplate_service(file));
                };

                ctrl.removeFile_update = function () {
                    ctrl._update_value.file = undefined;
                    ctrl._update_value.fileError = undefined;
                };

                ctrl.removeRelatedFile_update = function (item) {
                    var temp = [];
                    for (var i in ctrl._update_value.relatedfile) {
                        if (
                            ctrl._update_value.relatedfile[i].name != item.name
                        ) {
                            temp.push(ctrl._update_value.relatedfile[i]);
                        }
                    }
                    ctrl._update_value.relatedfile = angular.copy(temp);
                };

                ctrl.chooseDateTag_update = function ($index, val) {
                    ctrl._update_value.templateTags[$index].rawValue =
                        val.getTime();
                    ctrl._update_value.templateTags[$index].value = dayjs(
                        val.getTime()
                    ).format(ctrl._update_value.templateTags[$index].format);
                };

                ctrl.chooseDropdownTag_update = function ($index, val) {
                    ctrl._update_value.templateTags[$index].rawValue =
                        val.value;
                    ctrl._update_value.templateTags[$index].value =
                        val.title[$rootScope.Language.current];
                };

                ctrl.isCustomTagsValid = function () {
                    const tags = ctrl._update_value.templateTags;

                    for (let i = 0; i < tags.length; i++) {
                        const formField =
                            $scope.forms.updateForm[
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
                    (ctrl._update_value?.templateTags || []).forEach((tag) => {
                        tagsValue[tag.name] = tag.value;
                    });

                    return tagsValue;
                }

                function loadCustomTemplatePreview_service() {
                    var dfd = $q.defer();
                    const workflowId = ctrl._update_value.wf._id;
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
                                    display:
                                        ctrl._update_value.wf.templateFiles[0]
                                            .display,
                                    embedUrl: res.data.url,
                                    serviceName: "workflow",
                                    attachmentId: "",
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

                function update_service() {
                    var dfd = $q.defer();
                    const files = ctrl._update_value.file
                        ? [ctrl._update_value.file]
                        : [];
                    const relatedFiles = (ctrl._update_value?.relatedfile || []).filter(
                        (item) => item?.file
                    );
                    const preserveRelatedFiles = (ctrl._update_value?.relatedfile || [])
                        .filter((file) => !file.file)
                        .map((file) => ({ name: file.origName }));
                    const tagsValue = getTagsValue();

                    workflow_play_service
                        .resubmit(
                            $scope.item._id,
                            ctrl._update_value.title,
                            files,
                            relatedFiles,
                            preserveRelatedFiles,
                            tagsValue,
                            ctrl._update_value.comment
                        )
                        .then(
                            function (res) {
                                $("#modal_WFP_Update").modal("hide");
                                dfd.resolve(true);
                                dfd = undefined;
                                $scope.updateSuccessFunc && $scope.updateSuccessFunc({ params: res.data });
                                emitReloadEvent($scope.item.code)
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
                        "WFP",
                        "update",
                        update_service
                    );
                };

                ctrl.handleClickUpdate = function () {
                    const needCreatorSign =
                    ctrl._update_value &&
                    ctrl._update_value.templateTags &&
                    ctrl._update_value.templateTags.some(
                        (tag) =>
                            tag.type === "creator_signature" ||
                            tag.type === "creator_quotation_mark"
                    );
                    if (needCreatorSign) {
                        ctrl.showModalSignAFile = true;
                    } else {
                        ctrl.update();
                    }
                };

                ctrl.handleHideModalSignAFile = function () {
                    ctrl.showModalSignAFile = false;
                };

                ctrl.handleClickSign_update = function () {
                    ctrl.update();
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

                $(document).on('show.bs.modal', "#modal_WFP_Update", function (e) {
                    $scope.$apply(function () {
                        ctrl.prepareUpdate();
                    });
                });
            },
        ],
    };
});


myApp.compileProvider.directive("wfpView", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/workflow_play/directives/wfp_view.html",
        scope: {
            itemId: '<',
        },
        controller: ['sign_details_service', '$q', '$rootScope', '$filter', '$scope', function (sign_details_service, $q, $rootScope, $filter, $scope) {
            /**declare variable */
            const _statusValueSet = [
                { name: "WFP", action: "loadDetails" }
            ];
            var ctrl = this;
            $scope.ctrl = ctrl;

            const getCode = () => {
                const matches = $rootScope.currentPath.match(/\/signing-details\?code=\/(.*)/);
                return matches ? matches[1] : null;
            };

            ctrl.code = getCode();

            var idEditor = "insertODB_excerpt";
            const Expiration_Date_Error_Msg = $filter('l')('ExpirationDateErrorMsg');

            var today = new Date();
            var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            /** init variable */
            {
                ctrl._ctrlName = "sign_details_controller";

                ctrl.DocumentType_Config = {
                    master_key: "document_type",
                    load_details_column: "value"
                };

                ctrl.StatusOfSigning_Config = {
                    master_key: "status_of_signing",
                    load_details_column: "value"
                };
                ctrl.Competence_Config = {
                    master_key: "competence",
                    load_details_column: "value"
                };

                ctrl.Type = [
                    { title: { "vi-VN": "Một người duyệt cho tất cả", "en-US": "One for all" }, key: "one" },
                    { title: { "vi-VN": "Đồng thuận", "en-US": "All Approval" }, key: "all" },
                    { title: { "vi-VN": "Xử lý văn bản", "en-US": "Word Processing" }, key: "process" },
                    { title: { "vi-VN": "Nhận thông báo xử lý nghiệp vụ", "en-US": "Business Process Notification" }, key: "receiver" }
                ];

                ctrl.OutgoingDispatchBook_Config = {
                    master_key: "outgoing_dispatch_book",
                    load_details_column: "value"
                };

                ctrl.IncommingDispatchPririoty_Config = {
                    master_key: "incomming_dispatch_priority",
                    load_details_column: "value"
                };

                ctrl.KindOfDispatchTo_Config = {
                    master_key: "document_type",
                    load_details_column: "value"
                };


                ctrl.MethodOfSendingDispatchTo_Config = {
                    master_key: "method_of_sending_dispatch_to",
                    load_details_column: "value"
                };


                ctrl.LaborContractType_Config = {
                    master_key: "larbor_contract_type",
                    load_details_column: "value"
                };

                ctrl._insert_value = {
                    outgoing_dispatch_book: "",
                    workflow_play_id: "",
                    document_date: myToday,
                    outgoing_documents: [],
                    attach_documents: [],
                    signers: [],
                    excerpt: "",
                    userAndDepartment: {
                        user: [],
                        department: []
                    },
                    document_quantity: 1,
                    transfer_date: myToday,
                    expiration_date: myToday,
                    note: "",
                    priority: "",
                };

                ctrl._insert_to_storage_value = {};
                ctrl.department_detail = {};
                ctrl.applyNewStorageFlow = false;
                $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
            }

            function reset() {
                ctrl.Item = {};
                ctrl.task = [];
                ctrl.status = "see";
                ctrl.comment = "";
                ctrl.listTransformSign = [];
                ctrl.sign = "";
                ctrl.isSignOther = false;
                ctrl.odbDetail = {};
                ctrl.signer = [];
                ctrl.signerStr = '';
                ctrl.isProcess = false;
            }

            reset();


            ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
                let today = new Date();
                let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                if (isInsert) {
                    return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
                } else {
                    return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
                }
            }

           

            ctrl.isWFPCompleted = function () {
                return ctrl.Item.status === 'Completed' || ctrl.isOutgoingDispatchReleased();
            }

            ctrl.isOutgoingDispatchReleased = function () {
                return ctrl.Item.outgoing_dispatch && ['Released', 'SaveBriefCase'].includes(ctrl.Item.outgoing_dispatch.status);
            }

            ctrl.isShowWFPDetails = function () {
                return !(ctrl.isWFPCompleted() && ctrl.applyNewStorageFlow);
            }

            init();
            function init() {
                var dfdAr = [];
                ctrl.relatedFiles = []
                dfdAr.push(load_employee_detail());
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");

                for (var i in $rootScope.Settings) {
                    if ($rootScope.Settings[i].key === "applyNewStorageFlow") {
                        ctrl.applyNewStorageFlow = $rootScope.Settings[i].value;
                        break;
                    }
                }

                $q.all(dfdAr).then(
                    function () {
                        ctrl.loadDetails();
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    }
                );
            }

            function load_employee_detail() {
                var dfd = $q.defer();
                sign_details_service.loadEmployeeDetail($rootScope.logininfo.data.employee).then(function (res) {
                    ctrl.sign = res.data.signature.link;
                    ctrl.quotationMark = res.data.quotationMark.link;
                    dfd.resolve(true);
                }, function () {
                    dfd.reject(false);
                    err = undefined;
                });
                return dfd.promise;
            }

            ctrl.transformWritenBy = function (text) {
                return text.charAt(0).toUpperCase() + text.slice(1);
            }

            ctrl.loadDepartment_details = function (params) {
                let dfd = $q.defer();
                sign_details_service.loadDepartment_details(params.id).then(function (res) {
                    dfd.resolve(res.data);
                    res = undefined;
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            ctrl.loadfileTask = function (params) {
                return function () {
                    var dfd = $q.defer();
                    sign_details_service.loadFileInfoTask(params.id, params.name).then(function (res) {
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

            ctrl.loadRole_details = function (params) {
                let dfd = $q.defer();
                sign_details_service.loadRole_details(params.id).then(function (res) {
                    dfd.resolve(res.data);
                    res = undefined;
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }
            ctrl.loadfile = function (params) {
                return function () {
                    var dfd = $q.defer();
                    sign_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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
            /**show Infomation Details*/

            function loadDetails_service() {
                var dfd = $q.defer();
                ctrl.isLoadSuccess = false;
                ctrl.task = [];
                ctrl.signer = [];
                ctrl.signerStr = '';
                ctrl.mergedRelatedFiles = [];
                $q.all([
                    sign_details_service.loadDetails($scope.itemId, ctrl.code),
                    sign_details_service.loadDirectories(ctrl.OutgoingDispatchBook_Config.master_key),
                ]).then(function ([res, odbRes]) {
                    ctrl.Item = res.data;
                    ctrl.thisId = ctrl.Item._id;
                    ctrl.breadcrumb = [
                        ...(ctrl.Item.parents || []).reverse(),
                        { object: 'workflow_play', code: ctrl.Item.code },
                    ];
                    ctrl.task = res.data.task || [];
                    ctrl.display_status = ctrl.Item.status;
                    ctrl._insert_value.type = res.data.document_type;
                    ctrl._insert_value.title = res.data.title;

                    // auto select outgoing dispatch book
                    const odbs = odbRes.data || [];
                    if (odbs.length) {
                        const matchOdb = odbs.find(odb => odb.document_type === ctrl.Item.document_type && odb.year === new Date().getFullYear());
                        if (matchOdb) {
                            ctrl._insert_value.outgoing_dispatch_book = matchOdb.value;
                        }
                    }

                    res.data.event.forEach((item) => {
                        if (item.action && item.action === 'Signed') {
                            ctrl._insert_value.signers.push(item.username)
                        }
                    });
                    ctrl.mergedRelatedFiles = res.data.relatedfile.map((item) => {
                        return Object.assign(item, { owner: res.data.username })
                    });
                    res.data.event.forEach((item) => {
                        if (Array.isArray(item.relatedfile) && item.relatedfile.length) {
                            ctrl.mergedRelatedFiles = ctrl.mergedRelatedFiles.concat(item.relatedfile.map((ele) => Object.assign(ele, { owner: item.username })))
                        }
                    })
                    // ctrl.signerStr = ctrl.signer.join(', ');
                    if (ctrl.Item && ctrl.Item.play_now) {
                        for (var i in ctrl.Item.play_now) {
                            if (ctrl.Item.play_now[i].username == $rootScope.logininfo.username) {
                                ctrl.status = "pending";
                                if (ctrl.Item.event && ctrl.Item.node) {
                                    let eventList = JSON.parse(JSON.stringify(ctrl.Item.event));
                                    eventList = eventList.reverse();
                                    for (const e of eventList) {
                                        if (e.action.toLowerCase() === 'returned') {
                                            break;
                                        }
                                        if (e.node === ctrl.Item.node
                                            && e.username === $rootScope.logininfo.username
                                            && e.action.toLowerCase() === 'approved'
                                            && e.valid === true) {
                                            ctrl.status = "see";
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }

                    ctrl.listTransformSign = ctrl.Item.event.filter(event => event.valid && event.action === 'transformSign');

                    if (ctrl.listTransformSign.some(ts => ts.node === ctrl.Item.node && ts.receiver === $rootScope.logininfo.username)) {
                        ctrl.isSignOther = true;
                    }

                    if (
                        ctrl.Item.node === ctrl.Item.flow.length &&
                        ctrl.Item.flow[ctrl.Item.node - 1].type === 'process' &&
                        ctrl.Item.play_now.some(usr => usr.username === $rootScope.logininfo.username)
                    ) {
                        ctrl.isProcess = true;
                    }

                    if (ctrl.Item.status === 'SaveODB') {
                        ctrl.isProcess = true;
                        ctrl.odbDetail = res.data.outgoing_dispatch || {};
                        ctrl._insert_value = ctrl.odbDetail;
                        ctrl.status = 'SaveODB';
                        ctrl._insert_value.userAndDepartment = {
                            user: ctrl.odbDetail.receiver_notification,
                            department: ctrl.odbDetail.department_notification
                        };
                    }

                    dfd.resolve(true);
                    ctrl.isLoadSuccess = true;
                    res = undefined;
                    dfd = undefined;
                }, function (err) {
                    if (err.status === 403) {
                        $rootScope.urlPage = urlNotPermissionPage;
                    } else {
                        $rootScope.urlPage = urlNotFoundPage;
                    }
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;

            }

            ctrl.loadDetails = function () {
                return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "loadDetails", loadDetails_service);
            }



            function getCurrentNode() {
                if (!ctrl.Item.flow || !ctrl.Item.flow.length) {
                    return undefined;
                }
                const index = ctrl.Item.node > 0 ? ctrl.Item.node - 1 : ctrl.Item.flow.length - 1;
                return ctrl.Item.flow[index];
            }

            ctrl.getNodeType = function () {
                const currentNode = getCurrentNode();
                return currentNode ? currentNode.type : '';
            };

            ctrl.isPendingSign = function () {
                if (ctrl.status !== 'pending') {
                    return false;
                }

                const currentNode = getCurrentNode();
                const flowItems = currentNode ? currentNode.items : [];
                const playNow = ctrl.Item.play_now.find(p => p.username === $rootScope.logininfo.username);
                const playNowItems = flowItems.filter(item => (playNow.items || []).includes(item.id));
                const isNeedSign = playNowItems.some(item => !!item.signature || !!item.quotationMark);

                return !isNeedSign ? false : playNowItems.some(item => {
                    const isSignedSignature = ctrl.Item.signatureTags.some(tag => tag.name === item.signature && tag.isSigned);
                    const isSignedQuotationMark = ctrl.Item.signatureTags.some(tag => tag.name === item.quotationMark && tag.isSigned);
                    return !isSignedSignature && !isSignedQuotationMark;
                });
            };

        }
        ]
    };
});



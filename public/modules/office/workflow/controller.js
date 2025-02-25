myApp.registerCtrl('workflow_controller', ['workflow_service', '$q', '$rootScope', '$timeout', function (workflow_service, $q, $rootScope, $timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Workflow", action: "load" },
        { name: "Workflow", action: "parseCustomTemplate_insert" },
        { name: "Workflow", action: "parseCustomTemplate_update" },
        { name: "Workflow", action: "insert" },
        { name: "Workflow", action: "update" },
        { name: "Workflow", action: "delete" },
        { name: "Organization", action: "load" }

    ];
    var ctrl = this;
    var currentItem = {};
    /** init variable */
    {
        ctrl._ctrlName = "workflow_controller";

        ctrl.Competences = [];
        ctrl.organizations = [];
        ctrl.workflows = [];
        ctrl.expandAr = [];
        ctrl._notyetInit = true;
        ctrl._filterWFT = [];
        ctrl._filterDepartment = "";
        ctrl.currentDepartment = "";
        ctrl.indexNodeFlow = -1;
        // ctrl.select_insert_department='choose_department'
        ctrl.generalWorkflow = {
            id: null,
            open: false,
            childs: [],
            wfs: []
        };
        ctrl.data = [];
        ctrl.Type = [
            { title: { "vi-VN": "Một người duyệt cho tất cả", "en-US": "One for all" }, key: "one" },
            { title: { "vi-VN": "Đồng thuận", "en-US": "All Approval" }, key: "all" },
            { title: { "vi-VN": "Xử lý văn bản", "en-US": "Word Processing" }, key: "process" },
            { title: { "vi-VN": "Nhận thông báo xử lý nghiệp vụ", "en-US": "Business Process Notification" }, key: "receiver" }
        ];
        ctrl.tagTypeOptions = [
            {
                id: 'text',
                title: { 'vi-VN': 'Chữ', 'en-US': 'Text' }
            },
            {
                id: 'number',
                title: { 'vi-VN': 'Chữ số', 'en-US': 'Number' }
            },
            {
                id: 'date',
                title: { 'vi-VN': 'Ngày tháng', 'en-US': 'Date' }
            },
            {
                id: 'signature',
                title: { 'vi-VN': 'Chữ ký', 'en-US': 'Signature' }
            },
            {
                id: 'quotation_mark',
                title: { 'vi-VN': 'Chữ ký nháy', 'en-US': 'Quotation mark' }
            },
            {
                id: 'creator_signature',
                title: { 'vi-VN': 'Chữ ký người trình ký', 'en-US': 'Creator signature' }
            },
            {
                id: 'creator_quotation_mark',
                title: { 'vi-VN': 'Chữ ký nháy người trình ký', 'en-US': 'Creator quotation mark' }
            },
            {
                id: 'dropdown',
                title: { 'vi-VN': 'Danh mục chọn', 'en-US': 'Dropdown' }
            },
            {
                id: 'pick',
                title: { 'vi-VN': 'Đối tượng Chọn', 'en-US': 'Pick' }
            },
        ];
        ctrl.tagPickOptions = [
            {
                id: 'user',
                title: { 'vi-VN': 'Nhân viên', 'en-US': 'Employee' }
            },
            {
                id: 'department',
                title: { 'vi-VN': 'Đơn vị', 'en-US': 'Department' }
            },
            {
                id: 'archived_document',
                title: { 'vi-VN': 'Văn bản lưu trữ', 'en-US': 'Archived Document' }
            }
        ];
        ctrl.tagTypeOptionsForFileUpload = ctrl.tagTypeOptions.filter(type =>
            ['signature', 'quotation_mark', 'creator_signature', 'creator_quotation_mark'].includes(type.id)
        );

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };

        ctrl.Role_Config = {
            master_key: "role",
            load_details_column: "value"
        };

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/workflow/views/insert_modal.html";
        ctrl._urlNodeModal = FrontendDomain + "/modules/office/workflow/views/node_modal.html";
        ctrl._urlNode_insertModal = FrontendDomain + "/modules/office/workflow/views/node_insert_modal.html";
        ctrl._urlNode_updateModal = FrontendDomain + "/modules/office/workflow/views/node_update_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/workflow/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/workflow/views/delete_modal.html";
    }


    /* Init and load necessary resource to the module. */
    ctrl.chooseWFT = function (val) {
        ctrl._filterWFT = val;
        ctrl.refreshData();
    }

    function generateFilterLoadUser() {
        var obj = {};
        if (ctrl._filterWFT.length > 0) {
            obj.key = ctrl._filterWFT;
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }






    function loadJob() {
        var dfd = $q.defer();
        workflow_service.loadJob().then(function (res) {
            ctrl.Job = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }



    ctrl.loadType_details = function (params) {
        let dfd = $q.defer();
        for (var i in ctrl.Type) {
            if (ctrl.Type[i].key == params.id) {
                dfd.resolve(ctrl.Type[i]);
                break;
            }
        }
        return dfd.promise;
    }



    function load_wf(id) {
        var filter = generateFilterLoadUser();
        workflow_service.loadWF(filter.key, filter.search, id).then(
            function (res) {
                if (!id) {
                    ctrl.generalWorkflow.wfs = res.data;
                } else {
                    currentItem.wfs = res.data;
                }
            },
            function () {
                err = undefined;
            }
        );
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        workflow_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    function loadDepartment() {
        if (currentItem.id) {
            workflow_service.loadDepartment(currentItem.level + 1, currentItem.id).then(function (res) {
                currentItem.childs = res.data.departments;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        } else {
            workflow_service.loadDepartment(1).then(function (res) {
                ctrl.organizations = res.data.departments;
                ctrl._filterDepartment = res.data.isFilteredWithUserRule;
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        }
    }

    ctrl.expandForGeneralDeparment = function () {
        if (ctrl.generalWorkflow.open) {
            ctrl.generalWorkflow.id = null;
            ctrl.generalWorkflow.open = false;
            ctrl.generalWorkflow.childs = [];
            ctrl.generalWorkflow.wfs = [];
        } else {
            ctrl.generalWorkflow.open = true;
            loadDepartment();
            load_wf(ctrl.generalWorkflow.id);
        }
    };

    ctrl.expandDepartment = function (item) {
        currentItem = item;
        if (currentItem.open) {
            currentItem.open = false;
            currentItem.childs = [];
            currentItem.wfs = [];
        } else {
            currentItem.open = true;
            loadDepartment();
            load_wf(currentItem.id);
        }

    };

    ctrl.refreshData = function(){
        if(currentItem.id && currentItem.open){
            load_wf(currentItem.id);
        }
    }

    function loadCompetence() {
        var dfd = $q.defer();
        workflow_service.loadCompetence().then(function (res) {
            ctrl.Competences = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadCompetence_details = function (params) {
        let dfd = $q.defer();
        workflow_service.loadCompetence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(loadDepartment());
        dfdAr.push(loadCompetence());
        dfdAr.push(loadJob());

        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    function getNodesErrorCode(wfValue) {
        // validate nodes
        if (!wfValue.flow.length) {
            return 'NO_NODES';
        }

        // validate signatures
        const signatureTags = wfValue.templateTags.filter((tag) => tag.type === 'signature');
        let signatureItems = [];
        wfValue.flow.forEach(node => {
            signatureItems = signatureItems.concat(node.items.map(item => item.signature).filter(Boolean));
        });
        const missingSignatures = signatureTags.find(tag => !signatureItems.includes(tag.name));
        if (missingSignatures) {
            return 'MISSING_SIGNATURES';
        }

        // validate quotation marks
        const quotationMarkTags = wfValue.templateTags.filter((tag) => tag.type === 'quotation_mark');
        let quotationMarkItems = [];
        wfValue.flow.forEach(node => {
            quotationMarkItems = quotationMarkItems.concat(node.items.map(item => item.quotationMark).filter(Boolean));
        });
        const missingQuotationMarks = quotationMarkTags.find(tag => !quotationMarkItems.includes(tag.name));
        if (missingQuotationMarks) {
            return 'MISSING_QUOTATION_MARKS';
        }

        return '';
    }

    /**insert */
    ctrl.nodesErrorCode_insert = function () {
        return ctrl._insert_value ? getNodesErrorCode(ctrl._insert_value) : '';
    };

    function getSignatureOptions(updatingNode) {
        const wfValue = ctrl.state == "insert" ? ctrl._insert_value : ctrl._update_value;
        let usedSignatures = [];

        wfValue.flow.forEach(node => {
            if (!updatingNode || updatingNode.id !== node.id) {
                usedSignatures = usedSignatures.concat(node.items.map(item => item.signature).filter(Boolean));
            }
        });

        return wfValue.templateTags.filter((tag) => tag.type === 'signature' && !usedSignatures.includes(tag.name)).map((tag) => ({
            id: tag.name,
            title: {
                "vi-VN": tag.label,
                "en-US": tag.label,
            }
        }));
    }

    function getQuotationMarkOptions(updatingNode) {
        const wfValue = ctrl.state == "insert" ? ctrl._insert_value : ctrl._update_value;
        let usedQuotationMarks = [];

        wfValue.flow.forEach(node => {
            if (!updatingNode || updatingNode.id !== node.id) {
                usedQuotationMarks = usedQuotationMarks.concat(node.items.map(item => item.quotationMark).filter(Boolean));
            }
        });

        return wfValue.templateTags.filter((tag) => tag.type === 'quotation_mark' && !usedQuotationMarks.includes(tag.name)).map((tag) => ({
            id: tag.name,
            title: {
                "vi-VN": tag.label,
                "en-US": tag.label,
            }
        }));
    }

    ctrl.isDuplicateSignatures = function (node) {
        if (!node) {
            return false;
        }
        const nodeSignatures = node.items.map(item => item.signature).filter(Boolean);
        return node.type === 'all' && nodeSignatures.some((sign, index) => nodeSignatures.indexOf(sign) !== index);
    }

    ctrl.isDuplicateQuotationMarks = function (node) {
        if (!node) {
            return false;
        }
        const nodeQuotationMarks = node.items.map(item => item.quotationMark).filter(Boolean);
        return node.type === 'all' && nodeQuotationMarks.some((sign, index) => nodeQuotationMarks.indexOf(sign) !== index);
    }

    ctrl.prepareEditNode = function (id, item) {
        ctrl.indexNodeFlow = id;
        ctrl.node = item;
        ctrl.signatureOptions = getSignatureOptions(ctrl.node);
        ctrl.quotationMarkOptions = getQuotationMarkOptions(ctrl.node);
    }
    ctrl.setEditNode_insert = function () {
        for (var i in ctrl._insert_value.flow) {
            if (ctrl._insert_value.flow[i].id == ctrl.indexNodeFlow) {
                ctrl._insert_value.flow[i] = ctrl.node;
                break;
            }
        }

        $("#modal_Workflow_Node_Insert").modal("hide");
    }

    ctrl.deleteEditNode_insert = function () {
        var temp = [];
        for (var i in ctrl._insert_value.flow) {
            if (ctrl._insert_value.flow[i].id !== ctrl.indexNodeFlow) {
                temp.push(ctrl._insert_value.flow[i]);
            }
        }
        ctrl._insert_value.flow = angular.copy(temp);
        temp = undefined;
        $("#modal_Workflow_Node_Insert").modal("hide");
    }
    ctrl.chooseWFT_insert = function (val) {
        ctrl._insert_value.key = val.value;
    }

    ctrl.chooseTagType_insert = function ($index, option) {
        ctrl._insert_value.templateTags[$index].type = option.id;

        // cleanup or set default value based on type
        if (option.id !== 'date') {
            delete ctrl._insert_value.templateTags[$index].format;
        } else {
            ctrl._insert_value.templateTags[$index].format = 'DD/MM/YYYY';
        }

        if (option.id !== 'dropdown') {
            delete ctrl._insert_value.templateTags[$index].masterKey;
        }

        // reset signature and quotation mark
        ctrl._insert_value.flow.forEach(node => {
            node.items.forEach(item => {
                if (option.id !== 'signature' && item.signature === ctrl._insert_value.templateTags[$index].name) {
                    delete item.signature;
                }
                if (option.id !== 'quotation_mark' && item.quotationMark === ctrl._insert_value.templateTags[$index].name) {
                    delete item.quotationMark;
                }
            });
        });
    }

    ctrl.chooseTagDirectory_insert = function ($index, params) {
        ctrl._insert_value.templateTags[$index].masterKey = params.key;
    }

    ctrl.chooseTagPick_insert = function ($index, params) {
        ctrl._insert_value.templateTags[$index].pickKey = params.id;
    }

    ctrl.chooseCompetence_insert = function (val) {

        ctrl._insert_value.competence = val.value;
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;

    }

    ctrl.chooseJob_insert = function (val) {
        ctrl._insert_value.job = val.value;
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;
    }

    ctrl.chooseRole_insert = function (val) {
        ctrl._insert_value.role = val;
    }

    ctrl.chooseApprovalType_insert = function (val) {
        ctrl.node.type = val.key;

        if (ctrl.node.type === 'process') {
            ctrl.node.items.forEach(item => {
                delete item.signature;
                delete item.quotationMark;
            });
        }
    }

    ctrl.chooseDepartment_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].department = val.id;
                break;
            }
        }

    }

    ctrl.chooseCompetence_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].competence = val.value;
                break;
            }
        }
    }

    ctrl.chooseRole_addNode = function (val, id) {

        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].role = val.value;
                break;
            }
        }
    }

    ctrl.chooseSignature_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].signature = val.id;
                break;
            }
        }
    }
    ctrl.chooseLeaderProcess_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].processType = val.type;
                ctrl.node.items[i].rule = val.rule;
                break;
            }
        }
    }
    ctrl.handleSelectMethodsType_update = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].methods = val.type;
                break;
            }
        }
    }

    ctrl.chooseQuotationMark_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].quotationMark = val.id;
                break;
            }
        }
    }
    ctrl.prepareInsert = function (item) {
        ctrl.state = "insert";
        
        ctrl.currentDepartment = item ==='all' ? 'all' : item.id;
        $rootScope.statusValue.generate(ctrl._ctrlName, "Workflow", "insert");
        ctrl._insert_value = {
            title: { "vi-VN": "", "en-US": "" },
            key: "",
            flow: [],
            department_scope: item === 'all' ? 'all' : 'specific',
            department: item ==='all' ? '' : item.id,
            is_personal: false,
            is_department: false,
            competence: [],
            job: [],
            role: [],
            tab: "general",
            file_type: 'custom_template',
            allow_appendix: "false",
            allow_choose_destination: "false",
            customTemplate: undefined,
            templateTags: [],
            fee: "",
            estimate_time: "",
            receive_time: ""
        };
    }

    ctrl.prepareAddNode = function () {
        var d = new Date();
        ctrl.node = {
            id: d.getTime().toString(),
            type: "one",
            duration: 1,
            title:"",
            items: [],
            auto_completed_task: 'false'
        };
        ctrl.signatureOptions = getSignatureOptions();
        ctrl.quotationMarkOptions = getQuotationMarkOptions();
    }

    ctrl.addItemNode = function () {
        var d = new Date();
        ctrl.node.items.push({
            methods: 'fixed',
            id: d.getTime().toString(),
            department: "",
            competence: "",
            role: "",
            rule: []
        });
    }

    ctrl.removeItemNode = function (item) {
        var temp = [];
        for (var i in ctrl.node.items) {
            if (item.id !== ctrl.node.items[i].id) {
                temp.push(ctrl.node.items[i]);
            }
        }
        ctrl.node.items = temp;
    }

    ctrl.insertNode = function () {
        switch (ctrl.state) {
            case "insert":
                const autoCompleteTask = ctrl.node.auto_completed_task === "true" ? true : false;

                ctrl.node.auto_completed_task = autoCompleteTask;
                ctrl._insert_value.flow.push(ctrl.node);
                break;
            case "update":
                ctrl._update_value.flow.push(ctrl.node);
                break;
        }

        $("#modal_Workflow_Node").modal("hide");
    }

    function clearTagAssociations(wfValue) {
        wfValue.flow.forEach(node => {
            node.items.forEach(item => {
                delete item.signature;
                delete item.quotationMark;
            });
        });
    }

    function parseCustomTemplate_insert_service(file) {
        return function () {
            var dfd = $q.defer();
            workflow_service.parseCustomTemplate(file).then(function (res) {
                ctrl._insert_value.templateTags = ((res.data || {}).tags || []).map((tag) => ({ ...tag, type: 'text' }));
                clearTagAssociations(ctrl._insert_value);
                dfd.resolve(true);
            }, function (err) {
                alert('Template không đúng định dạng');
                ctrl.removeTemplate();
                dfd.reject(err);
            });
            return dfd.promise;
        }
    };

    ctrl.parseCustomTemplate_insert = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "parseCustomTemplate_insert", parseCustomTemplate_insert_service(file));
    }

    // ctrl.handleSelectDepartment_insert = function () {
    //     if(ctrl.select_insert_department === 'all_departments') {
    //         ctrl._insert_value.department = 'all';
    //     }
    //     if(ctrl.select_insert_department === 'choose_department') {
    //         ctrl._insert_value.department = ctrl.currentDepartment ? ctrl.currentDepartment : '';
    //     }
    // }

    ctrl.chooseDepartment = function (val) {
        ctrl._insert_value.department = val.id;
    }

    ctrl.removeCustomTemplate_insert = function () {
        ctrl._insert_value.customTemplate = undefined;
        ctrl._insert_value.templateTags = [];
    };

    ctrl.handleSelectFileType_insert = function () {
        ctrl._insert_value.files = [];
        ctrl._insert_value.customTemplate = undefined;
        ctrl._insert_value.templateTags = [];

        // remove in flow
        ctrl._insert_value.flow.forEach(node => {
            node.items.forEach(item => {
                delete item.signature;
                delete item.quotationMark;
            });
        });
    };

    ctrl.addFileUploadTag_insert = function () {
        ctrl._insert_value.templateTags.push({
            name: ``,
            label: '',
            type: 'signature',
        });
    };

    ctrl.removeFileUploadTag_insert = function ($index) {
        // remove in flow
        ctrl._insert_value.flow.forEach(node => {
            node.items.forEach(item => {
                if (item.signature === ctrl._insert_value.templateTags[$index].name) {
                    delete item.signature;
                }
                if (item.quotationMark === ctrl._insert_value.templateTags[$index].name) {
                    delete item.quotationMark;
                }
            });
        });

        // remove tag
        ctrl._insert_value.templateTags.splice($index, 1);
    };

    ctrl.onClickWorkflowTab_insert = function (generalForm) {
        if (!generalForm.$invalid && !ctrl.isInvalidOtherFields_insert()) {
            ctrl._insert_value.tab = 'workflow';
        }
    };

    ctrl.isInvalidOtherFields_insert = function () {
        return ctrl._insert_value && ctrl._insert_value.file_type === 'custom_template' && !ctrl._insert_value.customTemplate;
    };

    function insert_service() {
        const files = ctrl._insert_value.file_type === 'custom_template' ? [ctrl._insert_value.customTemplate] : ctrl._insert_value.files;
        var dfd = $q.defer();
        workflow_service.insert(ctrl._insert_value.title,
            ctrl._insert_value.key,
            ctrl._insert_value.flow,
            ctrl._insert_value.department_scope,
            ctrl._insert_value.department,
            ctrl._insert_value.is_personal,
            ctrl._insert_value.is_department,
            ctrl._insert_value.competence,
            ctrl._insert_value.job,
            ctrl._insert_value.role,
            ctrl._insert_value.file_type,
            ctrl._insert_value.allow_appendix,
            ctrl._insert_value.allow_choose_destination,
            files,
            ctrl._insert_value.templateTags,
            ctrl._insert_value.fee,
            ctrl._insert_value.estimate_time,
            ctrl._insert_value.receive_time,
            ).then(function () {
                $("#modal_Workflow_Insert").modal("hide");
                ctrl.refreshData();
                dfd.resolve(true);
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "insert", insert_service);
    }

    /**update */
    ctrl.nodesErrorCode_update = function () {
        return ctrl._update_value ? getNodesErrorCode(ctrl._update_value) : '';
    };

    ctrl.setEditNode_update = function () {
        for (var i in ctrl._update_value.flow) {
            if (ctrl._update_value.flow[i].id == ctrl.indexNodeFlow) {
                ctrl._update_value.flow[i] = ctrl.node;
                break;
            }
        }
        $("#modal_Workflow_Node_Update").modal("hide");
    }
    ctrl.deleteEditNode_update = function () {
        var temp = [];
        for (var i in ctrl._update_value.flow) {
            if (ctrl._update_value.flow[i].id !== ctrl.indexNodeFlow) {
                temp.push(ctrl._update_value.flow[i]);
            }
        }
        ctrl._update_value.flow = angular.copy(temp);
        temp = undefined;
        $("#modal_Workflow_Node_Update").modal("hide");
    }

    ctrl.chooseWFT_update = function (val) {
        ctrl._update_value.key = val.value;
    }

    ctrl.chooseTagType_update = function ($index, option) {
        ctrl._update_value.templateTags[$index].type = option.id;

        // cleanup or set default value based on type
        if (option.id !== 'date') {
            delete ctrl._update_value.templateTags[$index].format;
        } else {
            ctrl._update_value.templateTags[$index].format = 'DD/MM/YYYY';
        }

        if (option.id !== 'dropdown') {
            delete ctrl._update_value.templateTags[$index].masterKey;
        }

        if (option.id !== 'pick') {
            delete ctrl._update_value.templateTags[$index].pickKey;
        }

        // reset signature and quotation mark
        ctrl._update_value.flow.forEach(node => {
            node.items.forEach(item => {
                if (option.id !== 'signature' && item.signature === ctrl._update_value.templateTags[$index].name) {
                    delete item.signature;
                }
                if (option.id !== 'quotation_mark' && item.quotationMark === ctrl._update_value.templateTags[$index].name) {
                    delete item.quotationMark;
                }
            });
        });
    }

    ctrl.chooseTagPick_update = function ($index, params) {
        ctrl._update_value.templateTags[$index].pickKey = params.id;
    }

    ctrl.chooseTagDirectory_update = function ($index, params) {
        ctrl._update_value.templateTags[$index].masterKey = params.key;
    }

    ctrl.chooseCompetence_update = function (val) {
        ctrl._update_value.competence = val.value;
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;

    }

    ctrl.chooseJob_update = function (val) {
        ctrl._update_value.job = val.value;
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;
    }

    ctrl.chooseRole_update = function (val) {
        ctrl._update_value.role = val;
    }

    ctrl.chooseApprovalType_update = function (val) {
        ctrl.node.type = val.key;

        if (ctrl.node.type === 'process') {
            ctrl.node.items.forEach(item => {
                delete item.signature;
                delete item.quotationMark;
            });
        }
    }


    ctrl.prepareUpdate = function (item) {
        let customTemplate = undefined;
        let files = [];
        const tmpFiles = (item.templateFiles || []).map((file) => ({
            origName: file.name,
            name: file.display,
        }));
        const fileType = item.file_type || (customTemplate ? 'custom_template' : 'file_upload'); // for backward compatible
        const allowAppendix = item.allow_appendix === true ? 'true' : 'false';
        const allowChooseDestination = item.allow_choose_destination === true ? 'true' : 'false';
        if (fileType === 'custom_template') {
            customTemplate = tmpFiles[0];
        } else {
            files = tmpFiles;
        }

        const flow = angular.copy(item.flow);
        flow.forEach((node) => {
            const autoCompleteTask = node.auto_completed_task === true ? 'true' : 'false';
            node.auto_completed_task = autoCompleteTask;
            if (node.type === "process" || node.type === "receiver") {
                node.items.forEach((item) => {
                    delete item.signature;
                    delete item.quotationMark;
                });
            }
        });

        ctrl.state = "update";
        ctrl.currentDepartment = item.department ? item.department : 'all';
        $rootScope.statusValue.generate(ctrl._ctrlName, "Workflow", "update");
        ctrl._update_value = {
            _id: item._id,
            title: item.title,
            key: item.key,
            flow,
            department_scope: item.department ? 'specific' : 'all',
            department: item.department ? item.department : '',
            is_personal: item.is_personal,
            is_department: item.is_department,
            competence: item.competence,
            job: item.job,
            role: item.role,
            tab: "general",
            files,
            file_type: fileType,
            customTemplate,
            allow_appendix: allowAppendix,
            allow_choose_destination: allowChooseDestination,
            templateTags: item.templateTags || [],
            fee: item.fee,
            estimate_time: item.estimate_time,
            receive_time: item.receive_time,
        };
    }

    function parseCustomTemplate_update_service(file) {
        return function () {
            var dfd = $q.defer();
            workflow_service.parseCustomTemplate(file).then(function (res) {
                ctrl._update_value.templateTags = ((res.data || {}).tags || []).map((tag) => ({ ...tag, type: 'text' }));
                clearTagAssociations(ctrl._update_value);
                dfd.resolve(true);
            }, function (err) {
                alert('Template không đúng định dạng');
                ctrl.removeTemplate();
                dfd.reject(err);
            });
            return dfd.promise;
        }
    };

    ctrl.parseCustomTemplate_update = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "parseCustomTemplate_update", parseCustomTemplate_update_service(file));
    }

    ctrl.removeCustomTemplate_update = function () {
        ctrl._update_value.customTemplate = undefined;
        ctrl._update_value.templateTags = [];
    };

    ctrl.handleSelectFileType_update = function () {
        ctrl._update_value.files = [];
        ctrl._update_value.customTemplate = undefined;
        ctrl._update_value.templateTags = [];

        // remove in flow
        ctrl._update_value.flow.forEach(node => {
            node.items.forEach(item => {
                delete item.signature;
                delete item.quotationMark;
            });
        });
    };

    ctrl.addFileUploadTag_update = function () {
        ctrl._update_value.templateTags.push({
            name: ``,
            label: '',
            type: 'signature',
        });
    };

    ctrl.removeFileUploadTag_update = function ($index) {
        // remove in flow
        ctrl._update_value.flow.forEach(node => {
            node.items.forEach(item => {
                if (item.signature === ctrl._update_value.templateTags[$index].name) {
                    delete item.signature;
                }
                if (item.quotationMark === ctrl._update_value.templateTags[$index].name) {
                    delete item.quotationMark;
                }
            });
        });

        // remove tag
        ctrl._update_value.templateTags.splice($index, 1);
    };

    ctrl.onClickWorkflowTab_update = function (generalForm) {
        if (!generalForm.$invalid && !ctrl.isInvalidOtherFields_update()) {
            ctrl._update_value.tab = 'workflow';
        }
    };

    ctrl.isInvalidOtherFields_update = function () {
        return ctrl._update_value && ctrl._update_value.file_type === 'custom_template' && !ctrl._update_value.customTemplate;
    };

    function update_service() {
        const tmpFiles = ctrl._update_value.file_type === 'custom_template' ? [ctrl._update_value.customTemplate] : ctrl._update_value.files;
        // unchanged files
        const templateFiles = tmpFiles
            .filter((file) => !file.file)
            .map((file) => ({ name: file.origName }));
        // new files
        const files = tmpFiles.filter((file) => !!file.file);

        var dfd = $q.defer();
        workflow_service.update(
            ctrl._update_value._id,
            ctrl._update_value.title,
            ctrl._update_value.key,
            ctrl._update_value.flow,
            ctrl._update_value.department_scope,
            ctrl._update_value.department,
            ctrl._update_value.is_personal,
            ctrl._update_value.is_department,
            ctrl._update_value.competence,
            ctrl._update_value.job,
            ctrl._update_value.role,
            ctrl._update_value.file_type,
            ctrl._update_value.allow_appendix,
            ctrl._update_value.allow_choose_destination,
            templateFiles,
            files,
            ctrl._update_value.templateTags,
            ctrl._update_value.fee,
            ctrl._update_value.estimate_time,
            ctrl._update_value.receive_time,
            ).then(function () {
                $timeout(function () {
                    $rootScope.statusValue.generate(ctrl._ctrlName, "Workflow", "update");
                    $("#modal_Workflow_Update").modal("hide");
                }, 1000);
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "update", update_service);
    }

    /**delete */
    ctrl.prepareDelete = function (item) {
        ctrl.currentDepartment = item.department;
        $rootScope.statusValue.generate(ctrl._ctrlName, "Workflow", "delete");
        ctrl._delete_value = {
            _id: item._id,
            title: item.title
        };
    }

    function delete_service() {
        var dfd = $q.defer();
        workflow_service.delete(
            ctrl._delete_value._id).then(function () {
                $("#modal_Workflow_Delete").modal("hide");
                
                dfd.resolve(true);
                dfd = undefined;
                ctrl.refreshData();
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Workflow", "delete", delete_service);
    }

    ctrl.removeFile_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.files) {
            if (ctrl._insert_value.files[i].name != item.name) {
                temp.push(ctrl._insert_value.files[i]);
            }
        }
        ctrl._insert_value.files = angular.copy(temp);
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

}]);
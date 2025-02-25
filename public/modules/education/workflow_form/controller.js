
myApp.registerCtrl('workflow_form_controller', ['workflow_form_service', '$q', '$rootScope', '$filter', function (workflow_form_service, $q, $rootScope, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "WorkflowForm", action: "load" },
        { name: "WorkflowForm", action: "insert" },
        { name: "WorkflowForm", action: "update" },
        { name: "WorkflowForm", action: "delete" },
        { name: "WorkflowForm", action: "count" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "workflow_form_controller";
        ctrl._notyetInit = true;
        ctrl._searchByKeyToFilterData = "";

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/education/workflow_form/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/education/workflow_form/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/education/workflow_form/views/delete_modal.html";
        ctrl._urlNodeModal = FrontendDomain + "/modules/education/workflow_form/views/node_modal.html";
        ctrl._urlNode_insertModal = FrontendDomain + "/modules/education/workflow_form/views/node_insert_modal.html";
        ctrl._urlNode_updateModal = FrontendDomain + "/modules/education/workflow_form/views/node_update_modal.html";

        ctrl.AdministrativeProceduresType_Config = {
            master_key: "administrative_procedures_type",
            load_details_column: "value"
        };

        ctrl.AdministrativeProcedureFees_Config = {
            master_key: "administrative_procedure_fees",
            load_details_column: "value"
        };

        ctrl.Type = [
            { title: { "vi-VN": "Đăng ký", "en-US": "Register" }, key: "register" },
            { title: { "vi-VN": "Phê duyệt", "en-US": "Approval" }, key: "approve" },
            { title: { "vi-VN": "Thu phí", "en-US": "Fee" }, key: "fee" },
            { title: { "vi-VN": "Xử lý văn bản", "en-US": "Word Processing" }, key: "process" },
        ];

        ctrl.TagTypeOptions = [
            {
                id: 'student_information',
                title: { 'vi-VN': 'Thông tin sinh viên', 'en-US': 'Studen Information' }
            }
        ]

        ctrl.StudentOptions = [
            {
                id: 'full_name',
                title: { 'vi-VN': 'Họ và tên', 'en-US': 'Full name' }
            },
            {
                id: 'date_of_birth',
                title: { 'vi-VN': 'Ngày, tháng, năm sinh', 'en-US': 'Date of birth' }
            },
            {
                id: 'class',
                title: { 'vi-VN': 'Lớp', 'en-US': 'Class' }
            },
            {
                id: 'major',
                title: { 'vi-VN': 'Ngành học', 'en-US': 'Major' }
            },
            {
                id: 'school_year',
                title: { 'vi-VN': 'Niên khóa', 'en-US': 'School year' }
            },
            {
                id: 'student_code',
                title: { 'vi-VN': 'MSSV', 'en-US': 'Student code' }
            },
            {
                id: 'educational_system',
                title: { 'vi-VN': 'Hệ đào tạo', 'en-US': 'Educational system' }
            },
            {
                id: 'phone_number',
                title: { 'vi-VN': 'Số điện thoại', 'en-US': 'Phone number' }
            },
        ];

        ctrl.tagTypeOptionsForFileUpload = ctrl.TagTypeOptions.filter(type =>
            ['student_information'].includes(type.id)
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

        ctrl._insert_value = {
            name: "",
            name_en: "",
            title: { "vi-VN": "", "en-US": "" },
            key: "",
            flow: [],
            competence: [],
            job: [],
            role: [],
            tab: "general",
            file_type: 'custom_template',
            allow_appendix: "false",
            customTemplate: undefined,
            templateTags: [],
        };

        ctrl._update_value = {
            name: "Biểu mẫu Vắng thi có phép 2023",
            name_en: "",
            title: { "vi-VN": "", "en-US": "" },
            key: "",
            flow: [],
            competence: [],
            job: [],
            role: [],
            tab: "general",
            file_type: 'custom_template',
            allow_appendix: "false",
            customTemplate: undefined,
            templateTags: [],
        }

        ctrl._delete_value = {
            title: ""
        }
        
        ctrl.itemNote

        ctrl.feeOptions = [
            {
                id: 1,
                title: { 'vi-VN': '0', 'en-US': '0' },
                value: 0
            },
            {
                id: 2,
                title: { 'vi-VN': '10.000', 'en-US': '10.000' },
                value: 10000
            },
            {
                id: 3,
                title: { 'vi-VN': '20.000', 'en-US': '20.000' },
                value: 20000
            }
        ]
    }

    function loadWorkflows() {
        var dfd = $q.defer();
        ctrl.notifys = [];
        workflow_form_service.load().then(function (res) {
            ctrl.workflows = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WorkflowForm", "load", loadWorkflows);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        $q.all(dfdAr);
    }

    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    // insert
    ctrl.prepareInsert = function (val) {
        ctrl.state = 'insert';
    }

    ctrl.insert = function (val) {

    }

    // update
    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        ctrl.state = 'update';
        ctrl._update_value.tab = 'general';
        // console.log( ctrl._update_value)
    }

    ctrl.update = function (val) {

    }

    // delete
    ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "WorkflowForm", "delete");
        ctrl._delete_value = angular.copy(value);
    }


    function deleteWorkflow() {
        var dfd = $q.defer();
        workflow_form_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_workflow_form_delete").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WorkflowForm", "delete", deleteWorkflow);
    }

    // NODE
    ctrl.loadCompetence_details = function (params) {
        let dfd = $q.defer();
        workflow_form_service.loadCompetence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
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

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        workflow_form_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    // node insert

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

        $("#modal_Workflow_Form_Node_Insert").modal("hide");
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
        $("#modal_Workflow_Form_Node_Insert").modal("hide");
    }


    ctrl.prepareAddNode = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "WorkflowForm", "insert");
        var d = new Date();
        ctrl.node = {
            id: d.getTime().toString(),
            type: "one",
            items: []
        };
        ctrl.signatureOptions = getSignatureOptions();
        ctrl.quotationMarkOptions = getQuotationMarkOptions();
    }

    ctrl.addItemNode = function () {
        var d = new Date();
        ctrl.node.items.push({
            id: d.getTime().toString(),
            department: "",
            competence: "",
            role: ""
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
                ctrl._insert_value.flow.push(ctrl.node);
                break;
            case "update":
                ctrl._update_value.flow.push(ctrl.node);
                break;
        }

        $("#modal_Workflow_Form_Node").modal("hide");
    }

    /**node update */
    ctrl.nodesErrorCode_update = function () {
        return ctrl._update_value ? getNodesErrorCode(ctrl._update_value) : '';
    };

    ctrl.setEditNode_update = function () {
        alert(123)
        for (var i in ctrl._update_value.flow) {
            if (ctrl._update_value.flow[i].id == ctrl.indexNodeFlow) {
                ctrl._update_value.flow[i] = ctrl.node;
                break;
            }
        }
        $("#modal_Workflow_Form_Node_Update").modal("hide");
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
        $("#modal_Workflow_Form_Node_Update").modal("hide");
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

    ctrl.chooseQuotationMark_addNode = function (val, id) {
        for (var i in ctrl.node.items) {
            if (ctrl.node.items[i].id === id) {
                ctrl.node.items[i].quotationMark = val.id;
                break;
            }
        }
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
}])
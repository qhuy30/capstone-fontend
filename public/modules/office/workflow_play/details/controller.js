myApp.registerCtrl('sign_details_controller', ['sign_details_service', 'task_service', 'workflow_play_service', '$q', '$rootScope', '$filter', '$scope','$location', function ( sign_details_service, task_service, workflow_play_service, $q, $rootScope, $filter, $scope,$location) {
    /**declare variable */
    const _statusValueSet = [
        { name: "WFP", action: "loadDetails" },
        { name: "WFP", action: "approval" },
        { name: "WFP", action: "reject" },
        { name: "WFP", action: "return" },
        { name: "WFP", action: "resubmit" },
        { name: "WFP", action: "removeAttachment" },
        { name: "WFP", action: "pushAttachment" },
        { name: "WFP", action: "removeRelatedFile" },
        { name: "WFP", action: "pushRelatedFile" },
        { name: "WFP", action: "signAFile" },
        { name: "WFP", action: "transformSign" },
        { name: "WFP", action: "signOther" },
        { name: "WFP", action: "complete" },
        { name: "WFP", action: "received" },
        { name: "WFP", action: "additional_document" },
        { name: "ODB", action: "insert" },
        { name: "OD", action: "insert_do" },
        { name: "ODB", action: "update" },
        { name: "ODB", action: "reset" },
        { name: "ODB", action: "release" },
        { name: "ODB", action: "updateRelease" },
        { name: "ODB", action: "getNumber" },
        { name: "ODB", action: "updateReferences"},
        { name: "waiting_storage", action: "insert" },
        { name: "task", action: "loadDetails" },
    ];
    var ctrl = this;
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'signing-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
        
    };

    ctrl.code = getCode();

    var idEditor = "insertODB_excerpt";
    const Expiration_Date_Error_Msg = $filter('l')('ExpirationDateErrorMsg');

    var today = new Date();
    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const WORKFLOW_PLAY_RULE = {
        DEPARTMENT_LEADER_MANAGE: "Office.Signing.Department_Leader_Manage",
        LEADER_MANAGE: "Office.Signing.Leader_Manage",
        USE: "Office.Signing.Use",
    };

    const RULE_DISPATCH = {
        USE:"Office.DispatchOutgoing.Use",
        MANAGER:"OfficeDG.Manager",
        RELEASE:"Office.DispatchOutgoing.Release",
        VIEW_ODB:"Office.DispatchOutgoing.ViewODB",
        EDIT_ODB:"Office.DispatchOutgoing.EditODB"
    }
    
    const WORKFLOW_PLAY_STATUS = {
        PENDING: "Pending",
        REJECTED: "Rejected",
        SAVED_ODB: "SaveODB",
        APPROVED: "Approved",
        RETURNED: "Returned",
        COMPLETED: "Completed",
        EXPLOITED_DOCUMENT: "ExploitedDocument"
    };

    const NODE_TYPE = {
        ONE: "one",
        ALL: "all",
        PROCESS: "process",
        RECEIVER: "receiver"
    };
    
    /** init variable */
    {
        ctrl._ctrlName = "sign_details_controller";

        ctrl.could_release = false;


        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };
        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };

        ctrl.Type = [
            { title: { "vi-VN": "Một người duyệt cho tất cả", "en-US": "One for all" }, key: NODE_TYPE.ONE },
            { title: { "vi-VN": "Đồng thuận", "en-US": "All Approval" }, key: NODE_TYPE.ALL },
            { title: { "vi-VN": "Xử lý văn bản", "en-US": "Word Processing" }, key: NODE_TYPE.PROCESS },
            { title: { "vi-VN": "Nhận thông báo xử lý nghiệp vụ", "en-US": "Business Process Notification" }, key: NODE_TYPE.RECEIVER }
        ];

        ctrl.OutgoingDispatchBook_Config = {
            master_key: "outgoing_dispatch_book",
            load_details_column: "value"
        };

        
    const WORKFLOW_PLAY_RULE = {
        DEPARTMENT_LEADER_MANAGE: "Office.Signing.Department_Leader_Manage",
        LEADER_MANAGE: "Office.Signing.Leader_Manage",
        USE: "Office.Signing.Use",
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

        ctrl._additional_value = {};

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
        ctrl.parentTaskDetails = {};
        ctrl.ODBreferences = {};
        ctrl.outgoing_dispatch_references = {};
        ctrl._insert_to_storage_value = {};
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/workflow_play/details/views/store-briefcase-modal.html";
        ctrl._urlForwardModal = FrontendDomain + "/modules/office/workflow_play/details/views/forward_modal.html";
        ctrl._urlReleaseModal = FrontendDomain + "/modules/office/workflow_play/details/views/confirm_release_modal.html";
        // Add modal insert dispatch outgoing
        ctrl._urlInsertModalDispatchOutgoing = FrontendDomain + "/modules/office/workflow_play/details/views/modal_dispatch_outgoingWFP.html";
        ctrl._urlAdditionalDocumentModal = FrontendDomain + "/modules/office/workflow_play/directives/wfp_additional_document_modal.html";

        ctrl.department_detail = {};
        ctrl.applyNewStorageFlow = false;
        ctrl.function_apply_suggestions = ['signing']
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

    ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
        let today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isInsert) {
            return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
        } else {
            return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
        }
    }

    /**insert */
    function getNumber(odb_book) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.get_number(odb_book).then(function (res) {
                
                dfd.resolve(res.data.number);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.chooseDocumentDate_insert = function (val) {
        ctrl._insert_value.document_date = val.getTime();
    }

    ctrl.pickDocumentType_insert = function (val) {
        ctrl._insert_value.type = val.value;
    }

    ctrl.removeOutgoingDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.outgoing_documents) {
            if (ctrl._insert_value.outgoing_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.outgoing_documents[i]);
            }
        }
        ctrl._insert_value.outgoing_documents = angular.copy(temp);
    }

    ctrl.removeAttachDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.attach_documents) {
            if (ctrl._insert_value.attach_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.attach_documents[i]);
            }
        }
        ctrl._insert_value.attach_documents = angular.copy(temp);
    }

    ctrl.pickUserAndDepartment_insert = function (val) {
        ctrl._insert_value.userAndDepartment = val;
    }

    ctrl.choosePriority_insert = function (val) {
        ctrl._insert_value.priority = val.value;
    }

    ctrl.chooseTransferDate_insert = function (val) {
        ctrl._insert_value.transfer_date = val.getTime();
    }

    ctrl.chooseExpirationDate_insert = function (val) {
        ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
        ctrl._insert_value.expiration_date = val ? val.getTime() : null;
    }

    ctrl.chooseReceiveMethod_insert = function (val) {
        ctrl._insert_value.send_method = val.value;
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


    ctrl.transformSignOther = function (val) {
        ctrl._insert_value.transformSignOther = val;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "transformSign", transform_sign_service);

    }

    function transform_sign_service() {
        var dfd = $q.defer();
        sign_details_service.transformSignOther(
            ctrl.thisId,
            ctrl._insert_value.transformSignOther,
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insertODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "insert", insert_ODB_service);
    }

    function insert_ODB_service() {
        var dfd = $q.defer();
        const [outgoing_documents, old_outgoing_documents] = ctrl._insert_value.outgoing_documents.reduce(([newDocuments, oldDocuments], currentValue) => {
            if (currentValue.content) {
                newDocuments.push(currentValue);
            } else {
                oldDocuments.push({ name: currentValue.name });
            }
            return [newDocuments, oldDocuments];
        }, [[], []]);

        const [attach_documents, old_attach_documents] = ctrl._insert_value.attach_documents.reduce(([newDocuments, oldDocuments], currentValue) => {
            if (currentValue.content) {
                newDocuments.push(currentValue);
            } else {
                oldDocuments.push({ name: currentValue.name });
            }
            return [newDocuments, oldDocuments];
        }, [[], []]);

        if (ctrl.Item.status === 'SaveODB') {
            ctrl._insert_value.outgoing_dispatch_id = ctrl.odbDetail._id;
        } else {
            ctrl._insert_value.outgoing_dispatch_id = "";
        }

        sign_details_service.insertODB(
            ctrl._insert_value.outgoing_dispatch_book,
            ctrl.thisId,
            ctrl._insert_value.document_date,
            outgoing_documents,
            attach_documents,
            ctrl._insert_value.excerpt,
            ctrl._insert_value.signers,
            ctrl.Item.department,
            ctrl._insert_value.userAndDepartment.user,
            ctrl._insert_value.userAndDepartment.department,
            ctrl._insert_value.document_quantity,
            ctrl._insert_value.transfer_date,
            ctrl._insert_value.note,
            ctrl._insert_value.expiration_date,
            ctrl._insert_value.priority,
            ctrl._insert_value.outgoing_dispatch_id,
            old_outgoing_documents,
            old_attach_documents,
            ctrl.Item.parents || [],
            {
                object: "workflow_play",
                code: ctrl.Item.code,
                id: ctrl.Item._id
            },
            ctrl._insert_value.code,
            ctrl._insert_value.orderNumber
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    // INSERT TO STORAGE
    ctrl.prepareInsertToStorage = function () {
        var currentYear = new Date().getFullYear();
        ctrl._insert_to_storage_value = {
            title: ctrl.odbDetail.title,
            organ_id: '000.00.45.429',
            file_notation: ``,
            language: "",
            rights: "",
            description: "",
            year: currentYear,
            maintenance_time: {
                amount: 1,
                unit: "day",
            },
            reference: [
                {
                    type: "OutgoingDispatch",
                    id: ctrl.odbDetail._id,
                },
            ],
        };
    };

    function insertStorage_service() {
        var dfd = $q.defer();
        sign_details_service.insertToStorage(
            ctrl._insert_to_storage_value.title,
            ctrl._insert_to_storage_value.organ_id,
            ctrl._insert_to_storage_value.file_notation,
            ctrl._insert_to_storage_value.language,
            ctrl._insert_to_storage_value.rights,
            ctrl._insert_to_storage_value.year,
            ctrl._insert_to_storage_value.description,
            ctrl._insert_to_storage_value.maintenance_time,
            ctrl._insert_to_storage_value.reference,
        ).then(function () {
            $(".workflow-play-detail #modal_insert_storage").modal("hide");
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insertToStorage = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "insert", insertStorage_service);
    }

    ctrl.isWFPCompleted = function () {
        return ctrl.Item.status === 'Completed' || ctrl.isOutgoingDispatchReleased();
    }

    ctrl.isProcessSaveODB = function () {
        if(ctrl.Item.node == -1 || ctrl.Item.node == 0){
            return false;
        } 
        if(ctrl.Item.status === 'SaveODB'){
            return false;
        }
        if(ctrl.Item.flow[ctrl.Item.node -1].type == 'process'){
            return false;
        }

        if(ctrl.Item.flow[ctrl.Item.node -1].type == 'process'){
            return false;
        }

        return true;
    }

    ctrl.isShowCreatedProcessSaveODB = function () {
        if( $rootScope.logininfo.username == ctrl.Item.username && ctrl.Item.status === 'SaveODB' && ctrl.Item.node == -1){
            return false;
        } 
        return true;
    }
    ctrl.isOutgoingDispatchReleased = function () {
        return ctrl.Item.outgoing_dispatch && ['Released', 'SaveBriefCase'].includes(ctrl.Item.outgoing_dispatch.status);
    }

    ctrl.archiveProfileCompleted = function () {
        return ctrl.Item.outgoing_dispatch && ['Released'].includes(ctrl.Item.outgoing_dispatch.status) && $rootScope.logininfo.username == ctrl.Item.username;
    }
    ctrl.searchReference = function (search) {
        if(search.search == undefined){
            search.search = ' ';
        }
        var dfd = $q.defer();
        sign_details_service.searchReference(search.search)
            .then(({ data }) => {
                dfd.resolve(data);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.chooseReference = function (item) {
        ctrl.ODBreferences = item.map(data =>{
            return {
                ...data,
                isDefault: false
            }
        });
    }

    ctrl.isShowWFPDetails = function () {
        return !(ctrl.isWFPCompleted() && ctrl.applyNewStorageFlow);
    }

    
    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "loadDetails", loadDetails_service);
    }
    ctrl.loadParentTaskDetails = function () {
    var dfd = $q.defer();
    
    ctrl.loadDetails().then(function () {
        if (ctrl.Item?.parent?.code && ctrl.Item?.parent?.object == "task") {
            return task_service.loadDetails(undefined, ctrl.Item.parent.code)
                .then(function (parentTaskDetails) {

                    ctrl.parentTask = parentTaskDetails.data;

                    dfd.resolve({
                        mainDetails: ctrl.Item,
                        parentTaskDetails: ctrl.parentTask,
                    });
                });
            } else {
                dfd.resolve({ mainDetails: ctrl.Item });
            }
        }),function (err) {
            console.error("Error loading details:", err);
            dfd.reject(err);
        };

        return dfd.promise;
    };

    init();
    function init() {
        if ($filter('hasRule')(RULE_DISPATCH.RELEASE)) {
            ctrl.could_release = true;
        }

        const dfdAr = [load_employee_detail()];
        ctrl.relatedFiles = [];

        const loadDetailsOrRedirect = (id, redirectUrl) => {
            if (id && id.length === 24) {
                dfdAr.push(ctrl.loadDetails());
            } else {
                redirectUrl = urlNotFoundPage;
            }
        };


        if (ctrl.code) {
            dfdAr.push(ctrl.loadDetails());
        } else if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'signing-details') {
            ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
            dfdAr.push(loadDetailsOrRedirect(ctrl.thisId, $rootScope.detailsInfo.urlPage));
        } else {
            ctrl.thisId = $rootScope.currentPath.split("?")[1];
            dfdAr.push(loadDetailsOrRedirect(ctrl.thisId, $rootScope.urlPage));
        }
        
        ctrl.loadParentTaskDetails().then(function (details) {
            ctrl.mainDetails = details.mainDetails;
            ctrl.parentTaskDetails = details.parentTaskDetails;
        }).catch(function (err) {
            console.error("Failed to load parent task details:", err);
        });
    
    
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
    
        const applyNewStorageFlowSetting = $rootScope.Settings.find(setting => setting.key === "applyNewStorageFlow");
        if (applyNewStorageFlowSetting) {
            ctrl.applyNewStorageFlow = applyNewStorageFlowSetting.value;
        }
    
        $q.all(dfdAr).then(
            () => {},
            (err) => {
                console.log(err);
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

    function setCodeOutgoing(orderNumber){
        ctrl.Item.code_old = ctrl.Item.code;
        ctrl.Item.code = orderNumber;
        let template  = angular.copy(ctrl.currentOutGoingBook.number_and_notation);
        let ordernumber = angular.copy(orderNumber);
        $q.all([
            sign_details_service.loadDepartmentDetails(ctrl.Item.department),
            sign_details_service.getDerectoryDetails(ctrl.DocumentType_Config.load_details_column,ctrl.Item.document_type,ctrl.DocumentType_Config.master_key )
        ]).then(function([departmentDetails,documentTypeDetails]){
            let documenttype = documentTypeDetails.data.abbreviation;
            let department = departmentDetails.data.abbreviation;
            let theCode = template.replace(/{{ordernumber}}/g, ordernumber)
            .replace(/{{department}}/g, department).replace(/{{documenttype}}/g, documenttype);
            ctrl._insert_value_wfp.symbol_number = theCode;
            ctrl._insert_value_wfp.number = ordernumber;
        },function(err){console.log(err);});


    }

    function setOutgoingNumber() {
        let dfd = $q.defer();
        getNumber(ctrl._insert_value_wfp.do_code)().then(function(orderNumber){
            ctrl._insert_value_wfp.orderNumber = orderNumber;
            dfd.resolve(true);
        },function(err){console.log(err);});
        return dfd.promise;
    }

    function autoSetOutGoingBook(odbRes) {
        const odbs = odbRes.data || [];
        if (odbs.length) {
            const matchOdb = odbs.find(odb => odb.document_type.indexOf(ctrl.Item.document_type) !== -1 && odb.year === new Date().getFullYear());
            if (matchOdb) {
                ctrl.currentOutGoingBook = matchOdb;
                ctrl._insert_value.outgoing_dispatch_book = matchOdb.value;
            }
        }
    }
    function initDataForProcessStep(odbRes) {
        autoSetOutGoingBook(odbRes);
        if (ctrl._insert_value.outgoing_dispatch_book) {
            setOutgoingNumber().then(function(){
                setCodeOutgoing(ctrl._insert_value.orderNumber);
            },function(){})
            
        }
    }

    
    function getWorkflowPlayPermissionProperties(item) {
        if (!item) return {}
        let allowSign = false;
        let allowReject = false;
        let allowReturn = false;
        let allowApprove = false;

        const nodeType = ctrl.getNodeType();

        const isLeaderAllowMarkAsComplete =
          $filter("checkRuleDepartmentRadio")(
            item.department,
            WORKFLOW_PLAY_RULE.LEADER_MANAGE
              )
          
        const isDepartmentLeaderAllowMarkAsComplete =
          $filter("checkRuleDepartmentRadio")(
            item.department,
            WORKFLOW_PLAY_RULE.DEPARTMENT_LEADER_MANAGE
            )
        
     allowSign = isDepartmentLeaderAllowMarkAsComplete;
        
        //document type ==>
        if (true) { }
        
        // node ==>
        allowApprove =
          ![NODE_TYPE.PROCESS].includes(nodeType) &&
          ctrl.status == "pending" &&
          ctrl.Item.status !== "Returned" &&
          !ctrl.isSignOther;

        allowSign =
          ![NODE_TYPE.PROCESS].includes(nodeType) &&
          ctrl.status == "pending" &&
          ctrl.Item.status !== "Returned" &&
          !ctrl.isSignOther;
        
        // status
        if (![WORKFLOW_PLAY_STATUS.PENDING, WORKFLOW_PLAY_STATUS.EXPLOITED_DOCUMENT].includes(item.status)) {
            allowSign = false
        }  
         
            
  
        return {
            allowSign,
            allowReject,
            allowReturn,
            allowApprove
        };
      }
  

    function loadDetails_service() {
        var dfd = $q.defer();
        ctrl.isLoadSuccess = false;
        ctrl.task = [];
        ctrl.signer = [];
        ctrl.signerStr = '';
        ctrl.mergedRelatedFiles = [];
        $q.all([
            sign_details_service.loadDetails(ctrl.thisId, ctrl.code),
            sign_details_service.loadDirectories(ctrl.OutgoingDispatchBook_Config.master_key),
        ]).then(function ([res, odbRes]) {

            // ctrl.Item = {...res.data};
            ctrl.Item = {
                ...res.data,
                ...getPermissionProperties(res.data)
            };
            dfd.resolve(true);

            if (ctrl.Item.outgoing_dispatch && ctrl.Item.outgoing_dispatch.references) {
                ctrl.outgoing_dispatch_references = ctrl.Item.outgoing_dispatch.references;
                ctrl.ODBreferences = ctrl.outgoing_dispatch_references.filter(reference => reference.isDefault === false);
            }             
            ctrl.thisId = ctrl.Item._id;
            ctrl.breadcrumb = [
                ...(ctrl.Item.parents || []).reverse(),
                { object: 'workflow_play', code: ctrl.Item.code },
            ];
            ctrl.task = res.data.task || [];
            ctrl.display_status = ctrl.Item.status;
            ctrl._insert_value.type = res.data.document_type;
            ctrl._insert_value.title = res.data.title;




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
            ctrl.outgoing_dispatch = res.data.outgoing_dispatch || {};
            if (ctrl.Item.status === 'SaveODB') {
                ctrl.isProcess = true;
                ctrl.odbDetail = res.data.outgoing_dispatch || {};
                ctrl._insert_value = ctrl.odbDetail;
                ctrl.status = 'SaveODB';
                ctrl._insert_value.userAndDepartment = {
                    user: ctrl.odbDetail.receiver_notification,
                    department: ctrl.odbDetail.department_notification
                };
            } else {
                ctrl._insert_value.userAndDepartment = ctrl.Item.user_and_department_destination || {};
            }

            ctrl.Item = {...ctrl.Item, ...getWorkflowPlayPermissionProperties(ctrl.Item)};
            ctrl.Item.workflow_type = ctrl.Item?.flow_info?.title['en-US'] 


            // if this step is process step
            if (ctrl.isProcess) {
                initDataForProcessStep(odbRes);
            }

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


  

    $scope.$watch(getCode, function (newVal) {
        if (newVal && newVal !== ctrl.code) {
            ctrl.code = newVal;
            ctrl.loadDetails();
        }
    });

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
        if (ctrl.Item.status !== 'Pending') {
            return false;
        }
    
        const currentNode = getCurrentNode();
        if (!currentNode) {
            return false;
        }
    
        const flowItems = currentNode.items || [];
        const playNow = ctrl.Item.play_now.find(p => p.username === $rootScope.logininfo.username);
        if (!playNow) {
            return false;
        }
    
        const playNowItems = flowItems.filter(item => playNow.items.includes(item.id));
        const isNeedSign = playNowItems.some(item => item.signature || item.quotationMark);
    
        if (!isNeedSign) {
            return false;
        }
    
        return playNowItems.some(item => {
            const isSignedSignature = ctrl.Item.signatureTags.some(tag => tag.name === item.signature && tag.isSigned);
            const isSignedQuotationMark = ctrl.Item.signatureTags.some(tag => tag.name === item.quotationMark && tag.isSigned);
            return !isSignedSignature && !isSignedQuotationMark;
        });
    };

    /**approval */
    // function approval_service() {
    //     var dfd = $q.defer();
    //     sign_details_service.approval(ctrl.thisId, ctrl.comment, ctrl.note, ctrl.relatedFiles).then(function (res) {
    //         ctrl.status = "approved";
    //         dfd.resolve(true);
    //         ctrl.loadDetails().then(function (data) {
    //             const item = ctrl.Item
    //             // Create Head task for another department when complete approve
    //             if (item.status === 'Approved' && item?.transfer_ticket?.type === 'Assign') {
    //                 const fromDate = new Date(
    //                     today.getFullYear(),
    //                     today.getMonth(),
    //                     today.getDate(),
    //                     0,
    //                     0,
    //                     0
    //                   );
    //                   const toDate = new Date(
    //                     today.getFullYear(),
    //                     today.getMonth(),
    //                     today.getDate(),
    //                     23,
    //                     59,
    //                     59
    //                 );
    //                 task_service.insert(
    //                     [],
    //                     item.title,
    //                     item.department,
    //                     '',
    //                     [],
    //                     [],
    //                     [],
    //                     [$rootScope.logininfo.username],
    //                     fromDate.getTime(),
    //                     toDate.getTime(),
    //                     undefined,
    //                     undefined,
    //                     3,
    //                     1,
    //                     undefined,
    //                     undefined,
    //                     undefined,
    //                     $rootScope.logininfo.data.department,
    //                     undefined,
    //                     "HeadTask",
    //                     [],
    //                     false,
    //                     [],
    //                     {},
    //                     2,
    //                     false,
    //                     1,
    //                     'day',
    //                     false,
    //                     toDate.getTime(),
    //                     undefined,
    //                 ).then(function (res) { 

    //                     const parents = ctrl.Item.parents
    //                     parents.push({
    //                             id: res.data.id,
    //                             code: res.data.code,
    //                             department: res.data?.department?.id,
    //                             type: 'Receive'
    //                     })
                        
    //                     workflow_play_service
    //                     .update(
    //                         ctrl.Item._id,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                         parents,
    //                         undefined,
    //                         undefined,
    //                         undefined ,  
    //                         undefined ,
    //                         undefined
    //                     )

    //                 });

                    
    //             }
    //          }).catch(function () { });
    //         res = undefined;
    //         dfd = undefined;
    //     }, function (err) {
    //         dfd.reject(err);
    //         err = undefined;
    //     });
    //     return dfd.promise;

    // }

    function approval_service() {
        var dfd = $q.defer();
        sign_details_service.approval(ctrl.thisId, ctrl.comment, ctrl.note, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "approved";
            dfd.resolve(true);
            ctrl.loadDetails().then(function (data) {
                const item = ctrl.Item;
                
                if (item.status === 'Approved' && item?.transfer_ticket?.type === 'Assign') {
                    const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                    const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
                    getDepartmentNameById(item.department).then(function(nameDepartment) {
                        const title = 'Công việc' + ' - ' +  item.title + ' - ' + nameDepartment
                        task_service.insert(
                            [],
                            title,
                            nameDepartment, 
                            '',
                            [],
                            [],
                            [],
                            [$rootScope.logininfo.username],
                            fromDate.getTime(),
                            toDate.getTime(),
                            undefined,
                            undefined,
                            3,
                            1,
                            undefined,
                            undefined,
                            undefined,
                            $rootScope.logininfo.data.department,
                            undefined,
                            "HeadTask",
                            [],
                            false,
                            [],
                            {},
                            2,
                            false,
                            1,
                            'day',
                            false,
                            toDate.getTime(),
                            undefined
                        ).then(function (res) {
                            const parents = ctrl.Item.parents;
                            parents.push({
                                id: res.data.id,
                                code: res.data.code,
                                department: res.data?.department?.id,
                                type: 'Receive'
                            });
    
                            workflow_play_service.update(
                                ctrl.Item._id,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                parents,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined
                            );
                        });
                    });
                }
            }).catch(function () { });
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    
    function getDepartmentNameById(departmentId) {
        return sign_details_service.loadDepartmentDetails(departmentId)
            .then(function(response) {
                return response.data.title_search;
            })
            .catch(function(error) {
                console.error("Error retrieving department details:", error);
                return ''; 
            });
    }
    

    ctrl.approval = function (params) {
        ctrl.note = params;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "approval", approval_service);
    }

    /**approval */
    function complete_exploit_document_service() {
        var dfd = $q.defer();
        sign_details_service.complete(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "completed";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.completeDocument = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "complete", complete_exploit_document_service);
    }

    ctrl.receivedNotification = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "received", received_exploit_document_service);
    }

    /**approval */
    function received_exploit_document_service() {
        var dfd = $q.defer();
        sign_details_service.receiver(ctrl.thisId, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "received";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function sign_other_service() {
        var dfd = $q.defer();
        sign_details_service.signOther(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "approved";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.signOther = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "signOther", sign_other_service);
    }

    /**reject */

    function reject_service() {
        var dfd = $q.defer();
        sign_details_service.reject(ctrl.thisId, ctrl.comment,ctrl.note, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "rejected";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.reject = function (params) {
        ctrl.note = params;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "reject", reject_service);
    }

    /**return */

    function return_service() {
        var dfd = $q.defer();
        sign_details_service.return(ctrl.thisId, ctrl.comment,ctrl.note, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "returned";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.return = function (params) {
        ctrl.note = params;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "return", return_service);
    }

    /**resubmit */

    function resubmit_service() {
        var dfd = $q.defer();
        sign_details_service.resubmit(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "resubmitted";
            ctrl.loadDetails();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.resubmit = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "resubmit", resubmit_service);
    }

    /**remove file */
    function removeAttachment_service(filename) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.removeAttachment(ctrl.Item._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl.Item.attachment) {
                    if (ctrl.Item.attachment[i].name !== filename) {
                        temp.push(ctrl.Item.attachment[i]);
                    }
                }
                ctrl.Item.attachment = temp;
                temp = undefined;
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.removeAttachment = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "removeAttachment", removeAttachment_service(item.name));
    }

    function removeRelatedFile_service(filename) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.removeRelatedFile(ctrl.Item._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl.Item.relatedfile) {
                    if (ctrl.Item.relatedfile[i].name !== filename) {
                        temp.push(ctrl.Item.relatedfile[i]);
                    }
                }
                ctrl.Item.relatedfile = temp;
                temp = undefined;
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.removeRelatedFile = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "removeRelatedFile", removeRelatedFile_service(item.name));
    }


    /** add file*/

    function pushAttachment_service(file) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.pushAttachment(file, ctrl.Item._id).then(function (res) {
                ctrl.Item.attachment.push(res.data);
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushAttachment = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "pushAttachment", pushAttachment_service(file));
    }


    function pushRelatedFile_service(file) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.pushRelatedFile(file, ctrl.Item._id).then(function (res) {
                ctrl.Item.relatedfile.push(res.data);
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushRelatedFile = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "pushRelatedFile", pushRelatedFile_service(file));
    }


    /**sign a file */
    function signAFile_service(params) {
        let fileName = params.name;
        return function () {
            var dfd = $q.defer();
            sign_details_service.signAFile(ctrl.Item._id, fileName).then(function (res) {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    function signAndApproval_service(params) {
        let fileName = params.name; 
        
        var dfd = $q.defer();
        dfd.resolve(true)
        
        sign_details_service.signAFile(ctrl.Item._id, fileName).then(function () {
            sign_details_service.approval(ctrl.thisId, ctrl.comment, ctrl.note, ctrl.relatedFiles).then(function () {
                ctrl.status = "approved";
    
                ctrl.loadDetails().then(function () {
                    const item = ctrl.Item;
                    if (item.status === 'Approved' && item?.transfer_ticket?.type === 'Assign') {
                        const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                        const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
                        getDepartmentNameById(item.department).then(function (nameDepartment) {
                            
                                
                            const title = 'Công việc - ' + item.title + ' - ' + nameDepartment;
    
                            task_service.insert(
                                [],
                                title,
                                nameDepartment,
                                '',
                                [],
                                [],
                                [],
                                [$rootScope.logininfo.username],
                                fromDate.getTime(),
                                toDate.getTime(),
                                undefined,
                                undefined,
                                3,
                                1,
                                undefined,
                                undefined,
                                undefined,
                                $rootScope.logininfo.data.department,
                                undefined,
                                "HeadTask",
                                [],
                                false,
                                [],
                                {},
                                2,
                                false,
                                1,
                                'day',
                                false,
                                toDate.getTime(),
                                undefined
                            ).then(function (res) {
                                const parents = ctrl.Item.parents;
                                parents.push({
                                    id: res.data.id,
                                    code: res.data.code,
                                    department: res.data?.department?.id,
                                    type: 'Receive'
                                });
    
                                workflow_play_service.update(
                                    ctrl.Item._id,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    parents,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined
                                );
    
                                dfd.resolve(true); 
                            });
                            
                        });
                    } else {
                        dfd.resolve(true); 
                    }
                }).catch(function () {
                    dfd.reject("Error loading details.");
                });
            }, function (err) {
                dfd.reject(err); 
            });
        }, function (err) {
            dfd.reject(err); 
        });
    
        return dfd.promise;
    }

    ctrl.signAFileAndApproval = function (params) {
        ctrl.note = params[1]
        const filename = params[0]
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "signAFile", ()=>signAndApproval_service(filename));
    }
    ctrl.signAFile = function (filename) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "signAFile", ()=>signAFile_service(filename));
    }

    ctrl.handleUpdateWFPSuccess = function () {
        reset();
        ctrl.loadDetails();
    };

    //reset data
    ctrl.resetData = function () {
        ctrl._update_value.odb_book = "";
        ctrl._update_value.priority = ""
    }

    //update release info
    ctrl.updateRelease = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "updateRelease", update_release_service);
    }

    function update_release_service() {
        var dfd = $q.defer();
        sign_details_service.updateReleaseInfo(
            ctrl.odbDetail._id,
            ctrl._update_value.notification_departments,
            ctrl._update_value.notification_recipients).then(function () {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            })
        return dfd.promise;
    }

    //update ODB
    ctrl.updateODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "update", updateODB_service);
    }
    function updateODB_service() {
        var dfd = $q.defer();
        sign_details_service.updateODB(
            ctrl._update_value._id,
            ctrl._update_value.odb_book,
            ctrl._update_value.signed_date,
            ctrl._update_value.type,
            $("#" + idEditor_update).summernote('code'),
            ctrl._update_value.expiration_date,
            ctrl._update_value.priority
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

        //update ODB
        ctrl.updateReferencesODB_service = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "updateReferences", updateReferencesODB_service);
        }
        function updateReferencesODB_service() {
            const defaultReferences = ctrl.outgoing_dispatch_references.filter(reference => reference.isDefault === true);
            const combinedReferences = [...defaultReferences, ...ctrl.ODBreferences];
            var dfd = $q.defer();
            sign_details_service.updateReferencesODB(
                ctrl.outgoing_dispatch._id,
                combinedReferences
            ).then(function () {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    ctrl.loadDetailsReference = function (params) {
        return $q.resolve(params.ids)
    }
    ctrl.pickODB_update = function (val) {
        ctrl._update_value.odb_book = val.value;
    }

    ctrl.pickDAT_update = function (val) {
        ctrl._update_value.type = val.value;
    }

    ctrl.chooseSignedDate_update = function (val) {
        ctrl._update_value.signed_date = val.getTime();
    }

    ctrl.choosePriority_update = function (val) {
        ctrl._update_value.priority = val.value;
    }
    //forward ODB
    ctrl.forwardODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "forward", forwardODB_service);
    }

    ctrl.chooseExpirationDate_update = function (val) {
        ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
        ctrl._update_value.expiration_date = val ? val.getTime() : null;
    }

    ctrl.pickHost_release = function (val) {
        ctrl._update_value.host = val;
    }

    ctrl.pickCoordinator_release = function (val) {
        ctrl._update_value.coordinator = val;
    }

    ctrl.pickNotificationDepartments_release = function (val) {
        ctrl._update_value.notification_departments = val;
    }

    ctrl.pickNotificationPerson_release = function (val) {
        ctrl._update_value.notification_recipients = val;
    }

    ctrl.releaseODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "release", release_service);
    }

    ctrl.pickCurrentItem = function () {
        ctrl.currentItem = ctrl.odbDetail
    }

    ctrl.removeFile_additional = function(file){
        ctrl._additional_value.file = ctrl._additional_value.file.filter(item => item.name !== file.name);
    }

    function getPermissionProperties(item) {
        
        if(item.status === 'Rejected'){
            return {}
        }

        let allow_assess = false;
        let allow_sign = false;
        let allow_return = false;
        let allow_create_dispatch_out = false;
        let allow_additional_document = false;
        let currentNode;
        if(item.node!== -1){
            currentNode = item.flow[item.node -1];
        }
        
        if(currentNode){

            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type !=='process'){
                allow_assess = true;
                if(item.node !== 1 && item.node !== -1){
                    allow_return = true;
                }
            }
    
            if(allow_assess && currentNode && currentNode.items[0].signature  && currentNode.type !=='process'){
                const sign = item.signatureTags.find(s => s.label === currentNode.items[0].signature);
                if(sign && !sign.isSigned){
                    allow_sign = true;
                }
            }
    
            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type ==='process' && item.status !== 'Waiting_Additional_Documents'){
                allow_create_dispatch_out = true;
            }

            if(item.play_now.find(item => item.username === $rootScope.logininfo.username) && currentNode.type ==='process' && item.status === 'Waiting_Additional_Documents'){
                allow_additional_document = true;
            }
        }


        return {
            allow_assess,
            allow_sign,
            allow_return,
            allow_create_dispatch_out,
            allow_additional_document,
        }
    }

    ctrl.additional_document = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "additional_document", additional_document_service);
    }

    function additional_document_service(){
        const dfd = $q.defer();
        const waiting_archive_id = ctrl.Item.waiting_archive_id;
        const files = ctrl._additional_value.file;
        workflow_play_service.creator_additional_document(ctrl.Item._id, waiting_archive_id, files, ctrl._additional_value.note).then(function(res){
            ctrl.loadDetails();
            dfd.resolve(true);
            $('#modal_WFP_additional_document').modal('hide');
            dfd.resolve(true);
        }, function(err){
            dfd.reject(err);
        })
        return dfd.promise;
    }

    ctrl.prepareAdditional_document = function(){
        ctrl._additional_value = {};
        ctrl._additional_value.file = [];
        ctrl._additional_value.note = '';
        ctrl._additional_value.note_placeholder = '';
    }

    function release_service() {
        var dfd = $q.defer();
        sign_details_service.releaseODB(ctrl.odbDetail._id).then(function (res) {
            ctrl.loadDetails();
            $("#modal_ODB_Release_Confirm").modal("hide");
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    // Add modal insert dispatch outgoing
    ctrl.OutgoingDispatchBook_Config = {
        master_key: "outgoing_dispatch_book",
        load_details_column: "value"
    };

    ctrl.DocumentType_Config = {
        master_key: "document_type",
        load_details_column: "value"
    };

    ctrl.IncommingDispatchBook_Config = {
        master_key: "incomming_dispatch_book",
        load_details_column: "value"
    };

    ctrl.IncommingDispatchPririoty_Config = {
        master_key: "incomming_dispatch_priority",
        load_details_column: "value"
    };

    ctrl.MethodOfSendingDispatchTo_Config = {
        master_key: "method_of_sending_dispatch_to",
        load_details_column: "value"
    };

    ctrl.KindOfDispatchTo_Config = {
        master_key: "document_type",
        load_details_column: "value"
    };

    ctrl.securityLevel_Config = {
        master_key: "security_level",
        load_details_column: "value",
    };

    ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
        let today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isInsert) {
            return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
        } else {
            return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
        }
    }

    ctrl.pickODB_insert = function (val){
        ctrl._insert_value_wfp.do_code = val.value;   
        ctrl.currentOutGoingBook = val;  
        setOutgoingNumber().then(function(){
            setCodeOutgoing(ctrl._insert_value_wfp.orderNumber);
        },function(){})
    }

    ctrl.pickDAT_insert = function(val){
        ctrl._insert_value_wfp.type = val.value;
    }

    ctrl.choosePriority_insert = function(val){
        ctrl._insert_value_wfp.priority = val.value;
    }

    ctrl.chooseReleaseDate_insert = function (params) {
        ctrl._insert_value_wfp.release_date = params;
    };

    ctrl.chooseSubmissionDepartment = function (val) {
        ctrl._insert_value_wfp.submission_department = val.id;
    };
    ctrl.chooseDepartmentWrite = function (val) {
        ctrl._insert_value_wfp.department_write = val.id;
    };

    ctrl.chooseDuration_insert = function (val) {
        // Initialize _insert_value_wfp if it doesn't exist
        if (!ctrl._insert_value_wfp) {
            ctrl._insert_value_wfp = {};
        }
        ctrl._insert_value_wfp.date_sign = val.getTime();
    };

    ctrl.pick_insert_security_level = function(val){
        ctrl._insert_value_wfp.securityLevel = val.value;
    }

    ctrl.pickViewOnlyDepartment_insert = function (val) {
        ctrl._insert_value_wfp.view_only_departments = angular.copy(val);
    };

    ctrl.choosePriority = function(val){
        ctrl._filterPriority = val.value;
        ctrl.refreshData();
    }

    ctrl._choose_person_sign = function(param){
        ctrl._insert_value_wfp.person_sign = param;
    }

    ctrl.removeOutgoingDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value_wfp.outgoing_file) {
            if (ctrl._insert_value_wfp.outgoing_file[i].name != item.name) {
                temp.push(ctrl._insert_value_wfp.outgoing_file[i]);
            }
        }
        ctrl._insert_value_wfp.outgoing_file = angular.copy(temp);
    }

    ctrl.removeAttachDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value_wfp.attachments) {
            if (ctrl._insert_value_wfp.attachments[i].name != item.name) {
                temp.push(ctrl._insert_value_wfp.attachments[i]);
            }
        }
        ctrl._insert_value_wfp.attachments = angular.copy(temp);
    }

    // Add modal insert dispatch outgoing
    function loadExpriedFromDispatch(dispatchId, dispatchCode) {
        return workflow_play_service.load_Dispatch_Arrived_Details(dispatchId, dispatchCode)
            .then(function (response) {
                return response.data.expried;
            })
            .catch(function (error) {
                console.error("Error retrieving expiration date:", error);
                return '';
            });
    }
    ctrl.prepareInsertDispatchOutgoing = function (value) { 
        $rootScope.statusValue.generate(ctrl._ctrlName, "OD", "insert_do");
        var today = new Date();
        var yearOnly = today.getFullYear();
        ctrl._insert_value_wfp = angular.copy(value);
    
        // Khởi tạo filter_odb_book
        // ctrl._insert_value_wfp.filter_odb_book = [
        //     { document_type: { $eq: ctrl.Item?.document_type || "" } }
        // ];

        // console.log("Hi", ctrl._insert_value_wfp.filter_odb_book);
        
        
        // Kiểm tra và xử lý nếu có danh sách parents
        if (ctrl._insert_value_wfp.parents && ctrl._insert_value_wfp.parents.length > 0) {
            var lastParent = ctrl._insert_value_wfp.parents[ctrl._insert_value_wfp.parents.length - 1];
            var dispatchId = lastParent.id;
            var dispatchCode = lastParent.code;
    
            loadExpriedFromDispatch(dispatchId, dispatchCode)
                .then(function (expried) {
                    initializeInsertValue(expried || today, yearOnly);
                })
                .catch(function (error) {
                    console.error("Error loading expried:", error);
                    initializeInsertValue(today, yearOnly); 
                });
        } else {
            insertWithDefaultValues(today, yearOnly);
        }
    };
    
    function initializeInsertValue(expirationDate, yearOnly) {
        
        ctrl._insert_value_wfp = {
            release_date: yearOnly,
            do_code: "",
            symbol_number: "",
            type: ctrl._insert_value_wfp.document_type,
            department_write: $rootScope.logininfo.data.department,
            date_sign: ctrl._insert_value_wfp.event[ctrl._insert_value_wfp.event.length - 2].time || null,
            priority: "Normal",
            securityLevel: "",
            expiration_date: expirationDate,
            excerpt: ctrl._insert_value_wfp.title,
            view_only_departments: ctrl._insert_value_wfp.department_destination || [],
            outgoing_file: [],
            attachments: [],
            person_sign: ctrl._insert_value_wfp.event[ctrl._insert_value_wfp.event.length - 2].username || "",
            content: ctrl._insert_value_wfp.title,
        };

        ctrl._insert_value_wfp.filter_odb_book = [
            { document_type: { $eq: ctrl.Item.document_type } }
        ];

        $rootScope.$broadcast("pickModalDirectory:initLoad");

        
    }
    
    function insertWithDefaultValues(today, yearOnly) {
        var today = new Date();
        var timestamp = today.getTime();

        ctrl._insert_value_wfp = {
            release_date: yearOnly,
            do_code: "",
            symbol_number: "",
            type: ctrl._insert_value_wfp.document_type,
            department_write: $rootScope.logininfo.data.department,
            date_sign: ctrl._insert_value_wfp.event[ctrl._insert_value_wfp.event.length - 2].time || null,
            priority: "Normal",
            securityLevel: "",
            expiration_date: timestamp,
            excerpt: ctrl._insert_value_wfp.title,
            view_only_departments: ctrl._insert_value_wfp.department_destination || [],
            outgoing_file: [],
            attachments: [],
            person_sign: ctrl._insert_value_wfp.event[ctrl._insert_value_wfp.event.length - 2].username || "",
            content: ctrl._insert_value_wfp.title,
        };

        ctrl._insert_value_wfp.filter_odb_book = [
            { document_type: { $eq: ctrl.Item.document_type } }
        ];
        $rootScope.$broadcast("pickModalDirectory:initLoad");
    }
    ctrl.insert_do_wfp = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "OD", "insert_do", insert_OD_service);
    }

    function insert_OD_service() {
        const dfd = $q.defer();
        const workflow_id =  ctrl.Item._id;
        const workflow_code =  ctrl.Item.code_old;
        const parents = ctrl.Item.parents;
        
        workflow_play_service.insert_do_wfp(
            workflow_id,
            workflow_code, // id work flow play
            parents, // parents
            ctrl._insert_value_wfp.release_date, // year
            ctrl._insert_value_wfp.do_code, // code
            ctrl._insert_value_wfp.symbol_number, // symbol_number
            ctrl._insert_value_wfp.type, // type
            ctrl._insert_value_wfp.date_sign, // date_sign
            ctrl._insert_value_wfp.department_write, // departmemt_write
            ctrl._insert_value_wfp.person_sign, // person_sign
            ctrl._insert_value_wfp.excerpt, // content
            ctrl._insert_value_wfp.expiration_date, // expire_date
            ctrl._insert_value_wfp.securityLevel, // security_level
            ctrl._insert_value_wfp.priority, // urgency_level
            ctrl._insert_value_wfp.view_only_departments, // other_destination
            ctrl._insert_value_wfp.document_tag, // text_tags
            ctrl._insert_value_wfp.self_end, // auto end
            ctrl._insert_value_wfp.outgoing_file,
            ctrl._insert_value_wfp.attachments,
            ctrl._insert_value_wfp.number,
        ).then(function (res) {
            return_creator_additional_document(res.data._id).then(function(res){
                $("#modal_OD_Insert_WFP").modal("hide");
                ctrl.loadDetails();
                // ctrl.switchTab('separateDispatch');
                dfd.resolve(true);
                dfd = undefined;
            }, function(err){
                dfd.reject(err);
            })
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function return_creator_additional_document(waiting_archive_id){
        const dfd = $q.defer();
        workflow_play_service.return_creator_additional_document(ctrl.Item._id, waiting_archive_id).then(function(res){
            ctrl.loadDetails();
            dfd.resolve(true);
        }, function(err){
            dfd.reject(err);
        })
        return dfd.promise;
    }

    ctrl.chooseSigningDate_insert = function (val) {
        if (!ctrl._insert_value_wfp) {
            ctrl._insert_value_wfp = {};
        }
        ctrl._insert_value_wfp.date_sign = val.getTime();
    };

    ctrl.chooseExpried_insert = function (val) {
        ctrl._insert_value_wfp.expiration_date = val.getTime();
    };
}]);


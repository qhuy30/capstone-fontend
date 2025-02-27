import * as FileSaver from 'file-saver';

function get_Url_Directive_Html(key) {
    return primaryDomain + "/directives/" + key + ".html";
}
myApp.directive('brigeValue', function () {
    return {
        restrict: "A",
        scope: {
            brigeValue: "<",
            brigeFunc: "&",
            ngModel: "=",
            initCount: "<"
        },
        link: function (scope) {
            var count = scope.initCount || 0;
            scope.$watch('ngModel', function (val) {
                count++;
                if (typeof val !== "undefined" && count > 1) {
                    scope.brigeFunc({ params: { value: scope.brigeValue, model: val } });
                }

            });
        }
    }
});

myApp.directive('moreOptionBar', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('more-options-bar'),
        scope: {
            targetId: "@",
        },
        transclude: {
            content: '?barContent'
        }
    }
});

myApp.directive('moreOptionTask', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('more-options-task'),
        scope: {
            targetId: "@",
        },
        transclude: {
            content: '?barContent'
        }
    }
});

myApp.directive('order', function () {
    return {
        restrict: "E",
        scope: {
            orderModel: "=",
            orderName: "@",
            orderFunc: "&",
            orderParams: "<"
        },
        templateUrl: get_Url_Directive_Html('order'),
        link: function (scope) {
            scope.orderClick = function (val) {
                if (scope.orderModel && scope.orderModel.query && scope.orderModel.query[scope.orderName] !== undefined) {

                    if (val !== scope.orderModel[scope.orderName]) {
                        scope.orderModel.query[scope.orderName] = val;
                        scope.orderModel.name = scope.orderName;
                        scope.orderModel.value = (val === 1 ? false : true);
                        scope.orderFunc({ params: scope.orderParams });
                    }
                } else {
                    scope.orderModel = { query: {} };
                    scope.orderModel.query[scope.orderName] = val;
                    scope.orderModel.name = scope.orderName;
                    scope.orderModel.value = (val === 1 ? false : true);
                    scope.orderFunc({ params: scope.orderParams });
                }

            }
        }
    }
});

myApp.directive("pagination", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pagination'),
        scope: {
            paginationCtrlname: "@",
            paginationObjname: "@",
            paginationActionname: "@",
            paginationCurrentpage: "=",
            paginationNoi: "<",
            paginationTotal: "<",
            paginationFunc: "&"
        },
        link: function (scope) {

            function paginationItem(total, current, NoI) {
                if (total === undefined || current === undefined || NoI === undefined) { return []; }
                if (total <= NoI) { return [1]; }
                var result = [];
                var count = 1;
                for (var i = 0; i < total; i += NoI) {
                    result.push(count);
                    count++;
                }
                if (result.length <= 5) { return result; }
                if (current == 1 || current == 2 || current == 3) {
                    return [1, 2, 3, result.length - 1, result.length];
                }

                if (current == result.length || current == result.length - 1) {
                    return [1, 2, result.length - 2, result.length - 1, result.length];
                }

                return [1, current - 1, current, current + 1, result.length];

            }

            scope.$watchGroup(['paginationTotal', 'paginationCurrentpage'], function () {
                scope.items = paginationItem(scope.paginationTotal, scope.paginationCurrentpage, scope.paginationNoi);
            });

            scope.paginationClick = function (val) {
                scope.paginationCurrentpage = angular.copy(val);
                scope.paginationFunc({ params: (val - 1) * scope.paginationNoi });
            }

            scope.previous = function () {
                if (scope.paginationCurrentpage > 1) {
                    scope.paginationCurrentpage--;
                    scope.paginationFunc({ params: (scope.paginationCurrentpage - 1) * scope.paginationNoi });
                }
            }

            scope.next = function () {
                if (scope.paginationCurrentpage < scope.items[scope.items.length - 1]) {
                    scope.paginationCurrentpage++;
                    scope.paginationFunc({ params: (scope.paginationCurrentpage - 1) * scope.paginationNoi });
                }
            }
        }
    };
});

myApp.directive("isactive", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('isactive'),
        scope: {
            isactiveValue: "<"
        }
    };
});

myApp.directive("myContent", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('content'),
        transclude: {
            breadcrumb: '?contentBreadcrumb',
            content: 'contentContent'
        }
    };
});

myApp.directive("modalHeader", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-header'),
        scope: {
            modalHeaderTitle: '@',
            modalHeaderId: "@"
        },
        link: function (scope) {
            scope.close = function () {
                $("#" + scope.modalHeaderId).modal("hide");
            }
        }
    };
});

myApp.directive("modalButtonClose", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-close'),
        scope: {
            modalButtonCloseType: "@",
            targetModalId: "@"
        },
        link: function (scope, element) {
            scope.closeModal = function () {
                if (scope.targetModalId) {
                    var modalElement = document.getElementById(scope.targetModalId);
                    if (modalElement) {
                        angular.element(modalElement).modal('hide');
                    } else {
                        console.error("Modal with ID '" + scope.targetModalId + "' not found.");
                    }
                } else {
                    var parentModal = element.closest('.modal');
                    if (parentModal) {
                        angular.element(parentModal).modal('hide');
                    } else {
                        console.warn("No modal context found for modalButtonClose.");
                    }
                }
            };
        }
    };
});

myApp.directive("loading", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('loading'),
        scope: {
            loadingValue: "<",
            loadingLabel: "@"
        }
    };
});

myApp.directive("invalid", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('invalid'),
        scope: {
            invalidStatus: "<"
        },
        transclude: true
    };
});

myApp.directive("valid", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('valid'),
        scope: {
            validStatus: "<"
        },
        transclude: true
    };
});

myApp.directive("modalButtonNew", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-new'),
        scope: {
            modalButtonNewInvalid: "<",
            modalButtonNewParams: "<",
            modalButtonNewFunc: "&",
            modalButtonNewLabel: "@",
            modalButtonNewCtrlname: "@",
            modalButtonNewObjname: "@",
            modalButtonNewActionname: "@",
            modalButtonNewType: "@"
        },
        link: function (scope) {
            scope.modalButtonNewClick = function () {
                scope.modalButtonNewFunc({ params: scope.modalButtonNewParams });
            }
        }
    };
});

myApp.directive("modalButtonImport", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-import'),
        scope: {
            modalButtonImportInvalid: "<",
            modalButtonImportParams: "<",
            modalButtonImportFunc: "&",
            modalButtonImportLabel: "@",
            modalButtonImportCtrlname: "@",
            modalButtonImportObjname: "@",
            modalButtonImportActionname: "@",
            modalButtonImportType: "@"
        },
        link: function (scope) {
            scope.modalButtonImportClick = function () {
                scope.modalButtonImportFunc({ params: scope.modalButtonImportParams });
            }
        }
    };
});

myApp.directive("modalButtonSave", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-save'),
        scope: {
            modalButtonSaveInvalid: "<",
            modalButtonSaveParams: "<",
            modalButtonSaveFunc: "&",
            modalButtonSaveLabel: "@",
            modalButtonSaveCtrlname: "@",
            modalButtonSaveObjname: "@",
            modalButtonSaveActionname: "@",
            modalButtonSaveType: "@"
        },
        link: function (scope) {
            scope.modalButtonSaveClick = function () {
                scope.modalButtonSaveFunc({ params: scope.modalButtonSaveParams });
            }
        }
    };
});
myApp.directive("modalButtonCalculate", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-calculate'),
        scope: {
            modalButtonCalculateInvalid: "<",
            modalButtonCalculateParams: "<",
            modalButtonCalculateFunc: "&",
            modalButtonCalculateLabel: "@",
            modalButtonCalculateCtrlname: "@",
            modalButtonCalculateObjname: "@",
            modalButtonCalculateActionname: "@",
            modalButtonCalculateType: "@"
        },
        link: function (scope) {
            scope.modalButtonCalculateClick = function () {
                scope.modalButtonCalculateFunc({ params: scope.modalButtonCalculateParams });
            }
        }
    };
});

myApp.directive("modalNotification", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-notification'),
        scope: {
            modalNotificationHeader: "@",
            modalNotificationContent: "@",
            modalNotificationFooter: "@",
            modalNotificationFunc: "&",
        },
        link: function (scope) {
            scope.modalNotificationClick = function () {
                scope.modalNotificationFunc();
            }
        }
    };
});

myApp.directive("modalButtonApproval", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-approval'),
        scope: {
            modalButtonApprovalInvalid: "<",
            modalButtonApprovalParams: "<",
            modalButtonApprovalFunc: "&",
            modalButtonApprovalLabel: "@",
            modalButtonApprovalCtrlname: "@",
            modalButtonApprovalObjname: "@",
            modalButtonApprovalActionname: "@",
            modalButtonApprovalType: "@",
            modalButtonConfirmText: "@",
            modalHeaderContent: "@",
            modalTextButton: "@",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-approval-" + scope.modalButtonApprovalActionname + d.getTime();
            scope.modalButtonApprovalClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonApprovalFunc({ params: scope.modalButtonApprovalParams });

            }
        }
    };
});

myApp.directive("modalButtonApprovalTransfer",['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-approval-transfer'),
        scope: {
            modalButtonApprovalInvalid: "<",
            modalButtonApprovalParams: "<",
            modalButtonApprovalFunc: "&",
            modalButtonApprovalLabel: "@",
            modalButtonApprovalCtrlname: "@",
            modalButtonApprovalObjname: "@",
            modalButtonApprovalActionname: "@",
            modalButtonApprovalType: "@",
            modalButtonConfirmText: "@",
            modalButtonFunctionApply: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl._hintNoteSet = [
                'I agree',
                'I approve',
                'Processed'
            ];
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-approval-transfer" + d.getTime();
            scope.ctrl._assess_value = scope.ctrl._assess_value || {};
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl._assess_value.note = $filter('l')(note);
            };
            scope.modalButtonApprovalClick = function () {
                scope.modalButtonApprovalFunc({ params: scope.ctrl._assess_value.note });
                $("#" + scope.ctrl._ctrlName).modal("hide");
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');         
            }
        }
    };
}]);

myApp.directive("modalButtonReceiver", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-receiver'),
        scope: {
            modalButtonReceiverInvalid: "<",
            modalButtonReceiverParams: "<",
            modalButtonReceiverFunc: "&",
            modalButtonReceiverLabel: "@",
            modalButtonReceiverCtrlname: "@",
            modalButtonReceiverObjname: "@",
            modalButtonReceiverActionname: "@",
            modalButtonReceiverType: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-approval-" + scope.modalButtonReceiverActionname + d.getTime();
            scope.modalButtonReceiverClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonReceiverFunc({ params: scope.modalButtonReceiverParams });

            }
        }
    };
});

myApp.directive("modalButtonReject", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-reject'),
        scope: {
            modalButtonRejectInvalid: "<",
            modalButtonRejectParams: "<",
            modalButtonRejectFunc: "&",
            modalButtonRejectLabel: "@",
            modalButtonRejectCtrlname: "@",
            modalButtonRejectObjname: "@",
            modalButtonRejectActionname: "@",
            modalButtonRejectType: "@",
            modalButtonConfirmText: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-reject" + d.getTime();
            scope.modalButtonRejectClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonRejectFunc({ params: scope.modalButtonRejectParams });

            }
        }
    };
});

myApp.directive("modalButtonRejectDispatch",['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-reject-dispatch'),
        scope: {
            modalButtonRejectInvalid: "<",
            modalButtonRejectParams: "<",
            modalButtonRejectFunc: "&",
            modalButtonRejectLabel: "@",
            modalButtonRejectCtrlname: "@",
            modalButtonRejectObjname: "@",
            modalButtonRejectActionname: "@",
            modalButtonRejectType: "@",
            modalButtonConfirmText: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl._hintNoteSet = [
                'I agree',
                'I approve'
            ];
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-reject-dispatch" + d.getTime();
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl.note = $filter('l')(note);
            };
            scope.modalButtonRejectClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonRejectFunc({ params: scope.ctrl.note });

            }
        }
    };
}]);

myApp.directive("modalButtonApproveDispatch",['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-approve-dispatch'),
        scope: {
            modalButtonApproveInvalid: "<",
            modalButtonApproveParams: "<",
            modalButtonApproveFunc: "&",
            modalButtonApproveLabel: "@",
            modalButtonApproveCtrlname: "@",
            modalButtonApproveObjname: "@",
            modalButtonApproveActionname: "@",
            modalButtonApproveType: "@",
            modalHeaderContent: "@",
            modalButtonConfirmText: "@",
            functionApplySuggestions:"<"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl._hintNoteSet = [
                'I approve',
                'I agree',
            ];
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-approve-dispatch" + d.getTime();
            scope.ctrl.function_apply_suggestions = scope.functionApplySuggestions;
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl.note = $filter('l')(note);
            };
            scope.modalButtonApproveClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                if(scope.modalButtonApproveParams !== undefined) {
                    scope.modalButtonApproveFunc({
                        params: {
                            note: scope.ctrl.note,
                            approveParams: scope.modalButtonApproveParams
                        }
                    });
                }else{
                    scope.modalButtonApproveFunc({ params: scope.ctrl.note });
                }

            }
        }
    };
}]);

myApp.directive("modalButtonReturn", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-return'),
        scope: {
            modalButtonReturnInvalid: "<",
            modalButtonReturnParams: "<",
            modalButtonReturnFunc: "&",
            modalButtonReturnLabel: "@",
            modalButtonReturnCtrlname: "@",
            modalButtonReturnObjname: "@",
            modalButtonReturnActionname: "@",
            modalButtonReturnType: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-return" + d.getTime();
            scope.modalButtonReturnClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonReturnFunc({ params: scope.modalButtonReturnParams });
            }
        }
    };
});

myApp.directive("modalButtonReturnTransfer",['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-return-transfer'),
        scope: {
            modalButtonReturnInvalid: "<",
            modalButtonReturnParams: "<",
            modalButtonReturnFunc: "&",
            modalButtonReturnLabel: "@",
            modalButtonReturnCtrlname: "@",
            modalButtonReturnObjname: "@",
            modalButtonReturnActionname: "@",
            modalButtonReturnType: "@",
            modalButtonFunctionApply: "<"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl._hintNoteSet = [
                'I agree',
                'I approve'
            ];
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-return-transfer" + d.getTime();
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl.note = $filter('l')(note);
            };
            scope.modalButtonReturnClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open'); 
                scope.modalButtonReturnFunc({ params: scope.ctrl.note });
            }
        }
    };
}]);


myApp.directive("modalButtonResubmit", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-resubmit'),
        scope: {
            modalButtonResubmitInvalid: "<",
            modalButtonResubmitParams: "<",
            modalButtonResubmitFunc: "&",
            modalButtonResubmitLabel: "@",
            modalButtonResubmitCtrlname: "@",
            modalButtonResubmitObjname: "@",
            modalButtonResubmitActionname: "@",
            modalButtonResubmitType: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-resubmit" + d.getTime();
            scope.modalButtonResubmitClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonResubmitFunc({ params: scope.modalButtonResubmitParams });
            }
        }
    };
});


myApp.directive("modalButtonSignAFile", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-sign-a-file'),
        scope: {
            modalButtonSignAFileInvalid: "<",
            modalButtonSignAFileParams: "<",
            modalButtonSignAFileShowButton: "<",
            modalButtonSignAFileFunc: "&",
            modalButtonSignAFileLabel: "@",
            modalButtonSignAFileCtrlname: "@",
            modalButtonSignAFileObjname: "@",
            modalButtonSignAFileActionname: "@",
            modalButtonSignAFileName: "<",
            modalButtonSignAFileSign: "<",
            modalButtonSignAFileQuotationMark: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-sign-a-file" + d.getTime();
            scope.modalButtonSignAFileClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonSignAFileFunc({ params: scope.modalButtonSignAFileParams });
            }
        }
    };
});

myApp.directive("modalButtonSignAFile2", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-sign-a-file-2'),
        scope: {
            modalButtonSignAFileInvalid: "<",
            modalButtonSignAFileParams: "<",
            modalButtonSignAFileShowButton: "<",
            modalButtonSignAFileFunc: "&",
            modalButtonSignAFileLabel: "@",
            modalButtonSignAFileCtrlname: "@",
            modalButtonSignAFileObjname: "@",
            modalButtonSignAFileActionname: "@",
            modalButtonSignAFileName: "<",
            modalButtonSignAFileSign: "<",
            modalButtonSignAFileQuotationMark: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-sign-a-file" + d.getTime();
            scope.ctrl._assess_value = scope.ctrl._assess_value || {};
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl._assess_value.note = $filter('l')(note);
            };
            scope.modalButtonSignAFileClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonSignAFileFunc({ params: [scope.modalButtonSignAFileParams, scope.ctrl._assess_value.note] });
            }
        }
    };
});

myApp.directive("modalButtonSignAcknowledge", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-sign-acknowledge'),
        scope: {
            modalButtonSignAcknowledgeInvalid: "<",
            modalButtonSignAcknowledgeParams: "<",
            modalButtonSignAcknowledgeShowButton: "<",
            modalButtonSignAcknowledgeFunc: "&",
            modalButtonSignAcknowledgeLabel: "@",
            modalButtonSignAcknowledgeCtrlname: "@",
            modalButtonSignAcknowledgeObjname: "@",
            modalButtonSignAcknowledgeActionname: "@",
            modalButtonSignAcknowledgeName: "<",
            modalButtonSignAcknowledgeSign: "<",
            modalButtonSignAcknowledgeQuotationMark: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-sign-a-file" + d.getTime();
            scope.modalButtonSignAcknowledgeClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalButtonSignAcknowledgeFunc();
            }
        }
    };
});

myApp.directive("modalSignAFile", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-sign-a-file'),
        scope: {
            modalSignAFileShow: "<",
            modalSignAFileOnHide: "&",
            modalSignAFileInvalid: "<",
            modalSignAFileParams: "<",
            modalSignAFileFunc: "&",
            modalSignAFileLabel: "@",
            modalSignAFileCtrlname: "@",
            modalSignAFileObjname: "@",
            modalSignAFileActionname: "@",
            modalSignAFileName: "<",
            modalSignAFileSign: "<",
            modalSignAFileQuotationMark: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName = "modal-sign-a-file" + d.getTime();
            scope.modalSignAFileClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                scope.modalSignAFileFunc({ params: scope.modalSignAFileParams });
            }
            scope.$watch('modalSignAFileShow', show => {
                $("#" + scope.ctrl._ctrlName).modal(show ? "show" : "hide");
            });
            $(document).on('hidden.bs.modal', "#" + scope.ctrl._ctrlName, function (e) {
                scope.$apply(function () {
                    scope.modalSignAFileOnHide();
                });
            });
        }
    };
});

myApp.directive("modalButtonRestore", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-restore'),
        scope: {
            modalButtonRestoreInvalid: "<",
            modalButtonRestoreParams: "<",
            modalButtonRestoreFunc: "&",
            modalButtonRestoreLabel: "@",
            modalButtonRestoreCtrlname: "@",
            modalButtonRestoreObjname: "@",
            modalButtonRestoreActionname: "@",
            modalButtonRestoreType: "@"
        },
        link: function (scope) {
            scope.modalButtonRestoreClick = function () {
                scope.modalButtonRestoreFunc({ params: scope.modalButtonRestoreParams });
            }
        }
    };
});

myApp.directive("modalButtonDelete", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-delete'),
        scope: {
            modalButtonDeleteInvalid: "<",
            modalButtonDeleteParams: "<",
            modalButtonDeleteFunc: "&",
            modalButtonDeleteLabel: "@",
            modalButtonDeleteCtrlname: "@",
            modalButtonDeleteObjname: "@",
            modalButtonDeleteActionname: "@",
            modalButtonDeleteType: "@"
        },
        link: function (scope) {
            scope.modalButtonDeleteClick = function () {
                scope.modalButtonDeleteFunc({ params: scope.modalButtonDeleteParams });
            }
        }
    };
});

myApp.directive("modalButtonCancel", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-cancel'),
        scope: {
            modalButtonCancelInvalid: "<",
            modalButtonCancelParams: "<",
            modalButtonCancelFunc: "&",
            modalButtonCancelLabel: "@",
            modalButtonCancelCtrlname: "@",
            modalButtonCancelObjname: "@",
            modalButtonCancelActionname: "@",
            modalButtonCancelType: "@"
        },
        link: function (scope) {
            scope.modalButtonCancelClick = function () {
                scope.modalButtonCancelFunc({ params: scope.modalButtonCancelParams });
            }
        }
    };
});

myApp.directive("modalButtonSubmit", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-submit'),
        scope: {
            modalButtonSubmitInvalid: "<",
            modalButtonSubmitParams: "<",
            modalButtonSubmitFunc: "&",
            modalButtonSubmitLabel: "@",
            modalButtonSubmitCtrlname: "@",
            modalButtonSubmitObjname: "@",
            modalButtonSubmitActionname: "@",
            modalButtonSubmitType: "@"
        },
        link: function (scope) {
            scope.modalButtonSubmitClick = function () {
                scope.modalButtonSubmitFunc({ params: scope.modalButtonSubmitParams });
            }
        }
    };
});

myApp.directive("modalButtonConfirm", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-confirm'),
        scope: {
            modalButtonConfirmInvalid: "<",
            modalButtonConfirmParams: "<",
            modalButtonConfirmFunc: "&",
            modalButtonConfirmLabel: "@",
            modalButtonConfirmCtrlname: "@",
            modalButtonConfirmObjname: "@",
            modalButtonConfirmActionname: "@",
            modalButtonConfirmType: "@"
        },
        link: function (scope) {
            scope.modalButtonConfirmClick = function () {
                scope.modalButtonConfirmFunc({ params: scope.modalButtonConfirmParams });
            }
        }
    };
});


myApp.directive("modalButtonForward", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-forward'),
        scope: {
            modalButtonForwardInvalid: "<",
            modalButtonForwardParams: "<",
            modalButtonForwardFunc: "&",
            modalButtonForwardLabel: "@",
            modalButtonForwardCtrlname: "@",
            modalButtonForwardObjname: "@",
            modalButtonForwardActionname: "@",
            modalButtonForwardType: "@"
        },
        link: function (scope) {
            scope.modalButtonForwardClick = function () {
                scope.modalButtonForwardFunc({ params: scope.modalButtonForwardParams });
            }
        }
    };
});

myApp.directive("inputCheckbox", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('input-checkbox'),
        scope: {
            inputCheckboxLabel: "@",
            inputCheckboxModel: "=",
            inputCheckboxDisabled: "<",
            inputCheckboxFunc: "&"
        },
        link: function (scope) {
            scope.check = function () {
                scope.inputCheckboxModel = true;
            }
        }
    };
});

myApp.directive("buttonRadio", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-radio'),
        scope: {
            buttonRadioParams: "<",
            buttonRadioModel: "=",
            buttonRadioFunc: "&",
            disable: "<",
        },
        link: function (scope) {
            scope.buttonRadioClick = function (val) {
                scope.buttonRadioModel = angular.copy(val);
                if (scope.buttonRadioFunc) {
                    scope.buttonRadioFunc({ params: val });
                }
            }
        }
    };
});
myApp.directive("buttonRadioBasic", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-radio-basic'),
        scope: {
            buttonRadioParams: "<",
            buttonRadioModel: "=",
            buttonRadioDisabled: "<",
            buttonRadioFunc: "&",
            buttonRadioName: "<",
            isLocalization: "<"
        },
        link: function (scope) {
            scope.buttonRadioClick = function (val) {
                scope.buttonRadioModel = angular.copy(val);
                if (scope.buttonRadioFunc) {
                    scope.buttonRadioFunc({ params: val });
                }
            }
        }
    };
});

myApp.directive("buttonRadioL", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-radio-l'),
        scope: {
            buttonRadioParams: "<",
            buttonRadioModel: "=",
            buttonRadioDisabled: "<",
            buttonRadioFunc: "&"
        },
        link: function (scope) {
            scope.buttonRadioClick = function (val) {
                scope.buttonRadioModel = angular.copy(val);
                if (scope.buttonRadioFunc) {
                    scope.buttonRadioFunc({ params: val });
                }
            }
        }
    };
});

myApp.directive("buttonCheckbox", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-check'),
        scope: {
            buttonCheckboxLabel: "@",
            buttonCheckboxModel: "=",
            buttonCheckboxDisabled: "<",
            buttonCheckboxFunc: "&",
            buttonCheckboxLocalization: "<",
            buttonCheckboxParams: "<",
            buttonCheckboxHasbackground: "<"
        },
        link: function (scope) {
            if (scope.buttonCheckboxHasbackground === undefined) {
                scope.buttonCheckboxHasbackground = true;
            }
            if (scope.buttonCheckboxModel === undefined) {
                scope.buttonCheckboxModel = false;
            }
            scope.buttonCheckboxClick = function (val) {
                scope.buttonCheckboxModel = val;
                if (scope.buttonCheckboxParams !== undefined) {
                    scope.buttonCheckboxFunc({
                        params: {
                            value: val,
                            params: scope.buttonCheckboxParams
                        }
                    });
                } else {
                    scope.buttonCheckboxFunc({
                        params: val
                    });
                }
            }
        }
    };
});

myApp.directive("buttonSelect", ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-select'),
        scope: {
            buttonSelectLabel: "@",
            buttonSelectKey: "@",
            buttonSelectModel: "=",
            buttonSelectDisabled: "<",
            buttonSelectFunc: "&",
            buttonSelectData: "<",
            buttonSelectLocalization: "<",
            require: "<",
            myParams: "<",
            buttonSelectClear: "<"
        },
        link: function (scope) {
            if (scope.buttonSelectClear === undefined) {
                scope.buttonSelectClear = true;
            }            
            scope.showValue = "";            
            scope.buttonSelectClick = function (val) {
                scope.buttonSelectModel = angular.copy(val);
                if (scope.buttonSelectFunc) {
                    if (scope.myParams) {
                        scope.buttonSelectFunc({ params: { value: scope.myParams, model: val } });
                    } else {
                        scope.buttonSelectFunc({ params: val });
                    }

                }
            }
            scope.clear = function () {
                scope.buttonSelectModel = {};
                if (scope.myParams) {
                    scope.buttonSelectFunc({ params: { value: scope.myParams, model: {} } });
                } else {
                    scope.buttonSelectFunc({ params: {} });
                }
            }
            scope.$watch('buttonSelectModel', function (newVal) {
                if (scope.buttonSelectModel) {
                    if (scope.buttonSelectLocalization) {
                        if (scope.buttonSelectKey) {
                            scope.showValue = $filter('l')(scope.buttonSelectModel[scope.buttonSelectKey]);
                        } else {
                            scope.showValue = $filter('l')(scope.buttonSelectModel);
                        }
                    } else {
                        if (scope.buttonSelectKey) {
                            scope.showValue = scope.buttonSelectModel[scope.buttonSelectKey];
                        } else {
                            scope.showValue = scope.buttonSelectModel;
                        }
                    }
                } else {
                    scope.showValue = '';
                }
            });
        }
    };
}]);

myApp.directive("buttonSelectAdvancedSearch", ['$rootScope','$filter', 'languageValue', function ($rootScope ,$filter, $languageValue) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-select-advanced-search'),
        scope: {
            buttonSelectLabel: "@",
            buttonSelectKey: "@",
            buttonSelectModel: "=",
            buttonSelectDisabled: "<",
            buttonSelectFunc: "&",
            buttonSelectData: "<",
            buttonSelectLocalization: "<",
            require: "<",
            getFirstToDefault: "<"
        },
        link: function (scope) {  
            scope.showValue = "";  
            scope.currentLanguge = $languageValue.current;          
            scope.buttonSelectClick = function (val) {
                scope.buttonSelectModel = angular.copy(val);

                if (scope.buttonSelectFunc) {
                    scope.buttonSelectFunc({ params: val });
                }
            }
            
            if(scope.getFirstToDefault === undefined){
                scope.getFirstToDefault = false;
            }else{
                scope.getFirstToDefault = true;
                scope.showValue = scope.buttonSelectData[0].title[$rootScope.Language.current];
            }
            
            scope.$watch('buttonSelectModel', function () {
                scope.showValue = scope.buttonSelectModel.title[$rootScope.Language.current];
            });
        }
    };
}]);


myApp.directive("advancedSearchFlow", ['$rootScope',function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('advanced_search_flow'),
        scope: {
            events: "="
        },
        link: function (scope) {
            scope.ctrl = {}
            scope.ctrl.Competence_Config = {
                master_key: "competence",
                load_details_column: "value"
            };
        }
    };
}]);

myApp.directive("buttonSelectNl", ['$rootScope', '$q', function ($rootScope, $q) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-select-nl'),
        scope: {
            loadDetailsFunc: "&",
            buttonSelectLabel: "@",
            buttonSelectKey: "@",
            idValue: "=",
            localization: "<",
            buttonSelectFunc: "&",
            buttonSelectData: "<",
            require: "<",
            disable: "<",
            typeForDirective: "@",
            disableDropdown: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];

            var d = new Date();
            scope._ctrlName = "button-select-nl" + d.getTime();
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            function findWFForBegin() {
                if (scope.typeForDirective==="transfer_ticket" && scope.buttonSelectData && scope.buttonSelectData.length > 0) {
                    let item = scope.buttonSelectData.find(function(item) {
                        return item.title && item.title['vi-VN'] === 'Phiếu chuyển';
                    });
                    if (item) {
                        scope.buttonSelectClick(item);  
                    }
                }
            }

            scope.buttonSelectClick = function (val) {
                scope.selectedItem = val;
                if (scope.buttonSelectFunc) {
                    scope.buttonSelectFunc({ params: val });
                }
            }
            scope.clear = function () {
                scope.selectedItem = {};
                scope.buttonSelectFunc({ params: {} });
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.loadDetailsFunc({ params: { id: scope.idValue } }).then(function (data) {
                    scope.selectedItem = angular.copy(data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                    scope.loadDetails();
                    findWFForBegin();             
            });

            scope.$watch('buttonSelectData', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal && newVal.length > 0) {
                    scope.selectedItem = newVal[0]; 
                    scope.idValue = newVal[0]._id;
                    scope.buttonSelectClick(newVal[0]);
                }

                if (scope.typeForDirective==="transfer_ticket" && newVal !== oldVal) {
                    findWFForBegin();
                }
            });

        }
    };
}]);

myApp.directive("buttonSelectModal", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-select-modal'),
        scope: {
            buttonSelectModalLabel: "@",
            buttonSelectModalShow: "@",
            buttonSelectModalName: "@",
            buttonSelectModalFunc: "&",
            buttonSelectModalParams: "<"
        },
        link: function (scope, elem, attrs) {
            scope.buttonSelectModalClick = function () {
                scope.buttonSelectModalFunc({ params: scope.buttonSelectModalParams });
            }
        }
    };
});

myApp.filter('buttonChoose_Choosen', function () {
    return function (data, choosen, key, keychoose) {
        if (!data) { return []; }
        if (!choosen || !choosen.length) { return data; }
        var results = [];
        for (var i in data) {
            var check = true;
            for (var j in choosen) {
                if (key) {
                    if (data[i] !== null && data[i][key] == choosen[j]) {
                        check = false;
                        break;
                    }
                } else {
                    if (data[i] !== null && data[i][keychoose] == choosen[j][keychoose]) {
                        check = false;
                        break;
                    }
                }
            }
            if (check) { results.push(data[i]); }
        }
        return results;
    }
}).directive("buttonChoose", ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-choose'),
        scope: {
            buttonChooseLabel: "@",
            buttonChooseKey: "@",
            buttonChooseKeyval: "@",
            buttonChooseModel: "=",
            buttonChooseDisabled: "<",
            buttonChooseFunc: "&",
            buttonChooseLocalization: "<",
            buttonChooseData: "<",
            buttonChooseShowbaselanguage: "<"
        },
        link: function (scope) {
            {
                scope.doing = false;
                scope.status = true;
                scope.start = false;
                scope.message = "";
            }
            /**set Start status value */
            function start() {
                scope.doing = true;
                scope.start = true;
            }

            /**set Success status value */
            function success(message) {
                scope.doing = false;
                scope.status = true;
                scope.start = true;
                if (message) { scope.message = message; }
            }

            /**set Fail status value */
            function fails(message) {
                scope.doing = false;
                scope.status = false;
                scope.start = true;
                scope.currentAction = "";
                scope.currentValue = "";
                if (message) { scope.message = message; }
            }

            scope.$watch('buttonChooseModel', function () {
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
            });

            scope.buttonChooseChoose = function (val) {
                scope.buttonChooseChoosen = angular.copy(val);
            }

            function doIt() {
                scope.buttonChooseFunc({ params: { value: scope.buttonChooseModel, action: scope.currentAction, valueChange: scope.currentValue } }).then(function () {
                    success();
                }, function (mes) {
                    fails(mes);
                });
            }
            scope.retry = function () {
                doIt();
            }
            scope.buttonChooseAdd = function () {
                scope.currentAction = "add";
                var valueChange;
                if (scope.buttonChooseKeyval) {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen[scope.buttonChooseKeyval]));
                    valueChange = scope.buttonChooseChoosen[scope.buttonChooseKeyval];
                } else {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen));
                    valueChange = scope.buttonChooseChoosen;
                }
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(valueChange);
                valueChange = undefined;
                start();
                doIt();

            }

            scope.buttonChooseRemove = function (val) {
                scope.currentAction = "remove";
                var temp = [];
                for (var i in scope.buttonChooseModel) {
                    if (scope.buttonChooseModel[i] != val) {
                        temp.push(scope.buttonChooseModel[i]);
                    }
                }
                scope.buttonChooseModel = angular.copy(temp);
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(val);
                temp = undefined;
                start();
                doIt();
            }
        }
    };
}]);
myApp.directive("buttonChooseN", ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-choose-n'),
        scope: {
            buttonChooseLabel: "@",
            buttonChooseKey: "@",
            buttonChooseKeyval: "@",
            buttonChooseModel: "=",
            buttonChooseDisabled: "<",
            buttonChooseFunc: "&",
            buttonChooseData: "<"
        },
        link: function (scope) {
            {
                scope.doing = false;
                scope.status = true;
                scope.start = false;
                scope.message = "";
            }
            /**set Start status value */
            function start() {
                scope.doing = true;
                scope.start = true;
            }

            /**set Success status value */
            function success(message) {
                scope.doing = false;
                scope.status = true;
                scope.start = true;
                if (message) { scope.message = message; }
            }

            /**set Fail status value */
            function fails(message) {
                scope.doing = false;
                scope.status = false;
                scope.start = true;
                scope.currentAction = "";
                scope.currentValue = "";
                if (message) { scope.message = message; }
            }

            scope.$watch('buttonChooseModel', function () {
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
            });

            scope.buttonChooseChoose = function (val) {
                scope.buttonChooseChoosen = angular.copy(val);
            }

            function doIt() {
                scope.buttonChooseFunc({ params: { value: scope.buttonChooseModel, action: scope.currentAction, valueChange: scope.currentValue } }).then(function () {
                    success();
                }, function (mes) {
                    fails(mes);
                });
            }
            scope.retry = function () {
                doIt();
            }
            scope.buttonChooseAdd = function () {
                scope.currentAction = "add";
                var valueChange;
                if (scope.buttonChooseKeyval) {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen[scope.buttonChooseKeyval]));
                    valueChange = scope.buttonChooseChoosen[scope.buttonChooseKeyval];
                } else {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen));
                    valueChange = scope.buttonChooseChoosen;
                }
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(valueChange);
                valueChange = undefined;
                start();
                doIt();

            }

            scope.buttonChooseRemove = function (val) {
                scope.currentAction = "remove";
                var temp = [];
                for (var i in scope.buttonChooseModel) {
                    if (scope.buttonChooseModel[i] != val) {
                        temp.push(scope.buttonChooseModel[i]);
                    }
                }
                scope.buttonChooseModel = angular.copy(temp);
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(val);
                temp = undefined;
                start();
                doIt();
            }
        }
    };
}]);

myApp.directive("buttonChooseNl", ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-choose-nl'),
        scope: {
            buttonChooseLabel: "@",
            buttonChooseKey: "@",
            buttonChooseKeyval: "@",
            buttonChooseModel: "=",
            buttonChooseDisabled: "<",
            buttonChooseFunc: "&",
            buttonChooseData: "<"
        },
        link: function (scope) {
            {
                scope.doing = false;
                scope.status = true;
                scope.start = false;
                scope.message = "";
            }
            /**set Start status value */
            function start() {
                scope.doing = true;
                scope.start = true;
            }

            /**set Success status value */
            function success(message) {
                scope.doing = false;
                scope.status = true;
                scope.start = true;
                if (message) { scope.message = message; }
            }

            /**set Fail status value */
            function fails(message) {
                scope.doing = false;
                scope.status = false;
                scope.start = true;
                scope.currentAction = "";
                scope.currentValue = "";
                if (message) { scope.message = message; }
            }

            scope.$watch('buttonChooseModel', function () {
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
            });

            scope.buttonChooseChoose = function (val) {
                scope.buttonChooseChoosen = angular.copy(val);
            }

            function doIt() {
                scope.buttonChooseFunc({ params: { value: scope.buttonChooseModel, action: scope.currentAction, valueChange: scope.currentValue } }).then(function () {
                    success();
                }, function (mes) {
                    fails(mes);
                });
            }
            scope.retry = function () {
                doIt();
            }
            scope.buttonChooseAdd = function () {
                scope.currentAction = "add";
                var valueChange;
                if (scope.buttonChooseKeyval) {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen[scope.buttonChooseKeyval]));
                    valueChange = scope.buttonChooseChoosen[scope.buttonChooseKeyval];
                } else {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen));
                    valueChange = scope.buttonChooseChoosen;
                }
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(valueChange);
                valueChange = undefined;
                start();
                doIt();

            }

            scope.buttonChooseRemove = function (val) {
                scope.currentAction = "remove";
                var temp = [];
                for (var i in scope.buttonChooseModel) {
                    if (scope.buttonChooseModel[i] != val) {
                        temp.push(scope.buttonChooseModel[i]);
                    }
                }
                scope.buttonChooseModel = angular.copy(temp);
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(val);
                temp = undefined;
                start();
                doIt();
            }
        }
    };
}]);

myApp.directive("buttonChooseL", ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-choose-l'),
        scope: {
            buttonChooseLabel: "@",
            buttonChooseKey: "@",
            buttonChooseKeyval: "@",
            buttonChooseModel: "=",
            buttonChooseDisabled: "<",
            buttonChooseFunc: "&",
            buttonChooseData: "<"
        },
        link: function (scope) {
            {
                scope.doing = false;
                scope.status = true;
                scope.start = false;
                scope.message = "";
            }
            /**set Start status value */
            function start() {
                scope.doing = true;
                scope.start = true;
            }

            /**set Success status value */
            function success(message) {
                scope.doing = false;
                scope.status = true;
                scope.start = true;
                if (message) { scope.message = message; }
            }

            /**set Fail status value */
            function fails(message) {
                scope.doing = false;
                scope.status = false;
                scope.start = true;
                scope.currentAction = "";
                scope.currentValue = "";
                if (message) { scope.message = message; }
            }

            scope.$watch('buttonChooseModel', function () {
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
            });

            scope.buttonChooseChoose = function (val) {
                scope.buttonChooseChoosen = angular.copy(val);
            }

            function doIt() {
                scope.buttonChooseFunc({ params: { value: scope.buttonChooseModel, action: scope.currentAction, valueChange: scope.currentValue } }).then(function () {
                    success();
                }, function (mes) {
                    fails(mes);
                });
            }
            scope.retry = function () {
                doIt();
            }
            scope.buttonChooseAdd = function () {
                scope.currentAction = "add";
                var valueChange;
                if (scope.buttonChooseKeyval) {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen[scope.buttonChooseKeyval]));
                    valueChange = scope.buttonChooseChoosen[scope.buttonChooseKeyval];
                } else {
                    scope.buttonChooseModel.push(angular.copy(scope.buttonChooseChoosen));
                    valueChange = scope.buttonChooseChoosen;
                }
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval, scope.buttonChooseKey);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(valueChange);
                valueChange = undefined;
                start();
                doIt();

            }

            scope.buttonChooseRemove = function (val) {
                scope.currentAction = "remove";
                var temp = [];
                for (var i in scope.buttonChooseModel) {
                    if (scope.buttonChooseModel[i] != val) {
                        temp.push(scope.buttonChooseModel[i]);
                    }
                }
                scope.buttonChooseModel = angular.copy(temp);
                scope.buttonChooseDataInternal = $filter('buttonChoose_Choosen')(scope.buttonChooseData, scope.buttonChooseModel, scope.buttonChooseKeyval);
                scope.buttonChooseChoosen = scope.buttonChooseDataInternal[0];
                scope.currentValue = angular.copy(val);
                temp = undefined;
                start();
                doIt();
            }
        }
    };
}]);

myApp.directive('buttonChooseEdit', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-choose-edit'),
        scope: {
            loadFunc: "&",
            countFunc: "&",
            bindFunc: "&",
            insertFunc: "&",
            numOfItemPerPage: "<",
            datashow: "=",
            label: "@",
            require: "<",
            disable: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Insert", action: "insert" }
            ];
            var d = new Date();
            scope._ctrlName = "choose-edit-modal" + d.getTime();
            scope.data = [];
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.datashow = [];
                scope.bindFunc({ params: [] });
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.add = function (item) {
                if (scope.datashow.indexOf(item) === -1) {
                    scope.datashow.push(item);
                }
                scope.bindFunc({ params: scope.datashow });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.remove = function (item) {
                var temp = [];
                for (var i in scope.datashow) {
                    if (scope.datashow[i] !== item) {
                        temp.push(scope.datashow[i]);
                    }
                }
                scope.datashow = angular.copy(temp);
                scope.bindFunc({ params: scope.datashow });
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            scope.checkSearchItem = function () {
                if (scope.data.indexOf(scope.search) !== -1) {
                    return false;
                }
                return true;
            }

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.loadFunc({
                    params: {
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }
                }).then(function (data) {
                    scope.data = data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });

                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.countFunc({ params: { search: filter.search } }).then(function (count) {
                    scope.totalItems = count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];

                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

            function insert_service() {
                var dfd = $q.defer();
                scope.insertFunc({
                    params: scope.search
                }).then(function () {
                    scope.init();
                    scope.search = "";
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            scope.insert = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Insert", "insert", insert_service);
            }
        }
    }
}]);

myApp.directive("pickUserFromDataMulti", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-from-data-multi'),
        scope: {
            label: "@",
            data: "<",
            idValue: "<",
            pickFunc: "&",
            disable: "<"
        },
        link: function (scope, elem) {
            var d = new Date();
            scope._ctrlName = "pick-user-from-data-multi" + d.getTime();
            scope.idValue = scope.idValue || [];

            scope.ctrl = {};

            function generateInternalData() {
                var temp = [];
                for (var i in scope.data) {
                    if (scope.idValue.indexOf(scope.data[i]) === -1) {
                        temp.push(scope.data[i]);
                    }
                }
                scope.internalData = temp;
                temp = undefined;
            }
            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.select = function (val) {
                if (scope.idValue.indexOf(val) === -1) {
                    scope.idValue.push(val);
                    scope.pickFunc({ params: scope.idValue });
                }
                generateInternalData();
            }

            scope.remove = function (val) {
                var temp = [];
                for (var i in scope.idValue) {
                    if (val !== scope.idValue[i]) {
                        temp.push(scope.idValue[i]);
                    }
                }
                scope.idValue = temp;
                scope.pickFunc({ params: scope.idValue });
                generateInternalData();
            }

            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });

            }

            function generateData() {

            }

            generateData();

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.$watch('data', function () {
                scope.data = scope.data || [];
                generateInternalData();
            });

            scope.$watch('idValue', function () {
                generateInternalData();
            });
        }
    };
});

myApp.directive("pickUserFromData", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-from-data'),
        scope: {
            label: "@",
            data: "<",
            idValue: "<",
            pickFunc: "&",
            disable: "<",
        },
        link: function (scope, elem) {
            var d = new Date();
            scope._ctrlName = "pick-user-from-data" + d.getTime();
            scope.idValue = scope.idValue || [];

            scope.ctrl = {};

            function generateInternalData() {
                var temp = [];
                for (var i in scope.data) {
                    if (scope.idValue.indexOf(scope.data[i]) === -1) {
                        temp = scope.data[i];
                        break
                    }
                }
                scope.internalData = scope.data;
                $("#" + scope._ctrlName).modal("hide");
                temp = undefined;
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.select = function (val) {
                if (scope.idValue.indexOf(val) === -1) {
                    scope.idValue = [val]
                    scope.pickFunc({ params: scope.idValue });
                }
                generateInternalData();
            }

            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });

            }

            function generateData() {

            }

            generateData();

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.$watch('data', function () {
                scope.data = scope.data || [];
                generateInternalData();
            });

            scope.$watch('idValue', function () {
                generateInternalData();
            });
        }
    };
});

myApp.directive("buttonCheckboxArray", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-checkbox-array'),
        scope: {
            buttonCheckboxArrayData: "<",
            buttonCheckboxArrayKey: "@",
            buttonCheckboxArrayKeyShow: "@",
            buttonCheckboxArrayDisabled: "<",
            buttonCheckboxArrayFunc: "&",
            buttonCheckboxArrayParams: "<",
            buttonCheckboxArrayModel: "=",
            buttonCheckboxArrayLocalization: "<"
        },
        transclude: true,
        link: function (scope) {
            scope.buttonCheckboxArrayModel = scope.buttonCheckboxArrayModel || [];
            scope.buttonCheckboxArrayKey = scope.buttonCheckboxArrayKey || 'key';
            scope.buttonCheckboxArrayKeyShow = scope.buttonCheckboxArrayKeyShow || 'title';

            scope.buttonCheckboxArrayClick = function (item) {
                if (!scope.buttonCheckboxArrayDisabled) {
                    if (item.checked) {
                        item.checked = false;
                        var result = [];
                        for (var i in scope.buttonCheckboxArrayModel) {
                            if (item[scope.buttonCheckboxArrayKey] !== scope.buttonCheckboxArrayModel[i]) {
                                result.push(scope.buttonCheckboxArrayModel[i]);
                            }
                        }
                        scope.buttonCheckboxArrayModel = angular.copy(result);
                        result = undefined;
                    } else {
                        item.checked = true;
                        scope.buttonCheckboxArrayModel.push(item[scope.buttonCheckboxArrayKey]);
                    }
                    scope.buttonCheckboxArrayFunc({ params: { action: item.checked, value: scope.buttonCheckboxArrayParams, ar: scope.buttonCheckboxArrayModel } });
                }
            }
        }
    };
});

myApp.directive("buttonFunc", function () {
    return {
        restrict: "A",
        scope: {
            buttonFunc: '&'
        },
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                e.stopPropagation();
                scope.$apply(function () {
                    scope.buttonFunc();
                });
            });
        }
    };
});

myApp.directive("buttonSearch", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-search'),
        scope: {
            buttonSearchFunc: '&',
            buttonSearchParams: "<",
            buttonSearchStart: "<",
            buttonSearchLabel: "@",
            buttonSearchPlaceholder: "@",
            buttonSearchModel: "="
        },
        transclude: true,
        link: function (scope, elem, attrs) {
            scope.buttonSearchClick = function () {
                if (scope.buttonSearchFunc && !scope.buttonSearchStart) {
                    scope.buttonSearchFunc({ params: scope.buttonSearchParams });
                }
            }
        }
    };
});

myApp.directive("buttonMoreop", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-moreoptions'),
        scope: {
            buttonMoreopModal: '@',
            buttonMoreopLabel: "@"
        }
    };
});

myApp.directive("buttonNew", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-new'),
        scope: {
            buttonNewFunc: '&',
            buttonNewParams: "<",
            buttonNewLabel: "@",
            buttonNewModal: "@",
            buttonNewHideIcon: "@",
            buttonNewDisabled: "<",
        },
        link: function (scope, elem, attrs) {
            scope.buttonNewClick = function () {
                if (scope.buttonNewFunc) {
                    scope.buttonNewFunc({ params: scope.buttonNewParams });
                }
            }
        }
    };
});

myApp.directive("buttonToggleModal", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-toggle-modal'),
        scope: {
            buttonToggleModalFunc: '&',
            buttonToggleModalParams: "<",
            buttonToggleModalLabel: "@",
            buttonToggleModalModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonToggleModalClick = function () {
                if (scope.buttonToggleModalFunc) {
                    scope.buttonToggleModalFunc({ params: scope.buttonToggleModalParams });
                }
            }
        }
    };
});

myApp.directive("buttonCancel", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-cancel'),
        scope: {
            buttonCancelFunc: '&',
            buttonCancelParams: "<",
            buttonCancelLabel: "@",
            buttonCancelModal: "@",
            buttonCancelIdModal: "@",
            buttonCancelDisabled: "<"
        },
        link: function (scope, elem, attrs) {
            scope.buttonCancelClick = function () {
                if (scope.buttonCancelIdModal) {
                    $("#" + scope.buttonCancelIdModal).modal("hide");
                }
                if (scope.buttonCancelFunc) {
                    scope.buttonCancelFunc({ params: scope.buttonCancelParams });
                }
            }
        }
    };
});

myApp.directive("buttonForward", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-forward'),
        scope: {
            buttonForwardFunc: '&',
            buttonForwardParams: "<",
            buttonForwardLabel: "@",
            buttonForwardModal: "@",
        },
        link: function (scope, elem, attrs) {
            scope.buttonForwardClick = function () {
                if (scope.buttonForwardFunc) {
                    scope.buttonForwardFunc({ params: scope.buttonForwardParams });
                }
            }
        }
    };
});

myApp.directive("buttonUpdate", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-update'),
        scope: {
            buttonUpdateFunc: '&',
            buttonUpdateParams: "<",
            buttonUpdateLabel: "@",
            buttonUpdateModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonUpdateClick = function () {
                if (scope.buttonUpdateFunc) {
                    scope.buttonUpdateFunc({ params: scope.buttonUpdateParams });
                }
            }
        }
    };
});

myApp.directive("buttonNewFolder", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-new-folder'),
        scope: {
            buttonNewFunc: '&',
            buttonNewParams: "<",
            buttonNewLabel: "@",
            buttonNewModal: "@",
            isFolder: "@",
            isFile: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonNewClick = function () {
                if (scope.buttonNewFunc) {
                    scope.buttonNewFunc({ params: scope.buttonNewParams });
                }
            }
        }
    };
});

myApp.directive("buttonDeleteall", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-deleteall'),
        scope: {
            buttonDeleteallFunc: '&',
            buttonDeleteallParams: "<",
            buttonDeleteallLabel: "@",
            buttonDeleteallModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonDeleteallClick = function () {
                if (scope.buttonDeleteallFunc) {
                    scope.buttonDeleteallFunc({ params: scope.buttonDeleteallParams });
                }
            }
        }
    };
});

myApp.directive("buttonApproval", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-approval'),
        scope: {
            buttonApprovalFunc: '&',
            buttonApprovalParams: "<",
            buttonApprovalLabel: "@",
            buttonApprovalModal: "@",
            buttonApprovalIdModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonApprovalClick = function () {
                if (scope.buttonApprovalIdModal) {
                    $("#" + scope.buttonApprovalIdModal).modal("hide");
                }
                if (scope.buttonApprovalFunc) {
                    scope.buttonApprovalFunc({ params: scope.buttonApprovalParams });
                }
            }
        }
    };
});

myApp.directive("buttonReject", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-reject'),
        scope: {
            buttonRejectFunc: '&',
            buttonRejectParams: "<",
            buttonRejectLabel: "@",
            buttonRejectModal: "@",
            buttonRejectIdModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonRejectClick = function () {
                if (scope.buttonRejectIdModal) {
                    $("#" + scope.buttonRejectIdModal).modal("hide");
                }
                if (scope.buttonRejectFunc) {
                    scope.buttonRejectFunc({ params: scope.buttonRejectParams });
                }
            }
        }
    };
});

myApp.directive("buttonRestoreall", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-restoreall'),
        scope: {
            buttonRestoreallFunc: '&',
            buttonRestoreallParams: "<",
            buttonRestoreallLabel: "@",
            buttonRestoreallModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonRestoreallClick = function () {
                if (scope.buttonRestoreallFunc) {
                    scope.buttonRestoreallFunc({ params: scope.buttonRestoreallParams });
                }
            }
        }
    };
});
myApp.directive("buttonInfoItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-info-item'),
        scope: {
            buttonInfoItemFunc: '&',
            buttonInfoItemParams: "<",
            buttonInfoItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonInfoClick = function () {
                if (scope.buttonInfoItemFunc) {
                    scope.buttonInfoItemFunc({ params: scope.buttonInfoItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonEditItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-edit-item'),
        scope: {
            buttonEditItemFunc: '&',
            buttonEditItemParams: "<",
            buttonEditItemModal: "@",
            buttonEditItemChangeIcon: "@",
            buttonLabel: "@",
            disabled: "<",
            buttonEditItemClass: "@",
            buttonEditItemIcon: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonEditClick = function () {
                $(`${scope.buttonEditItemModal}`).modal("show");
                if (scope.buttonEditItemFunc && !scope.disabled) {
                    scope.buttonEditItemFunc({ params: scope.buttonEditItemParams });
                }
            };
        }
    };
});
myApp.directive("buttonForwardItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-forward-item'),
        scope: {
            buttonForwardItemFunc: '&',
            buttonForwardItemParams: "<",
            buttonForwardItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonForwardClick = function () {
                if (scope.buttonForwardItemFunc) {
                    scope.buttonForwardItemFunc({ params: scope.buttonForwardItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonApprovalItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-approval-item'),
        scope: {
            buttonApprovalItemFunc: '&',
            buttonApprovalItemParams: "<",
            buttonApprovalItemModal: "@",
            buttonLabel: "@",
            buttonApprovalItemTooltip: "@",
            buttonEditItemClass: "@",
        },
        link: function (scope, elem, attrs) {
            scope.buttonApprovalClick = function () {
                $(`${scope.buttonApprovalItemModal}`).modal("show");
                if (scope.buttonApprovalItemFunc) {
                    scope.buttonApprovalItemFunc({ params: scope.buttonApprovalItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonApprovalItemDispatch", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-approval-item-dispatch'),
        scope: {
            buttonApprovalItemFunc: '&',
            buttonApprovalItemParams: "<",
            buttonApprovalItemModal: "@",
            buttonLabel: "@",
            buttonApprovalItemTooltip: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonApprovalClick = function () {
                if (scope.buttonApprovalItemFunc) {
                    scope.buttonApprovalItemFunc({ params: scope.buttonApprovalItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonRejectItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-reject-item'),
        scope: {
            buttonRejectItemFunc: '&',
            buttonRejectItemParams: "<",
            buttonRejectItemModal: "@",
            buttonLabel: "@",
            buttonRejectItemTooltip: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonRejectClick = function () {
                $(`${scope.buttonRejectItemModal}`).modal("show");
                if (scope.buttonRejectItemFunc) {
                    scope.buttonRejectItemFunc({ params: scope.buttonRejectItemParams });
                }
            }
        }
    };
});
myApp.directive("buttonNewItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-new-item'),
        scope: {
            buttonNewItemFunc: '&',
            buttonNewItemParams: "<",
            buttonNewItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonNewClick = function () {
                if (scope.buttonNewItemFunc) {
                    scope.buttonNewItemFunc({ params: scope.buttonNewItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonRestoreItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-restore-item'),
        scope: {
            buttonRestoreItemFunc: '&',
            buttonRestoreItemParams: "<",
            buttonRestoreItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonRestoreClick = function () {
                if (scope.buttonRestoreItemFunc) {
                    scope.buttonRestoreItemFunc({ params: scope.buttonRestoreItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonBackupItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-backup-item'),
        scope: {
            buttonBackupItemFunc: '&',
            buttonBackupItemParams: "<",
            buttonBackupItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonBackupClick = function () {
                if (scope.buttonBackupItemFunc) {
                    scope.buttonBackupItemFunc({ params: scope.buttonBackupItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonDeleteItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-delete-item'),
        scope: {
            buttonDeleteItemFunc: '&',
            buttonDeleteItemParams: "<",
            buttonDeleteItemModal: "@",
            buttonLabel: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonEditClick = function () {
                $(`${scope.buttonDeleteItemModal}`).modal("show");
                if (scope.buttonDeleteItemFunc) {
                    scope.buttonDeleteItemFunc({ params: scope.buttonDeleteItemParams });
                }
            }
        }
    };
});


myApp.directive("buttonCancelItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-cancel-item'),
        scope: {
            buttonCancelItemFunc: '&',
            buttonCancelItemParams: "<",
            buttonCancelItemModal: "@",
            buttonCancelItemTooltip: "@",
            buttonLabel: "@",
            disabled: "<"
        },
        link: function (scope, elem, attrs) {
            scope.buttonCancelClick = function () {
                if (scope.buttonCancelItemFunc && !scope.disabled) {
                    scope.buttonCancelItemFunc({ params: scope.buttonCancelItemParams });
                }
            };
        }
    };
});

myApp.directive("buttonPauseItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-pause-item'),
        scope: {
            buttonPauseItemFunc: '&',
            buttonPauseItemParams: "<",
            buttonPauseItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonPauseClick = function () {
                if (scope.buttonPauseItemFunc) {
                    scope.buttonPauseItemFunc({ params: scope.buttonPauseItemParams });
                }
            }
        }
    };
});

myApp.directive("buttonResumeItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-resume-item'),
        scope: {
            buttonResumeItemFunc: '&',
            buttonResumeItemParams: "<",
            buttonResumeItemModal: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonResumeClick = function () {
                if (scope.buttonResumeItemFunc) {
                    scope.buttonResumeItemFunc({ params: scope.buttonResumeItemParams });
                }
            }
        }
    };
});


function compareArray_treeviewFilter(ar1, ar2) {
    if (!ar1 || !ar2) { return false; }
    if (ar1.length != ar2.length) { return false; }

    for (var i in ar1) {
        let check = false;
        for (var j in ar2) {
            if (ar1[i] === ar2[j]) { check = true; break; }
        }
        if (!check) { return false; }
    }
    return true;
}

function getChild_treeviewFilter(parentAr, data) {
    var result = [];
    for (var i in data) {
        if (compareArray_treeviewFilter(parentAr, data[i].parent)) {

            result.push(data[i]);
            if (data[i].expand) {
                thisParentAr = angular.copy(parentAr);
                thisParentAr.push(data[i].key);
                var childAr = getChild_treeviewFilter(thisParentAr, data, data[i].key);
                for (var j in childAr) {
                    result.push(childAr[j]);
                }
            }
        }
    }

    return result;
}

myApp.filter('treeviewFilter', function () {
    return function (data) {
        if (!data || !data.length || data.length == 0) { return []; }
        var result = getChild_treeviewFilter([], data);
        return result;
    }
}).
    directive("treeviewHeader", function () {
        return {
            restrict: "E",
            templateUrl: get_Url_Directive_Html('treeview-header'),
            scope: {
                treeviewHeaderFunc: "&",
                treeviewHeaderLabel: "@",
                treeviewHeaderItem: "=",
                treeviewHeaderKey: "@",
                treeviewHeaderIconKey: "@",
                treeviewHeaderParams: "<"
            },
            link: function (scope, elem, attrs) {
                scope.treeviewHeaderKey = scope.treeviewHeaderKey || "parent";
                scope.treeviewHeaderIconKey = scope.treeviewHeaderIconKey || "icon";
                scope.treeviewHeaderChildKey = scope.treeviewHeaderChildKey || "child";
                elem.bind('click', function (e) {
                    e.stopPropagation();
                    scope.$apply(function () {
                        scope.treeviewHeaderItem.expand = scope.treeviewHeaderItem.expand ? false : true;
                        scope.treeviewHeaderFunc({ params: { action: scope.treeviewHeaderItem.expand, value: scope.treeviewHeaderParams } });
                    });
                });
            }
        };
    });

myApp.filter('treeviewSelect_choosen', function () {
    return function (data, item, key) {
        if (!data) { return []; }

        if (!item || !key) { return data; }
        for (var i in data) {
            if (data[i].parent.indexOf(item[key]) !== -1) {
                data[i].expand = true;
            }
        }
        return data;
    }
}).
    directive('treeviewSelect', function () {
        return {
            restrict: "E",
            templateUrl: get_Url_Directive_Html('treeview-select'),
            scope: {
                treeviewSelectData: "<",
                treeviewSelectLocalization: "<",
                treeviewSelectKey: "@",
                treeviewSelectModel: "=",
                treeviewSelectFunc: "&",
                treeviewSelectParams: "<"
            },
            link: function (scope, elem, attrs) {
                scope.treeviewSelectClick = function (val) {
                    scope.treeviewSelectModel = val;
                    scope.treeviewSelectFunc({ params: { value: scope.treeviewSelectModel, params: scope.treeviewSelectParams } });
                }
            }
        }
    });
myApp.directive("myAsync", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('async'),
        transclude: {
            doing: '?asyncDoing',
            success: '?asyncSuccess',
            fail: '?asyncFail',
            default: '?asyncDefault'
        },
        scope: {
            asyncCtrlname: "@",
            asyncObjname: "@",
            asyncActionname: "@",
            asyncStatusLabel: "@"
        }
    };
});

myApp.directive('modalToggle', function () {
    return {
        restrict: "A",
        scope: {
            modalToggle: "@"
        },
        link: function (scope, elem) {
            if (scope.modalToggle) {
                elem.bind('click', function (e) {
                    e.stopPropagation();
                    $(scope.modalToggle).modal("show");
                });
            }
        }
    }
});
myApp.directive('vldSync', function () {
    return {
        scope: {
            vldSyncParams: "<",
            vldSyncFunc: "&"
        },
        require: 'ngModel',
        link: function (scope, element, attributes, control) {
            if (scope.vldSyncFunc) {
                control.$validators.vldsync = function (modelValue, viewValue) {

                    if (control.$isEmpty(modelValue) || modelValue === "") // if empty, correct value
                    {
                        return true;
                    }

                    return scope.vldSyncFunc({ model: modelValue, params: scope.vldSyncParams });
                };
            }
        }
    }
});

myApp.directive('vldAsync', ['$q', '$timeout', function ($q, $timeout) {
    return {
        scope: {
            vldAsyncParams: "<",
            vldAsyncFunc: "&"
        },
        require: 'ngModel',
        link: function (scope, element, attributes, control) {
            if (scope.vldAsyncFunc) {
                control.$asyncValidators.vldasync = function (modelValue, viewValue) {
                    if (control.$isEmpty(modelValue) || modelValue === "") {
                        return $q.when();
                    }
                    var temp = modelValue;
                    var dfd = $q.defer();
                    $timeout(function () {
                        if (temp === modelValue) {
                            scope.vldAsyncFunc({ model: modelValue, params: scope.vldAsyncParams }).then(function () {
                                dfd.resolve(true);
                            }, function () {
                                dfd.reject(false);
                            });
                        } else {
                            dfd.resolve(true);
                        }
                    }, idleTime);
                    return dfd.promise;
                };
            }
        }
    }
}]);

myApp.directive('chooseUsergroup', ["$rootScope", function ($rootScope) {

    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        scope: {
            ssChoosen: "="
        },

        link: function (scope) {
            scope.showtbdoituong = true;
            scope.showchoncanhan = true;
            scope.showgroup = true;
            scope.chon = {};

            scope.url = get_Url_Directive_Html('chooseusergroup');
            scope.userar = angular.copy($rootScope.Users);
            scope.groupar = angular.copy($rootScope.Groups);
            scope.chon.selecteduser = scope.userar[0]
            scope.chon.selectedgroup = scope.groupar[0]
            scope.chooseUser = function () {
                for (var i in scope.userar) {
                    scope.userar[i].selected = []
                }
                for (var i in scope.userar) {
                    if (scope.userar[i].username == scope.chon.selecteduser.username) {
                        scope.userar[i].selected.push(scope.chon.selecteduser);
                    }

                }

                for (var i in scope.userar) {
                    if (scope.userar[i].selected.length > 0) {
                        scope.userar[i].selected = false;
                        scope.ssChoosen.username.push(scope.userar[i].username);

                    }
                }

                if (scope.ssChoosen.username.length == 0 && scope.ssChoosen.group.length == 0) {

                    scope.showtbdoituong = true;
                } else {
                    scope.showtbdoituong = false;
                }
                for (var i in scope.userar) {
                    for (var j in scope.ssChoosen.username) {
                        if (scope.userar[i].username != scope.ssChoosen.username[j]) {
                            scope.chon.selecteduser = scope.userar[i]
                        }

                    }
                }
                if (scope.userar.length == scope.ssChoosen.username.length) {
                    scope.showchoncanhan = false;
                }
            }

            scope.chooseGroup = function () {
                for (var i in scope.groupar) {
                    scope.groupar[i].selected = []
                }
                for (var i in scope.groupar) {
                    if (scope.groupar[i].Title == scope.chon.selectedgroup.Title) {
                        scope.groupar[i].selected.push(scope.chon.selectedgroup);
                    }

                }

                for (var i in scope.groupar) {
                    if (scope.groupar[i].selected.length > 0) {
                        scope.groupar[i].selected = false;
                        scope.ssChoosen.group.push(scope.groupar[i].id);

                    }
                }
                if (scope.ssChoosen.username.length == 0 && scope.ssChoosen.group.length == 0) {

                    scope.showtbdoituong = true;
                } else {
                    scope.showtbdoituong = false;
                }
                for (var i in scope.groupar) {
                    for (var j in scope.ssChoosen.group) {
                        if (scope.groupar[i].id != scope.ssChoosen.group[j]) {
                            scope.chon.selectedgroup = scope.groupar[i]
                        }
                    }
                }
                if (scope.groupar.length == scope.ssChoosen.group.length) {
                    scope.showgroup = false;
                }

            }
            //scope.chooseGroup = function () {
            //    for (var i in scope.groupar) {
            //        if (scope.groupar[i].selected) {
            //            scope.groupar[i].selected = false;
            //            scope.ssChoosen.group.push(scope.groupar[i].id);
            //        }
            //    }
            //}
            scope.removeUser = function (username) {
                var temp = [];
                for (var i in scope.ssChoosen.username) {
                    if (scope.ssChoosen.username[i] != username) {
                        temp.push(angular.copy(scope.ssChoosen.username[i]));
                    }
                }
                scope.ssChoosen.username = temp;
                if (scope.ssChoosen.username.length == 0 && scope.ssChoosen.group.length == 0) {

                    scope.showtbdoituong = true;
                } else {
                    scope.showtbdoituong = false;
                }
                for (var i in scope.userar) {
                    for (var j in scope.ssChoosen.username) {
                        if (scope.userar[i].username != scope.ssChoosen.username[j]) {
                            scope.chon.selecteduser = scope.userar[i]
                        }

                    }
                }
                if (scope.userar.length != scope.ssChoosen.username.length) {
                    scope.showchoncanhan = true;
                }
            }

            scope.removeGroup = function (id) {
                var temp = [];
                for (var i in scope.ssChoosen.group) {
                    if (scope.ssChoosen.group[i] != id) {
                        temp.push(angular.copy(scope.ssChoosen.group[i]));
                    }
                }
                scope.ssChoosen.group = temp;
                if (scope.ssChoosen.username.length == 0 && scope.ssChoosen.group.length == 0) {

                    scope.showtbdoituong = true;
                } else {
                    scope.showtbdoituong = false;
                }
                for (var i in scope.groupar) {
                    for (var j in scope.ssChoosen.group) {
                        if (scope.groupar[i].id != scope.ssChoosen.group[j]) {
                            scope.chon.selectedgroup = scope.groupar[i]
                        }
                    }
                }
                if (scope.groupar.length != scope.ssChoosen.group.length) {
                    scope.showgroup = true;
                }
            }

        }
    }
}]);

myApp.directive("imgUpload", function ($http, $compile) {
    return {
        restrict: 'AE',
        scope: {
            url: "@",
            method: "@"
        },
        template: '<input class="fileUpload" type="file" multiple />' +
            '<div class="dropzone">' +
            '<p class="msg">Click or Drag and Drop files to upload</p>' +
            '</div>' +
            '<div class="preview clearfix">' +
            '<div class="previewData clearfix" ng-repeat="data in previewData track by $index">' +
            '<img src={{data.src}}></img>' +
            '<div class="previewDetails">' +
            '<div class="detail"><b>Name : </b>{{data.name}}</div>' +
            '<div class="detail"><b>Type : </b>{{data.type}}</div>' +
            '<div class="detail"><b>Size : </b> {{data.size}}</div>' +
            '</div>' +
            '<div class="previewControls">' +
            '<span ng-click="upload(data)" class="circle upload">' +
            '<i class="fa fa-check"></i>' +
            '</span>' +
            '<span ng-click="remove(data)" class="circle remove">' +
            '<i class="fa fa-close"></i>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>',
        link: function (scope, elem, attrs) {
            var formData = new FormData();
            scope.previewData = [];

            function previewFile(file) {
                var reader = new FileReader();
                var obj = new FormData().append('file', file);
                reader.onload = function (data) {
                    var src = data.target.result;
                    var size = ((file.size / (1024 * 1024)) > 1) ? (file.size / (1024 * 1024)) + ' mB' : (file.size / 1024) + ' kB';
                    scope.$apply(function () {
                        scope.previewData.push({
                            'name': file.name,
                            'size': size,
                            'type': file.type,
                            'src': src,
                            'data': obj
                        });
                    });

                }
                reader.readAsDataURL(file);
            }

            function uploadFile(e, type) {
                e.preventDefault();
                var files = "";
                if (type == "formControl") {
                    files = e.target.files;
                } else if (type === "drop") {
                    files = e.originalEvent.dataTransfer.files;
                }
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (file.type.indexOf("image") !== -1) {
                        previewFile(file);
                    } else {
                        alert(file.name + " is not supported");
                    }
                }
            }
            elem.find('.fileUpload').bind('change', function (e) {
                uploadFile(e, 'formControl');
            });

            elem.find('.dropzone').bind("click", function (e) {
                $compile(elem.find('.fileUpload'))(scope).trigger('click');
            });

            elem.find('.dropzone').bind("dragover", function (e) {
                e.preventDefault();
            });

            elem.find('.dropzone').bind("drop", function (e) {
                uploadFile(e, 'drop');
            });
            scope.upload = function (obj) {
                $http({
                    method: scope.method,
                    url: scope.url,
                    data: obj.data,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (data) {

                });
            }

            scope.remove = function (data) {
                var index = scope.previewData.indexOf(data);
                scope.previewData.splice(index, 1);
            }
        }
    }
});
myApp.directive("ngFileSelect", function (fileReader, $timeout) {

    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {

            function getFile(file) {

                fileReader.readAsDataURL(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});

myApp.directive("fileReading", ["$rootScope", function ($rootScope) {
    return {
        scope: {
            fileReading: "=",
            fileFunc: "&",
            fileZipFunc: "&",
            maxFileSize: "@",
            onFileExceedsLimit: "&",
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var maxFileSize = scope.maxFileSize;
                scope.fileReading = scope.fileReading || [];
                var reader = new FileReader();
                reader.onloadend = function (loadEvent) {
                    scope.$apply(function () {
                        for (var i = 0; i < element[0].files.length; i++) {
                            if (maxFileSize && element[0].files[i].size > maxFileSize * 1024 * 1024) {
                                scope.onFileExceedsLimit({
                                    params: {
                                        error: true
                                    }
                                })
                            }
                            else {
                                if (checkFile(element[0].files[i].name, scope.fileReading)) {
                                    scope.onFileExceedsLimit({
                                        params: {
                                            error: false
                                        }
                                    })
                                    scope.fileReading.push({
                                        file: element[0].files[i],
                                        name: element[0].files[i].name,
                                        loaifile: element[0].files[i].name.split(".")[1],
                                        content: loadEvent.target.result
                                    });
                                    scope.fileFunc({
                                        params: {
                                            file: element[0].files[i],
                                            name: element[0].files[i].name,
                                            loaifile: element[0].files[i].name.split(".")[1]
                                        }
                                    })
                                }
                            }
                        }

                    });
                }

                reader.readAsDataURL(changeEvent.target.files[0]);

                var readerForZip = new FileReader();
                readerForZip.onload = function (event) {
                    const fileData = event.target.result;

                    let zip;
                    try {
                        zip = new PizZip(fileData);
                    } catch (error) {
                        
                    }
                    const fileName = changeEvent.target.files[0].name;
                    scope.$apply(function () {
                        scope.fileZipFunc({
                            params: {
                                zip,
                                fileName
                            }
                        })

                    });
                };

                readerForZip.readAsBinaryString(changeEvent.target.files[0]);
            });

            function checkFile(fileName, Ar) {
                for (var i = 0; i < Ar.length; i++) {
                    if (Ar[i].name == fileName) { return false; }
                }
                return true;
            }

            function strToArrayBuffer(str) {
                var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
                var bufView = new Uint16Array(buf);
                for (var i = 0, strLen = str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
            }
        }
    }
}]);

myApp.directive("fileReadingExcelTemplate", ["$rootScope", function ($rootScope) {
    return {
        scope: {
            fileReadingExcelTemplate: "=",
            fileFuncExcelTemplate: "&",
            fileZipFuncExcelTemplate: "&"
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.fileReadingExcelTemplate = scope.fileReadingExcelTemplate || [];
                var newFile = changeEvent.target.files[0];
                if (newFile) {
                    element[0].value = "";
                    var fileType = newFile.name.split('.').pop().toLowerCase();
                    if (fileType === 'xlsx' || fileType === 'xls') {
                        if (newFile.size <= 5 * 1024 * 1024) {
                            scope.$apply(function () {
                                scope.fileReadingExcelTemplate[0] = newFile;
                            });

                        }
                    }
                }
                scope.fileFuncExcelTemplate({
                    params: {
                        file: newFile,
                        name: newFile.name,
                        loaifile: fileType,
                        originalFile: changeEvent.target.files
                    }
                });
            })
        }
    }
}]);

myApp.directive("fileReadingSingle", ["$rootScope", function ($rootScope) {
    return {
        scope: {
            fileReadingSingle: "=",
            fileSingleFunc: "&",
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onloadend = function (loadEvent) {
                    scope.$apply(function () {
                        if (element[0].files.length) {
                            const file = element[0].files[0];
                            scope.fileReadingSingle = {
                                file: file,
                                name: file.name,
                                loaifile: file.name.split(".")[1],
                                content: loadEvent.target.result
                            };
                            scope.fileSingleFunc({
                                params: {
                                    file: file,
                                    name: file.name,
                                    loaifile: file.name.split(".")[1]
                                }
                            });
                        }
                    });
                };

                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);



myApp.directive("fileReadingExcel", ["$rootScope", function ($rootScope) {
    return {
        scope: {
            fileReadingExcel: "=",
            fileExcelFunc: "&"
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.fileReading = scope.fileReading || [];
                var reader = new FileReader();
                reader.onload = function (e) {
                    scope.$apply(function () {
                        scope.fileExcelFunc({
                            params: e.target.result
                        })

                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}]);


myApp.directive("attachmentSingle", function () {
    return {
        restrict: "A",
        scope: {
            attachmentSingleFunc: "&",
            attachmentSingleParams: "<"
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onloadend = function (loadEvent) {
                    scope.$apply(function () {

                        scope.attachmentSingleFunc({
                            params: {
                                file: { file: element[0].files[0], name: element[0].files[0].name, filetype: element[0].files[0].name.split(".")[element[0].files[0].name.split(".").length - 1] },
                                params: scope.attachmentSingleParams
                            }
                        });
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
});

myApp.directive("attachmentMultiple", function () {
    return {
        restrict: "A",
        scope: {
            attachmentMultipleFunc: "&",
            attachmentMultipleParams: "<"
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();

                reader.onloadend = function (loadEvent) {

                    scope.$apply(function () {
                        let files = [];

                        for (let index = 0; index < element[0].files.length; index++) {

                            files.push({
                                file: element[0].files[index],
                                name: element[0].files[index].name,
                                filetype: element[0].files[index].name.split('.')[element[0].files[index].name.split('.').length - 1],
                            });
                        }

                        scope.attachmentMultipleFunc({
                            params: {
                                files: files,
                                params: scope.attachmentMultipleParams
                            }
                        });
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
});


myApp.directive("attachment", ["$rootScope", function ($rootScope) {
    return {
        scope: {
            attachmentModel: "="
        },
        template: '<div ng-include="url"></div>',
        link: function (scope, element, attributes) {
            scope.url = get_Url_Directive_Html('attachment');
            scope.removetep = function (item) {
                var temp = [];
                for (var i = 0; i < scope.attachmentModel.length; i++) {
                    if (item.name != scope.attachmentModel[i].name) {
                        temp.push(scope.attachmentModel[i]);
                    }
                }
                scope.attachmentModel = temp;
            }
        }
    }
}]);

myApp.directive('attachmentShow', ['$rootScope', function ($rootScope) {
    return {
        scope: {
            attachmentShowItem: "=",
            attachmentShowFunc: "&",
            attachmentShowParams: "<",
            attachmentShowServiceName: "=",
            attachmentShowReview: "<",
            attachmentShowOwner: "="
        },
        templateUrl: get_Url_Directive_Html('attachment-show'),
        link: function (scope) {
            const maxLength = 1000;
            scope.attachmentShowItem = scope.attachmentShowItem || {};
            if (scope.attachmentShowReview === undefined) {
                scope.attachmentShowReview = true;
            }
            scope.attachmentShowFileType = scope.attachmentShowItem.name ? scope.attachmentShowItem.name.split(".")[scope.attachmentShowItem.name.split(".").length - 1] : "any";
            if (scope.attachmentShowOwner) {
                scope.ownerUsername = scope.attachmentShowItem.owner;
            }

            if (scope.attachmentShowItem.display !== undefined) {
                if (scope.attachmentShowItem.display.length > maxLength) {
                    scope.attachmentShowLabel = scope.attachmentShowItem.display.substring(0, maxLength) + "...";
                } else {
                    scope.attachmentShowLabel = scope.attachmentShowItem.display;
                }
            }

            scope.attachmentShowClick = function () {
                if (!scope.attachmentShowReview) {
                    scope.attachmentShowFunc({ params: scope.attachmentShowParams });
                } else {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $rootScope.statusValue.generate($rootScope._ctrlName, 'File', 'load');
                    $rootScope.FileService.bind({ display: '', embedUrl: '/component/loading.html' });
                    $rootScope.FileService.show();
                    $rootScope.statusValue.execute($rootScope._ctrlName, 'File', 'load', scope.attachmentShowFunc({ params: scope.attachmentShowParams })).then(
                        function (data) {
                            $rootScope.FileService.bind({
                                display: data.display,
                                embedUrl: data.embedUrl,
                                serviceName: scope.attachmentShowServiceName,
                                attachmentId: scope.attachmentShowParams.id || '',
                            });
                        },
                        function (err) { }
                    );
                }

            }
        }
    }
}]);

myApp.directive('attachmentJustShow', ['$rootScope', function ($rootScope) {
    return {
        scope: {
            myItem: "<"

        },
        templateUrl: get_Url_Directive_Html('attachment-just-show'),
        link: function (scope) {
            scope.$watch('myItem', function () {
                scope.myType = "";
                if (scope.myItem.name) {
                    scope.myType = scope.myItem.name.split(".")[scope.myItem.name.split(".").length - 1];
                    scope.myItem.tempName = scope.myItem.name.substring(0, 14);
                }
            });
        }
    }
}]);

myApp.directive('attachmentEdit', ['$rootScope', function ($rootScope) {
    return {
        templateUrl: get_Url_Directive_Html('attachment-edit'),
        scope: {
            attachmentEditData: "<",
            attachmentEditItemid: "<",
            attachmentEditCtrlname: "@",
            attachmentEditObjname: "@",
            attachmentEditActionname: "@",
            attachmentEditLoadfunc: "&",
            attachmentEditRemovefunc: "&",
            attachmentEditUploadfunc: "&"
        },
        link: function (scope) {
            scope.upload = function (params) {
                scope.attachmentEditUploadfunc({ params: { file: params.file } });
            }
        }
    }
}]);

myApp.directive("openDialog", function () {
    return {
        restrict: "A",
        scope: {
            openDialog: "@"
        },
        link: function (scope, elem) {
            elem.bind('click', function (e) {
                e.stopPropagation();
                $("#" + scope.openDialog).trigger("click");
            });
        }
    }
});

myApp.directive('linkDetails', ['$rootScope', function ($rootScope) {
    return {
        restrict: "A",
        scope: {
            linkDetailsDisplay: "@",
            linkDetailsCode: "@",
            linkDetailsPrefix: "@",
            linkDetailsUrl: "@",
            linkDetailsRoute: "@",
            linkDetailsFunc: "&",
            linkDetailsParams: "<",
            taskState: "@",
            department: "@",
            chooseDepartment: "&",
            linkDetailsStep: "@",
            linkDetailsChangeStatus: "<",
            disabledBreadcrumb: "<",
            linkDetailsShowDirectory: "@",
            linkDetailsDisplayDirectory: "&",

        },
        link: function (scope, elem) {
            elem.bind('click', function (e) {
                e.stopPropagation();
                scope.$apply(function () {
                    let titleDirectory = "";
                    if (scope.linkDetailsShowDirectory) {
                        titleDirectory = scope.linkDetailsDisplayDirectory();
                    }
                    $rootScope.DetailsInfoService.bind({
                        display: scope.linkDetailsDisplay,
                        code: scope.linkDetailsCode,
                        route: scope.linkDetailsRoute,
                        url: scope.linkDetailsUrl,
                        func: scope.linkDetailsFunc,
                        params: scope.linkDetailsParams,
                        prefix: scope.linkDetailsPrefix,
                        state: scope.taskState,
                        department: scope.department,
                        chooseDepartment: scope.chooseDepartment,
                        step: scope.linkDetailsStep,
                        changeStatus: scope.linkDetailsChangeStatus,
                        disabledBreadcrumb: scope.disabledBreadcrumb,
                        showDirectory: scope.linkDetailsShowDirectory,
                        titleDirectory
                    });
                    $rootScope.DetailsInfoService.show();
                });
            });
        }
    }
}]);

myApp.directive('filebox', ['$q', 'fRoot', function ($q, fRoot) {
    {
        return {
            templateUrl: get_Url_Directive_Html('filebox'),
            link: function (scope) {
                scope.downloadFile = function (filename, funcName, id) {
                    var dfd = $q.defer();
                    fRoot.requestHTTP({
                        url: BackendDomain + `/office/${funcName}/downloadfile`,
                        method: "POST",
                        data: JSON.stringify({ filename, id }),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (res) {
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

                        const fileExtension = filename.toLowerCase().slice(-4);
                        if (imageExtensions.includes(fileExtension)) {
                            fetch(res.data)
                                .then((response) => response.blob()) // Chuyển đổi dữ liệu thành Blob
                                .then((blob) => {
                                    FileSaver.saveAs(blob, filename);
                                })
                                .catch((error) => {
                                    console.error('Lỗi tải xuống tệp:', error);
                                });
                        } else {
                            window.open(res.data);
                        }

                        dfd.resolve(res.data);
                    }, function (err) {
                        dfd.reject(err);
                    });
                    return dfd.promise;
                }
            }
        }
    }
}]);

myApp.directive('detailsbox', function () {
    return {
        templateUrl: get_Url_Directive_Html('detailsbox')
    }
});


myApp.directive('usernamesShow', ['$rootScope', function ($rootScope) {
    return {
        scope: {
            usernamesShowData: "<",
            usernamesShowAvatar: "<",
            usernamesShowType: "@"
        },
        templateUrl: get_Url_Directive_Html('usernames-show'),
        link: function (scope) {
            scope.usernamesShowData = scope.usernamesShowData || [];

            $rootScope.$watchGroup(['Persons', 'Users'], function () {

                scope.usernamesShowItems = [];
                for (var i in scope.usernamesShowData) {
                    var check = true;
                    for (var j in $rootScope.Persons) {
                        if ($rootScope.Persons[j].username === scope.usernamesShowData[i] && $rootScope.Persons[j].username !== undefined) {
                            if (scope.usernamesShowType) {
                                switch (scope.usernamesShowType) {
                                    case "short":
                                        scope.usernamesShowItems.push({
                                            display: $rootScope.Persons[j].firstname,
                                        });
                                        break;
                                }
                            } else {
                                scope.usernamesShowItems.push({
                                    display: $rootScope.Persons[j].fullname,
                                });
                            }

                            check = false;
                            break;
                        }
                    }
                    if (check) {
                        for (var j in $rootScope.Users) {
                            if ($rootScope.Users[j].username === scope.usernamesShowData[i]) {
                                scope.usernamesShowItems.push({
                                    display: $rootScope.Users[j].title,
                                    avatar: $rootScope.Users[j].avatar
                                });
                                break;
                            }
                        }
                    } else {
                        for (var j in $rootScope.Users) {
                            if ($rootScope.Users[j].username === scope.usernamesShowData[i]) {
                                scope.usernamesShowItems[scope.usernamesShowItems.length - 1].avatar = $rootScope.Users[j].avatar;
                                break;
                            }
                        }
                    }
                }
            });


        }
    }
}]);

myApp.directive("myWatchTextInput", ['$timeout', function ($timeout) {
    return {
        restrict: "A",
        scope: {
            myScope: "=",
            myStart: "=",
            myFunc: "&",
            myDelay: "="
        },
        link: function (scope) {
            var timer = null;
            scope.$watch('myScope', function (newVal, oldVal) {
                if (scope.myStart && newVal !== oldVal) {
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                    timer = $timeout(scope.myFunc, scope.myDelay || 700);
                }
            });
        }
    };
}]);

myApp.directive("myAutocompleSync", function () {
    return {
        restrict: "E",
        scope: {
            acpScope: "=",
            acpData: "=",
            acpMinSearch: "<",
            acpSearchTimeout: "<",
            acpPlaceholder: "<",
            acpChangeFunc: "&"
        },
        templateUrl: get_Url_Directive_Html('autocompletesync'),
        link: function (scope, element, attributes) {
            var defaultValue = {
                dataSource: [],
                minSearchLength: 1,
                searchTimeout: idleTime,
                placeholder: "",
                onValueChanged: function () { }
            };

            scope.option = {};
            scope.acpData ? scope.option.dataSource = scope.acpData : scope.option.dataSource = defaultValue.dataSource;
            scope.acpMinSearch ? scope.option.minSearchLength = scope.acpMinSearch : scope.option.minSearchLength = defaultValue.minSearchLength;
            scope.acpSearchTimeout ? scope.option.searchTimeout = scope.acpSearchTimeout : scope.option.searchTimeout = defaultValue.searchTimeout;
            scope.acpPlaceholder ? scope.option.placeholder = scope.acpPlaceholder : scope.option.placeholder = defaultValue.placeholder;
            scope.acpChangeFunc ? scope.option.onValueChanged = scope.acpChangeFunc : scope.option.onValueChanged = defaultValue.onValueChanged;
        },

    }
});


myApp.filter('selectMultiPerson_filterPerson', function () {
    return function (department, data, choosen) {
        if (!department || !data) { return []; }
        var result = [];
        for (var i in data) {
            if (data[i].department === department) {
                if (!choosen) {
                    result.push(data[i]);
                } else {
                    var check = true;
                    for (var j in choosen) {
                        if (choosen[j].phonenumber === data[i].phonenumber) {
                            check = false;
                            break;
                        }
                    }
                    if (check) {
                        result.push(data[i]);
                    }
                }
            }
        }
        return result;
    }
})
    .filter('selectMultiPerson_filterChief', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'chief') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .filter('selectMultiPerson_filterDeputy', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'deputy') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .filter('selectMultiPerson_filterPersonnel', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'personnel') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .directive('selectMultiPerson', ['$rootScope', '$filter', function ($rootScope, $filter) {
        return {
            scope: {
                selectMultiPersonModel: "=",
                selectMultiPersonLabel: "@",
                selectMultiPersonModal: "@",
                selectMultiPersonHierarchy: "<",
                selectMultiPersonFunc: "&",
                selectMultiPersonParams: "<"
            },
            templateUrl: get_Url_Directive_Html('select-multi-person'),
            link: function (scope) {
                scope.selectMultiPersonModel = scope.selectMultiPersonModel || [];
                scope.selectMultiPerson_Data = [];
                var departmentData = angular.copy($rootScope.Departments);
                scope.setTreeviewData = function () {
                    scope.selectMultiPerson_Data = $filter('treeviewFilter')(departmentData);
                }
                scope.setTreeviewData();
                scope.selectMultiPerson_choose = function (item) {
                    scope.selectMultiPersonModel.push(item);
                    scope.selectMultiPersonFunc({ params: { val: scope.selectMultiPersonModel, params: scope.selectMultiPersonParams, action: 'add' } });
                }

                scope.selectMultiPerson_unchoose = function (item) {
                    var temp = [];
                    for (var i in scope.selectMultiPersonModel) {
                        if (item._id !== scope.selectMultiPersonModel[i]._id) {
                            temp.push(scope.selectMultiPersonModel[i]);
                        }
                    }
                    scope.selectMultiPersonModel = angular.copy(temp);
                    scope.selectMultiPersonFunc({ params: { val: scope.selectMultiPersonModel, params: scope.selectMultiPersonParams, action: 'remove' } });
                    temp = undefined;
                }

            }
        }
    }]);

myApp.filter('selectMultiDepartment_filter', function () {
    return function (item, data) {
        if (!data || !item) { return false; }
        for (var i in data) {
            if (item.parent.indexOf(data[i].key) !== -1) { return true; }
            if (data[i].key === item.key) { return true; }
        }
        return false;
    }
})
    .directive('selectMultiDepartment', ['$rootScope', '$filter', function ($rootScope, $filter) {
        return {
            scope: {
                selectMultiDepartmentModel: "=",
                selectMultiDepartmentLabel: "@",
                selectMultiDepartmentModal: "@",
                selectMultiDepartmentFunc: "&",
                selectMultiDepartmentParams: "<"
            },
            templateUrl: get_Url_Directive_Html('select-multi-department'),
            link: function (scope) {
                scope.selectMultiDepartmentModel = scope.selectMultiDepartmentModel || [];
                var departmentData = angular.copy($rootScope.Departments);
                scope.setTreeviewData = function () {
                    scope.selectMultiDepartment_Data = $filter('treeviewFilter')(departmentData);
                }
                scope.selectMultiDepartment_choose = function (item) {
                    scope.selectMultiDepartmentModel.push(item);
                    scope.selectMultiDepartmentFunc({ params: { val: scope.selectMultiDepartmentModel, params: scope.selectMultiDepartmentParams, action: 'add' } });
                }

                scope.selectMultiDepartment_unchoose = function (item) {
                    var temp = [];
                    for (var i in scope.selectMultiDepartmentModel) {
                        if (item.key !== scope.selectMultiDepartmentModel[i].key) {
                            temp.push(scope.selectMultiDepartmentModel[i]);
                        }
                    }
                    scope.selectMultiDepartmentModel = angular.copy(temp);
                    scope.selectMultiDepartmentFunc({ params: { val: scope.selectMultiDepartmentModel, params: scope.selectMultiDepartmentParams, action: 'remove' } });
                    temp = undefined;
                }
                scope.setTreeviewData();
            }
        }
    }]);


myApp.filter('selectSinglePerson_filterPerson', function () {
    return function (department, data) {
        if (!department || !data) { return []; }
        var result = [];
        for (var i in data) {
            if (data[i].department === department) {
                result.push(data[i]);
            }
        }
        return result;
    }
})
    .filter('selectSinglePerson_filterChief', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'chief') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .filter('selectSinglePerson_filterDeputy', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'deputy') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .filter('selectSinglePerson_filterPersonnel', function () {
        return function (data) {
            if (!data) { return []; }
            var result = [];
            for (var i in data) {
                if (data[i].position === 'personnel') {
                    result.push(data[i]);
                }
            }
            return result;
        }
    })
    .directive('selectSinglePerson', ['$rootScope', '$filter', function ($rootScope, $filter) {
        return {
            scope: {
                selectSinglePersonModel: "=",
                selectSinglePersonLabel: "@",
                selectSinglePersonModal: "@",
                selectSinglePersonHierarchy: "<",
                selectSinglePersonFunc: "&",
                selectSinglePersonParams: "<"
            },
            templateUrl: get_Url_Directive_Html('select-single-person'),
            link: function (scope) {
                scope.selectSinglePersonModel = scope.selectSinglePersonModel || {};
                scope.selectSinglePerson_Data = [];
                var departmentData = angular.copy($rootScope.Departments);
                scope.setTreeviewData = function () {
                    scope.selectSinglePerson_Data = $filter('treeviewFilter')(departmentData);
                }
                scope.setTreeviewData();
                scope.selectSinglePerson_choose = function (item) {
                    scope.selectSinglePersonModel = item;
                    scope.selectSinglePersonFunc({ params: { val: scope.selectSinglePersonModel, params: scope.selectSinglePersonParams, action: 'choose' } });
                }

                scope.selectSinglePerson_unchoose = function () {
                    scope.selectSinglePersonModel = {};
                    scope.selectSinglePersonFunc({ params: { val: scope.selectSinglePersonModel, params: scope.selectSinglePersonParams, action: 'unchoose' } });
                }
            }
        }
    }]);

myApp.directive("iconDetails", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('icon-details'),
        transclude: true,
        scope: {
            iconDetailsModifier: "@"
        },
        link: function (scope) {
            scope.iconDetailsModifier = scope.iconDetailsModifier || "";
        }
    };
});

myApp.directive("iconEvents", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('icon-events'),
        transclude: true,
        scope: {
            iconEventsModifier: "@"
        },
        link: function (scope) {
            scope.iconEventsModifier = scope.iconEventsModifier || "";
        }
    };
});
myApp.directive("showDuration", ['$rootScope', '$filter', function ($rootScope, $filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-duration'),
        transclude: true,
        scope: {
            fromDate: "=",
            toDate: "=",
        },
        link: function (scope) {
            scope.count_deadline = "";
            function init_() {
                if (scope.fromDate > scope.toDate) {
                    scope.count_deadline = `0 ${$filter('l')('Day')}`
                } else {
                    scope.count_deadline = `${Math.floor(Math.abs(scope.toDate - scope.fromDate) / (1000 * 60 * 60 * 24))} ${$filter('l')('Day')}`;
                }
            }
            scope.$watch('fromDate', function (val) {
                init_();
            }, true);
            scope.$watch('toDate', function (val) {
                init_();
            }, true);
        }
    }
}]);
myApp.directive("timeShow", ['$rootScope', '$filter', function ($rootScope, $filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('time-show'),
        transclude: true,
        scope: {
            timeShowData: "<",
            timeShowType: "@",
            bindObject: "<"
        },
        link: function (scope) {
            scope.timeShowLabel = "";



            function init_() {
                scope.timeShowLabel = "";
                scope.timeShowData = parseInt(scope.timeShowData + "");
                if (scope.timeShowData) {

                    var d = scope.bindObject ? scope.timeShowData : new Date(scope.timeShowData);

                    if (scope.timeShowType) {

                        switch (scope.timeShowType) {
                            case "short":
                                var thisD = new Date();
                                var distance = thisD.getTime() - scope.timeShowData;
                                if (distance > (1000 * 60 * 60 * 24 * 365)) {
                                    if ($rootScope.Language.current === 'vi-VN') {
                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) + " năm";
                                    } else {
                                        if (Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) === 1) {
                                            scope.timeShowLabel = "a year";
                                        } else {
                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) + " years";
                                        }
                                    }
                                } else {
                                    if (distance > (1000 * 60 * 60 * 24 * 30)) {
                                        if ($rootScope.Language.current === 'vi-VN') {
                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) + " tháng";
                                        } else {
                                            if (Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) === 1) {
                                                scope.timeShowLabel = "a month";
                                            } else {
                                                scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) + " months";
                                            }
                                        }
                                    } else {
                                        if (distance > (1000 * 60 * 60 * 24)) {
                                            if ($rootScope.Language.current === 'vi-VN') {
                                                scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24)) + " ngày";
                                            } else {
                                                if (Math.floor(distance / (1000 * 60 * 60 * 24)) === 1) {
                                                    scope.timeShowLabel = "a day";
                                                } else {
                                                    scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24)) + " days";
                                                }
                                            }
                                        } else {
                                            if (distance > (1000 * 60 * 60)) {
                                                if ($rootScope.Language.current === 'vi-VN') {
                                                    scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60)) + " giờ";
                                                } else {
                                                    if (Math.floor(distance / (1000 * 60 * 60)) === 1) {
                                                        scope.timeShowLabel = "a hours";
                                                    } else {
                                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60)) + " hours";
                                                    }
                                                }
                                            } else {
                                                if (distance > (1000 * 60)) {
                                                    if ($rootScope.Language.current === 'vi-VN') {
                                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60)) + " phút";
                                                    } else {
                                                        if (Math.floor(distance / (1000 * 60)) === 1) {
                                                            scope.timeShowLabel = "a min";
                                                        } else {
                                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60)) + " mins";
                                                        }
                                                    }
                                                } else {
                                                    if (distance > 1000) {
                                                        if ($rootScope.Language.current === 'vi-VN') {
                                                            scope.timeShowLabel = Math.floor(distance / (1000)) + " giây";
                                                        } else {
                                                            if (Math.floor(distance / (1000)) === 1) {
                                                                scope.timeShowLabel = "a sec";
                                                            } else {
                                                                scope.timeShowLabel = Math.floor(distance / (1000)) + " secs";
                                                            }
                                                        }
                                                    } else {
                                                        if ($rootScope.Language.current === 'vi-VN') {
                                                            scope.timeShowLabel = "vừa mới đây";
                                                        } else {
                                                            scope.timeShowLabel = "just now";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                break;
                            case "long":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getFullYear();
                                scope.timeShowLabel += " ";
                                scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                                scope.timeShowLabel += ":";
                                scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                                scope.timeShowLabel += ":";
                                scope.timeShowLabel += d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                                break;
                            case "long-no-second":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getFullYear();
                                scope.timeShowLabel += " ";
                                scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                                scope.timeShowLabel += ":";
                                scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                                break;
                            case "justdate":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getFullYear();
                                break;
                            case "justyear":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel = d.getFullYear();
                                break;
                            case "justtime":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                var hours = d.getHours();
                                var minutes = d.getMinutes();
                                scope.timeShowLabel = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
                                break;
                        }
                    } else {
                        if ($rootScope.Language.current === 'vi-VN') {
                            scope.timeShowLabel = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        } else {
                            scope.timeShowLabel = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        }
                    }
                }

            }
            scope.$watch('timeShowData', function (val) {
                init_();
            });
        }
    };
}]);

myApp.directive("timeShowNotify", ['$rootScope', '$filter', function ($rootScope, $filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('time-show-notify'),
        transclude: true,
        scope: {
            timeShowData: "@",
            timeShowType: "@",
            bindObject: "<"
        },
        link: function (scope) {
            scope.timeShowLabel = "";


            function init_() {
                scope.timeShowLabel = "";
                scope.timeShowData = parseInt(scope.timeShowData + "");
                if (scope.timeShowData) {

                    var d = scope.bindObject ? scope.timeShowData : new Date(scope.timeShowData);

                    if (scope.timeShowType) {

                        switch (scope.timeShowType) {
                            case "short":
                                var thisD = new Date();
                                var distance = thisD.getTime() - scope.timeShowData;
                                if (distance > (1000 * 60 * 60 * 24 * 365)) {
                                    if ($rootScope.Language.current === 'vi-VN') {
                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) + " năm";
                                    } else {
                                        if (Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) === 1) {
                                            scope.timeShowLabel = "a year";
                                        } else {
                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 365)) + " years";
                                        }
                                    }
                                } else {
                                    if (distance > (1000 * 60 * 60 * 24 * 30)) {
                                        if ($rootScope.Language.current === 'vi-VN') {
                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) + " tháng";
                                        } else {
                                            if (Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) === 1) {
                                                scope.timeShowLabel = "a month";
                                            } else {
                                                scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24 * 30)) + " months";
                                            }
                                        }
                                    } else {
                                        if (distance > (1000 * 60 * 60 * 24)) {
                                            if ($rootScope.Language.current === 'vi-VN') {
                                                scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24)) + " ngày";
                                            } else {
                                                if (Math.floor(distance / (1000 * 60 * 60 * 24)) === 1) {
                                                    scope.timeShowLabel = "a day";
                                                } else {
                                                    scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60 * 24)) + " days";
                                                }
                                            }
                                        } else {
                                            if (distance > (1000 * 60 * 60)) {
                                                if ($rootScope.Language.current === 'vi-VN') {
                                                    scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60)) + " giờ";
                                                } else {
                                                    if (Math.floor(distance / (1000 * 60 * 60)) === 1) {
                                                        scope.timeShowLabel = "a hours";
                                                    } else {
                                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60 * 60)) + " hours";
                                                    }
                                                }
                                            } else {
                                                if (distance > (1000 * 60)) {
                                                    if ($rootScope.Language.current === 'vi-VN') {
                                                        scope.timeShowLabel = Math.floor(distance / (1000 * 60)) + " phút";
                                                    } else {
                                                        if (Math.floor(distance / (1000 * 60)) === 1) {
                                                            scope.timeShowLabel = "a min";
                                                        } else {
                                                            scope.timeShowLabel = Math.floor(distance / (1000 * 60)) + " mins";
                                                        }
                                                    }
                                                } else {
                                                    if (distance > 1000) {
                                                        if ($rootScope.Language.current === 'vi-VN') {
                                                            scope.timeShowLabel = Math.floor(distance / (1000)) + " giây";
                                                        } else {
                                                            if (Math.floor(distance / (1000)) === 1) {
                                                                scope.timeShowLabel = "a sec";
                                                            } else {
                                                                scope.timeShowLabel = Math.floor(distance / (1000)) + " secs";
                                                            }
                                                        }
                                                    } else {
                                                        if ($rootScope.Language.current === 'vi-VN') {
                                                            scope.timeShowLabel = "vừa mới đây";
                                                        } else {
                                                            scope.timeShowLabel = "just now";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                break;
                            case "long":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getFullYear();
                                scope.timeShowLabel += " ";
                                scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                                scope.timeShowLabel += ":";
                                scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                                scope.timeShowLabel += ":";
                                scope.timeShowLabel += d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                                break;
                            case "justdate":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                                scope.timeShowLabel += "/";
                                scope.timeShowLabel += d.getFullYear();
                                break;
                            case "justyear":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                scope.timeShowLabel = d.getFullYear();
                                break;
                            case "justtime":
                                var d = new Date();
                                scope.timeShowLabel = "";
                                d.setTime(scope.timeShowData);
                                var hours = d.getHours();
                                var minutes = d.getMinutes();
                                scope.timeShowLabel = (hours < 10 ? '0' + hours : hours) + ` ${$filter('l')('Hours').toLowerCase()} ` + (minutes < 10 ? '0' + minutes : minutes);
                                break;
                        }
                    } else {
                        if ($rootScope.Language.current === 'vi-VN') {
                            scope.timeShowLabel = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        } else {
                            scope.timeShowLabel = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        }
                    }
                }

            }
            scope.$watch('timeShowData', function (val) {
                init_();
            });
        }
    };
}]);
myApp.directive('timeShow2', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('time-show2'),
        transclude: true,
        scope: {
            timeShowData: "<",
            timeShowType: "@",
            bindObject: "<"
        },
        link: function (scope) {
            scope.timeShowLabel = "";
            if (!scope.bindObject) {
                scope.timeShowData = parseInt(scope.timeShowData + "");
            }

            function init_() {
                scope.timeShowLabel = "";
                if (!scope.bindObject) {
                    scope.timeShowData = parseInt(scope.timeShowData + "");
                }
                if (scope.timeShowData) {
                    var d = scope.bindObject ? scope.timeShowData : new Date(scope.timeShowData);

                    switch (scope.timeShowType) {
                        case 'short':
                            scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getFullYear();
                            scope.timeShowLabel += " ";
                            scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                            break;
                        case "just_date":
                            scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getFullYear();
                            break;
                        case "just_time":

                            scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                            break;
                        default:
                            scope.timeShowLabel += d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                            scope.timeShowLabel += "/";
                            scope.timeShowLabel += d.getFullYear();
                            scope.timeShowLabel += " ";
                            scope.timeShowLabel += d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                            scope.timeShowLabel += ":";
                            scope.timeShowLabel += d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                            break;
                    }
                }
            }

            scope.$watch('timeShowData', function (val) {
                init_();
            });
        }
    }
});
myApp.directive('inputmdb', function () {
    return {
        restrict: "A",
        scope: {
            inputmdb: "<"
        },
        link: function (scope, elem) {
            scope.$watch('inputmdb', function (val) {
                if (val !== undefined && val !== null && val.length > 0) {
                    elem.addClass("active");
                } else {
                    elem.removeClass("active");
                }
            });
        }
    }
});

myApp.directive('pickModal', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal'),
        scope: {
            loadFunc: "&",
            loadDetailsFunc: "&",
            countFunc: "&",
            pickFunc: "&",
            showField: "@",
            sortField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            myParams: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal" + d.getTime();
            scope.data = [];
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                if (scope.myParams) {
                    scope.pickFunc({ params: { value: scope.myParams, model: {} } });
                } else {
                    scope.pickFunc({ params: {} });
                }

            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                if (scope.myParams) {
                    scope.pickFunc({ params: { value: scope.myParams, model: item } });
                } else {
                    scope.pickFunc({ params: item });
                }

                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.loadDetailsFunc({ params: { id: scope.idValue } }).then(function (data) {
                    scope.selectedItem = angular.copy(data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.loadFunc({
                    params: {
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage,
                        sort: scope.sort.query
                    }
                }).then(function (data) {
                    scope.data = data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });

                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.countFunc({ params: { search: filter.search } }).then(function (count) {
                    scope.totalItems = count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}]);

myApp.directive('pickModalAdvanceMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-advance-multi'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            loadDataFunc: "&",
            countFunc: "&",
            localized: "@",
            loadDetailsFunc: "&",
            enableInsertNewItem: "<",
            insertItemFunc: "&",
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            var currentItem = {};
            scope._ctrlName = "pick-modal-advance-multi" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.selectedItem = scope.idValue || [];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = [];
                scope.pickFunc({ params: {} });
            }
            scope._localized = scope.localized === "false" ? false : true;

            scope.pick = function (item, child) {
                if (!scope.selectedItem.includes(item._id)) {
                    scope.selectedItem.push(item._id);
                    scope.showItem.push(item);
                }
                if (!scope.selectedItem.includes(child._id)) {
                    scope.selectedItem.push(child._id);
                    scope.showItem.push(child);
                }
                scope.pickFunc({ params: scope.selectedItem, params2: scope.extend });
            }

            function checkExist(item) {
                for (var i in scope.selectedItem) {
                    if (scope.selectedItem[i].id === item.id) {
                        return true;
                    }
                }
                return false;
            }

            scope.pickMajor = function (item) {
                if (item.object) {
                    if (!checkExist(item)) {
                        scope.selectedItem.push({ id: item.id, code: item.code, object: item.object });
                        scope.showItem.push(item);
                    }
                } else {
                    if (!scope.selectedItem.includes(item._id)) {
                        scope.selectedItem.push(item._id);
                        scope.showItem.push(item);
                    }
                }
                scope.pickFunc({ params: scope.selectedItem, params2: scope.extend });
            }

            scope.remove = function (item) {
                scope.selectedItem = scope.selectedItem.filter(i => i.id !== item.id);
                scope.showItem = scope.showItem.filter(i => i.id !== item.id);

                scope.pickFunc({ params: scope.selectedItem });
                if(item.object) {
                    let temp = [];
                    for (var i in scope.selectedItem) {
                        if (scope.selectedItem[i].id !== item.id) {
                            temp.push(scope.selectedItem[i]);
                        }
                    }
                    scope.selectedItem = angular.copy(temp);
                    scope.pickFunc({ params: scope.selectedItem });
                    temp = undefined;
                    event.stopPropagation()
                } else {
                    let temp = [];
                    for (var i in scope.selectedItem) {
                        if (scope.selectedItem[i] !== item._id) {
                            temp.push(scope.selectedItem[i]);
                        }
                    }
                    scope.selectedItem = angular.copy(temp);
                    scope.pickFunc({ params: scope.selectedItem });
                    temp = undefined;
                    event.stopPropagation()
                }
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.removeAll = function () {
                scope.selectedItem = [];
                scope.showItem = [];
                scope.pickFunc({ params: {} });  
                event.stopPropagation()    
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                scope.loadDetailsFunc({ params: { ids: scope.idValue } }).then(function (data) {
                    
                    let dataDetails = data.map(item => ({
                        ...item,
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                    }));
                    scope.selectedItem = angular.copy(scope.idValue);
                    scope.showItem = angular.copy(dataDetails);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('idValue', function (val) {
                if (val && val.length) {
                    scope.loadDetails();
                    $("#" + scope._ctrlName).modal("hide");
                } else {
                    scope.selectedItem = [];
                    scope.showItem = []
                }
            });

            function load_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.loadDataFunc({ params: { search } }).then(function (data) {
                    
                    scope.data = data.map(item => ({
                        ...item, 
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                    }))
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.expandLabel = function (item) {
                currentItem = item
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.child_labels = [];
                } else {
                    currentItem.open = true;
                    scope.load()
                }
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}])

myApp.directive('inputSearch', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('input-search'),
        scope: {
            loadDataFunc: "&",
            countFunc: "&"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
            ];
            var d = new Date();
            scope._ctrlName = "input-search" + d.getTime();
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;

            scope.onSearchChange = function () {
                scope.loadDataFunc({ params: { search: scope.search } });
            };

            function load_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.loadDataFunc({ params: { search } }).then(function (data) {
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}])

myApp.directive('pickModalMulti', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-multi'),
        scope: {
            loadFunc: "&",
            loadDetailsFunc: "&",
            countFunc: "&",
            pickFunc: "&",
            showField: "@",
            sortField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            myParams: "<",
            localization: "@"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope.localization = scope.localization || "1";
            scope.showField = scope.showField || "title";
            scope._ctrlName = "pick-modal-multi" + d.getTime();
            scope.data = [];
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.numOfItemPerPage = 10;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.selectedItem = scope.idValue || [];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = [];
                if (scope.myParams) {
                    scope.pickFunc({ params: { value: scope.myParams, model: [] } });
                } else {
                    scope.pickFunc({ params: {} });
                }

            }

            scope.pick = function (item) {
                if (scope.selectedItem.indexOf(item._id) === -1) {
                    scope.selectedItem.push(item._id);
                    scope.showItem.push(item);
                    if (scope.myParams) {
                        scope.pickFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                    } else {
                        scope.pickFunc({ params: scope.selectedItem });
                    }
                }
            }

            scope.remove = function (item) {
                let temp = [];
                for (var i in scope.selectedItem) {
                    if (scope.selectedItem[i] !== item) {
                        temp.push(scope.selectedItem[i]);
                    }
                }
                scope.selectedItem = angular.copy(temp);
                scope.showItem = angular.copy(temp);
                if (scope.myParams) {
                    scope.pickFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                } else {
                    scope.pickFunc({ params: scope.selectedItem });
                }
                temp = undefined;
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.loadDetailsFunc({ params: { _ids: scope.idValue } }).then(function (data) {
                    scope.showItem = angular.copy(data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = [];
                    scope.showItem = [];
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.loadFunc({
                    params: {
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage,
                        sort: scope.sort.query
                    }
                }).then(function (data) {
                    scope.data = data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });

                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.countFunc({ params: { search: filter.search } }).then(function (count) {
                    scope.totalItems = count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}]);

myApp.directive('pickModalL', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-l'),
        scope: {
            loadFunc: "&",
            loadDetailsFunc: "&",
            countFunc: "&",
            pickFunc: "&",
            showField: "@",
            sortField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.sortField = scope.sortField || "_id";
            scope.showField = scope.showField || "title";
            scope._ctrlName = "pick-modal" + d.getTime();
            scope.data = [];
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.loadDetailsFunc({ params: { id: scope.idValue } }).then(function (data) {
                    scope.selectedItem = angular.copy(data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.loadFunc({
                    params: {
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage,
                        sort: scope.sort.query
                    }
                }).then(function (data) {
                    scope.data = data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });

                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                scope.countFunc({ params: { search: filter.search } }).then(function (count) {
                    scope.totalItems = count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                    err = undefined;
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}]);

myApp.directive('pickModalMasterDirectory', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-master-directory'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            noPagination: "<",
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-master-directory" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/master_directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({
                        key: scope.idValue
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/master_directory/load",
                    method: "POST",
                    data: JSON.stringify({
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.data = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/master_directory/count",
                    method: "POST",
                    data: JSON.stringify({
                        search: filter.search
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}]);

myApp.directive('pickModalDirectory', ['$q', '$rootScope', 'fRoot', '$filter', function ($q, $rootScope, fRoot, $filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            getFirstToDefault: "<",
            hasInsertButton: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" },
                { name: "Directory", action: "insert"},
                { name: "Directory", action: "getOrderNumber" },
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory" + d.getTime() ;
            scope._id_modal_insert = "pick-modal-directory-insert-" + d.getTime() ;
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.isInsertModalOpen = false;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.hasInsertButton = scope.hasInsertButton || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            if(scope.getFirstToDefault === undefined){
                scope.getFirstToDefault = false;
            }else{
                scope.getFirstToDefault = true;
            }
            if (scope.getFirstToDefault == "true") {
                scope.load();
            }

            function getOrderNumber_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/get_ordernumber",
                    method: "POST",
                    data: JSON.stringify( { master_key: scope.extend.master_key } ),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope._insert_value.ordernumber = data.data.ordernumber;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }
        
            scope.getOrderNumber = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Directory", "getOrderNumber", getOrderNumber_service);
            }
            
            scope.prepareInsert = function () {
                scope._insert_value = {
                    ordernumber: 0,
                    title: {
                        'vi-VN': '',
                        'en-US': '',
                    },
                    key: '',
                    extend: '',
                    item: {
                    },
                    isactive: true,
                };

                scope.getOrderNumber().then(function () {
                    scope.load().then(function () {
                        scope.isInsertModalOpen = true;
                        $("#" + scope._id_modal_insert).modal("show");
                    });
                });

                $("#"+scope._id_modal_insert).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.isInsertModalOpen = false;
                    });
                });

                // scope.getOrderNumber();
            }

            function insert_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/insert",
                    method: "POST",
                    data: JSON.stringify({
                        ordernumber: scope._insert_value.ordernumber,
                        title: scope._insert_value.title,
                        value: scope._insert_value.value,
                        item: scope._insert_value.item,
                        master_key: scope.extend.master_key,
                        isactive: scope._insert_value.isactive
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                    scope.pickFunc({ params: data.data, params2: scope.extend });
                    $(`#${scope._id_modal_insert}`).modal('hide');
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }
        
            scope.insert = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Directory", "insert", insert_service);
            }


            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: `${scope.idValue}`, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });



            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    var directoryValues = data.data;
                    directoryValues.sort((first, second) => second.ordernumber < first.ordernumber);
                    scope.data = data.data;
    
                    if (!scope.idValue && scope.getFirstToDefault && scope.data && scope.data[0]) {                       
                        scope.pick(scope.data[0]);

                        
                    }

                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                if (scope._notyetInit) {
                    var dfdAr = [];
                    dfdAr.push(scope.count());
                    dfdAr.push(scope.load());
                    $q.all(dfdAr).then(function () {
                        scope._notyetInit = false;
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    });
                }

            }

            scope.$watch('filter', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.load();
                }
            });
            scope.$on("pickModalDirectory:initLoad", function () {
                scope.load();
            });
        }
    }
}]);

myApp.directive('pickModalDirectoryRoom', ['$q', '$rootScope', 'fRoot', '$filter', function ($q, $rootScope, fRoot, $filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory-room'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            dateStart: "<",
            dateEnd: "<",
            currentRoom: "<",
            currentRegistration: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" },
                { name: "Directory", action: "insert"},
                { name: "Directory", action: "getOrderNumber" },
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory-room" + $filter('getStringRandom')();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;

            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    dfd.resolve(true);
                    scope.selectedItem = angular.copy(data.data);
                    scope.load();
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (newVal, oldVal) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/meeting_room/load_room",
                    method: "POST",
                    data: JSON.stringify({
                        date_start: scope.dateStart,
                        date_end: scope.dateEnd,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    var directoryValues = data.data;
                    directoryValues.sort((first, second) => second.ordernumber < first.ordernumber);
                    scope.data = data.data;

                    const matchingItem = scope.data.find(item => item.value === scope.idValue && !item.bookable);

                    if (matchingItem) {
                        scope.clear();
                    }

                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            scope.init = function () {
                scope.load();
            }
            
            scope.$watch('filter', function (newVal, oldVal) {
                if (!angular.equals(newVal, oldVal)) {
                    scope.load();
                }
            });

            scope.$watch('dateStart', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.load();
                }
            });

            scope.$watch('dateEnd', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.load();
                }
            });

            // scope.$on("pickModalDirectoryRoom:initLoad", function () {
            //     scope.load();
            // });
        }
    }
}]);

myApp.directive('pickModalDirectoryWorkflow', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory-workflow'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            getFirstToDefault: "<",
            typeForDirective: "@",
            disableDropdown: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory-workflow" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
                scope.tryPickDefault();             
            });



            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    var directoryValues = data.data;
                    directoryValues.sort((first, second) => second.ordernumber < first.ordernumber);
                    scope.data = scope.extend.master_key === 'incomming_dispatch_book' ? [directoryValues[0]] : data.data;

                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.tryPickDefault = function () {
                if (!scope.idValue && scope.getFirstToDefault && scope.isDataLoaded) {
                    const transferValue = angular.copy(
                        scope.data.find(item => item.title && item.title['vi-VN'] === 'Phiếu chuyển')
                    );
                    if (transferValue) {
                        scope.pick(transferValue);
                    }
                }
            };

            scope.init = function () {
                if (scope._notyetInit) {
                    var dfdAr = [];
                    dfdAr.push(scope.count());
                    dfdAr.push(scope.load());
                    $q.all(dfdAr).then(function () {
                        scope._notyetInit = false;
                        scope.isDataLoaded = true;
                        scope.tryPickDefault();
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    });
                }

            }

            if (scope.getFirstToDefault) {
                scope.init();
            }
        }
    }
}]);



myApp.directive('pickModalDirectoryDetailDispatch', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory-detail-dispatch'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            getFirstToDefault: "<",
            typeForDirective: "@",
            disableDropdown: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory-detail-dispatch" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
                scope.tryPickDefault();             
            });



            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    var directoryValues = data.data;
                    directoryValues.sort((first, second) => second.ordernumber < first.ordernumber);
                    scope.data = scope.extend.master_key === 'incomming_dispatch_book' ? [directoryValues[0]] : data.data;

                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.tryPickDefault = function () {
                if (!scope.idValue && scope.getFirstToDefault && scope.isDataLoaded) {
                    const transferValue = angular.copy(
                        scope.data.find(item => item.title && item.title['vi-VN'] === 'Phiếu chuyển')
                    );
                    if (transferValue) {
                        scope.pick(transferValue);
                    }
                }
            };

            scope.init = function () {
                if (scope._notyetInit) {
                    var dfdAr = [];
                    dfdAr.push(scope.count());
                    dfdAr.push(scope.load());
                    $q.all(dfdAr).then(function () {
                        scope._notyetInit = false;
                        scope.isDataLoaded = true;
                        scope.tryPickDefault();
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    });
                }

            }

            if (scope.getFirstToDefault) {
                scope.init();
            }
        }
    }
}]);

myApp.directive('pickModalAdvance', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-advance'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            loadDataFunc: "&",
            countFunc: "&",
            localized: "@",
            loadDetailsFunc: "&"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-advance" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }
            scope._localized = scope.localized === "false" ? false : true;

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                scope.loadDetailsFunc({ params: { id: scope.idValue } }).then(function (data) {
                    let item = {
                        ...data,
                        showValue: (scope._localized ? data[scope.showField][$rootScope.Language.current] : data[scope.showField]) || '',
                    }
                    scope.selectedItem = angular.copy(item);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined) {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.loadDataFunc({ params: { search } }).then(function (data) {
                    scope.data = data.map(item => ({
                        ...item,
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                    }));
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}])

myApp.directive('pickModalDirectoryMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory-multi'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory-multi" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.idValue = scope.idValue || [];
            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }
            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                var temp = [];
                if (scope.filter && scope.filter.length > 0) {
                    temp = angular.copy(scope.filter);
                }
                if (scope.idValue && scope.idValue.length > 0) {
                    var item = {};
                    item[scope.extend.load_details_column] = { $nin: scope.idValue };
                    temp.push(item);

                }
                if (temp.length > 0) {
                    obj.filter = temp;
                }

                return obj;
            }


            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails_many",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, ids: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.showValue = "";
                    scope.selectedItem = angular.copy(data.data);
                    for (var i = 1; i <= scope.selectedItem.length; i++) {
                        if (i > 2) {
                            scope.showValue += "...";
                            break;
                        }
                        scope.showValue += scope.showField === 'title' ? scope.selectedItem[i - 1].title[$rootScope.Language.current] : scope.selectedItem[i - 1][scope.showField];
                        if (i < scope.selectedItem.length) {
                            scope.showValue += " ,";
                        }
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue.length > 0) {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = [];
                }
            }

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.data = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.open = function () {


            }

            function refreshData() {
                scope.selectedItem = [];
                scope.showValue = "";
                scope.load();
                scope.count();
                if (scope.idValue) {
                    scope.loadDetails();
                }

            }
            scope.refreshData = function () {
                if (scope.idValue) {
                    scope.load();
                    scope.count();
                }

            }


            scope.pick = function (val) {
                scope.idValue = scope.idValue || [];
                if (scope.idValue.indexOf(val) === -1) {
                    scope.idValue.push(val);
                    scope.pickFunc({ params: scope.idValue, params2: scope.extend });
                    refreshData();
                }
            }

            scope.remove = function (val) {
                scope.idValue = scope.idValue.filter(e => e !== val);
                scope.pickFunc({ params: scope.idValue, params2: scope.extend });
                refreshData();
            }

            scope.$watch('idValue', function () {
                refreshData();
            });
        }
    }
}]);

myApp.directive('pickModalUserMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-user-multi'),
        scope: {
            pickFunc: "&",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-user-multi" + d.getTime();
            scope.data = [];
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.pagination = {};
            scope.toggle = {};
            scope.search = "";
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;

            scope.Departments = [];
            scope.currentDepartment = {};


            scope.loadDepartment = function (department) {
                var dfd = $q.defer();
                var request = {};
                request.level = department ? department.level + 1 : 1;
                if (department) {
                    request.id = department.id
                }

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    if (department) {
                        department.childs = data.data;
                    } else {
                        scope.Departments = data.data;
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.refreshData_user = function (department) {

                if (department.id) {
                    if (!scope.pagination[department.id]) {

                        scope.pagination[department.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.pagination[department.id].currentPage = 1;
                        scope.pagination[department.id].offset = 0;
                    }
                    loadUser(department);
                    countUser(department);
                }

            }

            function loadUser(department) {
                var dfd = $q.defer();
                var request = {
                    department: department.id,
                    top: scope.numOfItemPerPage,
                    offset: scope.pagination[department.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    department.users = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function countUser(department) {
                var dfd = $q.defer();
                var request = {
                    department: department.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.pagination[department.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.expandDepartment = function (department) {
                scope.currentDepartment = department;
                if (!department.open) {
                    department.open = true;
                    scope.refreshData_user(department);
                }
                else {
                    department.open = false;
                }
            }

            scope.open = function () {
                scope.loadDepartment();
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.pick = function (username) {
                scope.idValue = scope.idValue || [];
                if (scope.idValue.indexOf(username) === -1) {
                    scope.idValue.push(username);
                    scope.pickFunc({ params: scope.idValue });
                }

            }
            scope.remove = function (username) {
                scope.idValue = scope.idValue.filter(e => e !== username);
                scope.pickFunc({ params: scope.idValue });
            }
        }
    }
}]);

myApp.directive('pickModalGeneric', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-generic'),
        scope: {
            data: "<",
            invalidValueFunc: "&",
            pickFunc: "&",
            showField: "@",
            localized: "@",
            label: "@",
            idField: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            enableSearch: "<",
            searchPlaceholder: "@",
            showLimit: "@",
            searchFuncEnable: "<",
            searchFunc: "&",
        },
        link: function (scope) {
            const d = new Date();
            scope._ctrlName = "pick-modal-generic" + d.getTime();
            scope._data = scope.data || [];
            scope.showField = scope.showField || "title";
            scope._localized = scope.localized === "false" ? false : true;
            scope.idField = scope.idField || "id";
            scope.search = "";
            scope.disable = scope.disable || false;
            scope.enableSearch = scope.enableSearch || false;
            scope.searchFuncEnable = scope.searchFuncEnable || false;

            scope.clear = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.selectedItem = {};
                scope.pickFunc && scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc && scope.pickFunc({ params: item });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    const foundItem = scope._data.find((item) => item[scope.idField] === scope.idValue);
                    scope.selectedItem = foundItem ? angular.copy(foundItem) : {};
                } else {
                    scope.selectedItem = {};
                }

                if (!scope.selectedItem[scope.idField]) {
                    scope.invalidValueFunc && scope.invalidValueFunc();
                }
            }

            function filterData(data, search) {
                const searchVal = (search || '').toLowerCase();
                const _data = (data || []).map(item => ({
                    ...item,
                    showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                })).filter(item =>
                    item.showValue.toLowerCase().includes(searchVal)
                );
                scope._data = scope.showLimit ? _data.slice(0, scope.showLimit) : _data;
                scope.loadDetails();
            }

            scope.$watch('data', function (data) {
                filterData(data, scope.search);
            });

            scope.$watch('search', function (search) {
                filterData(scope.data, search);
            });

            scope.$watch('idValue', function () {
                filterData(scope.data, scope.search);
            });
        }
    }
}]);
myApp.directive('pickModalGenericDefault', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, $fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-generic-default'),
        scope: {
            pickFunc: "&",
            showField: "@",
            localized: "@",
            label: "@",
            idField: "@",
            idValue: "<",
            require: "<",
            disable: "<"
        },
        link: function (scope) {
            const d = new Date();
            scope._ctrlName = "pick-modal-generic-default" + d.getTime();
            scope.showField = scope.showField || "title";
            scope._localized = scope.localized === "false" ? false : true;
            scope.idField = scope.idField;
            scope.disable = scope.disable || false;
            // TODO:
            scope.data = [
                {
                    title: {
                        'vi-VN': 'Lãnh đạo đơn vị',
                        'en-US': 'Unit leader of process creator',
                    },
                    type: "departmentLeader",
                    rule: ["Office.Signing.Leader_Mangage"],
                    id: d.getTime(),
                },
                {
                    title: {
                        'vi-VN': 'Lãnh đạo khối đơn vị',
                        'en-US': 'Block leader of process creator unit',
                    },
                    type: "leader",
                    rule: ["Office.Signing.Department_Leader_Manage"],
                    id: d.getTime() + 1,
                },
            ];

            scope.selectedItem = scope.data.find(item => item[scope.idField] === scope.idValue) || {};

            scope.clear = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.selectedItem = {};
                scope.pickFunc && scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);

                scope.pickFunc && scope.pickFunc({ params: item });
                $('#' + scope._ctrlName).modal('hide');
            };

            // loadOrganization
            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    const foundItem = scope.data.find(item => item[scope.idField] === scope.idValue);
                    scope.selectedItem = foundItem ? angular.copy(foundItem) : {};
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.getLocalizedTitle = function (item) {
                if (typeof item[scope.showField] === "object") {
                    return scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField];
                }
                return item[scope.showField];
            }

            scope.$watch('idValue', function () {
                if (!scope.selectedItem[scope.idField]) {
                    scope.loadDetails();
                }
            });
            scope.loadDetails();
        }
    }
}]);


myApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

myApp.directive('ngWatch', ['$timeout', function ($timeout) {
    return {
        scope: {
            func: "&",
            ngWatch: "="
        },
        link: function (scope) {
            scope.val = angular.copy(scope.ngWatch);
            scope.$watch('ngWatch', function (newV, oldV) {
                scope.val = newV;
                $timeout(function () {
                    if (scope.val == newV) {
                        scope.func();
                    }
                }, window.idleTime);
            })
        }
    };
}]);


myApp.directive("departmentChild", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('department-child'),
        scope: {
            item: "=",
            ctrl: "="
        }
    };
});
myApp.directive('organization', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('organization'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            loadDetailsFunc: "&",
            selectFunc: "&",
            require: "<",
            disable: "<",
            excludes: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "organization" + d.getTime();
            scope.ctrl = {};
            scope.data = [];
            scope.search = "";
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.selectFunc({ params: {} });
            }

            scope.ctrl.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.selectFunc({ params: item });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.clear = function () {
                scope.selectedItem = null;
                scope.selectFunc({ params: null });
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ id: scope.idValue }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.selectedItem = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            function filterData(data) {
                const searchVal = (scope.search || '').toLowerCase();
                return (data || []).filter((item) => item.title[$rootScope.Language.current].toLowerCase().includes(searchVal) && !(scope.excludes || []).includes(item.id));
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            scope.$watch('disable', function (val) {
                if (val) {
                    elem.find(".value").addClass("disabled");
                } else {
                    elem.find(".value").removeClass("disabled");
                }
            });

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(filterData(res.data));
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }

            scope.ctrl.expandDepartment = function (item, e) {
                e.stopPropagation();
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                }
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive("departmentMultiChild", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('department-multi-child'),
        scope: {
            item: "=",
            ctrl: "="
        }
    };
});

myApp.directive('organizationMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('organization-multi'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            loadDetailsFunc: "&",
            selectFunc: "&",
            require: "<",
            disable: "<",
            myParams: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            var currentItem = {};
            scope._ctrlName = "organization-multi" + d.getTime();
            scope.data = [];
            scope.ctrl = {};
            scope.displayLabel = "";
            scope.search = "";
            scope.selectedItem = scope.idValue || [];
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = [];
                if (scope.myParams) {
                    scope.selectFunc({ params: { value: scope.myParams, model: [] } });
                } else {
                    scope.selectFunc({ params: [] });
                }

            }

            scope.ctrl.pick = function (item) {
                if (scope.selectedItem.indexOf(item.id) === -1) {
                    scope.selectedItem.push(item.id);
                    if (scope.myParams) {
                        scope.selectFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                    } else {
                        scope.selectFunc({ params: scope.selectedItem });
                    }

                }
            }
            function filterData(data, search) {
                const searchVal = (search || '').toLowerCase();
                return (data || []).filter((item) => item.title[$rootScope.Language.current].toLowerCase().includes(searchVal) && !(scope.excludes || []).includes(item.id));
            }

            scope.remove = function (item) {
                var temp = [];
                for (var i in scope.selectedItem) {
                    if (scope.selectedItem[i] !== item) {
                        temp.push(scope.selectedItem[i]);
                    }
                }
                scope.selectedItem = angular.copy(temp);
                if (scope.myParams) {
                    scope.selectFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                } else {
                    scope.selectFunc({ params: scope.selectedItem });
                }
                temp = undefined;
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
                $('.modal-backdrop').remove();
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.displayLabel = "";
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails_m",
                    method: "POST",
                    data: JSON.stringify({ id: scope.selectedItem }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.showItem = res.data;
                    for (var i in res.data) {
                        if (scope.displayLabel && scope.displayLabel.length > 50) {
                            scope.displayLabel += "..."
                        } else {
                            scope.displayLabel += res.data[i].title[$rootScope.Language.current];
                            if (parseInt(i) === (res.data.length - 1)) {
                                scope.displayLabel += ".";
                            } else {
                                scope.displayLabel += ", ";
                            }
                        }
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;


            }

            scope.loadDetails = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
            }

            scope.$watch('idValue', function (val) {
                if (scope.idValue) {
                    scope.selectedItem = angular.copy(scope.idValue);
                }
                scope.loadDetails();
            });

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(filterData(res.data));
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }

            scope.ctrl.expandDepartment = function (item) {
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                }
            }

            scope.$watch('search', function (search) {
                filterData(scope.data, search);
            });

            scope.init = function () {
                var dfdAr = [];

                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);
myApp.directive('organizationDispatchArrived', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('organization-dispatch-arrived'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            loadDetailsFunc: "&",
            selectFunc: "&",
            require: "<",
            disable: "<",
            excludes: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "organization-dispatch-arrived" + d.getTime();
            scope.ctrl = {};
            scope.data = [];
            scope.search = "";
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.selectFunc({ params: {} });
            }

            scope.ctrl.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.selectFunc({ params: item });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ id: scope.idValue }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.selectedItem = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            function filterData(data) {
                const searchVal = (scope.search || '').toLowerCase();
                return (data || []).filter((item) => item.title[$rootScope.Language.current].toLowerCase().includes(searchVal) && !(scope.excludes || []).includes(item.id));
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

            scope.$watch('disable', function (val) {
                if (val) {
                    elem.find(".value").addClass("disabled");
                } else {
                    elem.find(".value").removeClass("disabled");
                }
            });

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(filterData(res.data));
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }
            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.ctrl.expandDepartment = function (item, e) {
                e.stopPropagation();
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                }
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('organizationGroupMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('organization-group-multi'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            loadDetailsFunc: "&",
            selectFunc: "&",
            require: "<",
            disable: "<",
            myParams: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            var currentItem = {};
            scope._ctrlName = "organization-group-multi" + d.getTime();
            scope.data = [];
            scope.ctrl = {};
            scope.displayLabel = "";
            scope.selectedItem = scope.idValue || [];
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = [];
                if (scope.myParams) {
                    scope.selectFunc({ params: { value: scope.myParams, model: [] } });
                } else {
                    scope.selectFunc({ params: [] });
                }

            }

            scope.ctrl.pick = function (item) {
                if (item.department_details && item.department_details.length > 0) {
                    item.department_details.forEach(function (childItem) {
                        if (scope.selectedItem.indexOf(childItem.id) === -1) {
                            scope.selectedItem.push(childItem.id);
                            if (scope.myParams) {
                                scope.selectFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                            } else {
                                scope.selectFunc({ params: scope.selectedItem });
                            }
                        }
                    });
                } else {
                    scope.selectedItem.push(item.id);
                    if (scope.myParams) {
                        scope.selectFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                    } else {
                        scope.selectFunc({ params: scope.selectedItem });
                    }
                }
            }

            scope.remove = function (item) {
                var temp = [];
                for (var i in scope.selectedItem) {
                    if (scope.selectedItem[i] !== item) {
                        temp.push(scope.selectedItem[i]);
                    }
                }
                scope.selectedItem = angular.copy(temp);
                if (scope.myParams) {
                    scope.selectFunc({ params: { value: scope.myParams, model: scope.selectedItem } });
                } else {
                    scope.selectFunc({ params: scope.selectedItem });
                }
                temp = undefined;
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.displayLabel = "";
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails_m",
                    method: "POST",
                    data: JSON.stringify({ id: scope.selectedItem }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.showItem = res.data;
                    for (var i in res.data) {
                        scope.displayLabel += res.data[i].title[$rootScope.Language.current];
                        if (parseInt(i) === (res.data.length - 1)) {
                            scope.displayLabel += ".";
                        } else {
                            scope.displayLabel += ", ";
                        }
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;


            }

            scope.loadDetails = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
            }


            scope.$watch('idValue', function (val) {
                if (scope.idValue) {
                    scope.selectedItem = angular.copy(scope.idValue);
                }
                scope.loadDetails();
            });

            function load_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/group/load",
                    method: "POST",
                    data: JSON.stringify({}),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load() {
                load_service().then(function (data) {
                    scope.data = data;
                    scope.data.forEach(function (element) {
                        if (element.departments && element.departments.length > 0) {
                            element.canExpand = true;
                            element.open = true;
                        }
                    });
                }, function (err) {
                    dfd.reject(err);
                });
            }

            scope.ctrl.expandDepartment = function (item) {
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.deparments = [];
                } else {
                    currentItem.open = true;
                    load();
                }
            }

            scope.init = function () {
                var dfdAr = [];

                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('getField', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('get-field'),
        scope: {
            idValue: "<",
            loadDetailsFunc: "&",
            field: "@",
            localization: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "getField" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();
                scope.loadDetailsFunc({ params: { id: scope.idValue } }).then(function (data) {
                    scope.selectedItem = angular.copy(data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

myApp.directive('getFieldDirectory', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('get-field-directory'),
        scope: {
            extend: "<",
            idValue: "<",
            field: "@",
            localization: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "getFieldDirectory" + d.getTime();
            scope.field = scope.field || "title";
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);
myApp.directive('getFieldTypeWorkflowDirectory', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('get-field-type-workflow-directory'),
        scope: {
            extend: "<",
            idValue: "<",
            field: "@",
            localization: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "getFieldTypeWorkflowDirectory" + d.getTime();
            scope.field = scope.field || "title";

            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            function loadDetails_service() {
                var dfd = $q.defer();
                scope.data = [
                    {
                        title: {
                            'vi-VN': 'Lãnh đạo đơn vị',
                            'en-US': 'Unit leader of process creator',
                        },
                        type: "departmentLeader",
                        id: Date.now(),
                        rule: ["Office.Signing.Leader_Manage"],

                    },
                    {
                        title: {
                            'vi-VN': 'Lãnh đạo khối đơn vị',
                            'en-US': 'Block leader of process creator unit',
                        },
                        type: "leader",
                        id: Date.now() + 1,
                        rule: ["Office.Signing.Department_Leader_Manage"],
                    },
                ];
                scope.selectedItem = scope.data.find(item => item.type === scope.idValue);
                dfd.resolve(true);
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue) {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            };

            scope.$watch('idValue', function () {
                scope.loadDetails();
            });
        }
    };
}]);


myApp.directive('showStatus', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-status'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const Badge = {
                'badge-primary': ['WaitingLeadDepartmentApprove', 'WaitingLeadExternalApprove', 'LeadTransferDepartment', 'ApprovedByDepartmentLeader', 'WaitingForApproval', 'Pending', 'PendingRecalled', 'CreatedNotify', 'RegisteredRecall', 'ApprovedRecallByDepartmentLeader', 'NotPublicYet', 'Unread', 'Transferred', 'WaitingForAccept', 'Waiting_Additional_Documents', 'waiting_storage', 'ApprovedLeadExternal', 'ApprovedRecallByLead', 'WaitingLeadDepartmentApproveReceive'],
                'badge-success': ['Approved', 'Publish','Published', 'Completed', 'Sent', 'Obtained', 'Activate', 'Active', 'SaveODB', 'SaveBriefCase', 'Released', 'Read','Received'],
                'badge-warning': ['Reject', 'Rejected', 'Delete', 'PendingApproval', 'Abort','Processing', 'PendingReceipt' ],
                'badge-secondary': ['Draft', 'NotStartedYet', 'End', 'Created', 'WaitingForReview', 'NotSeen'],
                'badge-gray-200': ['Cancelled', 'Returned','Recalled'],
                'badge-info': ['WaitingForStorage'],
                'badge-light-success': ['Done', 'Recalled'],
                'badge-info': ['WaitingReceive']
            }
            for (const key in Badge) {
                if (Badge[key].includes(scope.idValue)) {
                    scope.class = key;
                    break;
                }
            }

            scope.$watch('idValue', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    for (const key in Badge) {
                        if (Badge[key].includes(scope.idValue)) {
                            scope.class = key;
                            break;
                        }
                    }
                }
            });
        }
    }
});

myApp.directive('showStatus2', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-status2'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const badge = {
                'ApprovedByDepartmentLeader': '#1ABC9C',
                'PendingRecalled': '#3498db',
                'CreatedNotify': '#3498db',
                'RegisteredRecall': '#2c3e50',
                'ApprovedRecallByDepartmentLeader': '#7F8D8C',
                'ApprovedLeadExternal': '#3498db',
                'ApprovedRecallByLead': '#3498db',
                'Approved': '#2ecc71',
                'Published': '#2ecc71',
                'Reject': '#f39c12',
                'Rejected': '#8e44ad',
                'Recalled': '#E74C3C'
            };

            function updateColor() {
                scope.color = badge[scope.idValue] || '#000';  // Default to black if no match
            }

            // Watch for changes in idValue
            scope.$watch('idValue', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    updateColor();
                }
            });

            updateColor();
        }
    };
});


myApp.directive('showStatusInUpdate', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-status-in-update'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const Badge = {
                'badge-primary': ['Pending', 'NotPublicYet', 'Unread', 'Transferred', 'WaitingForAccept'],
                'badge-success': ['Approved', 'Publish', 'Completed', 'Sent', 'Obtained', 'Activate', 'Active', 'SaveODB', 'SaveBriefCase', 'Released', 'Read', 'Received'],
                'badge-warning': ['Reject', 'Rejected', 'Delete', 'PendingApproval', 'Abort'],
                'badge-secondary': ['Draft', 'NotStartedYet', 'End', 'Created', 'WaitingForReview', 'NotSeen'],
                'badge-gray-200': ['Cancelled', 'Returned'],
                'badge-info': ['Processing'],
                'badge-light-success': ['Done', 'WaitingForApproval']
            }
            for (const key in Badge) {
                if (Badge[key].includes(scope.idValue)) {
                    scope.class = key;
                    break;
                }
            }

            scope.$watch('idValue', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    for (const key in Badge) {
                        if (Badge[key].includes(scope.idValue)) {
                            scope.class = key;
                            break;
                        }
                    }
                }
            });
        }
    }
});

myApp.directive('showState', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-state'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const Badge = {
                'badge-primary': ['Open', 'Processing'],
                'badge-danger': ['Overdue', 'WorkflowNodeOverDue', 'NotSeen'],
                'badge-warning': ['GonnaLate', 'Expired', 'WorkflowNodeGonnaLate'],
                'badge-success': ['Early', 'Late', 'OnSchedule', 'WorkflowNodeOnSchedule'],
                'badge-gray-200': ['Cancelled'],
            };

            scope.$watch('idValue', function (newValue, prevValue) {
                for (const key in Badge) {
                    if (Badge[key].includes(newValue)) {
                        scope.class = key;
                        break;
                    }
                }
            });

        }
    }
})

const taskTaskTypeTransform = function (value) {
    const taskTypeList = [
        { key: 1, value: 'Task' },
        { key: 2, value: 'WorkflowPlay' }
    ]
    return taskTypeList.find(item => item.key === value);
}

myApp.directive('showTaskType', ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-task-type'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const taskType = taskTaskTypeTransform(scope.idValue).value;
            switch (taskType) {
                case 'Task':
                    scope.taskType = $filter('l')(taskType);
                    break;
                case 'WorkflowPlay':
                    scope.taskType = $filter('l')(taskType);
                    break;
                default:
                    scope.taskType = 'N/A';
                    break;
            }
        }
    };
}]);

const taskPriorityTransform = function (value) {
    const priorityList = [
        { key: 1, value: 'Critical' },
        { key: 2, value: 'High' },
        { key: 3, value: 'Medium' },
        { key: 4, value: 'Low' }
    ];
    return priorityList.find(item => item.key === value);
}

myApp.directive('showPriority', ['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-priority'),
        scope: {
            idValue: "<"
        },
        link: function (scope) {
            const priority = scope.idValue ? taskPriorityTransform(scope.idValue).value : "";
            switch (priority) {
                case 'Critical':
                    scope.priority = $filter('l')(priority);
                    break;
                case 'High':
                    scope.priority = $filter('l')(priority);
                    break;
                case 'Medium':
                    scope.priority = $filter('l')(priority);
                    break;
                case 'Low':
                    scope.priority = $filter('l')(priority);
                    break;
                default:
                    scope.priority = 'N/A';
                    break;
            }
        }
    };
}]);

myApp.directive('showProgress', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-progress'),
        scope: {
            idValue: "<"
        }
    };
});

myApp.directive('pickPriorityModal', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-priority-modal'),
        scope: {
            selectedValue: "=",
            options: "=",
            label: "@",
            require: "<",
        }
    };
});

myApp.directive('showUsername', ['fRoot', '$q', '$rootScope', 'socket', '$compile', 'localStorage', function (fRoot, $q, $rootScope, socket, $compile, $localStorage) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-username'),
        scope: {
            username: "<",
            employee: "<",
            justName: "<",
            hideImage: "<",
            justImage: "<",
            withDepartment: "<",
            withoutTooltip: "<",
            showAbbreviation: "<",
            withCompetence: "<",
            customStyle: "@"
        },
        link: function (scope, element) {
            var d = new Date();
            scope._ctrlName = "showUsername" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            // Áp dụng custom style nếu có
            if (scope.customStyle) {
                element.attr('style', scope.customStyle);
            }

            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const user = getDetailsUserLocal();
                if(!user){
                    dfdAr.push(getDetailsUser());
                }else{
                    scope.selectedItem = angular.copy(user);
                }
                $q.all(dfdAr).then(function(){
                    // scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetailsUserLocal(){
                const users = $localStorage.getItem('listUsers') || {};
                return users[scope.username.toString().trim()];
            }

            function setUserToLocal(user){
                const users = $localStorage.getItem('listUsers') || {};
                if(!users[user.username]){
                    users[user.username] = user;
                }
                $localStorage.setItem('listUsers', users, 30)
            }

            function getDetailsUser(){
                const dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/loadfordirective",
                    method: "POST",
                    data: JSON.stringify({ account: scope.username.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data)
                    setUserToLocal(data.data);
                    dfd.resolve(data.data)
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            if (!scope.withoutTooltip) {
                var tooltipElement = angular.element('<div class="custom-tooltip"></div>');
                element.append(tooltipElement);
                tooltipElement.hide();
                var compiledTooltip = null;
                scope.showTooltip = function () {
                    var htmlString = `
                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <img src="${scope.selectedItem.avatar ? scope.selectedItem.avatar.url : ''}"/>
                            </div>
                            <div class="col-9">
                                <h5 class="tooltip-title">${scope.selectedItem.title}</h5>
                                    <div><i class="fa fa-briefcase" aria-hidden="true"></i> ${scope.selectedItem.competence ? `<get-field-competence id-value-t="${scope.selectedItem.competence}" localization="true" />` : 'No Data'}</div>
                                <div>
                                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                                    <show-department show-department show-abbreviation="false" department="${scope.selectedItem.department}"></show-department>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                    if (!compiledTooltip) {
                        compiledTooltip = $compile(htmlString)(scope);
                    }
                    tooltipElement.empty().append(compiledTooltip);
                    tooltipElement.show();
                }
                scope.hideTooltip = function () {
                    tooltipElement.hide();
                }
            }

            function loadDetails_employee_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/human/employee/loaddetails_d",
                    method: "POST",
                    data: JSON.stringify({ id: scope.employee.toString() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = {};
                    for (var i in data.data) {
                        scope.selectedItem[i] = data.data[i];
                    }
                    if (data.data && data.data.userInfo) {
                        for (var i in data.data.userInfo) {
                            scope.selectedItem[i] = data.data.userInfo[i];
                        }
                    }

                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.$watch('connectedSocket', function (newV, oldV) {
                if (newV === true && scope.username) {
                    socket.on('updateMemberOnline', function (data) {

                        if (data === scope.username.toString().trim()) {
                            loadDetails_service();
                        }

                    });
                }
            })
            scope.loadDetails = function () {
                if (scope.employee !== null && scope.employee !== undefined && scope.employee !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_employee_service);
                } else {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('username', function (val) {
                if (scope.username) {
                    scope.loadDetails();
                }

            });

            scope.$watch('employee', function (val) {
                if (scope.employee) {
                    scope.loadDetails();
                }

            });
        }
    }
}]);

myApp.directive('showUsernameNotify', ['fRoot', '$q', '$rootScope', 'socket', '$compile','localStorage', function (fRoot, $q, $rootScope, socket, $compile, $localStorage) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-username-notify'),
        scope: {
            username: "<",
            employee: "<",
            justName: "<",
            hideImage: "<",
            justImage: "<",
            withDepartment: "<",
            withoutTooltip: "<",
            showAbbreviation: "<",
            withCompetence: "<",
            customStyle: "@",
            timeNotify: "<"
        },
        link: function (scope, element) {
            var d = new Date();
            scope._ctrlName = "showUsername" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            // Áp dụng custom style nếu có
            if (scope.customStyle) {
                element.attr('style', scope.customStyle);
            }

            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const user = getDetailsUserLocal();
                if(!user){
                    dfdAr.push(getDetailsUser());
                }else{
                    scope.selectedItem = angular.copy(user);
                }
                $q.all(dfdAr).then(function(){
                    // scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetailsUserLocal(){
                const users = $localStorage.getItem('listUsers') || {};
                return users[scope.username.toString().trim()];
            }

            function setUserToLocal(user){
                const users = $localStorage.getItem('listUsers') || {};
                if(!users[user.username]){
                    users[user.username] = user;
                }
                $localStorage.setItem('listUsers', users, 30)
            }

            function getDetailsUser(){
                const dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/loadfordirective",
                    method: "POST",
                    data: JSON.stringify({ account: scope.username.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data)
                    setUserToLocal(data.data);
                    dfd.resolve(data.data)
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            if (!scope.withoutTooltip) {
                var tooltipElement = angular.element('<div class="custom-tooltip"></div>');
                element.append(tooltipElement);
                tooltipElement.hide();
                var compiledTooltip = null;
                scope.showTooltip = function () {
                    var htmlString = `
                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <img
                                    src="${scope.selectedItem.avatar ? scope.selectedItem.avatar.url : ''}" 
                                    alt="Avatar"/>
                            </div>
                            <div class="col-9">
                                <h5 class="tooltip-title">${scope.selectedItem.title}</h5>
                                    <div><i class="fa fa-briefcase" aria-hidden="true"></i> ${scope.selectedItem.competence ? scope.selectedItem.competence : 'No Data'}</div>
                                <div>
                                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                                    <show-department show-department show-abbreviation="false" department="${scope.selectedItem.department}"></show-department>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                    if (!compiledTooltip) {
                        compiledTooltip = $compile(htmlString)(scope);
                    }
                    tooltipElement.empty().append(compiledTooltip);
                    tooltipElement.show();
                }
                scope.hideTooltip = function () {
                    tooltipElement.hide();
                }
            }

            function loadDetails_employee_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/human/employee/loaddetails_d",
                    method: "POST",
                    data: JSON.stringify({ id: scope.employee.toString() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = {};
                    for (var i in data.data) {
                        scope.selectedItem[i] = data.data[i];
                    }
                    if (data.data && data.data.userInfo) {
                        for (var i in data.data.userInfo) {
                            scope.selectedItem[i] = data.data.userInfo[i];
                        }
                    }

                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.$watch('connectedSocket', function (newV, oldV) {
                if (newV === true && scope.username) {
                    socket.on('updateMemberOnline', function (data) {

                        if (data === scope.username.toString().trim()) {
                            loadDetails_service();
                        }

                    });
                }
            })
            scope.loadDetails = function () {
                if (scope.employee !== null && scope.employee !== undefined && scope.employee !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_employee_service);
                } else {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('username', function (val) {
                if (scope.username) {
                    scope.loadDetails();
                }

            });

            scope.$watch('employee', function (val) {
                if (scope.employee) {
                    scope.loadDetails();
                }

            });
        }
    }
}]);

myApp.directive('showUsernameTime', ['fRoot', '$q', '$rootScope', function (fRoot, $q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-username-time'),
        scope: {
            username: "<",
            employee: "<",
            time: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "showUsernameTime" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/human/employee/loaddetails_d",
                    method: "POST",
                    data: JSON.stringify({ id: scope.employee.toString() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.employee !== null && scope.employee !== undefined && scope.employee !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('employee', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

myApp.directive('showDepartment', ['fRoot', '$q', '$rootScope', function (fRoot, $q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-department'),
        scope: {
            department: "<",
            showAbbreviation: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "showDepartment" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ id: scope.department.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.department !== null && scope.department !== undefined && scope.department !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('department', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

myApp.directive('showDepartmentFix', ['fRoot', '$q', '$rootScope', function (fRoot, $q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-department-fix'),
        scope: {
            department: "<",
            showAbbreviation: "<"
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "showDepartment" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ id: scope.department.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.department !== null && scope.department !== undefined && scope.department !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('department', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

myApp.directive('showDirectory', ['fRoot', '$q', '$rootScope', function (fRoot, $q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-directory'),
        scope: {
            directory: "<",
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "showDirectory" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: 'value', id: scope.directory.toString().trim(), master_key:'competence' }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.directory !== null && scope.directory !== undefined && scope.directory !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('directory', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

myApp.directive('showUsernameOnlyname', ['fRoot', '$q', '$rootScope', 'socket', '$compile', 'localStorage', function (fRoot, $q, $rootScope, socket, $compile, $localStorage) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-username-onlyname'),
        scope: {
            username: "<",
            employee: "<",
            justName: "<",
            withoutTooltip: "<"
        },
        link: function (scope, element) {
            var d = new Date();
            scope._ctrlName = "showUsername" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const user = getDetailsUserLocal();
                if(!user){
                    dfdAr.push(getDetailsUser());
                }else{
                    scope.selectedItem = angular.copy(user);
                }
                $q.all(dfdAr).then(function(){
                    // scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetailsUserLocal(){
                const users = $localStorage.getItem('listUsers') || {};
                return users[scope.username.toString().trim()];
            }

            function setUserToLocal(user){
                const users = $localStorage.getItem('listUsers') || {};
                if(!users[user.username]){
                    users[user.username] = user;
                }
                $localStorage.setItem('listUsers', users, 30)
            }

            function getDetailsUser(){
                const dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/loadfordirective",
                    method: "POST",
                    data: JSON.stringify({ account: scope.username.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data)
                    setUserToLocal(data.data);
                    dfd.resolve(data.data)
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            if (!scope.withoutTooltip) {
                var tooltipElement = angular.element('<div class="custom-tooltip"></div>');
                element.append(tooltipElement);
                tooltipElement.hide();
                var compiledTooltip = null;
                scope.showTooltip = function () {
                    var htmlString = `
                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <img src="${scope.selectedItem.avatar ? scope.selectedItem.avatar.url : ''}"/>
                            </div>
                            <div class="col-9">
                                <h5 class="tooltip-title">${scope.selectedItem.title}</h5>
                                <div><i class="fa fa-briefcase" aria-hidden="true"></i> ${scope.selectedItem.competence}</div>
                                <div>
                                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                                    <show-department show-department show-abbreviation="false" department="${scope.selectedItem.department}"></show-department>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                    if (!compiledTooltip) {
                        compiledTooltip = $compile(htmlString)(scope);
                    }
                    tooltipElement.empty().append(compiledTooltip);
                    tooltipElement.show();
                }
                scope.hideTooltip = function () {
                    tooltipElement.hide();
                }
            }

            function loadDetails_employee_service() {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/human/employee/loaddetails_d",
                    method: "POST",
                    data: JSON.stringify({ id: scope.employee.toString() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = {};
                    for (var i in data.data) {
                        scope.selectedItem[i] = data.data[i];
                    }
                    if (data.data && data.data.userInfo) {
                        for (var i in data.data.userInfo) {
                            scope.selectedItem[i] = data.data.userInfo[i];
                        }
                    }

                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.$watch('connectedSocket', function (newV, oldV) {
                if (newV === true && scope.username) {
                    socket.on('updateMemberOnline', function (data) {

                        if (data === scope.username.toString().trim()) {
                            loadDetails_service();
                        }

                    });
                }
            })
            scope.loadDetails = function () {
                if (scope.employee !== null && scope.employee !== undefined && scope.employee !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_employee_service);
                } else {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('username', function (val) {
                if (scope.username) {
                    scope.loadDetails();
                }

            });

            scope.$watch('employee', function (val) {
                if (scope.employee) {
                    scope.loadDetails();
                }

            });
        }
    }
}]);

myApp.directive('showUsernameOnlynameCustomCss', ['fRoot', '$q', '$rootScope', 'socket', '$compile', function (fRoot, $q, $rootScope, socket, $compile) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-username-onlyname-custom-css'),
        scope: {
            username: "<",
            employee: "<",
            justName: "<",
            withoutTooltip: "<"
        },
        link: function (scope, element) {
            var d = new Date();
            scope._ctrlName = "showUsername" + d.getTime();
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const user = getDetailsUserLocal();
                if(!user){
                    dfdAr.push(getDetailsUser());
                }else{
                    scope.selectedItem = angular.copy(user);
                }
                $q.all(dfdAr).then(function(){
                    // scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetailsUserLocal(){
                const users = $localStorage.getItem('listUsers') || {};
                return users[scope.username.toString().trim()];
            }

            function setUserToLocal(user){
                const users = $localStorage.getItem('listUsers') || {};
                if(!users[user.username]){
                    users[user.username] = user;
                }
                $localStorage.setItem('listUsers', users, 30)
            }

            function getDetailsUser(){
                const dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/loadfordirective",
                    method: "POST",
                    data: JSON.stringify({ account: scope.username.toString().trim() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.selectedItem = angular.copy(data.data)
                    setUserToLocal(data.data);
                    dfd.resolve(data.data)
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            if (!scope.withoutTooltip) {
                var tooltipElement = angular.element('<div class="custom-tooltip"></div>');
                element.append(tooltipElement);
                tooltipElement.hide();
                var compiledTooltip = null;
                scope.showTooltip = function () {
                    var htmlString = `
                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <img src="${scope.selectedItem.avatar ? scope.selectedItem.avatar.url : ''}"/>
                            </div>
                            <div class="col-9">
                                <h5 class="tooltip-title">${scope.selectedItem.title}</h5>
                                <div><i class="fa fa-briefcase" aria-hidden="true"></i> ${scope.selectedItem.competence}</div>
                                <div>
                                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                                    <show-department show-department show-abbreviation="false" department="${scope.selectedItem.department}"></show-department>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                    if (!compiledTooltip) {
                        compiledTooltip = $compile(htmlString)(scope);
                    }
                    tooltipElement.empty().append(compiledTooltip);
                    tooltipElement.show();
                }
                scope.hideTooltip = function () {
                    tooltipElement.hide();
                }
            }

            function loadDetails_employee_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/office/human/employee/loaddetails_d",
                    method: "POST",
                    data: JSON.stringify({ id: scope.employee.toString() }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = {};
                    for (var i in data.data) {
                        scope.selectedItem[i] = data.data[i];
                    }
                    if (data.data && data.data.userInfo) {
                        for (var i in data.data.userInfo) {
                            scope.selectedItem[i] = data.data.userInfo[i];
                        }
                    }

                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.$watch('connectedSocket', function (newV, oldV) {
                if (newV === true && scope.username) {
                    socket.on('updateMemberOnline', function (data) {

                        if (data === scope.username.toString().trim()) {
                            loadDetails_service();
                        }

                    });
                }
            })
            scope.loadDetails = function () {
                if (scope.employee !== null && scope.employee !== undefined && scope.employee !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_employee_service);
                } else {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('username', function (val) {
                if (scope.username) {
                    scope.loadDetails();
                }

            });

            scope.$watch('employee', function (val) {
                if (scope.employee) {
                    scope.loadDetails();
                }

            });
        }
    }
}]);


myApp.directive('showManyUserOnlyname', ['fRoot', '$q', '$rootScope', 'socket', '$compile', function (fRoot, $q, $rootScope, socket, $compile) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-many-username-onlyname'),
        scope: {
            usernames: "<",
        },
        link: function (scope) {
            var d = new Date();
            scope._ctrlName = "showUsername" + d.getTime();
            scope.titles = '';
            scope.users = [];
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);

            function loadDetails_service() {
                const dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/loadmanyfordirective",
                    method: "POST",
                    data: JSON.stringify({ usernames: scope.usernames }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function(res) {
                    scope.users = angular.copy(res.data);
                    if(scope.users.length > 0) {
                        scope.titles = scope.users.map(user => user.title).join(", ")
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }
            scope.loadDetails = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service); 
            }
            scope.$watch('usernames', function (newValue) {
                if (newValue) {
                    scope.loadDetails();
                }
            });
        }
    }
}]);

function NumberToStringForDate(input) {
    input = input + "";
    input = parseInt(input);
    if (input > 9) {
        return input + "";
    } else {
        return "0" + input;
    }
}

myApp.directive('date', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('date'),
        scope: {
            func: "&",
            idValue: "<",
            label: "@",
            require: "<",
            disable: "<",
            min: "<",
            max: "<",
            endday: "<",
            inputType: "@"
        },
        link: function (scope) {
            function getTodayDateString() {
                let today = new Date();
                return today.getFullYear() + '-' + NumberToStringForDate(today.getMonth() + 1) + '-' + NumberToStringForDate(today.getDate());
            }

            function getMaxDateString() {
                let futureDate = new Date();
                futureDate.setFullYear(futureDate.getFullYear() + 99);
                return futureDate.getFullYear() + '-' + NumberToStringForDate(futureDate.getMonth() + 1) + '-' + NumberToStringForDate(futureDate.getDate());
            }

            scope.$watch('max', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.maxValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                } else {
                    scope.maxValue = getMaxDateString();
                }
            });

            scope.$watch('min', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.minValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                } else {
                    scope.minValue = getTodayDateString();
                }
            });

            scope.$watch('idValue', function () {
                var d;
                if (scope.idValue) {
                    d = new Date(parseInt(scope.idValue + ""));
                } else {
                    var today = new Date();
                    if (!scope.endday) {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
                    } else {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                    }
                }
                scope.value = d;
                scope._ctrlName = "date" + d.getTime();
                scope.pick();
            });

            scope.pick = function () {
                if (scope.value) {
                    scope.func({ params: scope.value });
                } else {
                    scope.func({ params: "" });
                }
            };
        }
    }
});

myApp.directive('dateOld', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('date-old'),
        scope: {
            func: "&",
            idValue: "<",
            label: "@",
            require: "<",
            disable: "<",
            min: "<",
            max: "<",
            endday: "<",
            inputType: "@"
        },
        link: function (scope) {
            function getTodayDateString() {
                let today = new Date();
                return today.getFullYear() + '-' + NumberToStringForDate(today.getMonth() + 1) + '-' + NumberToStringForDate(today.getDate());
            }

            function getMaxDateString() {
                let futureDate = new Date();
                futureDate.setFullYear(futureDate.getFullYear() + 99);
                return futureDate.getFullYear() + '-' + NumberToStringForDate(futureDate.getMonth() + 1) + '-' + NumberToStringForDate(futureDate.getDate());
            }

            function getMinDateString() {
                // Allow selecting past dates starting from a very old date
                let pastDate = new Date(1900, 0, 1); // Example: January 1, 1900
                return pastDate.getFullYear() + '-' + NumberToStringForDate(pastDate.getMonth() + 1) + '-' + NumberToStringForDate(pastDate.getDate());
            }

            scope.$watch('max', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.maxValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                } else {
                    scope.maxValue = getMaxDateString();
                }
            });

            scope.$watch('min', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.minValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                } else {
                    scope.minValue = getMinDateString(); // Allow past dates by default
                }
            });

            scope.$watch('idValue', function () {
                var d;
                if (scope.idValue) {
                    d = new Date(parseInt(scope.idValue + ""));
                } else {
                    var today = new Date();
                    if (!scope.endday) {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
                    } else {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                    }
                }
                scope.value = d;
                scope._ctrlName = "date" + d.getTime();
                scope.pick();
            });

            scope.pick = function () {
                if (scope.value) {
                    scope.func({ params: scope.value });
                } else {
                    scope.func({ params: "" });
                }
            };
        }
    }
});


myApp.directive("yearSelect", ['$rootScope', function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('year-select'),
        scope: {
            idValue: "=",
            label: "@",
            require: "<",
            disable: "<",
            selectYearFunc: "&"
        },
        link: function (scope) {
            // Danh sách năm từ 2000 đến 2050
            scope.years = [];
            for (let year = 2000; year <= 2050; year++) {
                scope.years.push(year);
            }

            // Gán tên duy nhất cho directive instance
            var d = new Date();
            scope._ctrlName = "year-select" + d.getTime();

            // Hàm chọn năm từ dropdown
            scope.selectYear = function (year) {
                scope.selectedYear = year;
                scope.idValue = year; // Gán giá trị cho idValue
                if (scope.selectYearFunc) {
                    scope.selectYearFunc({ params: year });
                }
            };

            // Hàm xóa lựa chọn
            scope.clear = function () {
                scope.selectedYear = null; // Xóa năm đã chọn
                scope.idValue = null; // Đặt lại idValue thành null
                scope.yearSearch = ""; // Xóa nội dung tìm kiếm
                if (scope.selectYearFunc) {
                    scope.selectYearFunc({ params: null }); // Gọi hàm callback với null
                }
            };

            // Theo dõi idValue để cập nhật selectedYear khi có thay đổi
            scope.$watch('idValue', function (val) {
                if (val) {
                    scope.selectedYear = val;
                } else {
                    scope.selectedYear = null;
                }
            });
        }
    };
}]);



myApp.directive('filterDirectory', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('filter-directory'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "filter-directory" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.idValue = scope.idValue || [];
            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                var temp = [];
                if (scope.filter && scope.filter.length > 0) {
                    temp = angular.copy(scope.filter);
                }
                if (scope.idValue && scope.idValue.length > 0) {
                    var item = {};
                    item[scope.extend.load_details_column] = { $nin: scope.idValue };
                    temp.push(item);

                }
                if (temp.length > 0) {
                    obj.filter = temp;
                }

                return obj;
            }


            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails_many",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, ids: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.showValue = "";
                    scope.selectedItem = angular.copy(data.data);
                    for (var i = 1; i <= scope.selectedItem.length; i++) {
                        if (i > 1) {
                            scope.showValue += "...";
                            break;
                        }
                        scope.showValue += scope.showField === 'title' ? scope.selectedItem[i - 1].title[$rootScope.Language.current] : scope.selectedItem[i - 1][scope.showField];
                        if (i < scope.selectedItem.length) {
                            scope.showValue += " ,";
                        }
                    }
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue.length > 0) {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = [];
                }
            }

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.data = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.open = function () {


            }

            function refreshData() {
                scope.selectedItem = [];
                scope.showValue = "";
                scope.load();
                scope.count();
                if (scope.idValue) {
                    scope.loadDetails();
                }

            }
            scope.refreshData = function () {
                if (scope.idValue) {
                    scope.load();
                    scope.count();
                }

            }


            scope.pick = function (val) {
                if (scope.idValue.indexOf(val) === -1) {
                    scope.idValue.push(val);
                    scope.pickFunc({ params: scope.idValue, params2: scope.extend });
                    refreshData();
                }
            }

            scope.remove = function (val) {
                scope.idValue = scope.idValue.filter(e => e !== val);
                scope.pickFunc({ params: scope.idValue, params2: scope.extend });
                refreshData();
            }

            scope.$watch('idValue', function () {
                refreshData();
            });
        }
    }
}]);

myApp.directive('filterAdvance', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('filter-advance'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            loadDataFunc: "&",
            countFunc: "&",
            localized: "@",
            loadDetailsFunc: "&",
            enableInsertNewItem: "<",
            insertItemFunc: "&",
            translate: "@",
            searchEvent: "@",
            defaultValue: "@",
            fieldValue: "@"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "filter-advance" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.selectedItems = [];
            scope.selectedChildItems = [];
            scope.idItems = scope.idValue || [];
            scope.fieldValue = scope.fieldValue || "_id";
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.selectAll = false;
            scope.clear = function () {
                scope.selectedItem = [];
                scope.pickFunc({ params: {} });
            }
            scope._localized = scope.localized === "false" ? false : true;

            scope._translate = scope.translate === "true" ? true : false;

            scope._search = scope.searchEvent === "true" ? true : false;

            scope.selectAllItems = function () {
                angular.forEach(scope.data, function (item) {
                    item.isSelected = scope.selectAll;
                    if (item.child_labels && item.child_labels.length > 0) {
                        item.child_labels.forEach(child => child.isSelected = scope.selectAll)
                    }
                });
                scope.updateSelectedItems();
            };

            scope.updateSelectAll = function () {
                scope.selectAll = scope.data.every(function (item) {
                    return item.isSelected;
                });
                scope.updateSelectedItems();
            };

            scope.updateSelectedItems = function () {
                scope.idItems = [];
                scope.selectedItems = scope.data.filter(function (item) {
                    return item.isSelected;
                }).map(function (item) {
                    scope.idItems.push(item[scope.fieldValue]);
                    return item;
                });
                scope.data.forEach(function (item) {
                    if (item.child_labels && item.child_labels.length > 0) {
                        item.child_labels.forEach(function (child) {
                            if (child.isSelected) {
                                scope.idItems.push(child[scope.fieldValue]);
                                scope.selectedItems.push(child);
                            }
                        });
                    }
                });
                scope.pickFunc({ params: scope.idItems, params2: scope.extend });
            };
            function load_service() {
                var dfd = $q.defer();

                scope.loadDataFunc({ params: { search: scope.search } }).then(function (data) {
                    scope.data = data.map(item => ({
                        ...item,
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                        isSelected: scope.idItems.includes(item[scope.fieldValue])
                    }));
                    scope.data.forEach(item => {
                        if (item.child_labels && item.child_labels.length > 0) {
                            item.child_labels = item.child_labels.map(child => ({
                                ...child,
                                showValue: (scope._localized ? child[scope.showField][$rootScope.Language.current] : child[scope.showField]) || '',
                                isSelected: scope.idItems.includes(child[scope.fieldValue])
                            }));
                        }
                    });
                    scope.updateSelectAll();
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.checkIsSelected = function (item) {
                return scope.idItems.indexOf(item[scope.fieldValue]) !== -1;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

            scope.setDefaultValue = function () {
                if (scope.defaultValue == "true") {
                    scope.init();
                }
            }
            scope.setDefaultValue()
        }
    }
}])

myApp.directive('filterAdvance2', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('filter-advance'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "@",
            require: "<",
            disable: "<",
            filter: "<",
            loadDataFunc: "&",
            countFunc: "&",
            localized: "@",
            loadDetailsFunc: "&",
            enableInsertNewItem: "<",
            insertItemFunc: "&",
            translate: "@",
            searchEvent: "@",
            defaultValue: "@"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "filter-advance" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.selectedItems = [];
            scope.selectedChildItems = [];
            scope.idItems = scope.idValue || [];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.selectAll = false;
            scope.clear = function () {
                scope.selectedItem = [];
                scope.pickFunc({ params: {} });
            }
            scope._localized = scope.localized === "false" ? false : true;

            scope._translate = scope.translate === "true" ? true : false;

            scope._search = scope.searchEvent === "true" ? true : false;

            scope.selectAllItems = function () {
                angular.forEach(scope.data, function (item) {
                    item.isSelected = scope.selectAll;
                    if (item.child_labels && item.child_labels.length > 0) {
                        item.child_labels.forEach(child => child.isSelected = scope.selectAll)
                    }
                });
                scope.updateSelectedItems();
            };

            scope.updateSelectAll = function () {
                scope.selectAll = scope.data.every(function (item) {
                    return item.isSelected;
                });
                scope.updateSelectedItems();
            };

            scope.updateSelectedItems = function () {
                scope.idItems = [];
                scope.selectedItems = scope.data.filter(function (item) {
                    return item.isSelected;
                }).map(function (item) {
                    scope.idItems.push(item._id);
                    return item;
                });
                scope.data.forEach(function (item) {
                    if (item.child_labels && item.child_labels.length > 0) {
                        item.child_labels.forEach(function (child) {
                            if (child.isSelected) {
                                scope.idItems.push(child._id);
                                scope.selectedItems.push(child);
                            }
                        });
                    }
                });

                scope.pickFunc({ params: scope.idItems, params2: scope.extend });
            };
            function load_service() {
                var dfd = $q.defer();

                scope.loadDataFunc({ params: { search: scope.search } }).then(function (data) {
                    scope.data = data.map(item => ({
                        ...item,
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                        isSelected: scope.idItems.includes(item._id)
                    }));
                    scope.data.forEach(item => {
                        if (item.child_labels && item.child_labels.length > 0) {
                            item.child_labels = item.child_labels.map(child => ({
                                ...child,
                                showValue: (scope._localized ? child[scope.showField][$rootScope.Language.current] : child[scope.showField]) || '',
                                isSelected: scope.idItems.includes(child._id)
                            }));
                        }
                    });
                    scope.updateSelectAll();
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.checkIsSelected = function (item) {
                return scope.idItems.indexOf(item._id) !== -1;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

            scope.setDefaultValue = function () {
                if (scope.defaultValue == "true") {
                    scope.init();
                }
            }

            scope.setDefaultValue();
            scope.$watch('idValue', function () {
                if (!scope._notyetInit) {

                    scope.idItems = scope.idValue || [];
                    for (let i in scope.data) {
                        if (scope.idItems.includes(scope.data[i]._id)) {
                            scope.data[i].isSelected = true;
                        } else {
                            scope.data[i].isSelected = false;
                        }
                    }
                    scope.updateSelectedItems();
                }

            })
        }
    }
}])

myApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {

                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            // element.bind('blur', function () {

            //     scope.$apply(model.assign(scope, false));
            // });
        }
    };
}]);

myApp.directive("pickUserChild", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-child'),
        scope: {
            item: "=",
            ctrl: "="
        }
    };
});

myApp.directive('pickUser', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            numOfItemPerPage: "<",
            loadEmployeeFunc: "&",
            pickFunc: "&",
            require: "<",
            disable: "<"
        },

        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope.ctrl = {};
            scope.ctrl._ctrlName = "pick-user" + d.getTime();

            scope.ctrl.pagination = {};
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.search = "";
            scope.data = [];
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.ctrl.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.ctrl.search = function () {
                var dfd = $q.defer();
                
                load_service(1).then(function (data) {
                    scope.data = data;
                    
                    if (scope.search.trim() === "") {
                        dfd.resolve(true);
                        return;
                    }
                    
                    var request = {
                        top: 0,
                        offset: 0,
                        sort: { title: 1 },
                        search: scope.search.trim()
                    };
                    
                    fRoot.requestHTTP({
                        url: BackendDomain + "/management/user/load_for_pick_user_directive",
                        method: "POST",
                        data: JSON.stringify(request),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (res) {
                        const uniqueDepartmentIds = [
                            ...new Set(res.data.map(item => item.departmentId))
                        ];

                        scope.data = scope.data.filter(item => uniqueDepartmentIds.includes(item.id));
                        scope.data.forEach(item => item.open = false);

                        dfd.resolve(true);
                    }, function (err) { dfd.reject(err); });
                }, function (err) { dfd.reject(err); });

                return dfd.promise;
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination[currentItem.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    currentItem.users = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination[currentItem.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset, department) {
                if (department) {
                    currentItem = department;
                }
                if (offset) {
                    scope.ctrl.pagination[currentItem.id].offset = offset;
                } else {
                    scope.ctrl.pagination[currentItem.id].offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }


            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }



            scope.refreshData_user = function () {

                if (currentItem.id) {
                    if (!scope.ctrl.pagination[currentItem.id]) {

                        scope.ctrl.pagination[currentItem.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.ctrl.pagination[currentItem.id].currentPage = 1;
                        scope.ctrl.pagination[currentItem.id].offset = 0;
                    }
                    scope.ctrl.load_user();
                    count_user_service();
                }

            }

            scope.ctrl.expandDepartment = function (item) {

                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                    scope.refreshData_user();
                }
            }

            scope.init = function () {
                var dfdAr = [];

                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('selectUsersByDepartment', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('select-users-by-department'),
        scope: {
            label: "@",
            idValue: "<",
            numOfItemPerPage: "<",
            pickFunc: "&",
            require: "<",
            disable: "<",
            idDepartment: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();

            scope.search = "";
            scope.data = [];
            scope._notyetInit = true;
            scope.disable = scope.disable || false;

            scope.ctrl = {};
            scope.ctrl._ctrlName = "select-users-by-department" + d.getTime();
            scope.ctrl.pagination = {
                offset: 0,
                top: 0,
                sort: 0,
                currentPage: 1,
                totalItem: 0,
            };
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 10;

            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);


            scope.ctrl.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: null });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: scope.idDepartment,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination.offset,
                    sort: { title: 1 },
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim();
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=varbose"
                    }
                }).then(function (res) {
                    scope.data = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: scope.idDepartment
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset) {
                if (offset) {
                    scope.ctrl.pagination.offset = offset;
                } else {
                    scope.ctrl.pagination.offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            scope.refreshData_user = function () {
                if (!scope.ctrl.pagination) {
                    scope.ctrl.pagination = {
                        currentPage: 1,
                        totalItems: 0,
                        offset: 0
                    };
                } else {
                    scope.ctrl.pagination.currentPage = 1;
                    scope.ctrl.pagination.offset = 0;
                }
                scope.ctrl.load_user();
                count_user_service();
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.ctrl.load_user());
                dfdAr.push(count_user_service());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}]);

myApp.directive('pickDepartmentOrUser', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-department-or-user'),
        scope: {
            label: "@",
            idValue: "<",
            loadFunc: "&",
            numOfItemPerPage: "<",
            loadEmployeeFunc: "&",
            pickFunc: "&",
            require: "<",
            disable: "<"
        },

        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope.ctrl = {};
            scope.ctrl._ctrlName = "pick-user" + d.getTime();

            scope.ctrl.pagination = {};
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.search = "";
            scope.data = [];
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.ctrl.pick = function (item) {
                scope.selectedItem = {
                    ...item,
                    type: "user",
                    id: item._id,
                    value: item.username,

                }
                scope.pickFunc({ params: scope.selectedItem });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.ctrl.pickDepartment = function (item) {
                scope.selectedItem = {
                    ...item,
                    type: "department",
                    id: item.id,
                    value: item.title[$rootScope.Language.current],
                }
                scope.pickFunc({ params: scope.selectedItem });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination[currentItem.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    currentItem.users = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination[currentItem.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset, department) {
                if (department) {
                    currentItem = department;
                }
                if (offset) {
                    scope.ctrl.pagination[currentItem.id].offset = offset;
                } else {
                    scope.ctrl.pagination[currentItem.id].offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }


            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }



            scope.refreshData_user = function () {

                if (currentItem.id) {
                    if (!scope.ctrl.pagination[currentItem.id]) {

                        scope.ctrl.pagination[currentItem.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.ctrl.pagination[currentItem.id].currentPage = 1;
                        scope.ctrl.pagination[currentItem.id].offset = 0;
                    }
                    scope.ctrl.load_user();
                    count_user_service();
                }

            }

            scope.ctrl.expandDepartment = function (item) {

                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                    scope.refreshData_user();
                }
            }

            scope.init = function () {
                var dfdAr = [];

                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive("pickUserMultiChild", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-multi-child'),
        scope: {
            item: "=",
            ctrl: "=",
            idValue: "<"
        }
    };
});

myApp.directive('pickUserMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-multi'),
        scope: {
            label: "@",
            idValue: "<",
            userValue: "<",
            numOfItemPerPage: "<",
            loadFunc: "&",
            loadEmployeeFunc: "&",
            pickFunc: "&",
            require: "<",
            disable: "<",
            departmentId: "@",
            getUserData: "<",
            numOfItemShow: "@",
            selectAll: "<"
        },

        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" }
            ];
            var d = new Date();
            scope.ctrl = {};
            scope.ctrl._ctrlName = "pick-user-multi" + d.getTime();
            scope.ctrl.pagination = {};
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.search = "";
            scope.data = [];
            scope.getUserData = scope.getUserData || false;
            var currentItem = {};
            scope.isSelectedAll = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });
            }

            if(scope.numOfItemShow === undefined){
                scope.numOfItemShow = 5;
            }

            scope.ctrl.pick = function (username) {

                scope.idValue = scope.idValue || [];
                if (scope.getUserData) {
                    if (scope.idValue.indexOf((e) => e.username == username) === -1) {
                        scope.idValue = scope.idValue.filter(e => e !== username);
                        scope.idValue.push(username);
                        scope.pickFunc({ params: scope.idValue });
                    }
                }
                else {
                    if (!scope.idValue.some((e) => e === username)) {
                        scope.idValue.push(username);
                        scope.pickFunc({ params: scope.idValue });
                    }
                }
            }

            scope.ctrl.search = function () {
                var dfd = $q.defer();
                
                load_service(1).then(function (data) {
                    scope.data = data;
                    
                    if (scope.search.trim() === "") {
                        dfd.resolve(true);
                        return;
                    }
                    
                    var request = {
                        top: 0,
                        offset: 0,
                        sort: { title: 1 },
                        search: scope.search.trim()
                    };
                    
                    fRoot.requestHTTP({
                        url: BackendDomain + "/management/user/load_for_pick_user_directive",
                        method: "POST",
                        data: JSON.stringify(request),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (res) {
                        const uniqueDepartmentIds = [
                            ...new Set(res.data.map(item => item.departmentId))
                        ];

                        scope.data = scope.data.filter(item => uniqueDepartmentIds.includes(item.id));
                        scope.data.forEach(item => item.open = false);

                        dfd.resolve(true);
                    }, function (err) { dfd.reject(err); });
                }, function (err) { dfd.reject(err); });

                return dfd.promise;
            }

            scope.ctrl.selectAllUsers = function (department) {
                var dfd = $q.defer();
                var request = {
                    department: department.id,
                    top: 0,
                    offset: 0,
                    sort: { title: 1 }
                };

                if (scope.search.trim() !== "") {
                    request.search = scope.search.trim();
                }
                
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.isSelectedAll[department.id] = res.data.map((user) => {
                        scope.ctrl.pick(user.username);
                        return user.username;
                    });

                    dfd.resolve(true);
                }, function (err) { dfd.reject(err); });
                return dfd.promise;
            };
            
            scope.ctrl.isAllSelected = function (department) {
                const users = scope.isSelectedAll[department.id];
                if (!users || !Array.isArray(users)) return false;

                const idValueSet = new Set(scope.idValue);
                return users.every((username) => idValueSet.has(username));
            };
            
            scope.remove = function (username) {
                scope.idValue = scope.idValue.filter((e) => {
                    return scope.getUserData ? e.username !== username.username : e !== username
                });
                scope.pickFunc({ params: scope.idValue });
            }


            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination[currentItem.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    currentItem.users = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination[currentItem.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset, department) {
                if (department) {
                    currentItem = department;
                }
                if (offset) {
                    scope.ctrl.pagination[currentItem.id].offset = offset;
                } else {
                    scope.ctrl.pagination[currentItem.id].offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }

            scope.refreshData_user = function () {

                if (currentItem.id) {
                    if (!scope.ctrl.pagination[currentItem.id]) {

                        scope.ctrl.pagination[currentItem.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.ctrl.pagination[currentItem.id].currentPage = 1;
                        scope.ctrl.pagination[currentItem.id].offset = 0;
                    }
                    scope.ctrl.load_user();
                    count_user_service();
                }

            }

            scope.ctrl.expandDepartment = function (item) {
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                    scope.refreshData_user();
                }
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('pickUserMulti2', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-multi-2'),
        scope: {
            label: "@",
            idValue: "<",
            userValue: "<",
            numOfItemPerPage: "<",
            loadFunc: "&",
            loadEmployeeFunc: "&",
            pickFunc: "&",
            require: "<",
            disable: "<",
            departmentId: "@",
            getUserData: "<",
            numOfItemShow: "@",
        },

        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" }
            ];
            var d = new Date();
            scope.ctrl = {};
            scope.ctrl._ctrlName = "pick-user-multi-2" + d.getTime();
            scope.ctrl.pagination = {};
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.search = "";
            scope.data = [];
            scope.getUserData = scope.getUserData || false;
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });
            }

            if(scope.numOfItemShow === undefined){
                scope.numOfItemShow = 5;
            }

            scope.ctrl.pick = function (username) {

                scope.idValue = scope.idValue || [];
                if (scope.getUserData) {
                    if (scope.idValue.indexOf((e) => e.username == username) === -1) {
                        scope.idValue = scope.idValue.filter(e => e !== username);
                        scope.idValue.push(username);
                        scope.pickFunc({ params: scope.idValue });
                    }
                }
                else {
                    if (scope.idValue.indexOf((e) => e == username) === -1) {
                        scope.idValue.push(username);
                        scope.pickFunc({ params: scope.idValue });
                    }
                }
            }
            function filterData(data) {
                const searchVal = (scope.search || '').toLowerCase();
                return (data || []).filter((item) => item.title[$rootScope.Language.current].toLowerCase().includes(searchVal) && !(scope.excludes || []).includes(item.id));
            }

            scope.remove = function (username) {
                scope.idValue = scope.idValue.filter((e) => {
                    return scope.getUserData ? e.username !== username.username : e !== username
                });
                scope.pickFunc({ params: scope.idValue });
            }


            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(filterData(res.data));
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination[currentItem.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    currentItem.users = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination[currentItem.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset, department) {
                if (department) {
                    currentItem = department;
                }
                if (offset) {
                    scope.ctrl.pagination[currentItem.id].offset = offset;
                } else {
                    scope.ctrl.pagination[currentItem.id].offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }

            scope.refreshData_user = function () {

                if (currentItem.id) {
                    if (!scope.ctrl.pagination[currentItem.id]) {

                        scope.ctrl.pagination[currentItem.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.ctrl.pagination[currentItem.id].currentPage = 1;
                        scope.ctrl.pagination[currentItem.id].offset = 0;
                    }
                    scope.ctrl.load_user();
                    count_user_service();
                }

            }

            scope.ctrl.expandDepartment = function (item) {
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                    scope.refreshData_user();
                }
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('selectMultiUsersByDepartment', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('select-multi-users-by-department'),
        scope: {
            label: "@",
            idValue: "<",
            numOfItemPerPage: "<",
            pickFunc: "&",
            require: "<",
            disable: "<",
            idDepartment: "<"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();

            scope.search = "";
            scope.data = [];
            scope._notyetInit = true;
            scope.disable = scope.disable || false;

            scope.ctrl = {};
            scope.ctrl._ctrlName = "select-multi-users-by-department" + d.getTime();
            scope.ctrl.pagination = {
                sort: 0,
                offset: 0,
                top: 0,
                currentPage: 1,
                totalItems: 0,
            };
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 10;

            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);


            scope.ctrl.pick = function (item) {
                scope.idValue = scope.idValue || [];
                if (scope.idValue.indexOf(item) === -1) {
                    scope.idValue.push(item);
                    scope.pickFunc({ params: scope.idValue });
                }
            }

            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });
            }

            scope.remove = function (username) {
                scope.idValue = scope.idValue.filter(e => e !== username);
                scope.pickFunc({ params: scope.idValue });
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: scope.idDepartment,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination.offset,
                    sort: { title: 1 },
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim();
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=varbose"
                    }
                }).then(function (res) {
                    scope.data = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: scope.idDepartment
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset) {
                if (offset) {
                    scope.ctrl.pagination.offset = offset;
                } else {
                    scope.ctrl.pagination.offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            scope.refreshData_user = function () {
                if (!scope.ctrl.pagination) {
                    scope.ctrl.pagination = {
                        currentPage: 1,
                        totalItems: 0,
                        offset: 0
                    };
                } else {
                    scope.ctrl.pagination.currentPage = 1;
                    scope.ctrl.pagination.offset = 0;
                }
                scope.ctrl.load_user();
                count_user_service();
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.ctrl.load_user());
                dfdAr.push(count_user_service());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}])

myApp.directive('dropdownListEdit', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: 'E',
        templateUrl: get_Url_Directive_Html('dropdown-list-edit'),
        scope: {
            item: '=',
            options: '=',
            selectOption: '&',
            closeDropdown: '&',
            defaultValue: '@',
            type: '@'
        },
        link: function (scope) {


            scope.toggleDropdown = function (itemId) {
                scope.activeItemId = scope.activeItemId === itemId ? null : itemId;
            };

            scope.openDropdown = function () {
                scope.isDropdownOpen = true;
            };

            scope.closeDropdown = function () {
                scope.isDropdownOpen = false;
                scope.searchText = '';
                scope.closeDropdown({ itemId: scope.item.id });
            };
        }
    };
}]);


myApp.directive('pickIcon', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-icon'),
        scope: {
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory" + d.getTime();
            scope.extend = {
                master_key: "icon",
                load_details_column: "value"
            };
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });



            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.data = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}]);

myApp.directive('alphabets', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^A-Za-zÂÊÔĂĐƠƯâêôăđơư]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

myApp.directive('templateTagName', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^A-Za-z0-9_]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

myApp.directive('uppercase', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = (text || '').toUpperCase();
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

myApp.directive('breadcrumb', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('breadcrumb'),
        scope: {
            items: "<"
        },
        link: function (scope) {
            scope.rootItem = null;
            scope.breadcrumbItems = [];
            scope.currentItem = null;
            
            function init() {
                if (!scope.items || !scope.items.length) {
                    return;
                }


                scope.getItemPath = (item) => {
                    switch (item.object) {
                        case 'dispatch_arrived':
                            return `/da-details?${item.id}`;
                        case 'project':
                            return '/task?tab=project' + (item.code ? `&code=${item.code}` : '');
                        case 'task':
                            return '/task-details' + (item.code ? `?code=${item.code}` : '');
                        case 'workflow_play':
                            return '/signing-details' + (item.code ? `?code=${item.code}` : '');
                        case 'odb':
                            return `/odb-details?${item.id}`;
                        case 'outgoing_dispatch': 
                            return `/odb-details?${item.id}`;
                        case 'briefcase':
                            return '/storage' + (item.code ? `/${item.code}` : '');
                        default:
                            return '';
                    }
                }

                // get root item
                scope.rootItem = {
                    object: scope.items[0].object,
                    path: scope.getItemPath({ object: scope.items[0].object }),
                };

                // get all except the last item
                scope.breadcrumbItems = scope.items.slice(0, -1);

                // get the last item
                scope.currentItem = scope.items[scope.items.length - 1];
            }

            scope.$watch('items', function () {
                init();
            });
        }
    }
});

myApp.directive("buttonSwitch", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-switch'),
        scope: {
            buttonSwitchFunc: '&',
            buttonSwitchLabel: "@",
            buttonSwitchModel: "=",
            buttonSwitchDisabled: "<",
        },
        link: function (scope, elem, attrs) {
            scope.buttonSwitchDisabled = scope.buttonSwitchDisabled || false

            scope.buttonSwitchClick = function () {
                if (scope.buttonSwitchFunc) {
                    scope.buttonSwitchFunc({ params: scope.buttonSwitchModel });
                }
            }

            scope.buttonSwitchChange = function (val) {
                scope.buttonSwitchModel = angular.copy(val);
                if (scope.buttonSwitchFunc) {
                    scope.buttonSwitchFunc({ params: val });
                }
            }
        }
    };
});


myApp.directive('pickTypeQuestion', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-type-question'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            valueUpdate: "<",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
            ];
            var d = new Date();
            scope._ctrlName = "pick-type-question" + d.getTime();
            scope.data = [];
            scope.numOfItemPerPage = scope.numOfItemPerPage || 10;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                return obj;
            }

            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/education/question_answer/loadListTypeOfQuestions",
                    method: "POST",
                    data: JSON.stringify({
                        search: filter.search,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.data = data.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/education/question_answer/countTypeQuestions",
                    method: "POST",
                    data: JSON.stringify({
                        search: filter.search,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.refreshData = function () {
                scope.count();
                scope.load();
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.count());
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                    if (scope.valueUpdate) {
                        scope.selectedItem.title_vi = scope.valueUpdate
                    }
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }


        }
    }
}]);

myApp.directive("modalButtonAckTrainingEvent", ["$rootScope", function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html(
            "modal-button-ack-training-event"
        ),
        scope: {
            modalButtonAckTrainingEventType: "@",
            modalButtonAckTrainingEventId: "<",
            modalButtonAckTrainingEventShowButton: "<",
            modalButtonAckTrainingEventFunc: "&",
            modalButtonAckTrainingEventLabel: "@",
            modalButtonAckTrainingEventCtrlName: "@",
            modalButtonAckTrainingEventObjName: "@",
            modalButtonAckTrainingEventActionName: "@",
            modalButtonAckTrainingEventStudentId: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            var d = new Date();
            scope.ctrl._ctrlName =
                "modal-button-ack-training-event" + scope.modalButtonAckTrainingEventStudentId;
            scope.modalButtonAckTrainingEventClick = function () {
                scope.modalButtonAckTrainingEventFunc({
                    studentId: scope.modalButtonAckTrainingEventStudentId,
                    type: scope.modalButtonAckTrainingEventType,
                    modalName: scope.ctrl._ctrlName
                });
            };
        },
    };
}]);

myApp.directive("textAreaWithSuggestions", ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html(
            "text-area-with-suggestions"
        ),
        scope: {
            ngModel: '=',
            placeholder: '@',
            cols: '@',
            rows: '@',
            id: '@',
            class: '@',
            ngRequired: '=',
            ngDisabled: '=',
            ngBlur: '&',
        },
        link: function (scope) {
            scope.suggestions = [];
            scope.placeholder = scope.placeholder || 'Type here...';
            scope.functionApply = '';

            function focusFunction() {
                const pathSegments = $rootScope.currentPath.split('/');
                const filteredSegments = pathSegments[1].split('?')
                scope.functionApply = filteredSegments[0];

                const function_apply = scope.functionApply;
                const master_key = 'suggest_value';


                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + `/management/directory/load`,
                    method: "POST",
                    data: JSON.stringify({ master_key, top: 0, offset: 0 }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    const dataResult = res.data.filter((i) => (i.function_apply ? i.function_apply.some((substring) => function_apply.includes(substring)) : false));
                    scope.suggestions = dataResult.map((i) => ({ value: i.title[$rootScope.Language.current], color: i.choose_color }));
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            };

            focusFunction();


            scope.addSuggestion = function (suggestion) {
                var input = scope.ngModel ? scope.ngModel.split(' ') : [' '];
                input[input.length - 1] = suggestion;
                scope.ngModel = input.join(' ') + ' ';
                scope.suggestions = [];
            };

            scope.ngBlurFunction = function () {
                scope.ngBlur();
            }
        },
    };
}]);

myApp.directive('pickUserDepartmentMulti', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-user-department-multi'),
        scope: {
            label: "@",
            idValue: "<",
            numOfItemPerPage: "<",
            loadFunc: "&",
            loadEmployeeFunc: "&",
            pickFunc: "&",
            require: "<",
            disable: "<",
            departmentId: "@",
            disableUserSelection: "<",
        },

        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" }
            ];
            var d = new Date();
            scope.ctrl = {};
            scope.ctrl._ctrlName = "pick-user-department-multi" + d.getTime();
            scope.ctrl.pagination = {};
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.search = "";
            scope.data = [];
            var currentItem = {};
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.idValue = {
                    user: [],
                    department: []
                };
                scope.pickFunc({ params: scope.idValue });
            }

            scope.ctrl.pick_user = function (username) {
                scope.idValue = Object.keys(scope.idValue).length ? scope.idValue : { user: [], department: [] };
                if (scope.idValue.user.indexOf(username) === -1) {
                    scope.idValue.user.push(username);
                    scope.pickFunc({ params: scope.idValue });
                }
            }

            scope.ctrl.pick_department = function (department) {
                scope.idValue = Object.keys(scope.idValue).length ? scope.idValue : { user: [], department: [] };
                if (scope.idValue.department.indexOf(department) === -1) {
                    scope.idValue.department.push(department);
                    scope.pickFunc({ params: scope.idValue });
                }
            }

            scope.remove_user = function (username) {
                scope.idValue.user = scope.idValue.user.filter(e => e !== username);
                scope.pickFunc({ params: scope.idValue });
            }

            scope.remove_department = function (department) {
                scope.idValue.department = scope.idValue.department.filter(e => e !== department);
                scope.pickFunc({ params: scope.idValue });
            }


            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_service(level, id) {
                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + "/office/organization/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify({ level, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination[currentItem.id].offset,
                    sort: { title: 1 }
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    currentItem.users = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    department: currentItem.id
                };

                if (scope.search && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_for_pick_user_directive",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination[currentItem.id].totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset, department) {
                if (department) {
                    currentItem = department;
                }
                if (offset) {
                    scope.ctrl.pagination[currentItem.id].offset = offset;
                } else {
                    scope.ctrl.pagination[currentItem.id].offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            function load() {
                if (currentItem.id) {
                    load_service(currentItem.level + 1, currentItem.id).then(function (data) {
                        currentItem.childs = data;
                    }, function (err) {
                        err = undefined;
                    });
                } else {
                    load_service(1).then(function (data) {
                        scope.data = data;
                    }, function (err) {
                        dfd.reject(err);
                    });
                }
            }

            scope.refreshData_user = function () {

                if (currentItem.id) {
                    if (!scope.ctrl.pagination[currentItem.id]) {

                        scope.ctrl.pagination[currentItem.id] = {
                            currentPage: 1,
                            totalItems: 0,
                            offset: 0
                        };
                    } else {
                        scope.ctrl.pagination[currentItem.id].currentPage = 1;
                        scope.ctrl.pagination[currentItem.id].offset = 0;
                    }
                    scope.ctrl.load_user();
                    count_user_service();
                }

            }

            scope.ctrl.expandDepartment = function (item) {
                currentItem = item;
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.childs = [];
                } else {
                    currentItem.open = true;
                    load();
                    scope.refreshData_user();
                }
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }

        }
    }
}]);

myApp.directive('clickOutside', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onClick = function (event) {
                if (element[0] !== event.target && !element[0].contains(event.target)) {
                    scope.$apply(attrs.clickOutside);
                }
            };

            $document.on('click', onClick);

            scope.$on('$destroy', function () {
                $document.off('click', onClick);
            });
        }
    };
}]);

myApp.directive('viewCarTicketDetail', function () {
    return {
        restrict: 'E',
        templateUrl: FrontendDomain + '/modules/office/car_management/directives/view_car_ticket_detail.html',
        scope: {
            data: '=',
            loadFileFn: '<',
            approveRole: '<'
        },
        link: function (scope, elem, attrs) {
            scope.loadFileFn = function () {
                if (scope.loadFileFn) {
                    scope.loadFileFn({ params: scope.data });
                }
            }
        },
    };
});

myApp.directive("isuse", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('isuse'),
        scope: {
            isuseValue: "<"
        }
    };
})

myApp.directive('dateTime', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('date-time'),
        scope: {
            func: "&",
            idValue: "<",
            label: "@",
            require: "<",
            disable: "<",
            min: "<",
            max: "<",
            endday: "<"
        },
        link: function (scope) {
            // Watchers for min and max dates
            scope.$watch('max', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.maxValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                }
            });
            scope.$watch('min', function (value) {
                if (value) {
                    let temp = new Date(value);
                    scope.minValue = temp.getFullYear() + '-' + NumberToStringForDate(temp.getMonth() + 1) + '-' + NumberToStringForDate(temp.getDate());
                }
            });
            scope.$watch('idValue', function () {
                var d;
                if (scope.idValue) {
                    d = new Date(parseInt(scope.idValue + ""));
                } else {
                    var today = new Date();
                    if (!scope.endday) {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
                    } else {
                        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                    }

                }

                scope.dateValue = d;
                scope.timeValue = d;
                scope._ctrlName = "date" + d.getTime();
                scope.pick();
            });

            // Functions to handle date and time changes
            scope.pickDate = function () {
                scope.pick();
            };

            scope.pickTime = function () {
                scope.pick();
            }

            // Function to combine date and time into a single Date object
            scope.pick = function () {
                if (scope.dateValue && scope.timeValue) {
                    const combinedDateTime = combineDateAndTime(scope.dateValue, scope.timeValue);
                    scope.func({ params: combinedDateTime });
                } else {
                    scope.func({ params: "" });
                }
            };

            function combineDateAndTime(dateValue, timeValue) {
                const dateYear = dateValue.getFullYear();
                const dateMonth = dateValue.getMonth();
                const dateDay = dateValue.getDate();

                const timeHours = timeValue.getHours();
                const timeMinutes = timeValue.getMinutes();
                const timeSeconds = timeValue.getSeconds();

                const combinedDate = new Date(dateYear, dateMonth, dateDay, timeHours, timeMinutes, timeSeconds);
                return combinedDate;
            }
        }
    }
});

myApp.directive("modalButtonRecall", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-recall'),
        scope: {
            modalButtonRecallInvalid: "<",
            modalButtonRecallParams: "<",
            modalButtonRecallFunc: "&",
            modalButtonRecallLabel: "@",
            modalButtonRecallCtrlname: "@",
            modalButtonRecallObjname: "@",
            modalButtonRecallActionname: "@",
            modalButtonRecallType: "@"
        },
        link: function (scope) {
            scope.modalButtonRecallClick = function () {
                scope.modalButtonRecallFunc({ params: scope.modalButtonRecallParams });
            }
        }
    };
});

myApp.directive("buttonRecallItem", function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('button-recall-item'),
        scope: {
            buttonRecallItemFunc: '&',
            buttonRecallItemParams: "<",
            buttonRecallItemModal: "@",
            buttonLabel: "@"
        },
        link: function (scope, elem, attrs) {
            scope.buttonEditClick = function () {
                if (scope.buttonRecallItemFunc) {
                    scope.buttonRecallItemFunc({ params: scope.buttonRecallItemParams });
                }
            }
        }
    };
});

myApp.directive('customTooltip', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            tooltipContent: '@',
            tooltipPosition: '@',
        },
        link: function (scope, element, attrs) {
            var tooltipElement = angular.element('<div class="custom-tooltip"></div>');
            angular.element(document.body).append(tooltipElement);
            tooltipElement.hide();

            var compiledTooltip = null;

            function showTooltip(event) {
                if (!compiledTooltip) {
                    var htmlString = `
                        <div class="tooltip-container">
                            <div class="tooltip-content">${scope.tooltipContent}</div>
                        </div>
                    `;
                    compiledTooltip = $compile(htmlString)(scope);
                }
                tooltipElement.empty().append(compiledTooltip);
                tooltipElement.show();

                // Định vị tooltip tại vị trí con trỏ chuột
                var tooltipWidth = tooltipElement.outerWidth();
                var tooltipHeight = tooltipElement.outerHeight();
                var x = event.pageX;
                var y = event.pageY;
                var position = scope.tooltipPosition ? scope.tooltipPosition.split('-') : ['bottom', 'right'];
                // Thêm một chút offset để tooltip không che con trỏ chuột
                const css = {
                    position: 'absolute',
                    top: (y - 10) + 'px',
                    left: (x - 10) + 'px'
                }

                if (position[0] === 'top') {
                    css.top = (y - tooltipHeight - 50) + 'px'
                }

                if (position[1] === 'left') {
                    css.left = (x - tooltipWidth - 50) + 'px'
                }
                tooltipElement.css(css);
            }

            function hideTooltip() {
                tooltipElement.hide();
            }

            element.on('mousemove', showTooltip);
            element.on('mouseleave', hideTooltip);

            // Cleanup khi scope bị hủy
            scope.$on('$destroy', function () {
                element.off('mousemove', showTooltip);
                element.off('mouseleave', hideTooltip);
                tooltipElement.remove();
            });
        }
    };
}]);

myApp.directive('customToast', ['toastValues', '$timeout', function (toastValues, $timeout) {
    const showDuration = 5 * 1000;
    const validTypes = ['success', 'danger', 'warning'];
    return {
        restrict: 'E',
        templateUrl: get_Url_Directive_Html('custom-toast'),
        link: function (scope, element, att) {
            scope.toastValues = toastValues;
            scope.addToastValue = function (toastValue) {
                toastValue.id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
                if (!validTypes.includes(toastValue.type)) {
                    toastValue.type = validTypes[0];
                }
                scope.toastValues.push(toastValue);
                $timeout(() => showAnimation(toastValue.id), 1);
                function showAnimation(idToast) {
                    const elm = angular.element(document.getElementById(`notification-toast-${idToast}`));
                    elm.addClass('show');
                }
                $timeout(function () {
                    scope.removeToast(toastValue.id)
                }, showDuration);
            }
            scope.removeToast = function (idToast) {
                $(`#notification-toast-${idToast}`).addClass('hide');
                $timeout(() => {
                    scope.toastValues = scope.toastValues.filter(toast => toast.id !== idToast);
                }, 10);
            }
        }
    };
}]);

myApp.directive('ngScroll', ['$window', function ($window) {
    return {
        restrict: 'A',
        scope: {
            ngScroll: '&'
        },
        link: function (scope, element, attrs) {
            var windowEl = angular.element($window);
            var handler = function () {
                var scrollTop = windowEl.scrollTop();
                var windowHeight = windowEl.height();
                var documentHeight = angular.element(document).height();

                if (scrollTop + windowHeight >= documentHeight) {
                    scope.$apply(function () {
                        scope.ngScroll();
                    });
                }
            };
            windowEl.on('scroll', handler);

            scope.$on('$destroy', function () {
                windowEl.off('scroll', handler);
            });
        }
    };
}]);

myApp.directive('seeMore', function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            maxLines: '@'
        },
        template: `
            <a class="see-more" ng-if="item.hasMoreLines" ng-click="toggleContent()">
                {{ item.expanded ? ('SeeLess'|l) : ('SeeMore'|l) }}
            </a>
        `,
        link: function (scope, element) {
            scope.toggleContent = function () {
                scope.item.expanded = !scope.item.expanded;
                if (scope.item.expanded) {
                    element.parent().find('.feed-content').css('-webkit-line-clamp', 'unset');
                } else {
                    element.parent().find('.feed-content').css('-webkit-line-clamp', scope.maxLines);
                }
            };

            // Initialize with maxLines
            if (!scope.item.expanded) {
                element.parent().find('.feed-content').css('-webkit-line-clamp', scope.maxLines);
            }

            // Check if content exceeds maxLines
            scope.$watch('item.content', function () {
                const contentElement = element.parent().find('.feed-content');
                const lineHeight = parseInt(contentElement.css('line-height'), 10);
                const contentHeight = contentElement[0].scrollHeight;
                const maxContentHeight = lineHeight * scope.maxLines;
                scope.item.hasMoreLines = contentHeight > maxContentHeight;
            });
        }
    };
});
myApp.directive("selectMultiDepartment2", ['languageValue',function ($languageValue) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('select-multi-department-2'),
        scope: {
            label: "@",
            departments: "=",
            choosedDepartments: "=",
            disabled:"<"
        },
        link: function(scope) {
            var d = new Date();
            scope.ctrl = {};
            scope.languageCurrent = $languageValue.current;
            scope.ctrl._ctrlName = "select-multi-users-by-department" + d.getTime();
            scope.ctrl.pick = function (deparment) {
                const deparmentChoosed = scope.choosedDepartments.find((item)=>item.id === deparment.id);
                if (!deparmentChoosed) {
                    scope.choosedDepartments.push(deparment);
                }
            }

            scope.clear = function () {
                scope.choosedDepartments = [];
            }

            scope.remove = function (id) {
                scope.choosedDepartments = scope.choosedDepartments.filter(e => e._id !== id);
            }

            scope.close = function(){
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }
        }
    }
}]);

myApp.directive('selectUserByRule', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('select-users-by-rule'),
        scope: {
            label: "@",
            idValue: "<",
            numOfItemPerPage: "<",
            pickFunc: "&",
            require: "<",
            disable: "<",
            rule: "@"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();

            scope.search = "";
            scope.data = [];
            scope._notyetInit = true;
            scope.disable = scope.disable || false;

            scope.ctrl = {};
            scope.ctrl._ctrlName = "select-user-by-rule" + d.getTime();
            scope.ctrl.pagination = {
                offset: 0,
                top: 0,
                sort: 0,
                currentPage: 1,
                totalItem: 0,
            };
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 10;

            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);


            scope.ctrl.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    rule: scope.rule,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination.offset,
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim();
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_by_rule",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=varbose"
                    }
                }).then(function (res) {
                    scope.data = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    rule: scope.rule
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_by_rule",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination.totalItems = data.data[0].count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset) {
                if (offset) {
                    scope.ctrl.pagination.offset = offset;
                } else {
                    scope.ctrl.pagination.offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            scope.refreshData_user = function () {
                if (!scope.ctrl.pagination) {
                    scope.ctrl.pagination = {
                        currentPage: 1,
                        totalItems: 0,
                        offset: 0
                    };
                } else {
                    scope.ctrl.pagination.currentPage = 1;
                    scope.ctrl.pagination.offset = 0;
                }
                scope.ctrl.load_user();
                count_user_service();
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.ctrl.load_user());
                dfdAr.push(count_user_service());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}]);

myApp.directive('tagInput', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('tag-input'),
        scope: {
            tags: "=", 
            placeholder: "@", 
            onTagAdd: "&", 
            onTagRemove: "&" 
        },
        link: function (scope, elem) {
            scope.newTag = ""; 
            scope.tags = scope.tags || []; 

            // Function to add a new tag
            scope.addTag = function () {
                const newTag = scope.newTag.trim();
                if (newTag !== "" && !scope.tags.includes(newTag)) {
                    scope.tags.push(newTag);
                    scope.onTagAdd({ tag: newTag });
                    scope.newTag = ""; // Clear the input field
                } else if (scope.tags.includes(newTag)) {
                    alert("This tag already exists.");
                }
            };

            // Function to remove a tag
            scope.removeTag = function (index) {
                const removedTag = scope.tags.splice(index, 1)[0];
                scope.onTagRemove({ tag: removedTag });
            };

            // Handle keydown events (Enter to add tag)
            scope.handleKeydown = function (event) {
                if (event.key === "Enter") {
                    scope.addTag();
                    event.preventDefault();
                }
            };
        }
    };
}]);

myApp.directive("modalButtonRejectTransfer",['$filter', function ($filter) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('modal-button-reject-transfer'),
        scope: {
            modalButtonRejectInvalid: "<",
            modalButtonRejectParams: "<",
            modalButtonRejectFunc: "&",
            modalButtonRejectLabel: "@",
            modalButtonRejectCtrlname: "@",
            modalButtonRejectObjname: "@",
            modalButtonRejectActionname: "@",
            modalButtonRejectType: "@",
            modalButtonConfirmText: "@",
            modalButtonFunctionApply: "<",
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl._hintNoteSet = [
                'I agree',
                'I approve'
            ];
            var d = new Date();
            scope.ctrl._ctrlName = "modal-button-reject-transfer-" + d.getTime();
            scope.ctrl.set_hint_note = function(note) {
                scope.ctrl.note = $filter('l')(note);
            };
            scope.modalButtonRejectClick = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                scope.modalButtonRejectFunc({ params: scope.ctrl.note });

            }
        }
    };
}]);

myApp.directive("textAreaWithSuggestions2", ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html(
            "text-area-with-suggestions-2"
        ),
        scope: {
            ngModel: '=',
            placeholder: '@',
            cols: '@',
            rows: '@',
            id: '@',
            class: '@',
            ngRequired: '=',
            ngDisabled: '=',
            ngBlur: '&',
            functionApply:"<"
        },
        link: function (scope) {
            scope.suggestions = [];
            scope.placeholder = scope.placeholder || 'Type here...';

            function focusFunction() {
                const master_key = 'suggest_value';

                const filter = [
                    { function_apply: { $in: scope.functionApply} }
                ]

                var dfd = $q.defer();
                fRoot.requestHTTP({
                    url: BackendDomain + `/management/directory/load_for_directive`,
                    method: "POST",
                    data: JSON.stringify({ master_key, top: 0, offset: 0, filter }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (res) {
                    scope.suggestions = res.data.map((i) => ({ value: i.title[$rootScope.Language.current], color: i.choose_color }));
                    dfd.resolve(res.data);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            };

            focusFunction();


            scope.addSuggestion = function (suggestion) {
                scope.ngModel = suggestion;
            };

            scope.ngBlurFunction = function () {
                scope.ngBlur();
            }
        },
    };
}]);

myApp.directive('pickModalAdvanceMulti2', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-advance-multi-2'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            loadDataFunc: "&",
            countFunc: "&",
            localized: "@",
            loadDetailsFunc: "&",
            enableInsertNewItem: "<",
            insertItemFunc: "&",
            hiddenLabel: "<",
            itemShow: "@"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            var currentItem = {};
            scope._ctrlName = "pick-modal-advance-multi" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            scope.selectedItem = scope.idValue || [];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = [];
                scope.pickFunc({ params: {} });
            }
            scope._localized = scope.localized === "false" ? false : true;

            if(scope.itemShow === undefined || !scope.itemShow){
                scope.itemShow = 4;
            }

            scope.pick = function (item, child) {
                if (!scope.selectedItem.includes(item._id)) {
                    scope.selectedItem.push(item._id);
                    scope.showItem.push(item);
                }
                if (!scope.selectedItem.includes(child._id)) {
                    scope.selectedItem.push(child._id);
                    scope.showItem.push(child);
                }
                scope.pickFunc({ params: scope.selectedItem, params2: scope.extend });
            }

            function checkExist(item) {
                for (var i in scope.selectedItem) {
                    if (scope.selectedItem[i].id === item.id) {
                        return true;
                    }
                }
                return false;
            }

            scope.pickMajor = function (item) {
                if (item.object) {
                    if (!checkExist(item)) {
                        scope.selectedItem.push({ id: item.id, code: item.code, object: item.object });
                        scope.showItem.push(item);
                    }
                } else {
                    if (!scope.selectedItem.includes(item._id)) {
                        scope.selectedItem.push(item._id);
                        scope.showItem.push(item);
                    }
                }
                scope.pickFunc({ params: scope.selectedItem, params2: scope.extend });
            }

            scope.remove = function (item) {
                scope.selectedItem = scope.selectedItem.filter(i => i !== item._id);
                scope.showItem = scope.showItem.filter(i => i._id !== item._id);

                scope.pickFunc({ params: scope.selectedItem });
                if(item.object) {
                    let temp = [];
                    for (var i in scope.selectedItem) {
                        if (scope.selectedItem[i].id !== item.id) {
                            temp.push(scope.selectedItem[i]);
                        }
                    }
                    scope.selectedItem = angular.copy(temp);
                    scope.pickFunc({ params: scope.selectedItem });
                    temp = undefined;
                    event.stopPropagation()
                } else {
                    let temp = [];
                    for (var i in scope.selectedItem) {
                        if (scope.selectedItem[i] !== item._id) {
                            temp.push(scope.selectedItem[i]);
                        }
                    }
                    scope.selectedItem = angular.copy(temp);
                    scope.pickFunc({ params: scope.selectedItem });
                    temp = undefined;
                    event.stopPropagation()
                }
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.removeAll = function () {
                scope.selectedItem = [];
                scope.showItem = [];
                scope.pickFunc({ params: {} });  
                event.stopPropagation()    
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                scope.loadDetailsFunc({ params: { ids: scope.idValue } }).then(function (data) {
                    
                    let dataDetails = data.map(item => ({
                        ...item,
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                    }));
                    scope.selectedItem = angular.copy(scope.idValue);
                    scope.showItem = angular.copy(dataDetails);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                }
            }

            scope.$watch('idValue', function (val) {
                if (val && val.length) {
                    scope.loadDetails();
                    $("#" + scope._ctrlName).modal("hide");
                } else {
                    scope.selectedItem = [];
                    scope.showItem = []
                }
            });

            function load_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.loadDataFunc({ params: { search } }).then(function (data) {
                    
                    scope.data = data.map(item => ({
                        ...item, 
                        showValue: (scope._localized ? item[scope.showField][$rootScope.Language.current] : item[scope.showField]) || '',
                    }))
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.expandLabel = function (item) {
                currentItem = item
                if (currentItem.open) {
                    currentItem.open = false;
                    currentItem.child_labels = [];
                } else {
                    currentItem.open = true;
                    scope.load()
                }
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                let search = scope.search;
                if (search === '') {
                    search = undefined;
                }
                scope.countFunc({ params: { search } }).then(function (data) {
                    scope.totalItems = data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.load());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}])

myApp.directive('datetimeLocal', function () {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('datetime-local'),
        scope: {
            func: "&",
            idValue: "<",
            label: "@",
            require: "<",
            disable: "<",
            min: "<",
            max: "<",
        },
        link: function (scope) {
            scope.$watch('max', function (value) {
                if (value) {
                    scope.maxValue = new Date(value).toISOString().slice(0, 16);
                }
            });
            scope.$watch('min', function (value) {
                if (value) {
                    scope.minValue = new Date(value).toISOString().slice(0, 16);
                }
            });
            scope.$watch('idValue', function () {
                if (!scope.idValue) {
                    scope.value = null;
                } else {
                    var d = new Date(scope.idValue * 1);
                    if (isNaN(d.getTime())) {
                        scope.value = null;
                    } else {
                        scope.value = d;
                    }
                }
                scope._ctrlName = "date" + (scope.value ? scope.value.getTime() : new Date().getTime());
                scope.pick();
            });

            scope.pick = function () {
                if (scope.value) {
                    scope.func({ params: scope.value });
                } else {
                    scope.func({ params: null });
                }
            }

        }
    }
});

myApp.directive('showAction', ['fRoot', '$q', '$rootScope', function (fRoot, $q, $rootScope) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('show-action'),
        scope: {
            action: "=",
        },
        link: function (scope) {
            function parseString(input) {
                const regex = /\(department\)\{(.*?)\}/g; // Regex để tìm đoạn (department){id}
                let result = [];
                let lastIndex = 0;
            
                input.replace(regex, (match, id, offset) => {
                    // Thêm phần text trước (department)
                    if (offset > lastIndex) {
                        result.push({
                            type: 'text',
                            value: input.slice(lastIndex, offset).trim(),
                        });
                    }
                    // Thêm phần department
                    result.push({
                        type: 'department',
                        value: id,
                    });
                    lastIndex = offset + match.length;
                });
            
                // Thêm phần text còn lại sau cùng
                if (lastIndex < input.length) {
                    result.push({
                        type: 'text',
                        value: input.slice(lastIndex).trim(),
                    });
                }
                return result;
            }

            scope.actionAr = parseString(scope.action);

            scope.$watch('action', function () {
                scope.actionAr = parseString(scope.action);
            });

        }
    }
}]);


myApp.directive('pickModalDirectory2', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('pick-modal-directory-2'),
        scope: {
            extend: "<",
            pickFunc: "&",
            showField: "@",
            numOfItemPerPage: "<",
            label: "@",
            idValue: "<",
            require: "<",
            disable: "<",
            filter: "<",
            getFirstToDefault: "<"
        },
        link: function (scope) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Count", action: "count" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();
            scope._ctrlName = "pick-modal-directory" + d.getTime();
            scope.data = [];
            scope.showField = scope.showField || "title";
            scope.numOfItemPerPage = scope.numOfItemPerPage || 20;
            scope.currentPage = 1;
            scope.totalItems = 0;
            scope.offset = 0;
            scope.search = "";
            scope.sort = {};
            scope.sort.name = scope.sortField;
            scope.sort.value = true;
            scope.sort.query = {};
            scope.sort.query[scope.sortField] = -1;
            scope._notyetInit = true;
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);
            scope.disable = scope.disable || false;
            scope.clear = function () {
                scope.selectedItem = {};
                scope.pickFunc({ params: {} });
            }

            scope.pick = function (item) {
                scope.selectedItem = angular.copy(item);
                scope.pickFunc({ params: item, params2: scope.extend });
                $("#" + scope._ctrlName).modal("hide");
            }

            scope.close = function () {
                $("#" + scope._ctrlName).modal("hide");
            }

            function generateFilter() {
                var obj = {};
                if (scope.search !== "") {
                    obj.search = angular.copy(scope.search);
                }
                obj.master_key = scope.extend.master_key;
                if (scope.filter && scope.filter.length > 0) {
                    obj.filter = scope.filter;
                }
                return obj;
            }

            function loadDetails_service() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }


            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });



            function load_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/load_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter,
                        offset: scope.offset,
                        top: scope.numOfItemPerPage
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    var directoryValues = data.data;
                    directoryValues.sort((first, second) => second.ordernumber < first.ordernumber);
                    scope.data = scope.extend.master_key === 'incomming_dispatch_book' ? [directoryValues[0]] : data.data;
                    if (!scope.idValue && scope.getFirstToDefault && scope.data && scope.data[0]) {
                        scope.pick(scope.data[0]);
                    }

                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.load = function (val) {
                if (val != undefined) { scope.offset = angular.copy(val); }
                return $rootScope.statusValue.execute(scope._ctrlName, "Load", "load", load_service);
            }

            function count_service() {
                var dfd = $q.defer();
                var filter = generateFilter();
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/count_for_directive",
                    method: "POST",
                    data: JSON.stringify({
                        master_key: scope.extend.master_key,
                        search: filter.search,
                        filter: filter.filter
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.totalItems = data.data.count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.count = function () {
                return $rootScope.statusValue.execute(scope._ctrlName, "Count", "count", count_service);
            }

            scope.init = function () {
                if (scope._notyetInit) {
                    var dfdAr = [];
                    dfdAr.push(scope.count());
                    dfdAr.push(scope.load());
                    $q.all(dfdAr).then(function () {
                        scope._notyetInit = false;
                    }, function (err) {
                        console.log(err);
                        err = undefined;
                    });
                }

            }

            if (scope.getFirstToDefault) {
                scope.init();
            }
        }
    }
}]);

myApp.directive('roomItemCalendar', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('room-item-calendar'),
        scope: {
            e: "<",
            itemBackground: "@",
            itemBackgroundHover: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl.room_list_config = {
                master_key: "meeting_room",
                load_details_column: "value",
            };
        }
    }
}]);

myApp.directive('carItemCalendar', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('car-item-calendar'),
        scope: {
            e: "<",
            itemBackground: "@",
            itemBackgroundHover: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl.room_list_config = {
                master_key: "meeting_room",
                load_details_column: "value",
            };

            scope.ctrl.vehicle_list_config = {
                master_key: "vehicle_list",
                load_details_column: "value",
            };
          
            scope.ctrl.card_list_config = {
                master_key: "card_list",
                load_details_column: "value",
            };
        }
    }
}]);

myApp.directive('eventCalendarItem', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('event-calendar-item'),
        scope: {
            e: "<",
            itemBackground: "@",
            itemBackgroundHover: "@"
        },
        link: function (scope) {
            scope.ctrl = {};
            scope.ctrl.room_list_config = {
                master_key: "meeting_room",
                load_details_column: "value",
            };
            
            scope.ctrl.vehicle_list_config = {
                master_key: "vehicle_list",
                load_details_column: "value",
            };
          
            scope.ctrl.card_list_config = {
                master_key: "card_list",
                load_details_column: "value",
            };
        }
    }
}]);

myApp.directive('legendCheckBox', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('legend-check-box'),
        scope: {
            color: "@",
            checkFunc: '&',
            label: "@",
            legend: "<",
        },
        link: function (scope) {
            scope.pick = function () {
                if(scope.legend){
                    scope.legend.check = !scope.legend.check;
                    scope.checkFunc({ params: scope.legend });
                }
            }

        }
    }
}]);

myApp.directive('selectMultiUsersByRule', ['$q', '$rootScope', 'fRoot', function ($q, $rootScope, fRoot) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('select-multi-users-by-rule'),
        scope: {
            label: "@",
            idValue: "<",
            numOfItemPerPage: "<",
            pickFunc: "&",
            require: "<",
            disable: "<",
            rule: "@"
        },
        link: function (scope, elem) {
            const _statusValueSet = [
                { name: "Load", action: "load" },
                { name: "Load", action: "loadDetails" }
            ];
            var d = new Date();

            scope.search = "";
            scope.data = [];
            scope._notyetInit = true;
            scope.disable = scope.disable || false;

            scope.ctrl = {};
            scope.ctrl._ctrlName = "select-multi-users-by-rule" + d.getTime();
            scope.ctrl.pagination = {
                sort: 0,
                offset: 0,
                top: 0,
                currentPage: 1,
                totalItems: 0,
            };
            scope.ctrl.numOfItemPerPage = scope.numOfItemPerPage || 10;

            $rootScope.statusValue.generateSet(scope.ctrl._ctrlName, _statusValueSet);


            scope.ctrl.pick = function (item) {
                scope.idValue = scope.idValue || [];
                if (scope.idValue.indexOf(item) === -1) {
                    scope.idValue.push(item);
                    scope.pickFunc({ params: scope.idValue });
                }
            }

            scope.clear = function () {
                scope.idValue = [];
                scope.pickFunc({ params: scope.idValue });
            }

            scope.remove = function (username) {
                scope.idValue = scope.idValue.filter(e => e !== username);
                scope.pickFunc({ params: scope.idValue });
            }

            scope.close = function () {
                $("#" + scope.ctrl._ctrlName).modal("hide");
            }

            function load_user_service() {
                var dfd = $q.defer();
                var request = {
                    rule: scope.rule,
                    top: scope.ctrl.numOfItemPerPage,
                    offset: scope.ctrl.pagination.offset,
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim();
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/load_by_rule",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=varbose"
                    }
                }).then(function (res) {
                    scope.data = res.data;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            function count_user_service() {
                var dfd = $q.defer();
                var request = {
                    rule: scope.rule
                };
                if (scope.search && scope.search.trim && scope.search.trim() !== "") {
                    request.search = scope.search.trim()
                }
                fRoot.requestHTTP({
                    url: BackendDomain + "/management/user/count_by_rule",
                    method: "POST",
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {
                    scope.ctrl.pagination.totalItems = data.data[0].count;
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.ctrl.load_user = function (offset) {
                if (offset) {
                    scope.ctrl.pagination.offset = offset;
                } else {
                    scope.ctrl.pagination.offset = 0;
                }
                return $rootScope.statusValue.execute(scope.ctrl._ctrlName, "Load", "load", load_user_service);
            }

            scope.refreshData_user = function () {
                if (!scope.ctrl.pagination) {
                    scope.ctrl.pagination = {
                        currentPage: 1,
                        totalItems: 0,
                        offset: 0
                    };
                } else {
                    scope.ctrl.pagination.currentPage = 1;
                    scope.ctrl.pagination.offset = 0;
                }
                scope.ctrl.load_user();
                count_user_service();
            }

            scope.init = function () {
                var dfdAr = [];
                dfdAr.push(scope.ctrl.load_user());
                dfdAr.push(count_user_service());
                $q.all(dfdAr).then(function () {
                    scope._notyetInit = false;
                }, function (err) {
                    console.log(err);
                    err = undefined;
                });
            }
        }
    }
}])

myApp.directive('getFieldCompetence', ['$q', '$rootScope', 'fRoot', 'localStorage', function ($q, $rootScope, fRoot, $localStorage) {
    return {
        restrict: "E",
        templateUrl: get_Url_Directive_Html('get-field-competence'),
        scope: {
            idValue: "<",
            idValueT: "@",
            field: "@",
            localization: "<"
        },
        link: function (scope) {
            var d = new Date();
            if((scope.idValue === undefined || !scope.idValue) && scope.idValueT !== undefined){
                scope.idValue = scope.idValueT;
            }
            scope._ctrlName = "getFieldCompetence" + d.getTime();
            scope.field = scope.field || "title";
            scope.extend = {
                master_key: "competence",
                load_details_column: "value",
            };
            const _statusValueSet = [
                { name: "Load", action: "loadDetails" }
            ];
            $rootScope.statusValue.generateSet(scope._ctrlName, _statusValueSet);


            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const user = getDetailsUserLocal();
                if(!user){
                    dfdAr.push(getDetailsUser());
                }else{
                    scope.selectedItem = angular.copy(user);
                }
                $q.all(dfdAr).then(function(){
                    // scope.selectedItem = angular.copy(data.data);
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetailsCompetenceLocal(){
                const competences = $localStorage.getItem('listCompetences') || {};
                return competences[scope.idValue.toString().trim()];
            }

            function setCompetenceToLocal(competence){
                const competences = $localStorage.getItem('listCompetences') || {};
                if(!competences[competence.value]){
                    competences[competence.value] = competence;
                }
                $localStorage.setItem('listCompetences', competences, 30)
            }


            function loadDetails_service() {
                const dfd = $q.defer();
                const dfdAr = [];
                const competence = getDetailsCompetenceLocal();
                if(!competence){
                    dfdAr.push(getDetails());
                }else{
                    scope.selectedItem = angular.copy(competence);
                }
                $q.all(dfdAr).then(function(){
                    dfd.resolve(true);
                }, function(err){
                    dfd.reject(err)
                })
                return dfd.promise;
            }

            function getDetails() {
                var dfd = $q.defer();

                fRoot.requestHTTP({
                    url: BackendDomain + "/management/directory/loaddetails",
                    method: "POST",
                    data: JSON.stringify({ type: scope.extend.load_details_column, id: scope.idValue, master_key: scope.extend.master_key }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json;odata=verbose"
                    }
                }).then(function (data) {

                    scope.selectedItem = angular.copy(data.data);
                    setCompetenceToLocal(data.data);
                    dfd.resolve(true);
                }, function (err) {
                    dfd.reject(err);
                });
                return dfd.promise;
            }

            scope.loadDetails = function () {
                if (scope.idValue !== null && scope.idValue !== undefined && scope.idValue !== "") {
                    return $rootScope.statusValue.execute(scope._ctrlName, "Load", "loadDetails", loadDetails_service);
                } else {
                    scope.selectedItem = {};
                }
            }

            scope.$watch('idValue', function (val) {
                scope.loadDetails();
            });

        }
    }
}]);

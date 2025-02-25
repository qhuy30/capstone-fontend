myApp.factory('header_service', ['fRoot', function (fRoot) {
    var obj = {};
    /**notify */
    obj.notify_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count_pending",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.notify_count_not_seen = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count_not_seen",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**task */
    obj.task_count_created = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count_created",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.task_count_assigned = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count_assigned",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    /**dispatch arrived */
    obj.dispatch_arrived_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**workflow play */
    obj.work_play_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**leave_form */
    obj.leave_form_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    /**journey time form */
    obj.journey_time_form_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/leave_form/count_jtf",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    /**labor_contract */
    obj.labor_contract_count_pending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/labor_contract/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**load ringbell_item */
    obj.loadRingBellItem = function (tab, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/ringbell_item/load",
            method: "POST",
            data: JSON.stringify({ tab, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**count ringbell_item */
    obj.countRingBellItem = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/ringbell_item/count",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**count all ringbell_item */
    obj.countAllRingBellItem = function (tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/ringbell_item/countall",
            method: "POST",
            data: JSON.stringify({ tab }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**seen ringbell_item */
    obj.seenRingBellItem = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/ringbell_item/seen",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    /**seen all ringbell_item */
    obj.seenAllRingBellItem = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/ringbell_item/seenall",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
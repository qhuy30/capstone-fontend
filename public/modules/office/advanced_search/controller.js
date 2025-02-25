myApp.registerCtrl('advanced_search_controller', ['advanced_search_service', '$q', '$rootScope', '$filter', function (advanced_search_service, $q, $rootScope, $filter) {

    const ctrl = this;

    ctrl.numOfItemPerPage = 'Công văn';

    const _statusValueSet = [
        { name: "AdvancedSearch", action: "search" },
    ];
    ctrl.IncommingDispatchPririoty_Config = {
        master_key: "incomming_dispatch_priority",
        load_details_column: "value",
    };

    ctrl._ctrlName = "advanced_search_controller";

    const TYPE = {
        TASK : "task",
        DISPATCH_ARRIVED : "da",
        OUTGOING_DISPATCH : "odb",
        WORKFLOW_PLAY : "wfp",
        ARCHIVE: "archive",
    }

    ctrl.dataFilterType = [
        {
            title: {
                'vi-VN': 'Công việc',
                'en-US': 'Task'
            },
            value: TYPE.TASK,
        },
        {
            title: {
                'vi-VN': 'Công văn đến',
                'en-US': 'Dispatch arrived'
            },
            value: TYPE.DISPATCH_ARRIVED,
        },
        {
            title: {
                'vi-VN': 'Công văn đi',
                'en-US': 'Outgoing dispatch'
            },
            value: TYPE.OUTGOING_DISPATCH,
        },
        {
            title: {
                'vi-VN': 'Quy trình',
                'en-US': 'Workflow play'
            },
            value: TYPE.WORKFLOW_PLAY,
        },
        {
            title: {
                'vi-VN': 'Lưu trữ',
                'en-US': 'Archive'
            },
            value: TYPE.ARCHIVE,
        },
    ]

    ctrl._searchType = ctrl.dataFilterType[0];
    ctrl._searchText = '';

    ctrl.events = [];
    ctrl._notyetInit = true;
    ctrl.isFirstSearch = true;

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();


    


    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
    }

    ctrl.search = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "AdvancedSearch", "search", search_service);
    }

    ctrl.chooseNumberItem = function (parmas) {
        ctrl._searchType = parmas;
    }

    function replaceDepartmentTags(input) {
        return input.replace(/(department){(.*?)}/g, '<show-department department="$1"></show-department>');
    }

    function search_service(){
        const dfd = $q.defer();
        const type = ctrl._searchType.value;
        const search = ctrl._searchText;
        let messageError ='The search value does not exist';
        advanced_search_service.search(type, search).then(function(rs){
            ctrl.events = rs.data.map(event => {
                return {
                    ...event,
                    action: replaceDepartmentTags(event.action),
                }
            });
            ctrl.isSearching = false;
            ctrl.isFirstSearch = false;
        }, function(err){
            if (!ctrl.isFirstSearch) {
                ctrl._customToastScope.addToastValue({
                    message: $filter('l')(messageError),
                    type: "danger"
                });
            }
            ctrl.isFirstSearch = false;
            ctrl.events = [];
            dfd.reject(err);
        })
        return dfd.promise;
    }

    function init() {
        var dfdAr = [];
        // dfdAr.push(ctrl.search());

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

}]);

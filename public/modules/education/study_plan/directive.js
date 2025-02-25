myApp.compileProvider.directive('treeFile', [
    '$rootScope',
    'fRoot',
    function ($rootScope, fRoot) {
        return {
            restrict: 'E',
            scope: {
                files: '=',
            },
            templateUrl: FrontendDomain + '/modules/office/file/directives/tree-file.html',
            link: function (scope) {
                scope.toggleNode = function (node) {
                    
                    node.isOpen = !node.isOpen;
                };
            },
        };
    },
]);

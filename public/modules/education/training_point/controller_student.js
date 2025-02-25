myApp.registerCtrl('student_controller', ['$rootScope', 'training_point_service','$q', function ( $rootScope, training_point_service,$q) {

    const _statusValueSet = [
        { name: "TrainingPoint", action: "init" },
        { name: "TrainingPoint", action: "load" }
    ];

    /** init variable */
    ctrl._ctrlName = "student_controller";
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    
}]);
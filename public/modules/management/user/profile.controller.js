

myApp.registerCtrl('user_profile_controller', ['$rootScope', function ($rootScope) {
    var ctrl = this;
    ctrl._urlTabProfile = FrontendDomain + "/modules/management/user/views/profile_general.html";
    ctrl.enableSelfConfig={};
    function getSetting(){
        for(var i in $rootScope.Settings){
            switch($rootScope.Settings[i].key){
                case "enableSelfConfig":
                    ctrl.enableSelfConfig=$rootScope.Settings[i];
                    break;
            }
        }
    }

    function init() {
        var params = $rootScope.currentPath.split("?")[1];
        ctrl.tab = params.split("=")[1];
        getSetting();
        switch (ctrl.tab) {
            case "general":
                ctrl._urlTabProfile = FrontendDomain + "/modules/management/user/views/profile_general.html";
                break;

            case "selfdeclaration":
                ctrl._urlTabProfile = FrontendDomain + "/modules/management/user/views/profile_selfdeclaration.html";
                break;
        }
    }

    init();
}]);

myApp.registerCtrl('user_profile_general_controller', ['$rootScope', 'user_profile_general_service',  '$q', function ( $rootScope, user_profile_general_service,  $q) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Profile", action: "updateAvatar" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "user_profile_general_controller";
        ctrl.success = false;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }


    function uploadAvatar_service(file){
        return function(){
            var dfd = $q.defer();
            user_profile_general_service.updateAvatar(file,$rootScope.logininfo.username).then(function(){
                dfd.resolve(true);
                file = undefined;
            },function(err){
                dfd.reject(err);
                file = undefined;
            });
            return dfd.promise;
        }
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#user_profile_img').attr('src', e.target.result);

                $rootScope.statusValue.execute(ctrl._ctrlName, "Profile", "updateAvatar", uploadAvatar_service({
                    file : input.files[0],
                    name : input.files[0].name
                }))
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#user_profile_avatar").change(function () {
        readURL(this);
    });

}]);

myApp.registerCtrl('user_profile_selfdeclaration_controller', [ '$rootScope', 'user_profile_selfdeclaration_service', 'fRoot', '$q','$timeout' ,function ( $rootScope, user_profile_selfdeclaration_service, fRoot, $q,$timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Employee", action: "load" },
        { name: "Employee", action: "update" },
        { name: "Employee", action: "update_background_general" },
        { name: "Employee", action: "update_background_family" },
        { name: "Employee", action: "update_signature" },
        { name: "Employee", action: "update_education_general" },
        { name: "Employee", action: "update_mission_general" },
        { name: "Employee", action: "update_quotation_mark" },
    ];
    var ctrl = this;
    var defaultAr = [{ name: "Chưa chọn" }];
    var defaultArL = [{ key: "NotSelectedYet", title: { "vi-VN": "Chưa chọn", "en-US": "NotSelectedYet" } }];
    const idEditor_update_t8_1945 = "update_t8_1945";
    const idEditor_update_tdPhap = "update_tdPhap";
    const idEditor_update_n1955 = "update_n1955";

    /** init variable */
    {
        ctrl._ctrlName = "user_profile_selfdeclaration_controller";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };

        ctrl.loadTypeLaborContract = defaultArL;
        ctrl.TypeResidence = defaultArL;
        ctrl.Specialized = defaultArL;
        ctrl.City = defaultAr;
        ctrl.District1 = [];
        ctrl.Ward1 = [];
        ctrl.District2 = [];
        ctrl.Ward2 = [];
        // ];
        ctrl.family_mode = "new";
        ctrl._notyetInit = true;

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    }

    ctrl.clickTab = function (val) {
        ctrl._update_value.tab = val;
        ctrl._update_value.childTab = 'signature';
    }
    
    function loadDetails(id) {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDetails(id).then(function (res) {
            dfd.resolve(res.data);
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadloadListOfuser_profile_selfdeclaration_service(idar) {
        return function () {
            let dfd = $q.defer();
            ctrl._update_value.childTab = 'labor_contract';
            user_profile_selfdeclaration_service.loadListOfEmployee(idar).then(function (res) {
                ctrl._update_value.labor_contract_list = res.data;
                dfd.resolve(res.data);
                res = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.loadListOfEmployee = function (idar) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "loadListOfEmployee", loadloadListOfuser_profile_selfdeclaration_service(idar));
    }

    ctrl.loadTrainingSchool = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadTrainingSchool(params.search, params.top, params.offset, params.sort).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.countTrainingSchool = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.countTrainingSchool(params.search).then(function (res) {
            dfd.resolve(res.data.count);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }


    ctrl.loadDetails_TrainingSchool = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDetails_TrainingSchool(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadTypeLaborContract() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadTypeLaborContract().then(function (res) {
            ctrl.TypeLaborContract = res.data;
            ctrl.TypeLaborContract1 = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadTypeLaborContract_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadTypeLaborContract_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadTypeResidence() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadTypeResidence().then(function (res) {
            ctrl.TypeResidence = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadTypeResidence_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadTypeResidence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadSpecialized() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadSpecialized().then(function (res) {
            ctrl.Specialized = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadSpecialized_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadSpecialized_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadCity() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadCity().then(function (res) {
            ctrl.City = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadNationality() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadNationality().then(function (res) {
            ctrl.Nationality = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadNationality_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadNationality_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadReligion() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadReligion().then(function (res) {
            ctrl.Religion = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadReligion_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadReligion_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadEducation() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadEducation().then(function (res) {
            ctrl.Education = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadEducation_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadEducation_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadDegree() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDegree().then(function (res) {
            ctrl.Degree = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDegree_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDegree_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadStateManagement() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadStateManagement().then(function (res) {
            ctrl.StateManagement = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadStateManagement_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadStateManagement_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadIT() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadIT().then(function (res) {
            ctrl.IT = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadIT_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadIT_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadDegreeEnglish() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDegreeEnglish().then(function (res) {
            ctrl.DegreeEnglish = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDegreeEnglish_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDegreeEnglish_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartment = function (params) {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDepartment(params.level, params.id).then(function (res) {
            dfd.resolve(res.data);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadCompetence() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadCompetence().then(function (res) {
            ctrl.Competence = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadCompetence_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadCompetence_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadPoliticalTheory() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadPoliticalTheory().then(function (res) {
            ctrl.PoliticalTheory = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadPoliticalTheory_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadPoliticalTheory_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadFolk() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadFolk().then(function (res) {
            ctrl.Folk = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadFolk_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadFolk_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadRelationship() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadRelationship().then(function (res) {
            ctrl.Relationship = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadRelationship_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadRelationship_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function loadJob() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.loadJob().then(function (res) {
            ctrl.Job = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadJob_details = function (params) {
        let dfd = $q.defer();
        user_profile_selfdeclaration_service.loadJob_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }



    ctrl.chooseTypeLaborContract_update = function (val) {
        ctrl._update_value.type = val.key;
    }


    ctrl.chooseTypeResidence_update = function (val) {
        ctrl._update_value.type_residence = val.key;

    }

    ctrl.chooseNationality_update = function (val) {
        ctrl._update_value.nationality = val.key;

    }

    ctrl.chooseReligion_update = function (val) {
        ctrl._update_value.religion = val.key;
    }

    ctrl.chooseEducation_update = function (val) {
        ctrl._update_value.education = val.key;

    }

    ctrl.chooseDegree_update = function (val) {
        ctrl._update_value.degree = val.key;
    }

    ctrl.chooseSpecialized_update = function (val) {
        ctrl._update_value.specialized = val.key;
    }

    ctrl.pickTrainingSchool_update = function (val) {
        ctrl._update_value.training_school = val.key;
    }

    ctrl.chooseStateManagement_update = function (val) {
        ctrl._update_value.state_management = val.key;
    }

    ctrl.choosePoliticalTheory_update = function (val) {
        ctrl._update_value.political_theory = val.key;
    }

    ctrl.chooseIT_update = function (val) {
        ctrl._update_value.it = val.key;
    }

    ctrl.chooseDegreeEnglish_update = function (val) {
        ctrl._update_value.degree_english = val.key;
    }

    ctrl.chooseDepartment_update = function (val) {
        ctrl._update_value.department = val.id;
        ctrl._update_value.competence = "";
        ctrl.Competence2 = [];
        if (val.competence && val.competence.length > 0) {
            for (var i in ctrl.Competence) {
                if (val.competence.indexOf(ctrl.Competence[i].key) !== -1) {
                    ctrl.Competence2.push(ctrl.Competence[i]);
                }
            }
        }
    }

    ctrl.chooseCompetence_update = function (val) {
        ctrl._update_value.competence = val.key;
    }

    ctrl.chooseFolk_update = function (val) {
        ctrl._update_value.folk = val.key;
    }

    ctrl.chooseRelationship_update = function (val) {
        ctrl.familyItem.relationship = val.key;
    }

    ctrl.chooseJob_update = function (val) {
        ctrl.familyItem.job = val.key;
    }

    ctrl.chooseBirthDate_update = function (val) {
        ctrl._update_value.birth_date = val.getTime();
    }

    const assignLiving = function (living) {
        let result = {};
        if (living) {
            result.address = living.address;
            for (var i in ctrl.City) {
                if (living.city == ctrl.City[i].name) {
                    result.city = ctrl.City[i];
                    for (var j in ctrl.City[i].details) {
                        if (living.district == ctrl.City[i].details[j].name) {
                            result.district = ctrl.City[i].details[j];
                            for (var z in ctrl.City[i].details[j].details) {
                                if (living.ward == ctrl.City[i].details[j].details[z].name) {
                                    result.ward = ctrl.City[i].details[j].details[z];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return result;
    }

    function refreshItem( tab, childTab) {
       
        loadDetails($rootScope.logininfo.data.employee).then(function (item) {
            ctrl._update_value = {
                fullname: item.fullname,
                labor_contract: item.labor_contract,
                _id: item._id,
                tab,
                childTab,
                type: item.type,
                lastname: item.lastname,
                midname: item.midname,
                firstname: item.firstname,
                birth_date: item.birth_date,

                living: assignLiving(item.living),
                permanent_address: assignLiving(item.permanent_address),
                domicile: assignLiving(item.domicile),
                place_birth: assignLiving(item.place_birth),
                type_residence: item.type_residence,

                phonenumber: item.phonenumber,
                email: item.email,
                idcard: item.idcard,
                nationality: item.nationality,
                religion: item.religion,
                folk: item.folk,

                family: item.family,
                signature: item.signature,
                quotation_mark: item.quotationMark,

                training_school: item.training_school,
                graduation_year: item.graduation_year,
                education: item.education,
                degree: item.degree,
                specialized: item.specialized,
                state_management: item.state_management,
                political_theory: item.political_theory,
                it: item.it,
                degree_english: item.degree_english,

                department: item.department,
                competence: item.competence,

                basic_salary: item.basic_salary,
                register_user: ""
                // from_date: new Date(parseInt(item.from_date)),
                // to_date: new Date(parseInt(item.to_date))

            };
            ctrl.load_user();
        }, function (err) {
            console.log(err);
        });
    }

    ctrl.prepareUpdate = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_background_general");
        $("#" + idEditor_update_t8_1945).summernote();
        $("#" + idEditor_update_tdPhap).summernote();
        $("#" + idEditor_update_n1955).summernote();
        refreshItem( "background", "signature");
    }

    function update_background_general_service() {
        var dfd = $q.defer();
        let living = {
            city: ctrl._update_value.living.city.name,
            district: ctrl._update_value.living.district.name,
            ward: ctrl._update_value.living.ward.name,
            address: ctrl._update_value.living.address
        };

        let domicile = {
            city: ctrl._update_value.domicile.city.name,
            district: ctrl._update_value.domicile.district.name,
            ward: ctrl._update_value.domicile.ward.name,
            address: ctrl._update_value.domicile.address
        };

        let place_birth = {
            city: ctrl._update_value.place_birth.city.name,
            district: ctrl._update_value.place_birth.district.name,
            ward: ctrl._update_value.place_birth.ward.name
        };

        let permanent_address = {
            city: ctrl._update_value.permanent_address.city.name,
            district: ctrl._update_value.permanent_address.district.name,
            ward: ctrl._update_value.permanent_address.ward.name,
            address: ctrl._update_value.permanent_address.address
        };


        user_profile_selfdeclaration_service.update_background_general(
            ctrl._update_value._id,
            ctrl._update_value.lastname,
            ctrl._update_value.midname,
            ctrl._update_value.firstname,
            ctrl._update_value.birth_date,
            living,
            permanent_address,
            domicile,
            place_birth,
            ctrl._update_value.type_residence,

            ctrl._update_value.phonenumber,
            ctrl._update_value.email,
            ctrl._update_value.idcard,
            ctrl._update_value.nationality,
            ctrl._update_value.religion,
            ctrl._update_value.folk
        ).then(function () {
            refreshItem( "background", "general");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_background_general");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_background_general = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_background_general", update_background_general_service);
    }


    function push_background_family_service() {
        var dfd = $q.defer();
        var d = new Date();
        user_profile_selfdeclaration_service.push_background_family(
            ctrl._update_value._id,
            d.getTime().toString(),
            ctrl.familyItem.fullname,
            ctrl.familyItem.job,
            ctrl.familyItem.born_in,
            ctrl.familyItem.relationship,
            $("#" + idEditor_update_t8_1945).summernote('code'),
            $("#" + idEditor_update_tdPhap).summernote('code'),
            $("#" + idEditor_update_n1955).summernote('code')
        ).then(function () {
            refreshItem("background", "family");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_background_family");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.push_background_family = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_background_family", push_background_family_service);
    }



    ctrl.remove_background_family = function (id) {
        ctrl.family_mode = 'new';
        user_profile_selfdeclaration_service.remove_background_family(
            ctrl._update_value._id,
            id
        ).then(function () {
            refreshItem( "background", "family");
            dfd = undefined;
        }, function (err) {
            err = undefined;
        });
    }

    ctrl.prepareUpdate_familyItem_update = function (item) {
        ctrl.familyItem = angular.copy(item);
        $("#" + idEditor_update_t8_1945).summernote('code', item.t8_1945);
        $("#" + idEditor_update_tdPhap).summernote('code', item.tdPhap);
        $("#" + idEditor_update_n1955).summernote('code', item.n1955);
        ctrl.family_mode = 'update';
    }

    ctrl.prepareUpdate_familyItem_new = function () {
        ctrl.familyItem = {};
        $("#" + idEditor_update_t8_1945).summernote('code', '');
        $("#" + idEditor_update_tdPhap).summernote('code', '');
        $("#" + idEditor_update_n1955).summernote('code', '');
        ctrl.family_mode = 'new';
    }

    function update_background_family_service() {
        var dfd = $q.defer();
        var d = new Date();
        user_profile_selfdeclaration_service.update_background_family(
            ctrl._update_value._id,
            ctrl.familyItem.childid,
            ctrl.familyItem.fullname,
            ctrl.familyItem.job,
            ctrl.familyItem.born_in,
            ctrl.familyItem.relationship,
            $("#" + idEditor_update_t8_1945).summernote('code'),
            $("#" + idEditor_update_tdPhap).summernote('code'),
            $("#" + idEditor_update_n1955).summernote('code')
        ).then(function () {
            refreshItem( "background", "family");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_background_family");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_background_family = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_background_family", update_background_family_service);
    }

    /**update signature */
    const changeVN = function (alias) {
        if (typeof alias !== "string") return alias;
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    }

    function update_signature_service(file) {
        return function () {
            var dfd = $q.defer();
            let nameFolder = changeVN(ctrl._update_value.fullname).replace(/ /g, "_") + "_" + ctrl._update_value.idcard;
            let oldFile;
            if (ctrl._update_value.signature.name) {
                oldFile = ctrl._update_value.signature;
            } else {
                oldFile = undefined;
            }
            user_profile_selfdeclaration_service.update_signature(file, ctrl._update_value._id, nameFolder, oldFile).then(function (res) {
                ctrl._update_value.signature = ctrl._update_value.signature || {};
                ctrl._update_value.signature.link = res.data.name;
                refreshItem( "background", "signature");
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.update_signature = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_signature", update_signature_service(file));
    }

    function update_quotation_mark_service(file) {
        return function () {
            var dfd = $q.defer();
            let nameFolder = changeVN(ctrl._update_value.fullname).replace(/ /g, "_") + "_" + ctrl._update_value.idcard;
            let oldFile;
            if (ctrl._update_value.quotation_mark.name) {
                oldFile = ctrl._update_value.quotation_mark;
            } else {
                oldFile = undefined;
            }
            user_profile_selfdeclaration_service.update_quotation_mark(file, ctrl._update_value._id, nameFolder, oldFile).then(function (res) {
                ctrl._update_value.quotation_mark = ctrl._update_value.quotation_mark || {};
                ctrl._update_value.quotation_mark.link = res.data.name;
                refreshItem( "background", "signature");
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.update_quotation_mark = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_quotation_mark", update_quotation_mark_service(file));
    }

    /**update_education_general */
    function update_education_general_service() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.update_education_general(
            ctrl._update_value._id,
            ctrl._update_value.training_school,
            ctrl._update_value.graduation_year,
            ctrl._update_value.education,
            ctrl._update_value.degree,
            ctrl._update_value.specialized,
            ctrl._update_value.state_management,
            ctrl._update_value.political_theory,
            ctrl._update_value.it,
            ctrl._update_value.degree_english
        ).then(function () {
            refreshItem( "education", "general");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_education_general");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_education_general = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_education_general", update_education_general_service);
    }

    /**update_mission_general */
    function update_mission_general_service() {
        var dfd = $q.defer();
        user_profile_selfdeclaration_service.update_mission_general(
            ctrl._update_value._id,
            ctrl._update_value.department,
            ctrl._update_value.competence
        ).then(function () {
            refreshItem( "mission", "general");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_mission_general");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_mission_general = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_mission_general", update_mission_general_service);
    }


    function init(){
        var dfdAr = [];
        
        dfdAr.push(ctrl.prepareUpdate());
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


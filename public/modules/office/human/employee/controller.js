

myApp.registerCtrl('employee_controller', ['employee_service', '$q', '$rootScope', '$timeout', function (employee_service, $q, $rootScope, $timeout) {

    /**declare variable */
    const _statusValueSet = [
        { name: "Employee", action: "load" },
        { name: "Employee", action: "loadListOfEmployee" },
        { name: "Employee", action: "loadDetails" },
        { name: "Employee", action: "count" },
        { name: "Employee", action: "insert" },
        { name: "Employee", action: "import" },
        { name: "Employee", action: "update" },
        { name: "Employee", action: "attach_labor" },
        { name: "Employee", action: "update_background_general" },
        { name: "Employee", action: "update_background_family" },
        { name: "Employee", action: "update_signature" },
        { name: "Employee", action: "update_quotation_mark" },
        { name: "Employee", action: "update_education_general" },
        { name: "Employee", action: "update_mission_general" },
        { name: "Employee", action: "update_salary_general" },
        { name: "Employee", action: "load_user" },
        { name: "Employee", action: "register_user" },
        { name: "Employee", action: "pushFile" },
        { name: "Employee", action: "removeFile" },
        { name: "Employee", action: "delete" },
        { name: "Employee", action: "delete_multi" }
    ];
    var ctrl = this;
    var defaultAr = [{ name: "Chưa chọn" }];
    var defaultArL = [{ key: "NotSelectedYet", title: { "vi-VN": "Chưa chọn", "en-US": "NotSelectedYet" } }];
    const idEditor_update_t8_1945 = "update_t8_1945";
    const idEditor_update_tdPhap = "update_tdPhap";
    const idEditor_update_n1955 = "update_n1955";

    /** init variable */
    {
        ctrl._ctrlName = "employee_controller";
        ctrl.tab = "all";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl.employees = [];
        ctrl.importFiles = [];
        ctrl._searchImportData = "";
        ctrl._searchImportTemp = "";

        ctrl.Country_Config = {
            master_key: "country",
            load_details_column: "value"
        };

        ctrl.City_Config = {
            master_key: "city",
            load_details_column: "value"
        };

        ctrl.District_Config = {
            master_key: "district",
            load_details_column: "value"
        };

        ctrl.Ward_Config = {
            master_key: "ward",
            load_details_column: "value"
        };

        ctrl.Village_Config = {
            master_key: "village",
            load_details_column: "value"
        };

        ctrl.TypeOfResidence_Config = {
            master_key: "type_of_residence",
            load_details_column: "value"
        };

        ctrl.LaborContractType_Config = {
            master_key: "larbor_contract_type",
            load_details_column: "value"
        };

        ctrl.Nationality_Config = {
            master_key: "nationality",
            load_details_column: "value"
        };

        ctrl.Religion_Config = {
            master_key: "religion",
            load_details_column: "value"
        };

        ctrl.Folk_Config = {
            master_key: "folk",
            load_details_column: "value"
        };

        ctrl.FamilyRelationship_Config = {
            master_key: "family_relationship",
            load_details_column: "value"
        };

        ctrl.Job_Config = {
            master_key: "job",
            load_details_column: "value"
        };

        ctrl.Education_Config = {
            master_key: "education",
            load_details_column: "value"
        };

        ctrl.Degree_Config = {
            master_key: "degree",
            load_details_column: "value"
        };

        ctrl.Specialized_Config = {
            master_key: "specialized",
            load_details_column: "value"
        };

        ctrl.School_Config = {
            master_key: "school",
            load_details_column: "value"
        };

        ctrl.StateManagement_Config = {
            master_key: "state_management",
            load_details_column: "value"
        };

        ctrl.PoliticalTheory_Config = {
            master_key: "political_theory",
            load_details_column: "value"
        };

        ctrl.ComputerSkills_Config = {
            master_key: "computer_skills",
            load_details_column: "value"
        };

        ctrl.EnglishLevel_Config = {
            master_key: "english_level",
            load_details_column: "value"
        };

        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };



        ctrl.family_mode = "new";
        ctrl._notyetInit = true;
        ctrl.importStatus = "load";
        ctrl._searchByKeyToFilterData = "";
        ctrl._filterloadTypeLaborContract = "";
        ctrl._filterSpecialized = "";
        ctrl._filterIT = "";
        ctrl._filterDegreeEnglish = "";
        ctrl._filterDepartment = {};
        ctrl.familyItem = {};

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInfoModal = FrontendDomain + "/modules/office/human/employee/views/info_modal.html";
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/human/employee/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/human/employee/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/human/employee/views/delete_modal.html";
        ctrl._urlAttachModal = FrontendDomain + "/modules/office/human/employee/views/attach_labor.html";
        ctrl._urlLaborContract = FrontendDomain + "/modules/office/human/employee/views/labor_contract_update.html";
        ctrl._urlImport = FrontendDomain + "/modules/office/human/employee/views/import.html";

    }

    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }
    ctrl.chooseloadTypeLaborContract = function (val) {
        ctrl._filterloadTypeLaborContract = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseSpecialized = function (val) {
        ctrl._filterSpecialized = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseIT = function (val) {
        ctrl._filterIT = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseDegreeEnglish = function (val) {
        ctrl._filterDegreeEnglish = val.value;
        ctrl.refreshData();
    }

    ctrl.chooseDepartment = function (val) {
        ctrl._filterDepartment = val;
        ctrl.refreshData();
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        ctrl.refreshData();
    }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterloadTypeLaborContract) {
            obj.type = angular.copy(ctrl._filterloadTypeLaborContract);
        }

        if (ctrl._filterSpecialized) {
            obj.specialized = angular.copy(ctrl._filterSpecialized);
        }

        if (ctrl._filterIT) {
            obj.it = angular.copy(ctrl._filterIT);
        }

        if (ctrl._filterDegreeEnglish) {
            obj.degree_english = angular.copy(ctrl._filterDegreeEnglish);
        }

        if (ctrl._filterDepartment.id) {
            obj.department = angular.copy(ctrl._filterDepartment.id);
        }

        if (ctrl.tab === "pending") {
            obj.status = "draft";
        }
        return obj;
    }

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.employees) {
            if (ctrl.employees[i]._id === params.params) {
                ctrl.employees[i].check = params.value;
            }
            if (ctrl.employees[i].check && ctrl.employees[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.employees[i]._id);
                ctrl.checkAr.push(ctrl.employees[i]);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.employees.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.employees) {
            ctrl.employees[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.employees) {
            ctrl.employees[i].check = params;
            if (ctrl.employees[i].check && ctrl.employees[i].status === 'draft') {
                ctrl.checkIdAr.push(ctrl.employees[i]._id);
                ctrl.checkAr.push(ctrl.employees[i]);
            }
        }
    }

    /* Init and load necessary resource to the module. */
    function loadloadListOfEmployee_service(idar) {
        return function () {
            let dfd = $q.defer();
            ctrl._update_value.childTab = 'labor_contract';
            employee_service.loadListOfEmployee(idar).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "loadListOfEmployee", loadloadListOfEmployee_service(idar));
    }

    function load_service() {
        var dfd = $q.defer();
        ctrl.employees = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        employee_service.load(_filter.search, _filter.type, _filter.specialized, _filter.it, _filter.degree_english, _filter.department, _filter.status, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.employees = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "load", load_service);
    }


    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        employee_service.count(_filter.search, _filter.type, _filter.specialized, _filter.it, _filter.degree_english, _filter.department, _filter.status).then(function (res) {
            ctrl.totalItems = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.count = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "count", count_service);
    }



    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }
    /**load File */

    ctrl.loadfile_labor_contract = function (params) {
        return function () {
            var dfd = $q.defer();
            employee_service.loadFileInfo_LaborContract(params.id, params.name).then(function (res) {
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
    /**loadDetails */

    function loadDetails(id) {
        var dfd = $q.defer();
        employee_service.loadDetails(id).then(function (res) {
            dfd.resolve(res.data);
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function load_user_service() {
        var dfd = $q.defer();
        ctrl._update_value.user = {};
        employee_service.load_user(ctrl._update_value._id).then(function (res) {
            ctrl._update_value.user = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_user = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "load_user", load_user_service);
    }

    /**UPDATE */
    function generateFIlterForUpdate() {
        if (ctrl._update_value.living) {
            if (ctrl._update_value.living.country) {
                ctrl.filterCity_living_update = [
                    { parent: { $eq: ctrl._update_value.living.country } }
                ];
            }

            if(ctrl._update_value.living.city){
                ctrl.filterDistrict_living_update = [
                    { parent: { $eq: ctrl._update_value.living.city } }
                ];
            }

            if(ctrl._update_value.living.district){
                ctrl.filterWard_living_update = [
                    { parent: { $eq: ctrl._update_value.living.district } }
                ];
            }

            if(ctrl._update_value.living.ward){
                ctrl.filterVillage_living_update = [
                    { parent: { $eq: ctrl._update_value.living.ward } }
                ];
            }

        } else {
            ctrl.filterCity_living_update = [];
            ctrl.filterDistrict_living_update = [];
            ctrl.filterWard_living_update = [];
            ctrl.filterVillage_living_update = [];
        }

        if (ctrl._update_value.permanent_address) {
            if (ctrl._update_value.permanent_address.country) {
                ctrl.filterCity_permanent_address_update = [
                    { parent: { $eq: ctrl._update_value.permanent_address.country } }
                ];
            }

            if(ctrl._update_value.permanent_address.city){
                ctrl.filterDistrict_permanent_address_update = [
                    { parent: { $eq: ctrl._update_value.permanent_address.city } }
                ];
            }

            if(ctrl._update_value.permanent_address.district){
                ctrl.filterWard_permanent_address_update = [
                    { parent: { $eq: ctrl._update_value.permanent_address.district } }
                ];
            }

            if(ctrl._update_value.permanent_address.ward){
                ctrl.filterVillage_permanent_address_update = [
                    { parent: { $eq: ctrl._update_value.permanent_address.ward } }
                ];
            }

        } else {
            ctrl.filterCity_permanent_address_update = [];
            ctrl.filterDistrict_permanent_address_update = [];
            ctrl.filterWard_permanent_address_update = [];
            ctrl.filterVillage_permanent_address_update = [];
        }

        if (ctrl._update_value.domicile) {
            if (ctrl._update_value.domicile.country) {
                ctrl.filterCity_domicile_update = [
                    { parent: { $eq: ctrl._update_value.domicile.country } }
                ];
            }

            if(ctrl._update_value.domicile.city){
                ctrl.filterDistrict_domicile_update = [
                    { parent: { $eq: ctrl._update_value.domicile.city } }
                ];
            }

            if(ctrl._update_value.domicile.district){
                ctrl.filterWard_domicile_update = [
                    { parent: { $eq: ctrl._update_value.domicile.district } }
                ];
            }

            if(ctrl._update_value.domicile.ward){
                ctrl.filterVillage_domicile_update = [
                    { parent: { $eq: ctrl._update_value.domicile.ward } }
                ];
            }

        } else {
            ctrl.filterCity_domicile_update = [];
            ctrl.filterDistrict_domicile_update = [];
            ctrl.filterWard_domicile_update = [];
            ctrl.filterVillage_domicile_update = [];
        }

        if (ctrl._update_value.place_birth) {
            if (ctrl._update_value.place_birth.country) {
                ctrl.filterCity_place_birth_update = [
                    { parent: { $eq: ctrl._update_value.place_birth.country } }
                ];
            }

            if(ctrl._update_value.place_birth.city){
                ctrl.filterDistrict_place_birth_update = [
                    { parent: { $eq: ctrl._update_value.place_birth.city } }
                ];
            }

            if(ctrl._update_value.place_birth.district){
                ctrl.filterWard_place_birth_update = [
                    { parent: { $eq: ctrl._update_value.place_birth.district } }
                ];
            }

            if(ctrl._update_value.place_birth.ward){
                ctrl.filterVillage_place_birth_update = [
                    { parent: { $eq: ctrl._update_value.place_birth.ward } }
                ];
            }

        } else {
            ctrl.filterCity_place_birth_update = [];
            ctrl.filterDistrict_place_birth_update = [];
            ctrl.filterWard_place_birth_update = [];
            ctrl.filterVillage_place_birth_update = [];
        }
    }

    ctrl.chooseCountry1_update = function (val) {
        ctrl._update_value.living.country = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseCity1_update = function (val) {
        ctrl._update_value.living.city = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseDistrict1_update = function (val) {
        ctrl._update_value.living.district = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseWard1_update = function (val) {
        ctrl._update_value.living.ward = val.value;
        generateFIlterForUpdate();
    }
    ctrl.chooseVillage1_update = function (val) {
        ctrl._update_value.living.village = val.value;
        
    }


    ctrl.chooseCountry2_update = function (val) {
        ctrl._update_value.permanent_address.country = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseCity2_update = function (val) {
        ctrl._update_value.permanent_address.city = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseDistrict2_update = function (val) {
        ctrl._update_value.permanent_address.district = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseWard2_update = function (val) {
        ctrl._update_value.permanent_address.ward = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseVillage2_update = function (val) {
        ctrl._update_value.permanent_address.village = val.value;
        
    }

    ctrl.chooseCountry3_update = function (val) {
        ctrl._update_value.place_birth.country = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseCity3_update = function (val) {
        ctrl._update_value.place_birth.city = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseDistrict3_update = function (val) {
        ctrl._update_value.place_birth.district = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseWard3_update = function (val) {
        ctrl._update_value.place_birth.ward = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseVillage3_update = function (val) {
        ctrl._update_value.place_birth.village = val.value;
        
    }

    ctrl.chooseCountry4_update = function (val) {
        ctrl._update_value.domicile.country = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseCity4_update = function (val) {
        ctrl._update_value.domicile.city = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseDistrict4_update = function (val) {
        ctrl._update_value.domicile.district = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseWard4_update = function (val) {
        ctrl._update_value.domicile.ward = val.value;
        generateFIlterForUpdate();
    }

    ctrl.chooseVillage4_update = function (val) {
        ctrl._update_value.domicile.village = val.value;
        
    }

    ctrl.clickTab = function (val) {
        ctrl._update_value.tab = val;
        ctrl._update_value.childTab = 'general';
    }

    ctrl.chooseTypeLaborContract_update = function (val) {
        ctrl._update_value.type = val.value;
    }


    ctrl.chooseTypeResidence_update = function (val) {
        ctrl._update_value.type_residence = val.value;

    }

    ctrl.chooseNationality_update = function (val) {
        ctrl._update_value.nationality = val.value;

    }

    ctrl.chooseReligion_update = function (val) {
        ctrl._update_value.religion = val.value;
    }

    ctrl.chooseEducation_update = function (val) {
        ctrl._update_value.education = val.value;

    }

    ctrl.chooseDegree_update = function (val) {
        ctrl._update_value.degree = val.value;
    }

    ctrl.chooseSpecialized_update = function (val) {
        ctrl._update_value.specialized = val.value;
    }

    ctrl.pickTrainingSchool_update = function (val) {
        ctrl._update_value.training_school = val.value;
    }

    ctrl.chooseStateManagement_update = function (val) {
        ctrl._update_value.state_management = val.value;
    }

    ctrl.choosePoliticalTheory_update = function (val) {
        ctrl._update_value.political_theory = val.value;
    }

    ctrl.chooseIT_update = function (val) {
        ctrl._update_value.it = val.value;
    }

    ctrl.chooseDegreeEnglish_update = function (val) {
        ctrl._update_value.degree_english = val.value;
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
        ctrl._update_value.competence = val.value;
    }

    ctrl.chooseFolk_update = function (val) {
        ctrl._update_value.folk = val.value;
    }

    ctrl.chooseRelationship_update = function (val) {
        ctrl.familyItem.relationship = val.value;
    }

    ctrl.chooseJob_update = function (val) {
        ctrl.familyItem.job = val.value;
    }

    ctrl.chooseBirthDate_update = function (val) {
        ctrl._update_value.birth_date = val.getTime();
    }



    function refreshItem(id, tab, childTab) {
        loadDetails(id).then(function (item) {
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

                living: item.living||{},
                permanent_address: item.permanent_address||{},
                domicile: item.domicile||{},
                place_birth: item.place_birth||{},
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

    ctrl.prepareUpdate = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_background_general");
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "delete");
        $("#" + idEditor_update_t8_1945).summernote();
        $("#" + idEditor_update_tdPhap).summernote();
        $("#" + idEditor_update_n1955).summernote();
        refreshItem(item._id, "background", "general");
    }

    function update_background_general_service() {
        var dfd = $q.defer();
        let living = {
            country: ctrl._update_value.living.country,
            city: ctrl._update_value.living.city,
            district: ctrl._update_value.living.district,
            ward: ctrl._update_value.living.ward,
            village: ctrl._update_value.living.village,
            address: ctrl._update_value.living.address
        };

        let domicile = {
            country: ctrl._update_value.domicile.country,
            city: ctrl._update_value.domicile.city,
            district: ctrl._update_value.domicile.district,
            ward: ctrl._update_value.domicile.ward,
            village: ctrl._update_value.domicile.village,
            address: ctrl._update_value.domicile.address
        };

        let place_birth = {
            country: ctrl._update_value.place_birth.country,
            city: ctrl._update_value.place_birth.city,
            district: ctrl._update_value.place_birth.district,
            ward: ctrl._update_value.place_birth.ward,
            village: ctrl._update_value.place_birth.village,
            address: ctrl._update_value.place_birth.address
        };

        let permanent_address = {
            country: ctrl._update_value.permanent_address.country,
            city: ctrl._update_value.permanent_address.city,
            district: ctrl._update_value.permanent_address.district,
            ward: ctrl._update_value.permanent_address.ward,
            village: ctrl._update_value.permanent_address.village,
            address: ctrl._update_value.permanent_address.address
        };


        employee_service.update_background_general(
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
            refreshItem(ctrl._update_value._id, "background", "general");
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
        employee_service.push_background_family(
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
            refreshItem(ctrl._update_value._id, "background", "family");
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
        employee_service.remove_background_family(
            ctrl._update_value._id,
            id
        ).then(function () {
            refreshItem(ctrl._update_value._id, "background", "family");
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
        employee_service.update_background_family(
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
            refreshItem(ctrl._update_value._id, "background", "family");
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
            employee_service.update_signature(file, ctrl._update_value._id, nameFolder, oldFile).then(function (res) {
                ctrl._update_value.signature = ctrl._update_value.signature || {};
                ctrl._update_value.signature.link = res.data.name;
                refreshItem(ctrl._update_value._id, "background", "signature");
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
            employee_service.update_quotation_mark(file, ctrl._update_value._id, nameFolder, oldFile).then(function (res) {
                ctrl._update_value.quotation_mark = ctrl._update_value.quotation_mark || {};
                ctrl._update_value.quotation_mark.link = res.data.name;
                refreshItem(ctrl._update_value._id, "background", "signature");
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
        employee_service.update_education_general(
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
            refreshItem(ctrl._update_value._id, "education", "general");
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
        employee_service.update_mission_general(
            ctrl._update_value._id,
            ctrl._update_value.department,
            ctrl._update_value.competence
        ).then(function () {
            refreshItem(ctrl._update_value._id, "mission", "general");
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

    /**update_salary_general */
    function update_salary_general_service() {
        var dfd = $q.defer();
        employee_service.update_salary_general(
            ctrl._update_value._id,
            ctrl._update_value.basic_salary
        ).then(function () {
            refreshItem(ctrl._update_value._id, "salary", "general");
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "update_salary_general");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_salary_general = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "update_salary_general", update_salary_general_service);
    }

    ctrl.closeUpdate = function () {
        $("#modal_Employee_Update").modal("hide");
    }

    /**register account */

    ctrl.checkUser = function (model, params) {
        let dfd = $q.defer();
        if (!model || model === "") {
            dfd.resolve(true);
        } else {
            employee_service.checkExist(model).then(function (data) {
                if (data.data.status) {
                    dfd.resolve(true);
                } else {
                    dfd.reject(false);
                }
            }, function () {
                dfd.reject(false);
            });
        }

        return dfd.promise;
    }

    function register_user_service() {
        var dfd = $q.defer();
        employee_service.register_user(
            ctrl._update_value._id,
            ctrl._update_value.register_user
        ).then(function () {
            ctrl.load_user();
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "register_user");
            }, 1000);
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.register_user = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "register_user", register_user_service);
    }
    //insert
    ctrl.chooseDepartment_insert = function (val) {
        ctrl._insert_value.department = val.id;
        ctrl._insert_value.competence = "";
        ctrl.Competence2 = [];
        if (val.competence && val.competence.length > 0) {
            for (var i in ctrl.Competence) {
                if (val.competence.indexOf(ctrl.Competence[i].key) !== -1) {
                    ctrl.Competence2.push(ctrl.Competence[i]);
                }
            }
        }
    }

    ctrl.chooseCompetence_insert = function (val) {
        ctrl._insert_value.competence = val.value;
    }

    ctrl.chooseBirthDate_insert = function (val) {
        ctrl._insert_value.birth_date = val.getTime();
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "insert");
        var date = new Date(1990, 0, 1, 0, 0, 0, 0);
        ctrl._insert_value = {
            lastname: "",
            midname: "",
            firstname: "",
            phonenumber: "",
            email: "",
            idcard: "",
            department: "",
            competence: "",
            birth_date: date.getTime()
        };
    }

    function insert_service() {
        var dfd = $q.defer();
        employee_service.insert(
            ctrl._insert_value.lastname,
            ctrl._insert_value.midname,
            ctrl._insert_value.firstname,
            ctrl._insert_value.birth_date,
            ctrl._insert_value.phonenumber,
            ctrl._insert_value.email,
            ctrl._insert_value.idcard,
            ctrl._insert_value.department,
            ctrl._insert_value.competence
        ).then(function () {
            ctrl.refreshData();
            $("#modal_Employee_Insert").modal("hide");
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "insert", insert_service);
    }

    //ATTACH LABOR
    ctrl.removeFile_attach = function (item) {
        var temp = [];
        for (var i in ctrl._attach_value.files) {
            if (ctrl._attach_value.files[i].name != item.name) {
                temp.push(ctrl._attach_value.files[i]);
            }
        }
        ctrl._attach_value.files = angular.copy(temp);
    }

    ctrl.chooseTypeLaborContract_attach = function (val) {
        ctrl._attach_value.type = val.value;
    }

    function generateFIlterForAttach() {

        if (ctrl._attach_value.living) {
            if (ctrl._attach_value.living.country) {
                ctrl.filterCity_living_attach = [
                    { parent: { $eq: ctrl._attach_value.living.country } }
                ];
            }

            if(ctrl._attach_value.living.city){
                ctrl.filterDistrict_living_attach = [
                    { parent: { $eq: ctrl._attach_value.living.city } }
                ];
            }

            if(ctrl._attach_value.living.district){
                ctrl.filterWard_living_attach = [
                    { parent: { $eq: ctrl._attach_value.living.district } }
                ];
            }

            if(ctrl._attach_value.living.ward){
                ctrl.filterVillage_living_attach = [
                    { parent: { $eq: ctrl._attach_value.living.ward } }
                ];
            }

        } else {
            ctrl.filterCity_living_attach = [];
            ctrl.filterDistrict_living_attach = [];
            ctrl.filterWard_living_attach = [];
            ctrl.filterVillage_living_attach = [];
        }

        if (ctrl._attach_value.permanent_address) {
            if (ctrl._attach_value.permanent_address.country) {
                ctrl.filterCity_permanent_address_attach = [
                    { parent: { $eq: ctrl._attach_value.permanent_address.country } }
                ];
            }

            if(ctrl._attach_value.permanent_address.city){
                ctrl.filterDistrict_permanent_address_attach = [
                    { parent: { $eq: ctrl._attach_value.permanent_address.city } }
                ];
            }

            if(ctrl._attach_value.permanent_address.district){
                ctrl.filterWard_permanent_address_attach = [
                    { parent: { $eq: ctrl._attach_value.permanent_address.district } }
                ];
            }

            if(ctrl._attach_value.permanent_address.ward){
                ctrl.filterVillage_permanent_address_attach = [
                    { parent: { $eq: ctrl._attach_value.permanent_address.ward } }
                ];
            }

        } else {
            ctrl.filterCity_permanent_address_attach = [];
            ctrl.filterDistrict_permanent_address_attach = [];
            ctrl.filterWard_permanent_address_attach = [];
            ctrl.filterVillage_permanent_address_attach = [];
        }

 
    }

    ctrl.chooseCountry1_attach = function (val) {
        ctrl._attach_value.living.country = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseCity1_attach = function (val) {
        ctrl._attach_value.living.city = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseDistrict1_attach = function (val) {
        ctrl._attach_value.living.district = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseWard1_attach = function (val) {
        ctrl._attach_value.living.ward = val.value;
        generateFIlterForAttach();
    }
    ctrl.chooseVillage1_attach = function (val) {
        ctrl._attach_value.living.village = val.value;
        
    }


    ctrl.chooseCountry2_attach = function (val) {
        ctrl._attach_value.permanent_address.country = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseCity2_attach = function (val) {
        ctrl._attach_value.permanent_address.city = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseDistrict2_attach = function (val) {
        ctrl._attach_value.permanent_address.district = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseWard2_attach = function (val) {
        ctrl._attach_value.permanent_address.ward = val.value;
        generateFIlterForAttach();
    }

    ctrl.chooseVillage2_attach = function (val) {
        ctrl._attach_value.permanent_address.village = val.value;
        
    }

    ctrl.chooseTypeResidence_attach = function (val) {
        ctrl._attach_value.type_residence = val.value;

    }

    ctrl.chooseNationality_attach = function (val) {
        ctrl._attach_value.nationality = val.value;

    }

    ctrl.chooseReligion_attach = function (val) {
        ctrl._attach_value.religion = val.value;
    }

    ctrl.chooseEducation_attach = function (val) {
        ctrl._attach_value.education = val.value;

    }

    ctrl.chooseDegree_attach = function (val) {
        ctrl._attach_value.degree = val.value;
    }

    ctrl.chooseSpecialized_attach = function (val) {
        ctrl._attach_value.specialized = val.value;
    }

    ctrl.pickTrainingSchool_attach = function (val) {
        ctrl._attach_value.training_school = val.value;
    }

    ctrl.chooseStateManagement_attach = function (val) {
        ctrl._attach_value.state_management = val.value;
    }

    ctrl.choosePoliticalTheory_attach = function (val) {
        ctrl._attach_value.political_theory = val.value;
    }

    ctrl.chooseIT_attach = function (val) {
        ctrl._attach_value.it = val.value;
    }

    ctrl.chooseDegreeEnglish_attach = function (val) {
        ctrl._attach_value.degree_english = val.value;
    }

    ctrl.chooseDepartment_attach = function (val) {
        ctrl._attach_value.department = val.id;
        ctrl._attach_value.competence = "";
        ctrl.Competence2 = [];
        if (val.competence && val.competence.length > 0) {
            for (var i in ctrl.Competence) {
                if (val.competence.indexOf(ctrl.Competence[i].key) !== -1) {
                    ctrl.Competence2.push(ctrl.Competence[i]);
                }
            }
        }
    }
    ctrl.chooseCompetence_attach = function (val) {
        ctrl._attach_value.competence = val.value;
    }

    ctrl.chooseBirthDate_attach = function (val) {
        ctrl._attach_value.birth_date = val.getTime();
    }



    ctrl.prepareAttach = function (id) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "attach_labor");
        loadDetails(id).then(function (item) {
            
            let d = new Date();
            var date = new Date(1990, 0, 1, 0, 0, 0, 0);
            let living = {
                country: "",
                city: "",
                district: "",
                ward: "",
                village: "",
                address: ""
            };

            let permanent_address = {
                country: "",
                city: "",
                district: "",
                ward: "",
                village: "",
                address: ""
            };



            ctrl._attach_value = {
                files: [],
                _id: item._id,
                tab: "attachment",
                basic_salary: item.basic_salary || 0,
                type: item.type || "",
                lastname: item.lastname,
                midname: item.midname || "",
                firstname: item.firstname,
                birth_date: item.birth_date || date.getTime(),
                living,
                permanent_address,
                type_residence: item.type_residence || "",

                phonenumber: item.phonenumber || "",
                email: item.email || "",
                idcard: item.idcard || "",
                nationality: item.nationality || "",
                religion: item.religion || "",

                training_school: item.training_school || "",
                graduation_year: "2000",
                education: item.education || "",
                degree: item.degree || "",
                specialized: item.specialized || "",
                state_management: item.state_management || "",
                political_theory: item.political_theory || "",
                it: item.it || "",
                degree_english: item.degree_english || "",

                department: item.department || "",
                competence: item.competence || "",

                from_date: d,
                to_date: d

            };
        }, function (err) { console.log(err); });

    }

    function attach_service() {
        var dfd = $q.defer();
        let living = {
            country: ctrl._attach_value.living.country,
            city: ctrl._attach_value.living.city,
            district: ctrl._attach_value.living.district,
            ward: ctrl._attach_value.living.ward,
            village: ctrl._attach_value.living.village,
            address: ctrl._attach_value.living.address
        };
        living = JSON.stringify(living);

        let permanent_address = {
            country: ctrl._attach_value.permanent_address.country,
            city: ctrl._attach_value.permanent_address.city.name,
            district: ctrl._attach_value.permanent_address.district.name,
            ward: ctrl._attach_value.permanent_address.ward.name,
            village: ctrl._attach_value.permanent_address.village,
            address: ctrl._attach_value.permanent_address.address
        };
        permanent_address = JSON.stringify(permanent_address);

        let nameFolder = changeVN(ctrl._attach_value.lastname + " " + (ctrl._attach_value.midname ? ctrl._attach_value.midname + " " : "") + ctrl._attach_value.firstname).replace(/ /g, "_") + "_" + ctrl._attach_value.idcard;

        employee_service.attach_labor(
            ctrl._attach_value.files,
            ctrl._attach_value._id,
            ctrl._attach_value.basic_salary,
            ctrl._attach_value.type,
            ctrl._attach_value.lastname,
            ctrl._attach_value.midname,
            ctrl._attach_value.firstname,
            ctrl._attach_value.birth_date.toString(),
            living,
            permanent_address,
            ctrl._attach_value.type_residence,

            ctrl._attach_value.phonenumber,
            ctrl._attach_value.email,
            ctrl._attach_value.idcard,
            ctrl._attach_value.nationality,
            ctrl._attach_value.religion,

            ctrl._attach_value.training_school,
            ctrl._attach_value.graduation_year,
            ctrl._attach_value.education,
            ctrl._attach_value.degree,
            ctrl._attach_value.specialized,
            ctrl._attach_value.state_management,
            ctrl._attach_value.political_theory,
            ctrl._attach_value.it,
            ctrl._attach_value.degree_english,

            ctrl._attach_value.department,
            ctrl._attach_value.competence,

            ctrl._attach_value.from_date.getTime(),
            ctrl._attach_value.to_date.getTime(),
            nameFolder
        ).then(function () {
            $("#modal_Employee_Attach").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.attach = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "attach_labor", attach_service);
    }

    //import
    ctrl.searchImport = function () {
        ctrl._searchImportData = ctrl._searchImportTemp;
    }

    ctrl.prepareImport = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "import");

    }

    ctrl.refreshImportData = function () {
        ctrl.importData = [];
        var id = 1;
        for (var i in ctrl.loadedData) {
            ctrl.importData.push(ctrl.loadedData[i]);
            ctrl.importData[ctrl.importData.length - 1].id = id;
            id++;
        }
    }

    ctrl.removeItemImport = function (id) {
        var temp = [];
        for (var i in ctrl.importData) {
            if (ctrl.importData[i].id !== id) {
                temp.push(ctrl.importData[i]);
            }
        }
        ctrl.importData = angular.copy(temp);
    }

    ctrl.loadData = function (params) {
        ctrl.loadedData = [];
        ctrl.importData = [];
        var workbook = XLSX.read(params, {
            type: 'binary'
        });

        workbook.SheetNames.forEach(function (sheetName) {
            // Here is your object
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            var json_object = JSON.stringify(XL_row_object);
            ctrl.loadedData = JSON.parse(json_object);
            ctrl.refreshImportData();
            ctrl.importStatus = "load";
        })
    }

    function import_service() {
        var dfd = $q.defer();
        employee_service.import(
            ctrl.importData
        ).then(function (res) {
            if (res.data
                && res.data.length > 0) {
                ctrl.importStatus = "error";
                ctrl.loadedData = res.data;
                ctrl.refreshImportData();
            } else {
                $("#modal_Employee_Import").modal("hide");
            }
            ctrl.refreshData();

            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.import = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "import", import_service);
    }

    ctrl.export = function () {
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j = 0;
        tab = document.getElementById('exportTable'); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "employee.xlsx");
        }
        else                 //other browser not tested on IE 11
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

        return (sa);
    }


    //**delete */
    ctrl.prepareDelete = function (item) {
        ctrl._delete_value = item;
        $rootScope.statusValue.generate(ctrl._ctrlName, "Employee", "delete");
    }

    function delete_service() {
        var dfd = $q.defer();
        employee_service.delete(ctrl._delete_value._id).then(function (res) {
            $("#modal_Employee_Delete").modal('hide');
            dfd.resolve(true);
            ctrl.refreshData();
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Employee", "delete", delete_service);
    }
}]);



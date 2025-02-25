

myApp.registerCtrl('labor_contract_controller', ['labor_contract_service', '$q', '$rootScope','$filter', function (labor_contract_service, $q, $rootScope,$filter) {

    /**declare variable */
    const _statusValueSet = [
        { name: "LaborContract", action: "load" },
        { name: "LaborContract", action: "count" },
        { name: "LaborContract", action: "countPending" },
        { name: "LaborContract", action: "insert" },
        { name: "LaborContract", action: "update" },
        { name: "LaborContract", action: "approval" },
        { name: "LaborContract", action: "pushFile" },
        { name: "LaborContract", action: "removeFile" },
        { name: "LaborContract", action: "delete" },
        { name: "LaborContract", action: "delete_multi" },
    ];
    var ctrl = this;
    var defaultAr = [{ name: "Chưa chọn" }];
    var defaultArL = [{ key: "NotSelectedYet", title: { "vi-VN": "Chưa chọn", "en-US": "NotSelectedYet" } }];
    /** init variable */
    {
        ctrl._ctrlName = "labor_contract_controller";
        ctrl.tab = "all";
        ctrl.numberPending = 0;
        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: 1 } };
        ctrl.labor_contracts = [];


        ctrl._notyetInit = true;

        ctrl._searchByKeyToFilterData = "";
        ctrl._filterTypeLaborContract = "";
        ctrl._filterSpecialized = "";
        ctrl._filterIT = "";
        ctrl._filterDegreeEnglish = "";
        ctrl._filterDepartment = {};

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
 

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInfoModal = FrontendDomain + "/modules/office/human/labor_contract/views/info_modal.html";
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/human/labor_contract/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/human/labor_contract/views/update_modal.html";
        ctrl._urlApprovalModal = FrontendDomain + "/modules/office/human/labor_contract/views/approval_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/human/labor_contract/views/delete_modal.html";
        ctrl._urlDelete_MultiModal = FrontendDomain + "/modules/office/human/labor_contract/views/delete_multi_modal.html";
    }



    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }
    ctrl.chooseTypeLaborContract = function (val) {
        ctrl._filterTypeLaborContract = val.value;
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

        if (ctrl._filterTypeLaborContract) {
            obj.type = angular.copy(ctrl._filterTypeLaborContract);
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
            obj.status = "Pending";
        }
        return obj;
    }

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.labor_contracts) {
            if (ctrl.labor_contracts[i]._id === params.params) {
                ctrl.labor_contracts[i].check = params.value;
            }
            if (ctrl.labor_contracts[i].check && ctrl.labor_contracts[i].status === 'Pending') {
                ctrl.checkIdAr.push(ctrl.labor_contracts[i]._id);
                ctrl.checkAr.push(ctrl.labor_contracts[i]);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.labor_contracts.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.labor_contracts) {
            ctrl.labor_contracts[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        ctrl.checkAr = [];
        for (var i in ctrl.labor_contracts) {
            ctrl.labor_contracts[i].check = params;
            if (ctrl.labor_contracts[i].check && ctrl.labor_contracts[i].status === 'Pending') {
                ctrl.checkIdAr.push(ctrl.labor_contracts[i]._id);
                ctrl.checkAr.push(ctrl.labor_contracts[i]);
            }
        }
    }

    /* Init and load necessary resource to the module. */





    function load_service() {
        var dfd = $q.defer();
        ctrl.labor_contracts = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        labor_contract_service.load(_filter.search, _filter.type, _filter.specialized, _filter.it, _filter.degree_english, _filter.department, _filter.status, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.labor_contracts = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "load", load_service);
    }


    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        labor_contract_service.count(_filter.search, _filter.type, _filter.specialized, _filter.it, _filter.degree_english, _filter.department, _filter.status).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "count", count_service);
    }

    function countPending_service() {
        var dfd = $q.defer();
        labor_contract_service.countPending().then(function (res) {
            ctrl.numberPending = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.countPending = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "countPending", countPending_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        if($filter('checkRule')(['Office.LaborContract.Approval'])){
            dfdAr.push(ctrl.countPending());
        }
        

        $q.all(dfdAr);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        if($filter('checkRule')(['Office.LaborContract.Approval'])){
            dfdAr.push(ctrl.countPending());
        }

        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }


    /**INSERT */

    function generateFIlterForInsert() {
        if (ctrl._insert_value.living) {
            if (ctrl._insert_value.living.country) {
                ctrl.filterCity_living_insert = [
                    { parent: { $eq: ctrl._insert_value.living.country } }
                ];
            }

            if(ctrl._insert_value.living.city){
                ctrl.filterDistrict_living_insert = [
                    { parent: { $eq: ctrl._insert_value.living.city } }
                ];
            }

            if(ctrl._insert_value.living.district){
                ctrl.filterWard_living_insert = [
                    { parent: { $eq: ctrl._insert_value.living.district } }
                ];
            }

            if(ctrl._insert_value.living.ward){
                ctrl.filterVillage_living_insert = [
                    { parent: { $eq: ctrl._insert_value.living.ward } }
                ];
            }

        } else {
            ctrl.filterCity_living_insert = [];
            ctrl.filterDistrict_living_insert = [];
            ctrl.filterWard_living_insert = [];
            ctrl.filterVillage_living_insert = [];
        }

        if (ctrl._insert_value.permanent_address) {
            if (ctrl._insert_value.permanent_address.country) {
                ctrl.filterCity_permanent_address_insert = [
                    { parent: { $eq: ctrl._insert_value.permanent_address.country } }
                ];
            }

            if(ctrl._insert_value.permanent_address.city){
                ctrl.filterDistrict_permanent_address_insert = [
                    { parent: { $eq: ctrl._insert_value.permanent_address.city } }
                ];
            }

            if(ctrl._insert_value.permanent_address.district){
                ctrl.filterWard_permanent_address_insert = [
                    { parent: { $eq: ctrl._insert_value.permanent_address.district } }
                ];
            }

            if(ctrl._insert_value.permanent_address.ward){
                ctrl.filterVillage_permanent_address_insert = [
                    { parent: { $eq: ctrl._insert_value.permanent_address.ward } }
                ];
            }

        } else {
            ctrl.filterCity_permanent_address_insert = [];
            ctrl.filterDistrict_permanent_address_insert = [];
            ctrl.filterWard_permanent_address_insert = [];
            ctrl.filterVillage_permanent_address_insert = [];
        }

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

    ctrl.chooseTypeLaborContract_insert = function (val) {
        ctrl._insert_value.type = val.value;
    }

    ctrl.chooseCountry1_insert = function (val) {
        ctrl._insert_value.living.country = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseCity1_insert = function (val) {
        ctrl._insert_value.living.city = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseDistrict1_insert = function (val) {
        ctrl._insert_value.living.district = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseWard1_insert = function (val) {
        ctrl._insert_value.living.ward = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseVillage1_insert = function (val) {
        ctrl._insert_value.living.village = val.value;
    }

    ctrl.chooseCountry2_insert = function (val) {
        ctrl._insert_value.permanent_address.country = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseCity2_insert = function (val) {
        ctrl._insert_value.permanent_address.city = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseDistrict2_insert = function (val) {
        ctrl._insert_value.permanent_address.district = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseWard2_insert = function (val) {
        ctrl._insert_value.permanent_address.ward = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseVillage2_insert = function (val) {
        ctrl._insert_value.permanent_address.village = val.value;
        generateFIlterForInsert();
    }

    ctrl.chooseTypeResidence_insert = function (val) {
        ctrl._insert_value.type_residence = val.value;

    }

    ctrl.chooseNationality_insert = function (val) {
        ctrl._insert_value.nationality = val.value;

    }

    ctrl.chooseReligion_insert = function (val) {
        ctrl._insert_value.religion = val.value;
    }

    ctrl.chooseEducation_insert = function (val) {
        ctrl._insert_value.education = val.value;

    }

    ctrl.chooseDegree_insert = function (val) {
        ctrl._insert_value.degree = val.value;
    }

    ctrl.chooseSpecialized_insert = function (val) {
        ctrl._insert_value.specialized = val.value;
    }

    ctrl.pickTrainingSchool_insert = function (val) {
        ctrl._insert_value.training_school = val.value;
    }

    ctrl.chooseStateManagement_insert = function (val) {
        ctrl._insert_value.state_management = val.value;
    }

    ctrl.choosePoliticalTheory_insert = function (val) {
        ctrl._insert_value.political_theory = val.value;
    }

    ctrl.chooseIT_insert = function (val) {
        ctrl._insert_value.it = val.value;
    }

    ctrl.chooseDegreeEnglish_insert = function (val) {
        ctrl._insert_value.degree_english = val.value;
    }

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

    ctrl.chooseFrom_insert = function (val) {
        ctrl._insert_value.from_date = val.getTime();
    }

    ctrl.chooseTo_insert = function (val) {
        ctrl._insert_value.to_date = val.getTime();
    }

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

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "LaborContract", "insert");
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        var date = new Date(1990, 0, 1, 0, 0, 0, 0);
        ctrl._insert_value = {
            files: [],
            tab: "attachment",
            basic_salary: 0,
            type: "",
            lastname: "",
            midname: "",
            firstname: "",
            birth_date: date.getTime(),
            living: {
                country:"",
                city: "",
                district: "",
                ward: "",
                village: "",
                address: ""
            },
            permanent_address: {
                country:"",
                city: "",
                district: "",
                ward: "",
                village: "",
                address: ""
            },
            type_residence: "",

            phonenumber: "",
            email: "",
            idcard: "",
            nationality: "",
            religion: "",

            training_school: "",
            graduation_year: "2000",
            education: "",
            degree: "",
            specialized: "",
            state_management: "",
            political_theory: "",
            it: "",
            degree_english: "",

            department: "",
            competence: "",

            from_date: myToday.getTime(),
            to_date: endDay.getTime()

        };
    }

    function insert_service() {
        var dfd = $q.defer();
        let living = {
            country: ctrl._insert_value.living.country,
            city: ctrl._insert_value.living.city,
            district: ctrl._insert_value.living.district,
            ward: ctrl._insert_value.living.ward,
            village: ctrl._insert_value.living.village,
            address: ctrl._insert_value.living.address
        };

        let permanent_address = {
            country: ctrl._insert_value.permanent_address.country,
            city: ctrl._insert_value.permanent_address.city,
            district: ctrl._insert_value.permanent_address.district,
            ward: ctrl._insert_value.permanent_address.ward,
            village: ctrl._insert_value.permanent_address.village,
            address: ctrl._insert_value.permanent_address.address
        };
        living = JSON.stringify(living);
        permanent_address = JSON.stringify(permanent_address);
        let nameFolder = changeVN(ctrl._insert_value.lastname + " " + (ctrl._insert_value.midname ? ctrl._insert_value.midname + " " : "") + ctrl._insert_value.firstname).replace(/ /g, "_") + "_" + ctrl._insert_value.idcard;

        labor_contract_service.insert(
            ctrl._insert_value.files,
            ctrl._insert_value.basic_salary,
            ctrl._insert_value.type,
            ctrl._insert_value.lastname,
            ctrl._insert_value.midname,
            ctrl._insert_value.firstname,
            ctrl._insert_value.birth_date.toString(),
            living,
            permanent_address,
            ctrl._insert_value.type_residence,

            ctrl._insert_value.phonenumber,
            ctrl._insert_value.email,
            ctrl._insert_value.idcard,
            ctrl._insert_value.nationality,
            ctrl._insert_value.religion,

            ctrl._insert_value.training_school,
            ctrl._insert_value.graduation_year,
            ctrl._insert_value.education,
            ctrl._insert_value.degree,
            ctrl._insert_value.specialized,
            ctrl._insert_value.state_management,
            ctrl._insert_value.political_theory,
            ctrl._insert_value.it,
            ctrl._insert_value.degree_english,

            ctrl._insert_value.department,
            ctrl._insert_value.competence,

            ctrl._insert_value.from_date.toString(),
            ctrl._insert_value.to_date.toString(),
            nameFolder
        ).then(function () {
            $("#modal_LaborContract_Insert").modal("hide");
            ctrl.refreshData();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "insert", insert_service);
    }

    /**load File */

    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            labor_contract_service.loadFileInfo(params.id, params.name).then(function (res) {
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

    /**INFO */

    ctrl.assignItem = function (item) {
        ctrl._info_value = {
            _id: item._id,
            attachment: item.attachment,
            tab: "attachment",
            basic_salary: item.basic_salary,
            type: item.type,
            lastname: item.lastname,
            midname: item.midname,
            firstname: item.firstname,
            living: item.living,
            permanent_address: item.permanent_address,
            type_residence: item.type_residence,

            phonenumber: item.phonenumber,
            email: item.email,
            idcard: item.idcard,
            nationality: item.nationality,
            religion: item.religion,

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

            from_date: item.from_date,
            to_date: item.to_date
        };
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

    }

    ctrl.chooseTypeLaborContract_update = function (val) {
        ctrl._update_value.type = val.value;
        generateFIlterForUpdate();
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
    ctrl.chooseBirthDate_update = function (val) {
        ctrl._update_value.birth_date = val.getTime();
    }
    ctrl.chooseFrom_update = function (val) {
        ctrl._update_value.from_date = val.getTime();
    }

    ctrl.chooseTo_update = function (val) {
        ctrl._update_value.to_date = val.getTime();
    }



    ctrl.prepareUpdate = function (item) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "LaborContract", "update");
        $rootScope.statusValue.generate(ctrl._ctrlName, "LaborContract", "approval");
        $rootScope.statusValue.generate(ctrl._ctrlName, "LaborContract", "delete");
        ctrl._update_value = {
            fullname: item.fullname,
            _id: item._id,
            attachment: item.attachment,
            tab: "attachment",
            basic_salary: item.basic_salary,
            type: item.type,
            lastname: item.lastname,
            midname: item.midname,
            firstname: item.firstname,
            birth_date: item.birth_date,
            living: item.living,
            permanent_address: item.permanent_address,
            type_residence: item.type_residence,

            phonenumber: item.phonenumber,
            email: item.email,
            idcard: item.idcard,
            nationality: item.nationality,
            religion: item.religion,

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

            from_date: item.from_date,
            to_date: item.to_date

        };
    }

    function update_service() {
        var dfd = $q.defer();
        let living = {
            country: ctrl._update_value.living.country,
            city: ctrl._update_value.living.city,
            district: ctrl._update_value.living.district,
            ward: ctrl._update_value.living.ward,
            village: ctrl._update_value.living.village,
            address: ctrl._update_value.living.address
        };

        let permanent_address = {
            country: ctrl._update_value.permanent_address.country,
            city: ctrl._update_value.permanent_address.city,
            district: ctrl._update_value.permanent_address.district,
            ward: ctrl._update_value.permanent_address.ward,
            village: ctrl._update_value.permanent_address.village,
            address: ctrl._update_value.permanent_address.address
        };

        let nameFolder = changeVN(ctrl._update_value.lastname + " " + (ctrl._update_value.midname ? ctrl._update_value.midname + " " : "") + ctrl._update_value.firstname).replace(/ /g, "_") + "_" + ctrl._update_value.idcard;

        labor_contract_service.update(
            ctrl._update_value._id,
            ctrl._update_value.basic_salary,
            ctrl._update_value.type,
            ctrl._update_value.lastname,
            ctrl._update_value.midname,
            ctrl._update_value.firstname,
            ctrl._update_value.birth_date,
            living,
            permanent_address,
            ctrl._update_value.type_residence,

            ctrl._update_value.phonenumber,
            ctrl._update_value.email,
            ctrl._update_value.idcard,
            ctrl._update_value.nationality,
            ctrl._update_value.religion,

            ctrl._update_value.training_school,
            ctrl._update_value.graduation_year,
            ctrl._update_value.education,
            ctrl._update_value.degree,
            ctrl._update_value.specialized,
            ctrl._update_value.state_management,
            ctrl._update_value.political_theory,
            ctrl._update_value.it,
            ctrl._update_value.degree_english,

            ctrl._update_value.department,
            ctrl._update_value.competence,

            ctrl._update_value.from_date,
            ctrl._update_value.to_date,
            nameFolder
        ).then(function () {
            $("#modal_LaborContract_Update").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "update", update_service);
    }


    /**PUSH FILE */

    function pushFile_service(file) {
        return function () {
            var dfd = $q.defer();
            let nameFolder = changeVN(ctrl._update_value.lastname + " " + (ctrl._update_value.midname ? ctrl._update_value.midname + " " : "") + ctrl._update_value.firstname).replace(/ /g, "_") + "_" + ctrl._update_value.idcard;
            labor_contract_service.pushFile(file, ctrl._update_value._id, nameFolder).then(function (res) {
                ctrl._update_value.attachment.push(res.data);
                ctrl.refreshData();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushFile = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "pushFile", pushFile_service(file));
    }

    /** REMOVE FILE */
    function removeFile_service(filename) {
        return function () {
            var dfd = $q.defer();
            labor_contract_service.removeFile(ctrl._update_value._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl._update_value.attachment) {
                    if (ctrl._update_value.attachment[i].name !== filename) {
                        temp.push(ctrl._update_value.attachment[i]);
                    }
                }
                ctrl._update_value.attachment = temp;
                ctrl.refreshData();
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

    ctrl.removeFile = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "removeFile", removeFile_service(item.name));
    }

    /**APPROVAL */

    function approval_service() {
        var dfd = $q.defer();
        let living = {
            country: ctrl._update_value.living.country,
            city: ctrl._update_value.living.city,
            district: ctrl._update_value.living.district,
            ward: ctrl._update_value.living.ward,
            village: ctrl._update_value.living.village,
            address: ctrl._update_value.living.address
        };

        let permanent_address = {
            country: ctrl._update_value.permanent_address.country,
            city: ctrl._update_value.permanent_address.city,
            district: ctrl._update_value.permanent_address.district,
            ward: ctrl._update_value.permanent_address.ward,
            village: ctrl._update_value.permanent_address.village,
            address: ctrl._update_value.permanent_address.address
        };

        let nameFolder = changeVN(ctrl._update_value.lastname + " " + (ctrl._update_value.midname ? ctrl._update_value.midname + " " : "") + ctrl._update_value.firstname).replace(/ /g, "_") + "_" + ctrl._update_value.idcard;

        labor_contract_service.approval(
            ctrl._update_value._id,
            ctrl._update_value.basic_salary,
            ctrl._update_value.type,
            ctrl._update_value.lastname,
            ctrl._update_value.midname,
            ctrl._update_value.firstname,
            ctrl._update_value.birth_date,
            living,
            permanent_address,
            ctrl._update_value.type_residence,

            ctrl._update_value.phonenumber,
            ctrl._update_value.email,
            ctrl._update_value.idcard,
            ctrl._update_value.nationality,
            ctrl._update_value.religion,

            ctrl._update_value.training_school,
            ctrl._update_value.graduation_year,
            ctrl._update_value.education,
            ctrl._update_value.degree,
            ctrl._update_value.specialized,
            ctrl._update_value.state_management,
            ctrl._update_value.political_theory,
            ctrl._update_value.it,
            ctrl._update_value.degree_english,

            ctrl._update_value.department,
            ctrl._update_value.competence,

            ctrl._update_value.from_date,
            ctrl._update_value.to_date,
            nameFolder
        ).then(function () {
            ctrl.refreshData();
            $("#modal_LaborContract_Approval").modal("hide");

            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.approval = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "approval", approval_service);
    }


    /**delete */
    function delete_service() {
        var dfd = $q.defer();
        labor_contract_service.delete(ctrl._update_value._id).then(function () {
            ctrl.refreshData();
            $("#modal_LaborContract_Delete").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "delete", delete_service);
    }

    /**DELETE MULTI */
    // ctrl.prepareDeleteMulti = function(){
    //     var temp =[];
    //     var tempId =[];
    //     for(var i in ctrl.checkAr){
    //         if(ctrl.checkAr[i].status==='Pending'){
    //             temp.push(ctrl.checkAr[i]);
    //             tempId.push(ctrl.checkAr[i]._id);
    //         }
    //     }
    //     ctrl.checkAr = temp;
    //     ctrl.checkIdAr = tempId;
    // }

    function delete_multi_service() {
        var dfd = $q.defer();
        labor_contract_service.delete_multi(ctrl.checkIdAr).then(function () {
            $("#modal_LaborContract_Delete_Multi").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.delete_multi = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "LaborContract", "delete_multi", delete_multi_service);
    }
}]);



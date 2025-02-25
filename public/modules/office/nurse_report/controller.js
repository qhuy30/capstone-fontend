

myApp.registerCtrl('nurse_report_controller', ['nurse_report_service', '$q', '$rootScope', '$filter', '$compile','fRoot', function (nurse_report_service, $q, $rootScope, $filter, $compile,fRoot) {

    /**declare variable */
    const _statusValueSet = [
        { name: "NurseReport", action: "load" },
        { name: "NurseReport", action: "count" },
        { name: "NurseReport", action: "insert" },
        { name: "NurseReport", action: "update" },
        { name: "NurseReport", action: "delete" },
        { name: "NurseReport", action: "delete_multi" },
    ];
    var ctrl = this;
    var idEditor = "insertNurseReport_content";
    var idEditor_update = "updateNurseReport_content";
    var d = new Date();
    /** init variable */
    {
        ctrl._ctrlName = "nurse_report_controller";

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 30;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "key", value: false, query: { key: 1 } };
        ctrl.nurse_reports = [];
        ctrl.settings = [];
        ctrl.settings_department = [];
        ctrl.startTime = "03:00";
        ctrl.endTime = "10:00";
        ctrl.check = true;
        ctrl._notyetInit = true;
        ctrl.tab = "report";//statistic/report

        ctrl._filterDepartment = "";
        ctrl.now = getString_now(d);
        ctrl._filterFromDate = d.getTime();
        ctrl._filterToDate = d.getTime();

        ctrl._filterDate_statistic = d.getTime();
        ctrl.instanceGrid = {};
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._urlInsertModal = FrontendDomain + "/modules/office/nurse_report/views/insert_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/nurse_report/views/update_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/nurse_report/views/delete_modal.html";
        ctrl._urlDelete_MultiModal = FrontendDomain + "/modules/office/nurse_report/views/delete_multi_modal.html";
    }

    /**function for logic */
    function getString_now(d) {
        let date = d.getFullYear() + "-";
        date += (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
        date += "-";
        date += d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

        return date;
    }

    function getString(d) {
        let date = d.getFullYear() + "/";
        date += (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
        date += "/";
        date += d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
        return date;
    }
    ctrl.switchTab = function (val) {
        if (ctrl.tab !== val) {
            ctrl.tab = val;

        }
    }

    ctrl.checkTimeBlock = function () {
        var d = new Date();
        var fromHours = 3;
        var fromMin = 0;
        var toHours = 10;
        var toMin = 0;
        var checkFrom = false;
        var checkTo = false;
        for (var i in ctrl.settings) {
            switch (ctrl.settings[i].key) {
                case "startNursingReportTime":
                    ctrl.startTime = ctrl.settings[i].value;
                    fromHours = parseInt(ctrl.settings[i].value.split(":")[0]);
                    fromMin = parseInt(ctrl.settings[i].value.split(":")[1]);
                    break;
                case "endNursingReportTime":
                    ctrl.endTime = ctrl.settings[i].value;
                    toHours = parseInt(ctrl.settings[i].value.split(":")[0]);
                    toMin = parseInt(ctrl.settings[i].value.split(":")[1]);
                    break;
            }
        }

        if (d.getHours() > fromHours) {
            checkFrom = true;
        }

        if (d.getHours() == fromHours && d.getMinutes() >= fromMin) {
            checkFrom = true;
        }

        if (d.getHours() < toHours) {
            checkTo = true;
        }

        if (d.getHours() == toHours && d.getMinutes() <= toMin) {
            checkTo = true;
        }

        if (checkFrom && checkTo) {
            return true;
        }

        return false;

    }

    ctrl.checkModify = function (item) {
        var d = getString(new Date());
        if (item
            && d === item.date
            && ctrl.checkTimeBlock()
            && $rootScope.logininfo.data.info.department == item.department
        ) {
            return true;

        }
        return false;

    }

    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData();
    }

    ctrl.chooseDepartment = function (val) {
        ctrl._filterDepartment = angular.copy(val.id);
        ctrl.refreshData();
    }

    ctrl.chooseFromDate = function (val) {
        ctrl._filterFromDate = val ? val.getTime() : (new Date).getTime();
        ctrl.refreshData();
    }

    ctrl.chooseToDate = function (val) {
        ctrl._filterToDate = val ? val.getTime() : (new Date).getTime();
        ctrl.refreshData();
    }

    ctrl.chooseDate_statistic = function (val) {
        ctrl._filterDate_statistic = val ? val.getTime() : (new Date).getTime();
        ctrl.instanceGrid.refresh();
    }



    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._filterDepartment) {
            obj.department = angular.copy(ctrl._filterDepartment);
        }

        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate);
        }

        if (ctrl._filterToDate) {
            obj.to_date = angular.copy(ctrl._filterToDate);
        }
        return obj;
    }

    function generateFilter_statistic() {
        var obj = {};

        if (ctrl._filterFromDate) {
            obj.date = angular.copy(ctrl._filterDate_statistic);
        }
        return obj;
    }

    ctrl.checkItem = function (params) {
        ctrl.checkIdAr = [];
        for (var i in ctrl.nurse_reports) {
            if (ctrl.nurse_reports[i]._id === params.params) {
                ctrl.nurse_reports[i].check = params.value;
            }
            if (ctrl.nurse_reports[i].check) {
                ctrl.checkIdAr.push(ctrl.nurse_reports[i]._id);
            }
        }
        if (ctrl.checkIdAr.length === ctrl.nurse_reports.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = false;
        }
    }

    ctrl.uncheckAllItem = function () {
        ctrl.checkIdAr = [];
        for (var i in ctrl.nurse_reports) {
            ctrl.nurse_reports[i].check = false;
        }
    }

    ctrl.checkAllItem = function (params) {
        ctrl.checkIdAr = [];
        for (var i in ctrl.nurse_reports) {
            ctrl.nurse_reports[i].check = params;
            if (ctrl.nurse_reports[i].check) {
                ctrl.checkIdAr.push(ctrl.nurse_reports[i]._id);
            }
        }
    }

    /* Init and load necessary resource to the module. */
    function checkexist_service() {
        var dfd = $q.defer();
        nurse_report_service.checkexist().then(function (res) {
            ctrl.check = true;
            dfd.resolve(true);
        }, function () {
            ctrl.check = false;
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }



    function loadSettings() {
        nurse_report_service.loadSetting().then(function (res) {
            ctrl.settings = res.data;
        }, function () {
            err = undefined;
        });
    }

    function loadSettings_Department() {
        nurse_report_service.load_nursing_report().then(function (res) {
            ctrl.settings_department = res.data;
            generateOps();
        }, function () {
            err = undefined;
        });
    }



    function load_service() {
        var dfd = $q.defer();
        ctrl.nurse_reports = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        nurse_report_service.load(_filter.from_date, _filter.to_date, _filter.department, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.nurse_reports = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "load", load_service);
    }

    function count_service() {
        var dfd = $q.defer();
        var _filter = generateFilter();
        nurse_report_service.count(_filter.from_date, _filter.to_date, _filter.department).then(function (res) {
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "count", count_service);
    }

    ctrl.refreshData = function () {
        var dfdAr = [];
        resetPaginationInfo();
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(checkexist_service());
        $q.all(dfdAr);
    }

    init();
    function init() {
        var dfdAr = [];
        dfdAr.push(ctrl.load());
        dfdAr.push(ctrl.count());
        dfdAr.push(checkexist_service());
        dfdAr.push(loadSettings());
        dfdAr.push(loadSettings_Department());
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

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "NurseReport", "insert");
        $("#" + idEditor).summernote({
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    nurse_report_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        ctrl._insert_value = {
            total_nurse: 0, administrative_nursing: 0,
            out_shift_nursing: 0, out_hospital_nursing: 0,
            morning_shift: 0, afternoon_shift: 0, night_shift: 0, over_shift: 0, leave_shift: 0, at_clinic: 0,
            leave: 0, maternity_leave: 0, sick_leave: 0, go_school: 0,
            apprentice_nursing: 0, probationary_nursing: 0, other_case: 0,
            real_bed: 0, patient_number: 0, level_1_care: 0, final_phase_patient: 0,
            ventilator_base: 0, active_ventilator: 0, monitor_base: 0, active_monitor: 0,
            electric_syringe_base: 0, active_electric_syringe: 0, drops_counter_base: 0, active_drops_counter: 0
        };

        ctrl.insert_total_nurseOps = {
            width: 60,
            value: 0,
            min: 0,
            showSpinButtons: true
        };

        ctrl.insert_administrative_nursingOps = {
            width: 60,
            value: 0,
            min: 0,
            showSpinButtons: true
        };

        ctrl.insert_out_shift_nursingOps = {
            width: 60,
            value: 0,
            min: 0,
            showSpinButtons: true
        };

        ctrl.insert_out_hospital_nursingOps = {
            width: 60,
            value: 0,
            min: 0,
            showSpinButtons: true
        };
    }


    function insert_service() {
        var dfd = $q.defer();
        nurse_report_service.insert(ctrl._insert_value.total_nurse, ctrl._insert_value.administrative_nursing,
            ctrl._insert_value.out_shift_nursing, ctrl._insert_value.out_hospital_nursing,
            ctrl._insert_value.morning_shift, ctrl._insert_value.afternoon_shift, ctrl._insert_value.night_shift, ctrl._insert_value.over_shift, ctrl._insert_value.leave_shift, ctrl._insert_value.at_clinic,
            ctrl._insert_value.leave, ctrl._insert_value.maternity_leave, ctrl._insert_value.sick_leave, ctrl._insert_value.go_school,
            ctrl._insert_value.apprentice_nursing, ctrl._insert_value.probationary_nursing, ctrl._insert_value.other_case,
            ctrl._insert_value.real_bed, ctrl._insert_value.patient_number, ctrl._insert_value.level_1_care, ctrl._insert_value.final_phase_patient,
            ctrl._insert_value.ventilator_base, ctrl._insert_value.active_ventilator, ctrl._insert_value.monitor_base, ctrl._insert_value.active_monitor,
            ctrl._insert_value.electric_syringe_base, ctrl._insert_value.active_electric_syringe, ctrl._insert_value.drops_counter_base, ctrl._insert_value.active_drops_counter,
            $("#" + idEditor).summernote('code')).then(function () {
                $("#modal_NurseReport_Insert").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "insert", insert_service);
    }

    /**UPDATE */

    ctrl.prepareUpdate = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "NurseReport", "update");
        ctrl._update_value = angular.copy(value);
        $("#" + idEditor_update).summernote({
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    nurse_report_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data.data);
                        $("#" + idEditor_Update).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor_update).summernote('code', value.note);
    }

    function update_service() {
        var dfd = $q.defer();
        nurse_report_service.update(ctrl._update_value._id, ctrl._update_value.total_nurse, ctrl._update_value.administrative_nursing,
            ctrl._update_value.out_shift_nursing, ctrl._update_value.out_hospital_nursing,
            ctrl._update_value.morning_shift, ctrl._update_value.afternoon_shift, ctrl._update_value.night_shift, ctrl._update_value.over_shift, ctrl._update_value.leave_shift, ctrl._update_value.at_clinic,
            ctrl._update_value.leave, ctrl._update_value.maternity_leave, ctrl._update_value.sick_leave, ctrl._update_value.go_school,
            ctrl._update_value.apprentice_nursing, ctrl._update_value.probationary_nursing, ctrl._update_value.other_case,
            ctrl._update_value.real_bed, ctrl._update_value.patient_number, ctrl._update_value.level_1_care, ctrl._update_value.final_phase_patient,
            ctrl._update_value.ventilator_base, ctrl._update_value.active_ventilator, ctrl._update_value.monitor_base, ctrl._update_value.active_monitor,
            ctrl._update_value.electric_syringe_base, ctrl._update_value.active_electric_syringe, ctrl._update_value.drops_counter_base, ctrl._update_value.active_drops_counter,
            $("#" + idEditor_update).summernote('code')).then(function () {
                $("#modal_NurseReport_Update").modal("hide");
                dfd.resolve(true);
                ctrl.load();
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "update", update_service);
    }

    /**DELETE */
    ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "NurseReport", "delete");
        ctrl._delete_value = angular.copy(value);
    }

    function delete_service() {
        var dfd = $q.defer();
        nurse_report_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_NurseReport_Delete").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "delete", delete_service);
    }

    /**DELETE MULTI */
    function delete_multi_service() {
        var dfd = $q.defer();
        nurse_report_service.delete_multi(ctrl.checkIdAr).then(function () {
            $("#modal_NurseReport_Delete_Multi").modal("hide");
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "NurseReport", "delete_multi", delete_multi_service);
    }


    /**Statistic */


    function generateCustomStore() {
        return new DevExpress.data.CustomStore({
            key: "_id",
            load: function (loadOptions) {
                var dfd = $q.defer();
                let _filter = generateFilter_statistic();
                nurse_report_service.statistic(_filter.date).then(function (res) {
                    for (var i in ctrl.settings_department) {
                        ctrl.settings_department[i].hasReport = false;
                        ctrl.settings_department[i].department = ctrl.settings_department[i].id;
                        for (var j in res.data) {
                            if (ctrl.settings_department[i].id === res.data[j].department) {
                                ctrl.settings_department[i].hasReport = true;
                                for (var z in res.data[j]) {
                                    if (z != '_id' & z != 'id') {
                                        ctrl.settings_department[i][z] = res.data[j][z];
                                    }
                                }
                            }
                        }

                    }
                    dfd.resolve(ctrl.settings_department);
                }, function () {
                    dfd.reject(false);
                    err = undefined;
                });
                return dfd.promise;
            }
        });
    }

    function generateOps() {
        ctrl.gridOptions = {
            dataSource: generateCustomStore(),
            columnAutoWidth: true,
            focusedRowEnabled: true,
            allowColumnResizing: true,
            showBorders: true,
            columnFixing: {
                enabled: true
            },
            export: {
                enabled: true
            },
            onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('NurseReport');
                // worksheet.mergeCells("B2","AE2");
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet: worksheet,
                    autoFilterEnabled: true,
                    customizeCell: async (options) => {
                        var { excelCell, gridCell } = options;
                        if (gridCell.rowType === "data") {
                            switch (gridCell.column.dataField) {
                                case "department":
                                   
                                    break;
                                case "total_nurse":
                                    if(gridCell.value===null ||gridCell.value===undefined ){
                                        worksheet.getCell(excelCell._address).value = $filter('l')('NotReportYet');
                                        worksheet.mergeCells(excelCell._address,"AE"+ excelCell._address.split("B")[1]);
                                        
                                        worksheet.getRow(parseInt(excelCell._address.split("B")[1])).commit();
                                    }
                                    break;
                                case "note":

                                    break;
                            }
                        }
         
                    }
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),'NursingReport.xlsx');
                    });
                });
                e.cancel = true;
            },
            columns: [
                {
                    caption: $filter('l')('Department'),
                    dataField: "department",
                    dataType: "string",
                    width: 180,
                    fixed: true,
                    fixedPosition: "left",
                    cellTemplate: function (element, info) {
                        try {
                            var compiled = $compile("<show-department department='" + info.value + "'>" + "</show-department>")($rootScope);
                            element.append(compiled);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                },
                /**general */
                {
                    caption: $filter('l')('TotalNurse_Technicians'),
                    dataField: "total_nurse",
                    cellTemplate: function (element, info) {
                        try {
                            var html = "";
                            if (info.value) { html = info.value }
                            else {
                                html = $filter('l')('NotReportYet');
                            }
                            element.append(html);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                },
                {
                    caption: $filter('l')('AdministrativeNursing_Technicians'),
                    dataField: "administrative_nursing"

                },
                /**out*/
                {
                    caption: $filter('l')('OutShiftNursing_Technicians'),
                    dataField: "out_shift_nursing",
                    allowResizing: false


                },
                {
                    caption: $filter('l')('NursingOutHospital'),
                    dataField: "out_hospital_nursing"

                },
                /**shift*/
                {
                    caption: $filter('l')('MorningShiftNursing'),
                    dataField: "morning_shift"
                },
                {
                    caption: $filter('l')('AfternoonShiftNursing'),
                    dataField: "afternoon_shift"
                },
                {
                    caption: $filter('l')('NightShiftNursing'),
                    dataField: "night_shift"
                },
                {
                    caption: $filter('l')('OverShiftNursing'),
                    dataField: "over_shift"
                },
                {
                    caption: $filter('l')('LeaveShiftNursing'),
                    dataField: "leave_shift"
                },
                {
                    caption: $filter('l')('NursingAtClinic'),
                    dataField: "at_clinic"
                },
                /**other*/
                {
                    caption: $filter('l')('LeaveNursing'),
                    dataField: "leave"
                },
                {
                    caption: $filter('l')('MaternityLeaveNursing'),
                    dataField: "maternity_leave"
                },
                {
                    caption: $filter('l')('SickLeaveNursing'),
                    dataField: "sick_leave"
                },
                {
                    caption: $filter('l')('NursingGoSchool'),
                    dataField: "go_school"
                },
                /**other*/
                {
                    caption: $filter('l')('ApprenticeNursing'),
                    dataField: "apprentice_nursing"
                },
                {
                    caption: $filter('l')('ProbationaryNursing'),
                    dataField: "probationary_nursing"
                },
                {
                    caption: $filter('l')('OtherCase'),
                    dataField: "other_case"
                },
                /**other*/
                {
                    caption: $filter('l')('RealBed'),
                    dataField: "real_bed"
                },
                {
                    caption: $filter('l')('PatientNumber'),
                    dataField: "patient_number"
                },
                {
                    caption: $filter('l')('Level1Care'),
                    dataField: "level_1_care"
                },
                {
                    caption: $filter('l')('FinalPhasePatient'),
                    dataField: "final_phase_patient"
                },
                /**other*/
                {
                    caption: $filter('l')('VentilatorBase'),
                    dataField: "ventilator_base"
                },
                {
                    caption: $filter('l')('ActiveVentilator'),
                    dataField: "active_ventilator"
                },
                {
                    caption: $filter('l')('MonitorBase'),
                    dataField: "monitor_base"
                },
                {
                    caption: $filter('l')('ActiveMonitor'),
                    dataField: "active_monitor"
                },
                /**other*/
                {
                    caption: $filter('l')('ElectricSyringeBase'),
                    dataField: "electric_syringe_base"
                },
                {
                    caption: $filter('l')('ActiveElectricSyringe'),
                    dataField: "active_electric_syringe"
                },
                {
                    caption: $filter('l')('DropsCounterBase'),
                    dataField: "drops_counter_base"
                },
                {
                    caption: $filter('l')('ActiveDropsCounter'),
                    dataField: "active_drops_counter"
                },
                {
                    caption: $filter('l')('Note'),
                    dataField: "note",
                    cellTemplate: function (element, info) {
                        element.append(info.value);
                    }
                }

            ],
            onInitialized: function (e) {
                ctrl.instanceGrid = e.component;
            },
            summary: {
                totalItems: [
                    {
                        column: "department",
                        summaryType: "count",
                        customizeText: function (data) {
                            var count = 0;
                            for (var i in ctrl.settings_department) {
                                if (ctrl.settings_department[i].hasReport) {
                                    count++;
                                }
                            }
                            return $filter('l')('Report') + ": (" + count + "/" + data.value + ").";
                        }
                    },
                    {
                        column: "total_nurse",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('TotalNurse_Technicians') + ": " + data.value;
                        }
                    },
                    {
                        column: "administrative_nursing",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('AdministrativeNursing_Technicians') + ": " + data.value;
                        }
                    },
                    {
                        column: "out_shift_nursing",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('OutShiftNursing_Technicians') + ": " + data.value;
                        }
                    },
                    {
                        column: "out_hospital_nursing",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('NursingOutHospital') + ": " + data.value;
                        }
                    },
                    {
                        column: "morning_shift",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('MorningShiftNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "afternoon_shift",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('AfternoonShiftNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "night_shift",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('NightShiftNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "over_shift",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('OverShiftNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "leave_shift",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('LeaveShiftNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "at_clinic",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('NursingAtClinic') + ": " + data.value;
                        }
                    },
                    {
                        column: "leave",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('LeaveNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "maternity_leave",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('MaternityLeaveNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "sick_leave",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('SickLeaveNursing') + ": " + data.value;
                        }
                    },
                    {
                        column: "go_school",
                        summaryType: "sum",
                        customizeText: function (data) {
                            return $filter('l')('NursingGoSchool') + ": " + data.value;
                        }
                    }
                ]
            }
        };
    }

}]);



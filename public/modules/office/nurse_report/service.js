myApp.registerFtr('nurse_report_service', ['fRoot', function (fRoot) {
    var obj = {};


    obj.statistic = function (date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/statistic",
            method: "POST",
            data: JSON.stringify({ date}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load = function (from_date, to_date, department, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/load",
            method: "POST",
            data: JSON.stringify({ from_date, to_date, department, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_nursing_report = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/load_nursing_report",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (from_date, to_date, department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/count",
            method: "POST",
            data: JSON.stringify({ from_date, to_date, department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.checkexist = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/checkexist",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function (total_nurse, administrative_nursing,
        out_shift_nursing, out_hospital_nursing,
        morning_shift, afternoon_shift, night_shift, over_shift, leave_shift, at_clinic,
        leave, maternity_leave, sick_leave, go_school,
        apprentice_nursing, probationary_nursing, other_case,
        real_bed, patient_number, level_1_care, final_phase_patient,
        ventilator_base, active_ventilator, monitor_base, active_monitor,
        electric_syringe_base, active_electric_syringe, drops_counter_base, active_drops_counter,
        note
    ) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/insert",
            method: "POST",
            data: JSON.stringify({
                total_nurse, administrative_nursing,
                out_shift_nursing, out_hospital_nursing,
                morning_shift, afternoon_shift, night_shift, over_shift, leave_shift, at_clinic,
                leave, maternity_leave, sick_leave, go_school,
                apprentice_nursing, probationary_nursing, other_case,
                real_bed, patient_number, level_1_care, final_phase_patient,
                ventilator_base, active_ventilator, monitor_base, active_monitor,
                electric_syringe_base, active_electric_syringe, drops_counter_base, active_drops_counter,
                note
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update = function (id,total_nurse, administrative_nursing,
        out_shift_nursing, out_hospital_nursing,
        morning_shift, afternoon_shift, night_shift, over_shift, leave_shift, at_clinic,
        leave, maternity_leave, sick_leave, go_school,
        apprentice_nursing, probationary_nursing, other_case,
        real_bed, patient_number, level_1_care, final_phase_patient,
        ventilator_base, active_ventilator, monitor_base, active_monitor,
        electric_syringe_base, active_electric_syringe, drops_counter_base, active_drops_counter,
        note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/update",
            method: "POST",
            data: JSON.stringify({
                id, total_nurse, administrative_nursing,
                out_shift_nursing, out_hospital_nursing,
                morning_shift, afternoon_shift, night_shift, over_shift, leave_shift, at_clinic,
                leave, maternity_leave, sick_leave, go_school,
                apprentice_nursing, probationary_nursing, other_case,
                real_bed, patient_number, level_1_care, final_phase_patient,
                ventilator_base, active_ventilator, monitor_base, active_monitor,
                electric_syringe_base, active_electric_syringe, drops_counter_base, active_drops_counter,
                note
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete_multi = function (idar) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/nurse_report/delete_multi",
            method: "POST",
            data: JSON.stringify({ idar }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadSetting = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/setting/load_module",
            method: "POST",
            data: JSON.stringify({ module :"nursing_report" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
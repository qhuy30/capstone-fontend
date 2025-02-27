
myApp.registerCtrl('task_statistic_controller', ['task_service', '$q', '$location', '$filter', '$rootScope', function (task_service, $q, $location, $filter, $rootScope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" },
        { name: "Task", action: "loadStatisticStatisticTaskCompleted" },
        { name: "Task", action: "countStatisticStatisticTaskCompleted" },
        { name: "Task", action: "loadStatisticStatisticTaskUncompleted" },
        { name: "Task", action: "countStatisticStatisticTaskUncompleted" },
        { name: "Task", action: "loadEmployeeNoTask" },
        { name: "Task", action: "countEmployeeNoTask" },
        { name: "Task", action: "export_uncompleted_tasks" },
        { name: "Task", action: "export_completed_tasks" },
    ];
    const TASK_RULE = {
        SHOW_EXTERNAL: 'Office.Task.Show_StatisticExternal',
    }

    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "task_statistic_controller";

        ctrl.statistic_project_project_count = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('Unfinished'),
                $filter('l')('Completed'),
            ],
            options: {
                cutoutPercentage: 70,
                responsive: true,
                legend: {
                    position: 'left',
                    display: true
                }
            },
            colors: ["#b3b2b2", "#00c851"]
        };

        ctrl.statistic_project_project_growth = {
            data: [],
            label: [],

            series: [$filter('l')('Created'), $filter('l')('Completed')],
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                stepSize: 1,
                                suggestedMax: 7
                            }
                        }
                    ]
                },
                responsive: true,
                // legend: {
                //     position: 'bottom',
                //     display: true
                // },

            },
            colors: ["#4285f4", "#00c851"]
        };


        ctrl.statistic_project_count = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('Unfinished'),
                $filter('l')('Completed'),
            ],
            options: {
                cutoutPercentage: 70,
                responsive: true,
                legend: {
                    position: 'left',
                    display: true
                }
            },
            colors: ["#b3b2b2", "#00c851"]
        };

        ctrl.statistic_project_growth = {
            data: [],
            label: [],

            series: [$filter('l')('Created'), $filter('l')('Completed')],
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                stepSize: 1,
                                suggestedMax: 7
                            }
                        }
                    ]
                },
                responsive: true,
                // legend: {
                //     position: 'bottom',
                //     display: true
                // },

            },
            colors: ["#4285f4", "#00c851"]
        };

        ctrl.statistic_department_count = {
            percent: 0,
            data: [],
            label: [
                $filter('l')('Unfinished'),

                $filter('l')('Completed'),
            ],
            options: {
                cutoutPercentage: 70,
                responsive: true,
                legend: {
                    position: 'left',
                    display: true
                }
            },
            colors: ["#b3b2b2", "#00c851"]
        };

        ctrl.statistic_department_growth = {
            data: [],
            label: [],

            series: [$filter('l')('Created'), $filter('l')('Completed')],
            options: {
                responsive: true,
                // legend: {
                //     position: 'bottom',
                //     display: true
                // },

            },
            colors: ["#4285f4", "#00c851"]
        };

        ctrl.allUsers = [];
        ctrl.departments = [];

        ctrl.currentPageStatisticTaskCompleted = 1;
        ctrl.numOfItemPerPageStatisticTaskCompleted = 15;
        ctrl.currentStatisticTaskCompletedPage = 1;
        ctrl.totalStatisticTaskCompleted = 0;
        ctrl.offsetStatisticTaskCompleted = 0;

        ctrl.currentPageStatisticTaskUncompleted = 1;
        ctrl.numOfItemPerPageStatisticTaskUncompleted = 15;
        ctrl.currentStatisticTaskUncompletedPage = 1;
        ctrl.totalStatisticTaskUncompleted = 0;
        ctrl.offsetStatisticTaskUncompleted = 0;

        ctrl.currentPageEmployeeNoTask = 1;
        ctrl.numOfItemPerPageEmployeeNoTask = 15;
        ctrl.currentEmployeeNoTaskPage = 1;
        ctrl.totalEmployeeNoTask = 0;
        ctrl.offsetEmployeeNoTask = 0;

        ctrl._filter_value_department_no_task = [];
        ctrl._filter_value_department = [];
        ctrl._filter_value_department_uncompleted = [];

        ctrl._permission = {};

        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    }


    function setValueFilter() {
        var today = new Date();
        ctrl._filterFromDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
        ctrl._filterToDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        ctrl._filterFromDateUnCompleted = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
        ctrl._filterToDateUnCompleted = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    }

    function generateFilter() {
        var obj = {};
        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
        }

        if (ctrl._filterToDateUnCompleted) {
            obj.to_date = angular.copy(ctrl._filterToDate.getTime());
        }

        if (ctrl._filterFromDateUnCompleted) {
            obj.from_date_uncompleted = angular.copy(ctrl._filterFromDateUnCompleted.getTime());
        }

        if (ctrl._filterToDateUnCompleted) {
            obj.to_date_uncompleted = angular.copy(ctrl._filterToDateUnCompleted.getTime());
        }

        if (ctrl._filter_value_employee) {
            obj.employee_filter = angular.copy(ctrl._filter_value_employee);
        }

        if (ctrl._filter_value_department) {
            obj.department_filter = angular.copy(ctrl._filter_value_department);
        }
        if (ctrl._filter_value_employee_uncompleted) {
            obj.employee_filter_uncompleted = angular.copy(ctrl._filter_value_employee_uncompleted);
        }

        if (ctrl._filter_value_department_uncompleted) {
            obj.department_filter_uncompleted = angular.copy(ctrl._filter_value_department_uncompleted);
        }
        if (ctrl._filter_value_employee_no_task) {
            obj.employee_filter_no_task = angular.copy(ctrl._filter_value_employee_no_task);
        }

        if (ctrl._filter_value_department_no_task) {
            obj.department_filter_no_task = angular.copy(ctrl._filter_value_department_no_task);
        }
        return obj;
    }

    function calculateNumberOfDays(from_date, to_date) {
        try {
            var myToDate = {};
            var today = new Date();
            var d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            if (to_date.getTime() > d.getTime()) {
                myToDate = d;
            } else {
                myToDate = to_date;
            }

            var difference = Math.abs(myToDate - from_date);
            var days = difference / (1000 * 3600 * 24);
            return {
                number_days: Math.round(days),
                myToDate
            }
        } catch (error) {
            console.log(error);
            return {
                number_days: 1,
                myToDate: new Date()
            }
        }
    }

    function NumberToStringForDate(input) {
        input = input + "";
        input = parseInt(input);
        if (input > 9) {
            return input + "";
        } else {
            return "0" + input;
        }
    }

    function generateDataForGrowth(data_created, data_completed) {
        try {
            var { number_days, myToDate } = calculateNumberOfDays(ctrl._filterFromDate, ctrl._filterToDate);
            var myFromDate = angular.copy(ctrl._filterFromDate);
            var type = 'date';
            var data = [
                [],
                []
            ];
            var labels = [];
            switch (type) {
                case "date":
                    while (myFromDate.getTime() < myToDate.getTime()) {
                        var thisLabel = myFromDate.getFullYear() + "/" + NumberToStringForDate((myFromDate.getMonth() + 1)) + "/" + NumberToStringForDate(myFromDate.getDate());
                        labels.push(NumberToStringForDate(myFromDate.getDate()) + "/" + NumberToStringForDate((myFromDate.getMonth() + 1)) + "/" + myFromDate.getFullYear());
                        var check = { created: true, completed: true };
                        for (var i in data_created) {
                            if (data_created[i]._id === thisLabel) {
                                data[0].push(data_created[i].count);
                                check.created = false;
                                break;
                            }
                        }

                        for (var i in data_completed) {
                            if (data_completed[i]._id === thisLabel) {
                                data[1].push(data_completed[i].count);
                                check.completed = false;
                                break;
                            }
                        }

                        if (check.created) {
                            data[0].push(0);
                        }
                        if (check.completed) {
                            data[1].push(0);
                        }

                        myFromDate.setDate(myFromDate.getDate() + 1);
                    }
                    break;
                case "month":
                    break;
            }
            return {
                data, labels
            }
        } catch (error) {
            console.log(error);
            return {
                data: [], labels: []
            };
        }

    }

    // filter department
    ctrl.load_departments_filter = function (params) {
        const dfd = $q.defer();
        task_service.load_deparment_filter(1).then(
            function (res) {
                dfd.resolve(res.data);
                dfd = undefined;
            },
            function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    };

    ctrl.pickDepartments = function (value) {
        if (JSON.stringify(ctrl._filter_value_department) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_department = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_department && ctrl._previous_filter_value_department.length > 0)) {
            ctrl.refreshDataCompleted();
        }
        ctrl._previous_filter_value_department = value;
    }

    ctrl.pickDepartmentsUncompleted = function (value) {
        if (JSON.stringify(ctrl._filter_value_department_uncompleted) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_department_uncompleted = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_department_uncompleted && ctrl._previous_filter_value_department_uncompleted.length > 0)) {
            ctrl.refreshDataUnCompleted();
        }
        ctrl._previous_filter_value_department_uncompleted = value;
    }

    ctrl.pickDepartmentsNoTask = function (value) {
        if (JSON.stringify(ctrl._filter_value_department_no_task) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_department_no_task = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_department_no_task && ctrl._previous_filter_value_department_no_task.length > 0)) {
            ctrl.refreshDataNoTask();
        }
        ctrl._previous_filter_value_department_no_task = value;
    }

    // filter employee
    ctrl.load_employee_filter = function ({ search, top, offset }) {
        const dfd = $q.defer();
        const department = $rootScope.logininfo.data.department;
        task_service.load_employee_filter(department, search, top, offset).then(
            function (res) {
                dfd.resolve(res.data.map((item) => Object.assign(item, { _id: item.username })));
            },
            function (e) {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    };

    // filter employee no task
    ctrl.load_employee_no_task_filter = function ({ search, top, offset }) {
        const dfd = $q.defer();
        const departments = ctrl._filter_value_department_no_task;
        task_service.load_employee_by_departments_filter(departments, search, top, offset).then(
            function (res) {
                dfd.resolve(res.data.map((item) => Object.assign(item, { _id: item.username })));
            },
            function (e) {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    };

    // filter employee task complete
    ctrl.load_employee_task_complete_filter = function ({ search, top, offset }) {
        const dfd = $q.defer();
        const departments = ctrl._filter_value_department;
        task_service.load_employee_by_departments_filter(departments, search, top, offset).then(
            function (res) {
                dfd.resolve(res.data.map((item) => Object.assign(item, { _id: item.username })));
            },
            function (e) {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    };

    // filter employee task uncomplete
    ctrl.load_employee_task_uncomplete_filter = function ({ search, top, offset }) {
        const dfd = $q.defer();
        const departments = ctrl._filter_value_department_uncompleted;
        task_service.load_employee_by_departments_filter(departments, search, top, offset).then(
            function (res) {
                dfd.resolve(res.data.map((item) => Object.assign(item, { _id: item.username })));
            },
            function (e) {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    };

    ctrl.pickEmployees = function (value) {
        if (JSON.stringify(ctrl._filter_value_employee) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_employee = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_employee && ctrl._previous_filter_value_employee.length > 0)) {
            ctrl.refreshDataCompleted();
        }
        ctrl._previous_filter_value_employee = value;
    };

    ctrl.pickEmployeesUncompleted = function (value) {
        if (JSON.stringify(ctrl._filter_value_employee_uncompleted) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_employee_uncompleted = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_employee_uncompleted && ctrl._previous_filter_value_employee_uncompleted.length > 0)) {
            ctrl.refreshDataUnCompleted();
        }
        ctrl._previous_filter_value_employee_uncompleted = value;
    };

    ctrl.pickEmployeesNoTask = function (value) {
        if (JSON.stringify(ctrl._filter_value_employee_no_task) === JSON.stringify(value)) {
            return;
        }
        ctrl._filter_value_employee_no_task = value;
        if (value.length > 0 || (value.length === 0 && ctrl._previous_filter_value_employee_no_task && ctrl._previous_filter_value_employee_no_task.length > 0)) {
            ctrl.refreshDataNoTask();
        }
        ctrl._previous_filter_value_employee_no_task = value;
    };

    // function statistic_project_project_count() {
    //     var _filter = generateFilter();
    //     task_service.statistic_project_all_project_count(_filter.from_date, _filter.to_date).then(function (res) {
    //         if (res.data.all > 0) {
    //             ctrl.statistic_project_project_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
    //         } else {
    //             ctrl.statistic_project_project_count.percent = 100;
    //         }
    //         ctrl.statistic_project_project_count.data = [];
    //         ctrl.statistic_project_project_count.label[0] = (res.data.notstart +res.data.process) +" " + $filter('l')('Unfinished');
    //         ctrl.statistic_project_project_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
    //         ctrl.statistic_project_project_count.data.push(res.data.notstart + res.data.process );
    //         ctrl.statistic_project_project_count.data.push(res.data.completed);
    //     }, function (err) { console.log(err) });

    // }

    // function statistic_project_project_growth() {
    //     var _filter = generateFilter();
    //     task_service.statistic_project_all_project_growth(_filter.from_date, _filter.to_date).then(function (res) {
    //         var generate = generateDataForGrowth(res.data.created, res.data.completed);
    //         ctrl.statistic_project_project_growth.data = generate.data;
    //         ctrl.statistic_project_project_growth.label = generate.labels;

    //     }, function (err) { console.log(err) });

    // }

    // function statistic_project_count() {
    //     var _filter = generateFilter();
    //     task_service.statistic_all_project_count(_filter.from_date, _filter.to_date).then(function (res) {
    //         if (res.data.all > 0) {
    //             ctrl.statistic_project_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
    //         } else {
    //             ctrl.statistic_project_count.percent = 100;
    //         }
    //         ctrl.statistic_project_count.data = [];
    //         ctrl.statistic_project_count.label[0] = (res.data.notstart +res.data.process+res.data.done) +" " + $filter('l')('Unfinished');
    //         ctrl.statistic_project_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
    //         ctrl.statistic_project_count.data.push(res.data.notstart + res.data.process + res.data.done);
    //         ctrl.statistic_project_count.data.push(res.data.completed);
    //     }, function (err) { console.log(err) });

    // }

    // function statistic_project_growth() {
    //     var _filter = generateFilter();
    //     task_service.statistic_all_project_growth(_filter.from_date, _filter.to_date).then(function (res) {
    //         var generate = generateDataForGrowth(res.data.created, res.data.completed);
    //         ctrl.statistic_project_growth.data = generate.data;
    //         ctrl.statistic_project_growth.label = generate.labels;

    //     }, function (err) { console.log(err) });

    // }

    // function statistic_department_count() {
    //     var _filter = generateFilter();
    //     task_service.statistic_all_department_count(_filter.from_date, _filter.to_date).then(function (res) {
    //         if (res.data.all > 0) {
    //             ctrl.statistic_department_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
    //         } else {
    //             ctrl.statistic_department_count.percent = 100;
    //         }
    //         ctrl.statistic_department_count.data = [];
    //         ctrl.statistic_department_count.label[0] = (res.data.notstart +res.data.process+res.data.done) +" " + $filter('l')('Unfinished');
    //         ctrl.statistic_department_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
    //         ctrl.statistic_department_count.data.push(res.data.notstart + res.data.process + res.data.done);
    //         ctrl.statistic_department_count.data.push(res.data.completed);
    //     }, function (err) { console.log(err) });

    // }

    // function statistic_department_growth() {
    //     var _filter = generateFilter();
    //     task_service.statistic_all_department_growth(_filter.from_date, _filter.to_date).then(function (res) {
    //         var generate = generateDataForGrowth(res.data.created, res.data.completed);
    //         ctrl.statistic_department_growth.data = generate.data;
    //         ctrl.statistic_department_growth.label = generate.labels;

    //     }, function (err) { console.log(err) });

    // }

    function load_statistic_task_completed_service() {
        var dfd = $q.defer();
        ctrl.statisticTasksCompleted = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter : [$rootScope.logininfo.data.department];
        task_service
            .load_statistic_task_completed(
                _filter.search,
                _filter.from_date,
                _filter.to_date,
                ctrl.numOfItemPerPageStatisticTaskCompleted,
                ctrl.offsetStatisticTaskCompleted,
                _filter.employee_filter,
                departments,
            )
            .then(
                function (res) {
                    ctrl.statisticTasksCompleted = res.data
                    ctrl.statisticTasksCompleted.forEach(function (item) {
                        if (item.labelTitles && item.labelTitles.length > 0) {
                            //abbreviation
                            if (item.labelTitles[0].abbreviation) {
                                item.abbreviation = item.labelTitles[0].abbreviation
                            } else {
                                item.abbreviation =
                                    item.labelTitles.length > 0 ? item.labelTitles[0].title.charAt(0) : "";
                            }
                            //Color
                            if (item.labelTitles[0].color) {
                                item.color = item.labelTitles[0].color
                            } else {
                                item.color = "";
                            }
                        } else {
                            item.abbreviation = "";
                        }
                        if (item.date_completed) {
                            const [year, month, day] = item.date_completed.split("/");
                            item.date_completed = `${day}/${month}/${year}`;
                        }
                    });
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.load_statistic_task_completed = function (val) {
        if (val != undefined) {
            ctrl.offsetStatisticTaskCompleted = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadStatisticStatisticTaskCompleted",
            load_statistic_task_completed_service,
        );
    };

    function count_statistic_task_completed_service() {
        var dfd = $q.defer();
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter : [$rootScope.logininfo.data.department];
        task_service
            .count_statistic_task_completed(
                _filter.from_date,
                _filter.to_date,
                _filter.employee_filter,
                departments,
            )
            .then(
                function (res) {
                    if (res.data.count > 0) {
                        ctrl.totalStatisticTaskCompleted = res.data.count
                    }
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.count_statistic_task_completed = function (val) {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "countStatisticStatisticTaskCompleted",
            count_statistic_task_completed_service,
        );
    };

    function load_statistic_task_uncompleted_service() {
        var dfd = $q.defer();
        ctrl.statisticTasksUncompleted = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter_uncompleted : [$rootScope.logininfo.data.department];
        task_service
            .load_statistic_task_uncompleted(
                _filter.from_date_uncompleted,
                _filter.to_date_uncompleted,
                ctrl.numOfItemPerPageStatisticTaskUncompleted,
                ctrl.offsetStatisticTaskUncompleted,
                _filter.employee_filter_uncompleted,
                departments,
            )
            .then(
                function (res) {
                    ctrl.statisticTasksUncompleted = res.data;
                    ctrl.statisticTasksUncompleted.forEach(function (item) {
                        if (item.labelTitles && item.labelTitles.length > 0) {
                            //abbreviation
                            if (item.labelTitles[0].abbreviation) {
                                item.abbreviation = item.labelTitles[0].abbreviation
                            } else {
                                item.abbreviation =
                                    item.labelTitles.length > 0 ? item.labelTitles[0].title.charAt(0) : "";
                            }
                            //Color
                            if (item.labelTitles[0].color) {
                                item.color = item.labelTitles[0].color
                            } else {
                                item.color = "";
                            }
                        } else {
                            item.abbreviation = "";
                        }
                    });
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.load_statistic_task_uncompleted = function (val) {
        if (val != undefined) {
            ctrl.offsetStatisticTaskUncompleted = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadStatisticStatisticTaskUncompleted",
            load_statistic_task_uncompleted_service,
        );
    };

    function count_statistic_task_uncompleted_service() {
        var dfd = $q.defer();
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter_uncompleted : [$rootScope.logininfo.data.department];
        task_service
            .count_statistic_task_uncompleted(
                _filter.from_date_uncompleted,
                _filter.to_date_uncompleted,
                _filter.employee_filter_uncompleted,
                departments,
            )
            .then(
                function (res) {
                    if (res.data.count > 0) {
                        ctrl.totalStatisticTaskUncompleted = res.data.count
                    }
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.count_statistic_task_uncompleted = function (val) {
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "countStatisticStatisticTaskUncompleted",
            count_statistic_task_uncompleted_service,
        );
    };

    //EMPLOYEES NO TASK
    function load_employee_no_task_service() {
        var dfd = $q.defer();
        ctrl.employeeNoTask = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter_no_task : [$rootScope.logininfo.data.department];
        task_service
            .loadAllUserNoTask(
                ctrl.numOfItemPerPageEmployeeNoTask,
                ctrl.offsetEmployeeNoTask,
                _filter.employee_filter_no_task,
                departments,
            )
            .then(
                function (res) {
                    ctrl.employeeNoTask = res.data;
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.load_employee_no_task = function (val) {
        if (val != undefined) {
            ctrl.offsetEmployeeNoTask = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadEmployeeNoTask",
            load_employee_no_task_service,
        );
    };

    function count_employee_no_task_service() {
        var dfd = $q.defer();
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        const departments = ctrl._permission.show_all_department ? _filter.department_filter_no_task : [$rootScope.logininfo.data.department];
        task_service
            .countAllUserNoTask(
                ctrl.numOfItemPerPageEmployeeNoTask,
                ctrl.offsetEmployeeNoTask,
                _filter.employee_filter_no_task,
                departments,
            )
            .then(
                function (res) {
                    if (res.data.count > 0) {
                        ctrl.totalEmployeeNoTask = res.data.count;
                    }
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );

        return dfd.promise;
    }

    ctrl.count_employee_no_task = function (val) {
        if (val != undefined) {
            ctrl.offsetEmployeeNoTask = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "countEmployeeNoTask",
            count_employee_no_task_service,
        );
    };

    function getPermission(){
        // const rules = $rootScope.logininfo.data;
        return {
            show_all_department: $filter('hasRule')(TASK_RULE.SHOW_EXTERNAL),
        }
    }
    //*EXPORT FILE */


    ctrl.export_completed_tasks = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName,'Task', 'export_completed_tasks', export_completed_tasks_service);
    }

    function export_completed_tasks_service(){
        const dfd = $q.defer();
        const _filter = generateFilter();
        task_service.export_completed_tasks(
            _filter.from_date,
            _filter.to_date,
            _filter.employee_filter,
            _filter.department_filter,
        )
            .then(function (res) {
                const file_name = `${$filter('l')('Task')}_${$filter('showDate')(_filter.from_date)}_to_${$filter('showDate')(_filter.to_date)}`;
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file_name}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.export_uncompleted_tasks = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName,'Task', 'export_uncompleted_tasks', export_uncompleted_tasks_service);
    }

    function export_uncompleted_tasks_service(){
        const dfd = $q.defer();
        const _filter = generateFilter();
        task_service.export_uncompleted_tasks(
            _filter.from_date,
            _filter.to_date,
            _filter.employee_filter_uncompleted,
            _filter.department_filter_uncompleted,
        )
            .then(function (res) {
                const file_name = `${$filter('l')('Task')}_${$filter('showDate')(_filter.from_date)}_to_${$filter('showDate')(_filter.to_date)}`;
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file_name}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    function init() {
        ctrl._permission = getPermission();
        if(!ctrl._permission.show_all_department){
            ctrl._filter_value_department_uncompleted = [$rootScope.logininfo.data.department];
            ctrl._filter_value_department = [$rootScope.logininfo.data.department];
            ctrl._filter_value_department_no_task = [$rootScope.logininfo.data.department];

        }
        setValueFilter();
        ctrl.load_employee_no_task();
        ctrl.count_employee_no_task();
        ctrl.count_statistic_task_completed();
        ctrl.load_statistic_task_completed();
        ctrl.count_statistic_task_uncompleted();
        ctrl.load_statistic_task_uncompleted();
        // statistic_project_count();
        // statistic_project_growth();
        // statistic_department_count();
        // statistic_department_growth();
        // statistic_project_project_count();
        // statistic_project_project_growth();
    }

    init();

    ctrl.export_completed_tasks = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, 'Task', 'export_completed_tasks', export_completed_tasks_service);
    }

    function export_completed_tasks_service() {
        const dfd = $q.defer();
        const _filter = generateFilter();
        task_service.export_completed_tasks(
            _filter.from_date,
            _filter.to_date,
            _filter.employee_filter,
            _filter.department_filter,
        )
            .then(function (res) {
                const file_name = `${$filter('l')('Task')}_${$filter('showDate')(_filter.from_date)}_to_${$filter('showDate')(_filter.to_date)}`;
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file_name}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    //EMPLOYEES NO TASK
    function load_employee_no_task_service() {
        var dfd = $q.defer();
        ctrl.employeeNoTask = [];
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        task_service
            .loadAllUserNoTask(
                ctrl.numOfItemPerPageEmployeeNoTask,
                ctrl.offsetEmployeeNoTask,
                _filter.employee_filter_no_task,
                _filter.department_filter_no_task,
            )
            .then(
                function (res) {
                    ctrl.employeeNoTask = res.data;                                         
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );
        
        return dfd.promise;
    }

    ctrl.load_employee_no_task = function (val) {
        if (val != undefined) {
            ctrl.offsetEmployeeNoTask = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "loadEmployeeNoTask",
            load_employee_no_task_service,
        );
    };

    function count_employee_no_task_service() {
        var dfd = $q.defer();
        ctrl.checkIdAr = [];
        let _filter = generateFilter();
        task_service
            .countAllUserNoTask(
                ctrl.numOfItemPerPageEmployeeNoTask,
                ctrl.offsetEmployeeNoTask,
                _filter.employee_filter_no_task,
                _filter.department_filter_no_task,
            )
            .then(
                function (res) {
                    if(res.data.count > 0) {
                        ctrl.totalEmployeeNoTask = res.data.count;                                         
                    }
                    dfd.resolve(true);
                },
                function (e) {
                    dfd.reject(false);
                    err = undefined;
                },
            );
        
        return dfd.promise;
    }

    ctrl.count_employee_no_task = function (val) {
        if (val != undefined) {
            ctrl.offsetEmployeeNoTask = angular.copy(val);
        }
        return $rootScope.statusValue.execute(
            ctrl._ctrlName,
            "Task",
            "countEmployeeNoTask",
            count_employee_no_task_service,
        );
    };

    ctrl.refreshDataCompleted = function () {
        ctrl.count_statistic_task_completed();
        ctrl.load_statistic_task_completed();
        // statistic_project_count();
        // statistic_project_growth();
        // statistic_department_count();
        // statistic_department_growth();
        // statistic_project_project_count();
        // statistic_project_project_growth();
    }
    ctrl.refreshDataUnCompleted = function () {
        ctrl.count_statistic_task_uncompleted();
        ctrl.load_statistic_task_uncompleted();
    }
    ctrl.refreshDataNoTask = function () {
        ctrl.load_employee_no_task();
        ctrl.count_employee_no_task();
    }
}]);
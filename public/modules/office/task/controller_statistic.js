
myApp.registerCtrl('task_statistic_controller', ['task_service', '$q', '$location', '$filter', function (task_service, $q, $location, $filter) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Task", action: "init" }

    ];

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
            colors: ["#b3b2b2",  "#00c851"]
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
            colors: ["#b3b2b2",  "#00c851"]
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
            colors: ["#b3b2b2",  "#00c851"]
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
    }


    function setValueFilter() {
        var today = new Date();
        if (today.getDate() < 10) {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        } else {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        }

        ctrl._filterToDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    }

    function generateFilter() {
        var obj = {};
        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
        }

        if (ctrl._filterToDate) {
            obj.to_date = angular.copy(ctrl._filterToDate.getTime());
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

    function statistic_project_project_count() {
        var _filter = generateFilter();
        task_service.statistic_project_all_project_count(_filter.from_date, _filter.to_date).then(function (res) {
            if (res.data.all > 0) {
                ctrl.statistic_project_project_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_project_project_count.percent = 100;
            }
            ctrl.statistic_project_project_count.data = [];
            ctrl.statistic_project_project_count.label[0] = (res.data.notstart +res.data.process) +" " + $filter('l')('Unfinished');
            ctrl.statistic_project_project_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
            ctrl.statistic_project_project_count.data.push(res.data.notstart + res.data.process );
            ctrl.statistic_project_project_count.data.push(res.data.completed);
        }, function (err) { console.log(err) });

    }

    function statistic_project_project_growth() {
        var _filter = generateFilter();
        task_service.statistic_project_all_project_growth(_filter.from_date, _filter.to_date).then(function (res) {
            var generate = generateDataForGrowth(res.data.created, res.data.completed);
            ctrl.statistic_project_project_growth.data = generate.data;
            ctrl.statistic_project_project_growth.label = generate.labels;

        }, function (err) { console.log(err) });

    }

    function statistic_project_count() {
        var _filter = generateFilter();
        task_service.statistic_all_project_count(_filter.from_date, _filter.to_date).then(function (res) {
            if (res.data.all > 0) {
                ctrl.statistic_project_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_project_count.percent = 100;
            }
            ctrl.statistic_project_count.data = [];
            ctrl.statistic_project_count.label[0] = (res.data.notstart +res.data.process+res.data.done) +" " + $filter('l')('Unfinished');
            ctrl.statistic_project_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
            ctrl.statistic_project_count.data.push(res.data.notstart + res.data.process + res.data.done);
            ctrl.statistic_project_count.data.push(res.data.completed);
        }, function (err) { console.log(err) });

    }

    function statistic_project_growth() {
        var _filter = generateFilter();
        task_service.statistic_all_project_growth(_filter.from_date, _filter.to_date).then(function (res) {
            var generate = generateDataForGrowth(res.data.created, res.data.completed);
            ctrl.statistic_project_growth.data = generate.data;
            ctrl.statistic_project_growth.label = generate.labels;

        }, function (err) { console.log(err) });

    }

    function statistic_department_count() {
        var _filter = generateFilter();
        task_service.statistic_all_department_count(_filter.from_date, _filter.to_date).then(function (res) {
            if (res.data.all > 0) {
                ctrl.statistic_department_count.percent = Math.round((res.data.completed / res.data.all) * 100 * 10) / 10;
            } else {
                ctrl.statistic_department_count.percent = 100;
            }
            ctrl.statistic_department_count.data = [];
            ctrl.statistic_department_count.label[0] = (res.data.notstart +res.data.process+res.data.done) +" " + $filter('l')('Unfinished');
            ctrl.statistic_department_count.label[1] = res.data.completed + " " + $filter('l')('Completed');
            ctrl.statistic_department_count.data.push(res.data.notstart + res.data.process + res.data.done);
            ctrl.statistic_department_count.data.push(res.data.completed);
        }, function (err) { console.log(err) });

    }

    function statistic_department_growth() {
        var _filter = generateFilter();
        task_service.statistic_all_department_growth(_filter.from_date, _filter.to_date).then(function (res) {
            var generate = generateDataForGrowth(res.data.created, res.data.completed);
            ctrl.statistic_department_growth.data = generate.data;
            ctrl.statistic_department_growth.label = generate.labels;

        }, function (err) { console.log(err) });

    }

    function init() {
        setValueFilter();
        statistic_project_count();
        statistic_project_growth();
        statistic_department_count();
        statistic_department_growth();
        statistic_project_project_count();
        statistic_project_project_growth();
    }

    init();

    ctrl.refreshData = function () {
        statistic_project_count();
        statistic_project_growth();
        statistic_department_count();
        statistic_department_growth();
        statistic_project_project_count();
        statistic_project_project_growth();
    }
}]);
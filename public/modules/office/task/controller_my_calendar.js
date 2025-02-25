myApp.registerCtrl('quick_handle_my_callendar_controller',
    ['$q', '$rootScope', '$filter', 'languageValue', 'my_calendar_service',
        function ($q, $rootScope, $filter, $languageValue, my_calendar_service) {

            const _statusValueSet = [
                
                { name: "MyCalendar", action: "load" },
            ];

            var ctrl = this;
            /** init variable */
            {
                ctrl._notyetInit= true;
                ctrl.$languageValue = $languageValue;
                ctrl.weekDays = [];
                ctrl.day_events = [];

                ctrl.show_checkbox_car = true;
                ctrl.show_checkbox_room = true;
                ctrl.show_checkbox_event_calendar = true;
                
                ctrl.checkbox_car = true;
                ctrl.checkbox_room = true;
                ctrl.checkbox_event_calendar = true;

                ctrl.color = {
                    car: {
                        bg: '#3295b4',
                        hover: 'rgb(128 165 180)'
                    },
                    room: {
                        bg: '#3d4aca',
                        hover: 'rgb(183 190 250)'
                    },
                    event_calendar: {
                        bg: '#0C5776',
                        hover: 'rgb(128 165 180)'
                    },
                }

                ctrl.legendItems = [
                    {
                        key: 'car',
                        label: 'Car',
                        color: ctrl.color.car.bg,
                        check: true,
                    },
                    {
                        key:'room',
                        label: 'Room',
                        color: ctrl.color.room.bg,
                        check: true,
                    },
                    {
                        key:'event_calendar',
                        label: 'EventCalendar',
                        color: ctrl.color.event_calendar.bg,
                        check: true,
                    },
                ]

                ctrl._myCalendar = {
                    car: [],
                    room: [],
                    event_calendar: [],
                };

                ctrl._calendar_hide = {
                    room: [],
                    car: [],
                }

                ctrl._myCalendar_show = [];

                $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet, 'doing');
                
            }

            function calculateDays(startDate, endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
            
                const timeDifference = end - start;
                const dayDifference = timeDifference / (1000 * 3600 * 24);
            
                return dayDifference + 1; // Cộng thêm 1 để bao gồm cả ngày đầu và ngày cuối
            }
            
            function getMonday(){
                let currentDate = new Date();
                let dayOfWeek = currentDate.getDay(); 
                let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
                return new Date(currentDate.setDate(currentDate.getDate() - diff));
            }

            ctrl.generateWeekDays = function () {
                const days = [];
                let currentDate = getMonday();
                let numDateShow = 7;
                if(ctrl.weekDays!==undefined && ctrl.weekDays.length> 1){
                    const start = new Date(ctrl.weekDays[0].date);
                    const end = new Date(ctrl.weekDays[ctrl.weekDays.length - 1].date);
                    numDateShow = calculateDays(start,end);
                    currentDate = start;
                }
                //get monday
                const dayKeyMap = {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday'
                };
        
                for (let i = 0; i < numDateShow; i++) {
                    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
                    const dayKey = dayKeyMap[dayOfWeek];
                    days.push({
                        date: new Date(currentDate),
                        dayKey: dayKey,
                        day: currentDate.getDate(),
                        fullDate: currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return days;
            };

            ctrl.refresh_calendar = function(){
                ctrl.weekDays = ctrl.generateWeekDays();
                ctrl.load_my_calendar();
            }
  
            function isSameDay(timestamp1, timestamp2) {
                const date1 = new Date(timestamp1);
                const date2 = new Date(timestamp2);
            
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate();
            }

            //My calendar
            ctrl.load_my_calendar = function(params){
                return $rootScope.statusValue.execute(ctrl._ctrlName, "MyCalendar", "load", load_my_calendar_service);
            }

            function filterEventForDay(){
                ctrl.day_events = [];
               
                ctrl.weekDays.forEach(day => {

                    const events = ctrl._myCalendar_show
                        .filter(calendar => isSameDay(calendar.start_date*1, day.date))
                        .sort((a, b) => a.start_date -  b.start_date)

                    ctrl.day_events.push({
                        day: day,
                        events: events,
                    })
                });
                    

            }

            function formatTimestampToDate(timestamp) {
                // Tạo đối tượng Date từ timestamp
                const date = new Date(timestamp);
            
                // Lấy ngày, tháng, năm
                const day = String(date.getDate()).padStart(2, '0'); // Thêm '0' nếu số nhỏ hơn 10
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                const year = date.getFullYear();
            
                // Trả về chuỗi định dạng dd/mm/yyyy
                return `${day}/${month}/${year}`;
            }

            function load_my_calendar_service(){
                const dfd = $q.defer();
                const dfdAr = [];
                const checkCar = ctrl.legendItems.find(item => item.key === 'car').check || false;
                const checkRoom = ctrl.legendItems.find(item => item.key === 'room').check || false;
                const checkEvent = ctrl.legendItems.find(item => item.key === 'event_calendar').check || false;
                ctrl._myCalendar = {
                    car: [],
                    room: [],
                    event_calendar: [],
                };
                ctrl._calendar_hide = {
                    car: [],
                    room: [],
                }

                if(checkCar){
                    dfdAr.push(load_my_calendar_car());
                }

                if(checkRoom){
                    dfdAr.push(load_my_calendar_room());
                }

                if(checkEvent){
                    dfdAr.push(load_my_calendar_event_calendar())
                }

                $q.all(dfdAr).then(function(){
                    ctrl._myCalendar.car = ctrl._myCalendar.car.filter(item => !ctrl._calendar_hide.car.includes(item._id));
                    ctrl._myCalendar.room = ctrl._myCalendar.room.filter(item => !ctrl._calendar_hide.room.includes(item._id));
                    ctrl._myCalendar_show = [...ctrl._myCalendar.car, ...ctrl._myCalendar.room, ...ctrl._myCalendar.event_calendar]
                    filterEventForDay();
                    dfd.resolve(true)
                }, function(err){
                    dfd.reject(err);
                })

                return dfd.promise;
            }

            function load_my_calendar_car(){
                const dfd = $q.defer();
                const check = ['my_calendar'];
                const from_date = ctrl.weekDays[0].date.getTime();
                const to_date = ctrl.weekDays[ctrl.weekDays.length - 1].date.getTime();
                my_calendar_service.load_car(check, from_date, to_date).then(function(res){
                    res.data = res.data.map(item => {
                        const startTime = new Date(item.time_to_go).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const endTime = new Date(item.pick_up_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        return {
                            ...item,
                            start_date: item.time_to_go,
                            end_date: item.pick_up_time,
                            time_test: formatTimestampToDate(item.time_to_go * 1),
                            startTime: startTime,
                            endTime: endTime,
                        }
                    });
                    ctrl._myCalendar.car = res.data;
                    dfd.resolve(res.data);
                }, function(err){
                    dfd.reject(err);
                })

                return dfd.promise;
            }

            function load_my_calendar_room(){
                const dfd = $q.defer();
                const check = ['MyCalendar', 'Host', 'Participants'];
                const from_date = ctrl.weekDays[0].date.getTime();
                const to_date = ctrl.weekDays[ctrl.weekDays.length - 1].date.getTime();
                my_calendar_service.load_room(check, from_date, to_date).then(function(res){
                    res.data = res.data.map(item => {
                        const startTime = new Date(item.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const endTime = new Date(item.date_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        return {
                            ...item,
                            start_date: item.date_start,
                            end_date: item.date_end,
                            time_test: formatTimestampToDate(item.date_start * 1),
                            startTime: startTime,
                            endTime: endTime,
                        }
                    });
                    ctrl._myCalendar.room = res.data;
                    dfd.resolve(res.data);
                }, function(err){
                    dfd.reject(err);
                })

                return dfd.promise;
            }

            function load_my_calendar_event_calendar(){
                const dfd = $q.defer();
                const check = ['PersonallyInvolved'];
                const from_date = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
                const to_date = $filter('convertToStartOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();
                my_calendar_service.load_event_calendar(check, from_date, to_date).then(function(res){
                    res.data = res.data.map(item => {
                        const startTime = new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        const endTime = new Date(item.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        return {
                            ...item,
                            start_date: item.start_date,
                            end_date: item.end_date,
                            time_test: formatTimestampToDate(item.start_date * 1),
                            startTime: startTime,
                            endTime: endTime,
                        }
                    });
                    ctrl._myCalendar.event_calendar = res.data;
                    ctrl._calendar_hide.room = ctrl._myCalendar.event_calendar.map(item => item.room_booking_id).filter(item => item);
                    ctrl._calendar_hide.car = ctrl._myCalendar.event_calendar.map(item => item.vehical_booking_id).filter(item => item);
                    dfd.resolve(res.data);
                }, function(err){
                    dfd.reject(err);
                })

                return dfd.promise;
            }

            function init() {
                ctrl.weekDays = ctrl.generateWeekDays();
                const dfdAr = [];
                dfdAr.push(ctrl.load_my_calendar());
                $q.all(dfdAr).then(function(){
                    ctrl._notyetInit = false;
                }, function(err){
                    
                })
            }
            init();
}]);


myApp.controller('aside_controller', ['aside_service', '$q', '$rootScope', 'socket', '$timeout', function (aside_service, $q, $rootScope, socket, $timeout) {
    /**declare variable */
    const _statusValueSet = [
        { name: "User", action: "load_for_add_friend" },
        { name: "Request", action: "load_request_sent" },
        { name: "Request", action: "load_receive_request" },
        { name: "Room", action: "load" },
        { name: "Room", action: "push_show" },
        { name: "Room", action: "pull_show" },
        { name: "Room", action: "get_room" },
        { name: "Room", action: "get_typing" },
        { name: "Mes", action: "load_not_seen" },
        { name: "Mes", action: "insert" },
        { name: "Request", action: "insert" },
        { name: "Request", action: "delete" },
        { name: "Request", action: "accept" },
        { name: "Request", action: "decline" },
        { name: "AddFriend", action: "load" }

    ];
    var ctrl = this;

    {
        ctrl.limitLoad =100;
        ctrl._ctrlName = "aside_controller";
        ctrl.countAr = [];
        ctrl.search = "";
        ctrl.message = "";
        ctrl.canLoadMore=false;
        ctrl.typing = false;
        ctrl.searchFriend = "";
        ctrl.add_friend = [];
        ctrl.user_for_add_friend = [];
        ctrl.request_sent = [];
        ctrl.receive_request = [];
        ctrl.current_room = {};
        ctrl.room_list = [];
        ctrl.offsetMessage = 0;
        ctrl.message_on_room = [];
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
        ctrl._urlAddRequestFriend = FrontendDomain + "/component/request_add_friend_modal.html";
        ctrl._urlReceiveRequestFriend = FrontendDomain + "/component/receive_add_friend_modal.html";

    }

    function refactor_mes(val) {
        var result = [];
        for (var i in val) {
            if (result.length == 0) {
                result.push(val[i]);
                result[result.length - 1].mes = [val[i].message];
            } else {
                if (result[result.length - 1].username === val[i].username) {
                    result[result.length - 1].mes.push(val[i].message);
                } else {
                    result.push(val[i]);
                    result[result.length - 1].mes = [val[i].message];
                }
            }

        }
        return result;
    }

    {
        $timeout(function () {
            socket.on('updateFriendList', function (data) {
                load_add_friend();
            });
            socket.on('updateFriendMessage', function (data) {
                if (data.room == ctrl.current_room._id) {
                    aside_service.load_message_on_room(ctrl.current_room._id, ctrl.offsetMessage).then(function (data) {
                        ctrl.message_on_room = data.data;
                        if(data.data.length==ctrl.limitLoad){
                            ctrl.offsetMessage=ctrl.limitLoad;
                        }else{
                            ctrl.offsetMessage=0;
                        }
                        ctrl.message_on_room = refactor_mes(ctrl.message_on_room);
                        var container = $("#chat-box-content-body-box-friend");
                        var scrollTo = $("#chat-box-content-body-box-friend__bottom");
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                        }, 200);
                    }, function (err) {
                        console.log(err);
                    });
                }
                if ($("#aside-menu").hasClass("show-chat-box")) {
                    get_room_private();
                }

            });
            socket.on('typingFriendRoom', function (data) {
                if (ctrl.current_room._id === data.room) {
                    ctrl.typing = data.value;
                }
            });
        }, 100);
    }

    ctrl.openAddRequestFriend_Modal = function () {
        load_request_sent();
        ctrl.search = "";
    }



    ctrl.load_for_add_friend = function () {
        if (ctrl.search !== "" && ctrl.search !== undefined && ctrl.search !== null) {
            aside_service.load_for_add_friend(ctrl.search).then(function (data) {
                ctrl.user_for_add_friend = data.data;
            }, function (err) {

            });
        } else {
            ctrl.user_for_add_friend = [];
        }
    }

    function load_add_friend() {

        aside_service.load_add_friend(ctrl.searchFriend !== ""
            && ctrl.searchFriend !== undefined
            ? ctrl.searchFriend : undefined, 5000, 0).then(function (data) {
                ctrl.add_friend = data.data;

            }, function (err) {

            });
    }

    function load_request_sent() {
        aside_service.load_request_sent().then(function (data) {
            ctrl.request_sent = data.data;
        }, function (err) {

        });
    }
    function load_receive_request() {
        aside_service.load_receive_request().then(function (data) {
            ctrl.receive_request = data.data;
        }, function (err) {

        });
    }


    function setDemensionForModal() {
        ctrl.modalStyle = {
            "overflow-y": "auto",
            "max-height": window.innerHeight - 200
        }

    }

    function get_room_private() {
        var dfd = $q.defer();

        aside_service.get_room_private().then(function (data) {
            ctrl.room_list = data.data;
            if (ctrl.room_list.length === 0) {
                ctrl.message_on_room = [];
                ctrl.current_room = {};
            }
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.load_mes_not_seen = function (params) {
        aside_service.load_message_not_seen(params.room);
    }

    function init() {
        setDemensionForModal();
        load_request_sent();
        load_receive_request();
        load_add_friend();
        get_room_private();
    }


    init();

    ctrl.insert = function (friend) {
        aside_service.insert(friend).then(function (params) {
            load_request_sent();
            ctrl.load_for_add_friend();
        }, function (params) {

        });
    }

    ctrl.delete = function (id) {
        aside_service.delete(id).then(function (params) {
            load_request_sent();
            ctrl.load_for_add_friend();
        }, function (params) {

        });
    }

    ctrl.accept = function (id) {
        aside_service.accept(id).then(function (params) {
            load_request_sent();
            load_receive_request();
            load_add_friend();
        }, function (params) {

        });
    }

    ctrl.decline = function (id) {
        aside_service.decline(id).then(function (params) {
            load_request_sent();
            load_receive_request();
        }, function (params) {

        });
    }

    function push_show(room) {
        let dfd = $q.defer();
        aside_service.push_show_to_room(room).then(function () {
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.pull_show = function (room) {
        let dfd = $q.defer();

        aside_service.pull_show_to_room(room._id).then(function () {

            get_room_private().then(function () {
                if (ctrl.room_list[0]) {
                    ctrl.chooseRoom(ctrl.room_list[0]);
                }
            }, function (err) {
                console.log(err);
            });
            dfd.resolve(true);
        }, function (err) {
            dfd.reject(err);
        });
        return dfd.promise;
    }

    ctrl.send_message = function () {
        let dfd = $q.defer();
        if (ctrl.message
            && ctrl.message !== ""
            && ctrl.message !== null) {
            let room = ctrl.current_room._id;

            let mes = ctrl.message;
            aside_service.insert_message_to_friend_room(room, mes).then(function () {
                ctrl.message = "";
                ctrl.offsetMessage = 0;
                $("#chat-box-content-body__message").focus();
                aside_service.load_message_on_room(room, ctrl.offsetMessage).then(function (data) {
                    ctrl.message_on_room = data.data;
                    if(data.data.length==ctrl.limitLoad){
                        ctrl.offsetMessage=ctrl.limitLoad;
                    }else{
                        ctrl.offsetMessage=0;
                    }
                    ctrl.message_on_room = refactor_mes(ctrl.message_on_room);
                    var container = $("#chat-box-content-body-box-friend");
                    var scrollTo = $("#chat-box-content-body-box-friend__bottom");
                    container.animate({
                        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                    }, 200);
                }, function (err) {
                    console.log(err);
                });
                dfd.resolve(true);
            }, function (err) {
                dfd.reject(err);
            });
        } else {
            dfd.resolve(true);
        }

        return dfd.promise;
    }


    ctrl.chooseRoom = function (room) {

        ctrl.current_room = room;
        ctrl.offsetMessage=0;
        ctrl.offsetMessage = 0;
        $("#chat-box-content-body__message").focus();
        aside_service.get_typing(room._id).then(function name(data) {
            var check = false;
            for (var i in data.data) {
                if (data.data[i] !== $rootScope.logininfo.username) {
                    check = true;
                    break;
                }
            }
            ctrl.typing = check;
        }, function () {
            ctrl.typing = false;
        });
        aside_service.load_message_on_room(room._id, ctrl.offsetMessage).then(function (data) {
            ctrl.message_on_room = data.data;
            if(data.data.length==ctrl.limitLoad){
                ctrl.offsetMessage=ctrl.limitLoad;
            }else{
                ctrl.offsetMessage=0;
            }
            var temp = refactor_mes(ctrl.message_on_room);
            ctrl.message_on_room = temp;
            ctrl.message_on_room = temp;
            $timeout(function () {
                var container = $("#chat-box-content-body-box-friend");
                var scrollTo = $("#chat-box-content-body-box-friend__bottom");
                container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                });
                container.scroll(function () {
     
                    if (container.scrollTop() == 0 && ctrl.offsetMessage>0) {
                        aside_service.load_message_on_room(room._id, ctrl.offsetMessage).then(function(data_more){
                            if(data_more.data.length==ctrl.limitLoad){
                                ctrl.offsetMessage+=ctrl.limitLoad;
                            }else{
                                ctrl.offsetMessage=0;
                            }
                            var temp2 = refactor_mes(data_more.data);
                            ctrl.message_on_room = temp2.concat(ctrl.message_on_room);
                            
                        },function(){

                        });
                        
                    }
                });
            }, 100);

        }, function (err) {
            console.log(err);
        });
    }

    ctrl.toggle_chat_box = function (just_open) {
        if (just_open) {
            if (!$("#aside-menu").hasClass("show-chat-box")) {
                $("#aside-menu").addClass("show-chat-box");
            }
        } else {
            if ($("#aside-menu").hasClass("show-chat-box")) {
                $("#aside-menu").removeClass("show-chat-box");
            } else {
                $("#aside-menu").addClass("show-chat-box");
                get_room_private().then(function () {
                    if (ctrl.room_list[0]) {
                        ctrl.chooseRoom(ctrl.room_list[0]);
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        }
        $("#chat-box-content-body__message").focus();

    }
    ctrl.start_chat_with_friend = function (request_id) {

        aside_service.get_room(request_id).then(function name(data) {

            ctrl.chooseRoom(data.data);
            push_show(ctrl.current_room._id).then(function () {
                get_room_private();
                ctrl.toggle_chat_box(true);
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
    }

    ctrl.focus_textarea_message = function () {

        if (ctrl.current_room
            && ctrl.current_room._id) {
            var friend;
            for (var i in ctrl.current_room.members) {
                if (ctrl.current_room.members[i] !== $rootScope.logininfo.username) {
                    friend = ctrl.current_room.members[i];
                    break;
                }
            }
            if (ctrl.message
                && ctrl.message !== ""
                && ctrl.message !== null) {
                socket.emit('typingFriendRoom', { friend, room: ctrl.current_room._id, value: true });
            } else {
                socket.emit('typingFriendRoom', { friend, room: ctrl.current_room._id, value: false });
            }

        }
    }

    function blur_textarea_message(friend, room) {
        socket.emit('typingFriendRoom', { friend, room, value: false });
    }
    ctrl.blur_textarea_message = function () {
        if (ctrl.current_room
            && ctrl.current_room._id) {
            var friend;
            for (var i in ctrl.current_room.members) {
                if (ctrl.current_room.members[i] !== $rootScope.logininfo.username) {
                    friend = ctrl.current_room.members[i];
                    break;
                }
            }
            blur_textarea_message(friend, ctrl.current_room._id);
        }

    }
}]);



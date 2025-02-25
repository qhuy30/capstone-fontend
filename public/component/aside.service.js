myApp.factory('aside_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.get_typing = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room/get_typing",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_room = function(request_id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room/get_room",
            method: "POST",
            data: JSON.stringify({request_id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_message_to_friend_room = function(room,message){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room_message/insert",
            method: "POST",
            data: JSON.stringify({ room,message}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pull_show_to_room = function(room){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room/pull_show",
            method: "POST",
            data: JSON.stringify({ room}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.push_show_to_room = function(room){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room/push_show",
            method: "POST",
            data: JSON.stringify({ room}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_message_on_room = function(room,offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room_message/load",
            method: "POST",
            data: JSON.stringify({ room,offset}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_message_not_seen = function(room){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room_message/count_not_seen",
            method: "POST",
            data: JSON.stringify({ room}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_room_private = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend_room/load_show",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_for_add_friend = function(search){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_for_add_friend",
            method: "POST",
            data: JSON.stringify({ search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_request_sent = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/load_pending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.load_receive_request = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/load_receive",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function(friend){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/insert",
            method: "POST",
            data: JSON.stringify({ friend}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.accept = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/accept",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.decline = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/request_add_friend/decline",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_add_friend = function(search,top,offset){
        return fRoot.requestHTTP({
            url: BackendDomain + "/basic/add_friend/get_friend",
            method: "POST",
            data: JSON.stringify({ search,top,offset}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
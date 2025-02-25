myApp.factory('componentSocket', ['socket', '$rootScope','fRoot','PushNotifyFactory','$filter','componentRingbellNotify',
 function(socket, $rootScope,fRoot,PushNotifyFactory,$filter,componentRingbellNotify) {
    return {
        run: function() {
 
            socket.on('logout', function(data) {
                fRoot.logout();
            });
  
            socket.on('justPushNotification',function(data){
                PushNotifyFactory.push($filter("l")(data.title),data.body,data.url);
            });

            socket.on('new_ringbell_item',function(data){
                $rootScope.$broadcast('newRingbellItemReceived');
                componentRingbellNotify.pushNotify(data);
            });
        }
    };
}]);
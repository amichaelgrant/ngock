var io = require('socket.io-client');
var socketURL = 'http://localhost/';

var options ={
  //transports: ['websocket'],
  //'force new connection': true
};

function chatTest( data, fn ){
    var client1 = io.connect(socketURL, options);
    client1.on('connect', function(socket){
        socket.emit('client', data);
        socket.on('server', function(response){
            fn(data, response);
        });

        var client2 = io.connect(socketURL, options);
        client2.on('connect', function(socket2){
            socket2.emit('client', data);
            socket2.on('server', function(response){
                fn(data, response);
            });
        });
    });

}

exports.chatTest = chatTest;
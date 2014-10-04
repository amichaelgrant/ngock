var util          = require('util');
var cookie        = require('cookie');
var cookieParser  = require('cookie-parser');
var config        = require('../bin/config');


var IO = function( io ){
    console.log('io successfully attached to server object');
    io.use(function(socket, next){
        //a middle-ware for doing global stuff for all in coming requests on io//
       //like authentication//
       console.log('io#use');
       if( socket.request.headers.cookie){
            //keep proccessing if there is a cookie//
            console.log( util.inspect(socket.request.headers.cookie ));
            var parsedCookies = cookie.parse( socket.request.headers.cookie );
            var upc_sid = cookieParser.signedCookie( parsedCookies['connect.sid'] , config.SECRET);
            var upc_io  = cookieParser.signedCookie( parsedCookies['io'] , config.SECRET);
            console.log('----------------------------------');
            console.log( util.inspect( parsedCookies ));
            console.log('----------------------------------');
            console.log( 'upc_sid - ' + upc_sid );
            console.log('----------------------------------');
            console.log( 'upc_io - ' + upc_io );

            //make parsed session id 'connect.sid' available//
            socket.SESSIONID = upc_sid;
            return next();
       }else
            next( new Error('Authentication and Authorization required'));
    });
    io.on('connection', function (socket) {
      //io.emit('server', 'To all clients connected to io');
      socket.emit('server', 'To the specific client who initiated the connection');

      socket.on('client', function (data) {
        //recieve and process all communication related to the specific client//
        //who initiated the connection;//
        console.log('socket.SESSIONID : ' + socket.SESSIONID);
        console.log('Data from client : ' + data);
        socket.emit('server', data);
      });
    
      socket.on('disconnect', function () {
        io.sockets.emit('client disconnected');
      });
    });

}

module.exports = IO;
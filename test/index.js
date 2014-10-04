var assert   = require('assert');
var chatTest = require('./chat.test').chatTest;

suite('socket.Io', function(){

    test('Hello Server', function() {
        //assert.equal('Hello Server', chatTest('Hello Server'));
        chatTest('Hello Server', assert.equal);
    });

    var i = 0;
    while(10 > i){
        i++;
        test('Loadbalance and criss-cross testing(' + i + ')', function(){
            //assert.equal(''+i, chatTest(''+i));
            chatTest(''+i, assert.equal);
        });
    }

});

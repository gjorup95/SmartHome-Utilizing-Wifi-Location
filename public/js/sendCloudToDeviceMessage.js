sendToDevice();
function sendToDevice(){
'use strict';
  
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = 'HostName=GjorupPi.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=oREm8bL3LGVub1PWhbCTS28KFWF5EbH9XdhZP1xeUb0=';
var targetDevice = 'GjorupPi001';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
  }
  
  function receiveFeedback(err, receiver){
    receiver.on('message', function (msg) {
      console.log('Feedback message:')
      console.log(msg.getData().toString('utf-8'));
    });
  }

  serviceClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Service client connected');
      serviceClient.getFeedbackReceiver(receiveFeedback);
      var message = new Message('Cloud to device message.');
      message.ack = 'full';
      const randomState = Math.floor(Math.random() * Math.floor(3));
      message.data = JSON.stringify({randomState: randomState});
      message.messageId = "My Message ID";
      console.log('Sending message: ' + message.getData());
      serviceClient.send(targetDevice, message, printResultFor('send'));
    }
  });
}
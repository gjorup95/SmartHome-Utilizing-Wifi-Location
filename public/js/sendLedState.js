'use strict';

function setLed(){
  var Client = require('azure-iothub').Client;
const deviceId = 'GjorupPi001'
const iotHubConnectionString = 'HostName=GjorupHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=URJWNWCq0tqLXTV31fJdElARCxuwTt3MGiNBO13uOmQ=';
var client = Client.fromConnectionString(iotHubConnectionString);

var methodParams = {
    methodName: 'SetLedRandom',
    payload: Math.floor(Math.random() * Math.floor(3)), // Number of seconds.
    responseTimeoutInSeconds: 30
  };
  
  // Call the direct method on your device using the defined parameters.
  client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
    } else {
        console.log('Response from ' + methodParams.methodName + ' on ' + deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
    }
  });
}
  
  
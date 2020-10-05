'use strict';

var resources = require('./resources/model');
var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'), //#A
  ultraSonic = require('./plugins/internal/ultrasonicPlugin');


ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B
ultraSonic.start({'simulate': false, 'frequency': 10000});

const Protocol = require('azure-iot-device-mqtt').Mqtt;

const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;


// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
const deviceConnectionString = "HostName=GjorupPi.azure-devices.net;DeviceId=GjorupPi001;SharedAccessKey=MYrYqGrUPYFcEymr8os4vNpGTTzvGSRGNf24F9S1j4U=";
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
let sendInterval;

function onSetLedRandom(request, response) {
    // Function to send a direct method reponse to your IoT hub.
    function directMethodResponse(err) {
      if(err) {
        console.error('An error ocurred when sending a method response:\n' + err.toString());
      } else {
          console.log('Response to method \'' + request.methodName + '\' sent successfully.' );
      }
    }
  
    console.log('Direct method payload received:');
    for (i=1; i<4; i++){
        resources.pi.actuators.leds[i].value = request.payload;
    
}
    console.log(request.payload);
  
    // Check that a numeric value was passed as a parameter
    if (isNaN(request.payload)) {
      console.log('Invalid interval response received in payload');
      // Report failure back to your hub.
      response.send(400, 'Invalid direct method parameter: ' + request.payload, directMethodResponse);
  
    } else {
  
      
  
      // Report success back to your hub.
      response.send(200, 'States of all leds set to:  ' + request.payload, directMethodResponse);
    }
  }
function disconnectHandler () {
    clearInterval(sendInterval);
    client.open().catch((err) => {
        console.error(err.message);
    });
}

function messageHandler (msg) {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
    
}
client.onDeviceMethod('SetLedRandom', onSetLedRandom);

function generateMessage () {
    const distanceData = resources.pi.sensors.distance.value;
    const humidity = resources.pi.sensors.humidity.value;
    const temperature = resources.pi.sensors.temperature.value;
    const led1State = resources.pi.actuators.leds[1].value;
    const led2State = resources.pi.actuators.leds[2].value;
    const led3State = resources.pi.actuators.leds[3].value;
    const data = JSON.stringify({ deviceId: 'Gjorup001', distanceData: distanceData, temperature: temperature, humidity: humidity, led1State: led1State, led2State: led2State, led3State: led3State});
    const message = new Message(data);
    message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');
    return message;
}

function errorCallback (err) {
    console.error(err.message);
}

function connectCallback () {
    console.log('Client connected');
    // Create a message and send it to the IoT Hub every two seconds
    sendInterval = setInterval(() => {
        const message = generateMessage();
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
    }, 2000);
    
}

// fromConnectionString must specify a transport constructor, coming from any transport package.


client.on('connect', connectCallback);
client.on('error', errorCallback);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);

client.open()
.catch(err => {
    console.error('Could not connect: ' + err.message);
});

// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}
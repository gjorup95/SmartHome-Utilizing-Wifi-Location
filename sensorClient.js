'use strict';

var resources = require('./resources/model');
var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');


ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B


const Protocol = require('azure-iot-device-mqtt').Mqtt;

const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;


// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
//const deviceConnectionString = "HostName=GjorupPi.azure-devices.net;DeviceId=GjorupPi001;SharedAccessKey=MYrYqGrUPYFcEymr8os4vNpGTTzvGSRGNf24F9S1j4U=";
// NEW CONNECTION STRING
const deviceConnectionString = "HostName=gjorupSmartHome.azure-devices.net;DeviceId=TempAndLights;SharedAccessKey=Gu04P1cKKDVD+9DtTGnO3e9xSGzk1WgPMz7P6V2cp/k="
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
    var realData = JSON.parse(msg.data);
    if (realData.brightness != undefined){
        resources.pi.actuators.lights[0].value=2;
    }
    switch (realData.location){
        case resources.pi.actuators.lights[0].name:
            resources.pi.actuators.lights[0].value = realData.setValue;
            break;

            case resources.pi.actuators.lights[1].name:
            resources.pi.actuators.lights[1].value = realData.setValue;
            break;

            case resources.pi.actuators.lights[2].name:
            resources.pi.actuators.lights[2].value = realData.setValue;
            break;

            case resources.pi.actuators.lights[3].name:
            resources.pi.actuators.lights[3].value = realData.setValue;
            break;

            case resources.pi.actuators.lights[4].name:
            resources.pi.actuators.lights[4].value = realData.setValue;
            break;

            case resources.pi.actuators.lights[5].name:
            resources.pi.actuators.lights[5].value = realData.setValue;
            break;
            default:
                console.log("didnt match a location");
    }
    
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
    
}
client.onDeviceMethod('badeværelse', onSetLedRandom);

function generateMessage () {
    //var formattedObject = 
    //const dataFormatted = JSON.stringify({deviceId: 'TempAndLights', temp: resources.pi.sensors.temperature.value, hum: resources.pi.sensors.humidity.value});
    //const data = JSON.stringify({ deviceId: 'TempAndLights', temperature: temperature, humidity: humidity, led1State: led1State, led2State: led2State, led3State: led3State}); 
    resources.pi.timestamp = new Date();
    
    const data = JSON.stringify(resources.pi);
    
    const message = new Message(data);
    
    //message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');
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
        
        console.log('Sending message: ' + message.data);
        client.sendEvent(message, printResultFor('send'));
    }, 10000);


    
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    dhtPlugin.stop();
    ledsPlugin.stop();
    process.exit();
});

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
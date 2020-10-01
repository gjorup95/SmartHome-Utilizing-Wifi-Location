'use strict';
var resources = require('./resources/model');
var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'), //#A
  ultraSonic = require('./plugins/internal/ultrasonicPlugin');


ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B
ultraSonic.start({'simulate': false, 'frequency': 10000});

const Protocol = require('azure-iot-device-mqtt').Mqtt;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// const Protocol = require('azure-iot-device-amqp').AmqpWs;
// const Protocol = require('azure-iot-device-http').Http;
// const Protocol = require('azure-iot-device-amqp').Amqp;
// const Protocol = require('azure-iot-device-mqtt').MqttWs;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
const deviceConnectionString = "HostName=GjorupPi.azure-devices.net;DeviceId=GjorupPi001;SharedAccessKey=MYrYqGrUPYFcEymr8os4vNpGTTzvGSRGNf24F9S1j4U=";
let sendInterval;

function disconnectHandler () {
    clearInterval(sendInterval);
    client.open().catch((err) => {
        console.error(err.message);
    });
}

// The AMQP and HTTP transports have the notion of completing, rejecting or abandoning the message.
// For example, this is only functional in AMQP and HTTP:
// client.complete(msg, printResultFor('completed'));
// If using MQTT calls to complete, reject, or abandon are no-ops.
// When completing a message, the service that sent the C2D message is notified that the message has been processed.
// When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
// When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
// MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
function messageHandler (msg) {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
}

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
let client = Client.fromConnectionString(deviceConnectionString, Protocol);

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
'use strict';
const express = require('express');
const port = '10503';
const http = require('http');
const WebSocket = require('ws');
var Client = require('azure-iothub').Client;

const deviceId = 'GjorupPi001'
const path = require('path');
const EventHubReader = require('./scripts/event-hub-reader.js');
const iotHubConnectionString = 'HostName=GjorupHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=URJWNWCq0tqLXTV31fJdElARCxuwTt3MGiNBO13uOmQ=';
//const iotHubConnectionString = 'HostName=GjorupPi.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=oREm8bL3LGVub1PWhbCTS28KFWF5EbH9XdhZP1xeUb0=';


var client = Client.fromConnectionString(iotHubConnectionString);
if (!iotHubConnectionString) {
  console.error(`Environment variable IotHubConnectionString must be specified.`);
  return;
}
console.log(`Using IoT Hub connection string [${iotHubConnectionString}]`);

const eventHubConsumerGroup = 'GjorupConsumer';
console.log(eventHubConsumerGroup);
if (!eventHubConsumerGroup) {
  console.error(`Environment variable EventHubConsumerGroup must be specified.`);
  return;
}
console.log(`Using event hub consumer group [${eventHubConsumerGroup}]`);

// Redirect requests to the public subdirectory to the root
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res /* , next */) => {
  res.redirect('/');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log(`Broadcasting data ${data}`);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};

server.listen(process.env.PORT || port, () => {
  console.log('Listening on %d.', server.address().port);
});

const eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);

(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const payload = {
        IotData: message,
        MessageDate: date || Date.now().toISOString(),
        DeviceId: deviceId,
      };

      wss.broadcast(JSON.stringify(payload));
    } catch (err) {
      console.error('Error broadcasting: [%s] from [%s].', err, message);
    }
  });
})().catch();
exports.sendChangeLed = function() {
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
};


// Final version
const express = require('express');
const port = '10503';
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const EventHubReader = require('./scripts/event-hub-reader.js');
const iotHubConnectionString = 'HostName=GjorupPi.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=oREm8bL3LGVub1PWhbCTS28KFWF5EbH9XdhZP1xeUb0=';
var resources = require('./resources/model');

// Internal Plugins

var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'); //#A
  ultraSonic = require('./plugins/internal/ultrasonicPlugin');


ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B
ultraSonic.start({'simulate': false, 'frequency': 10000});


"use strict";

// Final version
var express = require('express'),
    actuatorsRoutes = require('./../routes/actuators'),
    sensorRoutes = require('./../routes/sensors'),
    //TODO: thingsRoutes = require('./../routes/things'),
resources = require('./../resources/model'),
    converter = require('./../middleware/converter'),
    cors = require('cors'),
    bodyParser = require('body-parser');

app = express(); //app.set('view engine', 'pug');

var path = require('path');

app.use(bodyParser.json());
app.use(cors());
app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);
app.get('/pi', function (req, res) {
  res.sendFile(path.join(__dirname + './../views/index.html'));
});
/*app.get('/pi', function (req, res) {
  res.render('index', { title: 'Web of things', message: 'Welcome to Gjorup Raspberry Pi', 
  distSensor: resources.pi.sensors.distance.name, distSensorValue: resources.pi.sensors.distance.value, humSens: resources.pi.sensors.humidity.value, 
  humName: resources.pi.sensors.humidity.name, tempSens: resources.pi.sensors.temperature.value, 
  tempName: resources.pi.sensors.temperature.name, led1: resources.pi.actuators.leds[1].value,
  led2: resources.pi.actuators.leds[2].value, led3: resources.pi.actuators.leds[3].value,
  })
})
*/
// For representation design

app.use(converter());
module.exports = app;
//# sourceMappingURL=http.dev.js.map

var resources = require('./../../resources/model');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Temperature & Humidity';
var localParams = {'simulate': false, 'frequency': 5000};
var sensor;

exports.start = function (params) {
  localParams = params;
  
    connectHardware();
  
};

exports.stop = function () {
    
    sensor.stop;
  console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
 var sensorDriver = require('node-dht-sensor');
   sensor = {
    initialize: function () {
      return sensorDriver.initialize(11, model.temperature.gpio); //#A
    },
    read: function () {
      var readout = sensorDriver.read(); //#B
      model.temperature.value = parseFloat(readout.temperature.toFixed(2));
      model.humidity.value = parseFloat(readout.humidity.toFixed(2)); //#C
      showValue();

      setTimeout(function () {
        sensor.read(); //#D
      }, localParams.frequency);
    }
  };
  if (sensor.initialize()) {
    console.info('Hardware %s sensor started!', pluginName);
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor!');
  }
};


function showValue() {
  console.info('Temperature: %s C, humidity %s \%',
    model.temperature.value, model.humidity.value);
};

//#A Initialize the driver for DHT22 on GPIO 12 (as specified in the model)
//#B Fetch the values from the sensors
//#C Update the model with the new temperature and humidity values; note that all observers will be notified
//#D Because the driver doesn’t provide interrupts, you poll the sensors for new values on a regular basis with a regular timeout function and set sensor.read() as a callback

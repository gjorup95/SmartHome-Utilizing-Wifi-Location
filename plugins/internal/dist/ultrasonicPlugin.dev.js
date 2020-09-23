"use strict";

var resources = require('../../resources/model'),
    utils = require('../../utils/utils.js');

var sensor;
var model = resources.pi.sensors;
var pluginName = 'Ultrasonic distance sensor';

var Gpio = require('pigpio').Gpio; // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius


exports.start = function (params) {
  var MICROSECDONDS_PER_CM = 1e6 / 34321;
  var trigger = new Gpio(23, {
    mode: Gpio.OUTPUT
  });
  var echo = new Gpio(24, {
    mode: Gpio.INPUT,
    alert: true
  });
  trigger.digitalWrite(0); // Make sure trigger is low

  var watchHCSR04 = function watchHCSR04() {
    var startTick;
    echo.on('alert', function (level, tick) {
      if (level == 1) {
        startTick = tick;
      } else {
        var endTick = tick;
        var diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic

        result = (diff / 2 / MICROSECDONDS_PER_CM).toFixed(2);
        model.distance.value = result; //console.log(result);
      }
    });
  };

  watchHCSR04(); // Trigger a distance measurement once per second

  setInterval(function () {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
  }, 1000);
};

exports.stop = function () {
  clearInterval();
};
//# sourceMappingURL=ultrasonicPlugin.dev.js.map

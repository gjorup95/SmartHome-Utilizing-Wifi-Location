var resources = require('../../resources/model');
  var sensor;
  var model = resources.pi.sensors;
  var pluginName = 'Ultrasonic distance sensor';
  const Gpio = require('pigpio').Gpio;
  const MICROSECDONDS_PER_CM = 1e6/34321;
  const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
  const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
  trigger.digitalWrite(0); // Make sure trigger is low

exports.start = function (params){
  
  const watchHCSR04 = () => {
    let startTick;
  
    echo.on('alert', (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        result = (diff / 2 / MICROSECDONDS_PER_CM).toFixed(2);
        model.distance.value = result;
        //console.log(result);
      }
    });
  };
  
  watchHCSR04();
  
  // Trigger a distance measurement once per second
  setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
  }, 1000);
  
}

exports.stop = function(){
 clearInterval();
 Gpio.terminate();
 
}

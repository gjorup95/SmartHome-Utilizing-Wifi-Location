var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.leds['1'];
modelarray = resources.pi.actuators.leds;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};
let stopBlinking = false;
var led1state = 1;
alreadyPlayed = false;


exports.start = function (params) {
  localParams = params;
  
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
    setInterval(check1, 500,modelarray);
    
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function check1(what) {
  for (i=1; i<4; i++){
    if (what[i].value === 0){
      stopBlinking = true;
      actuator.writeSync(1);
      alreadyPlayed= false;
    }
     if (what[i].value=== 1){
      stopBlinking = true;
      actuator.writeSync(0);
      alreadyPlayed = false;
    }
    if (what[i].value === 2 & alreadyPlayed === false){
      stopBlinking = false;
      blinkLED();
      alreadyPlayed = true;
         }
        }
}

function connectHardware() {
  var Gpio = require('onoff').Gpio;
   actuator = new Gpio(model.gpio, 'out'); //#D changed gpio from model.gpio
  console.info('Hardware %s actuator started!', pluginName);  
}

function blinkLED(){
  const blinkLed = _ => {
    if (stopBlinking) {
      return;
      //return actuator.unexport();
    }
    actuator.read((err, value) => {led1state = value ^1;// Asynchronous read
      if (err) {
        throw err;
      }
  
      actuator.write(value ^ 1, err => {
       // Asynchronous write
        if (err) {
          throw err;
        }
      });
    });
  
    setTimeout(blinkLed, 2000);
  };
  
  blinkLed();
}
  
function simulate() {
  interval = setInterval(function () {
    // Switch value on a regular basis
    if (model.value) {
      model.value = false;
    } else {
      model.value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode


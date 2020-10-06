var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.leds['1'];
modelarray = resources.pi.actuators.leds;
var pluginName = model.name;
let stopBlinking = false;
alreadyPlayed = false;
var actuatorObject = {
  actuators: []
};


exports.start = function (params) {
    connectHardware();
    setInterval(check1, 500,modelarray);
    
  
};

exports.stop = function () {
    for (i=0; i<3; i++){
      actuatorObject.actuators[i].write(0);
      actuatorObject.actuators[i].unexport();
    }
  console.info('%s plugin stopped!', pluginName);
};

function check1(what) {
  for (i=1; i<4; i++){
    if (what[i].value === 0){
      stopBlinking = true;
      //actuator.writeSync(1);
      actuatorObject.actuators[i-1].writeSync(1);
      alreadyPlayed= false;
    }
     if (what[i].value=== 1){
      stopBlinking = true;
      //actuator.writeSync(0);
      actuatorObject.actuators[i-1].writeSync(0);
      alreadyPlayed = false;
    }
    if (what[i].value === 2 & alreadyPlayed === false){
      stopBlinking = false;
      blinkLED(i);
      alreadyPlayed = true;
         }
        }
}

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  for (i=1; i<4; i++){
    actuator = new Gpio(modelarray[i].gpio, 'out');
    actuatorObject.actuators.push(actuator);
    }
  
    //actuator = new Gpio(model.gpio, 'out'); //#D changed gpio from model.gpio
    //actuatorObject.actuators.push(actuator);
  console.info('Hardware %s actuator started!', pluginName); 
 // Show that it actually holds all the 3 leds.
  /*for (i=0; i<3; i++){
    console.info(actuatorObject.actuators[i]);
  }  */
}

function blinkLED(i){


  
  const blinkLed = _ => {
    if (stopBlinking) {
      return;
      
    }
    actuatorObject.actuators[i-1].read((err, value) =>  {// Asynchronous read
      if (err) {
        throw err;
      }
  
      actuatorObject.actuators[i-1].write(value ^ 1, err => {
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
  
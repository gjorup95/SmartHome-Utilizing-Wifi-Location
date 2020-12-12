var resources = require('./../../resources/model');
var actuator;
modelarray = resources.pi.actuators.lights;
var pluginName = resources.pi.actuators.name;
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
    for (i=0; i<actuatorObject.actuators.length; i++){
      actuatorObject.actuators[i].write(0);
      actuatorObject.actuators[i].unexport();
    }
  console.info('%s plugin stopped!', pluginName);
};

function check1(what) {
  // Only check the 3 first
  for (i=0; i<3; i++){
    if (what[i].value === 0){
      stopBlinking = true;
      actuatorObject.actuators[i].writeSync(1);
      alreadyPlayed= false;
    }
     if (what[i].value=== 1){
      stopBlinking = true;
      actuatorObject.actuators[i].writeSync(0);
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
  // Only instantiate the 3 first leds
  for (i=0; i<3; i++){
    actuator = new Gpio(modelarray[i].gpio, 'out');
    actuatorObject.actuators.push(actuator);
    }
  
    
  console.info('Hardware %s actuator started!', pluginName); 
  //Show that it actually holds all the 3 leds.
   // console.info(actuatorObject.actuators.length);
    
}

function blinkLED(i){


  
  const blinkLed = _ => {
    if (stopBlinking) {
      return;
      
    }
    actuatorObject.actuators[i].read((err, value) =>  {// Asynchronous read
      if (err) {
        throw err;
      }
  
      actuatorObject.actuators[i].write(value ^ 1, err => {
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
  
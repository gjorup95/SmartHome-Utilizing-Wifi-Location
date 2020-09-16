const { time } = require('console');
const express = require('express');
const app = express()
const port = 10503
const { spawn } = require('child_process');
var sensorLib = require('node-dht-sensor');
var Gpio = require('onoff').Gpio; 
var LED = new Gpio(17, 'out'); 
var blinkInterval = setInterval(blinkLED, 2000);
var ledState = 0;
function blinkLED() {
  if (LED.readSync() === 0) {

    LED.writeSync(1); //set output to 1 i.e turn led on
    ledState = 1;
  } else {
    LED.writeSync(0); //set output to 0 i.e. turn led off 
    ledState = 0;
 }
}
function endBlink() { 
  clearInterval(blinkInterval); 
  LED.writeSync(0); 

  LED.unexport(); // Unexport GPIO to free resources
}
//setTimeout(endBlink, 2000);
var output ="";
var dht_sensor = {
    initialize: function () {
        return sensorLib.initialize(11, 4);
    },
    read: function () {
        var readout = sensorLib.read();
        output = "Temperature: " + readout.temperature.toFixed(2) + "C, " + "humidity: " + readout.humidity.toFixed(2) + "%   -  ";
        //console.log(output);
        setTimeout(function () {
            dht_sensor.read();
        }, 2000);
    }
};

if (dht_sensor.initialize()) {
     dht_sensor.read();
} else {
    console.warn('Failed to initialize sensor');
}


app.get('/', (req, res) => {
    const pyUltra = spawn('python', ['ultrasonic.py'])
    res.write("Led is: " + ledState.toString() + "  -  ");
    res.write(output);
    pyUltra.stdout.on('data', function(data) {
        //console.log(data.toString());
        res.write(data); 
        res.end('')
    });
    
})

app.listen(port, () => console.log('Application listening on port 10503!'))
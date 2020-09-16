const { time } = require('console');
const express = require('express');
const app = express()
const port = 10503
const { spawn } = require('child_process');
const pyBlink = spawn('python', ['blink.py']);
var sensorLib = require('node-dht-sensor');
var output = "";
var dht_sensor = {
    initialize: function () {
        return sensorLib.initialize(11, 4);
    },
    read: function () {
        var readout = sensorLib.read();
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
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
    pyUltra.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data); 
        res.end('')
    });
    
})

app.listen(port, () => console.log('Application listening on port 10503!'))
const { time } = require('console');
const express = require('express');
let tempHum = require('./humsensor');
const app = express()
const port = 10503
const { spawn } = require('child_process');
const pyBlink = spawn('python', ['blink.py']);
tempHum.read();
app.get('/', (req, res) => {
    console.log(tempHum.output);
    
    const pyUltra = spawn('python', ['ultrasonic.py'])
    pyUltra.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data); 
        res.end('')
    });
    
})

app.listen(port, () => console.log('Application listening on port 10503!'))
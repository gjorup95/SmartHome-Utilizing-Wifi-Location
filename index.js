const { time } = require('console');
const express = require('express')
const app = express()
const port = 10503
const { spawn } = require('child_process');

app.get('/', (req, res) => {
    const pyBlink = spawn('python', ['blink.py']);
    const pyUltra = spawn('python', ['ultrasonic.py'])
    pyUltra.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data); 
        res.end('')
    });
    
})

app.listen(port, () => console.log('Application listening on port 10503!'))
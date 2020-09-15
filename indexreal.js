const { time } = require('console');
const express = require('express')
const app = express()
const port = 10500
app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['ultrasonic.py']);

    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');    
    });
    
})

app.listen(port, () => console.log('Application listening on port 10500!'))
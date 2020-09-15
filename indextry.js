const { time } = require('console');
const express = require('express')
const app = express()
const port = 10503
app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyTempHum = spawn('python', ['humTemp.py']);

    
    pyTempHum.stdout.on('data', function(data){

        console.log(data.toString());
        res.write(data);
        res.end('Ended temp and humidity.')
    });
    
})

app.listen(port, () => console.log('Application listening on port 10503!'))
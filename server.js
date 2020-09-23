// Final version
var httpServer = require('./servers/http'),
 wsServer = require('./servers/websockets'),
  resources = require('./resources/model');

// Internal Plugins

var ledsPlugin = require('./plugins/internal/ledsPlugin'), //#A
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin'); //#A
  ultraSonic = require('./plugins/internal/ultrasonicPlugin');


ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B
ultraSonic.start({'simulate': false, 'frequency': 10000});

// HTTP Server
var server = httpServer.listen(resources.pi.port, function () {
  console.log('HTTP server started...');

   //Websockets server
  wsServer.listen(server);

  console.info('Your WoT Pi is up and running on port %s', resources.pi.port);
});
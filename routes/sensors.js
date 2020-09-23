// Final version
var express = require('express'),
  router = express.Router(),
  resources = require('./../resources/model');

router.route('/').get(function (req, res, next) {
  req.result = resources.pi.sensors; //#A
  next(); //#B
});

router.route('/sensors').get(function (req, res, next) {
  req.result = resources.pi.sensors;
  next();
});
router.route('/temperature').get(function (req, res, next) {
  req.result = resources.pi.sensors.temperature;
  next();
});

router.route('/humidity').get(function (req, res, next) {
  req.result = resources.pi.sensors.humidity;
  next();
});
router.route('/ultrasonic').get(function(req, res, next){
  req.result = resources.pi.sensors.distance;
  next();
});

module.exports = router;

//#A Assign the results to a new property of the req object that you pass along from middleware to middleware
//#B Call the next middleware; the framework will ensure the next middleware gets access to req (including the req.result) and res


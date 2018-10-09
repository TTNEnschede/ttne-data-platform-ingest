'use strict'

const dotenv_config = require('dotenv').config();
const config        = require('./config');
const restify       = require('restify');
const bunyan        = require('bunyan');
const mongoose      = require('mongoose');
const mqtt          = require('mqtt');

const ingestRouter    = require('./routes/ingest');
const internalRouter  = require('./routes/internal');

// Create logger
global.log = new bunyan({name: config.name});

// Create MQTT client if needed
if (config.mqtt.enabled) {
    global.mqtt_client = mqtt.connect(config.mqtt.broker_url);

    mqtt_client.on('connect', function () {
        log.info('Connecting to mqtt broker %s .', config.mqtt.broker_url);
    });

    mqtt_client.on('offline', function () {
        log.info('Disconnected to mqtt broker %s .', config.mqtt.broker_url);
    });

    mqtt_client.on('error', function (error) {
        log.error(error);
        log.error('Received error (%o) from mqtt broker.', error);
    });
}

// Initialize Server
global.server = restify.createServer({
    name    : config.name,
    version : config.version,
    log     : log
});

// Plugins.
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
if (config.env === 'development') {
    server.use(
        function crossOrigin(req,res,next){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        }
    );
}

// Callback for exception flows (500 internal error).
server.on('uncaughtException', function(req, res, route, err) {
  var auditer = restify.auditLogger({log:log});
  auditer(req, res, route, err);
  res.send(500, "Unexpected error occured");
});

// Launch server.
server.listen(config.service.port, function() {

    // Set bluebird promise model.
    mongoose.Promise = require('bluebird');

    // Callback for errors on connect.
    mongoose.connection.on('error', function(err) {
        log.error('Mongoose connection error: ' + err)
        process.exit(1)
    });

    // Callback on connection open.
    mongoose.connection.on('open', function(err) {
        if (err) {
            log.error('Mongoose connection error: ' + err)
            process.exit(1)
        }

        log.info(
            '%s v%s accepting connections on port %s in %s environment.',
            server.name,
            config.version,
            config.service.port,
            config.env
        )

        // Apply available routes.
        ingestRouter.applyRoutes(server, '/api');
        internalRouter.applyRoutes(server, '/internal');

        // Set the home route.
        server.get('/', function(req, res, next) {
            res.send({message:'Ingestion service for the TTNE data platform.'});
            next();
        });
    });

    // Connect to database.
    global.db = mongoose.connect(config.db.uri, {
  	   useMongoClient: true,
  	});

});

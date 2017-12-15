'use strict'

const config        = require('../config');
const Validator     = require('jsonschema').Validator;
const errors        = require('restify-errors');
const Router        = require('restify-router').Router;  
const router        = new Router();
const path          = require('path');
const fs            = require('fs')

// Model.
var Ingest          = require('./../models/Ingest');

// Read JSON validation schemas from file.
const payload_schema_file = path.join(__dirname, 'validation', 'ingest_schema_payload_cayenne.json');
const payload_schema = JSON.parse(fs.readFileSync(payload_schema_file, 'utf8'));
const ingest_schema_file = path.join(__dirname, 'validation', 'ingest_schema.json');
const schema = JSON.parse(fs.readFileSync(ingest_schema_file, 'utf8'));

// Create validator object.
var validator = new Validator();
validator.addSchema(payload_schema, '/IngestPayload');

/**
 * @api {post} /api/ingest Ingest TTN messages
 * @apiVersion 1.0.0
 * @apiHeader {String} apikey An access-key for posting data.
 * @apiDescription With this api end point data from the TTN HTTP integration can be ingested.
 *
 * @apiGroup Ingest
 * @apiSuccess {String} result The result message.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      result: "Ingested!"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 400 Bad Request
 */
router.post('/ingest', function (req, res, next) { 
    
    // Check if we have an api key
    if (!req.headers['apikey']) {
        return next(new errors.UnauthorizedError({message: 'Missing api key.'}));
    }

    // Valid input only if we have a body (validator will return true on an undefined body).
    if (!req.body) {
        return next(new errors.BadRequestError({message: 'Ingest message contains no body.'}));
    }

    // If we have empty payload fields then simply skip this message.
    if (isEmpty(req.body.payload_fields)) {
        return next(new errors.BadRequestError({message: 'Ingest message contains no payload_fields.'}));
    }    

    // Do validation.
    var validation_result = validator.validate(req.body, schema);
    if (!validation_result.valid) {
        log.error("Validation results: ", validation_result.errors);
        return next(new errors.BadRequestError({message: 'Ingest message contains ' + validation_result.errors.length +' validation errors.'}));
    }

    // Store the raw payload.
    var newIngest = new Ingest({
        api_key : req.headers['apikey'],
        payload : req.body
    });

    // Save new ingest.
    newIngest.save(function (err, ingestDocument) {
        if (err) {
            log.error("Error saving ingest: ", err);
            return next(new errors.InternalError({message: err.message}));
        }
        
        if (config.mqtt.enabled) {
            // Publish to MQTT broker for further processing.
            mqtt_client.publish(config.mqtt.ingest_topic, JSON.stringify(ingestDocument), { qos: config.mqtt.qos });
        }

        // Send response to client and do the parsing afterwards.
        var results = { result: 'Ingested!' };
        res.send(results);
        next();
    });

});

function isEmpty(obj) {
    return Object.keys(obj).length == 0
}

module.exports = router;
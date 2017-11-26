'use strict'

const config    = require('./../config');
const mongoose  = require('mongoose');
const supertest = require('supertest');
const should    = require('should');
const server    = supertest.agent(config.service.base_url + ":" + config.service.port);


describe("* Ingest test",function () {

    // Actual tests
    it('should produce an unauthorized error (401) for request without an api key', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(401)
            .send({})
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Missing api key.');

                done();
            });
    });

    it('should produce an error (400) for request with no body', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send()
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains no body.');

                done();
            });
    });

    it('should produce a validation error (400) for request with empty object', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({})
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 3 validation errors.');

                done();
            });
    });

    it('should produce a validation error (400) for request with empty body', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({})
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 3 validation errors.');

                done();
            });
    });

    it('should produce a validation error (400) for request with only app_id', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id'
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 2 validation errors.');

                done();
            });
    });

    it('should produce a validation error (400) for request with only dev_id', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'dev_id' : 'my_dev_id'
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 2 validation errors.');

                done();
            });
    });

    it('should produce a validation error (400) for request with app_id and dev_id', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id'
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 1 validation errors.');

                done();
            });
    });

    it('should produce a validation error (400) for request with app_id and dev_id and empty payload_fields', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {}
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains no payload_fields.');

                done();
            });
    });

    it('should produce a validation error (200) for request with app_id, dev_id and payload_fields (temperature)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(200)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.result.should.be.exactly('Ingested!');
                
                done();
            });
    });

    it('should produce a validation error (400) for request with app_id, dev_id and invalid payload_fields (temperatuur)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperatuur': 25.0
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.message.should.be.exactly('Ingest message contains 1 validation errors.');
                
                done();
            });
    });

    it('should produce a validation error (200) for request with app_id, dev_id and payload_fields (temperature, humidity)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(200)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0,
                    'relative_humidity' : 800
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.result.should.be.exactly('Ingested!');
                
                done();
            });
    });


    it('should produce a validation error (200) for request with app_id, dev_id and payload_fields (temperature, humidity, pressure)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(200)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0,
                    'relative_humidity' : 800,
                    'barometric_pressure' : 1000
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.result.should.be.exactly('Ingested!');
                
                done();
            });
    });

    it('should produce a validation error (200) for request with app_id, dev_id and payload_fields (temperature, humidity, pressure, location)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(200)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0,
                    'relative_humidity' : 800,
                    'barometric_pressure' : 1000,
                    'gps' : {
                        'latitude': 52.2345,
                        'longitude': 6.23456
                    }
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body.result.should.be.exactly('Ingested!');
                
                done();
            });
    });

    it('should produce a validation error (400) for request with app_id, dev_id and invalid payload_fields (empty location)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0,
                    'relative_humidity' : 800,
                    'barometric_pressure' : 1000,
                    'gps' : {
                    }
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                // Validation errors:
                // 1. Latitude is required.
                // 2. Longitude is required.
                res.body.message.should.be.exactly('Ingest message contains 2 validation errors.');
                
                done();
            });
    });

    it('should produce a validation error (400) for request with app_id, dev_id and invalid payload_fields (location)', function (done) {
        server.post('/api/ingest')
            .set('Accept', 'application/json')
            .set('apikey', '12345')
            .expect('Content-type', /json/)
            .expect(400)
            .send({
                'app_id' : 'my_app_id',
                'dev_id' : 'my_dev_id',
                'payload_fields' : {
                    'temperature': 25.0,
                    'relative_humidity' : 800,
                    'barometric_pressure' : 1000,
                    'gps' : {
                        'latitude': 52.2345
                    }
                }
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                // Validation errors:
                // 1. Longitude is required.
                res.body.message.should.be.exactly('Ingest message contains 1 validation errors.');
                
                done();
            });
    });

});
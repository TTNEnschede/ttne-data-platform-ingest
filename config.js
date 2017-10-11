'use strict'

module.exports = {
    name: 'ttne-data-platform-ingest',
    version: '1.0.0',
    env: process.env.INGEST_ENV || 'development',
    service: {
        port: process.env.INGEST_SERVICE_PORT || 3001,
        base_url: process.env.INGEST_SERVICE_BASE_URL || 'http://localhost'
    },
    db: {
        uri: process.env.INGEST_DB_URI || 'mongodb://127.0.0.1:27017/ttne_data'
    },
    mqtt: {
        enabled: process.env.INGEST_MQTT_ENABLED || false,
        broker_url: process.env.INGEST_MQTT_BROKER_URL || 'mqtt://localhost',
        ingest_topic: process.env.INGEST_MQTT_INGEST_TOPIC || 'ingest',
        qos: process.env.INGEST_MQTT_QOS || 1
    }
}
# TTNE Data Platform Ingest
The ingestion service of the data platform for storing and retrieving sensor data gathered using the things network (TTN).

# Features
This repository contains a REST service which contains an POST endpoint where a TTN HTTP integration can post data to. Data is stored in a mongo database. Optionally the ingested data can be published to a (local) MQTT broker for further processing.

# Run
Start the service using npm start:

```$ npm start```

# Configuration
See config.js for configuration parameters.
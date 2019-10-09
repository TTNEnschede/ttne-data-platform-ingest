# TTNE Data Platform Ingest
The ingestion service of the data platform for storing and retrieving sensor data gathered using the things network (TTN).

# Features
This repository contains a REST service which contains an POST endpoint where a TTN HTTP integration can post data to. Data is stored in a mongo database. Optionally the ingested data can be published to a (local) MQTT broker for further processing.

# Run
Start the service using npm start (from the command line). Be sure to install the required packages first by running npm install.

```
npm install
npm start
```

# Configuration
The service can be configure with the following environment variables:
```
INGEST_SERVICE_PORT: The HTTP port on which the service listens (default = 3001)
INGEST_SERVICE_BASE_URL: The base url on which the server listens (default = 'http://localhost')
INGEST_DB_URI: The (Mongo) database in which to store and retrieve data (default = 'mongodb://127.0.0.1:27017/ttne_data')
INGEST_MQTT_ENABLED: Whether the service should connect to an MQTT broker (default = false)
INGEST_MQTT_BROKER_URL: If INGEST_MQTT_ENABLED is set to true, this variable tells the service where to connect to the MQTT broker (default = 'mqtt://localhost')
INGEST_MQTT_INGEST_TOPIC: If INGEST_MQTT_ENABLED is set to true, this variable tells the service on which topic to subscribe at the MQTT broker (default = 'ingest')
INGEST_MQTT_QOS: If INGEST_MQTT_ENABLED is set to true, this variable tells the service which Quality of Service level to use when connecting to the MQTT broker. Valid options are 1, 2 or 3 (default = 1)
```

See config.js for configuration parameters.

Application supports dotenv. Add environment variables in a '.env' file in the root folder and they will be picked up by the application.

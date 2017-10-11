var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingestSchema = new Schema({
	created_on: { type : Date, default: Date.now },
    api_key: { type: String, required: true },
    payload: {}
});

module.exports = mongoose.model("Ingest", ingestSchema);
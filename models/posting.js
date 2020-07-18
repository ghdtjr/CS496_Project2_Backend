var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postingSchema = new Schema({
    id: String,
    place: String,
    date: Date,
    category: String
});

module.exports = mongoose.model('posting', postingSchema);
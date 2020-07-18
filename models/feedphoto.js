var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedphotoSchema = new Schema({
    photo: String,
    id: String,
    like: Number,
    sentence: String,
    category: String
});

module.exports = mongoose.model('feedphoto', feedphotoSchema);
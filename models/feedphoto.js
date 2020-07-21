var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedphotoSchema = new Schema({
    file_name: String,
    place: String,
    id: String,
    like: String,
    contents: String,
    category: String
});

module.exports = mongoose.model('feedphoto', feedphotoSchema);
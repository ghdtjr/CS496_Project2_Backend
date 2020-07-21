var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    password: String,
    phone_number: String,
    file_name: String
});

module.exports = mongoose.model('user', userSchema);
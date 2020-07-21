var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    password: String,
    phone_number: String,
    profile_url: String
});

module.exports = mongoose.model('user', userSchema);
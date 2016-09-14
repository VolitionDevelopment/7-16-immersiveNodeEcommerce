var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username: String,
	password: String,
	emailAddr: String,
	token: String,
	tokenExpDate: Date //curnetly not in use
});

module.exports = mongoose.model('User', User);
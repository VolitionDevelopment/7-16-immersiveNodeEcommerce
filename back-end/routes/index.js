var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
mongoose.connect(mongoUrl);
var User = require('../models/user');
//Include bcrpyt to store hashsed pass
var bcrypt = require('bcrypt-nodejs');

router.post('/register', function(req, res, next) {
  
	if(req.body.password != req.body.password2){
		res.json({
			message: "passmatch"
		});
	}else{
		var newUser = new User({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			emailAddr: req.body.email
		});

		newUser.save();
		res.json({
			message: "added"
		});
	}
});

router.post('/login', function(req, res, next){
	User.findOne(
		{username: req.body.username}, //This is teh droid we;re looking for
		function (error, document){
			//document is teh document returned from our Mongo query... ie, the droid.
			//The docuemtn will ahve a property for each field. We need to check the passwrod field
			// in the DB against the hashed bcrypt version
			if(document == null){
				//No match
				res.json({failure:"noUser"});
			}else{
				//Run comparesync. First param is the english password, second param is the hash. It will return
				//true if they are equal, false if not.
				var loginResult = bcrypt.compareSync(req.body.password, document.password);
				if(loginResult){
					//The password is correct. Log them in.
					res.json({
						success:"userFound"
					});
				}else{
					//hashes did not match or teh doc wasn't found. Goodbye.
					res.json({
						failure: "badPass"
					});
				}
			}
		}
	)
});

module.exports = router;

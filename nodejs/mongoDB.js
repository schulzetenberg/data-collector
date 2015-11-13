var promisify = require('promisify-node');
var mongoose = promisify('mongoose');

function start () {
	var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;
	
	// if OPENSHIFT env variables are present, use the available connection info:
	if (process.env.OPENSHIFT_MONGODB_DB_URL) {
	    url = process.env.OPENSHIFT_MONGODB_DB_URL +
	    process.env.OPENSHIFT_APP_NAME;
	}
	
	// Connect to mongodb
	var connect = function () {
		console.log("connecting to db");
	    mongoose.connect(url);
	};
	connect();
	
	var db = mongoose.connection;
	
	db.on('connected', function(){
		console.log("Connected to db");
	});
	db.on('error', function(error){
	    console.log("Error loading the db: " + error);
	});
	// Keep trying to connect if disconnected
	db.on('disconnected', connect);
}

module.exports = {start : start};
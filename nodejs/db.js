var mongoose = require('mongoose');
var secrets = require('../config/secrets');

var url = secrets.db;
mongoose.connect(url);
var db = mongoose.connection;

// When successfully connected
db.on('connected', function () {  
  console.log('Mongoose connection open to ' + url);
}); 

// If the connection throws an error
db.on('error',function (err) {  
  console.log('Mongoose connection error: ' + err);
}); 

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Mongoose disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  db.close(function () { 
    console.log('Mongoose connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
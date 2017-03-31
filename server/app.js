var express = require('express');
var app = express();
var json2csv = require('nice-json2csv');
var bodyParser = require('body-parser');

app.use(json2csv.expressDecorator);
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


var listener = app.listen(process.env.PORT || 8081, function(){
  console.log(listener.address().port);
});
//============ROUTER=============
var router = require('./router')(app);

// Error Handling
app.use(function(err, req, res, next){
	res.status(err.stack || 501);
});

module.exports = app;

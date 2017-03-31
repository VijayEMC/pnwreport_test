var express = require('express');
var router = express.Router();
var sr = require('../../models/srdata');
var ib = require('../../models/installdata');

// GET /csv
router.get('/', function (req, res){
	res.send('This is the api endpoint at /');
});

// GET /csv/srreport/:gdun
router.get('/srreport/:gdun', function (req, res){
	console.log('the gdun requested is '+req.params.gdun);
	sr.getSRs(req.params.gdun,function(data){
		console.log(data.rows);
		res.csv(data.rows, req.params.gdun+"_sr_data.csv");
	});
});

// GET /csv/sev1report/:gdun
router.get('/sev1report/:gdun', function (req, res){
	var gdun = req.params.gdun;
	sr.getSRs(gdun, function(data){
		sr.getSev1s(data, function(sev1s){
			res.csv(sev1s, gdun+"_sev1s.csv");
		})
	})
});

// GET /csv/installreport/:gdun
router.get('/installreport/:gdun', function (req, res){
	console.log('the gdun requested is ' + req.params.gdun);
	ib.getInstalls(req.params.gdun, function(data){
		console.log(data.rows);
		res.csv(data.rows, req.params.gdun+"_install_data.csv");
	});
});

module.exports = router;

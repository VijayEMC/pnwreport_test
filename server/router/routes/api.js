var express = require('express');
var router = express.Router();
var sr = require('../../models/srdata');
var ib = require('../../models/installdata');
var xio = require('../../models/xioconfig');
var rep = require('../../models/rep');
var customer = require('../../models/customer');
var config = require('../../../config/plotlyconfig.json');
// get plotly rocking
var plotly = require('plotly')(config.username, config.plotlyKey);
var helper = require('./helperFunctions');
var bodyParser = require('body-parser');

// GET /api
router.get('/', function (req, res){
	res.send('This is the api endpoint at pnwreport_test.../');
});

//GET /api/rep
router.get('/rep/:last_name/:first_name/:middle_initial', function(req, res){
  var rep_name = req.params.last_name + '%2c' + req.params.first_name + '%20' + req.params.middle_initial;
  rep.getREP(rep_name,function(data){
    res.send(data);
  })
});

//GET /api/customer
router.get('/rep/:customer_name', function(req, res){
  var rep_name = req.params.customer_name;
  rep.getREP(rep_name,function(data){
    res.send(data);
  })
});

//GET /api/gdun
router.get('/gdun/:customer_name', function(req, res) {
    console.log("in pnwreport_test /api/gdun route.");
  var cust_name = req.params.customer_name;
  customer.getGdun(cust_name, function(data){
    res.send(data);
  })
});

//POST /api/repbycust
router.post('/repbycust', function(req, res) {
  console.log("In Post Request Route");
  console.log(req.body.coName);
  customer.getGdun(req.body.coName, function(data){
        var repName = null;
        var i = 0;
        while(repName==null && i <data.length)
            {
                repName = data[i]["Sales Rep"]
                i++;
            }
    
        res.send(repName);
  })
});

// GET /api/srs
router.get('/srs/:gdun', function (req, res){
	
	console.log('In the router function');
	var gdun = req.params.gdun;
        sr.getSRs(gdun,function(data){
		res.send(data);
	})
});


// GET /api/srs_graph
router.get('/srs_graph/:gdun', function (req, res){
	
	console.log('In the router function');
	var gdun = req.params.gdun;
        sr.getSRs(gdun,function(data){
        var srs = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];
        var count = [0,0,0,0,0,0,0];
        var sev;
        for(var i = 0; i<data.rows.length; i++){
            sev = data.rows[i]["SEV"];
            helper.fillSrsCountArray(count, sev);
        }
        var plotData = {
            x:srs,
            y:count,
            type: 'bar'
              
        };   
        var layout = { title:  data.rows[0]["GLOBAL_DUNS_NAME"], yaxis: {title: "Number of SRS"}, xaxis: {title: "SRS by Customer"}};
        var thisGraph = data.rows[0]["GLOBAL_DUNS_NAME"]
        var graphOptions = {layout: layout, filename: "srsgraph"};
        plotly.plot(plotData, graphOptions, function (err, msg) {
	       if (err) return console.log(err);
	       console.log(msg);
            var img_url = msg.url + ".embed"; 
            res.send(img_url);
        });

	})
});



// GET /api/sev1s
router.get('/sev1s/:gdun', function (req, res){
	console.log('In the sev1 route');
	var gdun = req.params.gdun;
	sr.getSRs(gdun, function(data){
		sr.getSev1s(data, function (sev1s){
			res.send(sev1s);
			console.log('Number of S1s is: '+sev1s.length);
		});
	})
});

// GET /api/installs
router.get('/installs/:gdun', function (req, res){
	var gdun = req.params.gdun;
	ib.getInstalls(gdun, function(data){
		res.send(data);
	})
});


// GET /api/graph/installs
router.get('/graph/installs/:gdun', function (req, res){
	var gdun = req.params.gdun;
    console.log("in graph/installs route");
	ib.getInstalls(gdun, function(data){
        var today = new Date();
        var soonExpired = [];
        var models = [];
        var counts = [];
        var alreadyExpired = [];
        //console.log("this is the first model in data list: ", data.rows[0]["MODEL"]);
        for(var i=0; i<data.rows.length; i++){
            var index = models.indexOf(data.rows[i]["INSTANCE_PRODUCT_FAMILY"]);
            var expireString = data.rows[i]["CONTRACT_SUBLINE_END_DATE"];
            var expireDate = new Date(expireString);
            var upcoming;
            
            if(index<0)
            {
                models.push(data.rows[i]["INSTANCE_PRODUCT_FAMILY"]);
                counts.push(1);
                if(helper.futureDate(today,expireDate))
                {
                    upcoming = helper.dateDiffInDays(today,expireDate);
                    if(upcoming<=365 && upcoming>0)
                    {
                        alreadyExpired.push(0);
                        soonExpired.push(1);  
                    }
                    else
                    {
                        alreadyExpired.push(0);
                        soonExpired.push(0);
                    }
                        
                }
                else
                {
                    alreadyExpired.push(1);
                    soonExpired.push(0);
                    
                }
            }
                
        
            else
            {
                counts[index]= counts[index] +1;
                if(helper.futureDate(today,expireDate))
                {
                   upcoming = helper.dateDiffInDays(today,expireDate);
                   if(upcoming<=365 && upcoming>0)
                        soonExpired[index]++;  
                }
                else
                    alreadyExpired[index]++;
            
            }
        }
        
        var layout = { title:  data.rows[0]["CS_CUSTOMER_NAME"], yaxis: {title: "Number of Units"}, xaxis: {title: "Instance Product Family"}, barmode:"group"};
        var trace1 = 
            {
            x:models,
            y:counts,
            name: "Total Units",
            type: "bar"
           
        };
        var trace2 = 
            {
            x:models,
            y:soonExpired,
            name: "Expiring Soon",
            type: "bar"
           
        };
        var trace3 = 
            {
            x:models,
            y:alreadyExpired,
            name: "Expired",
            type: "bar"
           
        };
        var plotData = [trace1, trace2, trace3];
        var thisGraph = data.rows[0]["CS_CUSTOMER_NAME"]
        var graphOptions = {layout: layout, filename: "installgraph"};
        //var plotlyReturn = plotly.plot(plotData, graphOptions);
        plotly.plot(plotData, graphOptions, function (err, msg) {
            if(err) return console.log(err);
            console.log("in plotly call-back.");
            console.log(msg);
            var img_url = msg.url + ".embed"; 
            res.send(img_url);
            }); 
    })
});


// GET /api/graph/value
router.get('/graph/value/:gdun', function (req, res){
	var gdun = req.params.gdun;
    console.log("in graph/value route");
	ib.getInstalls(gdun, function(data){
        var today = new Date();
        var models = [];
        //var counts = [];
        var q1 = [];
        var q2 = [];
        var q3 = [];
        var q4 = [];
        //console.log("this is the first model in data list: ", data.rows[0]["MODEL"]);
        for(var i=0; i<data.rows.length; i++){
            
            // see if product was purchased within the last year
            var dateString = data.rows[i]["CONTRACT_SUBLINE_START_DATE"];
            var startDate = new Date(dateString);
            if(helper.pastYear(startDate, today))// if product was purchased in last year
                {
                    var index = models.indexOf(data.rows[i]["INSTANCE_PRODUCT_FAMILY"]);
                    var quarter = helper.whichQuarter(startDate);
            
                    if(index<0)
                    {
                        models.push(data.rows[i]["INSTANCE_PRODUCT_FAMILY"]);
                        helper.fillQuarterArrays(q1,q2,q3,q4,quarter,index);
                    }
                    else
                        helper.fillQuarterArrays(q1,q2,q3,q4,quarter,index);

                }
       
        }
     
        var layout = { title:  data.rows[0]["CS_CUSTOMER_NAME"] + " Sales in past two quarters from " + today, yaxis: {title: "Number of Units"}, xaxis: {title: "Instance Product Family"}, barmode:"group"};
        var trace1 = 
            {
            x:models,
            y:q1,
            name: "Q1",
            type: "bar"
           
        };
        var trace2 = 
            {
            x:models,
            y:q2,
            name: "Q2",
            type: "bar"
           
        };
        var trace3 = 
            {
            x:models,
            y:q3,
            name: "Q3",
            type: "bar"
           
        };
        var trace4 = 
            {
            x:models,
            y:q4,
            name: "Q4",
            type: "bar"
           
        };
        var plotData = [trace1, trace2, trace3, trace4];
        var thisGraph = data.rows[0]["CS_CUSTOMER_NAME"];
        var graphOptions = {layout: layout, filename: "value-graph"};
        //var plotlyReturn = plotly.plot(plotData, graphOptions);
        plotly.plot(plotData, graphOptions, function (err, msg) {
            if(err) return console.log(err);
            console.log("in plotly call-back.");
            console.log(msg);
            var img_url = msg.url + ".embed"; 
            res.send(img_url);
            }); 
    })
});

// GET /api/xtremio
router.get('/xtremio/:sn', function (req, res){
  console.log('Getting XtremIO data for '+req.params.sn);
	var sn = req.params.sn;
	xio.getXtremioPackages(sn, function(data){
		res.send(data);
		data = null;
	})
});

module.exports = router;
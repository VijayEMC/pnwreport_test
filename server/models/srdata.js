var httpntlm = require('httpntlm');
var config = require('../../config/config.json');
 

exports.getSRs = function(gdun,callback){
        
	console.log('Executing function in module');
	console.log('username is '+config.username);
	var srurl = config.srurl1+gdun+config.srurl2;
	console.log('url is ' + srurl);
	
	httpntlm.get({
		url: srurl,
		username: config.username,
	        password: config.password,
	        domain: config.domain
		 }, function (err, res){
			   if(err){
				     console.log(err);
				       console.log(res);
				         return err;
					   }

			     callback(JSON.parse(res.body));
			      })

}

exports.getSev1s = function(srs, callback){
	var result = new Array()
	for(var i = 0; i < srs.rows.length; i++){
		if(srs.rows[i]['Sev'] == 'S1'){
			console.log(srs.rows[i]);
			result.push(srs.rows[i]);
		}
	}
        callback(result);
}

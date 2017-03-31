var httpntlm = require('httpntlm');
var config = require('../../config/config.json');
 

exports.getInstalls = function(gdun,callback){
        
	console.log('Executing function in module');
	console.log('username is '+config.username);
	var installurl = config.installurl1+gdun+config.installurl2;
	console.log('url is ' + installurl);
	
	httpntlm.get({
		url: installurl,
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

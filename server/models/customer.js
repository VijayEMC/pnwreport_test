var httpntlm = require('httpntlm');
var config = require('../../config/config.json');

exports.getGdun = function(cust_name,callback){

  console.log('Executing function in customer.js');
  console.log('username is '+config.username);

  var custurl = config.custurl1 + escape(cust_name) + config.custurl2;
  console.log('url is ' + custurl);

  httpntlm.get({
    url: custurl,
    username: config.username,
          password: config.password,
          domain: config.domain
     }, function (err, res){
          if(err){
             console.log(err);
             console.log(res);
             return err;
          }
            var dummyArr = [];
            var arr = [];
            var results = JSON.parse(res.body);
            var j=0;
            for (var i=0; i<results['rows'].length; i++) {
              if (dummyArr.indexOf(results['rows'][i]['Global Duns Number']) === -1) {
                dummyArr.push(results['rows'][i]['Global Duns Number']);
                arr.push(results['rows'][i]);
              }
            }

            callback(arr);

        })

}

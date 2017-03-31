// commented out lines 62, 59 and 6
var httpntlm = require('httpntlm');
var config = require('../../config/config.json');
var cheerio = require('cheerio');
var AdmZip = require('adm-zip');
var parser = require('xml2json');

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

exports.getXtremioPackages = function(sn,callback){

  console.log('Executing function to get XIOPackage');
  console.log('username is '+config.username);
  var syrurl = config.syrurl+sn;
  console.log('url is ' + syrurl);

  httpntlm.get({
    url: syrurl,
    username: config.username,
    password: config.password,
    domain: config.domain
  }, function (err, res){
    if(err){
      console.log(err);
      console.log(res);
      return err;
    }

          var htmlString = String(res.body);
          var $ = cheerio.load(htmlString);
          console.log("File name is "+$('.jl td').eq(1).text().trim());
          var date = $('.jl td').eq(0).text().trim();
          var newdate = new Date(date);
          var month = ((newdate.getMonth()+1)>=10)? (newdate.getMonth()+1) : '0' + (newdate.getMonth()+1);
          var day = ((newdate.getDate())>=10)? (newdate.getDate()) : '0' + (newdate.getDate());
          var year = newdate.getFullYear();
          console.log("Month "+month+" Day "+day+" Year "+year);
          var file = $('.jl td').eq(1).text().trim();
          console.log(config.syrdl+year+'\\'+month+'\\'+day+'\\'+sn+'\\Configuration\\'+file)
          httpntlm.get({
            url: config.syrdl+year+'\\'+month+'\\'+day+'\\'+sn+'\\Configuration\\'+file,
            username: config.username,
            password: config.password,
            domain: config.domain,
            binary: true
          }, function(err, res){
            if(err){
              console.log(err);
              console.log(res);
              return err;
            }
              var zip = new AdmZip(res.body);
              var zipEntries = zip.getEntries();
              zipEntries.forEach(function(zipEntry) {
                if (zipEntry.entryName.endsWith(".txt")) {
                  console.log(zipEntry.toString()); // outputs zip entries information 
                  var xioXML = zip.readAsText(zipEntry).replace(/\[\]/g,"");
                  var xioFile = parser.toJson(xioXML);
                  zip = null
                  res = null
                  callback(xioFile);
                }
              });
            });
          });
}

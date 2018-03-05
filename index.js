/**
 * Created by zzm on 2017/07/26.
 */

var express = require('express');
var bodyParser = require('body-parser');
var superagent = require('superagent')
var crypto = require('crypto');
var config = require('./config');
var fs = require('fs');
var http = require('http');
// var https = require('https');

var app = express();

 
var HOST = config.BASE_API;
app.set('port', (config.PORT));


// 添加 body-parser 中间件读取json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  


/**
 * CORS support.
 */
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Credentials", "true");
  res.set('Access-Control-Allow-Methods', '*');
  // res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set("Access-Control-Allow-Headers", "Content-Type,ts_token");
  res.set("Access-Control-Expose-Headers", "*");
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.sendStatus(200);
  next();
});



/**
 * MD5
 */

function encrypParams(arr,json){
  //服务器写好的key
  var ts_key = config.TS_KEY;
  arr.sort();
    console.log("arr："+ JSON.stringify(arr));
  var s = "";
  for(var i = 0; i < arr.length; i++){
    for(var key in json){
      if(arr[i] == key){
        var value = json[key];//key所对应的value
        s += value+"_";
        break;
      }
    }
  }
  s += ts_key;
  console.log("MD5前 : "+s);
  return s;

}

function cryptMd5(password) {
  var md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
}


app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})



var urlencodedParser = bodyParser.urlencoded({ extended: true });



/***************************************************************************************************************************************** */

/**
 * 通用接口回调方法
 *
 */
function callback (req, res, superagentUrl, param) {
    console.log(superagentUrl+"请求开始：");
    console.log(JSON.stringify(req.body));
    var param = param || '';
    var arr = new Array();
    var json = req.body;
    var response = req.body;
    if(typeof(req.body) == 'object'){  
        Object.keys(req.body).forEach(function(item, index, array) {
            arr.push(item);
        });
    }
    var time = new Date().getTime();
    arr.push("time");
    json.time = time;
    var s = encrypParams(arr,json);
    var s_md5 = cryptMd5(s);  
    response.time = time;
    response.sign = s_md5;
    console.log("arr:"+JSON.stringify(arr));
    console.log("json:"+JSON.stringify(json));
    console.log("response:"+JSON.stringify(response));

    // 设置response编码为utf-8
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    var sreq = superagent.post(superagentUrl).send(response);
    sreq.pipe(res);
    sreq.on('end', function (error, res) {
        console.log(param + '请求完成');
        console.log("------------------我是分割线-----------------------");
    });
}


/**
 * 通用接口post方法
 *
 */

 var urlandalertstring = config.URLANDALERTSTRING;
 urlandalertstring.forEach(function(item, index, array){
    app.post('/api/'+item.url, urlencodedParser, function (req, res) {
        callback (req, res, HOST + req.originalUrl, item.alertstring)
    });
});

/***************************************************************************************************************************************** */


app.listen(app.get('port'), function() {
  console.log('node-proxy-api app is running on port', app.get('port'));
});

























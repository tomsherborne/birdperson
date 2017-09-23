/*** Require in modules here ***/
const express     = require('express');
const bodyParser  = require('body-parser');
const OAuth       = require('OAuth');
const keys        = require('./keys.js');
var app = express()

/** BUILT IN EXPRESS MIDDLEWARE **/
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req,res,next){req.mw_params = {};next()});

/** SET UP OAUTH AUTHENTICATION FOR TWITTER **/
var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      keys.TWITCONSUMERKEY,
      keys.TWITCONSUMERSECRET,
      '1.0A',
      null,
      'HMAC-SHA1'
);

/*
  IMPLEMENT GET REQUEST RESPONSE
*/
//app.get('/lookup', logreq, );

/*
  IMPLEMENT POST REQUEST RESPONSE
*/
app.post('/lookup',[logreq, makeTwitterRequest]);
/*
  POST REQUEST FLOW ->
      loqreq
      make twitter request
      process twitter return
      make watson request
      process watson request
      send back data

use req.locals to pass data between middleware
*/

function logreq(req, res, next){
  console.log('LOGREQ METHOD: ', req.method);
  console.log('LOGREQ    URL: ', req.url);
  console.log('LOGREQ HANDLE: ', req.body.search ? req.body.search : 'None');
  next();
}

function makeTwitterRequest(req, res, next) {

  oauth.get(
    'https://api.twitter.com/1.1/trends/place.json?id=23424977',
    keys.TWITACCESSTOKEN,
    keys.TWITACCESSTOKENSECRET,
    function (e, tdata, tres){
      if (e) console.error(e);
      req.mw_params.twit = JSON.parse(tdata);
      res.send(req.mw_params.twit);
    });
  //test in Postman on `POST localhost:8080/lookup`
}

/*
  LEGACY FUNCTION FROM DAY-4 WORK

function sendData(req, res, next){
  if(req.path == '/events') {
    res.send(events);
  }
  else if(req.path == '/activities')
    res.send(activities);
  }

function searchData(req, res, next) {
  var searchKey = req.body.search ? req.body.search: 'work';

  console.log("searchKey: ",searchKey);
  console.log("path: ",req.path);

  if(req.path == '/events') {
    page=events;
  }
  else if(req.path == '/activities') {
    page=activities;
  }

  searchOutput = page.filter(elem => Object.values(elem).includes(searchKey)==true);
  console.log(searchOutput)
  res.send(searchOutput)
}
*/

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.listen(port,function() {
    console.log('Our app is running on http://localhost:' + port);
});

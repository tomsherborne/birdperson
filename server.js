/*** Require in modules here ***/
const express = require('express');
const bodyParser = require('body-parser'); // Uncomment for Bonus Challenge 1
const keys = require('./keys.js');

var app = express()

/*** Use built-in Express middleware here ***/
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
  IMPLEMENT GET REQUEST RESPONSE
*/
//app.get('/lookup', logreq, );

/*
  IMPLEMENT POST REQUEST RESPONSE

//app.post('/lookup', logreq,);

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
  console.log('LOGREQ METHOD: ',req.method);
  console.log('LOGREQ    URL: ',req.url);
  console.log('LOGREQ HANDLE:' ,req.body.search);
  next();
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

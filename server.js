/*** Require in modules here ***/
const express     = require('express');
const bodyParser  = require('body-parser');
const OAuth       = require('OAuth');
const keys        = require('./keys.js');
var app = express();

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
//app.post('/lookup',[logreq, makeTwitterRequest, buildResponse]);
app.post('/lookup',[logreq, mockResponse]);
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

const testparams = {
  "dummyhandle":"ElizabethUKRPG",
};

function makeTwitterRequest(req, res, next) {
  oauth.get(
    `https://api.twitter.com/1.1/users/show.json?screen_name=${testparams.dummyhandle}`,
    keys.TWITACCESSTOKEN,
    keys.TWITACCESSTOKENSECRET,
    function (e, tdata, tres){
      if (e) console.error(e);
      req.mw_params.profile = JSON.parse(tdata);
      next();
    });
  //test in Postman on `POST localhost:8080/lookup`
}


/* FRONT END DUMMY OBJECTS */
function mockResponse(req, res, next) {
  res.send(fakeReply);
}

function buildResponse(req, res, next) {
  let profile = req.mw_params.profile;
  let watsonPerson = req.mw_params.watsonPerson;
  let watsonRetweet = req.mw_params.watsonRetweet;

  const reply = {
    'handle':profile.screen_name,
    'name':profile.name,
    'description':profile.description,
    'url':profile.url,
    'tweets':[
      {
          //'id':profile.status.id,
          //'text':profile.status.text,
          'dummy':'object',
      }
    ],
    "emotion_profile":{
      "anger":watsonPerson.document_tone.tone_categories[0].tones[0].tone_id,
      "disgust":watsonPerson.document_tone.tone_categories[0].tones[1].tone_id,
      "fear":watsonPerson.document_tone.tone_categories[0].tones[2].tone_id,
      "joy":watsonPerson.document_tone.tone_categories[0].tones[3].tone_id,
      "sadness":watsonPerson.document_tone.tone_categories[0].tones[4].tone_id,
    },
    'retweets':[
      {
          //'id':profile.status.id,
          //'text':profile.status.text,
          'dummy':'object',
      }
    ],
    "retweets_emotion_profile":{
      "anger":watsonRetweet.document_tone.tone_categories[0].tones[0].tone_id,
      "disgust":watsonRetweet.document_tone.tone_categories[0].tones[1].tone_id,
      "fear":watsonRetweet.document_tone.tone_categories[0].tones[2].tone_id,
      "joy":watsonRetweet.document_tone.tone_categories[0].tones[3].tone_id,
      "sadness":watsonRetweet.document_tone.tone_categories[0].tones[4].tone_id,
    },
  };

  res.send(reply);
}
const fakeReply = {
    "handle": "ElizabethUKRPG",
    "name": "Queen Elizabeth II",
    "description": "The official Twitter profile for Her Majesty Queen Elizabeth II of the United Kingdom in UKRPG.",
    "url": "https://t.co/6tw27Wj1lW",
    "tweets": [
        {
            "dummy": "object"
        }
    ],
    "emotion_profile": {
        "anger": 0.58,
        "disgust": 0.47,
        "fear": 0.55,
        "joy": 0.64,
        "sadness": 0.19
    },
    "retweets": [
        {
            "dummy": "object"
        }
    ],
    "retweets_emotion_profile": {
        "anger": 0.99,
        "disgust": 0.11,
        "fear": 0.02,
        "joy": 0.45,
        "sadness": 0.3
    }
}


/*
  LEGACY LINES FROM DAY-4 WORK
//  var searchKey = req.body.search ? req.body.search: 'work';
*/

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.listen(port,function() {
    console.log('Our app is running on http://localhost:' + port);
});

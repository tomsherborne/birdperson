/*** Require in modules here ***/
const express = require('express');
const bodyParser = require('body-parser');
const OAuth = require('OAuth');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const keys = require('./keys.js');
var app = express();

/** API ENDPOINTS **/
const TWITTER_REQUEST_ENDPOINT_PERSON = 'https://api.twitter.com/1.1/users/show.json?';
const TWITTER_REQUEST_ENDPOINT_TWEETS = 'https://api.twitter.com/1.1/statuses/user_timeline.json?';
const TWITTER_REQUEST_ENDPOINT_MENTIONS = 'https://api.twitter.com/1.1/search/tweets.json?';
const WATSON_TONE_ANALYZER_URL = 'https://gateway.watsonplatform.net/tone-analyzer/api';

/** BUILT IN EXPRESS MIDDLEWARE **/
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    req.mw_params = {};
    next()
});

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

/** SET UP WATSON OBJECT **/
const toneAnalyzer = new ToneAnalyzerV3({
    'username': keys.WATSONUSER,
    'password': keys.WATSONPW,
    'version_date': '2016-05-20',
    'url': WATSON_TONE_ANALYZER_URL,
    'use_unauthenticated': false
});

/*
  IMPLEMENT POST REQUEST RESPONSE
*/
app.post('/lookup', [logreq,
    makeTwitterRequestPerson,
    makeTwitterRequestTweets,
    makeWatsonRequestTweets,
    makeTwitterRequestMentions,
    makeWatsonRequestMentions,
    donezo
    //buildResponse
]);

//app.post('/lookup',[logreq, mockResponse]); % FOR FRONT END TESTING
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

function logreq(req, res, next) {
    console.log('LOG: METHOD: ', req.method);
    console.log('LOG: URL: ', req.url);
    console.log('LOG: HANDLE: ', req.body.search);
    next();
}

function makeTwitterRequest(endpoint) {
    return new Promise((resolve, reject) => {
        oauth.get(
            endpoint,
            keys.TWITACCESSTOKEN,
            keys.TWITACCESSTOKENSECRET,
            function (e, tdata, tres) {
                if (e) {
                    reject(e);
                } else {
                    console.log(`LOG: SUCCESSFUL AT ${endpoint}`);
                    resolve(JSON.parse(tdata));
                }
            });
    });
}

function makeWatsonRequest(dialog) {
    return new Promise((resolve, reject) => {
        toneAnalyzer.tone({
            'text': dialog
        }, (err, res) => {
            if (err) reject(err);
            else {
                console.log(`LOG: SUCCESSFUL AT ${WATSON_TONE_ANALYZER_URL}`);
                resolve(res);
            }
        }); //end Watson Call
    }); //end promise
}

function makeWatsonRequestTweets(req, res, next) {
    makeWatsonRequest(req.mw_params.dialog_watson_person)
        .then(response => {
            req.mw_params['watsonPerson'] = response.document_tone;
            next()
        })
        .catch(e => console.error('ERROR: ', e));
}

function makeWatsonRequestMentions(req, res, next) {
    makeWatsonRequest(req.mw_params.dialog_watson_mention)
        .then(response => {
            console.log(response);
            req.mw_params['watsonMentions'] = response;
            res.send(response.document_tone);
            //next()
        })
        .catch(e => console.error('ERROR: ', e));
}

function makeTwitterRequestPerson(req, res, next) {
    makeTwitterRequest(TWITTER_REQUEST_ENDPOINT_PERSON + `screen_name=${req.body.search}`)
        .then(response => {
            req.mw_params['profile'] = response;
            next()
        })
        .catch(e => console.error('ERROR: ', e));
}

function makeTwitterRequestTweets(req, res, next) {
    makeTwitterRequest(TWITTER_REQUEST_ENDPOINT_TWEETS + `screen_name=${req.body.search}`)
        .then(response => {
            req.mw_params['tweets'] = response;
            req.mw_params.dialog_watson_person = JSON.parse(JSON.stringify(req.mw_params['tweets']))
                .map(elem => elem.text)
                .join('\n');
            next();
        })
        .catch(e => console.error('ERROR: ', e));
}

function makeTwitterRequestMentions(req, res, next) {
    makeTwitterRequest(TWITTER_REQUEST_ENDPOINT_MENTIONS + `count=100&include_entities=false&q=${req.body.search}`)
        .then(response => {
            req.mw_params['mentions'] = response;
            req.mw_params.dialog_watson_mention = response.statuses.map(elem => elem.text)
                .join('\n');
            next();
        })
        .catch(e => console.error('ERROR: ', e));
}

function donezo(req, res, next) {
    console.log('done');
    res.send({
        'hello': 'done'
    });
}

function buildResponse(req, res, next) {
    let profile = req.mw_params.profile;
    let tweets = req.mw_params.tweets;
    let mentions = req.mw_params.mentions;

    let watsonPerson = req.mw_params.watsonPerson;
    //let watsonMention = req.mw_params.watsonMention;
    let tmp = watsonPerson.document_tone.tone_categories[0].tones;

    const reply = {
        'handle': profile.screen_name,
        'name': profile.name,
        'description': profile.description,
        'url': profile.url,
        'user_id': profile.id,
        'img': profile.profile_image_url_https,
        'tweets': req.mw_params['tweets'].map(function (elem) {
            return {
                //'text':elem.text,
                'id': elem.id,
                'id_str': elem.id_str,
            }
        }),
        "emotion_profile": watsonPerson.tone_categories[0].tones.map(
            function (elem) {
                return {
                    'tone': elem.tone_id,
                    'score': elem.score,
                }
            }),
        /*
        'mentions':[
          {
              //'id':profile.status.id,
              //'text':profile.status.text,
              'dummy':'object',
          }
        ],
        "mentions_emotion_profile":{
          "anger":watsonMention.document_tone.tone_categories[0].tones[0].tone_id,
          "disgust":watsonMention.document_tone.tone_categories[0].tones[1].tone_id,
          "fear":watsonMention.document_tone.tone_categories[0].tones[2].tone_id,
          "joy":watsonMention.document_tone.tone_categories[0].tones[3].tone_id,
          "sadness":watsonMention.document_tone.tone_categories[0].tones[4].tone_id,
        },
        */
    };

    res.send(reply);
}

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});

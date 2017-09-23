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
    "handle": "big_ben_clock",
    "name": "Big Ben",
    "description": "The first, established November 2009 & entirely unofficial. Copyright details here: http://t.co/q8UCMopfd5, but still apparently imitated everywhere.",
    "url": null,
    "user_id": 86391789,
    "img": "https://pbs.twimg.com/profile_images/815357737290895360/Mo8gacuC_normal.jpg",
    "tweets": [
        {
            "id": 911666990913396700,
            "id_str": "911666990913396736"
        },
        {
            "id": 911651384176541700,
            "id_str": "911651384176541701"
        },
        {
            "id": 911636284959010800,
            "id_str": "911636284959010816"
        },
        {
            "id": 911621692321075200,
            "id_str": "911621692321075202"
        },
        {
            "id": 911606085617946600,
            "id_str": "911606085617946631"
        },
        {
            "id": 911590989361504300,
            "id_str": "911590989361504256"
        },
        {
            "id": 911576648163655700,
            "id_str": "911576648163655680"
        },
        {
            "id": 911561041628336100,
            "id_str": "911561041628336128"
        },
        {
            "id": 911546195025301500,
            "id_str": "911546195025301504"
        },
        {
            "id": 911530590570246100,
            "id_str": "911530590570246146"
        },
        {
            "id": 911515742083969000,
            "id_str": "911515742083969024"
        },
        {
            "id": 911500392508411900,
            "id_str": "911500392508411906"
        },
        {
            "id": 911485544579960800,
            "id_str": "911485544579960835"
        },
        {
            "id": 911470190243741700,
            "id_str": "911470190243741696"
        },
        {
            "id": 911455093454721000,
            "id_str": "911455093454721024"
        },
        {
            "id": 911440245383663600,
            "id_str": "911440245383663616"
        },
        {
            "id": 911424893648064500,
            "id_str": "911424893648064513"
        },
        {
            "id": 911409793750925300,
            "id_str": "911409793750925312"
        },
        {
            "id": 911395200978899000,
            "id_str": "911395200978898947"
        },
        {
            "id": 911379846479171600,
            "id_str": "911379846479171585"
        }
    ],
    "emotion_profile": [
        {
            "tone": "anger",
            "score": 0.822508
        },
        {
            "tone": "disgust",
            "score": 0.198166
        },
        {
            "tone": "fear",
            "score": 0.09078
        },
        {
            "tone": "joy",
            "score": 0.23959
        },
        {
            "tone": "sadness",
            "score": 0.147723
        }
    ],
    "mentions": [
        {
            "id": 911676359205953500,
            "id_str": "911676359205953536"
        },
        {
            "id": 911671087133597700,
            "id_str": "911671087133597697"
        },
        {
            "id": 911670540074700800,
            "id_str": "911670540074700801"
        },
        {
            "id": 911667168550547500,
            "id_str": "911667168550547458"
        },
        {
            "id": 911666990913396700,
            "id_str": "911666990913396736"
        },
        {
            "id": 911666515463819300,
            "id_str": "911666515463819264"
        },
        {
            "id": 911659297855148000,
            "id_str": "911659297855148032"
        },
        {
            "id": 911656537856278500,
            "id_str": "911656537856278534"
        },
        {
            "id": 911652533608812500,
            "id_str": "911652533608812556"
        },
        {
            "id": 911652131144392700,
            "id_str": "911652131144392704"
        },
        {
            "id": 911651411741552600,
            "id_str": "911651411741552641"
        },
        {
            "id": 911651384176541700,
            "id_str": "911651384176541701"
        },
        {
            "id": 911638592283402200,
            "id_str": "911638592283402240"
        },
        {
            "id": 911636673334739000,
            "id_str": "911636673334738945"
        },
        {
            "id": 911636309852254200,
            "id_str": "911636309852254209"
        },
        {
            "id": 911636284959010800,
            "id_str": "911636284959010816"
        },
        {
            "id": 911628518408310800,
            "id_str": "911628518408310784"
        },
        {
            "id": 911622271353196500,
            "id_str": "911622271353196544"
        },
        {
            "id": 911621692321075200,
            "id_str": "911621692321075202"
        },
        {
            "id": 911621572565364700,
            "id_str": "911621572565364737"
        },
        {
            "id": 911621209078616000,
            "id_str": "911621209078616064"
        },
        {
            "id": 911608422533038100,
            "id_str": "911608422533038081"
        },
        {
            "id": 911606108522983400,
            "id_str": "911606108522983424"
        },
        {
            "id": 911606085617946600,
            "id_str": "911606085617946631"
        },
        {
            "id": 911598743312461800,
            "id_str": "911598743312461824"
        },
        {
            "id": 911593398334902300,
            "id_str": "911593398334902272"
        },
        {
            "id": 911591004482015200,
            "id_str": "911591004482015232"
        },
        {
            "id": 911590989361504300,
            "id_str": "911590989361504256"
        },
        {
            "id": 911584728200904700,
            "id_str": "911584728200904704"
        },
        {
            "id": 911583531767357400,
            "id_str": "911583531767357440"
        },
        {
            "id": 911580730303664100,
            "id_str": "911580730303664128"
        },
        {
            "id": 911579982807396400,
            "id_str": "911579982807396352"
        },
        {
            "id": 911576648163655700,
            "id_str": "911576648163655680"
        },
        {
            "id": 911575907478966300,
            "id_str": "911575907478966272"
        },
        {
            "id": 911564552600522800,
            "id_str": "911564552600522753"
        },
        {
            "id": 911562223738327000,
            "id_str": "911562223738327041"
        },
        {
            "id": 911561041628336100,
            "id_str": "911561041628336128"
        },
        {
            "id": 911560804134203400,
            "id_str": "911560804134203394"
        },
        {
            "id": 911560610873315300,
            "id_str": "911560610873315328"
        },
        {
            "id": 911546195025301500,
            "id_str": "911546195025301504"
        },
        {
            "id": 911545705415749600,
            "id_str": "911545705415749632"
        },
        {
            "id": 911530601861304300,
            "id_str": "911530601861304320"
        },
        {
            "id": 911530590570246100,
            "id_str": "911530590570246146"
        },
        {
            "id": 911526933665591300,
            "id_str": "911526933665591296"
        },
        {
            "id": 911516598896332800,
            "id_str": "911516598896332801"
        },
        {
            "id": 911516150638481400,
            "id_str": "911516150638481408"
        },
        {
            "id": 911515742083969000,
            "id_str": "911515742083969024"
        },
        {
            "id": 911509057659433000,
            "id_str": "911509057659432960"
        },
        {
            "id": 911500488520106000,
            "id_str": "911500488520105984"
        },
        {
            "id": 911500403057053700,
            "id_str": "911500403057053696"
        },
        {
            "id": 911500392508411900,
            "id_str": "911500392508411906"
        },
        {
            "id": 911497641162428400,
            "id_str": "911497641162428416"
        },
        {
            "id": 911496603927793700,
            "id_str": "911496603927793664"
        },
        {
            "id": 911496533295730700,
            "id_str": "911496533295730688"
        },
        {
            "id": 911486387366584300,
            "id_str": "911486387366584320"
        },
        {
            "id": 911485544579960800,
            "id_str": "911485544579960835"
        },
        {
            "id": 911470200112975900,
            "id_str": "911470200112975872"
        },
        {
            "id": 911470190243741700,
            "id_str": "911470190243741696"
        },
        {
            "id": 911455307221499900,
            "id_str": "911455307221499904"
        },
        {
            "id": 911455101499445200,
            "id_str": "911455101499445249"
        },
        {
            "id": 911455093454721000,
            "id_str": "911455093454721024"
        },
        {
            "id": 911440245383663600,
            "id_str": "911440245383663616"
        },
        {
            "id": 911440191247863800,
            "id_str": "911440191247863808"
        },
        {
            "id": 911439998540533800,
            "id_str": "911439998540533760"
        },
        {
            "id": 911438292540936200,
            "id_str": "911438292540936193"
        },
        {
            "id": 911437262969286700,
            "id_str": "911437262969286656"
        },
        {
            "id": 911434920970428400,
            "id_str": "911434920970428416"
        },
        {
            "id": 911434656817455100,
            "id_str": "911434656817455104"
        },
        {
            "id": 911431671861452800,
            "id_str": "911431671861452800"
        },
        {
            "id": 911424896353407000,
            "id_str": "911424896353406977"
        },
        {
            "id": 911424893648064500,
            "id_str": "911424893648064513"
        },
        {
            "id": 911413556083609600,
            "id_str": "911413556083609603"
        },
        {
            "id": 911411870657073200,
            "id_str": "911411870657073153"
        },
        {
            "id": 911410871003340800,
            "id_str": "911410871003340801"
        },
        {
            "id": 911410485022609400,
            "id_str": "911410485022609413"
        },
        {
            "id": 911409798293409800,
            "id_str": "911409798293409793"
        },
        {
            "id": 911409793750925300,
            "id_str": "911409793750925312"
        },
        {
            "id": 911409249934245900,
            "id_str": "911409249934245888"
        },
        {
            "id": 911405891865497600,
            "id_str": "911405891865497602"
        },
        {
            "id": 911395755813953500,
            "id_str": "911395755813953536"
        },
        {
            "id": 911395200978899000,
            "id_str": "911395200978898947"
        },
        {
            "id": 911394730893824000,
            "id_str": "911394730893824000"
        },
        {
            "id": 911392432813731800,
            "id_str": "911392432813731840"
        },
        {
            "id": 911383220616355800,
            "id_str": "911383220616355842"
        },
        {
            "id": 911381965215031300,
            "id_str": "911381965215031296"
        },
        {
            "id": 911380455940816900,
            "id_str": "911380455940816896"
        },
        {
            "id": 911379846479171600,
            "id_str": "911379846479171585"
        },
        {
            "id": 911379631252664300,
            "id_str": "911379631252664320"
        },
        {
            "id": 911376129205968900,
            "id_str": "911376129205968898"
        },
        {
            "id": 911375031372075000,
            "id_str": "911375031372075010"
        },
        {
            "id": 911366844287717400,
            "id_str": "911366844287717376"
        },
        {
            "id": 911364747991363600,
            "id_str": "911364747991363584"
        },
        {
            "id": 911364532144152600,
            "id_str": "911364532144152576"
        },
        {
            "id": 911359592944283600,
            "id_str": "911359592944283648"
        },
        {
            "id": 911350667675160600,
            "id_str": "911350667675160576"
        },
        {
            "id": 911350010998116400,
            "id_str": "911350010998116353"
        },
        {
            "id": 911349430779072500,
            "id_str": "911349430779072512"
        },
        {
            "id": 911349394108305400,
            "id_str": "911349394108305409"
        },
        {
            "id": 911346994156900400,
            "id_str": "911346994156900354"
        },
        {
            "id": 911345245010501600,
            "id_str": "911345245010501632"
        }
    ],
    "mentions_emotion_profile": [
        {
            "tone": "anger",
            "score": 0.504552
        },
        {
            "tone": "disgust",
            "score": 0.124542
        },
        {
            "tone": "fear",
            "score": 0.08124
        },
        {
            "tone": "joy",
            "score": 0.555573
        },
        {
            "tone": "sadness",
            "score": 0.167305
        }
    ]
}

/*
  LEGACY LINES FROM DAY-4 WORK
//  var searchKey = req.body.search ? req.body.search: 'work';
*/

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3001;

app.listen(port,function() {
    console.log('Our app is running on http://localhost:' + port);
});

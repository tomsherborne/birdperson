const keys = require('./keys.js')



function main(params) {
  return new Promise(function (resolve, reject) {
    var res = {};

    const ToneAnalyzerV3 =
      require('watson-developer-cloud/tone-analyzer/v3');

    var url = params.url || 'https://gateway.watsonplatform.net/tone-analyzer/api' ;
    var use_unauthenticated =  params.use_unauthenticated || false ;

    const tone_analyzer = new ToneAnalyzerV3({
      'username': params.username,
      'password': params.password,
      'version_date': '2016-05-20',
      'url' : url,
      'use_unauthenticated': use_unauthenticated
    });

    tone_analyzer.tone({'text': params.textToAnalyze}, function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
}

const defaultParameters = {
  'textToAnalyze': 'In substance PM May is bringing no more clarity to London\'s positions. I am even more concerned now. #florencespeech',
  'username':      '60db72b0-38ed-4e28-bd34-4453f6907220',
  'password':      'GIyYdgz8omao',
  'url' : 'https://gateway.watsonplatform.net/tone-analyzer/api',
  'use_unauthenticated' : false
}

if (require.main === module)
  main(defaultParameters)
    .then((results) => console.log(JSON.stringify(results, null, 2)))
    .catch((error) => console.log(error.message));
 
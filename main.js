const main = document.getElementById('main');

var header = document.createElement('div');
header.id = 'header';
header.className = 'header';
main.appendChild(header);

var title = document.createElement('div');
title.id= 'title';
title.class= 'class';
title.textContent = 'Bird Person'
header.appendChild(title);

var textInput = document.createElement("input");
textInput.setAttribute("type"  , "text");
textInput.setAttribute("value" , "");
textInput.setAttribute("size", "50");
textInput.className = 'searchBar';
header.appendChild(textInput);

var button1 = document.createElement("input");
button1.setAttribute("type", "button");
button1.setAttribute("value", "Search");
button1.className = "buttonz";
button1.id = "button1";
header.appendChild(button1);

var leftC = document.createElement('div');
leftC.id = 'leftDiv';
leftC.className = 'leftC'
main.appendChild(leftC);

var rightC = document.createElement('div');
rightC.id = 'rightDiv';
rightC.className = 'rightC'
main.appendChild(rightC);


function remove(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}



$("#button1").click(function(){
  $.post("http://localhost:3001/lookup", function (responseData,textStatus) {
    
    if ($('#example').find('#test').length){

    }else{
        remove('rightDiv');
        remove('leftDiv');
        var leftC = document.createElement('div');
        leftC.id = 'leftDiv';
        leftC.className = 'leftC'
        main.appendChild(leftC);
        
        var rightC = document.createElement('div');
        rightC.id = 'rightDiv';
        rightC.className = 'rightC'
        main.appendChild(rightC);
    }
    
    //
    // Profile log
    //


    var profile = document.createElement('img');
    profile.id= "profilepic";
    profile.class = "img";
    profile.src = responseData.img;
    leftC.appendChild(profile);

    var name = document.createElement('div');
    name.setAttribute('style', 'white-space: pre;');
    name.className = 'class';
    name.textContent = responseData.name;
    leftC.appendChild(name);

    var bio = document.createElement('div');
    bio.id = 'bio';
    bio.className = 'class bio';
    bio.textContent = "Bio : " +responseData.description;
    leftC.appendChild(bio);

    //
    // tweets and chart display
    //
    var divTweeting = document.createElement('div')
    divTweeting.className = 'subTitle'
    divTweeting.textContent = 'Analysing top 10 tweets for ' + responseData.name;
    rightC.appendChild(divTweeting)

    var tweeting = document.createElement('div');
    tweeting.className = 'class tweeting'
    tweeting.style = "overflow-y: scroll; height:300px;"
    tweeting.id = 'tweeting';
    rightC.appendChild(tweeting);

    var chart = document.createElement('div');
    chart.className = 'class chart';

    rightC.appendChild(chart);

    var ctx = document.createElement('canvas');
    ctx.id = "myChart";
    ctx.width = "200px";
    ctx.height = "200px";

    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ["Anger", "Disgust", "Fear", "Joy", "Sadness"],
            datasets: [{
                label: '# of Votes',
                data: [responseData.emotion_profile[0].score, responseData.emotion_profile[1].score, responseData.emotion_profile[2].score, responseData.emotion_profile[3].score, responseData.emotion_profile[4].score],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)'
                ],
                borderWidth: 3
            }]
        },

    });
    chart.appendChild(ctx);

    

    for(let i = 0; i < 5; i++){
    var tweetArr = document.createElement('div');
    tweetArr.className = 'tweet';
    tweetArr.id = responseData.tweets[i].id_str;
    tweeting.appendChild(tweetArr);
    }
     
    //
    // this is for mentions
    //

    var divMentions = document.createElement('div')
    divMentions.className = 'subTitle'
    divMentions.textContent = 'Analysing top 10 mentions for ' + responseData.name;
    rightC.appendChild(divMentions)

    var mentions = document.createElement('div');
    mentions.className = 'class tweeting'
    mentions.style = "overflow-y: scroll; height:300px;"
    mentions.id = 'tweeting';
    rightC.appendChild(mentions);

    var chart = document.createElement('div');
    chart.className = 'class chart';

    rightC.appendChild(chart);

    var ctx = document.createElement('canvas');
    ctx.id = "myChart";
    ctx.width = "200px";
    ctx.height = "200px";

    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ["Anger", "Disgust", "Fear", "Joy", "Sadness"],
            datasets: [{
                label: '# of Votes',
                data: [responseData.mentions_emotion_profile[0].score, responseData.mentions_emotion_profile[1].score, responseData.mentions_emotion_profile[2].score, responseData.mentions_emotion_profile[3].score, responseData.mentions_emotion_profile[4].score],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)'
                ],
                borderWidth: 3
            }]
        },

    });
    chart.appendChild(ctx);

    

    for(let i = 0; i < 5; i++){
    var mentionArr = document.createElement('div');
    mentionArr.className = 'tweet';
    mentionArr.id = responseData.mentions[i].id_str;
    mentions.appendChild(mentionArr);
    }

    //
    // mentions ends
    //

    var tweets = jQuery(".tweet");

    jQuery(tweets).each( function( t, tweet ) { 

        var id = jQuery(this).attr('id');

        twttr.widgets.createTweet(
        id, tweet, 
        {
            conversation : 'none',    // or all
            cards        : 'hidden',  // or visible 
            linkColor    : '#cc0000', // default is blue
            theme        : 'light'    // or dark
        });

    });
        
        
  })
})


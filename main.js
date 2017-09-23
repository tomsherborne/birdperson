const main = document.getElementById('main');
//main.innerHTML = `<p>If you see this, then main.js has loaded.</p>
//<p>If the text is blue, then the style.css has loaded.</p>`;
var textInput = document.createElement("input");
textInput.setAttribute("type"  , "text");
textInput.setAttribute("value" , "");
textInput.setAttribute("size", "50");
main.appendChild(textInput);
var button1 = document.createElement("input");
button1.setAttribute("type", "button");
button1.setAttribute("value", "Activities");
button1.id = "button1";
main.appendChild(button1);
var newDiv = document.createElement("div");
newDiv.id = "stuff";

$("#button1").click(function(){
  $.ajax({
    type: 'POST',
    url:'./lookup',
    data: {
      "search" : textInput.value
    },
    dataType: 'json',
    success: function(responseData,textStatus) {
      console.log('responseData: ',responseData);
      console.log('status: ',textStatus);
    },
    crossDomain: true,
  });
})

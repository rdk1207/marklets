var handleResponse = function(){
  //if successful redirect to new marklet page
  if(this.status === 200){
    var resp = JSON.parse(this.responseText);
    window.location = '/page/' + resp.id;
  }
};

var init = function(){
  
  //grab the important elements
  var submitElement = document.querySelector('#submit');
  var markdownElement = document.querySelector('#markdown');
  var passphraseElement = document.querySelector('#passphrase'); 
  
  var submitData = function(){
    //data to send to server
    var data = JSON.stringify({
      markdown: markdownElement.value,
      passphrase: passphraseElement.value
    });

    var req = new XMLHttpRequest();
    req.addEventListener('load', handleResponse);
    req.open('POST', '/addpage');
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);
  };

  //attach ajax post call to button
  submitElement.addEventListener('click', submitData);
};

window.addEventListener('DOMContentLoaded', init);
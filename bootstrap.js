function loadScript(name) {
  var element = document.createElement('script');

  element.src = chrome.extension.getURL(name);
  element.onload = function() {
      this.parentNode.removeChild(this);
  };
  (document.head||document.documentElement).appendChild(element);
}

function loadCss(name) {
  var element = document.createElement('link');
  
  element.rel = "stylesheet";
  
  element.href = chrome.extension.getURL(name);
  (document.head||document.documentElement).appendChild(element);
}

loadCss("style.css");

loadScript("q.js");
loadScript("angular.js");

setTimeout(function() {
  loadScript("angular.ext.js");
  loadScript("script.js");
});
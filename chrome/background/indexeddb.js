var db;
var transaction = {
  web: null
};
const request = indexedDB.open("MeleakDatabase", 3);

request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;

  var webStore = db.createObjectStore("web", { keyPath: "url" });
  var pageStore = db.createObjectStore("page", { keyPath: "web" });
  var usageStore = db.createObjectStore("usage", { keyPath: "page" });

  transaction.web = db.transaction(["web"], "readwrite");
  transaction.web.oncomplete = function(event) {
    console.log("Data stored to web");
  };
  transaction.web.onerror = function(event) {
    console.error(event)
  };
};
function attached(tab = { id: 0, url: '' }) {
  changeUrl(tab.url)

  chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log(details)
  }, url);
}

function startDebugger(payload = { 
  tab: { 
    id: 0, 
    url: '' 
  } 
}) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId: payload.tab.id }, VERSION, attached.bind(null, payload.tab))
}
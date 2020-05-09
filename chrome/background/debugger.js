function pageUpdated(details) {
  console.log(details)
}

const boundPageUpdated = pageUpdated.bind(null)  

function attached(tab = { id: 0, url: '' }) {
  changeUrl(tab.url)

  chrome.webNavigation.onHistoryStateUpdated.addListener(boundPageUpdated, url);
}

function detached(tab = { id: 0, url: '' }) {
  chrome.webNavigation.onHistoryStateUpdated.removeListener(boundPageUpdated);
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

function stopDebugger(payload = { 
  tab: { 
    id: 0, 
    url: '' 
  } 
}) {
  chrome.debugger.detach({ tabId: payload.tab.id }, detached.bind(null, payload.tab))
}
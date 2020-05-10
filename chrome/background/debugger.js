function pageUpdated(details = { frameId: 0, parentFrameId: -1, processId: 0, tabId: 0, timeStamp: 0, transitionQualifiers: [], transitionType: '', url: '' }) {
  console.log(new Date(details.timeStamp).toISOString(), new URL(details.url))
}

const boundPageUpdated = pageUpdated.bind(null)

function attached(tab = { id: 0, url: '' }) {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError.message)
  }

  changeUrl(tab.url)

  const newUrl = new URL(tab.url)
  const time = new Date().toISOString()

  console.log(time, newUrl.origin)

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

chrome.debugger.onDetach.addListener(function (source = { tabId: 0 }, reason) {
  detached()
})
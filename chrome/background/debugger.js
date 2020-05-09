function attached(tab = { id: 0, url: '' }) {
  console.log('started', tab)
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
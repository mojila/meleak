async function heapCallback (heapUsage) {
  console.log(heapUsage)
}

async function attached () {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }
}

async function clicked (tab) {
  const VERSION = '1.0'

  await chrome.debugger.attach({ tabId: tab.id }, VERSION, attached.bind(null, tab.id))
  chrome.debugger.sendCommand({ tabId: tab.id }, 'Runtime.getHeapUsage', heapCallback)
}

chrome.browserAction.onClicked.addListener(clicked)
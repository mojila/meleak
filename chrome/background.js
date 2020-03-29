const ACTIONS = {
  attachDebugger: 'attach_debugger',
  detachDebugger: 'detach_debugger'
}

const attached = async () => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }
  chrome.browserAction.setIcon({ path: 'icon-active.png' })
}

async function attachToDebugger (tabId) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId }, VERSION, attached.bind(null, tabId))
}

async function detached () {
  chrome.browserAction.setIcon({ path: 'icon.png' })
} 

async function detachFromDebugger (tabId) {
  chrome.debugger.detach({ tabId }, detached)
}

async function messageIncoming ({ action, payload }, _sender, _sendResponse) {
  switch (action) {
    case ACTIONS.attachDebugger:
      attachToDebugger(payload.tabId)
      break
    case ACTIONS.detachDebugger:
      detachFromDebugger(payload.tabId)
      break
    default:
      break
  }
  return
}

chrome.runtime.onMessage.addListener(messageIncoming)
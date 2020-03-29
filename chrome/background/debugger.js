const attached = async (tabId) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  await chrome.browserAction.setIcon({ path: 'icons/icon-active.png' })
  state = {
    ...state,
    isAttachedToDebugger: true,
    tabId
  }
}

async function detached () {
  chrome.browserAction.setIcon({ path: 'icons/icon.png' })
  state.isAttachedToDebugger = false
} 

async function detachFromDebugger (tabId) {
  chrome.debugger.detach({ tabId }, detached)
}

async function attachToDebugger (tabId) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId }, VERSION, attached.bind(null, tabId))
}
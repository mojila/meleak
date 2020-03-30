const attached = async (tabId) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  await chrome.browserAction.setIcon({ path: 'icons/icon-active.png' })
  await chrome.browserAction.setBadgeText({ text: '0', tabId })
  await chrome.browserAction.setBadgeBackgroundColor({ color: '#005b96', tabId: tabId })

  state.isAttachedToDebugger = true
  state.tabId = tabId
}

async function detached () {
  await chrome.browserAction.setIcon({ path: 'icons/icon.png' })

  state.isAttachedToDebugger = false
} 

async function detachFromDebugger (tabId) {
  await chrome.browserAction.setBadgeText({ text: '', tabId: tabId })
  chrome.debugger.detach({ tabId }, detached)
}

async function attachToDebugger (tabId) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId }, VERSION, attached.bind(null, tabId))
}
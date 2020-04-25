const attached = async (tabId) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  state.tabId = tabId

  await chrome.browserAction.setIcon({ path: 'icons/icon-active.png' })
  await chrome.browserAction.setBadgeText({ text: '0', tabId })
  await chrome.browserAction.setBadgeBackgroundColor({ color: '#005b96', tabId: tabId })
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-active.png',
    title: 'Meleak',
    message: 'Memory Debugging is started.'
  })
  await chrome.debugger
    .sendCommand({ tabId: tabId }, 'HeapProfiler.collectGarbage', () => {
      state.isAttachedToDebugger = true
    })
}

async function detached () {
  await chrome.browserAction.setIcon({ path: 'icons/icon.png' })
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Meleak',
    message: 'Memory Debugging is stopped.'
  })

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
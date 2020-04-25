const attached = async (tabId) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  chrome.browserAction.setIcon({ path: 'icons/icon-active.png' })
  chrome.browserAction.setBadgeText({ text: '0', tabId })
  chrome.browserAction.setBadgeBackgroundColor({ color: '#005b96', tabId: tabId })
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-active.png',
    title: 'Meleak',
    message: 'Memory Debugging is started.'
  })
  chrome.debugger
    .sendCommand({ tabId: tabId }, 'HeapProfiler.collectGarbage', async () => {
      state.isAttachedToDebugger = await true
      state.tabId = tabId
    })
}

async function detached () {
  chrome.browserAction.setIcon({ path: 'icons/icon.png' })
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Meleak',
    message: 'Memory Debugging is stopped.'
  })

  state.isAttachedToDebugger = false
} 

async function detachFromDebugger (tabId) {
  chrome.browserAction.setBadgeText({ text: '', tabId: tabId })
  chrome.debugger.detach({ tabId }, detached)
}

async function attachToDebugger (tabId) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId }, VERSION, attached.bind(null, tabId))
}
var url = {url: [{urlMatches : 'https://www.google.com/'}]}

function changeUrl(newUrl = '') {
  url = {url: [{urlMatches : newUrl}]}
}

function pageUpdated(details = { frameId: 0, parentFrameId: -1, processId: 0, tabId: 0, timeStamp: 0, transitionQualifiers: [], transitionType: '', url: '' }) {
  console.log(new Date(details.timeStamp).toISOString(), new URL(details.url))
}

const boundPageUpdated = pageUpdated.bind(null)

const attached = async (tab = { id: 0, url: '' }) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  changeUrl(tab.url)
  const newUrl = new URL(tab.url)
  const time = new Date().toISOString()

  console.log(time, newUrl.origin)

  chrome.webNavigation.onHistoryStateUpdated.addListener(boundPageUpdated, url);

  await chrome.browserAction.setIcon({ path: 'icons/icon-active.png' })
  chrome.browserAction.setBadgeText({ text: '0', tabId: tab.id })
  chrome.browserAction.setBadgeBackgroundColor({ color: '#005b96', tabId: tab.id })
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-active.png',
    title: 'Meleak',
    message: 'Memory Debugging is started.'
  })
  chrome.debugger
    .sendCommand({ tabId: tab.id }, 'HeapProfiler.collectGarbage', () => {
       console.info('GC Started')
    })

  state.isAttachedToDebugger = true
  state.tabId = tab.id
}

async function detached () {
  await chrome.browserAction.setIcon({ path: 'icons/icon.png' })
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
  chrome.webNavigation.onHistoryStateUpdated.removeListener(boundPageUpdated);
  chrome.debugger.detach({ tabId }, detached)
}

async function attachToDebugger (tab = { id: 0, url: '' }) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId: tab.id }, VERSION, attached.bind(null, tab))
}
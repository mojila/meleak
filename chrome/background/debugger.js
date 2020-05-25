var url = {url: [{urlMatches : 'https://www.google.com/'}]}

function changeUrl(newUrl = '') {
  url = {url: [{urlMatches : newUrl}]}
}

/*
Documentation 
https://developer.chrome.com/extensions/webNavigation
*/
function pageUpdated(details) {
  const time = new Date(details.timeStamp).toISOString()
  const url = new URL(details.url)

  if (url.pathname !== state.page.url.pathname) {
    saveHeapData(state.page.url)
    changePage(time, url)
  }
}

const boundPageUpdated = pageUpdated.bind(null)

const attached = async (tab) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  changeUrl(tab.url)
  const newUrl = new URL(tab.url)
  const time = new Date().toISOString()
  
  changePage(time, newUrl)

  chrome.webNavigation.onHistoryStateUpdated.addListener(boundPageUpdated, url);
  chrome.webNavigation.onCompleted.addListener(boundPageUpdated, url)

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
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }
  await chrome.browserAction.setBadgeText({ text: '', tabId: state.tabId })
  await chrome.browserAction.setIcon({ path: 'icons/icon.png' })
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Meleak',
    message: 'Memory Debugging is stopped.'
  })

  chrome.webNavigation.onHistoryStateUpdated.removeListener(boundPageUpdated)
  chrome.webNavigation.onCompleted.removeListener(boundPageUpdated)

  resetState()
} 

async function detachFromDebugger (tabId) {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }
  await chrome.browserAction.setBadgeText({ text: '', tabId: tabId })
  await chrome.browserAction.setIcon({ path: 'icons/icon.png' })
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Meleak',
    message: 'Memory Debugging is stopped.'
  })
  chrome.webNavigation.onHistoryStateUpdated.removeListener(boundPageUpdated);
  chrome.debugger.detach({ tabId })

  resetState()
}

async function attachToDebugger (tab) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId: tab.id }, VERSION, attached.bind(null, tab))
}
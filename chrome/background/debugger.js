var url = {url: [{urlMatches : 'https://www.google.com/'}]}

const setTarget = (url) => {
  try {
    let key = 'meleak-active'
    localStorage.setItem(key, url)
  } catch(e) {
    console.warn(e)
  }
}

const savePage = (page) => {
  try {
    let newUrl = new URL(page)
    let key = `${newUrl.origin}-pages`
    let currentPages = localStorage.getItem(key)
    let pages = new Set()

    if (currentPages) {
      pages = new Set(JSON.parse(currentPages))
    }

    pages.add(page)
    localStorage.setItem(key, JSON.stringify(Array.from(pages)))
  } catch(e) {
    console.warn(e)
  }
}

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

  savePage(url.href)

  if (url.pathname !== state.page.url.pathname) {
    saveHeapData(state.page.url)
    changePage(time, url)
  }
}

const saveInfo = (info) => {
  try {
    let key = `${info.url}-info`
    localStorage.setItem(key, JSON.stringify(info))
  } catch(e) {
    console.warn(e)
  }
}

const boundPageUpdated = pageUpdated.bind(null)

const attached = async (tab) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  changeUrl(tab.url)
  const newUrl = new URL(tab.url)
  const time = new Date()
  const info = {
    title: tab.title,
    icon: tab.favIconUrl,
    url: newUrl.origin
  }

  // set target
  setTarget(newUrl.origin)
  // save info
  saveInfo(info)
  // save page
  savePage(tab.url)

  changePage(time.toISOString(), newUrl)

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
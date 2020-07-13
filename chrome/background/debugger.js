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

const requestScripts = (tabId, url) => {
  chrome.tabs.sendMessage(tabId, {message: "get_codes"}, function(response) {
    if (response.codes) {
      const key = `${url}-scripts`
      try {
        localStorage.setItem(key, JSON.stringify(response.codes))
      } catch (err) {
        console.warn(err)
      }
    }
  });
}


/*
Documentation 
https://developer.chrome.com/extensions/webNavigation
*/
function pageUpdated(details) {
  const time = new Date(details.timeStamp).toISOString()
  try {
    const url = new URL(details.url)

    savePage(url.href)

    if (url.pathname !== state.page.url.pathname) {
      saveHeapData(state.page.url)
      changePage(time, url)
      requestScripts(state.tabId, url.href)
    }
  } catch(e) {
    console.log(details.url)
    console.warn(e)
  }
}

const getDomCounters = (tabId) => {
  chrome.debugger
    .sendCommand({ tabId: tabId }, 'Memory.getDOMCounters', (result) => {
      /*
      result = 
      documents: integer
      nodes: integer
      jsEventListeners: integer
      */
      console.log(result)
    })
}

const getSamplingProfile = (tabId) => {
  chrome.debugger
    .sendCommand({ tabId: tabId }, 'Memory.getSamplingProfile', (result) => {
      /**
       * result
       * profile: SamplingProfile
       * https://chromedevtools.github.io/devtools-protocol/tot/Memory/#type-SamplingProfile
       */
      console.log(result)
    })
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

const collectGarbage = (tabId) => {
  chrome.debugger
    .sendCommand({ tabId: tabId }, 'HeapProfiler.collectGarbage', () => {
       console.info('GC Started')
    })
}

const prepareForLeakDetectioon = (tabId) => {
  chrome.debugger.sendCommand({ tabId: tabId }, 'Memory.prepareForLeakDetection', () => {
    console.log('prepare for memory leak detection')
  })
}

const runtimeEvaluate = (tabId) => {
  chrome.debugger.sendCommand({ tabId: tabId }, 'Runtime.evaluate', { expression: 'a' }, (result) => {
    console.log(result)
  })
}

const requestMemoryDump = (tabId) => {
  chrome.debugger.sendCommand({ tabId: tabId }, 'Tracing.requestMemoryDump', { deterministic: true }, (result) => {
    console.log(result)
  })
}

const takeHeapSnapshot = (tabId) => {
  chrome.debugger.sendCommand({ tabId: tabId }, 'HeapProfiler.takeHeapSnapshot', { reportProgress: false, treatGlobalObjectsAsRoots: true }, () => {
    console.log('Taking Heap Snapshot Completed')
  })
}

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
  // get scripts
  requestScripts(tab.id, newUrl.href)

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
  collectGarbage(tab.id)

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

function clearData (tab) {
  let origin = new URL(tab.url).origin
  let pages = localStorage.getItem(`${origin}-pages`)

  if (pages) {
    pages = JSON.parse(pages)
    pages.forEach(value => {
      localStorage.removeItem(`${value}-leak`)
      localStorage.removeItem(`${value}-scripts`)
      localStorage.removeItem(`${value}`)
    }) 
  }
}
const ACTIONS = {
  attachDebugger: 'attach_debugger',
  detachDebugger: 'detach_debugger',
  isAttachedDebugger: 'is_attached_debugger'
}

var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0
}

const updateHeap = setInterval(() => {
  if (state.isAttachedToDebugger) {
    chrome.debugger.sendCommand({ tabId: state.tabId }, 'Runtime.getHeapUsage', (data) => {
      state = {
        ...state,
        totalHeap: data.totalSize,
        usedHeap: data.usedSize
      }

      return;
    })

    return chrome.runtime
      .sendMessage({ action: 'update_heap', payload: { usedHeap: state.usedHeap, totalHeap: state.totalHeap } })
  }
}, 1000)

const attached = async (tabId) => {
  if (chrome.runtime.lastError) {
    return console.warn(chrome.runtime.lastError.message)
  }

  await chrome.browserAction.setIcon({ path: 'icon-active.png' })
  state = {
    ...state,
    isAttachedToDebugger: true,
    tabId
  }
}

async function detached () {
  chrome.browserAction.setIcon({ path: 'icon.png' })
  state.isAttachedToDebugger = false
} 

async function detachFromDebugger (tabId) {
  chrome.debugger.detach({ tabId }, detached)
}

async function attachToDebugger (tabId) {
  const VERSION = '1.3'
  chrome.debugger.attach({ tabId }, VERSION, attached.bind(null, tabId))
}

async function messageIncoming ({ action, payload }, _sender, sendResponse) {
  switch (action) {
    case ACTIONS.attachDebugger:
      attachToDebugger(payload.tabId)
      break
    case ACTIONS.detachDebugger:
      detachFromDebugger(payload.tabId)
      break
    case ACTIONS.isAttachedDebugger:
      sendResponse(state.isAttachedToDebugger)
      break
    default:
      break
  }
  return
}

chrome.runtime.onMessage.addListener(messageIncoming)
chrome.debugger.onDetach.addListener(detached)
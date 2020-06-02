// DONE: tidak bisa start ketika ganti tab

async function messageIncoming ({ action, payload }, _sender, sendResponse) {
  switch (action) {
    case ACTIONS.attachDebugger:
      attachToDebugger(payload)
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
chrome.debugger.onEvent.addListener(function (source, method, params) {
  if (method == 'HeapProfiler.addHeapSnapshotChunk') {
    console.log(params)
  }
})
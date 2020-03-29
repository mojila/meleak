const updateHeap = setInterval(() => {
  if (state.isAttachedToDebugger) {
    chrome.debugger.sendCommand({ tabId: state.tabId }, 'Runtime.getHeapUsage', ({ totalSize, usedSize }) => {
      state.totalHeap = totalSize
      state.usedHeap = usedSize

      return;
    })

    return chrome.runtime
      .sendMessage({ action: 'update_heap', payload: { usedHeap: state.usedHeap, totalHeap: state.totalHeap } })
  }
}, 1000)
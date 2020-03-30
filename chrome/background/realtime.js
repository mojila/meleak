const updateHeap = async () => {
  await chrome.browserAction.setBadgeText({ text: String((state.totalHeap / 1000000).toFixed(0)) + 'mb', tabId: state.tabId })
  return chrome.runtime
      .sendMessage({ action: 'update_heap', payload: { usedHeap: state.usedHeap, totalHeap: state.totalHeap, heapData: state.heapData } }) 
}

const realtime = setInterval(() => {
  if (state.isAttachedToDebugger) {
    chrome.debugger.sendCommand({ tabId: state.tabId }, 'Runtime.getHeapUsage', ({ totalSize, usedSize }) => {
      let time = new Date()
      
      state.totalHeap = totalSize
      state.usedHeap = usedSize

      if (state.heapData.length < 10) {
        state.heapData = [...state.heapData, (totalSize / 1000000).toFixed(2)]
      } else {
        state.heapData = [...state.heapData.slice(1), (totalSize / 1000000).toFixed(2)]
      }

      return;
    })

    updateHeap()
  }
}, 1000)
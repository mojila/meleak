const updateHeap = async () => {
  return await chrome.runtime
      .sendMessage({ action: 'update_heap', payload: { usedHeap: state.usedHeap, totalHeap: state.totalHeap, heapData: state.heapData } }) 
}

const realtime = setInterval(() => {
  if (state.isAttachedToDebugger) {
    chrome.debugger.sendCommand({ tabId: state.tabId }, 'Runtime.getHeapUsage', ({ totalSize, usedSize }) => {
      let time = new Date()
      
      state.totalHeap = totalSize
      state.usedHeap = usedSize
      state.heapData = [...state.heapData, { time: time.toISOString(), x: state.heapData.length + 1, y: (totalSize / 1000000).toFixed(2) }]

      return;
    })

    updateHeap()
  }
}, 1000)
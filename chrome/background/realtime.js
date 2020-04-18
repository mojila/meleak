const updateHeap = async () => {
  let series = await state
    .heapData
    .map(d => d.heap)

  await chrome
    .browserAction
    .setBadgeText({ 
      text: String((state.totalHeap / 1000000).toFixed(0)) + 'mb', 
      tabId: state.tabId 
    })

  // hasil outlier
  let outliers = await outlier_detection(state.heapData)

  if (outliers.length > 0) {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-memory-anomaly.png',
      title: 'Meleak',
      message: 'Memory Anomaly happened!.'
    })
    // await chrome.storage.sync.set({outlier: { found: outliers, sequence: state.heapData }}, function() {
    //   console.log('Value is set to ' + value);
    // });
  }
  
  return chrome
    .runtime
    .sendMessage({ 
      action: 'update_heap', 
      payload: { 
        usedHeap: state.usedHeap, 
        totalHeap: state.totalHeap, 
        heapData: series 
      } 
    }) 
}

const realtime = setInterval(() => {
  if (state.isAttachedToDebugger) {
    chrome
      .debugger
      .sendCommand({ tabId: state.tabId }, 'Runtime.getHeapUsage', ({ totalSize, usedSize }) => {
        let time = (new Date()).toISOString()
        
        state.totalHeap = totalSize
        state.usedHeap = usedSize

        if (state.heapData.length < 60) {
          state.heapData = [...state.heapData, { time: time, heap: Number((totalSize / 1000000).toFixed(2)) }]
        } else {
          state.heapData = [...state.heapData.slice(1), { time: time, heap: Number((totalSize / 1000000).toFixed(2)) }]
        }

        return;
      })

    updateHeap()
  }
}, 1000)
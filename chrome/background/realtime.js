const memoryAnomalyNotification = () => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-memory-anomaly.png',
    title: 'Meleak',
    message: 'Memory Anomaly happened!.'
  })
}

const anomalyAnalysis = (anomaly) => {
  let isAnomalyDetected = anomaly.length > 0
  // let isPreviousEmpty = state.previousAnomaly.size === 0

  if (isAnomalyDetected) {
    let extractHeapSize = anomaly.map(d => d.heap)
    let meanAnomalyHeapSizes = mean(extractHeapSize)
    console.log(state.previousAnomalyMean, meanAnomalyHeapSizes)
    if (state.previousAnomalyMean === 0) {
      state.previousAnomalyMean = meanAnomalyHeapSizes
    } else {
      if (meanAnomalyHeapSizes > state.previousAnomalyMean) {
        state.previousAnomalyMean = meanAnomalyHeapSizes
        console.log('Memory Leak!')
      }
    }
  }
}

const updateHeap = async () => {
  let series = await state
    .heapData
    .map(d => d.heap)

  chrome
    .browserAction
    .setBadgeText({ 
      text: String((state.usedHeap / 1000000).toFixed(0)) + 'mb', 
      tabId: state.tabId 
    })

  // hasil outlier
  let anomaly = await outlier_detection(state.heapData)
  anomalyAnalysis(anomaly)
  
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
          state.heapData = [...state.heapData, { time: time, heap: Number((usedSize / 1000000).toFixed(2)) }]
        } else {
          state.heapData = [...state.heapData.slice(1), { time: time, heap: Number((usedSize / 1000000).toFixed(2)) }]
        }

        return;
      })

    updateHeap()
  }
}, 1000)
const memoryAnomalyNotification = () => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-memory-leak.png',
    title: 'Meleak',
    message: 'Memory Leak Detected!'
  })
}

const find_memory_leak = (outliers) => {
  if (outliers.length > 3) {

    let memory_leak_range = outliers.map((d, i) => {
      if (i === 0) {
        return d
      }

      if (d.heap > outliers[i - 1].heap) {
        return d
      }
    })

    let cleared = memory_leak_range.filter(x => x)

    if (cleared.length > 2) {
      return cleared
    }
  }

  return []
}

const anomalyAnalysis = (anomalies) => {
  let isAnomaliesDetected = anomalies.length > 0

  if (isAnomaliesDetected) {
    let memory_leak = find_memory_leak(anomalies)
    let isMemoryLeakDetected = memory_leak.length > 0

    // Ketika ditemukan Memory Leak
    if (isMemoryLeakDetected) {
      let key = `${state.page.url.origin}${state.page.url.pathname}-leak`
      let getMemoryLeak = localStorage.getItem(key)
      let currentMemoryLeak = []
      let stringifyData = ''
      
      if (getMemoryLeak) { // Ketika ada rekaman data memory leak sebelumnya
        currentMemoryLeak = JSON.parse(getMemoryLeak)
        let beforeCheck = new Set(currentMemoryLeak[currentMemoryLeak.length - 1].memoryLeak)
        let afterCheck = new Set([...beforeCheck, ...memory_leak])
        
        if (beforeCheck.size !== afterCheck.size) {
          memoryAnomalyNotification()
          
          currentMemoryLeak.push({
            heapData: state.heapData,
            memoryLeak: memory_leak
          })
        }
        stringifyData = JSON.stringify(currentMemoryLeak) 
      } else { // Ketika pertama kali ditemukannya memory leak
        memoryAnomalyNotification()

        currentMemoryLeak = [{
          heapData: state.heapData,
          memoryLeak: memory_leak
        }]
        stringifyData = JSON.stringify(currentMemoryLeak) 
      }

      let saveMemoryLeak = localStorage.setItem(key, stringifyData)
    }
  }
}

const updateHeap = async () => {
  let series = await state
    .heapData
    .slice(-10)
    .map(d => {
      let time = new Date(d.time)
      let value = Number((d.heap / 1000000).toFixed(2))
      let formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`

      return { x: formattedTime, y: value }
    })

  // console.log(state)

  chrome
    .browserAction
    .setBadgeText({ 
      text: String((state.usedHeap / 1000000).toFixed(0)) + 'mb', 
      tabId: state.tabId 
    })

  // hasil outlier
  let anomaly = await outlier_detection(state.heapData)
  anomalyAnalysis(anomaly)

  let key = `${state.page.url.origin}${state.page.url.pathname}-leak`
  let memoryLeakSnapshot = localStorage.getItem(key)
  let memoryLeakCount = 0

  if (memoryLeakSnapshot) {
    memoryLeakCount = JSON.parse(memoryLeakSnapshot).length
  }
  
  return chrome
    .runtime
    .sendMessage({ 
      action: 'update_heap', 
      payload: { 
        usedHeap: state.usedHeap, 
        totalHeap: state.totalHeap, 
        heapData: series,
        page: state.page.url.pathname,
        memoryLeak: memoryLeakCount
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
          state.heapData = [...state.heapData, { time: time, heap: usedSize }]
        } else {
          state.heapData = [...state.heapData.slice(1), { time: time, heap: usedSize }]
        }

        return;
      })

    updateHeap()
  }
}, 1000)
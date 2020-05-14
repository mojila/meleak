var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0,
  heapData: [],
  previousAnomalyMean: 0,
  sigma: 1,
  page: ''
}

const resetState = () => {
  state = {
    tabId: 0,
    isAttachedToDebugger: false,
    usedHeap: 0,
    totalHeap: 0,
    heapData: [],
    page: ''
  }
}

const clearHeapData = () => {
  state.heapData = []
}

const changePage = (time, url) => {
  state.page = {
    time,
    url
  }
  clearHeapData()
}
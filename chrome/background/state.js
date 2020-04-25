var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0,
  heapData: [],
  previousAnomalyMean: 0,
  sigma: 1
}

const resetState = () => {
  state = {
    tabId: 0,
    isAttachedToDebugger: false,
    usedHeap: 0,
    totalHeap: 0,
    heapData: []
  }
}
var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0,
  heapData: [],
  previousAnomaly: new Set(),
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
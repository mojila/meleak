var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0,
  heapData: []
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
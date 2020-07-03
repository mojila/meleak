var state = {
  tabId: 0,
  isAttachedToDebugger: false,
  usedHeap: 0,
  totalHeap: 0,
  heapData: [],
  previousAnomalyMean: 0,
  sigma: 2,
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

const saveHeapData = (url) => {
  let key = url.origin + url.pathname
  let data = JSON.stringify(state.heapData)
  let saveHeapData = localStorage.setItem(key, data)
}

const loadHeapData = (url) => {
  let key = url.origin + url.pathname
  let previousHeapData = localStorage.getItem(key)

  if (previousHeapData) {
    state.heapData = JSON.parse(previousHeapData)
  } else {
    clearHeapData()
  }
}

const changePage = (time, url) => {
  state.page = {
    time,
    url
  }

  loadHeapData(url)
}
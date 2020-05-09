function reducer(action = '', payload = {} || '' || 0 || false) {
  switch(action) {
    case ACTIONS.debuggerStart:
      startDebugger(payload)
      break
    default:
      return
  }
}
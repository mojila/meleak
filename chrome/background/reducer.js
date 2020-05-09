function reducer(action = '', payload = {} || '' || 0 || false) {
  switch(action) {
    case ACTIONS.debuggerStart:
      console.log('started')
      break
    default:
      return
  }
}
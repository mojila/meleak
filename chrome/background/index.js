chrome.runtime.onMessage.addListener(function(message = { status: '', content: '', payload: {} }, sender, sendResponse) {
  reducer(message.content, message.payload)

  sendResponse({ status: 'success', content: 'received' })
})
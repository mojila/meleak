function sendMessage(message = { status: 'sending', content: '', payload: {} }) {
  chrome.runtime.sendMessage(message, function(response) {
    console.log(response)
  })
}

function sendDebuggerStartCommand() {
  chrome.tabs.query({ active: true }, function(result) {
    let tab = result[0]

    let message = {
      status: 'sending',
      content: 'debugger_start',
      payload: {
        tab
      }
    }
  
    sendMessage(message)
  })
}

document.getElementById('button_start').addEventListener('click', sendDebuggerStartCommand)
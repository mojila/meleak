var counter = 2
var happy;

var poop = function() {
  for (var i = 0; i < 100000; i++) {
    happy += 'a'
  }
}

document.getElementById('but').addEventListener('click', function() {
  poop()
})
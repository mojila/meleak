const data = require('./data')

const sum = (arr) => arr.reduce((a,b) => {
  return a + b;
}, 0)

const mean = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const SIGMA = 1

const outlier_detection = (data = []) => {
  let sequence = data.map(d => Number(d.heap))
  let sequence_mean = mean(sequence);
  let squares = sequence.map(d => Math.pow(d - sequence_mean, 2));
  let variance = sum(squares) / sequence.length;
  let standart_deviation = Math.sqrt(variance);
  let min = sequence_mean - SIGMA * standart_deviation;
  let max = sequence_mean + SIGMA * standart_deviation;

  return data.filter(x => x.heap > max || x.heap < min);
}

const find_memory_leak = (outliers) => {
  if (outliers.length > 3) {

    let memory_leak_range = outliers.map((d, i) => {
      if (i === 0) {
        return d
      }

      if (d.heap > outliers[i - 1].heap) {
        return d
      }
    })

    let cleared = memory_leak_range.filter(x => x)

    if (cleared.length > 2) {
      return cleared
    } else {
      return []
    }
  }
}

let outlier = outlier_detection(data)
let memory_leak = find_memory_leak(outlier)

console.log('Outlier', outlier)
console.log('Memory Leak', memory_leak)
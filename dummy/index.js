const data = require('./data')

const sum = (arr) => arr.reduce((a,b) => {
  return a + b;
}, 0)

const mean = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const outlier_detection = (data = []) => {
  let sequence = data.map(d => Number(d.heap))
  let sequence_mean = mean(sequence);
  let squares = sequence.map(d => Math.pow(d - sequence_mean, 2));
  let variance = sum(squares) / sequence.length;
  let standart_deviation = Math.sqrt(variance);
  let min = sequence_mean - 1 * standart_deviation;
  let max = sequence_mean + 1 * standart_deviation;

  return data.filter(x => x.heap > max || x.heap < min);
}

console.log(outlier_detection(data))
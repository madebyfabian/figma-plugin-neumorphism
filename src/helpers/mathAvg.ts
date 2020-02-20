export default (values) => {
  let sum = values.reduce((previous, current) => current += previous);
  return sum / values.length
}
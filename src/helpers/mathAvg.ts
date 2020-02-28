/**
 * Get the average of multiple values
 * @param values Multiple numbers.
 */
export default (...values: any) => {
  let sum = values.reduce((previous, current) => current += previous);
  return sum / values.length
}
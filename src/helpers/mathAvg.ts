/**
 * @deprecated maybe
 */
export default (...values: any) => {
  let sum = values.reduce((previous, current) => current += previous);
  return sum / values.length
}
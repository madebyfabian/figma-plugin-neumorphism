/**
 * Clones an object and returns it.
 * @param {object} val The object to clone
 */
export default (val) => {
  return JSON.parse(JSON.stringify(val))
}
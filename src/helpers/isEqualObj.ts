/**
 * @returns true if the obj1 and obj2 are equal.
 */
export default (obj1: object, obj2: object) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
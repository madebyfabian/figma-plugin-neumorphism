/**
 * Wrapper around Figma's node.getPluginData(key) function
 */
export const getPluginData = ( node: CustomAllowedNodeTypes, key: string ) => {
  let data = node.getPluginData(key)
  return (!data.length) ? null : JSON.parse(data)
}


/**
 * Wrapper around Figma's node.setPluginData(key, value) function
 */
export const setPluginData = ( node: SceneNode, key: string, value: any ) => {
  value = value ? JSON.stringify(value) : ''
  node.setPluginData(key, value)
}
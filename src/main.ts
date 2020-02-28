import generateShadow from './functions/generateShadow'
import cloneObj from './helpers/cloneObj'
import isEqualObj from './helpers/isEqualObj'


const SHADOW_OPTIONS_PLUGIN_DATA_KEY = 'shadowOptions',
      SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY = 'shadowEffectObjects'


const validateCurrSel = () => {
  const currSelAll = figma.currentPage.selection
  if (currSelAll.length !== 1)
    return null

  const [ currNode ] = currSelAll

  return (currNode.type === 'SLICE' || currNode.type === 'GROUP') ? null : currNode
}


const getPluginData = ( node: CustomAllowedNodeTypes, key: string ) => {
  let data = node.getPluginData(key)
  return (!data.length) ? null : JSON.parse(data)
}


/**
 * Returns the "shadowOptions" pluginData stored on the given node. 
 * @param node A figma node object.
 */
const getNodeShadowOptions = (node: CustomAllowedNodeTypes) => {
  try {
    if (!node) 
      throw new Error

    const storedOptions: CustomOptionsObject = getPluginData(node, SHADOW_OPTIONS_PLUGIN_DATA_KEY)
    if (!storedOptions)
      throw new Error

    const storedShadows: ShadowEffect[] = getPluginData(node, SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY)

    const currShadows: ShadowEffect[] = cloneObj(node.effects).filter((effect: Effect) => effect.type === 'INNER_SHADOW' || effect.type === 'DROP_SHADOW')
    if (!currShadows.length)
      throw new Error

    // Now check if the current shadows and the stored ones are the same.
    for (const storedShadow of storedShadows) {
      // Find the same storedShadow object in the currentShadows array of objects.
      const foundStoredShadowInCurrShadows = currShadows.find(( currShadow: ShadowEffect ) => isEqualObj(currShadow, storedShadow))
      if (!foundStoredShadowInCurrShadows)
        throw new Error
    }
    
    return storedOptions
  } catch (error) {
    return null
  }
}


const onSelectionChange = () => {
  const currNode = validateCurrSel()

  // Tell the UI that the selection has changed
  figma.ui.postMessage({
    type: 'currNodeChanged',
    value: { currSelIsValid: !!currNode, optionsStoredOnNode: getNodeShadowOptions(currNode) }
  })

  if (!currNode)
    return
  
  figma.ui.onmessage = msg => {
    if (msg.type === 'syncOptions') {
      const msgValue = msg.value

      console.log('syncOptions() =>', msgValue.options)
      const generatedShadowObjects = generateShadow(currNode, msgValue.options)

      // Store generated shadow objects in Figas "pluginData"
      currNode.setPluginData(SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY, JSON.stringify(generatedShadowObjects))

      // Store options in Figmas "pluginData"
      currNode.setPluginData(SHADOW_OPTIONS_PLUGIN_DATA_KEY, JSON.stringify(msgValue.options))

      if ('init' in msgValue && msgValue.init === true)
        // Tell the UI that the current selection is now a "neumorphed" one
        figma.ui.postMessage({
          type: 'currNodeChanged',
          value: { currSelIsValid: true, optionsStoredOnNode: getNodeShadowOptions(currNode) }
        })
    }
  }

}


try {
  figma.showUI(__html__, {
    width: 300,
    height: 530
  })

  // On plugin start.
  onSelectionChange()
  
  // Determines complete selection change (other nodes)
  figma.on('selectionchange', () => onSelectionChange())
} catch (error) {
  figma.closePlugin(`😏 ${error.message}`)
}
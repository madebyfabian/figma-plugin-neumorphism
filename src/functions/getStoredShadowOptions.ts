import cloneObj from '../helpers/cloneObj'
import isEqualObj from '../helpers/isEqualObj'
import { getPluginData } from '../helpers/figmaFnWrapper'
import { 
  SHADOW_OPTIONS_PLUGIN_DATA_KEY, 
  SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY 
} from '../store'


/**
 * Returns the 'shadowOptions' pluginData stored on the given node. 
 * @param node A figma node object.
 */
export default (node: CustomAllowedNodeTypes) => {
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
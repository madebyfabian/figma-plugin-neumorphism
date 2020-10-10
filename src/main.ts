import { 
  SHADOW_OPTIONS_PLUGIN_DATA_KEY, 
  SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY
} from './store'

import generateShadow from './functions/generateShadow'
import getStoredShadowOptions from './functions/getStoredShadowOptions'
import generateNodeFill from './functions/generateNodeFill'
import { setPluginData } from './helpers/figmaFnWrapper'


const validateCurrSel = () => {
  const currSelAll = figma.currentPage.selection
  if (currSelAll.length !== 1) 
    return null
  const [ currNode ] = currSelAll
  return (currNode.type === 'SLICE' || currNode.type === 'GROUP') ? null : currNode
}


const syncShadowOptions = ( currNode: CustomAllowedNodeTypes, options: CustomOptionsObject ) => {
  const generatedShadowObjects = generateShadow(currNode, options)

  // Store generated shadow objects in Figas "pluginData"
  setPluginData(currNode, SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY, generatedShadowObjects)
}


const onSelectionChange = () => {
  const currNode = validateCurrSel()

  // Tell the UI that the selection has changed
  figma.ui.postMessage({
    type: 'currNodeChanged',
    value: { currSelIsValid: !!currNode, optionsStoredOnNode: getStoredShadowOptions(currNode) }
  })

  if (!currNode)
    return
  
  figma.ui.onmessage = msg => {
    // Store options in Figmas "pluginData"
    const { type: msgType, value: msgValue } = msg
    const options = msgValue?.options

    setPluginData(currNode, SHADOW_OPTIONS_PLUGIN_DATA_KEY, options)

    switch (msgType) {
      case 'syncShadowOptions':
        syncShadowOptions(currNode, options)

        if (msgValue?.init === true) {
          generateNodeFill(currNode, options?.fillType)
          
          // Tell the UI that the current selection is now a "neumorphed" one
          figma.ui.postMessage({
            type: 'currNodeChanged',
            value: { currSelIsValid: true, optionsStoredOnNode: getStoredShadowOptions(currNode) }
          })
        }

        break


      case 'syncFillType': 
        generateNodeFill(currNode, options?.fillType)
        syncShadowOptions(currNode, options)

        break


      case 'removeEffect': 
        // Remove all effects
        currNode.effects = []

        // Reset fills to flat
        generateNodeFill(currNode, 'FLAT')

        // Reset stored shadows
        setPluginData(currNode, SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY, '')

        figma.notify('😵 Removed neumorphic effect')

        break
    }
  }
}


try {
  figma.showUI(__html__, {
    width: 384,
    height: 544
  })

  // On plugin start.
  onSelectionChange()
  
  // On selection change
  figma.on('selectionchange', () => onSelectionChange())
} catch (error) {
  figma.closePlugin(`🤨 ${error.message}`)
}
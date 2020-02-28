import generateShadow from './functions/generateShadow'
import getStoredShadowOptions from './functions/getStoredShadowOptions'
import { 
  SHADOW_OPTIONS_PLUGIN_DATA_KEY, 
  SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY
} from './store'


const validateCurrSel = () => {
  const currSelAll = figma.currentPage.selection
  if (currSelAll.length !== 1) 
    return null
  const [ currNode ] = currSelAll
  return (currNode.type === 'SLICE' || currNode.type === 'GROUP') ? null : currNode
}


const syncFillType = ( options: CustomOptionsObject ) => {
  const fillType = options.fillType
    
  switch (fillType) {
    case 'FLAT':
      console.log('get flat!')
      break;
  
    case 'CONCAVE': case 'CONVEX':
      console.log('get gradienty!')
      break;
  }
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
    const msgValue = msg.value
    if (!msgValue?.options)
      return

    currNode.setPluginData(SHADOW_OPTIONS_PLUGIN_DATA_KEY, JSON.stringify(msgValue.options))
    console.log(`${msg.type}() in figma.ui.onmessage =>`, msgValue)

    switch (msg.type) {
      case 'syncShadowOptions': {
        const generatedShadowObjects = generateShadow(currNode, msgValue.options)

        // Store generated shadow objects in Figas "pluginData"
        currNode.setPluginData(SHADOW_EFFECT_OBJECTS_PLUGIN_DATA_KEY, JSON.stringify(generatedShadowObjects))

        // Tell the UI that the current selection is now a "neumorphed" one
        if (msgValue.init === true) {
          syncFillType(msgValue.options)
          
          figma.ui.postMessage({
            type: 'currNodeChanged',
            value: { 
              currSelIsValid: true, 
              optionsStoredOnNode: getStoredShadowOptions(currNode) 
            }
          })
        }
        break
      }
        
      case 'syncFillType': 
        syncFillType(msgValue.options)
        break
    }
  }
}


try {
  figma.showUI(__html__, {
    width: 300,
    height: 540
  })

  // On plugin start.
  onSelectionChange()
  
  // Determines complete selection change (other nodes)
  figma.on('selectionchange', () => onSelectionChange())
} catch (error) {
  figma.closePlugin(`😏 ${error.message}`)
}
import generateShadow from './functions/generateShadow'
// import isEqualObj from './helpers/isEqualObj'
// import cloneObj from './helpers/cloneObj'


const validateCurrSel = () => {
  const currSelAll = figma.currentPage.selection
  if (currSelAll.length !== 1)
    return null

  const [ currNode ] = currSelAll

  return (currNode.type === 'SLICE' || currNode.type === 'GROUP') ? null : currNode
}


const getNodeShadowOptions = (node: SceneNode) => {
  if (!node) return null
  let data = node.getPluginData('shadowOptions')
  return (data.length) ? JSON.parse(data) : null
}


// const getNodeFill = ( node: Exclude<SceneNode, SliceNode | GroupNode> ) => {
//   let fills = cloneObj(node.fills).filter((fill: Paint) => fill.type === 'SOLID')
//   if (fills.length === 0)
//     return null

//   return fills[0]
// }


// let onSelectionPropertiesChangeInterval: any
const onSelectionChange = () => {
  const currNode = validateCurrSel()

  // Tell the UI that the selection has changed
  figma.ui.postMessage({
    type: 'currNodeChanged',
    value: { currSelIsValid: !!currNode, optionsStoredOnNode: getNodeShadowOptions(currNode) }
  })

  if (!currNode)
    return

  // Determines if only properties of the currently selected nodes changes
  // clearInterval(onSelectionPropertiesChangeInterval)

  // let lastTick = getNodeFill(currNode)
  // onSelectionPropertiesChangeInterval = setInterval(() => {
  //   let thisTick = getNodeFill(currNode)

  //   if (!isEqualObj(thisTick, lastTick)) {
  //     lastTick = thisTick

  //     const currNodeOptions = getNodeShadowOptions(currNode)
  //     if (currNodeOptions)
  //       generateShadow(currNode, currNodeOptions)

  //     console.log('color is not the same anymore!!!!')
  //   }
  // }, 50)
  
  figma.ui.onmessage = msg => {
    if (msg.type === 'syncOptions') {
      const msgValue = msg.value

      console.log('syncOptions() =>', msgValue.options)
      generateShadow(currNode, msgValue.options)

      // Store options in Figmas LocalStorage "pluginData"
      currNode.setPluginData('shadowOptions', JSON.stringify(msgValue.options))

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

  console.log(figma.apiVersion)

  // On plugin start.
  onSelectionChange()
  
  // Determines complete selection change (other nodes)
  figma.on('selectionchange', () => onSelectionChange())
} catch (error) {
  figma.closePlugin(`😏 ${error.message}`)
}
import generateShadow from './functions/generateShadow'
import isEqualObj from './helpers/isEqualObj'


const validateCurrSelNodeType = (currSel: readonly SceneNode[]) => {
  if (currSel.length !== 1)
    throw new Error('Please only select one Node!')

  const [ currNode ] = currSel // Select first element of the curr sel

  if (currNode.type === 'SLICE' || currNode.type === 'GROUP')
    throw new Error('Groups and slices cannot be used, sorry!')

  return currNode
}

const setNodeShadowOptions = (node: SceneNode, value: string ) => {
  // Store the options on the node itsself
  node.setPluginData('shadowOptions', JSON.stringify(value))
}

const getNodeShadowOptions = (node: SceneNode) => {
  let data = node.getPluginData('shadowOptions')
  return (data.length) ? JSON.parse(data) : null
}

/**
 * Fires when the user changes his selection
 * @param sameNodes Always true, exept if it's called but only properties like "width", etc. changed
 */
const onSelectionChange = () => {
  console.log('Selection changed! New selection:', figma.currentPage.selection)

  // try {
  //   const newCurrSel = validateCurrSelNodeType(figma.currentPage.selection)
  //   console.log('newCurrSel:', newCurrSel)
  // } catch (error) {
  //   figma.notify(`😏 ${error.message}`)
  // }
}



try {
  const currNode = validateCurrSelNodeType(figma.currentPage.selection)

  figma.showUI(__html__, {
    width: 300,
    height: 530
  })
  
  // Determines complete selection change
  figma.on('selectionchange', () => onSelectionChange())

  onSelectionChange()

  // // Determines only properties (like height) of the curr sel changes
  // let lastTickCurrNodeValues = { width: currNode.width, height: currNode.height }
  // setInterval(() => {
  //   let thisTickCurrNodeValues = { width: currNode.width, height: currNode.height }
  //   if (!objectsEqual(thisTickCurrNodeValues, lastTickCurrNodeValues)) {
  //     lastTickCurrNodeValues = thisTickCurrNodeValues
  //     onSelectionChange()
  //   }
  // }, 50)


  figma.ui.onmessage = msg => {
    switch (msg.type) {
      case 'pluginStart': {
        // Check, if there is already some stored shadow options on the selected node
        let optionsSavedOnNode = getNodeShadowOptions(currNode),
            options = msg.value.options

        if (!optionsSavedOnNode)
          setNodeShadowOptions(currNode, msg.value.options)
        else {
          // If different, prefer the options stored directly on the node
          if (!isEqualObj(optionsSavedOnNode, msg.value.options)) {
            options = optionsSavedOnNode

            setNodeShadowOptions(currNode, options)

            figma.ui.postMessage({
              type: 'overrideOptions',
              options: options
            })
          }
        }
        
        generateShadow(currNode, options)
        
        figma.ui.postMessage({ type: 'pluginStartDone' })
        
        break
      }

      case 'syncOptions': {
        generateShadow(currNode, msg.value.options)

        // Store options in Figmas LocalStorage "pluginData"
        setNodeShadowOptions(currNode, msg.value.options)

        break
      }
    }
  }
} catch (error) {
  figma.closePlugin(`😏 ${error.message}`)
}
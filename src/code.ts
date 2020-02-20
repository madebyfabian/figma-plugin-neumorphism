import generateShadow from './functions/generateShadow'


try {
  if (figma.currentPage.selection.length !== 1) 
    throw new Error('Please only select one Node!')

  const currNode = figma.currentPage.selection[0]

  if (currNode.type === 'SLICE' || currNode.type === 'GROUP')
    throw new Error('Groups and slices cannot be used, sorry!')

  figma.showUI(__html__, {
    width: 300,
    height: 400
  })

  figma.on('selectionchange', () => {
    // Generate options

    // figma.ui.postMessage ("selection changed", new options)
  })

  figma.ui.onmessage = msg => {
    switch (msg.type) {
      case 'syncOptions': {
        generateShadow(currNode, msg.value.options)
        break
      }

      case 'pluginStart': {
        const generatedOptions = generateShadow(currNode, msg.value.options)

        figma.ui.postMessage({
          type: 'pluginStartDone',
          options: generatedOptions
        })

        break
      }
    }
  }
} catch (error) {
  figma.closePlugin(`😏 ${error.message}`)
}





import cloneObj from '../helpers/cloneObj'
import isEqualObj from '../helpers/isEqualObj'


// Checks if the parent of the curr selected node needs to be painted with the same color as the curr sel.
const parentNodeNeedsColorPaint = (node, currSelColor: RGB) => {
  let parentFills = cloneObj(node.parent.fills)

  // Get last item in array (the "highest" color in hierarchy)
  let parentFill: Paint = parentFills[parentFills.length - 1]
  if (parentFill.type !== 'SOLID')
    return true
  else {
    let parentFillRGB = {
      r: parentFill.color.r,
      g: parentFill.color.g,
      b: parentFill.color.b
    }
    // Parent fill is solid. So check if the parent fill equals the curr sel fill.
    let parentFillStr = Object.entries(parentFillRGB).toString(),
    currNodeFillStr = Object.entries(currSelColor).toString()

    // If the colors are not matching, return true 
    return (parentFillStr !== currNodeFillStr)
  }
}


/**
 * If parent node shall be painted in the same color as the curr sel.
 */
export default ( node: Exclude<SceneNode, SliceNode | GroupNode> ) => {
  console.log('ok')
  let nodeFill: Paint = cloneObj(node.fills).pop()

  if (nodeFill.type !== 'SOLID')
    throw new Error('Please change the current fill to a solid one.')

  const nodeRGBColor =  { 
    r: Math.round(nodeFill.color.r * 255), 
    g: Math.round(nodeFill.color.g * 255), 
    b: Math.round(nodeFill.color.b * 255) 
  }
  console.log('ok2')

  if (
    node.parent.type !== 'SLICE' &&
    node.parent.type !== 'GROUP' &&
    node.parent.type !== 'DOCUMENT' &&
    node.parent.type !== 'PAGE' && 
    parentNodeNeedsColorPaint(node, nodeRGBColor)
  ) {
    const parentFills = cloneObj(node.parent.fills)
    parentFills.push(<SolidPaint>{ type: "SOLID", color: nodeFill.color })
    node.parent.fills = parentFills
  }
}



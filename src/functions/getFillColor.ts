import cloneObj from '../helpers/cloneObj'
import mathAvg from '../helpers/mathAvg'


const getFill = ( node: CustomAllowedNodeTypes, nodeFill: Paint ) => {
  switch (nodeFill?.type) {
    case 'SOLID': 
      return <RGB>nodeFill.color

    case 'GRADIENT_LINEAR': case 'GRADIENT_RADIAL': case 'GRADIENT_ANGULAR': case 'GRADIENT_DIAMOND': {
      // Calc average of the gradient colors.
      let colorValues = { r: [], g: [], b: [] }
      const firstAndLastColorStop = [nodeFill.gradientStops[0], nodeFill.gradientStops[nodeFill.gradientStops.length - 1]]
      for (const gradientStop of firstAndLastColorStop) {
        colorValues.r.push(gradientStop.color.r)
        colorValues.g.push(gradientStop.color.g)
        colorValues.b.push(gradientStop.color.b)
      }
      return <RGB>{ r: mathAvg(...colorValues.r), g: mathAvg(...colorValues.g), b: mathAvg(...colorValues.b) }
    }

    default: {
      // Either there is no fill on the node, or it's an image. Try to get a fill from the parent node.
      const parentNode = node.parent

      if (parentNode.type === 'DOCUMENT' || parentNode.type === 'PAGE' || parentNode.type === 'SLICE' || parentNode.type === 'GROUP')
        return <RGB>{ r: 1, g: 1, b: 1 }

      const parentNodeFill: Paint = cloneObj(parentNode.fills).pop()

      // Self calling the function to generate a returnable color of the parent fill.
      return getFill(parentNode, parentNodeFill)
    }
  }
}


/**
 * @returns The "highest" fill color of a node in format { r: 255, g: 255, b: 255 }. If the node has a gradient fill, it returns the average color.
 */
export default ( node: CustomAllowedNodeTypes ) => {
  const nodeFill: Paint = cloneObj(node.fills).pop()
  const returnFill = getFill(node, nodeFill)

  return {
    r: Math.round(returnFill.r * 255), 
    g: Math.round(returnFill.g * 255), 
    b: Math.round(returnFill.b * 255) 
  }
}
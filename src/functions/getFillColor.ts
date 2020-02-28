import cloneObj from '../helpers/cloneObj'
import mathAvg from '../helpers/mathAvg'


/**
 * @returns The "highest" fill color of a node. If the node has a gradient fill, it returns the average color.
 */
export default ( node: CustomAllowedNodeTypes ) => {
  let nodeFill: Paint = cloneObj(node.fills).pop()

  switch (nodeFill.type) {
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

    default:
      return <RGB>{ r: 1, g: 1, b: 1 }
  }
}
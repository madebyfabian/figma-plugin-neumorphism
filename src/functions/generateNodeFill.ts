import getFillColor from './getFillColor'
import calcColor from './calcColor'


/**
 * Changes the fill of the currNode based on the given type (concave, convex, ...)
 */
export default ( currNode: CustomAllowedNodeTypes, fillType: CustomOptionsObject['fillType'] ) => {
  // First, get the "base" color
  const nodeColor = getFillColor(currNode)

  let generatedPaint: SolidPaint | GradientPaint

  switch (fillType) {
    case 'FLAT': case 'INSET':
      generatedPaint = <SolidPaint>{
        type: 'SOLID',
        color: {  r: nodeColor.r / 255, g: nodeColor.g / 255, b: nodeColor.b / 255 }
      }

      break
  
    default: {
      const lighterColor: RGBA = { ...calcColor(nodeColor, -5), a: 1 }
      const darkerColor:  RGBA = { ...calcColor(nodeColor, 5),  a: 1 }

      generatedPaint = <GradientPaint>{
        type: 'GRADIENT_LINEAR',
        gradientTransform: <Transform>[ [ 0.5, 0.5, 0 ], [ -.5, .5, 0.5 ] ],
        gradientStops: <ReadonlyArray<ColorStop>>[
          { position: 1, color: (fillType === 'CONCAVE') ? darkerColor : lighterColor },
          { position: 0, color: (fillType === 'CONCAVE') ? lighterColor : darkerColor }
        ]
      }

      break
    }
  }

  currNode.fills = [ generatedPaint ]
}
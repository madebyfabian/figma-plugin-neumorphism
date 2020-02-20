import cloneObj from '../helpers/cloneObj'
import newCalcColor from './calcColor'

import { CustomOptionsObject } from '../app'


export default ( node: Exclude<SceneNode, SliceNode | GroupNode>, options: CustomOptionsObject, onlyCollectSettings = false ) => {
  let nodeFill: Paint = cloneObj(node.fills).pop()

  if (nodeFill.type !== 'SOLID')
    throw new Error('Please change the current fill to a solid one.')

  const nodeRGBColor = generateReadableRGB(nodeFill.color)

  let shadowType: ShadowEffect['type'] = (options.inset ? 'INNER_SHADOW' : 'DROP_SHADOW') || 'DROP_SHADOW',
      elevation = options.elevation || 5

  // Get average from width & height to calculate blur
  let offset: Vector = { x: elevation, y: elevation }
  let blur = options.blur || Math.round(mathAvg([ offset.x, offset.y ])) * 2

  // Dark shadow
  const colorDarkShadow: RGBA = { ...newCalcColor(nodeRGBColor, options.intensity * -1), a: .9 }
  const darkShadow = generateShadowObj({
    type: shadowType,
    color: colorDarkShadow,
    offset: offset,
    radius: Math.round(blur * 1.25),
  })

  // Dark shadow (overlay on left)
  const darkShadowLeft = generateShadowObj({
    type: 'DROP_SHADOW',
    color: <RGBA>{ ...colorDarkShadow, a: .2 },
    offset: <Vector>{ x: offset.x * -1, y: offset.y },
    radius: blur
  })

  // Dark shadow (overlay on top)
  const darkShadowTop = generateShadowObj({
    type: 'DROP_SHADOW',
    color: <RGBA>{ ...colorDarkShadow, a: .2 },
    offset: <Vector>{ x: offset.x, y: offset.y * -1 },
    radius: blur
  })

  // Dark shadow border-fake
  const darkBorderShadow = generateShadowObj({
    type: 'INNER_SHADOW',
    color: <RGBA>{ ...colorDarkShadow, a: .5 },
    offset: <Vector>{ x: -1, y: -1 },
    radius: 2
  })

  // Light shadow
  const colorLightShadow: RGBA = { ...newCalcColor(nodeRGBColor, options.intensity), a: .9 }
  const lightShadow = generateShadowObj({
    type: shadowType,
    color: colorLightShadow,
    offset: <Vector>{ x: offset.x * -1, y: offset.y * -1 },
    radius: blur
  })

  // Light shadow border-fake
  const lightBorderShadow = generateShadowObj({
    type: 'INNER_SHADOW',
    color: <RGBA>{ ...colorLightShadow, a: .3 },
    offset: <Vector>{ x: 1, y: 1 },
    radius: 2
  })
    

  node.effects = [
    darkShadow,
    lightShadow,
    darkShadowTop,
    darkShadowLeft,
    darkBorderShadow,
    lightBorderShadow
  ]

  
  // If parent node shall be painted in the same color as the curr sel.
  const needs = parentNodeNeedsColorPaint(node, nodeRGBColor)
  console.log(needs)
  if (
    node.parent.type !== 'SLICE' &&
    node.parent.type !== 'GROUP' &&
    node.parent.type !== 'DOCUMENT' &&
    node.parent.type !== 'PAGE' && 
    needs
  ) {
    const newParentFill: SolidPaint = { type: "SOLID", color: nodeFill.color }

    const parentFills = cloneObj(node.parent.fills)
    parentFills.push(newParentFill)
    node.parent.fills = parentFills
  }

  const res: CustomOptionsObject = {
    intensity: options.intensity, // unchanged
    blur: blur,
    elevation: elevation,
    inset: !!(shadowType === 'DROP_SHADOW')
  }
  
  console.log('=> generateShadow.ts with:', res)
  return res
}



const mathAvg = (values) => {
  let sum = values.reduce((previous, current) => current += previous);
  return sum / values.length
}


const generateShadowObj = (options: { type: ShadowEffect['type'], color: RGBA, offset: Vector, radius: number }) => {
  return <ShadowEffect> {
    ...options,
    blendMode: 'NORMAL',
    visible: true
  }
}


const generateReadableRGB = (color: RGB) => {
  return { 
    r: Math.round(color.r * 255), 
    g: Math.round(color.g * 255), 
    b: Math.round(color.b * 255) 
  }
}


// Checks if the parent of the curr selected node needs to be painted with the same color as the curr sel.
const parentNodeNeedsColorPaint = (node, currSelColor: RGB) => {
  let parentFills = cloneObj(node.parent.fills)

  // Get last item in array (the "highest" color in hierarchy)
  let parentFill: Paint = parentFills[parentFills.length - 1]
  if (parentFill.type !== 'SOLID')
    return true
  else {
    // Parent fill is solid. So check if the parent fill equals the curr sel fill.
    let parentFillStr = Object.entries(generateReadableRGB(parentFill.color)).toString(),
    currNodeFillStr = Object.entries(currSelColor).toString()

    // If the colors are not matching, return true 
    return (parentFillStr !== currNodeFillStr)
  }
}

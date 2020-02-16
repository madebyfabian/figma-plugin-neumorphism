import cloneObj from './cloneObj'
import calcColor from './calcColor'

import { CustomOptionsObject } from '../app'


const mathAvg = (values) => {
  let sum = values.reduce((previous, current) => current += previous);
  return sum / values.length
}


export default ( node: Exclude<SceneNode, SliceNode | GroupNode>, options: CustomOptionsObject ) => {
  const fills: Paint[] = cloneObj(node.fills)
  let fill = fills[fills.length - 1]

  if (fill.type !== 'SOLID')
    throw new Error('Please change the current fill to a solid one.')

  const rgbColor = { 
    r: Math.round(fill.color.r * 255), 
    g: Math.round(fill.color.g * 255), 
    b: Math.round(fill.color.b * 255) 
  }

  const hexColorLightShadow: RGBA = { ...calcColor(rgbColor, options.intensity), a: 1 },
        hexColorDarkShadow: RGBA = { ...calcColor(rgbColor, options.intensity * -1), a: 1 }

  let shadowType: ShadowEffect['type'] = (options.inset ? 'INNER_SHADOW' : 'DROP_SHADOW') || 'DROP_SHADOW',
      elevation = options.elevation || Math.round(node.width / 35)
      
  const offsetLightShadow: Vector = { x: elevation * -1, y: elevation * -1 }
  const offsetDarkShadow: Vector = { x: elevation, y: elevation }

  // Get average from width & height to calculate blur
  let blur = options.blur || Math.round(mathAvg([ offsetDarkShadow.x, offsetDarkShadow.y ])) * 2

  // Now, assign the two shadows to the node.
  const lightShadow: ShadowEffect = {
    type: shadowType,
    color: hexColorLightShadow,
    blendMode: 'NORMAL',
    offset: offsetLightShadow,
    radius: blur,
    visible: true
  }

  const darkShadow: ShadowEffect = {
    type: shadowType,
    color: hexColorDarkShadow,
    blendMode: 'NORMAL',
    offset: offsetDarkShadow,
    radius: blur,
    visible: true
  }

  node.effects = [
    lightShadow,
    darkShadow
  ]
  
  const res: CustomOptionsObject = {
    intensity: options.intensity, // unchanged
    blur: blur,
    elevation: elevation,
    inset: !!(shadowType === 'DROP_SHADOW')
  }

  
  // if (node.parent.type !== 'SLICE' && node.parent.type !== 'GROUP' && node.parent.type !== 'DOCUMENT' && node.parent.type !== 'PAGE') {
  //   if (node.parent.fills) {
  //     // Check if parent has the same color as current node
  //     if (JSON.stringify(fill.color) !== JSON.stringify(node.parent.fills[0].color)) {
  //       const newParentFill: SolidPaint = {
  //         type: "SOLID",
  //         color: fill.color
  //       }
    
  //       const parentFills = cloneObj(node.parent.fills)
  //       parentFills.push(newParentFill)
  //       node.parent.fills = parentFills
  //     }
  //   }
  // }
  
  console.log('=> generateShadow.ts with:', res)
  return res
}
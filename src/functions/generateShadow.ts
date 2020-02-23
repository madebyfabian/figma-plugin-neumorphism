import cloneObj from '../helpers/cloneObj'
import newCalcColor from './calcColor'
import mathAvg from '../helpers/mathAvg'

import { CustomOptionsObject } from '../app'


const generateShadowObj = (options: { type: ShadowEffect['type'], color: RGBA, offset: Vector, radius: number }) => {
  return <ShadowEffect> {
    ...options,
    blendMode: 'NORMAL',
    visible: true
  }
}


export default ( node: Exclude<SceneNode, SliceNode | GroupNode>, options: CustomOptionsObject ) => {
  let nodeFill: Paint = cloneObj(node.fills).pop()

  if (nodeFill.type !== 'SOLID')
    throw new Error('Please change the current fill to a solid one.')

  const nodeRGBColor = { 
    r: Math.round(nodeFill.color.r * 255), 
    g: Math.round(nodeFill.color.g * 255), 
    b: Math.round(nodeFill.color.b * 255) 
  }

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


  const res: CustomOptionsObject = {
    intensity: options.intensity,
    blur: blur,
    elevation: elevation,
    inset: !!(shadowType === 'DROP_SHADOW'),
    blurManuallySet: options.blurManuallySet
  }
  
  // console.log('=> executed generateShadow.ts with res:', res)
  return res
}
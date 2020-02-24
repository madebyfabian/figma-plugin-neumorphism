import cloneObj from '../helpers/cloneObj'
import calcColor from './calcColor'

import { CustomOptionsObject } from '../app'

const generateShadowObj = (options: { type: ShadowEffect['type'], color: RGBA, offset: Vector, radius: number }) => {
  return <ShadowEffect> { ...options, blendMode: 'NORMAL', visible: true }
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

  let shadowType: ShadowEffect['type'] = options.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      elevation = options.elevation

  let offset: Vector = { x: elevation, y: elevation }

  const darkShadowColor: RGBA   = { ...calcColor(nodeRGBColor, options.intensity * -1), a: .9 }
  const lightShadowColor: RGBA  = { ...calcColor(nodeRGBColor, options.intensity), a: .9 }

  const shadows = [
    // Dark shadow
    generateShadowObj({
      type: shadowType,
      color: darkShadowColor,
      offset: offset,
      radius: Math.round(options.blur * 1.25),
    }),

    // Light shadow
    generateShadowObj({
      type: shadowType,
      color: lightShadowColor,
      offset: <Vector>{ x: offset.x * -1, y: offset.y * -1 },
      radius: options.blur
    }),

    // Dark shadow (overlay on top)
    generateShadowObj({
      type: 'DROP_SHADOW',
      color: <RGBA>{ ...darkShadowColor, a: .2 },
      offset: <Vector>{ x: offset.x, y: offset.y * -1 },
      radius: options.blur
    }),

    // Dark shadow (overlay on left)
    generateShadowObj({
      type: 'DROP_SHADOW',
      color: <RGBA>{ ...darkShadowColor, a: .2 },
      offset: <Vector>{ x: offset.x * -1, y: offset.y },
      radius: options.blur
    }),

    // Dark border-fake
    generateShadowObj({
      type: 'INNER_SHADOW',
      color: <RGBA>{ ...darkShadowColor, a: .5 },
      offset: <Vector>{ x: -1, y: -1 },
      radius: 2
    }),

    // Light border-fake
    generateShadowObj({
      type: 'INNER_SHADOW',
      color: <RGBA>{ ...lightShadowColor, a: .3 },
      offset: <Vector>{ x: 1, y: 1 },
      radius: 2
    })
  ]

  node.effects = [
    // Adding our generated shadows
    ...shadows,

    // Adding all the already existing blur effects
    ...cloneObj(node.effects).filter((effect: Effect) => effect.type === 'BACKGROUND_BLUR' || effect.type === 'LAYER_BLUR')
  ]

  return shadows
}
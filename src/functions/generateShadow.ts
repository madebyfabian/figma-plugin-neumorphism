import cloneObj from '../helpers/cloneObj'
import calcColor from './calcColor'
import mathAvg from '../helpers/mathAvg'
import getFillColor from './getFillColor'


const generateShadowObj = (options: { type: ShadowEffect['type'], color: RGBA, offset: Vector, radius: number }) => {
  return <ShadowEffect> { ...options, blendMode: 'NORMAL', visible: true }
}


export default ( node: CustomAllowedNodeTypes, options: CustomOptionsObject ) => {
  const nodeColor = getFillColor(node)

  let shadowType: ShadowEffect['type'] = options.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      shadowTypeBorderFake: ShadowEffect['type'] = options.inset ? 'DROP_SHADOW' : 'INNER_SHADOW',
      elevation = options.elevation

  let offset: Vector
  switch (options.shadowDirection) {
    case 'TOP_LEFT':     offset = { x:  elevation, y:  elevation }; break
    case 'TOP_RIGHT':    offset = { x: -elevation, y:  elevation }; break
    case 'BOTTOM_LEFT':  offset = { x:  elevation, y: -elevation }; break
    case 'BOTTOM_RIGHT': offset = { x: -elevation, y: -elevation }; break
  }

  // Calc border fake offset
  const elevationBorderFake = Math.round(Math.max(Math.abs(elevation / 25), 1))
  let offsetBorderFake: Vector
  switch (options.shadowDirection) {
    case 'TOP_LEFT':     offsetBorderFake = { x:  elevationBorderFake,  y:  elevationBorderFake }; break
    case 'TOP_RIGHT':    offsetBorderFake = { x: -elevationBorderFake,  y:  elevationBorderFake }; break
    case 'BOTTOM_LEFT':  offsetBorderFake = { x:  elevationBorderFake,  y: -elevationBorderFake }; break
    case 'BOTTOM_RIGHT': offsetBorderFake = { x: -elevationBorderFake,  y: -elevationBorderFake }; break
  }

  // Calc border fake blur radius
  const radiusBorderFake = Math.max(Math.round(mathAvg(offsetBorderFake.x, offsetBorderFake.y) * 1.25), 2)

  const darkShadowColor: RGBA   = { ...calcColor(nodeColor, options.intensity * -1), a: .9 }
  const lightShadowColor: RGBA  = { ...calcColor(nodeColor, options.intensity), a: .9 }

  const generatedShadows = [
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
      type: shadowType,
      color: <RGBA>{ ...darkShadowColor, a: .2 },
      offset: <Vector>{ x: offset.x, y: offset.y * -1 },
      radius: options.blur
    }),

    // Dark shadow (overlay on left)
    generateShadowObj({
      type: shadowType,
      color: <RGBA>{ ...darkShadowColor, a: .2 },
      offset: <Vector>{ x: offset.x * -1, y: offset.y },
      radius: options.blur
    }),

    // Dark border-fake
    generateShadowObj({
      type: shadowTypeBorderFake,
      color: <RGBA>{ ...darkShadowColor, a: .5 },
      offset: <Vector>{ x: offsetBorderFake.x * -1, y: offsetBorderFake.y * -1 },
      radius: radiusBorderFake
    }),

    // Light border-fake
    generateShadowObj({
      type: shadowTypeBorderFake,
      color: <RGBA>{ ...lightShadowColor, a: .3 },
      offset: offsetBorderFake,
      radius: radiusBorderFake
    })
  ]

  // All the already existing blur effects
  const existingBlurEffects = cloneObj(node.effects).filter((effect: Effect) => effect.type === 'BACKGROUND_BLUR' || effect.type === 'LAYER_BLUR')

  // Adding our generated shadows
  node.effects = generatedShadows
  const returnVal = node.effects

  node.effects = [ ...generatedShadows, ...existingBlurEffects ]

  return returnVal
}
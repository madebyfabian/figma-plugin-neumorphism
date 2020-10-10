declare global {
  type CustomOptionsObject = {
    intensity: number,
    elevation: number,
    shadowDirection: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
    blurManuallySet: boolean,
    blur: number,
    fillType: 'FLAT' | 'CONCAVE' | 'CONVEX' | 'INSET',
    hasSmoothEdges: boolean
  }
  
  type CustomAllowedNodeTypes = Exclude<SceneNode, SliceNode | GroupNode>

  type CustomFillType = 
    'FLAT' | 
    'CONCAVE' | 
    'CONVEX'
}

export {}
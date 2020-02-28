declare global {
  type CustomOptionsObject = {
    intensity: number,
    elevation: number,
    inset: boolean,
    shadowDirection: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
    blurManuallySet: boolean,
    blur: number,
    fillType: 'FLAT' | 'CONCAVE' | 'CONVEX'
  }
  
  type CustomAllowedNodeTypes = Exclude<SceneNode, SliceNode | GroupNode>

  type CustomFillType = 
    'FLAT' | 
    'CONCAVE' | 
    'CONVEX'
}

export {}
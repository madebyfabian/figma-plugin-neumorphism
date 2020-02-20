import { CustomOptionsObject } from "../app"
import mathAvg from '../helpers/mathAvg'


export default ( node: Exclude<SceneNode, SliceNode | GroupNode> ) => {
  let elevation = Math.round(node.height / 10)

  return <CustomOptionsObject>{ 
    intensity: 10,
    blur: Math.round(elevation * 2),
    elevation: elevation,
    inset: false
  }
}
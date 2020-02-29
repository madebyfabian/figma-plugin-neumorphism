import { rgbToHex, hexToRgb } from '../helpers/colorFormatChanger'


/**
 * Calculates a new hex string based on a given one and a luminance
 * @param color The RGB Color
 * @param luminance The luminance, eg. "10"
 */
export default ( color: { r: number, g: number, b: number }, luminance: number ) => {
  luminance /= 100

  const hex = rgbToHex(color)
  let newHexColor = '#'
  let colorpair

  for (let i = 0; i < 3; i++) {
    colorpair = parseInt(hex.substr(i * 2, 2), 16)
    colorpair = Math.round(Math.min(Math.max(0, colorpair + (colorpair * luminance)), 255)).toString(16)
    newHexColor += ('00' + colorpair).substr(colorpair.length)
  }
  
  return hexToRgb(newHexColor)
}



// export default ( color: { r: number, g: number, b: number }, luminance: number ) => {
//   luminance /= 100

//   if (luminance > 0) {
//     console.log('Lighter color', luminance)
//     luminance *= 2
//     // Ligher color
//     const hex = rgbToHex(color)
//     let newHexColor = '#'
//     let colorpair

//     for (let i = 0; i < 3; i++) {
//       colorpair = parseInt(hex.substr(i * 2, 2), 16)
//       colorpair = Math.round(Math.min(Math.max(0, colorpair + (colorpair * luminance)), 255)).toString(16)
//       newHexColor += ('00' + colorpair).substr(colorpair.length)
//     }
    
//     return hexToRgb(newHexColor)

//   } else {
//     console.log('darker color', luminance)
//     // Darker color
//     let hsl = rgbToHsl(color)

//     // Change hue a bit
//     // hsl.h -= .036

//     // hsl.s = Math.min(hsl.s + .8, 1)

//     // Change luminance to fit the current needs (lighter or darker)
//     hsl.l = Math.min(hsl.l + luminance, 1)

//     // const calcH = 1 + ((1 - hsl.h) * .25)
//     // if (ligherColor)
//     //   hsl.s = Math.min(hsl.s * calcH, 1)

//     return hslToRgb(hsl)
//   }
// }
import { rgbToHex, hexToRgb, hslToRgb, rgbToHsl } from '../helpers/colorFormatChanger'


/**
 * Calculates a new hex string based on a given one and a luminance
 * @param hex The hex string, without hash ("efefef")
 * @param luminance The luminance, eg. "0.15"
 */
export default ( color: { r: number, g: number, b: number }, luminance: number ) => {
  const hex = rgbToHex(color)
  let newHexColor = '#'
  let colorpair

  luminance /= 100
  
  for (let i = 0; i < 3; i++) {
    colorpair = parseInt(hex.substr(i * 2, 2), 16)
    colorpair = Math.round(Math.min(Math.max(0, colorpair + (colorpair * luminance)), 255)).toString(16)
    newHexColor += ('00' + colorpair).substr(colorpair.length)
  }
  
  return hexToRgb(newHexColor)
}


export const newCalcColor = (color: { r: number, g: number, b: number }, luminance: number) => {
  let hsl = rgbToHsl(color)

  // Change hue a bit
  hsl.h += .036

  hsl.s += .7

  // Change luminance to fit the current needs (lighter or darker)
  hsl.l = Math.min(hsl.l + luminance, 1)

  const rgb = hslToRgb(hsl)
  // console.log('rgb color', { r: rgb.r, g: rgb.g, b: rgb.b })
  // console.log('..')
  return rgb
}
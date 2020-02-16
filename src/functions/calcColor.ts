/**
 * Calculates a new hex string based on a given one and a luminance
 * @param hex The hex string, without hash ("efefef")
 * @param luminance The luminance, eg. "0.15"
 */
export default (color: { r: number, g: number, b: number }, luminance: number) => {
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


/**
 * Helper to convert a rgb object to hex
 * @param color RGB Object.
 * @returns {String} Hex string (e.g. "efefef")
 */
const rgbToHex = (color: { r: number, g: number, b: number }) => {
  const val = [color.r, color.g, color.b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  })

  return val.join('')
}


/**
 * Helper to convert a hex string into a rgb object
 * @param {String} hex Hex string (e.g. "efefef")
 * @returns RGB Object.
 */
const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}
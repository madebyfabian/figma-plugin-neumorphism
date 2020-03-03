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



type RGBObj = { r: number, g: number, b: number }
// type HSLObj = { h: number, s: number, l: number }



/**
 * Helper to convert a RGB object to hex.
 * @param color RGB object.
 * @returns {String} Hex string (e.g. "efefef").
 */
const rgbToHex = (color: RGBObj) => {
  const val = [color.r, color.g, color.b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  })

  return val.join('')
}



/**
 * Helper to convert a hex string into a RGB object.
 * @param {String} hex Hex string (e.g. "efefef").
 * @returns RGB Object.
 */
const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? <RGBObj>{
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}



// /**
//  * Helper to convert a RGB object to HSL object.
//  * @param {object} rgbObj 3-element object containing the RGB values.
//  * @returns {object} 3-element object containing the HSL values.
//  */
// export const rgbToHsl = (rgbObj: RGBObj) => {
//   let r = rgbObj.r, g = rgbObj.g, b = rgbObj.b

//   r /= 255, g /= 255, b /= 255;
//   var max = Math.max(r, g, b), min = Math.min(r, g, b);
//   var h, s, l = (max + min) / 2;

//   if(max == min){
//       h = s = 0; // achromatic
//   }else{
//       var d = max - min;
//       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//       switch(max){
//           case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//           case g: h = (b - r) / d + 2; break;
//           case b: h = (r - g) / d + 4; break;
//       }
//       h /= 6;
//   }

//   return <HSLObj>{ h, s, l }
// }



// /**
//  * Helper to convert a HSL object to RGB object.
//  * @param {object} hslObj 3-element object containing the RGB values.
//  * @returns {object} 3-element object containing the HSL values.
//  */
// export const hslToRgb = (hslObj: HSLObj) => {
//   let h = hslObj.h, s = hslObj.s, l = hslObj.l

//   var r, g, b;

//   if(s == 0){
//       r = g = b = l; // achromatic
//   }else{
//       var hue2rgb = function hue2rgb(p, q, t){
//           if(t < 0) t += 1;
//           if(t > 1) t -= 1;
//           if(t < 1/6) return p + (q - p) * 6 * t;
//           if(t < 1/2) return q;
//           if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//           return p;
//       }

//       var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//       var p = 2 * l - q;
//       r = hue2rgb(p, q, h + 1/3);
//       g = hue2rgb(p, q, h);
//       b = hue2rgb(p, q, h - 1/3);
//   }

//   const returnval = <RGBObj>{
//     r: r ,
//     g: g,
//     b: b
//   }


//   // console.log(returnval)

//   return returnval
// }

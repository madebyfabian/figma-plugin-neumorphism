export type CustomOptionsObject = {
  intensity: number,
  blur: number,
  elevation: number,
  inset: boolean,
  blurManuallySet: boolean,
  shadowDirection: CustomShadowDirection
}

export type CustomShadowDirection = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
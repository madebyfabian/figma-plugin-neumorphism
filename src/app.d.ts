export type CustomOptionsObject = {
  intensity: number,
  elevation: number,
  inset: boolean,
  shadowDirection: CustomShadowDirection

  blurManuallySet: boolean,
  blur: number,
}

export type CustomShadowDirection = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
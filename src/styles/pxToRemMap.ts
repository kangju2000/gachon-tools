const pxToRem = (px: number, base: number = 16) => `${(px / base).toFixed(4)}rem` as const

export const pxToRemMap = Array.from({ length: 1024 }, (_, i) => i + 1).reduce<
  Record<`${number}px`, ReturnType<typeof pxToRem>>
>((acc, px) => {
  acc[`${px}px`] = pxToRem(px)
  return acc
}, {})

// bend allowance
//
// - https://sheetmetal.me/formulas-and-functions/bend-deduction/
// - https://www.smlease.com/entries/sheet-metal-design/k-factor-in-sheetmetal-bending/

export interface BendAllowanceOptions {
  materialThickness: number
  bendAngle: number // https://sheetmetal.me/formulas-and-functions/bend-angles/
  insideRadius: number
  kFactor: number
}

export function getBendAllowance(options: BendAllowanceOptions) {
  const {
    materialThickness,
    bendAngle,
    insideRadius,
    kFactor
  } = options

  return (Math.PI / 180) * bendAngle * (insideRadius + kFactor * materialThickness)
}

import { getBendAllowance } from './bend-allowance'

// bend deduction
//
// - https://sheetmetal.me/formulas-and-functions/bend-deduction/
// - https://www.smlease.com/entries/sheet-metal-design/k-factor-in-sheetmetal-bending/

export interface BendDeductionOptions {
  materialThickness: number
  bendAngle: number // https://sheetmetal.me/formulas-and-functions/bend-angles/
  insideRadius: number
  kFactor: number
}

export function getBendDeduction(options: BendDeductionOptions) {
  const {
    materialThickness,
    bendAngle,
    insideRadius,
    kFactor
  } = options
  
  const bendAngleInRadians = 2 * Math.PI * bendAngle

  const outsideSetback = Math.tan(bendAngleInRadians / 2) * (insideRadius + materialThickness)
  const bendAllowance = getBendAllowance(options)

  return 2 * outsideSetback - bendAllowance
}

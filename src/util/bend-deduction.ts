import { getBendAllowance } from './bend-allowance'
import { getOutsideSetback } from './outside-setback'

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
  
  const outsideSetback = getOutsideSetback({
    materialThickness,
    bendAngle,
    insideRadius,
  })
  const bendAllowance = getBendAllowance({
    materialThickness,
    bendAngle,
    insideRadius,
    kFactor,
  })

  return 2 * outsideSetback - bendAllowance
}

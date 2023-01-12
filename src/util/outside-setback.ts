// outside setback
//
// - https://sheetmetal.me/formulas-and-functions/outside-setback/

export interface OutsideSetbackOptions {
  materialThickness: number
  bendAngle: number // https://sheetmetal.me/formulas-and-functions/bend-angles/
  insideRadius: number
}

export function getOutsideSetback(options: OutsideSetbackOptions) {
  const {
    materialThickness,
    bendAngle,
    insideRadius,
  } = options

  const bendAngleInRadians = (Math.PI / 180) * bendAngle

  return Math.tan(bendAngleInRadians / 2) * (insideRadius + materialThickness)
}

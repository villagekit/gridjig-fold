// inside setback
//
// - https://sheetmetal.me/formulas-and-functions/inside-setback/

export interface InsideSetbackOptions {
  bendAngle: number // https://sheetmetal.me/formulas-and-functions/bend-angles/
  insideRadius: number
}

export function getInsideSetback(options: InsideSetbackOptions) {
  const {
    bendAngle,
    insideRadius,
  } = options

  const bendAngleInRadians = (Math.PI / 180) * bendAngle

  return Math.tan(bendAngleInRadians / 2) * insideRadius
}

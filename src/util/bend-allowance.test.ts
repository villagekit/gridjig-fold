import { describe, expect, test } from '@jest/globals'

import { BendAllowanceOptions, getBendAllowance } from './bend-allowance'

const sheetMetalMeCases: Array<[Omit<BendAllowanceOptions, 'bendAngle'>, Array<[number, number]>]> = [
  [
    { materialThickness: 0.163, insideRadius: 0.210, kFactor: 0.33 },
    [
      [10, 0.0461],
      [15, 0.0691],
      [20, 0.0921],
      [25, 0.1152],
      [30, 0.1382],
      [35, 0.1612],
      [40, 0.1842],
      [45, 0.2073],
      [50, 0.2303],
      [55, 0.2533],
      [60, 0.2764],
      [65, 0.2994],
      [70, 0.3224],
      [75, 0.3455],
      [80, 0.3685],
      [85, 0.3915],
      [90, 0.4146],
      [95, 0.4376],
      [100, 0.4606],
      [105, 0.4836],
      [110, 0.5067],
      [115, 0.5297],
      [120, 0.5527],
      [125, 0.5758],
      [130, 0.5988],
      [135, 0.6218],
      [140, 0.6449],
      [145, 0.6679],
      [150, 0.6909],
      [155, 0.7140],
      [160, 0.7370],
      [165, 0.7600],
      [170, 0.7830],
    ],
  ],
  [
    { materialThickness: 0.135, insideRadius: 0.164, kFactor: 0.33 },
    [
      [10, 0.0364],
      [15, 0.0546],
      [20, 0.0727],
      [25, 0.0909],
      [30, 0.1091],
      [35, 0.1273],
      [40, 0.1455],
      [45, 0.1637],
      [50, 0.1818],
      [55, 0.2],
      [60, 0.2182],
      [65, 0.2364],
      [70, 0.2546],
      [75, 0.2728],
      [80, 0.291],
      [85, 0.3091],
      [90, 0.3273],
      [95, 0.3455],
      [100, 0.3637],
      [105, 0.3819],
      [110, 0.4001],
      [115, 0.4182],
      [120, 0.4364],
      [125, 0.4546],
      [130, 0.4728],
      [135, 0.491],
      [140, 0.5092],
      [145, 0.5274],
      [150, 0.5455],
      [155, 0.5637],
      [160, 0.5819],
      [165, 0.6001],
      [170, 0.6183],
    ],
  ],
  // and so on... http://sheetmetal.me/wp-content/uploads/2011/05/Bend-Allowance.xls
]

describe('bend allowance', () => {
  for (let column of sheetMetalMeCases) {
    const [options, cases] = column
    for (let [bendAngle, expected] of cases) {
      const { materialThickness, insideRadius, kFactor } = options
      const testLabel = `MT=${materialThickness}, IR=${insideRadius}, K=${kFactor}, BA=${bendAngle}`
      test(testLabel, () => {
        const actual = getBendAllowance({ materialThickness, insideRadius, kFactor, bendAngle })
        expect(actual).toBeCloseTo(expected)
      })
    }
  }
})

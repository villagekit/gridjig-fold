import { describe, expect, test } from '@jest/globals'

import { BendDeductionOptions, getBendDeduction } from './bend-deduction'

const sheetMetalMeCases: Array<[Omit<BendDeductionOptions, 'bendAngle'>, Array<[number, number]>]> = [
  [
    { materialThickness: 0.163, insideRadius: 0.210, kFactor: 0.33 },
    [
      [10, 0.0193],
      [15, 0.0292],
      [20, 0.0396],
      [25, 0.0504],
      [30, 0.0619],
      [35, 0.0742],
      [40, 0.0876],
      [45, 0.1021],
      [50, 0.1179],
      [55, 0.1354],
      [60, 0.1548],
      [65, 0.1764],
      [70, 0.2005],
      [75, 0.2276],
      [80, 0.2581],
      [85, 0.2928],
      [90, 0.3322],
      [95, 0.3774],
      [100, 0.4294],
      [105, 0.4896],
      [110, 0.5598],
      [115, 0.6425],
      [120, 0.7407],
      [125, 0.8588],
      [130, 1.0027],
      [135, 1.1811],
      [140, 1.4069],
      [145, 1.7006],
      [150, 2.0961],
      [155, 2.6546],
      [160, 3.4983],
      [165, 4.9125],
      [170, 7.7529],
    ],
  ],
  [
    { materialThickness: 0.135, insideRadius: 0.164, kFactor: 0.33 },
    [
      [10, 0.0159],
      [15, 0.024],
      [20, 0.0325],
      [25, 0.0414],
      [30, 0.0509],
      [35, 0.0609],
      [40, 0.0718],
      [45, 0.0836],
      [50, 0.0965],
      [55, 0.1107],
      [60, 0.1265],
      [65, 0.1439],
      [70, 0.1634],
      [75, 0.1853],
      [80, 0.21],
      [85, 0.2379],
      [90, 0.2697],
      [95, 0.306],
      [100, 0.3478],
      [105, 0.3961],
      [110, 0.4525],
      [115, 0.5188],
      [120, 0.5976],
      [125, 0.6922],
      [130, 0.8075],
      [135, 0.9503],
      [140, 1.1311],
      [145, 1.3661],
      [150, 1.6825],
      [155, 2.1292],
      [160, 2.8038],
      [165, 3.9346],
      [170, 6.2055],
    ],
  ],
  // and so on... http://sheetmetal.me/wp-content/uploads/2011/05/Bend-Deduction.xls
]

describe('bend deduction', () => {
  for (let column of sheetMetalMeCases) {
    const [options, cases] = column
    for (let [bendAngle, expected] of cases) {
      const { materialThickness, insideRadius, kFactor } = options
      const testLabel = `MT=${materialThickness}, IR=${insideRadius}, K=${kFactor}, BA=${bendAngle}`
      test(testLabel, () => {
        const actual = getBendDeduction({ materialThickness, insideRadius, kFactor, bendAngle })
        expect(actual).toBeCloseTo(expected, 0.015)
      })
    }
  }
})

import type { Geom3, Geom2 } from '@jscad/modeling/src/geometries/types'
import { booleans, extrusions, expansions, geometries, hulls, maths, primitives, transforms } from '@jscad/modeling'

import { InnerFoldDesignOptions } from './types'
import { getBendAllowance, getBendDeduction } from './util'
import { innerFoldDesignOptions } from '../build-options'

const INF = 10000
const ROT = 2 * Math.PI

export function main() {
  return createInnerFoldScad(innerFoldDesignOptions)
}

export function createInnerFoldScad(options: InnerFoldDesignOptions) {
  const {
    gridUnitInMm,
    holeDiameterInMm,
    materialThickness,
    insideRadius,
    kFactor,
    lengthInGridUnits,
    widthInMm,
    heightInMm,
    mountingHoleCount,
    mountingHoleDiameterInMm,
  } = options

  const bendAllowance = getBendAllowance({
    materialThickness,
    insideRadius,
    kFactor,
    bendAngle: 90,
  })

  const bendDeduction = getBendDeduction({
    materialThickness,
    insideRadius,
    kFactor,
    bendAngle: 90,
  })

  const sheetLength = lengthInGridUnits * gridUnitInMm

  return booleans.union(
    booleans.subtract(
      booleans.union(
        createInnerFoldWidth(),
        createInnerFoldHeight(),
      ),
      createInnerFoldCurveCut(),
    ),
    createInnerFoldCurve(),
  )

  function createInnerFoldWidth(): Geom3 {
    const holes: Array<Geom2> = []
    for (let holeIndex = 0; holeIndex < mountingHoleCount - 1; holeIndex++) {
      holes.push(
        primitives.circle({
          center: [
            (1/2) * widthInMm + holeIndex * (sheetLength / (mountingHoleCount - 1)),
            (1/2) * widthInMm,
          ],
          radius: (1/2) * mountingHoleDiameterInMm
        })
      )
    }
    holes.push(
      primitives.circle({
        center: [
          sheetLength - (1/2) * widthInMm,
          (1/2) * widthInMm,
        ],
        radius: (1/2) * mountingHoleDiameterInMm
      }),
    )

    const profile = booleans.subtract(
      primitives.roundedRectangle({
        center: [
          (1/2) * sheetLength,
          (1/2) * widthInMm,
        ],
        size: [
          sheetLength,
          widthInMm,
        ],
        roundRadius: 2,
      }),
      ...holes
    )

    return extrusions.extrudeLinear(
      {
        height: materialThickness,
      },
      profile
    )
  }

  function createInnerFoldHeight() {
    const holes: Array<Geom2> = []
    for (let holeIndex = 0; holeIndex < lengthInGridUnits; holeIndex++) {
      holes.push(
        primitives.circle({
          center: [
            ((1/2) + holeIndex) * gridUnitInMm,
            (1/2) * gridUnitInMm,
          ],
          radius: (1/2) * holeDiameterInMm
        })
      )
    }

    const profile = booleans.subtract(
      primitives.roundedRectangle({
        center: [
          (1/2) * sheetLength,
          (1/2) * heightInMm,
        ],
        size: [
          sheetLength,
          heightInMm,
        ],
        roundRadius: 2,
      }),
      ...holes
    )

    const solid = extrusions.extrudeLinear(
      {
        height: materialThickness,
      },
      profile
    )

    return transforms.translate(
      [
        0,
        widthInMm,
        0,
      ],
      transforms.rotateX(
        (1/4) * ROT,
        solid
      )
    )
  }

  function createInnerFoldCurveCut() {
    return primitives.cuboid({
      center: [
        (1/2) * sheetLength,
        widthInMm,
        0,
      ],
      size: [
        INF,
        2 * ((1/2) * bendDeduction + (1/2) * bendAllowance),
        2 * ((1/2) * bendDeduction + (1/2) * bendAllowance),
      ],
    })
  }

  function createInnerFoldCurve() {
    const insideArc = primitives.arc({
      radius: insideRadius,
      startAngle: 0,
      endAngle: (1/4) * ROT,
    })

    const outsideArc = primitives.arc({
      radius: insideRadius + materialThickness,
      startAngle: 0,
      endAngle: (1/4) * ROT,
    })

    const profile = geometries.path2.fromPoints(
      {
        closed: true,
      },
      [
        ...insideArc.points.map(maths.vec2.clone).reverse(),
        ...outsideArc.points.map(maths.vec2.clone),
      ],
    )

    const solid = extrusions.extrudeLinear(
      {
        height: sheetLength,
      },
      profile
    )

    return transforms.translate(
      [
        0,
        widthInMm - (1/2) * bendDeduction - (1/2) * bendAllowance,
        insideRadius + materialThickness,
      ],
      transforms.rotateY(
        (1/4) * ROT,
        solid
      )
    )
  }
}

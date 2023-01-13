import type { Geom3, Geom2 } from '@jscad/modeling/src/geometries/types'
import { booleans, extrusions, expansions, geometries, hulls, maths, primitives, transforms } from '@jscad/modeling'

import { TableDesignOptions } from '../types'
import { getBendAllowance, getBendDeduction } from '../util'
import { designs } from '../designs'

const INF = 10000
const ROT = 2 * Math.PI

export function main() {
  return createTableScad(designs.table.options)
}

export function createTableScad(options: TableDesignOptions) {
  const {
    gridUnitInMm,
    materialThickness,
    lengthInGridUnits,
    sideWidthInMm,
    midWidthInMm,
    mountingHoleCount,
    mountingHoleDiameterInMm,
  } = options

  const sheetLength = lengthInGridUnits * gridUnitInMm
  const sheetWidth = 2 * sideWidthInMm + midWidthInMm

  const profile = booleans.subtract(
    createPlate(),
    createMountingHoles({
      offset: [0, (1/2) * sideWidthInMm],
    }),
    createMountingHoles({
      offset: [0, (3/2) * sideWidthInMm + midWidthInMm]
    }),
  )

  return extrusions.extrudeLinear(
    {
      height: materialThickness,
    },
    profile
  )

  function createPlate() {
    return primitives.roundedRectangle({
      center: [
        (1/2) * sheetLength,
        (1/2) * sheetWidth,
      ],
      size: [
        sheetLength,
        sheetWidth,
      ],
      roundRadius: 2,
    })
  }

  function createMountingHoles({ offset }: { offset: [number, number] }) {
    const holes: Array<Geom2> = []
    for (let holeIndex = 0; holeIndex < mountingHoleCount - 1; holeIndex++) {
      holes.push(
        primitives.circle({
          center: [
            offset[0] + (1/2) * sideWidthInMm + holeIndex * (sheetLength / (mountingHoleCount - 1)),
            offset[1],
          ],
          radius: (1/2) * mountingHoleDiameterInMm
        })
      )
    }
    holes.push(
      primitives.circle({
        center: [
          offset[0] + sheetLength - (1/2) * sideWidthInMm,
          offset[1],
        ],
        radius: (1/2) * mountingHoleDiameterInMm
      }),
    )

    return booleans.union(...holes)
  }
}

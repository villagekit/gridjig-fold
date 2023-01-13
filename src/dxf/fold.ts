import { DxfWriter, point3d } from '@tarikjabiri/dxf'

import { GridOptions, FoldDesignOptions } from '../types'
import { getBendAllowance, getBendDeduction } from '../util'
import { createBaseDxf } from './base'
import { createRoundedSquare } from './rounded-square'

export function createFoldDxf(options: FoldDesignOptions): DxfWriter {
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
  console.log('bend allowance', bendAllowance)

  const bendDeduction = getBendDeduction({
    materialThickness,
    insideRadius,
    kFactor,
    bendAngle: 90,
  })
  console.log('bend deduction', bendDeduction)

  const sheetLength = lengthInGridUnits * gridUnitInMm
  const sheetWidth = widthInMm + heightInMm - bendDeduction

  console.log('length', sheetLength)
  console.log('width', sheetWidth)

  const { dxf, layers } = createBaseDxf()

  dxf.setCurrentLayerName('Edges')

  createRoundedSquare({
    size: [sheetLength, sheetWidth],
    radius: 2,
    dxf,
  })

  for (let holeIndex = 0; holeIndex < mountingHoleCount - 1; holeIndex++) {
    dxf.addCircle(
      point3d(
        (1/2) * widthInMm + holeIndex * (sheetLength / (mountingHoleCount - 1)),
        (1/2) * widthInMm,
      ),
      (1/2) * mountingHoleDiameterInMm,
    )
  }
  dxf.addCircle(
    point3d(
      sheetLength - (1/2) * widthInMm,
      (1/2) * widthInMm,
    ),
    (1/2) * mountingHoleDiameterInMm,
  )

  for (let holeIndex = 0; holeIndex < lengthInGridUnits; holeIndex++) {
    createGridHole({
      start: [0, sheetWidth - heightInMm],
      gridUnitInMm,
      holeDiameterInMm,
      holeIndex,
      dxf,
    })
  }

  dxf.setCurrentLayerName('Faces')

  dxf.addLine(
    point3d(
      0,
      widthInMm - (1/2) * bendDeduction - (1/2) * bendAllowance
    ),
    point3d(
      sheetLength,
      widthInMm - (1/2) * bendDeduction - (1/2) * bendAllowance
    ),
  )

  dxf.addLine(
    point3d(
      0,
      widthInMm - (1/2) * bendDeduction + (1/2) * bendAllowance
    ),
    point3d(
      sheetLength,
      widthInMm - (1/2) * bendDeduction + (1/2) * bendAllowance
    ),
  )

  dxf.setCurrentLayerName('Bend_Up')

  dxf.addLine(
    point3d(
      0,
      widthInMm - (1/2) * bendDeduction
    ),
    point3d(
      sheetLength,
      widthInMm - (1/2) * bendDeduction
    ),
  )
  
  return dxf
}

interface GridHoleOptions extends GridOptions {
  start?: [number, number]
  holeIndex: number
  dxf: DxfWriter
}

function createGridHole(options: GridHoleOptions) {
  const {
    gridUnitInMm,
    holeDiameterInMm,
    start = [0, 0],
    holeIndex,
    dxf
  } = options

  dxf.addCircle(
    point3d(
      start[0] + ((1/2) + holeIndex) * gridUnitInMm,
      start[1] + (1/2) * gridUnitInMm,
    ),
    (1/2) * holeDiameterInMm,
  )
}

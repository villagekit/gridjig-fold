import { DxfWriter, point3d } from '@tarikjabiri/dxf'

import { GridOptions, TableDesignOptions } from '../types'
import { createBaseDxf } from './base'
import { createRoundedSquare } from './rounded-square'

export function createTableDxf(options: TableDesignOptions): DxfWriter {
  const {
    gridUnitInMm,
    holeDiameterInMm,
    materialThickness,
    lengthInGridUnits,
    sideWidthInMm,
    midWidthInMm,
    mountingHoleCount,
    mountingHoleDiameterInMm,
  } = options

  const sheetLength = lengthInGridUnits * gridUnitInMm
  const sheetWidth = 2 * sideWidthInMm + midWidthInMm

  const { dxf, layers } = createBaseDxf()

  dxf.setCurrentLayerName('Edges')

  createRoundedSquare({
    size: [sheetLength, sheetWidth],
    radius: 2,
    dxf,
  })

  addMountingHoles({
    offset: [0, (1/2) * sideWidthInMm],
  })
  addMountingHoles({
    offset: [0, (3/2) * sideWidthInMm + midWidthInMm]
  })

  return dxf

  function addMountingHoles({ offset }: { offset: [number, number] }) {
    for (let holeIndex = 0; holeIndex < mountingHoleCount - 1; holeIndex++) {
      dxf.addCircle(
        point3d(
          offset[0] + (1/2) * sideWidthInMm + holeIndex * (sheetLength / (mountingHoleCount - 1)),
          offset[1],
        ),
        (1/2) * mountingHoleDiameterInMm
      )
    }
    dxf.addCircle(
      point3d(
        offset[0] + sheetLength - (1/2) * sideWidthInMm,
        offset[1],
      ),
      (1/2) * mountingHoleDiameterInMm
    )
  }
}

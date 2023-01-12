import { DxfWriter, Units, Colors, DxfLayer, point3d } from '@tarikjabiri/dxf'

import { getBendAllowance, getBendDeduction } from './util'

function createBaseDesign() {
  const dxf = new DxfWriter()

  dxf.setUnits(Units.Millimeters)

  dxf.addLType('Bends', '__ . ', [2, -1, 0, -1])
  dxf.addLType('Faces', '. ', [0, -1])

  const layers = {
    edges: dxf.addLayer(
      'Edges',
      Colors.White,
      'Continuous'
    ),

    faces: dxf.addLayer(
      'Faces',
      Colors.Magenta,
      'Faces'
    ),

    bendUp: dxf.addLayer(
      'Bend_Up',
      Colors.Cyan,
      'Bends'
    ),

    bendDown: dxf.addLayer(
      'Bend_Down',
      Colors.Yellow,
      'Bends'
    ),
  }

  return { dxf, layers }
}

export interface GridOptions {
  gridUnitInMm: number
  holeDiameterInMm: number
}

export interface FoldOptions {
  materialThickness: number
  insideRadius: number
  kFactor: number
}

export interface InnerFoldDesignOptions extends GridOptions, FoldOptions {
  lengthInGridUnits: number
  widthInMm: number
  heightInMm: number
  mountingHoleCount: number
  mountingHoleDiameterInMm: number
}

export function createInnerFoldDesign(options: InnerFoldDesignOptions): DxfWriter {
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

  const { dxf, layers } = createBaseDesign()

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

interface RoundedSquareOptions {
  start?: [number, number]
  size: [number, number]
  radius: number
  dxf: DxfWriter
}
function createRoundedSquare(options: RoundedSquareOptions) {
  const {
    start = [0, 0],
    size,
    radius,
    dxf,
  } = options

  const bottomLeftCorner = point3d(start[0], start[1])
  const bottomRightCorner = point3d(start[0] + size[0], start[1])
  const topRightCorner = point3d(start[0] + size[0], start[1] + size[1])
  const topLeftCorner = point3d(start[0], start[1] + size[1])
  
  // bottom line
  dxf.addLine(
    point3d(bottomLeftCorner.x + radius, bottomLeftCorner.y),
    point3d(bottomRightCorner.x - radius, bottomRightCorner.y),
  )

  // bottom right arc
  dxf.addArc(
    point3d(bottomRightCorner.x - radius, bottomRightCorner.y + radius),
    radius,
    270,
    360,
  )

  // right line
  dxf.addLine(
    point3d(bottomRightCorner.x, bottomRightCorner.y + radius),
    point3d(topRightCorner.x, topRightCorner.y - radius),
  )

  // top right arc
  dxf.addArc(
    point3d(topRightCorner.x - radius, topRightCorner.y - radius),
    radius,
    0,
    90,
  )

  // bottom line
  dxf.addLine(
    point3d(topRightCorner.x - radius, topRightCorner.y),
    point3d(topLeftCorner.x + radius, topLeftCorner.y),
  )

  // top left arc
  dxf.addArc(
    point3d(topLeftCorner.x + radius, topLeftCorner.y - radius),
    radius,
    90,
    180,
  )

  // left line
  dxf.addLine(
    point3d(topLeftCorner.x, topLeftCorner.y - radius),
    point3d(bottomLeftCorner.x, bottomLeftCorner.y + radius),
  )

  // bottom left arc
  dxf.addArc(
    point3d(bottomLeftCorner.x + radius, bottomLeftCorner.y + radius),
    radius,
    180,
    270,
  )
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

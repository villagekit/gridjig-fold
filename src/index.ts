import { DxfWriter, Units, Colors, DxfLayer, point2d } from '@tarikjabiri/dxf'

function createBaseDesign() {
  const dxf = new DxfWriter()

  dxf.setUnits(Units.Millimeters)

  dxf.addLType('Bends', '__ . ', [2, -1, 0, -1])

  const layers = {
    edges: dxf.addLayer(
      'Edges',
      Colors.White,
      'Continuous'
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
  lengthInGridUnits: number
  holeDiameterInMm: number
}

export interface FoldOptions {
  materialThickness: number
  kFactor: number
}

export interface InnerFoldDesignOptions extends GridOptions, FoldOptions {}

export function createInnerFoldDesign(options: InnerFoldDesignOptions): DxfWriter {
  const {
    gridUnitInMm,
    lengthInGridUnits,
    holeDiameterInMm,
    materialThickness,
    kFactor,
  } = options

  const { dxf, layers } = createBaseDesign()
  
  return dxf
}

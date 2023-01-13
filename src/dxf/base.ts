import { DxfWriter, Units, Colors } from '@tarikjabiri/dxf'

export function createBaseDxf() {
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


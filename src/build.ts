import { join } from 'node:path'
import { Buffer } from 'node:buffer'
import { writeFile } from 'fs/promises'
// @ts-ignore
import { Helper as DxfHelper } from 'dxf'
// @ts-ignore
import stl from '@jscad/stl-serializer'
import { stl2png } from '@scalenc/stl-to-png'

import { designs } from './designs'

const buildDir = join(__dirname, '../build')

Promise.all(
  Object.entries(designs)
    .map(([name, design]) => buildDesign(name, design)
  )
)

type Design = typeof designs[keyof typeof designs]

function buildDesign(name: string, design: Design) {
  const dxf = design.dxf(design.options)
  const dxfString = dxf.stringify()
  const dxfPath = join(buildDir, `${name}.dxf`)
  writeFile(dxfPath, dxfString)

  const dxfSvgHelper = new DxfHelper(dxfString)
  const dxfSvgString = dxfSvgHelper.toSVG()
    .replace(
      'width="100%" height="100%"',
      'width="100%" height="100%" style="background-color: white;"',
    )
  const dxfSvgPath = join(buildDir, `${name}.dxf.svg`)
  writeFile(dxfSvgPath, dxfSvgString)

  const scad = design.scad(design.options)
  const scadBuffer = Buffer.concat(
    stl.serialize({ binary: true }, scad)
      .map((arrayBuffer: ArrayBuffer) => Buffer.from(arrayBuffer))
  )
  const scadPath = join(buildDir, `${name}.stl`)
  writeFile(scadPath, scadBuffer)

  const scadPngBuffer = stl2png(
    scadBuffer,
    {},
  )
  const scadPngPath = join(buildDir, `${name}.stl.png`)
  writeFile(scadPngPath, scadPngBuffer)
}

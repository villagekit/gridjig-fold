import { Buffer } from 'node:buffer'
import { writeFile } from 'fs/promises'
// @ts-ignore
import { Helper as DxfHelper } from 'dxf'
// @ts-ignore
import stl from '@jscad/stl-serializer'
import { stl2png } from '@scalenc/stl-to-png'

import { createInnerFoldScad, createInnerFoldDxf } from './src'
import { innerFoldDesignOptions } from './build-options'

const dxf = createInnerFoldDxf(innerFoldDesignOptions)
const dxfString = dxf.stringify()
const dxfPath = './build.dxf'
writeFile(dxfPath, dxfString)

const dxfSvgHelper = new DxfHelper(dxfString)
const dxfSvgString = dxfSvgHelper.toSVG()
  .replace(
    'width="100%" height="100%"',
    'width="100%" height="100%" style="background-color: white;"',
  )
const dxfSvgPath = './build.dxf.svg'
writeFile(dxfSvgPath, dxfSvgString)

const scad = createInnerFoldScad(innerFoldDesignOptions)
const scadBuffer = Buffer.concat(
  stl.serialize({ binary: true }, scad)
    .map((arrayBuffer: ArrayBuffer) => Buffer.from(arrayBuffer))
)
const scadPath = './build.stl'
writeFile(scadPath, scadBuffer)

const scadPngBuffer = stl2png(
  scadBuffer,
  {},
)
const scadPngPath = './build.stl.png'
writeFile(scadPngPath, scadPngBuffer)

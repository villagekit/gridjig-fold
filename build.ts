import { writeFile } from 'fs/promises'
// @ts-ignore
import { Helper as DxfHelper } from 'dxf'
// @ts-ignore
import stl from '@jscad/stl-serializer'

import { createInnerFoldScad, createInnerFoldDxf } from './src'
import { innerFoldDesignOptions } from './build-options'

const dxf = createInnerFoldDxf(innerFoldDesignOptions)
const dxfString = dxf.stringify()
const dxfPath = './build.dxf'
writeFile(dxfPath, dxfString)

const helper = new DxfHelper(dxfString)
const svgString = helper.toSVG()
  .replace(
    'width="100%" height="100%"',
    'width="100%" height="100%" style="background-color: white;"',
  )
const svgPath = './build.svg'
writeFile(svgPath, svgString)

const scad = createInnerFoldScad(innerFoldDesignOptions)
const scadBuffer = stl.serialize({ binary: true }, scad)
const scadPath = './build.stl'
writeFile(scadPath, scadBuffer)

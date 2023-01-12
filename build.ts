import { writeFile } from 'fs/promises'
// @ts-ignore
import { Helper as DxfHelper } from 'dxf'
// @ts-ignore
import stl from '@jscad/stl-serializer'

import { createInnerFoldScad, createInnerFoldDxf, GridOptions, FoldOptions } from './src'

const gridOptions: GridOptions = {
  gridUnitInMm: 40,
  holeDiameterInMm: 8,
}

// https://onestopcuttingshop.co.nz/folding

const foldOptions: FoldOptions = {
  materialThickness: 6,
  insideRadius: 6.5,
  kFactor: 0.36,
}

// data sheet:
// - bend allowance : 5.65
//
// NOTE (mw): why does this not match what we calculate?

const innerFoldDesignOptions = {
  ...gridOptions,
  ...foldOptions,
  lengthInGridUnits: 20,
  widthInMm: 40,
  heightInMm: 40,
  mountingHoleCount: 5,
  mountingHoleDiameterInMm: 8,
}

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

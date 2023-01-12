import { writeFile } from 'fs/promises'
// @ts-ignore
import { Helper as DxfHelper } from 'dxf'

import { createInnerFoldDesign, GridOptions, FoldOptions } from './src'

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

const dxf = createInnerFoldDesign({
  ...gridOptions,
  ...foldOptions,
  lengthInGridUnits: 20,
  widthInMm: 40,
  heightInMm: 40,
  mountingHoleCount: 5,
  mountingHoleDiameterInMm: 8,
})

const dxfString = dxf.stringify()
const dxfPath = './build.dxf'

writeFile(dxfPath, dxfString)

const helper = new DxfHelper(dxfString)
const svgString = helper.toSVG()
const svgPath = './build.svg'

writeFile(svgPath, svgString)


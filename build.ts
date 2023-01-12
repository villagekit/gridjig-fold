import { writeFile } from 'fs/promises'

import { createInnerFoldDesign, GridOptions, FoldOptions } from './src'

const gridOptions: GridOptions = {
  gridUnitInMm: 40,
  lengthInGridUnits: 20,
  holeDiameterInMm: 8,
}

const foldOptions: FoldOptions = {
  kFactor: 0.5,
  materialThickness: 10,
}

const dxf = createInnerFoldDesign({
  ...gridOptions,
  ...foldOptions,
})

const string = dxf.stringify()
const path = './build.dxf'

writeFile(path, string)

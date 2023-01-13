import { createInnerFoldScad, createInnerFoldDxf, GridOptions, FoldOptions } from './src'

const gridOptions: GridOptions = {
  gridUnitInMm: 40,
  holeDiameterInMm: 8,
}

// https://onestopcuttingshop.co.nz/folding

const foldOptions: FoldOptions = {
  materialThickness: 2,
  insideRadius: 2,
  kFactor: 0.28,
}

// data sheet:
// - bend allowance : 1.97
//
// NOTE (mw): why does this not match what we calculate?

export const innerFoldDesignOptions = {
  ...gridOptions,
  ...foldOptions,
  lengthInGridUnits: 20,
  widthInMm: 20,
  heightInMm: 30,
  mountingHoleCount: 5,
  mountingHoleDiameterInMm: 5,
}

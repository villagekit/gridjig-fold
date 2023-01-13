import { DxfWriter } from '@tarikjabiri/dxf'
import { Geom3 } from '@jscad/modeling/src/geometries/types'

import {
  GridOptions,
  FoldOptions,
  FoldDesignOptions,
  createFoldScad,
  createFoldDxf,
  TableDesignOptions,
  createTableScad,
  createTableDxf,
} from './'

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

const lengthInGridUnits = 20;

const foldDesignOptions: FoldDesignOptions = {
  ...gridOptions,
  ...foldOptions,
  lengthInGridUnits,
  widthInMm: 20,
  heightInMm: 30,
  mountingHoleCount: 5,
  mountingHoleDiameterInMm: 5,
}

const tableDesignOptions: TableDesignOptions = {
  ...gridOptions,
  ...foldOptions,
  lengthInGridUnits,
  sideWidthInMm: foldDesignOptions.widthInMm,
  midWidthInMm: gridOptions.gridUnitInMm,
  mountingHoleCount: foldDesignOptions.mountingHoleCount,
  mountingHoleDiameterInMm: foldDesignOptions.mountingHoleDiameterInMm,
}

type Design<Options extends object> = {
  options: Options
  dxf: (options: Options) => DxfWriter
  scad: (options: Options) => Geom3
}

export const designs: Record<string, Design<any>> = {
  fold: {
    options: foldDesignOptions,
    dxf: createFoldDxf,
    scad: createFoldScad,
  },
  table: {
    options: tableDesignOptions,
    dxf: createTableDxf,
    scad: createTableScad,
  }
}

export interface GridOptions {
  gridUnitInMm: number
  holeDiameterInMm: number
}

export interface FoldOptions {
  materialThickness: number
  insideRadius: number
  kFactor: number
}

export interface FoldDesignOptions extends GridOptions, FoldOptions {
  lengthInGridUnits: number
  widthInMm: number
  heightInMm: number
  mountingHoleCount: number
  mountingHoleDiameterInMm: number
}

export interface TableDesignOptions extends GridOptions {
  materialThickness: number
  lengthInGridUnits: number
  sideWidthInMm: number
  midWidthInMm: number
  mountingHoleCount: number
  mountingHoleDiameterInMm: number
}


export interface GridOptions {
  gridUnitInMm: number
  holeDiameterInMm: number
}

export interface FoldOptions {
  materialThickness: number
  insideRadius: number
  kFactor: number
}

export interface InnerFoldDesignOptions extends GridOptions, FoldOptions {
  lengthInGridUnits: number
  widthInMm: number
  heightInMm: number
  mountingHoleCount: number
  mountingHoleDiameterInMm: number
}


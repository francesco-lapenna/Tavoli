export const GRID_UNIT = 40; // px per 0.5m on screen

export function snap(value: number): number {
  return Math.round(value / GRID_UNIT) * GRID_UNIT;
}

export function metersToUnits(meters: number): number {
  return meters * 2; // 1m = 2 grid units
}

export function unitsToMeters(units: number): number {
  return units / 2;
}

export function unitsToPx(units: number): number {
  return units * GRID_UNIT;
}

export function pxToUnits(px: number): number {
  return px / GRID_UNIT;
}

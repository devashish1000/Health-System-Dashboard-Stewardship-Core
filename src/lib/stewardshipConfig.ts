/** FY stewardship targets and certificate metadata */
export const STEWARDSHIP_TARGET_MARGIN = 8.5;
export const LABOR_RATIO_TARGET = 40.2;

export function stewardshipModelCode(fiscalYearLabel: string): string {
  return `COMMONSPIRIT-STU-${fiscalYearLabel}-V1`;
}

export function controlTowerVersion(): string {
  return "v1.1.0";
}

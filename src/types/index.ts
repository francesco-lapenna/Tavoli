export type TableType = '1x1' | '1x2' | 'circle2';

export interface Table {
  id: string;
  type: TableType;
  x: number;
  y: number;
  rotation: 0 | 90;
  label: string;
  width: number;  // grid units (base, prima della rotazione; per circle = diametro)
  height: number; // grid units (base, prima della rotazione; per circle = diametro)
  fontSize?: number; // px, opzionale per compatibilità con dati salvati
}

export interface Door {
  id: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  width: number; // grid units
}

export interface Wall {
  id: string;
  x: number;
  y: number;
  length: number; // grid units
  rotation: 0 | 90;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  label: string;
  width: number;  // grid units
  height: number; // grid units
}

export interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface FloorPlan {
  rooms: Room[];
  tables: Table[];
  doors: Door[];
  obstacles: Obstacle[];
}

export interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  width: number;  // grid units
  height: number; // grid units
  fontSize: number; // px
}

export type ElementType = 'table' | 'door' | 'wall' | 'obstacle' | 'room' | 'textbox';

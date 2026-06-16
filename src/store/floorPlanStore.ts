import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Table, TableType, Door, Wall, Obstacle, TextBox } from '../types';
import {
  DEFAULT_ROOM_WIDTH, DEFAULT_ROOM_HEIGHT,
  DEFAULT_TABLES, DEFAULT_DOORS, DEFAULT_WALLS, DEFAULT_OBSTACLES, DEFAULT_TEXTBOXES,
} from '../data/defaultState';

interface FloorPlanState {
  roomWidth: number;
  roomHeight: number;
  tables: Table[];
  doors: Door[];
  walls: Wall[];
  obstacles: Obstacle[];
  textboxes: TextBox[];
  selectedIds: string[];

  setRoomSize(width: number, height: number): void;

  // Selection
  selectOnly(id: string): void;
  toggleSelect(id: string): void;
  setSelection(ids: string[]): void;
  clearSelection(): void;

  // Multi-element ops
  moveSelected(dx: number, dy: number): void;
  deleteSelected(): void;
  duplicateSelected(): void;

  resetToDefault(): void;
  saveAsDefault(): void;

  // Single-element add
  addTable(type: TableType): void;
  addDoor(): void;
  addWall(): void;
  addObstacle(): void;
  addTextBox(): void;

  // Single-element update (used by ElementEditor)
  updateTable(id: string, patch: Partial<Table>): void;
  updateDoor(id: string, patch: Partial<Door>): void;
  updateWall(id: string, patch: Partial<Wall>): void;
  updateObstacle(id: string, patch: Partial<Obstacle>): void;
  updateTextBox(id: string, patch: Partial<TextBox>): void;
}

export const useFloorPlanStore = create<FloorPlanState>()(
  persist(
    (set, get) => ({
      roomWidth: 20,
      roomHeight: 16,
      tables: [],
      doors: [],
      walls: [],
      obstacles: [],
      textboxes: [],
      selectedIds: [],

      setRoomSize: (width, height) => set({ roomWidth: width, roomHeight: height }),

      resetToDefault: () => {
        const saved = localStorage.getItem('ristorante-piantina-default');
        if (saved) {
          const snap = JSON.parse(saved);
          set({ ...snap, selectedIds: [] });
        } else {
          set({
            roomWidth: DEFAULT_ROOM_WIDTH,
            roomHeight: DEFAULT_ROOM_HEIGHT,
            tables: DEFAULT_TABLES,
            doors: DEFAULT_DOORS,
            walls: DEFAULT_WALLS,
            obstacles: DEFAULT_OBSTACLES,
            textboxes: DEFAULT_TEXTBOXES,
            selectedIds: [],
          });
        }
      },

      saveAsDefault: () => {
        const s = get();
        const snap = {
          roomWidth: s.roomWidth,
          roomHeight: s.roomHeight,
          tables: s.tables,
          doors: s.doors,
          walls: s.walls,
          obstacles: s.obstacles,
          textboxes: s.textboxes,
        };
        localStorage.setItem('ristorante-piantina-default', JSON.stringify(snap));
      },

      selectOnly: (id) => set({ selectedIds: [id] }),
      toggleSelect: (id) => set((s) => ({
        selectedIds: s.selectedIds.includes(id)
          ? s.selectedIds.filter((x) => x !== id)
          : [...s.selectedIds, id],
      })),
      setSelection: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),

      moveSelected: (dx, dy) => set((s) => {
        const ids = new Set(s.selectedIds);
        return {
          tables: s.tables.map((t) => ids.has(t.id) ? { ...t, x: t.x + dx, y: t.y + dy } : t),
          doors: s.doors.map((d) => ids.has(d.id) ? { ...d, x: d.x + dx, y: d.y + dy } : d),
          walls: s.walls.map((w) => ids.has(w.id) ? { ...w, x: w.x + dx, y: w.y + dy } : w),
          obstacles: s.obstacles.map((o) => ids.has(o.id) ? { ...o, x: o.x + dx, y: o.y + dy } : o),
          textboxes: s.textboxes.map((tb) => ids.has(tb.id) ? { ...tb, x: tb.x + dx, y: tb.y + dy } : tb),
        };
      }),

      deleteSelected: () => set((s) => {
        const ids = new Set(s.selectedIds);
        return {
          tables: s.tables.filter((t) => !ids.has(t.id)),
          doors: s.doors.filter((d) => !ids.has(d.id)),
          walls: s.walls.filter((w) => !ids.has(w.id)),
          obstacles: s.obstacles.filter((o) => !ids.has(o.id)),
          textboxes: s.textboxes.filter((tb) => !ids.has(tb.id)),
          selectedIds: [],
        };
      }),

      duplicateSelected: () => {
        const s = get();
        const ids = new Set(s.selectedIds);
        const OFFSET = 2; // grid units verso il basso
        const newIds: string[] = [];

        let maxN = s.tables.reduce((m, t) => {
          const n = parseInt(t.label.replace(/\D/g, ''), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 0);

        const newTables = s.tables.filter((t) => ids.has(t.id)).map((t) => {
          const copy: Table = { ...t, id: crypto.randomUUID(), x: t.x, y: t.y + OFFSET, label: `T${++maxN}`};
          newIds.push(copy.id);
          return copy;
        });
        const newDoors = s.doors.filter((d) => ids.has(d.id)).map((d) => {
          const copy: Door = { ...d, id: crypto.randomUUID(), x: d.x, y: d.y + OFFSET };
          newIds.push(copy.id);
          return copy;
        });
        const newWalls = s.walls.filter((w) => ids.has(w.id)).map((w) => {
          const copy: Wall = { ...w, id: crypto.randomUUID(), x: w.x, y: w.y + OFFSET };
          newIds.push(copy.id);
          return copy;
        });
        const newObstacles = s.obstacles.filter((o) => ids.has(o.id)).map((o) => {
          const copy: Obstacle = { ...o, id: crypto.randomUUID(), x: o.x, y: o.y + OFFSET };
          newIds.push(copy.id);
          return copy;
        });
        const newTextBoxes = s.textboxes.filter((tb) => ids.has(tb.id)).map((tb) => {
          const copy: TextBox = { ...tb, id: crypto.randomUUID(), x: tb.x, y: tb.y + OFFSET };
          newIds.push(copy.id);
          return copy;
        });

        set({
          tables: [...s.tables, ...newTables],
          doors: [...s.doors, ...newDoors],
          walls: [...s.walls, ...newWalls],
          obstacles: [...s.obstacles, ...newObstacles],
          textboxes: [...s.textboxes, ...newTextBoxes],
          selectedIds: newIds,
        });
      },

      addTable: (type) => {
        const { tables, roomWidth, roomHeight } = get();
        const maxN = tables.reduce((m, t) => {
          const n = parseInt(t.label.replace(/\D/g, ''), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 0);
        const newTable: Table = {
          id: crypto.randomUUID(),
          type,
          x: Math.floor(roomWidth / 2),
          y: Math.floor(roomHeight / 2),
          rotation: 0,
          label: `T${maxN + 1}`,
          width: type === '1x1' ? 2 : type === '1x2' ? 4 : 4,
          height: type === 'circle2' ? 4 : 2,
        };
        set((s) => ({ tables: [...s.tables, newTable], selectedIds: [newTable.id] }));
      },

      addDoor: () => {
        const newDoor: Door = { id: crypto.randomUUID(), x: 0, y: 0, rotation: 0, width: 2 };
        set((s) => ({ doors: [...s.doors, newDoor], selectedIds: [newDoor.id] }));
      },

      addWall: () => {
        const newWall: Wall = { id: crypto.randomUUID(), x: 0, y: 0, length: 4, rotation: 0 };
        set((s) => ({ walls: [...s.walls, newWall], selectedIds: [newWall.id] }));
      },

      addObstacle: () => {
        const { roomWidth, roomHeight } = get();
        const newObs: Obstacle = {
          id: crypto.randomUUID(),
          x: Math.floor(roomWidth / 4),
          y: Math.floor(roomHeight / 4),
          label: 'Ingombro',
          width: 1,
          height: 1,
        };
        set((s) => ({ obstacles: [...s.obstacles, newObs], selectedIds: [newObs.id] }));
      },

      addTextBox: () => {
        const { roomWidth, roomHeight } = get();
        const newTb: TextBox = {
          id: crypto.randomUUID(),
          x: Math.floor(roomWidth / 2) - 2,
          y: Math.floor(roomHeight / 2) - 1,
          text: 'Testo',
          width: 4,
          height: 2,
          fontSize: 14,
        };
        set((s) => ({ textboxes: [...s.textboxes, newTb], selectedIds: [newTb.id] }));
      },

      updateTable: (id, patch) =>
        set((s) => ({ tables: s.tables.map((t) => t.id === id ? { ...t, ...patch } : t) })),
      updateDoor: (id, patch) =>
        set((s) => ({ doors: s.doors.map((d) => d.id === id ? { ...d, ...patch } : d) })),
      updateWall: (id, patch) =>
        set((s) => ({ walls: s.walls.map((w) => w.id === id ? { ...w, ...patch } : w) })),
      updateObstacle: (id, patch) =>
        set((s) => ({ obstacles: s.obstacles.map((o) => o.id === id ? { ...o, ...patch } : o) })),
      updateTextBox: (id, patch) =>
        set((s) => ({ textboxes: s.textboxes.map((tb) => tb.id === id ? { ...tb, ...patch } : tb) })),
    }),
    {
      name: 'ristorante-piantina',
      partialize: (s) => ({
        roomWidth: s.roomWidth,
        roomHeight: s.roomHeight,
        tables: s.tables,
        doors: s.doors,
        walls: s.walls,
        obstacles: s.obstacles,
        textboxes: s.textboxes,
      }),
    }
  )
);

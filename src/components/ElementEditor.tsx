import { useEffect, useRef, useState } from 'react';
import { useFloorPlanStore } from '../store/floorPlanStore';

const toM = (units: number) => units / 2;
const toUnits = (m: number) => Math.round(m * 2);

function FontSizeInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);
  const commit = () => {
    const v = Math.max(8, Math.min(72, parseInt(raw, 10) || value));
    setRaw(String(v));
    onChange(v);
  };
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-xs text-stone-500 font-medium">Carattere</label>
      <div className="flex items-center gap-1">
        <input type="number" min={8} max={72} step={1} value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          className="w-16 px-1.5 py-1.5 text-sm text-right border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-stone-50" />
        <span className="text-xs text-stone-400">px</span>
      </div>
    </div>
  );
}

function DimInput({ label, value, onChange, min = 0.5 }: {
  label: string; value: number; onChange: (u: number) => void; min?: number;
}) {
  const [raw, setRaw] = useState(String(toM(value)));
  useEffect(() => { setRaw(String(toM(value))); }, [value]);
  const commit = () => {
    const m = Math.max(min, parseFloat(raw) || toM(value));
    const snapped = Math.round(m * 2) / 2;
    setRaw(String(snapped));
    onChange(toUnits(snapped));
  };
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-xs text-stone-500 font-medium">{label}</label>
      <div className="flex items-center gap-1">
        <input type="number" min={min} step={0.5} value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          className="w-16 px-1.5 py-1.5 text-sm text-right border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-stone-50" />
        <span className="text-xs text-stone-400">m</span>
      </div>
    </div>
  );
}

export default function ElementEditor() {
  const {
    tables, doors, walls, obstacles, textboxes, selectedIds,
    updateTable, updateDoor, updateWall, updateObstacle, updateTextBox,
    deleteSelected, duplicateSelected, clearSelection,
  } = useFloorPlanStore();

  const labelRef = useRef<HTMLInputElement>(null);

  // Derive single-selected element
  const single = selectedIds.length === 1 ? (() => {
    const id = selectedIds[0];
    const t = tables.find((x) => x.id === id); if (t) return { kind: 'table' as const, t };
    const d = doors.find((x) => x.id === id);  if (d) return { kind: 'door' as const, d };
    const w = walls.find((x) => x.id === id);  if (w) return { kind: 'wall' as const, w };
    const o = obstacles.find((x) => x.id === id); if (o) return { kind: 'obstacle' as const, o };
    const tb = textboxes.find((x) => x.id === id); if (tb) return { kind: 'textbox' as const, tb };
    return null;
  })() : null;

  useEffect(() => {
    if (single && (single.kind === 'table' || single.kind === 'obstacle') && labelRef.current) {
      labelRef.current.focus();
      labelRef.current.select();
    }
  }, [selectedIds[0]]);

  if (selectedIds.length === 0) return null;

  const doorRotations: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];

  const ActionButtons = () => (
    <>
      <div className="w-px self-stretch bg-stone-100" />
      <div className="flex gap-1 pb-0.5">
        <button onClick={duplicateSelected}
          className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors" title="Duplica (Ctrl+Shift+D)">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
        </button>
        <button onClick={deleteSelected}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Elimina">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
        <button onClick={clearSelection}
          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors" title="Deseleziona">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );

  // Multi-selection panel
  if (selectedIds.length > 1) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-xl shadow-xl border border-stone-200 px-4 py-3 flex items-center gap-4">
        <span className="text-sm text-stone-600 font-medium">{selectedIds.length} elementi selezionati</span>
        <ActionButtons />
      </div>
    );
  }

  if (!single) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-xl shadow-xl border border-stone-200 px-4 py-3 flex items-end gap-4 max-w-[92vw]">

      {single.kind === 'table' && (() => {
        const table = single.t;
        const currentFontSize = table.fontSize ?? (table.type === 'circle2' ? 14 : 13);
        return (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-stone-500 font-medium">Etichetta</label>
              <input ref={labelRef} type="text" value={table.label}
                onChange={(e) => updateTable(table.id, { label: e.target.value })}
                className="w-20 px-2 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-stone-50"
                maxLength={10} />
            </div>
            <div className="w-px self-stretch bg-stone-100" />
            {table.type === 'circle2' ? (
              <DimInput label="Diametro" value={table.width ?? 4}
                onChange={(u) => updateTable(table.id, { width: u, height: u })} />
            ) : (
              <>
                <DimInput label="Larghezza" value={table.width ?? (table.type === '1x1' ? 2 : 4)}
                  onChange={(u) => updateTable(table.id, { width: u })} />
                <DimInput label="Profondità" value={table.height ?? 2}
                  onChange={(u) => updateTable(table.id, { height: u })} />
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-stone-500 font-medium">Rotazione</label>
                  <button onClick={() => updateTable(table.id, { rotation: table.rotation === 0 ? 90 : 0 })}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm border border-stone-200 rounded-md bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      style={{ transform: `rotate(${table.rotation}deg)`, transition: 'transform 0.2s' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    {table.rotation === 0 ? '0°' : '90°'}
                  </button>
                </div>
              </>
            )}
            <div className="w-px self-stretch bg-stone-100" />
            <FontSizeInput value={currentFontSize}
              onChange={(v) => updateTable(table.id, { fontSize: v })} />
          </>
        );
      })()}

      {single.kind === 'wall' && (() => {
        const wall = single.w;
        return (
          <>
            <DimInput label="Lunghezza" value={wall.length} onChange={(u) => updateWall(wall.id, { length: u })} />
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-stone-500 font-medium">Orientamento</label>
              <div className="flex gap-1">
                {([0, 90] as const).map((r) => (
                  <button key={r} onClick={() => updateWall(wall.id, { rotation: r })}
                    className={`w-12 py-1.5 text-xs border rounded-md transition-colors ${wall.rotation === r ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'}`}>
                    {r === 0 ? '—' : '|'}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      })()}

      {single.kind === 'door' && (() => {
        const door = single.d;
        return (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-stone-500 font-medium">Orientamento</label>
              <div className="flex gap-1">
                {doorRotations.map((r) => (
                  <button key={r} onClick={() => updateDoor(door.id, { rotation: r })}
                    className={`w-10 py-1.5 text-xs border rounded-md transition-colors ${door.rotation === r ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'}`}>
                    {r}°
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px self-stretch bg-stone-100" />
            <DimInput label="Apertura" value={door.width ?? 2} onChange={(u) => updateDoor(door.id, { width: u })} />
          </>
        );
      })()}

      {single.kind === 'obstacle' && (() => {
        const obs = single.o;
        return (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-stone-500 font-medium">Etichetta</label>
              <input ref={labelRef} type="text" value={obs.label}
                onChange={(e) => updateObstacle(obs.id, { label: e.target.value })}
                className="w-24 px-2 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-stone-50"
                maxLength={14} />
            </div>
            <div className="w-px self-stretch bg-stone-100" />
            <DimInput label="Larghezza" value={obs.width ?? 1} onChange={(u) => updateObstacle(obs.id, { width: u })} />
            <DimInput label="Profondità" value={obs.height ?? 1} onChange={(u) => updateObstacle(obs.id, { height: u })} />
          </>
        );
      })()}

      {single.kind === 'textbox' && (() => {
        const tb = single.tb;
        return (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-stone-500 font-medium">Testo</label>
              <textarea value={tb.text}
                onChange={(e) => updateTextBox(tb.id, { text: e.target.value })}
                rows={2}
                className="w-36 px-2 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-stone-50 resize-none" />
            </div>
            <div className="w-px self-stretch bg-stone-100" />
            <DimInput label="Larghezza" value={tb.width} onChange={(u) => updateTextBox(tb.id, { width: u })} />
            <DimInput label="Altezza" value={tb.height} onChange={(u) => updateTextBox(tb.id, { height: u })} />
            <FontSizeInput value={tb.fontSize}
              onChange={(v) => updateTextBox(tb.id, { fontSize: v })} />
          </>
        );
      })()}

      <ActionButtons />
    </div>
  );
}

import { useFloorPlanStore } from '../../store/floorPlanStore';
import type { TableType } from '../../types';

const TABLES: { type: TableType; label: string; description: string; circle?: boolean }[] = [
  { type: '1x1', label: '1×1 m', description: 'Tavolo quadrato' },
  { type: '1x2', label: '1×2 m', description: 'Tavolo rettangolare' },
  { type: 'circle2', label: '⌀ 2 m', description: 'Tavolo circolare', circle: true },
];

export default function TablePalette() {
  const { addTable, addDoor, addWall, addObstacle, addTextBox } = useFloorPlanStore();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Tavoli</p>
        <div className="flex flex-col gap-2">
          {TABLES.map(({ type, label, description, circle }) => (
            <button
              key={type}
              onClick={() => addTable(type)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-colors text-left group"
            >
              <span
                className="shrink-0 border-2 border-amber-700 bg-amber-100 group-hover:bg-amber-200 transition-colors"
                style={{
                  width: circle ? 24 : (type === '1x1' ? 24 : 40),
                  height: circle ? 24 : 24,
                  borderRadius: circle ? '50%' : 3,
                }}
              />
              <div>
                <p className="text-sm font-semibold text-stone-700">{label}</p>
                <p className="text-xs text-stone-400">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Elementi</p>
        <div className="flex flex-col gap-2">

          <button
            onClick={addWall}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors text-left"
          >
            <span className="shrink-0 w-6 h-6 flex items-center justify-center">
              <span className="block w-5 h-2 bg-stone-700 rounded-sm" />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-700">Muro</p>
              <p className="text-xs text-stone-400">Parete divisoria</p>
            </div>
          </button>

          <button
            onClick={addDoor}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors text-left"
          >
            <span className="shrink-0 w-6 h-6 flex items-center justify-center text-stone-600">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 17V3h9v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 10 Q12 10 12 3" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" fill="none"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-700">Porta</p>
              <p className="text-xs text-stone-400">Apertura 1 m</p>
            </div>
          </button>

          <button
            onClick={addObstacle}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors text-left"
          >
            <span className="shrink-0 w-6 h-6 bg-stone-300 border-2 border-stone-500 relative overflow-hidden" style={{ borderRadius: 2 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute', top: -2, left: -2 }}>
                <line x1="0" y1="0" x2="20" y2="20" stroke="#78716c" strokeWidth="1.5"/>
                <line x1="0" y1="20" x2="20" y2="0" stroke="#78716c" strokeWidth="1.5"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-700">Ingombro</p>
              <p className="text-xs text-stone-400">Cella non utilizzabile</p>
            </div>
          </button>

          <button
            onClick={addTextBox}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors text-left"
          >
            <span className="shrink-0 w-6 h-6 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="#57534e" strokeWidth="1.5"/>
                <line x1="5" y1="8" x2="15" y2="8" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="5" y1="11.5" x2="11" y2="11.5" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-700">Testo</p>
              <p className="text-xs text-stone-400">Etichetta libera</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

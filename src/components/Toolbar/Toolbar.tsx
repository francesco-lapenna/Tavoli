import Konva from 'konva';
import TablePalette from './TablePalette';
import RoomSizeControls from './RoomSizeControls';
import PrintButton from './PrintButton';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface ToolbarProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export default function Toolbar({ stageRef }: ToolbarProps) {
  const { resetToDefault, saveAsDefault } = useFloorPlanStore();

  const handleReset = () => {
    if (confirm('Ripristinare la configurazione di default? Le modifiche non salvate andranno perse.')) {
      resetToDefault();
    }
  };

  const handleSaveAsDefault = () => {
    if (confirm('Salvare la configurazione attuale come nuovo default?')) {
      saveAsDefault();
    }
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5 p-4 bg-stone-50 border-r border-stone-200 overflow-y-auto">
      <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
        <span className="text-xl">🍽️</span>
        <h1 className="text-base font-bold text-stone-800">Piantina Tavoli</h1>
      </div>

      <TablePalette />

      <div className="border-t border-stone-200 pt-4">
        <RoomSizeControls />
      </div>

      <div className="border-t border-stone-200 pt-4 mt-auto flex flex-col gap-2">
        <PrintButton stageRef={stageRef} />
        <button
          onClick={handleSaveAsDefault}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          Salva come default
        </button>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Ripristina default
        </button>
      </div>

      <p className="text-xs text-stone-400 text-center">
        Seleziona un elemento per modificarlo
        <br />
        <kbd className="text-xs bg-stone-100 px-1 rounded">Del</kbd> elimina &nbsp;
        <kbd className="text-xs bg-stone-100 px-1 rounded">Ctrl+Shift+D</kbd> duplica
      </p>

      <p className="text-xs text-stone-300 text-center">v{__APP_VERSION__}</p>
    </aside>
  );
}

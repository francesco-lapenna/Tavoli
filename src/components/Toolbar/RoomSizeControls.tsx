import { useState } from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore';

export default function RoomSizeControls() {
  const { roomWidth, roomHeight, setRoomSize } = useFloorPlanStore();

  const [wValue, setWValue] = useState(String(roomWidth / 2));
  const [hValue, setHValue] = useState(String(roomHeight / 2));

  const commit = (wStr: string, hStr: string) => {
    const w = Math.max(3, Math.min(30, parseFloat(wStr) || roomWidth / 2));
    const h = Math.max(3, Math.min(30, parseFloat(hStr) || roomHeight / 2));
    setRoomSize(Math.round(w * 2), Math.round(h * 2));
    setWValue(String(w));
    setHValue(String(h));
  };

  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
        Dimensioni sala
      </p>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Larghezza', value: wValue, onChange: setWValue, onBlur: () => commit(wValue, hValue) },
          { label: 'Profondità', value: hValue, onChange: setHValue, onBlur: () => commit(wValue, hValue) },
        ].map(({ label, value, onChange, onBlur }) => (
          <label key={label} className="flex items-center justify-between gap-2">
            <span className="text-sm text-stone-600">{label}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={3}
                max={30}
                step={0.5}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur())}
                className="w-16 px-2 py-1 text-sm text-right border border-stone-200 rounded-md focus:outline-none focus:border-amber-400 bg-white"
              />
              <span className="text-xs text-stone-400">m</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

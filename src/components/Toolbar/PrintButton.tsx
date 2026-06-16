import { useRef, useState } from 'react';
import Konva from 'konva';
import { printToPDF } from '../../utils/printUtils';
import { useFloorPlanStore } from '../../store/floorPlanStore';
import { unitsToPx } from '../../utils/snapToGrid';

interface PrintButtonProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const PADDING = 40;

export default function PrintButton({ stageRef }: PrintButtonProps) {
  const { roomWidth, roomHeight } = useFloorPlanStore();
  const printing = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const handlePrint = async () => {
    const stage = stageRef.current;
    if (!stage || printing.current) return;
    printing.current = true;
    setShowModal(false);
    try {
      const roomPxW = unitsToPx(roomWidth);
      const roomPxH = unitsToPx(roomHeight);
      const scale = Math.min(
        (stage.width() - PADDING * 2) / roomPxW,
        (stage.height() - PADDING * 2) / roomPxH,
        1.5,
      );
      const clipX = (stage.width() - roomPxW * scale) / 2;
      const clipY = (stage.height() - roomPxH * scale) / 2;
      await printToPDF(
        stage,
        { x: clipX, y: clipY, width: roomPxW * scale, height: roomPxH * scale },
        roomWidth,
        roomHeight,
        title,
        subtitle,
      );
    } finally {
      printing.current = false;
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:bg-stone-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75v3h10.5v-3M6.75 8.25V4.5h10.5v3.75M4.5 9.75h15a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V10.5a.75.75 0 0 1 .75-.75z" />
        </svg>
        Stampa PDF
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-stone-800">Intestazione PDF</h2>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Titolo</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                placeholder="Es. Piantina Ristorante"
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Sottotitolo <span className="normal-case font-normal">(opzionale)</span></span>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                placeholder="Es. Sala principale — estate 2025"
                onKeyDown={(e) => { if (e.key === 'Enter') handlePrint(); }}
              />
            </label>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 px-4 py-2 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                Stampa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useMemo, useRef } from 'react';
import { Group, Shape, Rect } from 'react-konva';
import type Konva from 'konva';
import type { TextBox } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface TextBoxShapeProps {
  textbox: TextBox;
  isSelected: boolean;
}

// ─── HTML parser ──────────────────────────────────────────────────────────────

interface Seg { text: string; bold: boolean; italic: boolean; bg: string | null }

function parseHtml(html: string): Seg[] {
  const root = document.createElement('div');
  root.innerHTML = html;
  const out: Seg[] = [];

  function walk(node: Node, b: boolean, it: boolean, bg: string | null) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent ?? '';
      if (t) out.push({ text: t, bold: b, italic: it, bg });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el  = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') { out.push({ text: '\n', bold: b, italic: it, bg }); return; }

    const nb  = b  || tag === 'b' || tag === 'strong' || el.style.fontWeight === 'bold' || Number(el.style.fontWeight) >= 700;
    const ni  = it || tag === 'i' || tag === 'em'     || el.style.fontStyle  === 'italic';
    const raw = el.style.backgroundColor;
    const nbg = raw ? (raw === 'transparent' || raw === 'rgba(0, 0, 0, 0)' ? null : raw) : bg;

    if ((tag === 'div' || tag === 'p') && el !== root && out.length > 0 && out[out.length - 1].text !== '\n') {
      out.push({ text: '\n', bold: false, italic: false, bg: null });
    }
    for (const child of el.childNodes) walk(child, nb, ni, nbg);
  }

  walk(root, false, false, null);
  return out;
}

// ─── Layout (computed once, memoised) ────────────────────────────────────────

interface LWord { text: string; bold: boolean; italic: boolean; bg: string | null; x: number; w: number }
interface LLine  { words: LWord[]; y: number }
interface Layout { lines: LLine[]; fontSize: number; lineH: number }

function computeLayout(html: string, pxW: number, pxH: number, fontSize: number): Layout {
  const pad   = 4;
  const maxW  = pxW - pad * 2;
  const lineH = fontSize * 1.3;

  const fstr = (b: boolean, i: boolean) => `${i ? 'italic ' : ''}${b ? 'bold ' : ''}${fontSize}px sans-serif`;

  // temp canvas for measureText
  const tmp = document.createElement('canvas').getContext('2d')!;

  interface Tok { text: string; bold: boolean; italic: boolean; bg: string | null; w: number; nl: boolean }
  const tokens: Tok[] = [];

  for (const seg of parseHtml(html)) {
    if (seg.text === '\n') { tokens.push({ text: '', bold: false, italic: false, bg: null, w: 0, nl: true }); continue; }
    tmp.font = fstr(seg.bold, seg.italic);
    for (const p of seg.text.split(/(\s+)/)) {
      if (p) tokens.push({ text: p, bold: seg.bold, italic: seg.italic, bg: seg.bg, w: tmp.measureText(p).width, nl: false });
    }
  }

  // word-wrap
  type RawLine = { toks: Tok[]; w: number };
  const rawLines: RawLine[] = [];
  let cur: Tok[] = [];
  let curW = 0;

  const flush = () => {
    while (cur.length && cur[cur.length - 1].text.trim() === '') { curW -= cur[cur.length - 1].w; cur.pop(); }
    rawLines.push({ toks: [...cur], w: curW });
    cur = []; curW = 0;
  };

  for (const tok of tokens) {
    if (tok.nl) { flush(); continue; }
    if (tok.text.trim() === '' && cur.length === 0) continue;
    if (tok.text.trim() !== '' && curW + tok.w > maxW && cur.length > 0) flush();
    cur.push(tok); curW += tok.w;
  }
  flush();

  while (rawLines.length && rawLines[rawLines.length - 1].toks.length === 0) rawLines.pop();

  // vertical centering
  const totalH = rawLines.length * lineH;
  const startY = (pxH - totalH) / 2 + fontSize * 0.8;

  const lines: LLine[] = rawLines.map((rl, idx) => {
    const x0 = pad + Math.max(0, (maxW - rl.w) / 2);
    let x = x0;
    const words: LWord[] = rl.toks.map(t => { const wx = x; x += t.w; return { text: t.text, bold: t.bold, italic: t.italic, bg: t.bg, x: wx, w: t.w }; });
    return { words, y: startY + idx * lineH };
  });

  return { lines, fontSize, lineH };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TextBoxShape({ textbox, isSelected }: TextBoxShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: textbox.x, y: textbox.y });

  const pxW  = textbox.width  * GRID_UNIT;
  const pxH  = textbox.height * GRID_UNIT;
  const html = textbox.html ?? (textbox as unknown as { text?: string }).text ?? 'Testo';

  const layout = useMemo(
    () => computeLayout(html, pxW, pxH, textbox.fontSize),
    [html, pxW, pxH, textbox.fontSize],
  );

  // sceneFunc draws directly onto the Konva stage canvas — no intermediate image
  const sceneFunc = useMemo(() => {
    const { lines, fontSize, lineH } = layout;
    const fstr = (b: boolean, i: boolean) => `${i ? 'italic ' : ''}${b ? 'bold ' : ''}${fontSize}px sans-serif`;

    return (kCtx: Konva.Context, _shape: Konva.Shape) => {
      // _context is the native CanvasRenderingContext2D, already transformed by Konva
      const ctx = (kCtx as unknown as { _context: CanvasRenderingContext2D })._context;
      ctx.save();

      for (const line of lines) {
        for (const w of line.words) {
          if (w.bg) {
            ctx.fillStyle = w.bg;
            ctx.fillRect(w.x, line.y - fontSize * 0.85, w.w, lineH);
          }
        }
        for (const w of line.words) {
          ctx.font      = fstr(w.bold, w.italic);
          ctx.fillStyle = '#292524';
          ctx.fillText(w.text, w.x, line.y);
        }
      }

      ctx.restore();
    };
  }, [layout]);

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if ((e.evt as MouseEvent).shiftKey) toggleSelect(textbox.id);
    else selectOnly(textbox.id);
  };

  const handleDragStart = () => {
    if (!selectedIds.includes(textbox.id)) selectOnly(textbox.id);
    dragStart.current = { x: textbox.x, y: textbox.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.round(snap(e.target.x()) / GRID_UNIT);
    const newY = Math.round(snap(e.target.y()) / GRID_UNIT);
    moveSelected(newX - dragStart.current.x, newY - dragStart.current.y);
    e.target.position({ x: newX * GRID_UNIT, y: newY * GRID_UNIT });
  };

  return (
    <Group
      x={textbox.x * GRID_UNIT} y={textbox.y * GRID_UNIT}
      draggable
      onClick={handleClick} onTap={handleClick}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grab'; }}
      onMouseDown={(e)  => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grabbing'; }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
    >
      {/* Shape draws rich text directly on the Konva canvas */}
      <Shape width={pxW} height={pxH} sceneFunc={sceneFunc} listening={false} />
      {/* Rect is the hit area and selection border */}
      <Rect
        width={pxW} height={pxH}
        fill="transparent"
        stroke={isSelected ? '#3b82f6' : 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0}
      />
    </Group>
  );
}

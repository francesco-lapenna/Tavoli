import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import Konva from 'konva';
import GridLayer from './GridLayer';
import RoomOutline from './RoomOutline';
import TableShape from './TableShape';
import DoorShape from './DoorShape';
import WallShape from './WallShape';
import ObstacleShape from './ObstacleShape';
import TextBoxShape from './TextBoxShape';
import { useFloorPlanStore } from '../../store/floorPlanStore';
import { GRID_UNIT, unitsToPx } from '../../utils/snapToGrid';

interface FloorPlanCanvasProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const PADDING = 40;

type RubberBand = { x1: number; y1: number; x2: number; y2: number };

export default function FloorPlanCanvas({ stageRef }: FloorPlanCanvasProps) {
  const {
    roomWidth, roomHeight, tables, doors, walls, obstacles, textboxes,
    selectedIds, clearSelection, setSelection, deleteSelected, duplicateSelected,
  } = useFloorPlanStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  // store offset in ref too so rubber-band handler can read it without stale closure
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  const [rubberBand, setRubberBand] = useState<RubberBand | null>(null);
  const rbStart = useRef<{ x: number; y: number } | null>(null);
  // ref always holds the latest coords (avoids stale closure in onMouseUp)
  const rbLive = useRef<RubberBand | null>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth - PADDING * 2;
      const ch = containerRef.current.clientHeight - PADDING * 2;
      const s = Math.min(cw / unitsToPx(roomWidth), ch / unitsToPx(roomHeight), 1.5);
      const stageW = containerRef.current.clientWidth;
      const stageH = containerRef.current.clientHeight;
      const ox = (stageW - unitsToPx(roomWidth) * s) / 2;
      const oy = (stageH - unitsToPx(roomHeight) * s) / 2;
      scaleRef.current = s;
      offsetRef.current = { x: ox, y: oy };
      setScale(s);
      setStageSize({ width: stageW, height: stageH });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [roomWidth, roomHeight]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIds.length === 0) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.key === 'Escape') clearSelection();
      if (e.key === 'D' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        duplicateSelected();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIds, clearSelection, deleteSelected, duplicateSelected]);

  // Rubber-band helpers
  const stageToGroup = (sx: number, sy: number) => ({
    x: (sx - offsetRef.current.x) / scaleRef.current,
    y: (sy - offsetRef.current.y) / scaleRef.current,
  });

  const elementInRect = (ex: number, ey: number, ew: number, eh: number, r: RubberBand) => {
    const minX = Math.min(r.x1, r.x2);
    const maxX = Math.max(r.x1, r.x2);
    const minY = Math.min(r.y1, r.y2);
    const maxY = Math.max(r.y1, r.y2);
    return ex < maxX && ex + ew > minX && ey < maxY && ey + eh > minY;
  };

  const finalizeRubberBand = (rb: RubberBand) => {
    if (Math.abs(rb.x2 - rb.x1) < 4 && Math.abs(rb.y2 - rb.y1) < 4) return;
    const minG = stageToGroup(Math.min(rb.x1, rb.x2), Math.min(rb.y1, rb.y2));
    const maxG = stageToGroup(Math.max(rb.x1, rb.x2), Math.max(rb.y1, rb.y2));
    const rbGroup = { x1: minG.x, y1: minG.y, x2: maxG.x, y2: maxG.y };

    const hit: string[] = [];
    for (const t of tables) {
      const w = t.type === 'circle2' ? (t.width ?? 4) : (t.rotation === 90 ? (t.height ?? 2) : (t.width ?? (t.type === '1x1' ? 2 : 4)));
      const h = t.type === 'circle2' ? (t.width ?? 4) : (t.rotation === 90 ? (t.width ?? (t.type === '1x1' ? 2 : 4)) : (t.height ?? 2));
      if (elementInRect(t.x * GRID_UNIT, t.y * GRID_UNIT, w * GRID_UNIT, h * GRID_UNIT, rbGroup)) hit.push(t.id);
    }
    for (const d of doors) {
      const sz = (d.width ?? 2) * GRID_UNIT;
      if (elementInRect(d.x * GRID_UNIT, d.y * GRID_UNIT, sz, sz, rbGroup)) hit.push(d.id);
    }
    for (const w of walls) {
      const HIT = 14;
      const pxLen = w.length * GRID_UNIT;
      const isVert = w.rotation === 90;
      const ex = w.x * GRID_UNIT - (isVert ? HIT / 2 : 0);
      const ey = w.y * GRID_UNIT - (isVert ? 0 : HIT / 2);
      const ew = isVert ? HIT : pxLen;
      const eh = isVert ? pxLen : HIT;
      if (elementInRect(ex, ey, ew, eh, rbGroup)) hit.push(w.id);
    }
    for (const o of obstacles) {
      if (elementInRect(o.x * GRID_UNIT, o.y * GRID_UNIT, (o.width ?? 1) * GRID_UNIT, (o.height ?? 1) * GRID_UNIT, rbGroup)) hit.push(o.id);
    }
    for (const tb of textboxes) {
      if (elementInRect(tb.x * GRID_UNIT, tb.y * GRID_UNIT, tb.width * GRID_UNIT, tb.height * GRID_UNIT, rbGroup)) hit.push(tb.id);
    }
    if (hit.length > 0) setSelection(hit);
  };

  const offsetX = offsetRef.current.x || (stageSize.width - unitsToPx(roomWidth) * scale) / 2;
  const offsetY = offsetRef.current.y || (stageSize.height - unitsToPx(roomHeight) * scale) / 2;

  // Rubber-band rect in stage coords
  const rbRect = rubberBand ? {
    x: Math.min(rubberBand.x1, rubberBand.x2),
    y: Math.min(rubberBand.y1, rubberBand.y2),
    w: Math.abs(rubberBand.x2 - rubberBand.x1),
    h: Math.abs(rubberBand.y2 - rubberBand.y1),
  } : null;

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden" style={{ background: '#e8e5e0' }}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={(e) => {
          if (e.target !== e.target.getStage()) return;
          const pos = e.target.getStage()!.getPointerPosition()!;
          rbStart.current = pos;
          const rb = { x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y };
          rbLive.current = rb;
          setRubberBand(rb);
        }}
        onMouseMove={(e) => {
          if (!rbStart.current) return;
          const pos = e.target.getStage()!.getPointerPosition()!;
          const rb = { x1: rbStart.current.x, y1: rbStart.current.y, x2: pos.x, y2: pos.y };
          rbLive.current = rb;
          setRubberBand(rb);
        }}
        onMouseUp={() => {
          if (!rbLive.current) return;
          const rb = rbLive.current;
          rbStart.current = null;
          rbLive.current = null;
          setRubberBand(null);
          const isDrag = Math.abs(rb.x2 - rb.x1) >= 4 || Math.abs(rb.y2 - rb.y1) >= 4;
          if (isDrag) {
            finalizeRubberBand(rb);
          } else {
            clearSelection();
          }
        }}
      >
        <Layer>
          <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
            <RoomOutline roomWidth={roomWidth} roomHeight={roomHeight} />
            <GridLayer roomWidth={roomWidth} roomHeight={roomHeight} />
            {walls.map((wall) => (
              <WallShape key={wall.id} wall={wall} isSelected={selectedIds.includes(wall.id)} />
            ))}
            {obstacles.map((obs) => (
              <ObstacleShape key={obs.id} obstacle={obs} isSelected={selectedIds.includes(obs.id)} />
            ))}
            {doors.map((door) => (
              <DoorShape key={door.id} door={door} isSelected={selectedIds.includes(door.id)} />
            ))}
            {tables.map((table) => (
              <TableShape key={table.id} table={table} isSelected={selectedIds.includes(table.id)} />
            ))}
            {textboxes.map((tb) => (
              <TextBoxShape key={tb.id} textbox={tb} isSelected={selectedIds.includes(tb.id)} />
            ))}
          </Group>
          {/* Rubber-band selection rect (in stage coords, outside the scaled group) */}
          {rbRect && rbRect.w > 2 && rbRect.h > 2 && (
            <Rect
              x={rbRect.x} y={rbRect.y} width={rbRect.w} height={rbRect.h}
              fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth={1}
              dash={[4, 3]} listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

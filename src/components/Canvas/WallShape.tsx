import { useRef } from 'react';
import { Group, Rect } from 'react-konva';
import type Konva from 'konva';
import type { Wall } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface WallShapeProps {
  wall: Wall;
  isSelected: boolean;
}

const WALL_PX = 4;  // visual thickness (px)
const HIT_PX  = 14; // invisible hit area (px)

export default function WallShape({ wall, isSelected }: WallShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: wall.x, y: wall.y });

  const isVert = wall.rotation === 90;
  const pxLen  = wall.length * GRID_UNIT;

  // visual rect dimensions, centered on the grid line
  const visW = isVert ? WALL_PX : pxLen;
  const visH = isVert ? pxLen   : WALL_PX;
  const visX = isVert ? -WALL_PX / 2 : 0;
  const visY = isVert ? 0 : -WALL_PX / 2;

  // hit area: same length, wider perpendicular so it's easy to click
  const hitW = isVert ? HIT_PX : pxLen;
  const hitH = isVert ? pxLen  : HIT_PX;
  const hitX = isVert ? -HIT_PX / 2 : 0;
  const hitY = isVert ? 0 : -HIT_PX / 2;

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if ((e.evt as MouseEvent).shiftKey) toggleSelect(wall.id);
    else selectOnly(wall.id);
  };

  const handleDragStart = () => {
    if (!selectedIds.includes(wall.id)) selectOnly(wall.id);
    dragStart.current = { x: wall.x, y: wall.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.round(snap(e.target.x()) / GRID_UNIT);
    const newY = Math.round(snap(e.target.y()) / GRID_UNIT);
    moveSelected(newX - dragStart.current.x, newY - dragStart.current.y);
    e.target.position({ x: newX * GRID_UNIT, y: newY * GRID_UNIT });
  };

  return (
    <Group
      x={wall.x * GRID_UNIT} y={wall.y * GRID_UNIT}
      draggable
      onClick={handleClick} onTap={handleClick}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grab'; }}
      onMouseDown={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grabbing'; }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
    >
      {/* transparent hit area */}
      <Rect x={hitX} y={hitY} width={hitW} height={hitH} fill="transparent" />
      {/* visual wall */}
      <Rect
        x={visX} y={visY} width={visW} height={visH}
        fill={isSelected ? '#60a5fa' : '#44403c'}
        listening={false}
      />
      {/* selection highlight — thin border outside the wall */}
      {isSelected && (
        <Rect
          x={visX - 1} y={visY - 1} width={visW + 2} height={visH + 2}
          fill="transparent" stroke="#3b82f6" strokeWidth={1.5}
          listening={false}
        />
      )}
    </Group>
  );
}

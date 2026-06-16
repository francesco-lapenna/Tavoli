import { useRef } from 'react';
import { Group, Line, Arc } from 'react-konva';
import type Konva from 'konva';
import type { Door } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface DoorShapeProps {
  door: Door;
  isSelected: boolean;
}

export default function DoorShape({ door, isSelected }: DoorShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: door.x, y: door.y });

  const doorPx = (door.width ?? 2) * GRID_UNIT;
  const stroke = isSelected ? '#3b82f6' : '#6b6060';
  const arcFill = isSelected ? 'rgba(59,130,246,0.18)' : 'rgba(250,249,246,0.75)';

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if ((e.evt as MouseEvent).shiftKey) toggleSelect(door.id);
    else selectOnly(door.id);
  };

  const handleDragStart = () => {
    if (!selectedIds.includes(door.id)) selectOnly(door.id);
    dragStart.current = { x: door.x, y: door.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.round(snap(e.target.x()) / GRID_UNIT);
    const newY = Math.round(snap(e.target.y()) / GRID_UNIT);
    moveSelected(newX - dragStart.current.x, newY - dragStart.current.y);
    e.target.position({ x: newX * GRID_UNIT, y: newY * GRID_UNIT });
  };

  return (
    <Group
      x={door.x * GRID_UNIT} y={door.y * GRID_UNIT}
      rotation={door.rotation}
      draggable
      onClick={handleClick} onTap={handleClick}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grab'; }}
      onMouseDown={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grabbing'; }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
    >
      <Arc x={0} y={0} innerRadius={0} outerRadius={doorPx}
        angle={90} rotation={0} fill={arcFill} stroke="none" />
      <Arc x={0} y={0} innerRadius={doorPx - 1} outerRadius={doorPx}
        angle={90} rotation={0} fill="none" stroke={stroke} strokeWidth={1} listening={false} />
      <Line points={[0, 0, 0, doorPx]} stroke={stroke} strokeWidth={isSelected ? 3 : 2.5} listening={false} />
      <Line points={[0, 0, doorPx, 0]} stroke={stroke} strokeWidth={isSelected ? 2 : 1.5} listening={false} />
    </Group>
  );
}

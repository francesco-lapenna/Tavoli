import { useRef } from 'react';
import { Group, Rect, Line, Text } from 'react-konva';
import type Konva from 'konva';
import type { Obstacle } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface ObstacleShapeProps {
  obstacle: Obstacle;
  isSelected: boolean;
}

export default function ObstacleShape({ obstacle, isSelected }: ObstacleShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: obstacle.x, y: obstacle.y });

  const pxW = (obstacle.width ?? 1) * GRID_UNIT;
  const pxH = (obstacle.height ?? 1) * GRID_UNIT;

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if ((e.evt as MouseEvent).shiftKey) toggleSelect(obstacle.id);
    else selectOnly(obstacle.id);
  };

  const handleDragStart = () => {
    if (!selectedIds.includes(obstacle.id)) selectOnly(obstacle.id);
    dragStart.current = { x: obstacle.x, y: obstacle.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.round(snap(e.target.x()) / GRID_UNIT);
    const newY = Math.round(snap(e.target.y()) / GRID_UNIT);
    moveSelected(newX - dragStart.current.x, newY - dragStart.current.y);
    e.target.position({ x: newX * GRID_UNIT, y: newY * GRID_UNIT });
  };

  return (
    <Group
      x={obstacle.x * GRID_UNIT} y={obstacle.y * GRID_UNIT}
      draggable
      onClick={handleClick} onTap={handleClick}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grab'; }}
      onMouseDown={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grabbing'; }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
    >
      <Rect width={pxW} height={pxH}
        fill={isSelected ? '#dbeafe' : '#d6d3d1'}
        stroke={isSelected ? '#3b82f6' : '#57534e'}
        strokeWidth={isSelected ? 2.5 : 1.5} />
      <Line points={[0, 0, pxW, pxH]} stroke={isSelected ? '#93c5fd' : '#a8a29e'} strokeWidth={1} listening={false} />
      <Line points={[0, pxH, pxW, 0]} stroke={isSelected ? '#93c5fd' : '#a8a29e'} strokeWidth={1} listening={false} />
      <Text x={-pxW} y={pxH + 2} width={pxW * 3}
        text={obstacle.label} align="center" fontSize={9}
        fill={isSelected ? '#1e40af' : '#57534e'} listening={false} />
    </Group>
  );
}

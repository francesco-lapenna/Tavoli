import { useRef } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import type { Table } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface TableShapeProps {
  table: Table;
  isSelected: boolean;
}

export default function TableShape({ table, isSelected }: TableShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: table.x, y: table.y });

  const setCursor = (e: Konva.KonvaEventObject<MouseEvent>, cursor: string) => {
    const c = e.target.getStage()?.container();
    if (c) c.style.cursor = cursor;
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if ((e.evt as MouseEvent).shiftKey) toggleSelect(table.id);
    else selectOnly(table.id);
  };

  const handleDragStart = () => {
    if (!selectedIds.includes(table.id)) selectOnly(table.id);
    dragStart.current = { x: table.x, y: table.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.round(snap(e.target.x()) / GRID_UNIT);
    const newY = Math.round(snap(e.target.y()) / GRID_UNIT);
    const dx = newX - dragStart.current.x;
    const dy = newY - dragStart.current.y;
    moveSelected(dx, dy);
    e.target.position({ x: newX * GRID_UNIT, y: newY * GRID_UNIT });
  };

  const commonProps = {
    draggable: true,
    onClick: handleClick,
    onTap: handleClick,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => setCursor(e, 'grab'),
    onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => setCursor(e, 'grabbing'),
    onMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => setCursor(e, 'default'),
  };

  if (table.type === 'circle2') {
    const diameter = (table.width ?? 4) * GRID_UNIT;
    const radius = diameter / 2;
    return (
      <Group x={table.x * GRID_UNIT} y={table.y * GRID_UNIT} {...commonProps}>
        <Circle x={radius} y={radius} radius={radius}
          fill={isSelected ? '#dbeafe' : '#fef3c7'}
          stroke={isSelected ? '#3b82f6' : '#92400e'}
          strokeWidth={isSelected ? 2.5 : 1.5}
          shadowColor={isSelected ? '#3b82f6' : 'transparent'}
          shadowBlur={isSelected ? 6 : 0} shadowOpacity={0.4} />
        <Text x={0} y={0} width={diameter} height={diameter} text={table.label}
          align="center" verticalAlign="middle" fontSize={table.fontSize ?? 14} fontStyle="bold"
          fill={isSelected ? '#1e40af' : '#78350f'} />
      </Group>
    );
  }

  const baseW = table.width ?? (table.type === '1x1' ? 2 : 4);
  const baseH = table.height ?? 2;
  const tableW = table.rotation === 90 ? baseH : baseW;
  const tableH = table.rotation === 90 ? baseW : baseH;
  const pxW = tableW * GRID_UNIT;
  const pxH = tableH * GRID_UNIT;

  return (
    <Group x={table.x * GRID_UNIT} y={table.y * GRID_UNIT} {...commonProps}>
      <Rect width={pxW} height={pxH}
        fill={isSelected ? '#dbeafe' : '#fef3c7'}
        stroke={isSelected ? '#3b82f6' : '#92400e'}
        strokeWidth={isSelected ? 2.5 : 1.5}
        cornerRadius={4}
        shadowColor={isSelected ? '#3b82f6' : 'transparent'}
        shadowBlur={isSelected ? 6 : 0} shadowOpacity={0.4} />
      <Text width={pxW} height={pxH} text={table.label}
        align="center" verticalAlign="middle" fontSize={table.fontSize ?? 13} fontStyle="bold"
        fill={isSelected ? '#1e40af' : '#78350f'} />
    </Group>
  );
}

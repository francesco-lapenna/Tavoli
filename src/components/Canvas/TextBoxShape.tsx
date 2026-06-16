import { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import type { TextBox } from '../../types';
import { GRID_UNIT, snap } from '../../utils/snapToGrid';
import { useFloorPlanStore } from '../../store/floorPlanStore';

interface TextBoxShapeProps {
  textbox: TextBox;
  isSelected: boolean;
}

export default function TextBoxShape({ textbox, isSelected }: TextBoxShapeProps) {
  const { selectOnly, toggleSelect, moveSelected, selectedIds } = useFloorPlanStore();
  const dragStart = useRef({ x: textbox.x, y: textbox.y });

  const pxW = textbox.width * GRID_UNIT;
  const pxH = textbox.height * GRID_UNIT;

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
      onMouseDown={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'grabbing'; }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
    >
      <Rect
        width={pxW} height={pxH}
        fill="rgba(255,255,255,0)"
        stroke={isSelected ? '#3b82f6' : 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0}
        dash={isSelected ? undefined : [4, 3]}
      />
      <Text
        x={4} y={4}
        width={pxW - 8} height={pxH - 8}
        text={textbox.text}
        fontSize={textbox.fontSize}
        fontFamily="sans-serif"
        fill={isSelected ? '#1e40af' : '#292524'}
        align="center"
        verticalAlign="middle"
        wrap="word"
        listening={false}
      />
    </Group>
  );
}

import { Group, Line } from 'react-konva';
import { GRID_UNIT, unitsToPx } from '../../utils/snapToGrid';

interface GridLayerProps {
  roomWidth: number;
  roomHeight: number;
}

export default function GridLayer({ roomWidth, roomHeight }: GridLayerProps) {
  const width = unitsToPx(roomWidth);
  const height = unitsToPx(roomHeight);
  const lines: React.ReactElement[] = [];

  for (let x = 0; x <= roomWidth; x++) {
    const isMeter = x % 2 === 0;
    lines.push(
      <Line key={`v-${x}`} points={[x * GRID_UNIT, 0, x * GRID_UNIT, height]}
        stroke={isMeter ? '#c8c4be' : '#e2dfd9'} strokeWidth={isMeter ? 1 : 0.5} />
    );
  }

  for (let y = 0; y <= roomHeight; y++) {
    const isMeter = y % 2 === 0;
    lines.push(
      <Line key={`h-${y}`} points={[0, y * GRID_UNIT, width, y * GRID_UNIT]}
        stroke={isMeter ? '#c8c4be' : '#e2dfd9'} strokeWidth={isMeter ? 1 : 0.5} />
    );
  }

  return <Group listening={false}>{lines}</Group>;
}

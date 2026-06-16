import { Rect } from 'react-konva';
import { unitsToPx } from '../../utils/snapToGrid';

interface RoomOutlineProps {
  roomWidth: number;
  roomHeight: number;
}

export default function RoomOutline({ roomWidth, roomHeight }: RoomOutlineProps) {
  return (
    <Rect
      x={0}
      y={0}
      width={unitsToPx(roomWidth)}
      height={unitsToPx(roomHeight)}
      fill="#faf9f6"
      stroke="#6b6060"
      strokeWidth={3}
      listening={false}
    />
  );
}

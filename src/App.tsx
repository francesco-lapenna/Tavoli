import { useRef } from 'react';
import Konva from 'konva';
import FloorPlanCanvas from './components/Canvas/FloorPlanCanvas';
import Toolbar from './components/Toolbar/Toolbar';
import ElementEditor from './components/ElementEditor';

export default function App() {
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="flex h-full">
      <Toolbar stageRef={stageRef} />
      <div className="flex-1 relative flex flex-col overflow-hidden">
        <FloorPlanCanvas stageRef={stageRef} />
        <ElementEditor />
      </div>
    </div>
  );
}

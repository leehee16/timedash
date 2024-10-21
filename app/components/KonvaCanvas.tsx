import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Task } from '../models/Task';

interface KonvaCanvasProps {
  tasks: Task[];
  openProjectOrTask: (task: Task) => void;
  onTaskDragStart: (taskId: string) => void;
}

const KonvaCanvas: React.FC<KonvaCanvasProps> = ({ tasks, openProjectOrTask, onTaskDragStart }) => {
  return (
    <Stage width={window.innerWidth * 0.6} height={window.innerHeight}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={window.innerWidth * 0.6}
          height={window.innerHeight}
          fill="#f0f0f0"
        />
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <Rect
              x={10 + (index % 4) * 150}
              y={10 + Math.floor(index / 4) * 80}
              width={140}
              height={70}
              fill="#ffffff"
              shadowBlur={5}
              onClick={() => openProjectOrTask(task)}
              draggable
              onDragStart={() => onTaskDragStart(task.id)}
            />
            <Text
              x={15 + (index % 4) * 150}
              y={15 + Math.floor(index / 4) * 80}
              text={task.title}
              fontSize={14}
              width={130}
              height={60}
              wrap="word"
              align="center"
              verticalAlign="middle"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default KonvaCanvas;

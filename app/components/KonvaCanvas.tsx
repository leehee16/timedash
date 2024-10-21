import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import Konva from 'konva';
import { Task } from '../models/Task';

interface KonvaCanvasProps {
  tasks: Task[];
  openProjectOrTask: (task: Task) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragEnd: (taskId: string, x: number, y: number) => void;
}

const GRID_SIZE = 20;
const TASK_WIDTH = 140;
const TASK_HEIGHT = 80;

const KonvaCanvas: React.FC<KonvaCanvasProps> = ({ tasks, openProjectOrTask, onTaskDragStart, onTaskDragEnd }) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const width = window.innerWidth * 0.6;
  const height = window.innerHeight;

  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        stageRef.current.width(window.innerWidth * 0.6);
        stageRef.current.height(window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const snapToGrid = (x: number, y: number) => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  };

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        <Rect x={0} y={0} width={width} height={height} fill="#f0f0f0" />
        {tasks.map((task) => (
          <Group
            key={task.id}
            x={task.x}
            y={task.y}
            width={TASK_WIDTH}
            height={TASK_HEIGHT}
            draggable
            onDragStart={() => onTaskDragStart(task.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const { x, y } = snapToGrid(node.x(), node.y());
              onTaskDragEnd(task.id, x, y);
            }}
          >
            <Rect
              width={TASK_WIDTH}
              height={TASK_HEIGHT}
              fill="#ffffff"
              shadowBlur={5}
              cornerRadius={5}
            />
            <Text
              text={task.title}
              fontSize={14}
              width={TASK_WIDTH}
              height={TASK_HEIGHT}
              align="center"
              verticalAlign="middle"
              onClick={() => openProjectOrTask(task)}
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};

export default KonvaCanvas;

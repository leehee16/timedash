import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Task } from '../models/Task';
import { TaskCategory } from './Ground';

interface KonvaCanvasProps {
  tasks: Task[];
  openProjectOrTask: (task: Task) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragEnd: (taskId: string, x: number, y: number, category: TaskCategory) => void;
}

const TASK_WIDTH = 140;
const TASK_HEIGHT = 80;

const KonvaCanvas: React.FC<KonvaCanvasProps> = ({ tasks, openProjectOrTask, onTaskDragStart, onTaskDragEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const inboxWidth = dimensions.width / 2;
  const upcomingHeight = dimensions.height / 2;

  const getCategory = (x: number, y: number): TaskCategory => {
    if (x < inboxWidth) return 'Inbox';
    if (y < upcomingHeight) return 'Upcoming';
    return 'Menial';
  };

  const renderAreas = () => (
    <>
      <Rect x={0} y={0} width={inboxWidth} height={dimensions.height} fill="#f0f0f0" />
      <Rect x={inboxWidth} y={0} width={inboxWidth} height={upcomingHeight} fill="#e0e0e0" />
      <Rect x={inboxWidth} y={upcomingHeight} width={inboxWidth} height={upcomingHeight} fill="#d0d0d0" />
      <Text x={10} y={10} text="Inbox" fontSize={20} />
      <Text x={inboxWidth + 10} y={10} text="Upcoming" fontSize={20} />
      <Text x={inboxWidth + 10} y={upcomingHeight + 10} text="Menial" fontSize={20} />
    </>
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {renderAreas()}
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
                const x = node.x();
                const y = node.y();
                const category = getCategory(x, y);
                onTaskDragEnd(task.id, x, y, category);
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
    </div>
  );
};

export default KonvaCanvas;

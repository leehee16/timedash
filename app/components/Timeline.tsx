"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskBlock } from './TaskBlock';
import { Task } from './Ground';

interface TimelineProps {
  tasks: Task[];
}

export const Timeline: React.FC<TimelineProps> = ({ tasks }) => {
  const { setNodeRef } = useDroppable({
    id: 'timeline',
  });

  return (
    <div ref={setNodeRef} className="timeline w-1/4 bg-gray-200 p-4 min-h-screen overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Timeline</h3>
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskBlock key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

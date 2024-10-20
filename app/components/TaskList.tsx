"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskBlock } from './TaskBlock';
import { Task, TaskCategory } from './Ground';

interface TaskListProps {
  tasks: Task[];
  category: TaskCategory;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, category }) => {
  const { setNodeRef } = useDroppable({
    id: category,
  });

  return (
    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="bg-gray-100 p-2 rounded min-h-[100px]">
        {tasks.map((task) => (
          <TaskBlock key={task.id} task={task} />
        ))}
      </div>
    </SortableContext>
  );
};

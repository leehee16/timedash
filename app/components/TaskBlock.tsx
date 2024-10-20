"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './Ground';

interface TaskBlockProps {
  task: Task;
}

export const TaskBlock: React.FC<TaskBlockProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-block bg-white shadow-md rounded p-4 mb-2 cursor-move"
    >
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-500">{task.category}</p>
    </div>
  );
};

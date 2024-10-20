"use client";

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { TaskList } from './TaskList';
import { TaskBlock } from './TaskBlock';
import { AddTaskButton } from './AddTaskButton';

export type TaskCategory = 'Inbox' | 'Today' | 'Upcoming' | 'Menial';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
}

export const Ground = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Task 1', category: 'Inbox' },
    { id: '2', title: 'Task 2', category: 'Today' },
    { id: '3', title: 'Task 3', category: 'Upcoming' },
    { id: '4', title: 'Task 4', category: 'Menial' },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories: TaskCategory[] = ['Inbox', 'Today', 'Upcoming', 'Menial'];

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    const overCategory = over.id as TaskCategory;

    if (activeTask && activeTask.category !== overCategory) {
      setTasks(tasks => {
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.filter(task => task.category === overCategory).length;
        const newTasks = arrayMove(tasks, oldIndex, oldIndex);
        newTasks[oldIndex] = { ...newTasks[oldIndex], category: overCategory };
        return newTasks;
      });
    }

    setActiveId(null);
  };

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category: 'Inbox',
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={e => setActiveId(e.active.id)} collisionDetection={closestCorners}>
      <div className="ground">
        <h2 className="text-2xl font-bold mb-4">Ground</h2>
        <AddTaskButton onAddTask={addTask} />
        <div className="flex flex-wrap -mx-2">
          <SortableContext items={tasks.map(task => task.id)}>
            {categories.map((category) => (
              <div key={category} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <TaskList 
                  tasks={tasks.filter(task => task.category === category)} 
                  category={category} 
                />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeId ? <TaskBlock task={tasks.find(task => task.id === activeId)!} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

"use client";

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensors, useSensor, PointerSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskBlock } from './TaskBlock';
import { Timeline } from './Timeline';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export type TaskCategory = 'Inbox' | 'Today' | 'Upcoming' | 'Menial' | 'Planned' | 'Recorded';

export const Ground: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    new Task('1', 'Task 1', 'Inbox'),
    new Task('2', 'Task 2', 'Today'),
    new Task('3', 'Task 3', 'Upcoming'),
    new Task('4', 'Task 4', 'Menial'),
  ]);

  const [timelineTasks, setTimelineTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    new Project('1', 'Project 1'),
    new Project('2', 'Project 2'),
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const categories: TaskCategory[] = ['Inbox', 'Today', 'Upcoming', 'Menial'];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === 'timeline') {
      const taskToMove = tasks.find(task => task.id === active.id);
      if (taskToMove) {
        setTasks(tasks.filter(task => task.id !== active.id));
        setTimelineTasks([...timelineTasks, { ...taskToMove, category: 'Planned' }]);
      }
    } else if (typeof over.id === 'string' && categories.includes(over.id as TaskCategory)) {
      const taskToMove = tasks.find(task => task.id === active.id) || timelineTasks.find(task => task.id === active.id);
      if (taskToMove) {
        if (taskToMove.category === 'Planned') {
          setTimelineTasks(timelineTasks.filter(task => task.id !== active.id));
        } else {
          setTasks(tasks.filter(task => task.id !== active.id));
        }
        setTasks([...tasks, { ...taskToMove, category: over.id as TaskCategory }]);
      }
    }

    setActiveId(null);
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const CategoryDroppable = ({ category }: { category: TaskCategory }) => {
    const { setNodeRef } = useDroppable({ id: category });
    return (
      <div ref={setNodeRef} className="bg-gray-100 p-2 rounded min-h-[100px]">
        <h3 className="text-xl font-semibold mb-2">{category}</h3>
        <SortableContext items={tasks.filter(task => task.category === category).map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.filter(task => task.category === category).map((task) => (
            <TaskBlock key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    );
  };

  const ProjectTree = ({ project, depth = 0 }: { project: Project; depth?: number }) => (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <div className="flex items-center">
        <span className="mr-2">📁</span>
        <span>{project.name}</span>
      </div>
      {project.subProjects.map(subProject => (
        <ProjectTree key={subProject.id} project={subProject} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex h-screen">
        <Timeline tasks={timelineTasks} />
        <div className="ground w-1/2 p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Ground</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryDroppable key={category} category={category} />
            ))}
          </div>
        </div>
        <div className="projects w-1/4 bg-gray-100 p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {projects.map(project => (
            <ProjectTree key={project.id} project={project} />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <TaskBlock 
            task={tasks.find(task => task.id === activeId) || timelineTasks.find(task => task.id === activeId)!} 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

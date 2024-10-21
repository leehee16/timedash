"use client";

import React, { useState } from 'react';
import { Timeline } from './Timeline';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { DocumentTabs } from './DocumentTabs';
import dynamic from 'next/dynamic';

const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), { ssr: false });

export type TaskCategory = 'Inbox' | 'Today' | 'Upcoming' | 'Menial' | 'Planned' | 'Recorded';

type TabContent = 
  | { type: 'ground' }
  | { type: 'markdown'; content: string }
  | { type: 'project'; project: Project }
  | { type: 'task'; task: Task };

interface Tab {
  id: string;
  title: string;
  content: TabContent;
}

export const Ground: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    new Task('1', 'Task 1', 'Inbox', '', 0, 0),
    new Task('2', 'Task 2', 'Today', '', 160, 0),
    new Task('3', 'Task 3', 'Upcoming', '', 320, 0),
    new Task('4', 'Task 4', 'Menial', '', 480, 0),
  ]);

  const [timelineTasks, setTimelineTasks] = useState<Task[]>([]);
  const [projects] = useState<Project[]>([
    new Project('1', 'Project 1'),
    new Project('2', 'Project 2'),
  ]);

  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'ground', title: 'Ground', content: { type: 'ground' } },
    { id: 'home', title: 'Home', content: { type: 'markdown', content: '# Welcome to Ground\n\nThis is your home page.' } },
  ]);
  const [activeTabId, setActiveTabId] = useState('ground');

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string) => {
    if (id === 'ground' || id === 'home') return; // Prevent closing Ground and Home tabs
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== id));
    if (activeTabId === id) {
      setActiveTabId('ground');
    }
  };

  const handleUpdateTab = (id: string, content: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === id && tab.content.type === 'markdown' 
          ? { ...tab, content: { ...tab.content, content } } 
          : tab
      )
    );
  };

  const openProjectOrTask = (item: Project | Task) => {
    const existingTab = tabs.find(tab => tab.id === item.id);
    if (existingTab) {
      setActiveTabId(item.id);
    } else {
      const newTab: Tab = {
        id: item.id,
        title: item instanceof Project ? item.name : item.title,
        content: item instanceof Project 
          ? { type: 'project', project: item }
          : { type: 'task', task: item },
      };
      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTabId(item.id);
    }
  };

  const moveTaskToTimeline = (taskId: string) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (taskToMove) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setTimelineTasks(prevTasks => [...prevTasks, new Task(taskToMove.id, taskToMove.title, 'Planned', taskToMove.content)]);
    }
  };

  const handleTaskDragStart = (taskId: string) => {
    console.log('Task drag started:', taskId);
  };

  const handleTaskDragEnd = (taskId: string, x: number, y: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, x, y } : task
      )
    );
  };

  const renderTabContent = (tab: Tab) => {
    switch (tab.content.type) {
      case 'ground':
        return (
          <KonvaCanvas 
            tasks={tasks} 
            openProjectOrTask={openProjectOrTask}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
          />
        );
      case 'markdown':
        return <div className="p-4">{tab.content.content}</div>;
      case 'project':
        return <div className="p-4">Project: {tab.content.project.name}</div>;
      case 'task':
        return <div className="p-4">Task: {tab.content.task.title}</div>;
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Timeline 
        tasks={timelineTasks} 
        updateTaskTime={() => {}} 
      />
      <div className="flex flex-col w-4/6">
        <DocumentTabs
          documents={tabs}
          activeDocumentId={activeTabId}
          onSelectDocument={handleSelectTab}
          onCloseDocument={handleCloseTab}
          onUpdateDocument={handleUpdateTab}
        />
        {renderTabContent(tabs.find(tab => tab.id === activeTabId)!)}
      </div>
      <div className="projects w-1/6 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        {projects.map(project => (
          <div 
            key={project.id} 
            className="cursor-pointer mb-2"
            onClick={() => openProjectOrTask(project)}
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
};

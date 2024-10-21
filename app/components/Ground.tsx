"use client";

import React, { useState } from 'react';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { DocumentTabs } from './DocumentTabs';
import { Layout } from './Layout';
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
    new Task('1', 'Task 1', 'Inbox', '', 10, 10),
    new Task('2', 'Task 2', 'Inbox', '', 10, 100),
    new Task('3', 'Task 3', 'Inbox', '', 10, 190),
    new Task('4', 'Task 4', 'Inbox', '', 10, 280),
  ]);

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

  const handleTaskDragEnd = (taskId: string, x: number, y: number, category: TaskCategory) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? new Task(task.id, task.title, category, task.content, x, y)
          : task
      )
    );
  };

  const renderTabContent = (tab: Tab) => {
    switch (tab.content.type) {
      case 'ground':
        return (
          <div className="h-full w-full overflow-hidden">
            <KonvaCanvas 
              tasks={tasks} 
              openProjectOrTask={openProjectOrTask}
              onTaskDragStart={handleTaskDragStart}
              onTaskDragEnd={handleTaskDragEnd}
            />
          </div>
        );
      case 'markdown':
        return <div className="p-4 h-full overflow-auto">{tab.content.content}</div>;
      case 'project':
        return <div className="p-4 h-full overflow-auto">Project: {tab.content.project.name}</div>;
      case 'task':
        return <div className="p-4 h-full overflow-auto">Task: {tab.content.task.title}</div>;
    }
  };

  const updateTaskTime = (taskId: string, time: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, recordedTime: time } : task
      )
    );
  };

  const leftSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold text-xl border-b border-gray-700">Ground</div>
      <div className="flex-grow overflow-auto p-2">
        <h2 className="text-lg font-semibold mb-2">Today&apos;s Tasks</h2>
        <div className="space-y-2">
          {tasks.filter(task => task.category === 'Today').map(task => (
            <div key={task.id} className="bg-gray-700 p-2 rounded">
              {task.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      <DocumentTabs
        documents={tabs}
        activeDocumentId={activeTabId}
        onSelectDocument={handleSelectTab}
        onCloseDocument={handleCloseTab}
        onUpdateDocument={handleUpdateTab}
      />
      <div className="flex-grow overflow-hidden">
        {renderTabContent(tabs.find(tab => tab.id === activeTabId)!)}
      </div>
    </div>
  );

  const rightSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold text-xl border-b border-gray-300">Projects</div>
      <div className="flex-grow overflow-auto p-2">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="cursor-pointer py-2 px-3 hover:bg-gray-300 rounded mb-1"
            onClick={() => openProjectOrTask(project)}
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout
      leftSidebar={leftSidebar}
      mainContent={mainContent}
      rightSidebar={rightSidebar}
    />
  );
};

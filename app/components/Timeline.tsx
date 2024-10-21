"use client";

import React from 'react';
import { Task } from '../models/Task';

interface TimelineProps {
  tasks: Task[];
  updateTaskTime: (taskId: string, time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ tasks, updateTaskTime }) => {
  return (
    <div className="timeline w-full h-1/2 bg-gray-200 p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
      <div className="task-list flex flex-col space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-item bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => {/* 태스크 상세 보기 또는 편집 기능 */}}
          >
            <h3 className="font-semibold">{task.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {task.estimatedTime ? `${task.estimatedTime} min` : 'No time set'}
              </span>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTaskTime(task.id, Date.now());
                }}
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

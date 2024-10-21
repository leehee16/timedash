"use client";

import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskBlock } from './TaskBlock';
import { Task } from '../models/Task';

interface TimelineProps {
  tasks: Task[];
  updateTaskTime: (taskId: string, time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ tasks, updateTaskTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { setNodeRef: setRecordedRef } = useDroppable({
    id: 'recorded',
  });

  const { setNodeRef: setPlannedRef } = useDroppable({
    id: 'planned',
  });

  const recordedTasks = tasks.filter(task => task.recordedTime !== undefined);
  const plannedTasks = tasks.filter(task => task.category === 'Planned');

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTimelinePosition = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes();
    return (minutes / 1440) * 100; // 1440 minutes in a day
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="timeline w-1/6 flex relative">
      <div ref={setRecordedRef} className="recorded-area w-1/2 bg-gray-100 p-4 min-h-screen overflow-auto">
        {timeSlots.map((hour) => (
          <div key={hour} className="time-slot h-20 border-t border-gray-200 relative">
            <span className="absolute left-0 -top-3 text-xs text-gray-500">{formatTime(hour)}</span>
          </div>
        ))}
        <div 
          className="current-time-line absolute left-0 right-0 border-t-2 border-red-500" 
          style={{ top: `${getTimelinePosition(currentTime)}%` }}
        />
        <SortableContext items={recordedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {recordedTasks.map((task) => (
            <div 
              key={task.id} 
              className="absolute left-0 right-0" 
              style={{ top: `${getTimelinePosition(new Date(task.recordedTime || 0))}%` }}
            >
              <TaskBlock task={task} />
            </div>
          ))}
        </SortableContext>
      </div>
      <div ref={setPlannedRef} className="planned-area w-1/2 bg-gray-200 p-4 min-h-screen overflow-auto">
        <SortableContext items={plannedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {plannedTasks.map((task, index) => (
            <div key={task.id} className="mb-4">
              <TaskBlock task={task} />
              <input 
                type="number" 
                value={task.estimatedTime || 0} 
                onChange={(e) => updateTaskTime(task.id, Number(e.target.value))}
                className="mt-2 w-16 p-1 border rounded"
                placeholder="Est. time"
              />
            </div>
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

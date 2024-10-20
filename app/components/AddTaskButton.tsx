"use client";

import React, { useState } from 'react';

interface AddTaskButtonProps {
  onAddTask: (title: string) => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter task title"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
        <button onClick={() => setIsAdding(false)} className="ml-2 text-gray-500">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsAdding(true)}
      className="bg-green-500 text-white px-4 py-2 rounded mb-4"
    >
      Add New Task
    </button>
  );
};

import React from "react";
import type { Task } from "../types/Task";

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  return (
    <div className="group relative bg-slate-800 border border-slate-700 hover:border-cyan-300 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-cyan-900/20 hover:shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-slide-in">
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="text-lg font-semibold text-slate-100 truncate">
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-slate-400 text-sm line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
      <button
        className="shrink-0 flex items-center justify-center gap-2 
             bg-slate-700/50 text-slate-300 border border-slate-600 
             /* Container Hover Styles */
             group-hover:bg-slate-700 group-hover:border-slate-500 
             /* Button Hover Styles (Overrides group-hover) */
             hover:!bg-emerald-600 hover:!border-emerald-500 hover:text-white 
             font-medium px-4 py-2 rounded-lg transition-colors"
        onClick={() => onComplete(task.id)}
        aria-label="Mark task as done"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Done
      </button>
    </div>
  );
};

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-4 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 text-slate-400 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 text-emerald-500/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-slate-300">No pending tasks.</p>
        <p className="text-sm mt-1">
          You're all caught up! Add a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
};

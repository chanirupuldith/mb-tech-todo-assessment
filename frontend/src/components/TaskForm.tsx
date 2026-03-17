import React, { useState } from 'react';
import type { CreateTaskData } from '../types/Task';

interface TaskFormProps {
  onTaskCreated: (data: CreateTaskData) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onTaskCreated({ title, description });
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-sm font-medium text-slate-300 ml-1">Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-slate-900/50 border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all disabled:opacity-50"
        />
        {error && <p className="text-rose-400 text-sm mt-1 ml-1 animate-pulse">{error}</p>}
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-desc" className="text-sm font-medium text-slate-300 ml-1">Description <span className="text-slate-500 text-xs font-normal">(optional)</span></label>
        <textarea
          id="task-desc"
          placeholder="Add some details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full bg-slate-900/50 border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all disabled:opacity-50 resize-y"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-2 w-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-semibold flex items-center justify-center py-3.5 px-6 rounded-lg shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        <span className="relative z-10">{isSubmitting ? 'Adding Task...' : 'Add Task'}</span>
      </button>
    </form>
  );
};

import { useState, useEffect, useCallback } from "react";
import type { Task, CreateTaskData } from "./types/Task";
import { fetchTasks, createTask, completeTask } from "./services/api";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load tasks. Is the server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (data: CreateTaskData) => {
    const newTask = await createTask(data);
    setTasks((prev) => [newTask, ...prev].slice(0, 5));
  };

  const handleCompleteTask = async (id: number) => {
    try {
      await completeTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      if (tasks.length <= 5) {
        const updatedTasks = await fetchTasks();
        setTasks(updatedTasks);
      }
    } catch (err) {
      alert("Failed to complete task");
    }
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 mt-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 drop-shadow-sm">
          To-Do Dashboard
        </h1>
        <p className="mt-2 text-slate-400">Manage your tasks efficiently</p>
      </header>

      <div className="w-full max-w-[85vw] grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Form */}
        <div className="lg:col-span-2 flex flex-col gap-6 items-start">
          <div className="w-full backdrop-blur-xl bg-slate-800/60 border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-indigo-300">
              Create New Task
            </h2>
            <TaskForm onTaskCreated={handleCreateTask} />
          </div>
        </div>

        {/* Right column: List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="w-full h-full min-h-[400px] backdrop-blur-xl bg-slate-800/60 border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-300">
                Most Recent Tasks
              </h2>
            </div>

            <div className="flex-1 w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-400"></div>
                    <span className="ml-2">Loading your tasks...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-rose-400 text-center p-4 bg-rose-950/30 rounded-lg border border-rose-900/50">
                  {error}
                </div>
              ) : (
                <TaskList tasks={tasks} onComplete={handleCompleteTask} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import * as repo from "../repositories/taskRepository";
import { Task } from "../repositories/taskRepository";
import { ValidationError, NotFoundError, ConflictError } from "../utils/errors";

export const createTask = async (data: {
  title?: unknown;
  description?: unknown;
}): Promise<Task> => {
  const { title, description } = data;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new ValidationError("Title is required and must be a non-empty string");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new ValidationError("Description must be a string");
  }

  return repo.create({
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : undefined,
  });
};

export const getLatestTasks = async (): Promise<Task[]> => {
  return repo.getLatest();
};

export const completeTask = async (id: number): Promise<Task> => {
  const task = await repo.findById(id);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.completed) {
    throw new ConflictError("Task is already completed");
  }

  return repo.markComplete(id);
};
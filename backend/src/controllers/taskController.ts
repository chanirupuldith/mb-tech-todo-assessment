import { Request, Response } from "express";
import * as taskService from "../services/taskService";
import { AppError } from "../utils/errors";

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await taskService.getLatestTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.completeTask(Number(req.params.id));
    res.json(task);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Complete task error:", error);
    res.status(500).json({ message: "Failed to complete task" });
  }
};
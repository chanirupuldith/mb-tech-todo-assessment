import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
}

export const create = async ({
  title,
  description,
}: {
  title: string;
  description?: string;
}): Promise<Task> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO task (title, description) VALUES (?, ?)",
    [title, description || null]
  );

  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM task WHERE id = ?",
    [result.insertId]
  );

  return rows[0] as Task;
};

export const getLatest = async (): Promise<Task[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM task
     WHERE completed = false
     ORDER BY created_at DESC
     LIMIT 5`
  );

  return rows as Task[];
};

export const findById = async (id: number): Promise<Task | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM task WHERE id = ?",
    [id]
  );

  const result = rows as Task[];
  return result.length > 0 ? result[0] : null;
};

export const markComplete = async (id: number): Promise<Task> => {
  await pool.execute("UPDATE task SET completed = true WHERE id = ?", [id]);

  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM task WHERE id = ?",
    [id]
  );

  return rows[0] as Task;
};
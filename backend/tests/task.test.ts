import request from "supertest";
import app from "../src/app";
import * as taskService from "../src/services/taskService";
import { NotFoundError, ValidationError, ConflictError } from "../src/utils/errors";

// Mock the service layer
jest.mock("../src/services/taskService");
const mockedService = taskService as jest.Mocked<typeof taskService>;

describe("Task API — Unit Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // -----------------------------
  // CREATE TASK
  // -----------------------------
  describe("POST /tasks", () => {
    it("should create a task and return 201", async () => {
      const mockTask = {
        id: 1,
        title: "Test task",
        description: null,
        completed: false,
        created_at: new Date(),
      };
      mockedService.createTask.mockResolvedValue(mockTask);

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Test task" });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Test task");
      expect(res.body.completed).toBe(false);
      expect(mockedService.createTask).toHaveBeenCalledWith({
        title: "Test task",
      });
    });

    it("should create a task with description", async () => {
      const mockTask = {
        id: 2,
        title: "Test task",
        description: "A description",
        completed: false,
        created_at: new Date(),
      };
      mockedService.createTask.mockResolvedValue(mockTask);

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Test task", description: "A description" });

      expect(res.statusCode).toBe(201);
      expect(res.body.description).toBe("A description");
    });

    it("should return 400 when title is missing", async () => {
      mockedService.createTask.mockRejectedValue(
        new ValidationError("Title is required and must be a non-empty string")
      );

      const res = await request(app).post("/tasks").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("Title is required");
    });

    it("should return 400 when title is empty", async () => {
      mockedService.createTask.mockRejectedValue(
        new ValidationError("Title is required and must be a non-empty string")
      );

      const res = await request(app)
        .post("/tasks")
        .send({ title: "" });

      expect(res.statusCode).toBe(400);
    });

    it("should return 400 when title is not a string", async () => {
      mockedService.createTask.mockRejectedValue(
        new ValidationError("Title is required and must be a non-empty string")
      );

      const res = await request(app)
        .post("/tasks")
        .send({ title: 123 });

      expect(res.statusCode).toBe(400);
    });

    it("should return 500 on unexpected error", async () => {
      mockedService.createTask.mockRejectedValue(new Error("DB down"));

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Test" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Failed to create task");
    });
  });

  // -----------------------------
  // GET TASKS
  // -----------------------------
  describe("GET /tasks", () => {
    it("should return an array of tasks", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: null,
          completed: false,
          created_at: new Date(),
        },
        {
          id: 2,
          title: "Task 2",
          description: "Desc",
          completed: false,
          created_at: new Date(),
        },
      ];
      mockedService.getLatestTasks.mockResolvedValue(mockTasks);

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });

    it("should return empty array when no tasks exist", async () => {
      mockedService.getLatestTasks.mockResolvedValue([]);

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 500 on unexpected error", async () => {
      mockedService.getLatestTasks.mockRejectedValue(new Error("DB down"));

      const res = await request(app).get("/tasks");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Failed to fetch tasks");
    });
  });

  // -----------------------------
  // COMPLETE TASK
  // -----------------------------
  describe("PATCH /tasks/:id/complete", () => {
    it("should complete a task and return the updated task", async () => {
      const mockTask = {
        id: 1,
        title: "Task 1",
        description: null,
        completed: true,
        created_at: new Date(),
      };
      mockedService.completeTask.mockResolvedValue(mockTask);

      const res = await request(app).patch("/tasks/1/complete");

      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(true);
      expect(mockedService.completeTask).toHaveBeenCalledWith(1);
    });

    it("should return 404 if task does not exist", async () => {
      mockedService.completeTask.mockRejectedValue(
        new NotFoundError("Task not found")
      );

      const res = await request(app).patch("/tasks/999/complete");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Task not found");
    });

    it("should return 409 if task is already completed", async () => {
      mockedService.completeTask.mockRejectedValue(
        new ConflictError("Task is already completed")
      );

      const res = await request(app).patch("/tasks/1/complete");

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Task is already completed");
    });

    it("should return 500 on unexpected error", async () => {
      mockedService.completeTask.mockRejectedValue(new Error("DB down"));

      const res = await request(app).patch("/tasks/1/complete");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Failed to complete task");
    });
  });
});
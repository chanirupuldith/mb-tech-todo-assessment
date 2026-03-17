import { createTask, getLatestTasks, completeTask } from "../src/services/taskService";
import * as repo from "../src/repositories/taskRepository";
import { ValidationError, NotFoundError, ConflictError } from "../src/utils/errors";

// Mock the repository layer
jest.mock("../src/repositories/taskRepository");
const mockedRepo = repo as jest.Mocked<typeof repo>;

describe("TaskService — Unit Tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // -----------------------------
  // createTask
  // -----------------------------
  describe("createTask", () => {
    it("should create a task with valid title", async () => {
      const mockTask = {
        id: 1,
        title: "Buy groceries",
        description: null,
        completed: false,
        created_at: new Date(),
      };
      mockedRepo.create.mockResolvedValue(mockTask);

      const result = await createTask({ title: "Buy groceries" });

      expect(result).toEqual(mockTask);
      expect(mockedRepo.create).toHaveBeenCalledWith({
        title: "Buy groceries",
        description: undefined,
      });
    });

    it("should create a task with title and description", async () => {
      const mockTask = {
        id: 2,
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        completed: false,
        created_at: new Date(),
      };
      mockedRepo.create.mockResolvedValue(mockTask);

      const result = await createTask({
        title: "Buy groceries",
        description: "Milk, eggs, bread",
      });

      expect(result).toEqual(mockTask);
      expect(mockedRepo.create).toHaveBeenCalledWith({
        title: "Buy groceries",
        description: "Milk, eggs, bread",
      });
    });

    it("should trim title and description", async () => {
      const mockTask = {
        id: 3,
        title: "Buy groceries",
        description: "Milk",
        completed: false,
        created_at: new Date(),
      };
      mockedRepo.create.mockResolvedValue(mockTask);

      await createTask({ title: "  Buy groceries  ", description: "  Milk  " });

      expect(mockedRepo.create).toHaveBeenCalledWith({
        title: "Buy groceries",
        description: "Milk",
      });
    });

    it("should throw ValidationError when title is missing", async () => {
      await expect(createTask({})).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when title is empty", async () => {
      await expect(createTask({ title: "" })).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when title is whitespace only", async () => {
      await expect(createTask({ title: "   " })).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when title is not a string", async () => {
      await expect(createTask({ title: 123 })).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when description is not a string", async () => {
      await expect(
        createTask({ title: "Valid", description: 456 })
      ).rejects.toThrow(ValidationError);
    });
  });

  // -----------------------------
  // getLatestTasks
  // -----------------------------
  describe("getLatestTasks", () => {
    it("should return tasks from the repository", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", description: null, completed: false, created_at: new Date() },
      ];
      mockedRepo.getLatest.mockResolvedValue(mockTasks);

      const result = await getLatestTasks();

      expect(result).toEqual(mockTasks);
      expect(mockedRepo.getLatest).toHaveBeenCalled();
    });
  });

  // -----------------------------
  // completeTask
  // -----------------------------
  describe("completeTask", () => {
    it("should complete a task that exists and is not completed", async () => {
      const existingTask = {
        id: 1,
        title: "Task",
        description: null,
        completed: false,
        created_at: new Date(),
      };
      const completedTask = { ...existingTask, completed: true };

      mockedRepo.findById.mockResolvedValue(existingTask);
      mockedRepo.markComplete.mockResolvedValue(completedTask);

      const result = await completeTask(1);

      expect(result.completed).toBe(true);
      expect(mockedRepo.findById).toHaveBeenCalledWith(1);
      expect(mockedRepo.markComplete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundError when task does not exist", async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(completeTask(999)).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when task is already completed", async () => {
      const completedTask = {
        id: 1,
        title: "Task",
        description: null,
        completed: true,
        created_at: new Date(),
      };
      mockedRepo.findById.mockResolvedValue(completedTask);

      await expect(completeTask(1)).rejects.toThrow(ConflictError);
    });
  });
});

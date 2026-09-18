import { api } from "@/lib/api";
import type { Task, TaskStatus } from "@/types";

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export function getTasks(params?: { status?: TaskStatus; search?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);

  const queryString = query.toString();
  return api.get<Task[]>(`/tasks${queryString ? `?${queryString}` : ""}`);
}

export function createTask(input: TaskInput) {
  return api.post<Task>("/tasks", input);
}

export function updateTask(id: number, input: TaskInput) {
  return api.put<Task>(`/tasks/${id}`, input);
}

export function deleteTask(id: number) {
  return api.delete<void>(`/tasks/${id}`);
}

export type TaskStatus = "TODO" | "DONE";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

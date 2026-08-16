export type UserRole = "user" | "admin";

export type AuthenticatedUser = {
  _id: string;
  name: string;
  email: string;
  role?: UserRole;
};

export type User = {
  name: string;
  email: string;
  role: UserRole;
};

// Generic API response type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

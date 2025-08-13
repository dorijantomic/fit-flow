import { User } from "@prisma/client";

// Define the shape of data needed for user creation and preference updates
// This can be expanded later based on the full specification
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserPreferences = Partial<Pick<User, 'name' | 'email'>>; // Example, expand as needed

export interface IUserManagementCore {
  createUser(data: CreateUserData): Promise<User>;
  updatePreferences(userId: string, prefs: UserPreferences): Promise<void>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
}

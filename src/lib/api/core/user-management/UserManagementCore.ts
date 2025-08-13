import { User } from "@prisma/client";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { CreateUserData, IUserManagementCore, UserPreferences } from "../../interfaces/IUserManagementCore";

export class UserManagementCore implements IUserManagementCore {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data: CreateUserData): Promise<User> {
    // In a real application, you would add more logic here,
    // e.g., hashing passwords, validating data, etc.
    return this.userRepository.create(data);
  }

  async updatePreferences(userId: string, prefs: UserPreferences): Promise<void> {
    // Here you would fetch the user, apply the preferences, and save.
    // This is a simplified example.
    console.log(`Updating preferences for user ${userId}`, prefs);
    // const user = await this.userRepository.findById(userId);
    // if (user) {
    //   const updatedUser = { ...user, ...prefs };
    //   await this.userRepository.update(userId, updatedUser);
    // }
    return Promise.resolve();
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}

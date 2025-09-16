import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../common/database/prisma.service';
import { User } from './entities/user.entity';

/**
 * User service providing CRUD operations for User entity
 * Handles user creation, retrieval, updates, and password hashing using Prisma Client
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user with hashed password
   * @param userData - User data including password
   * @returns Promise<User> - Created user
   */
  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.prisma.user.create({
      data: userData as any,
    });
  }

  /**
   * Finds a single user based on conditions
   * @param where - Where conditions for finding the user
   * @param select - Optional select fields
   * @returns Promise<User | null> - Found user or null
   */
  async getOne(where: any, select?: any): Promise<User | null> {
    return this.prisma.user.findFirst({
      where,
      select,
    });
  }

  /**
   * Updates a user by ID
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Promise<User> - Updated user
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData as any,
    });
  }

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns Promise<User | null> - Found user or null
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a user by username
   * @param username - Username to search for
   * @returns Promise<User | null> - Found user or null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Finds all users with optional filtering
   * @param where - Optional where conditions
   * @returns Promise<User[]> - Array of users
   */
  async findAll(where?: any): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Deletes a user by ID
   * @param id - User ID
   * @returns Promise<User> - Deleted user
   */
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
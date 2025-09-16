import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../common/database/prisma.service';
import { DatabaseModule } from '../../common/database/database.module';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('UserService Integration', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.cleanDatabase();
  });

  it('should create and retrieve a user', async () => {
    const createUserDto = {
      username: 'integrationtest',
      password: 'password123',
      nickname: 'Integration Test User',
    };

    // Create user
    const createdUser = await service.create(createUserDto);
    expect(createdUser).toBeDefined();
    expect(createdUser.username).toBe('integrationtest');
    expect(createdUser.nickname).toBe('Integration Test User');

    // Retrieve user
    const foundUser = await service.findByUsername('integrationtest');
    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(createdUser.id);
  });

  it('should update user information', async () => {
    // Create user first
    const createUserDto = {
      username: 'updatetest',
      password: 'password123',
      nickname: 'Update Test User',
    };

    const createdUser = await service.create(createUserDto);

    // Update user
    const updateData = {
      nickname: 'Updated Nickname',
      role: 'ADMIN',
    };

    const updatedUser = await service.update(createdUser.id, updateData);
    expect(updatedUser.nickname).toBe('Updated Nickname');
    expect(updatedUser.role).toBe('ADMIN');
  });
});
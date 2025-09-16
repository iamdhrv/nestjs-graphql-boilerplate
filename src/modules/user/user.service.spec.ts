import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../common/database/prisma.service';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
vi.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        nickname: 'Test User',
      };

      const hashedPassword = 'hashedPassword123';
      const expectedUser = {
        id: '1',
        username: 'testuser',
        password: hashedPassword,
        nickname: 'Test User',
        role: 'USER',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          password: hashedPassword,
          nickname: 'Test User',
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const expectedUser = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        nickname: 'Test User',
        role: 'USER',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.findByUsername(username);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(expectedUser);
    });
  });
});
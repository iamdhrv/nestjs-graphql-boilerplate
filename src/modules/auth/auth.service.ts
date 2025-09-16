import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { EnvironmentVariables } from 'src/common/helper/env.validation';
import { UtilService } from 'src/common/util/util.service';
import { User } from 'src/modules/user/entities/user.entity';

import { UserService } from '../user/user.service';
import { JwtWithUser } from './entities/auth.entity';
import { SignInInput, SignUpInput } from './inputs/auth.input';

/**
 * Authentication service handling user authentication, JWT tokens, and user management
 * Provides sign-in, sign-up, token generation, and validation functionality
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly utilService: UtilService,
  ) {}

  /**
   * Generates a refresh token for a user and stores it in the database
   * @param userId - User ID
   * @returns Promise<string> - Generated refresh token
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '7d',
      },
    );
    await this.userService.update(userId, { refreshToken });

    return refreshToken;
  }

  /**
   * Verifies a refresh token and returns the associated user
   * @param userId - User ID
   * @param refreshToken - Refresh token to verify
   * @returns Promise<User> - User associated with the token
   */
  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return this.userService.getOne({ where: { id: userId, refreshToken } });
    } catch (err) {
      if (err.message === 'jwt expired') {
        this.userService.update(userId, { refreshToken: null });
      }
      throw err;
    }
  }

  /**
   * Generates an access token for a user
   * @param user - User object
   * @param refreshToken - User's refresh token
   * @returns string - Generated access token
   */
  generateAccessToken(user: User, refreshToken: string): string {
    return this.jwtService.sign({
      ...this.utilService.pick(user, ['id', 'role']),
      refreshToken,
    });
  }

  /**
   * Registers a new user and returns JWT with user data
   * @param input - Sign-up input data
   * @returns Promise<JwtWithUser> - JWT token and user data
   * @throws BadRequestException if username already exists
   */
  async signUp(input: SignUpInput): Promise<JwtWithUser> {
    const doesExistId = await this.userService.getOne({
      where: { username: input.username },
    });

    if (doesExistId) {
      throw new BadRequestException('Username already exists');
    }

    const user = await this.userService.create({ ...input, role: 'user' });

    return this.signIn(user);
  }

  /**
   * Signs in a user and returns JWT with user data
   * @param user - User object
   * @returns Promise<JwtWithUser> - JWT token and user data
   */
  async signIn(user: User): Promise<JwtWithUser> {
    const refreshToken = await this.generateRefreshToken(user.id);
    const jwt = this.generateAccessToken(user, refreshToken);

    return { jwt, user };
  }

  /**
   * Validates user credentials for authentication
   * @param input - Sign-in input with username and password
   * @returns Promise<User | null> - User if valid, null if invalid
   */
  async validateUser(input: SignInInput): Promise<User | null> {
    const { username, password } = input;

    const user = await this.userService.getOne({ where: { username } });
    if (!user) {
      return null;
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}
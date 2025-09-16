import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CREATE_INPUT_CLASS_NAME } from '../dto/create-input.template';
import { UPDATE_INPUT_CLASS_NAME } from '../dto/update-input.template';

/**
 * SERVICE_CLASS_NAME service for ENTITY_CLASS_NAME operations
 * Handles all business logic and database operations for ENTITY_CLASS_NAME
 */
@Injectable()
export class SERVICE_CLASS_NAME {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new ENTITY_CLASS_NAME
   * @param createInput - Data for creating the ENTITY_CLASS_NAME
   * @returns Promise<any> - The created ENTITY_CLASS_NAME
   */
  async create(createInput: CREATE_INPUT_CLASS_NAME): Promise<any> {
    try {
      return await this.prisma.ENTITY_LOWERCASE.create({
        data: createInput,
      });
    } catch (error) {
      throw new Error(`Failed to create ENTITY_CLASS_NAME: ${error.message}`);
    }
  }

  /**
   * Find all ENTITY_CLASS_NAME records
   * @returns Promise<any[]> - Array of ENTITY_CLASS_NAME records
   */
  async findAll(): Promise<any[]> {
    try {
      return await this.prisma.ENTITY_LOWERCASE.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new Error(`Failed to fetch ENTITY_CLASS_NAME records: ${error.message}`);
    }
  }

  /**
   * Find a single ENTITY_CLASS_NAME by ID
   * @param id - The ID of the ENTITY_CLASS_NAME to find
   * @returns Promise<any> - The found ENTITY_CLASS_NAME
   * @throws NotFoundException if ENTITY_CLASS_NAME not found
   */
  async findOne(id: string): Promise<any> {
    try {
      const entity = await this.prisma.ENTITY_LOWERCASE.findUnique({
        where: { id },
      });

      if (!entity) {
        throw new NotFoundException(`ENTITY_CLASS_NAME with ID ${id} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch ENTITY_CLASS_NAME: ${error.message}`);
    }
  }

  /**
   * Update a ENTITY_CLASS_NAME by ID
   * @param id - The ID of the ENTITY_CLASS_NAME to update
   * @param updateInput - Data for updating the ENTITY_CLASS_NAME
   * @returns Promise<any> - The updated ENTITY_CLASS_NAME
   * @throws NotFoundException if ENTITY_CLASS_NAME not found
   */
  async update(id: string, updateInput: UPDATE_INPUT_CLASS_NAME): Promise<any> {
    try {
      // Check if entity exists
      await this.findOne(id);

      return await this.prisma.ENTITY_LOWERCASE.update({
        where: { id },
        data: updateInput,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update ENTITY_CLASS_NAME: ${error.message}`);
    }
  }

  /**
   * Delete a ENTITY_CLASS_NAME by ID
   * @param id - The ID of the ENTITY_CLASS_NAME to delete
   * @returns Promise<boolean> - True if deletion was successful
   * @throws NotFoundException if ENTITY_CLASS_NAME not found
   */
  async remove(id: string): Promise<boolean> {
    try {
      // Check if entity exists
      await this.findOne(id);

      await this.prisma.ENTITY_LOWERCASE.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete ENTITY_CLASS_NAME: ${error.message}`);
    }
  }
}
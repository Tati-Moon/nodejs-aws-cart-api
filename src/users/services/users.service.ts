import { Injectable } from '@nestjs/common';
import { User as UserDTO } from '../models';
import { User as UserEntity } from '../../entities/User.entity';
import { DatabaseService } from '../../database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findOne(login: string): Promise<UserDTO | null> {
    const query = 'SELECT * FROM users WHERE login = $1';
    const result = await this.databaseService.query(query, [login]);

    if (result.rows.length === 0) {
      return null;
    }

    const userEntity = result.rows[0];
    return this.toDTO(userEntity);
  }

  async createOne(user: UserDTO): Promise<UserDTO> {
    const id = uuidv4();
    const query = `
      INSERT INTO users (id, login, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      id,
      user.name,
      user.email,
      user.password,
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    const userEntity = result.rows[0];
    return this.toDTO(userEntity);
  }

  private toDTO(userEntity: UserEntity): UserDTO {
    return {
      id: userEntity.id,
      name: userEntity.login,
      email: userEntity.email,
      password: userEntity.password,
    };
  }
}

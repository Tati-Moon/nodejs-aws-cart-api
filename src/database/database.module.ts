import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: 'POSTGRES',
      useFactory: async () => {
        return new Pool({
          host:
            process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: +process.env.DATABASE_PORT,
            ssl: {
            rejectUnauthorized: false,
          },
        });
      },
    },
  ],
  exports: ['POSTGRES', DatabaseService],
})
export class DatabaseModule {}

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
            process.env.DATABASE_HOST ||
            'database-1.cpukomqyes2t.us-east-1.rds.amazonaws.com',
          user: process.env.DATABASE_USERNAME || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'ENWwRKuZXd9iV1EpcJzH',
          database: process.env.DATABASE_NAME || 'postgres',
          port: +process.env.DATABASE_PORT || 5432,
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

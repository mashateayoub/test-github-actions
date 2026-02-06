import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './db/schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Global()
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'DRIZZLE',
      useFactory: async () => {
        const pool = new Pool({
          connectionString:
            process.env.DATABASE_URL ||
            'postgresql://user:password@127.0.0.1:5432/monorepo',
        });
        // Test connection
        try {
          const client = await pool.connect();
          console.log('Successfully connected to PostgreSQL');
          client.release();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error('Failed to connect to PostgreSQL:', message);
        }
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class AppModule {}

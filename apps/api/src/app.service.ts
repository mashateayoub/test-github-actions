import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from './db/schema';

interface DatabaseError {
  message: string;
  code?: string;
  detail?: string;
  hint?: string;
  table?: string;
}

@Injectable()
export class AppService {
  constructor(@Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>) {}

  async getUsers() {
    try {
      // DEBUG: Try a raw query first to check if the pool is working
      // Note: we use this.db.execute(sql`...`) for raw queries in drizzle
      const rawResult = await this.db.execute(sql`SELECT * FROM users`);
      console.log('Raw query successful:', rawResult.rows.length, 'rows found');

      return await this.db.select().from(schema.users);
    } catch (err) {
      const dbError = err as DatabaseError;
      console.error('DATABASE ERROR DETAILS:', {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        hint: dbError.hint,
        table: dbError.table,
      });
      throw err;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}

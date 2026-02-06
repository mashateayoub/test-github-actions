import { Client } from 'pg';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

export async function ensureDatabaseExists() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://user:password@127.0.0.1:5432/monorepo';

  // Parse connection string or use defaults to connect to 'postgres' db first
  let baseConfig;
  try {
    const url = new URL(connectionString);
    baseConfig = {
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: 'postgres', // Connect to default DB to check/create others
    };
  } catch {
    // Fallback if URL parsing fails
    baseConfig = {
      user: 'user',
      password: 'password',
      host: '127.0.0.1',
      port: 5432,
      database: 'postgres',
    };
  }

  const targetDb =
    connectionString.split('/').pop()?.split('?')[0] || 'monorepo';

  const client = new Client(baseConfig as any);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb],
    );
    if (res.rowCount === 0) {
      console.log(`Database '${targetDb}' does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Database '${targetDb}' created successfully.`);
    } else {
      console.log(`Database '${targetDb}' already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await client.end();
  }
}

export async function seed(db: NodePgDatabase<typeof schema>) {
  // Ensure table exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      age INTEGER
    );
  `);

  const existingUsers = await db.select().from(schema.users);
  if (existingUsers.length > 0) {
    console.log('Database already seeded');
    return;
  }

  await db.insert(schema.users).values([
    { name: 'John Doe', age: 30 },
    { name: 'Jane Doe', age: 25 },
    { name: 'Bob Smith', age: 40 },
  ]);
  console.log('Database seeded successfully');
}

import { NestFactory } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AppModule } from './app.module';

import * as schema from './db/schema';
import { seed, ensureDatabaseExists } from './db/seed';

async function bootstrap() {
  const isDevelopment =
    process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  if (isDevelopment) {
    await ensureDatabaseExists();
  }
  const app = await NestFactory.create(AppModule);
  if (isDevelopment) {
    const db = app.get<NodePgDatabase<typeof schema>>('DRIZZLE');
    await seed(db);
  }
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
void bootstrap();

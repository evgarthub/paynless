import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

const DB_PATH = process.env.DB_PATH || "./data/paynless.db";

const sqlite = new Database(DB_PATH);
sqlite.exec("PRAGMA journal_mode = WAL");
sqlite.exec("PRAGMA foreign_keys = ON");

const db = drizzle(sqlite, { schema });

console.log("Running migrations...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations complete.");

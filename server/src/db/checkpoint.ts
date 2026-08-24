import { Database } from "bun:sqlite";

const db = new Database("./data/migration-test.db");
db.exec("PRAGMA wal_checkpoint(TRUNCATE)");

const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", tables.map((t: any) => t.name).join(", "));

const bills = db.query("SELECT count(*) as c FROM bills").get() as { c: number };
console.log("Bills:", bills.c);

const items = db.query("SELECT count(*) as c FROM bill_items").get() as { c: number };
console.log("Bill items:", items.c);

db.close();

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { nanoid } from "nanoid";
import * as schema from "./schema";

const OLD_DB_PATH = process.env.OLD_DB_PATH || "D:\\code\\homeio-react\\cms\\.tmp\\data.db";
const DB_PATH = process.env.DB_PATH || "./data/paynless.db";

console.log(`Old DB: ${OLD_DB_PATH}`);
console.log(`Target DB: ${DB_PATH}\n`);

const oldDb = new Database(OLD_DB_PATH, { readonly: true });

const sqlite = new Database(DB_PATH);
sqlite.exec("PRAGMA journal_mode = WAL");
sqlite.exec("PRAGMA foreign_keys = ON");
const db = drizzle(sqlite, { schema });

console.log("Applying schema to temp DB...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Schema applied.\n");

// ============================================================
// Helpers
// ============================================================

function dateToBillingPeriod(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function findApplicableRate(
  utilityId: string,
  recordDate: Date,
  tariffRates: schema.TariffRate[]
): schema.TariffRate | undefined {
  const applicable = tariffRates
    .filter((r) => r.utilityId === utilityId && r.effectiveFrom <= recordDate)
    .sort((a, b) => b.effectiveFrom.getTime() - a.effectiveFrom.getTime());
  return applicable[0];
}

// Check if data already exists
const existingUtilities = db.select().from(schema.utilities).all();
if (existingUtilities.length > 0) {
  console.log(`DB already has ${existingUtilities.length} utilities. Skipping migration.`);
  console.log("Delete all data first if you want to re-migrate.\n");

  // Still show summary
  const bills = db.select().from(schema.bills).all();
  const items = db.select().from(schema.billItems).all();
  console.log(`  utilities:    ${existingUtilities.length}`);
  console.log(`  tariff_rates: ${db.select().from(schema.tariffRates).all().length}`);
  console.log(`  bills:        ${bills.length}`);
  console.log(`  bill_items:   ${items.length}`);
  oldDb.close();
  sqlite.close();
  process.exit(0);
}

// ============================================================
// 1. Migrate types → utilities
// ============================================================
console.log("--- Migrating types → utilities ---");

const TYPE_MAP: Record<number, { name: string; type: "CONSUMPTION" | "FIXED" }> = {
  1: { name: "electricity", type: "CONSUMPTION" },
  2: { name: "heat", type: "CONSUMPTION" },
  3: { name: "water", type: "CONSUMPTION" },
  4: { name: "maintenance", type: "FIXED" },
};

const oldTypes = oldDb.query("SELECT * FROM types").all() as {
  id: number;
  title: string;
  unit: string | null;
}[];

const typeToUtilityId = new Map<number, string>();

for (const t of oldTypes) {
  const mapping = TYPE_MAP[t.id];
  if (!mapping) continue;

  const newId = nanoid();
  typeToUtilityId.set(t.id, newId);

  db.insert(schema.utilities).values({
    id: newId,
    name: mapping.name,
    type: mapping.type,
    unit: t.unit ?? null,
  }).run();

  console.log(`  type[${t.id}] "${t.title}" → utility[${newId}] "${mapping.name}"`);
}
console.log(`  ${typeToUtilityId.size} utilities migrated.\n`);

// ============================================================
// 2. Migrate tariffs + components → tariff_rates
// ============================================================
console.log("--- Migrating tariffs + tariff_costs → tariff_rates ---");

const oldTariffs = oldDb.query("SELECT * FROM tariffs").all() as {
  id: number;
  startDate: string | null;
  source: string | null;
  type: number | null;
  created_at: number;
}[];

const oldTariffComponents = oldDb.query("SELECT * FROM tariffs_components").all() as {
  component_type: string;
  component_id: number;
  tariff_id: number;
}[];

const oldTariffCosts = oldDb.query("SELECT * FROM components_tariff_costs").all() as {
  id: number;
  value: number | null;
  limit: number | null;
}[];

const tariffCostMap = new Map<number, { value: number; limit: number | null }>();
for (const tc of oldTariffComponents) {
  if (tc.component_type === "components_tariff_costs") {
    const cost = oldTariffCosts.find((c) => c.id === tc.component_id);
    if (cost) {
      tariffCostMap.set(tc.tariff_id, {
        value: cost.value ?? 0,
        limit: cost.limit,
      });
    }
  }
}

for (const t of oldTariffs) {
  if (!t.type || !typeToUtilityId.has(t.type)) continue;

  const newId = nanoid();
  const utilityId = typeToUtilityId.get(t.type)!;
  const costData = tariffCostMap.get(t.id);

  const effectiveFrom = t.startDate
    ? new Date(t.startDate)
    : new Date(t.created_at);

  db.insert(schema.tariffRates).values({
    id: newId,
    utilityId,
    ratePerUnit: costData?.value ?? 0,
    fixedFee: costData?.limit ?? 0,
    referenceUrl: t.source,
    effectiveFrom,
  }).run();

  console.log(
    `  tariff[${t.id}] → tariffRate[${newId}] utility=${utilityId} rate=${costData?.value ?? 0}`
  );
}

const allTariffRates = db.select().from(schema.tariffRates).all();
console.log(`  ${allTariffRates.length} tariff rates migrated.\n`);

// ============================================================
// 3. Migrate records → bills + bill_items
// ============================================================
console.log("--- Migrating records → bills + bill_items ---");

type OldRecord = {
  id: number;
  value: number;
  date: number | null;
  type: number | null;
  created_at: number;
};

const oldRecords = oldDb
  .query("SELECT * FROM records ORDER BY type, date")
  .all() as OldRecord[];

// Group records by (month, type)
const grouped = new Map<string, OldRecord[]>();
for (const r of oldRecords) {
  if (!r.type || !typeToUtilityId.has(r.type)) continue;
  const d = r.date ? new Date(r.date) : new Date(r.created_at);
  const key = `${dateToBillingPeriod(d)}:${r.type}`;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key)!.push(r);
}

// Sort each group by date for consumption calculation
for (const records of grouped.values()) {
  records.sort((a, b) => {
    const da = a.date ?? a.created_at;
    const db = b.date ?? b.created_at;
    return da - db;
  });
}

// Build sorted billing periods
const billingPeriods = [...new Set([...grouped.keys()].map((k) => k.split(":")[0]))].sort();

// For consumption: track previous reading per utility
const previousReading = new Map<number, number>(); // type → last value
let billsCreated = 0;
let billItemsCreated = 0;

for (const period of billingPeriods) {
  const periodDate = new Date(`${period}-15`); // mid-month for date matching

  // Collect all bill items for this period
  const itemsForPeriod: {
    utilityId: string;
    prevReading: number | null;
    currReading: number;
    consumption: number | null;
    rate: number;
    cost: number;
  }[] = [];

  let periodTotal = 0;

  for (const [key, records] of grouped) {
    const [periodKey, typeIdStr] = key.split(":");
    if (periodKey !== period) continue;

    const typeId = parseInt(typeIdStr);
    const utilityId = typeToUtilityId.get(typeId)!;

    // For FIXED type (maintenance), no consumption calc — just flat rate
    if (TYPE_MAP[typeId]?.type === "FIXED") {
      const rate = findApplicableRate(utilityId, periodDate, allTariffRates);
      const rateValue = rate?.ratePerUnit ?? 0;
      const lastRecord = records[records.length - 1];
      const cost = rateValue; // flat fee for the period

      itemsForPeriod.push({
        utilityId,
        prevReading: null,
        currReading: lastRecord.value,
        consumption: null,
        rate: rateValue,
        cost,
      });
      periodTotal += cost;
      continue;
    }

    // CONSUMPTION type: calc difference between consecutive readings
    for (const r of records) {
      const rate = findApplicableRate(utilityId, periodDate, allTariffRates);
      const rateValue = rate?.ratePerUnit ?? 0;
      const prev = previousReading.get(typeId);
      const consumption = prev != null ? r.value - prev : null;
      const cost = consumption != null ? consumption * rateValue : 0;

      itemsForPeriod.push({
        utilityId,
        prevReading: prev ?? null,
        currReading: r.value,
        consumption,
        rate: rateValue,
        cost,
      });
      periodTotal += cost;

      previousReading.set(typeId, r.value);
    }
  }

  if (itemsForPeriod.length === 0) continue;

  // Create bill
  const billId = nanoid();
  db.insert(schema.bills).values({
    id: billId,
    billingPeriod: period,
    totalAmount: Math.round(periodTotal * 100) / 100,
    status: "PAID",
    createdAt: new Date(periodDate),
  }).run();

  // Create bill items
  for (const item of itemsForPeriod) {
    db.insert(schema.billItems).values({
      id: nanoid(),
      billId,
      utilityId: item.utilityId,
      inputType: "MANUAL",
      previousReading: item.prevReading,
      currentReading: item.currReading,
      consumption: item.consumption,
      appliedRate: item.rate,
      totalCost: Math.round(item.cost * 100) / 100,
      isEstimated: false,
    }).run();
    billItemsCreated++;
  }

  billsCreated++;
}

console.log(`  ${billsCreated} bills created.`);
console.log(`  ${billItemsCreated} bill items created.\n`);

// ============================================================
// 4. Verify with JOIN to show utility names
// ============================================================
console.log("--- Verification ---");
const utilityCount = db.select().from(schema.utilities).all().length;
const tariffCount = db.select().from(schema.tariffRates).all().length;
const billCount = db.select().from(schema.bills).all().length;
const billItemCount = db.select().from(schema.billItems).all().length;

console.log(`  utilities:    ${utilityCount}`);
console.log(`  tariff_rates: ${tariffCount}`);
console.log(`  bills:        ${billCount}`);
console.log(`  bill_items:   ${billItemCount}`);

console.log("\n--- Sample: bill_items with utility names (first 10) ---");
const itemsWithNames = sqlite.query(`
  SELECT bi.*, u.name as utility_name, b.billing_period
  FROM bill_items bi
  JOIN utilities u ON bi.utility_id = u.id
  JOIN bills b ON bi.bill_id = b.id
  LIMIT 10
`).all() as any[];
for (const i of itemsWithNames) {
  console.log(
    `  ${i.billing_period} | ${i.utility_name} | ` +
    `prev=${i.previous_reading} → curr=${i.current_reading} | ` +
    `consumption=${i.consumption} | rate=${i.applied_rate} | cost=${i.total_cost}`
  );
}

oldDb.close();

// Flush WAL to main DB file so data persists across process restarts
sqlite.exec("PRAGMA wal_checkpoint(TRUNCATE)");
sqlite.close();

console.log(`\nMigration complete. DB: ${DB_PATH}`);

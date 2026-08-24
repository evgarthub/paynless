import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const utilities = sqliteTable("utilities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["CONSUMPTION", "FIXED"] }).notNull(),
  unit: text("unit"),
  haEntityId: text("ha_entity_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const tariffRates = sqliteTable("tariff_rates", {
  id: text("id").primaryKey(),
  utilityId: text("utility_id")
    .notNull()
    .references(() => utilities.id, { onDelete: "cascade" }),
  ratePerUnit: real("rate_per_unit").default(0.0),
  fixedFee: real("fixed_fee").default(0.0),
  referenceUrl: text("reference_url"),
  effectiveFrom: integer("effective_from", { mode: "timestamp" }).notNull(),
});

export const bills = sqliteTable("bills", {
  id: text("id").primaryKey(),
  billingPeriod: text("billing_period").notNull(),
  totalAmount: real("total_amount").notNull().default(0),
  status: text("status", { enum: ["UNPAID", "PAID"] }).default("UNPAID"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const billItems = sqliteTable("bill_items", {
  id: text("id").primaryKey(),
  billId: text("bill_id")
    .notNull()
    .references(() => bills.id, { onDelete: "cascade" }),
  utilityId: text("utility_id")
    .notNull()
    .references(() => utilities.id),
  inputType: text("input_type", {
    enum: ["MANUAL", "HA", "ESTIMATED"],
  }).notNull(),
  previousReading: real("previous_reading"),
  currentReading: real("current_reading"),
  consumption: real("consumption"),
  appliedRate: real("applied_rate").notNull(),
  totalCost: real("total_cost").notNull(),
  isEstimated: integer("is_estimated", { mode: "boolean" }).default(false),
});

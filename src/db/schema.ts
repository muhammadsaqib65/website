import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }).notNull().default("General"),
  imageUrl: text("image_url").notNull().default(""),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  soldOutDetails: text("sold_out_details"),
  soldOutAt: timestamp("sold_out_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  brandName: varchar("brand_name", { length: 160 }).notNull().default("Riwaayat Studio"),
  tagline: text("tagline").notNull().default("Modern modest wear, handcrafted with heritage."),
  about: text("about").notNull().default("Riwaayat Studio creates premium clothing with timeless style and quality fabrics."),
  contactEmail: varchar("contact_email", { length: 180 }).notNull().default("hello@riwaayatstudio.com"),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull().default("+92 300 0000000"),
  contactAddress: text("contact_address").notNull().default("Lahore, Pakistan"),
  paymentMethods: text("payment_methods")
    .array()
    .notNull()
    .default(["Cash on Delivery", "Bank Transfer", "Card on Delivery"]),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com"),
  whatsappNumber: varchar("whatsapp_number", { length: 30 }).notNull().default("923000000000"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 180 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  address: text("address").notNull(),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name", { length: 180 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  paymentMethod: varchar("payment_method", { length: 80 }).notNull(),
  status: varchar("status", { length: 40 }).notNull().default("placed"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

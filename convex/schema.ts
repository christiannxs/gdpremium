import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
  }),
  
  products: defineTable({
    categoryId: v.id("categories"),
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  }).index("by_category", ["categoryId"]),

  admins: defineTable({
    email: v.string(),
    password: v.string(), // Em um app real, usaríamos hash. Aqui usaremos simples para praticidade inicial.
  }).index("by_email", ["email"]),

  sessions: defineTable({
    adminId: v.id("admins"),
    token: v.string(),
    expires: v.number(),
  }).index("by_token", ["token"]),
});

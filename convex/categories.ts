import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdmin } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const create = mutation({
  args: { name: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");
    
    const existing = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    
    if (existing) return existing._id;
    
    return await ctx.db.insert("categories", { name: args.name });
  },
});

export const update = mutation({
  args: { id: v.id("categories"), name: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");
    return await ctx.db.patch(args.id, { name: args.name });
  },
});

export const remove = mutation({
  args: { id: v.id("categories"), token: v.string() },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");
    
    // Check if category has products
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .first();
    
    if (products) {
      throw new Error("Não é possível excluir uma categoria que possui produtos vinculados.");
    }

    return await ctx.db.delete(args.id);
  },
});

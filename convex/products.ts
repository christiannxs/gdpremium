import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdmin } from "./auth";

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
      
    // Map to include image URL
    return Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageId) {
          imageUrl = await ctx.storage.getUrl(product.imageId);
        }
        return { ...product, imageUrl };
      })
    );
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    
    return Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageId) {
          imageUrl = await ctx.storage.getUrl(product.imageId);
        }
        return { ...product, imageUrl };
      })
    );
  },
});

export const create = mutation({
  args: {
    categoryId: v.id("categories"),
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");
    
    const { token, ...productData } = args;
    return await ctx.db.insert("products", productData);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    categoryId: v.optional(v.id("categories")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");

    const { id, token, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");
    
    if (updates.imageId && existing.imageId && updates.imageId !== existing.imageId) {
      await ctx.storage.delete(existing.imageId);
    }
    
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("products"), token: v.string() },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");

    const product = await ctx.db.get(args.id);
    if (product?.imageId) {
      await ctx.storage.delete(product.imageId);
    }
    return await ctx.db.delete(args.id);
  },
});

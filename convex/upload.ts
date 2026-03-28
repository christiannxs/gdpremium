import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { isAdmin } from "./auth";

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx, args.token))) throw new Error("Não autorizado");
    return await ctx.storage.generateUploadUrl();
  },
});

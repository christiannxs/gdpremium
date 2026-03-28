import { v } from "convex/values";
import { mutation, query, internalQuery, MutationCtx, QueryCtx } from "./_generated/server";

// Função utilitária para gerar um token aleatório
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!admin || admin.password !== args.password) {
      throw new Error("Credenciais inválidas");
    }

    // Criar uma nova sessão
    const token = generateToken();
    const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 dias

    await ctx.db.insert("sessions", {
      adminId: admin._id,
      token,
      expires,
    });

    return { token, email: admin.email };
  },
});

export const checkSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!session || session.expires < Date.now()) {
      return null;
    }

    const admin = await ctx.db.get(session.adminId);
    return admin ? { email: admin.email } : null;
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Mutation para configurar os administradores iniciais
export const setupAdmins = mutation({
  args: { 
    admins: v.array(v.object({ email: v.string(), password: v.string() })) 
  },
  handler: async (ctx, args) => {
    // Apenas permite se não houver admins cadastrados (segurança básica)
    const existing = await ctx.db.query("admins").first();
    if (existing) throw new Error("Administradores já configurados.");

    for (const admin of args.admins) {
      await ctx.db.insert("admins", admin);
    }
    return "Administradores configurados com sucesso!";
  },
});

// Helper para verificar sessão em outras funções
export const isAdmin = async (ctx: QueryCtx | MutationCtx, token: string | undefined) => {
  if (!token) return false;
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  
  return session && session.expires > Date.now();
};

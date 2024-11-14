import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('prompts').collect();
    },
});

export const create = mutation({
    args: {
        request: v.string(),
        response: v.string(),
        source: v.string(),
        in_audio: v.optional(v.string()),
        out_audio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const promptId = await ctx.db.insert('prompts', {
            request: args.request,
            response: args.response,
            source: args.source,
            in_audio: args.in_audio,
            out_audio: args.out_audio,
        });
        return promptId;
    },
});

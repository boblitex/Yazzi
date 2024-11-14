import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // Other tables here...

    prompts: defineTable({
        request: v.string(),
        response: v.string(),
        source: v.string(),
        user: v.string(),
        out_audio: v.optional(v.string()),
        in_audio: v.optional(v.string()),
    }),
});

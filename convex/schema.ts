import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    prompts: defineTable({
        request: v.string(),
        response: v.string(),
        source: v.string(),
        out_audio: v.optional(v.string()),
        in_audio: v.optional(v.string()),
    }),

    audiofiles: defineTable({
        fileName: v.string(),
        publicUrl: v.string(),
        storageId: v.string(),
        uploadedAt: v.string(),
    }),
});

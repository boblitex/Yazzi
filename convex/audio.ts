// convex/audio.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Function to generate upload URL
export const generateUploadUrl = mutation({
  args: {
    fileName: v.string(),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a signed URL for uploading
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
});

// Function to store the file ID and get download URL
export const storeFileId = mutation({
  args: {
    storageId: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a public URL for the file
    const publicUrl = await ctx.storage.getUrl(args.storageId);

    // Store the file info in your database
    const fileId = await ctx.db.insert('audiofiles', {
      storageId: args.storageId,
      fileName: args.fileName,
      publicUrl: publicUrl as string,
      uploadedAt: new Date().toISOString(),
    });

    return { fileId, publicUrl };
  },
});

// Query to get file URL by ID
export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

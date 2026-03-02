import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => ({ userId: "admin" }))
        .onUploadComplete(async ({ metadata, file }) => ({ uploadedBy: metadata.userId })),

    galleryUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 20 } })
        .middleware(async ({ req }) => ({ userId: "admin" }))
        .onUploadComplete(async ({ metadata, file }) => ({ uploadedBy: metadata.userId })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

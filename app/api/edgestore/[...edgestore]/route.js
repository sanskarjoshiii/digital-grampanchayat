import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { requireEnv } from '@/app/utils/env';
import { SESSION_COOKIE, verifySession } from '@/app/utils/session';

// Fail loudly at startup if the EdgeStore keys are missing, instead of
// letting uploads fail later with a cryptic runtime error.
requireEnv('EDGE_STORE_ACCESS_KEY', 'from your EdgeStore project');
requireEnv('EDGE_STORE_SECRET_KEY', 'from your EdgeStore project');

const MB = 1024 * 1024;

const es = initEdgeStore.context().create();

/**
 * This is the main router for the Edge Store buckets.
 *
 * Both buckets are size- and type-capped: without a beforeUpload hook this
 * endpoint accepted an unlimited anonymous upload of any file from anyone on
 * the internet, billed to this project's storage.
 */
export const edgeStoreRouter = es.router({
  // Post media, work photos and documents — a signed-in account is required.
  // ctx.email comes from the httpOnly session cookie, so it cannot be forged
  // by editing localStorage.
  publicFiles: es
    .fileBucket({
      maxSize: 50 * MB,
      accept: ['image/*', 'video/*', 'application/pdf'],
    })
    .beforeUpload(({ ctx }) => ctx?.role === "member"),

  // Profile photos are picked during signup, before the account exists, so this
  // bucket cannot demand a session. Kept images-only and small to limit what an
  // anonymous caller can do with it.
  profileImages: es.imageBucket({ maxSize: 5 * MB }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext: ({ req }) => {
    const session = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    // EdgeStore's API rejects null and empty-string context values, so a signed
    // out visitor gets explicit "guest" sentinels rather than a falsy value.
    return {
      email: session?.email || "guest",
      role: session?.email ? "member" : "guest",
    };
  },
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */

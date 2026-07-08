import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { requireEnv } from '@/app/utils/env';

// Fail loudly at startup if the EdgeStore keys are missing, instead of
// letting uploads fail later with a cryptic runtime error.
requireEnv('EDGE_STORE_ACCESS_KEY', 'from your EdgeStore project');
requireEnv('EDGE_STORE_SECRET_KEY', 'from your EdgeStore project');
 
const es = initEdgeStore.create();
 
/**
 * This is the main router for the Edge Store buckets.
 */
export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});
 
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});
 
export { handler as GET, handler as POST };
 
/**
 * This type is used to create the type-safe client for the frontend.
 */

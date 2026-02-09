/**
 * Supabase Browser Client
 * 
 * For use in Client Components only.
 * Does not import any server-only modules.
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Create Supabase client for browser/client components
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

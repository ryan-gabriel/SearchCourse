/**
 * Supabase Server Client
 * 
 * For use in Server Components, API Routes, and Middleware only.
 * Uses next/headers for cookie handling.
 */

import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

/**
 * Create Supabase client for server components and API routes
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore in read-only contexts (Server Components)
                    }
                },
            },
        }
    );
}

/**
 * Get the currently authenticated user (server-side)
 */
export async function getUser(): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Check if the current user is an admin
 * Admin is determined by `is_admin: true` in user_metadata
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getUser();
    if (!user) return false;

    return user.user_metadata?.is_admin === true;
}

/**
 * Get admin user or null if not authenticated/authorized
 */
export async function getAdminUser(): Promise<User | null> {
    const user = await getUser();
    if (!user) return null;

    // Check for admin claim in user_metadata
    const adminStatus = user.user_metadata?.is_admin === true;

    return adminStatus ? user : null;
}

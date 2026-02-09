/**
 * Rate Limiter
 * 
 * In-memory rate limiting using LRU cache.
 * Suitable for serverless environments with low traffic.
 * For high-traffic production, consider Redis-based solution.
 */

import { LRUCache } from 'lru-cache';

export interface RateLimitConfig {
    /** Maximum requests allowed in the time window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const defaultConfig: RateLimitConfig = {
    limit: 30,
    windowMs: 60 * 1000, // 1 minute
};

// Create separate caches for different endpoints
const caches = new Map<string, LRUCache<string, RateLimitEntry>>();

function getCache(key: string): LRUCache<string, RateLimitEntry> {
    if (!caches.has(key)) {
        caches.set(
            key,
            new LRUCache<string, RateLimitEntry>({
                max: 10000, // Max unique IPs to track
                ttl: 60 * 1000, // Auto-expire after 1 minute
            })
        );
    }
    return caches.get(key)!;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
}

/**
 * Check and update rate limit for a given identifier
 * 
 * @param identifier - Unique identifier (e.g., IP address hash)
 * @param endpoint - Endpoint name for separate limits
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining quota
 */
export function rateLimit(
    identifier: string,
    endpoint: string = 'default',
    config: RateLimitConfig = defaultConfig
): RateLimitResult {
    const cache = getCache(endpoint);
    const now = Date.now();

    let entry = cache.get(identifier);

    // Reset if window expired
    if (!entry || now >= entry.resetTime) {
        entry = {
            count: 0,
            resetTime: now + config.windowMs,
        };
    }

    entry.count++;
    cache.set(identifier, entry);

    const remaining = Math.max(0, config.limit - entry.count);
    const success = entry.count <= config.limit;

    return {
        success,
        limit: config.limit,
        remaining,
        resetTime: entry.resetTime,
    };
}

/**
 * Get rate limit headers for HTTP response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetTime.toString(),
    };
}

/**
 * Pre-configured rate limiters for specific endpoints
 */
export const rateLimiters = {
    search: (identifier: string) =>
        rateLimit(identifier, 'search', {
            limit: parseInt(process.env.RATE_LIMIT_SEARCH || '30', 10),
            windowMs: 60 * 1000,
        }),

    click: (identifier: string) =>
        rateLimit(identifier, 'click', {
            limit: parseInt(process.env.RATE_LIMIT_CLICK || '60', 10),
            windowMs: 60 * 1000,
        }),
};

/**
 * Slug Utilities
 * 
 * Generate and validate URL-safe slugs from titles.
 */

/**
 * Generate a slug from a title
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Handles unicode characters
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
        .replace(/\s+/g, '-')             // Replace spaces
        .replace(/-+/g, '-')              // Remove duplicate hyphens
        .replace(/^-|-$/g, '');           // Trim hyphens
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 200;
}

/**
 * Generate unique slug with suffix if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

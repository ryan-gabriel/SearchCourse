/**
 * Course Validation Schemas
 * 
 * Zod schemas for validating course-related inputs.
 */

import { z } from 'zod';

// Enum values
export const CourseLevelEnum = z.enum([
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'ALL_LEVELS',
]);

export type CourseLevel = z.infer<typeof CourseLevelEnum>;

// ============================================
// NESTED CONTENT SCHEMAS
// ============================================

export const CourseLearningOutcomeSchema = z.object({
    id: z.string().cuid().optional(),
    text: z.string().min(1),
    sortOrder: z.number().int().default(0),
});

export const CourseSyllabusItemSchema = z.object({
    id: z.string().cuid().optional(),
    title: z.string().min(1),
    sortOrder: z.number().int().default(0),
});

export const CourseSyllabusSectionSchema = z.object({
    id: z.string().cuid().optional(),
    title: z.string().min(1),
    duration: z.string().optional(),
    sortOrder: z.number().int().default(0),
    items: z.array(CourseSyllabusItemSchema).default([]),
});

// ============================================
// SEARCH & FILTER
// ============================================

export const CourseSearchSchema = z.object({
    query: z.string().max(200).optional(),
    platform: z.string().max(100).optional(),  // slug-based for SEO
    category: z.string().max(100).optional(),  // slug-based for SEO
    level: CourseLevelEnum.optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    hasDiscount: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(12),
    sortBy: z.enum(['rating', 'price', 'date', 'discount', 'popular']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CourseSearchParams = z.infer<typeof CourseSearchSchema>;

// ============================================
// COURSE CREATE/UPDATE
// ============================================

export const CourseCreateSchema = z.object({
    title: z.string().min(3).max(200),
    slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
    description: z.string().max(10000).optional(),
    shortDescription: z.string().max(320).optional(),
    instructorName: z.string().max(100).optional(),
    instructorBio: z.string().max(5000).optional(),
    thumbnailUrl: z.string().url().optional(),

    originalPrice: z.number().min(0),
    currency: z.string().length(3).default('USD'),

    level: CourseLevelEnum.default('ALL_LEVELS'),
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().min(0).default(0),
    studentCount: z.number().int().min(0).default(0),
    duration: z.string().max(20).optional(),
    lectureCount: z.number().int().min(0).optional(),

    directUrl: z.string().url(),
    affiliateUrl: z.string().url().optional(),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    platformId: z.string().cuid(),
    categoryId: z.string().cuid(),
});

export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;

export const CourseUpdateSchema = CourseCreateSchema.partial().extend({
    id: z.string().cuid(),
});

export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;

// ============================================
// COURSE RESPONSE
// ============================================

export const CourseResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    shortDescription: z.string().nullable(),
    instructorName: z.string().nullable(),
    thumbnailUrl: z.string().nullable(),
    originalPrice: z.number(),
    currency: z.string(),
    level: CourseLevelEnum,
    rating: z.number().nullable(),
    reviewCount: z.number(),
    studentCount: z.number(),
    duration: z.string().nullable(),
    lectureCount: z.number().nullable(),
    directUrl: z.string(),
    affiliateUrl: z.string().nullable(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    lastVerifiedAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),

    // Relations (optional)
    platform: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        logoUrl: z.string().nullable(),
    }).optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }).optional(),
    activeCoupon: z.object({
        id: z.string(),
        code: z.string().nullable(),
        discountValue: z.number(),
        finalPrice: z.number(),
        expiresAt: z.date().nullable(),
    }).optional(),
});

export type CourseResponse = z.infer<typeof CourseResponseSchema>;

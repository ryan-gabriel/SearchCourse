/**
 * Coupon Validation Schemas
 */

import { z } from 'zod';

export const DiscountTypeEnum = z.enum(['PERCENTAGE', 'FIXED']);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

// ============================================
// COUPON CREATE/UPDATE
// ============================================

export const CouponCreateSchema = z.object({
    code: z.string().max(50).optional(),
    discountType: DiscountTypeEnum.default('PERCENTAGE'),
    discountValue: z.number().min(0),
    finalPrice: z.number().min(0),
    expiresAt: z.coerce.date().optional(),
    isActive: z.boolean().default(true),
    source: z.string().max(100).optional(),
    courseId: z.string().cuid(),
});

export type CouponCreateInput = z.infer<typeof CouponCreateSchema>;

export const CouponUpdateSchema = CouponCreateSchema.partial().extend({
    id: z.string().cuid(),
});

export type CouponUpdateInput = z.infer<typeof CouponUpdateSchema>;

// ============================================
// COUPON SEARCH
// ============================================

export const CouponSearchSchema = z.object({
    courseId: z.string().cuid().optional(),
    isActive: z.coerce.boolean().optional(),
    minDiscount: z.coerce.number().min(0).max(100).optional(),
    notExpired: z.coerce.boolean().default(true),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(20),
});

export type CouponSearchParams = z.infer<typeof CouponSearchSchema>;

-- Fix remaining issues - add finalPrice to Coupon table

-- Add finalPrice column with default
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "finalPrice" DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Migration to add missing columns to existing tables while preserving data
-- Run this with: npx prisma db execute --file prisma/migrate_data.sql

-- ============================================
-- COURSE TABLE
-- ============================================

-- Add shortDescription column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "shortDescription" VARCHAR(320);

-- Add originalPrice column with default 0
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "originalPrice" DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add currency column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "currency" VARCHAR(3) NOT NULL DEFAULT 'USD';

-- Add level column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Course' AND column_name = 'level') THEN
        ALTER TABLE "Course" ADD COLUMN "level" "CourseLevel" NOT NULL DEFAULT 'ALL_LEVELS';
    END IF;
END $$;

-- Add duration column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "duration" VARCHAR(255);

-- Add lectureCount column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "lectureCount" INTEGER;

-- Add directUrl column (use slug as placeholder if not exists)
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "directUrl" TEXT;
UPDATE "Course" SET "directUrl" = COALESCE("directUrl", 'https://placeholder.com/' || "slug") WHERE "directUrl" IS NULL OR "directUrl" = '';
ALTER TABLE "Course" ALTER COLUMN "directUrl" SET NOT NULL;

-- Add affiliateUrl column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "affiliateUrl" TEXT;

-- Add lastVerifiedAt column
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add rating column if missing
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "rating" DECIMAL(2, 1);

-- Add reviewCount column if missing  
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- Add studentCount column if missing
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "studentCount" INTEGER NOT NULL DEFAULT 0;

-- ============================================
-- COUPON TABLE
-- ============================================

-- Add discountValue column with default
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "discountValue" DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add discountType column
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "discountType" VARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE';

-- Add source column
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "source" VARCHAR(255);

-- Add verifiedAt column
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ============================================
-- PLATFORM TABLE
-- ============================================

-- Add baseUrl column
ALTER TABLE "Platform" ADD COLUMN IF NOT EXISTS "baseUrl" TEXT;
UPDATE "Platform" SET "baseUrl" = COALESCE("baseUrl", 'https://' || LOWER("slug") || '.com') WHERE "baseUrl" IS NULL OR "baseUrl" = '';
ALTER TABLE "Platform" ALTER COLUMN "baseUrl" SET NOT NULL;

-- Add isActive column to Platform if missing
ALTER TABLE "Platform" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- ============================================
-- CATEGORY TABLE
-- ============================================

-- Add iconName column
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "iconName" VARCHAR(100);

-- Add sortOrder column  
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- ============================================
-- ADMIN USER TABLE
-- ============================================

-- Remove supabaseId unique constraint if exists and column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AdminUser' AND column_name = 'supabaseId') THEN
        -- Drop any unique constraint on supabaseId
        ALTER TABLE "AdminUser" DROP CONSTRAINT IF EXISTS "AdminUser_supabaseId_key";
        -- Drop the column
        ALTER TABLE "AdminUser" DROP COLUMN "supabaseId";
    END IF;
END $$;

-- ============================================
-- ADD MISSING INDEXES (only if they don't exist)
-- ============================================

-- Course indexes
CREATE INDEX IF NOT EXISTS "Course_title_idx" ON "Course"("title");
CREATE INDEX IF NOT EXISTS "Course_rating_idx" ON "Course"("rating" DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS "Course_createdAt_idx" ON "Course"("createdAt" DESC);

-- Platform indexes
CREATE INDEX IF NOT EXISTS "Platform_slug_idx" ON "Platform"("slug");
CREATE INDEX IF NOT EXISTS "Platform_isActive_idx" ON "Platform"("isActive");

-- Category indexes
CREATE INDEX IF NOT EXISTS "Category_slug_idx" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_sortOrder_idx" ON "Category"("sortOrder");

-- Coupon indexes  
CREATE INDEX IF NOT EXISTS "Coupon_discountValue_idx" ON "Coupon"("discountValue" DESC);

-- ClickEvent indexes (only if columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClickEvent' AND column_name = 'source') THEN
        CREATE INDEX IF NOT EXISTS "ClickEvent_source_idx" ON "ClickEvent"("source");
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClickEvent' AND column_name = 'country') THEN
        CREATE INDEX IF NOT EXISTS "ClickEvent_country_idx" ON "ClickEvent"("country");
    END IF;
END $$;

-- Roadmap indexes (only if table and columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Roadmap') THEN
        CREATE INDEX IF NOT EXISTS "Roadmap_slug_idx" ON "Roadmap"("slug");
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Roadmap' AND column_name = 'sortOrder') THEN
            CREATE INDEX IF NOT EXISTS "Roadmap_sortOrder_idx" ON "Roadmap"("sortOrder");
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Roadmap' AND column_name = 'isActive') 
           AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Roadmap' AND column_name = 'isFeatured') THEN
            CREATE INDEX IF NOT EXISTS "Roadmap_isActive_isFeatured_idx" ON "Roadmap"("isActive", "isFeatured");
        END IF;
    END IF;
END $$;

-- RoadmapStep indexes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'RoadmapStep') THEN
        CREATE INDEX IF NOT EXISTS "RoadmapStep_courseId_idx" ON "RoadmapStep"("courseId");
    END IF;
END $$;

-- AdminUser indexes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AdminUser' AND column_name = 'isActive') THEN
        CREATE INDEX IF NOT EXISTS "AdminUser_isActive_idx" ON "AdminUser"("isActive");
    END IF;
END $$;

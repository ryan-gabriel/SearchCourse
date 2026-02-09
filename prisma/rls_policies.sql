-- ============================================
-- Row Level Security (RLS) Policies
-- SearchCourse - Public Read / Admin Write
-- ============================================
-- 
-- This migration enables RLS on all public schema tables and creates
-- policies for "Public Read / Admin Write" access control.
--
-- Admin is determined by: auth.jwt() -> 'user_metadata' ->> 'is_admin' = 'true'
-- ============================================

-- Drop existing table if exists (for migration)
DROP TABLE IF EXISTS "AdminUser" CASCADE;

-- ============================================
-- Helper Function: Check Admin Status
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ============================================
-- Enable RLS on All Tables
-- ============================================

ALTER TABLE "Platform" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Roadmap" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoadmapStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClickEvent" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Drop Existing Policies (if any)
-- ============================================

DROP POLICY IF EXISTS "Allow public select" ON "Platform";
DROP POLICY IF EXISTS "Admin insert" ON "Platform";
DROP POLICY IF EXISTS "Admin update" ON "Platform";
DROP POLICY IF EXISTS "Admin delete" ON "Platform";

DROP POLICY IF EXISTS "Allow public select" ON "Category";
DROP POLICY IF EXISTS "Admin insert" ON "Category";
DROP POLICY IF EXISTS "Admin update" ON "Category";
DROP POLICY IF EXISTS "Admin delete" ON "Category";

DROP POLICY IF EXISTS "Allow public select" ON "Course";
DROP POLICY IF EXISTS "Admin insert" ON "Course";
DROP POLICY IF EXISTS "Admin update" ON "Course";
DROP POLICY IF EXISTS "Admin delete" ON "Course";

DROP POLICY IF EXISTS "Allow public select" ON "Coupon";
DROP POLICY IF EXISTS "Admin insert" ON "Coupon";
DROP POLICY IF EXISTS "Admin update" ON "Coupon";
DROP POLICY IF EXISTS "Admin delete" ON "Coupon";

DROP POLICY IF EXISTS "Allow public select" ON "Roadmap";
DROP POLICY IF EXISTS "Admin insert" ON "Roadmap";
DROP POLICY IF EXISTS "Admin update" ON "Roadmap";
DROP POLICY IF EXISTS "Admin delete" ON "Roadmap";

DROP POLICY IF EXISTS "Allow public select" ON "RoadmapStep";
DROP POLICY IF EXISTS "Admin insert" ON "RoadmapStep";
DROP POLICY IF EXISTS "Admin update" ON "RoadmapStep";
DROP POLICY IF EXISTS "Admin delete" ON "RoadmapStep";

DROP POLICY IF EXISTS "Allow public select" ON "ClickEvent";
DROP POLICY IF EXISTS "Allow click tracking" ON "ClickEvent";
DROP POLICY IF EXISTS "Admin delete" ON "ClickEvent";

-- ============================================
-- SELECT Policies (Public Read)
-- ============================================

CREATE POLICY "Allow public select" ON "Platform"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "Category"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "Course"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "Coupon"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "Roadmap"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "RoadmapStep"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public select" ON "ClickEvent"
    FOR SELECT
    USING (true);

-- ============================================
-- INSERT Policies (Admin Write)
-- ============================================

CREATE POLICY "Admin insert" ON "Platform"
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin insert" ON "Category"
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin insert" ON "Course"
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin insert" ON "Coupon"
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin insert" ON "Roadmap"
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin insert" ON "RoadmapStep"
    FOR INSERT
    WITH CHECK (is_admin());

-- ClickEvent allows insert from anyone (for analytics tracking)
CREATE POLICY "Allow click tracking" ON "ClickEvent"
    FOR INSERT
    WITH CHECK (true);

-- ============================================
-- UPDATE Policies (Admin Only)
-- ============================================

CREATE POLICY "Admin update" ON "Platform"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin update" ON "Category"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin update" ON "Course"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin update" ON "Coupon"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin update" ON "Roadmap"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin update" ON "RoadmapStep"
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- DELETE Policies (Admin Only)
-- ============================================

CREATE POLICY "Admin delete" ON "Platform"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "Category"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "Course"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "Coupon"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "Roadmap"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "RoadmapStep"
    FOR DELETE
    USING (is_admin());

CREATE POLICY "Admin delete" ON "ClickEvent"
    FOR DELETE
    USING (is_admin());

-- ============================================
-- Verification Query (run to check status)
-- ============================================
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public';

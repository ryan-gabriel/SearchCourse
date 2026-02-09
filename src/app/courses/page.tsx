/**
 * Courses Page
 * 
 * Course catalog with working URL-based filters and responsive grid.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SlidersHorizontal, X, Star } from 'lucide-react';
import { SortDropdown } from './SortDropdown';
import { CourseGrid } from '@/components/course';
import { CourseGridSkeleton } from '@/components/ui/Skeleton';
import { searchCourses, getAllPlatforms, getAllCategories } from '@/services';
import { CourseSearchSchema } from '@/validations';

export const metadata: Metadata = {
    title: 'Browse Courses',
    description:
        'Discover thousands of online courses with verified discounts. Filter by platform, category, and price to find your perfect course.',
    openGraph: {
        title: 'Browse Courses | SearchCourse',
        description:
            'Discover thousands of online courses with verified discounts.',
    },
};

// Revalidate every 5 minutes
export const revalidate = 300;

interface CoursesPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Types for filters
interface Platform {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    _count?: { courses: number };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconName: string | null;
    sortOrder: number;
    _count?: { courses: number };
}

// Helper to build filter URL
function buildFilterUrl(
    currentParams: Record<string, string | undefined>,
    updates: Record<string, string | undefined>
): string {
    const params = new URLSearchParams();

    // Merge current params with updates
    const merged = { ...currentParams, ...updates };

    // Remove undefined/empty values
    Object.entries(merged).forEach(([key, value]) => {
        if (value && value !== '') {
            params.set(key, value);
        }
    });

    const queryString = params.toString();
    return queryString ? `/courses?${queryString}` : '/courses';
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
    const params = await searchParams;

    // Transform search params for validation
    const rawParams: Record<string, unknown> = {};
    const currentFilters: Record<string, string | undefined> = {};

    for (const [key, value] of Object.entries(params)) {
        const val = Array.isArray(value) ? value[0] : value;
        rawParams[key] = val;
        currentFilters[key] = val;
    }

    const parseResult = CourseSearchSchema.safeParse(rawParams);
    const validParams = parseResult.success ? parseResult.data : {
        page: 1,
        limit: 12,
        sortBy: 'date' as const,
        sortOrder: 'desc' as const,
    };

    // Fetch data in parallel
    const [coursesResult, platforms, categories] = await Promise.all([
        searchCourses(validParams),
        getAllPlatforms().catch((): Platform[] => []),
        getAllCategories().catch((): Category[] => []),
    ]) as [Awaited<ReturnType<typeof searchCourses>>, Platform[], Category[]];

    // Active filters display
    const activeFilters: { label: string; clearUrl: string }[] = [];

    if (validParams.platform) {
        const platformMatch = platforms.find(p => p.slug === validParams.platform);
        activeFilters.push({
            label: `Platform: ${platformMatch?.name || validParams.platform}`,
            clearUrl: buildFilterUrl(currentFilters, { platform: undefined, page: '1' }),
        });
    }

    if (validParams.category) {
        const categoryMatch = categories.find(c => c.slug === validParams.category);
        activeFilters.push({
            label: `Category: ${categoryMatch?.name || validParams.category}`,
            clearUrl: buildFilterUrl(currentFilters, { category: undefined, page: '1' }),
        });
    }

    if (validParams.minRating) {
        activeFilters.push({
            label: `${validParams.minRating}+ Stars`,
            clearUrl: buildFilterUrl(currentFilters, { minRating: undefined, page: '1' }),
        });
    }

    if (validParams.hasDiscount) {
        activeFilters.push({
            label: 'Has Discount',
            clearUrl: buildFilterUrl(currentFilters, { hasDiscount: undefined, page: '1' }),
        });
    }

    if (validParams.query) {
        activeFilters.push({
            label: `Search: "${validParams.query}"`,
            clearUrl: buildFilterUrl(currentFilters, { query: undefined, page: '1' }),
        });
    }

    // Sort options
    const sortOptions = [
        { value: 'date-desc', label: 'Newest First' },
        { value: 'date-asc', label: 'Oldest First' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating-desc', label: 'Highest Rated' },
        { value: 'discount-desc', label: 'Best Discounts' },
    ];

    const currentSort = `${validParams.sortBy || 'date'}-${validParams.sortOrder || 'desc'}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Page Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Browse All Courses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Explore curated courses in tech, design, and business with verified discounts.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1980px] w-full mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Filter Header */}
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Filters
                                </h2>
                                {activeFilters.length > 0 && (
                                    <Link
                                        href="/courses"
                                        className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear all
                                    </Link>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Category
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={buildFilterUrl(currentFilters, {
                                                category: validParams.category === cat.slug ? undefined : cat.slug,
                                                page: '1'
                                            })}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${validParams.category === cat.slug
                                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {cat.name}
                                            <span className="ml-2 text-xs text-gray-400">
                                                ({cat._count?.courses ?? 0})
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Platforms */}
                            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Platform
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {platforms.map((plat) => (
                                        <Link
                                            key={plat.id}
                                            href={buildFilterUrl(currentFilters, {
                                                platform: validParams.platform === plat.slug ? undefined : plat.slug,
                                                page: '1'
                                            })}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${validParams.platform === plat.slug
                                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {plat.name}
                                            <span className="ml-2 text-xs text-gray-400">
                                                ({plat._count?.courses ?? 0})
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Minimum Rating
                                </h3>
                                <div className="space-y-2">
                                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                        <Link
                                            key={rating}
                                            href={buildFilterUrl(currentFilters, {
                                                minRating: validParams.minRating === rating ? undefined : String(rating),
                                                page: '1'
                                            })}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${validParams.minRating === rating
                                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(rating)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span>{rating}+ & up</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Filter */}
                            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <Link
                                    href={buildFilterUrl(currentFilters, {
                                        hasDiscount: validParams.hasDiscount ? undefined : 'true',
                                        page: '1'
                                    })}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${validParams.hasDiscount
                                        ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${validParams.hasDiscount
                                        ? 'bg-green-600 border-green-600'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {validParams.hasDiscount && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    On Sale Only
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {coursesResult.pagination.total.toLocaleString()}
                                </span>
                                {' '}courses found
                            </p>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                                <SortDropdown
                                    currentSort={currentSort}
                                    options={sortOptions}
                                    currentFilters={currentFilters}
                                />
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex items-center gap-2 mb-6 flex-wrap">
                                {activeFilters.map((filter, index) => (
                                    <Link
                                        key={index}
                                        href={filter.clearUrl}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        {filter.label}
                                        <X className="w-3.5 h-3.5" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Course Grid - More spacious */}
                        <Suspense fallback={<CourseGridSkeleton count={12} />}>
                            {coursesResult.data.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {coursesResult.data.map((course) => (
                                        <div key={course.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                                            {/* Thumbnail */}
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                                                {course.thumbnailUrl ? (
                                                    <img
                                                        src={course.thumbnailUrl}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                                {course.activeCoupon && (
                                                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                                                        {Math.round(Number(course.activeCoupon.discountValue))}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
                                                    {course.platform.name}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                                                    <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                        {course.title}
                                                    </Link>
                                                </h3>
                                                {course.instructorName && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        {course.instructorName}
                                                    </p>
                                                )}

                                                {/* Rating */}
                                                {course.rating && (
                                                    <div className="flex items-center gap-1 mb-3">
                                                        <span className="font-semibold text-amber-600 text-sm">
                                                            {Number(course.rating).toFixed(1)}
                                                        </span>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3.5 h-3.5 ${i < Math.floor(Number(course.rating))
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'fill-gray-200 text-gray-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-gray-400">
                                                            ({course.reviewCount.toLocaleString()})
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Price */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {course.activeCoupon
                                                            ? Number(course.activeCoupon.finalPrice) === 0
                                                                ? 'Free'
                                                                : `$${Number(course.activeCoupon.finalPrice).toFixed(2)}`
                                                            : `$${Number(course.originalPrice).toFixed(2)}`
                                                        }
                                                    </span>
                                                    {course.activeCoupon && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${Number(course.originalPrice).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No courses found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Try adjusting your filters or search terms.
                                    </p>
                                    <Link
                                        href="/courses"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Clear all filters
                                    </Link>
                                </div>
                            )}
                        </Suspense>

                        {/* Pagination */}
                        {coursesResult.pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                {validParams.page > 1 && (
                                    <Link
                                        href={buildFilterUrl(currentFilters, { page: String(validParams.page - 1) })}
                                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Previous
                                    </Link>
                                )}

                                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                    Page {coursesResult.pagination.page} of {coursesResult.pagination.totalPages}
                                </span>

                                {coursesResult.pagination.hasNext && (
                                    <Link
                                        href={buildFilterUrl(currentFilters, { page: String(validParams.page + 1) })}
                                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

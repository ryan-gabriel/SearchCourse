/**
 * Roadmaps List Page
 * 
 * Displays all active roadmaps with minimalist card-based UI.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Map, Clock, BookOpen, ArrowRight, Award } from 'lucide-react';
import { searchRoadmaps, getRoadmapBySlug, getAllCategories } from '@/services';
import { RoadmapFilters } from '@/components/roadmap/RoadmapFilters';
import { formatPrice } from '@/lib/utils';
const VALID_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
type ValidLevel = (typeof VALID_LEVELS)[number];

interface RoadmapsPageProps {
    searchParams: Promise<{
        q?: string;
        level?: string;
        category?: string;
    }>;
}

export const metadata: Metadata = {
    title: 'Learning Roadmaps - Curated Course Paths',
    description:
        'Follow curated learning paths to master new skills. Save money with bundled course discounts and track your progress.',
    keywords: [
        'learning roadmap',
        'course path',
        'skill development',
        'career roadmap',
        'programming roadmap',
        'web development path',
    ],
    openGraph: {
        title: 'Learning Roadmaps | SearchCourse',
        description: 'Follow curated learning paths to master new skills with the best course deals.',
    },
};

// Revalidate every hour for ISR
export const revalidate = 3600;

export default async function RoadmapsPage(props: RoadmapsPageProps) {
    const searchParams = await props.searchParams;

    // Parse filters
    const levelKey = searchParams.level?.toUpperCase();
    const level = (levelKey && (VALID_LEVELS as readonly string[]).includes(levelKey)) ? (levelKey as ValidLevel) : undefined;

    const filters = {
        q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
        level,
        category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
        isActive: true,
        page: 1,
        limit: 50,
    };

    // Fetch data in parallel
    const [categories, { data: roadmaps }] = await Promise.all([
        getAllCategories().catch(() => [] as Awaited<ReturnType<typeof getAllCategories>>),
        searchRoadmaps(filters)
    ]);

    // Fetch savings for each roadmap (in parallel)
    const roadmapsWithSavings = await Promise.all(
        roadmaps.map(async (roadmap) => {
            try {
                const details = await getRoadmapBySlug(roadmap.slug);
                return {
                    ...roadmap,
                    totalSavings: details?.totalSavings ?? 0,
                    estimatedHours: details?.estimatedHours ?? roadmap.estimatedHours,
                };
            } catch {
                return { ...roadmap, totalSavings: 0 };
            }
        })
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Career Roadmaps
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Step-by-step paths to master a new career.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form className="relative max-w-md w-full">
                            <input
                                type="text"
                                name="q"
                                defaultValue={searchParams.q}
                                placeholder="Search roadmaps (e.g. Frontend, DevOps)..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-500">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <RoadmapFilters searchParams={searchParams} categories={categories} />

                    {/* Results Grid */}
                    <div className="flex-1">
                        {roadmapsWithSavings.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {roadmapsWithSavings.map((roadmap) => (
                                    <Link
                                        key={roadmap.id}
                                        href={`/roadmaps/${roadmap.slug}`}
                                        className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
                                    >
                                        {/* Icon & Title */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                <Map className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {roadmap.title}
                                                </h3>
                                                {roadmap.description && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {roadmap.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Metadata Badges */}
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {roadmap.courseCount} Courses
                                            </span>
                                            {roadmap.estimatedHours && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    ~{roadmap.estimatedHours}h
                                                </span>
                                            )}
                                            {roadmap.isFeatured && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                                                    <Award className="w-3.5 h-3.5" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Savings */}
                                        {roadmap.totalSavings > 0 && (
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Bundle Savings
                                                </span>
                                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    Save {formatPrice(roadmap.totalSavings, 'USD')}
                                                </span>
                                            </div>
                                        )}

                                        {/* Arrow indicator */}
                                        <div className="mt-4 flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Path
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                                <Map className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No roadmaps found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Try adjusting your filters or search query.
                                </p>
                                <Link href="/roadmaps" className="text-blue-600 hover:underline">
                                    Clear all filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Not sure which path to take?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Browse our full course catalog and create your own learning journey.
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Browse All Courses
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

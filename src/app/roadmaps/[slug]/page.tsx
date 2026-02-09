/**
 * Roadmap Detail Page
 * 
 * Vertical timeline UI showing courses in a learning path.
 * No user tracking - just displays the roadmap structure.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Clock,
    BookOpen,
    CheckCircle,
    Star,
    ExternalLink,
    ArrowRight,
    Zap,
    Target,
    ChevronRight,
    DollarSign
} from 'lucide-react';
import { getRoadmapBySlug } from '@/services';
import { formatPrice } from '@/lib/utils';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const roadmap = await getRoadmapBySlug(slug);

    if (!roadmap) {
        return {
            title: 'Roadmap Not Found',
        };
    }

    const title = `${roadmap.title} - Learning Roadmap`;
    const description = roadmap.description ||
        `Master ${roadmap.title.toLowerCase()} with this ${roadmap.courseCount}-course learning path. Save ${formatPrice(roadmap.totalSavings, 'USD')} with bundled discounts.`;

    return {
        title,
        description,
        keywords: [
            roadmap.title.toLowerCase(),
            'learning roadmap',
            'course path',
            'skill development',
            'online courses',
        ],
        openGraph: {
            title: `${title} | SearchCourse`,
            description,
        },
    };
}

// Revalidate every hour
export const revalidate = 3600;

const VALUE_PROPS = [
    {
        icon: CheckCircle,
        title: 'Top Rated',
        description: 'Curated from 4.5+ star courses only.',
        color: 'blue',
    },
    {
        icon: Zap,
        title: 'Structured Path',
        description: 'Logical flow, no missing concepts.',
        color: 'purple',
    },
    {
        icon: Target,
        title: 'Best Value',
        description: 'Affiliate discounts applied.',
        color: 'green',
    },
];

export default async function RoadmapDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const roadmap = await getRoadmapBySlug(slug);

    if (!roadmap) {
        notFound();
    }

    const hasSteps = roadmap.steps.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link
                            href="/roadmaps"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Roadmaps
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600 dark:text-blue-400 font-medium truncate">
                            {roadmap.title}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Left Column - Roadmap Info */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                {roadmap.title}
                            </h1>

                            {roadmap.description && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                    {roadmap.description}
                                </p>
                            )}

                            {/* Metadata Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                                    <BookOpen className="w-4 h-4" />
                                    {roadmap.courseCount} Courses
                                </span>
                                {roadmap.estimatedHours && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                        <Clock className="w-4 h-4" />
                                        ~{roadmap.estimatedHours} Hours
                                    </span>
                                )}
                                {roadmap.totalSavings > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300">
                                        <DollarSign className="w-4 h-4" />
                                        Save {formatPrice(roadmap.totalSavings, 'USD')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Value Props */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-12">
                            {VALUE_PROPS.map((prop) => (
                                <div
                                    key={prop.title}
                                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                                >
                                    <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${prop.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950/50' :
                                            prop.color === 'purple' ? 'bg-purple-100 dark:bg-purple-950/50' :
                                                'bg-green-100 dark:bg-green-950/50'
                                        }`}>
                                        <prop.icon className={`w-5 h-5 ${prop.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                                prop.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                                    'text-green-600 dark:text-green-400'
                                            }`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {prop.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {prop.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Course Timeline */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Learning Path
                            </h2>

                            {hasSteps ? (
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-800" />

                                    {/* Steps */}
                                    <div className="space-y-6">
                                        {roadmap.steps.map((step, index) => {
                                            const course = step.course;
                                            const hasDiscount = course.activeCoupon !== null;
                                            const finalPrice = hasDiscount
                                                ? course.activeCoupon!.finalPrice
                                                : course.originalPrice;

                                            return (
                                                <div key={step.id} className="relative flex gap-4">
                                                    {/* Step Number */}
                                                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                                                        {index + 1}
                                                    </div>

                                                    {/* Step Card */}
                                                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            {/* Thumbnail */}
                                                            {course.thumbnailUrl && (
                                                                <div className="sm:w-32 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                                    <img
                                                                        src={course.thumbnailUrl}
                                                                        alt={course.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                                                    {course.title}
                                                                </h3>

                                                                {course.instructorName && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                                        by {course.instructorName}
                                                                    </p>
                                                                )}

                                                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                                                    {/* Platform */}
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        {course.platform.name}
                                                                    </span>

                                                                    {/* Duration */}
                                                                    {course.duration && (
                                                                        <span className="text-gray-500 dark:text-gray-400">
                                                                            {course.duration}
                                                                        </span>
                                                                    )}

                                                                    {/* Rating */}
                                                                    {course.rating && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                                {Number(course.rating).toFixed(1)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Price & CTA */}
                                                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                                                                <div className="text-right">
                                                                    <div className="font-bold text-gray-900 dark:text-white">
                                                                        {finalPrice === 0 ? 'Free' : formatPrice(finalPrice, 'USD')}
                                                                    </div>
                                                                    {hasDiscount && (
                                                                        <div className="text-sm text-gray-400 line-through">
                                                                            {formatPrice(Number(course.originalPrice), 'USD')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Link
                                                                    href={`/courses/${course.slug}`}
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                                >
                                                                    View
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Courses Coming Soon
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        This roadmap is being curated. Check back soon!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                {/* Roadmap Summary */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        Path Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Total Courses</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {roadmap.courseCount}
                                            </span>
                                        </div>
                                        {roadmap.estimatedHours && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Est. Duration</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {roadmap.estimatedHours} Hours
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Total Cost</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(roadmap.totalDiscountedPrice, 'USD')}
                                            </span>
                                        </div>
                                        {roadmap.totalSavings > 0 && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">You Save</span>
                                                <span className="font-medium text-green-600 dark:text-green-400">
                                                    {formatPrice(roadmap.totalSavings, 'USD')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="p-6">
                                    {hasSteps && roadmap.steps[0] && (
                                        <Link
                                            href={`/courses/${roadmap.steps[0].course.slug}`}
                                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                        >
                                            Start with Step 1
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>

                                {/* Back to list */}
                                <div className="px-6 pb-6">
                                    <Link
                                        href="/roadmaps"
                                        className="block text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        ← Browse all roadmaps
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {roadmap.courseCount} courses · {formatPrice(roadmap.totalDiscountedPrice, 'USD')}
                        </p>
                        {roadmap.totalSavings > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                Save {formatPrice(roadmap.totalSavings, 'USD')}
                            </p>
                        )}
                    </div>
                    {hasSteps && roadmap.steps[0] && (
                        <Link
                            href={`/courses/${roadmap.steps[0].course.slug}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Start
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

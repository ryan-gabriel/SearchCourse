/**
 * Roadmap Card Component
 * 
 * Card for displaying roadmap in list view.
 */

import Link from 'next/link';
import { Map, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapCardProps {
    roadmap: {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        iconName: string | null;
        estimatedHours: number | null;
        courseCount: number;
        isFeatured: boolean;
    };
    totalSavings?: number;
}

export function RoadmapCard({ roadmap, totalSavings = 0 }: RoadmapCardProps) {
    return (
        <Link
            href={`/roadmaps/${roadmap.slug}`}
            className={cn(
                'group relative block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden',
                'shadow-lg hover:shadow-2xl transition-all duration-300',
                'border border-gray-100 dark:border-gray-700',
                'hover:border-indigo-200 dark:hover:border-indigo-800',
                'hover:-translate-y-1'
            )}
        >
            {/* Featured Badge */}
            {roadmap.isFeatured && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Featured
                    </span>
                </div>
            )}

            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-end">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -bottom-6 left-6">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Map className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-10">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {roadmap.title}
                </h3>

                {roadmap.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {roadmap.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span>{roadmap.courseCount} Courses</span>
                    </div>
                    {roadmap.estimatedHours && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>{roadmap.estimatedHours}h</span>
                        </div>
                    )}
                </div>

                {/* Savings Badge */}
                {totalSavings > 0 && (
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                            <Sparkles className="w-3 h-3" />
                            Save ${totalSavings.toFixed(0)} today
                        </span>
                    </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        View Roadmap
                    </span>
                    <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}

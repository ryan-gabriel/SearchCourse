/**
 * Course Card Component
 * 
 * High-conversion course card with pricing, ratings, and CTA.
 * All clickable elements point to affiliate redirect API.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Clock, ExternalLink, Copy, Check } from 'lucide-react';
import { cn, formatPrice, calculateDiscountPercentage, formatCompactNumber } from '@/lib/utils';
import type { CourseWithDetails } from '@/services';

interface CourseCardProps {
    course: CourseWithDetails;
}

export function CourseCard({ course }: CourseCardProps) {
    const [copied, setCopied] = useState(false);

    const hasDiscount = course.activeCoupon !== null;
    const finalPrice = hasDiscount
        ? course.activeCoupon!.finalPrice
        : course.originalPrice;
    const discountPercent = hasDiscount
        ? calculateDiscountPercentage(course.originalPrice, finalPrice)
        : 0;

    const affiliateUrl = `/api/out/${course.id}`;

    const handleRevealDeal = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Copy coupon code if available
        if (course.activeCoupon?.code) {
            await navigator.clipboard.writeText(course.activeCoupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }

        // Open affiliate link in new tab
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <article className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-1">
            {/* Discount Badge */}
            {hasDiscount && discountPercent > 0 && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg">
                        {discountPercent}% OFF
                    </span>
                </div>
            )}

            {/* Thumbnail */}
            <Link href={affiliateUrl} target="_blank" className="block relative h-44 overflow-hidden">
                {course.thumbnailUrl ? (
                    <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold opacity-50">
                            {course.title.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <div className="p-5">
                {/* Platform Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        {course.platform.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {course.category.name}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                    <Link
                        href={affiliateUrl}
                        target="_blank"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        {course.title}
                    </Link>
                </h3>

                {/* Instructor */}
                {course.instructorName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                        by {course.instructorName}
                    </p>
                )}

                {/* Rating and Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                    {course.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {course.rating.toFixed(1)}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">
                                ({formatCompactNumber(course.reviewCount)})
                            </span>
                        </div>
                    )}
                    {course.studentCount > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{formatCompactNumber(course.studentCount)}</span>
                        </div>
                    )}
                    {course.duration && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                        </div>
                    )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {finalPrice === 0 ? 'FREE' : formatPrice(finalPrice, course.currency)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(course.originalPrice, course.currency)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleRevealDeal}
                        className={cn(
                            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
                            'hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25',
                            'active:scale-95'
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                {course.activeCoupon?.code ? (
                                    <Copy className="w-4 h-4" />
                                ) : (
                                    <ExternalLink className="w-4 h-4" />
                                )}
                                Get Deal
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}

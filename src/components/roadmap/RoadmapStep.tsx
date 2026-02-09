/**
 * Roadmap Step Component
 * 
 * Individual step in a roadmap with course info and progress checkbox.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Check, ExternalLink, Copy, CheckCircle2, Circle } from 'lucide-react';
import { cn, formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { RoadmapStepWithCourse } from '@/services/roadmap.service';

interface RoadmapStepProps {
    step: RoadmapStepWithCourse;
    stepNumber: number;
    totalSteps: number;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function RoadmapStep({
    step,
    stepNumber,
    totalSteps,
    isCompleted,
    onToggleComplete,
}: RoadmapStepProps) {
    const [copied, setCopied] = useState(false);

    const { course } = step;
    const hasDiscount = course.activeCoupon !== null;
    const finalPrice = hasDiscount ? course.activeCoupon!.finalPrice : course.originalPrice;
    const discountPercent = hasDiscount
        ? calculateDiscountPercentage(course.originalPrice, finalPrice)
        : 0;

    const affiliateUrl = `/api/out/${course.id}`;

    const handleRevealDeal = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (course.activeCoupon?.code) {
            await navigator.clipboard.writeText(course.activeCoupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }

        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={cn(
                'relative flex gap-4 md:gap-6',
                stepNumber < totalSteps && 'pb-8'
            )}
        >
            {/* Step indicator and connector line */}
            <div className="flex flex-col items-center">
                {/* Checkbox/Step Number */}
                <button
                    onClick={onToggleComplete}
                    className={cn(
                        'relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center',
                        'border-2 transition-all duration-300',
                        isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600'
                    )}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    {isCompleted ? (
                        <Check className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                        <span className="font-bold text-sm md:text-base">{stepNumber}</span>
                    )}
                </button>

                {/* Connector line */}
                {stepNumber < totalSteps && (
                    <div
                        className={cn(
                            'flex-1 w-0.5 mt-2 rounded-full',
                            isCompleted
                                ? 'bg-gradient-to-b from-emerald-500 to-emerald-300'
                                : 'bg-gray-200 dark:bg-gray-700'
                        )}
                    />
                )}
            </div>

            {/* Course Card */}
            <div
                className={cn(
                    'flex-1 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden',
                    'shadow-md hover:shadow-xl transition-all duration-300',
                    'border border-gray-100 dark:border-gray-700',
                    isCompleted && 'opacity-75'
                )}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <Link
                        href={affiliateUrl}
                        target="_blank"
                        className="relative w-full md:w-48 h-32 md:h-auto flex-shrink-0 overflow-hidden"
                    >
                        {course.thumbnailUrl ? (
                            <Image
                                src={course.thumbnailUrl}
                                alt={course.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, 200px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-3xl font-bold opacity-50">
                                    {course.title.charAt(0)}
                                </span>
                            </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && discountPercent > 0 && (
                            <div className="absolute top-2 left-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                                    {discountPercent}% OFF
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 p-4 md:p-5">
                        {/* Step Title */}
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">
                            Step {stepNumber}: {step.title}
                        </p>

                        {/* Course Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            <Link
                                href={affiliateUrl}
                                target="_blank"
                                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                {course.title}
                            </Link>
                        </h3>

                        {/* Course Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                {course.platform.name}
                            </span>
                            {course.rating && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span>{course.rating.toFixed(1)}</span>
                                </div>
                            )}
                            {course.duration && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                </div>
                            )}
                        </div>

                        {/* Step Description */}
                        {step.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {step.description}
                            </p>
                        )}

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {finalPrice === 0 ? 'FREE' : formatPrice(finalPrice, 'USD')}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatPrice(course.originalPrice, 'USD')}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleRevealDeal}
                                className={cn(
                                    'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
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
                </div>
            </div>
        </div>
    );
}

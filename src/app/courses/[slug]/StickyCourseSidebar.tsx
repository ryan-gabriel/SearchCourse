/**
 * Sticky Course Sidebar Component
 * 
 * Fixed CTA sidebar with pricing, urgency timer, and course includes.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Timer,
    PlayCircle,
    FileText,
    Code,
    Download,
    Smartphone,
    Trophy,
    ArrowRight,
    Building2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CourseWithDetails } from '@/services';

interface StickyCourseSidebarProps {
    course: CourseWithDetails;
    finalPrice: number;
    originalPrice: number;
    discountPercent: number;
    affiliateUrl: string;
}

export function StickyCourseSidebar({
    course,
    finalPrice,
    originalPrice,
    discountPercent,
    affiliateUrl,
}: StickyCourseSidebarProps) {
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const hasDiscount = discountPercent > 0;

    useEffect(() => {
        const expiresAt = course.activeCoupon?.expiresAt;
        if (!expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(expiresAt).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            // Format accordingly, e.g., "2d 4h" or "04h 30m"
            if (hours >= 24) {
                const days = Math.floor(hours / 24);
                setTimeLeft(`${days} days left`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [course.activeCoupon]);

    const courseIncludes = [
        ...(course.duration ? [{ icon: PlayCircle, text: `${course.duration} on-demand video` }] : []),
        ...(course.lectureCount ? [{ icon: FileText, text: `${course.lectureCount} lectures` }] : []),
        { icon: Download, text: 'Full Lifetime Access' },
        { icon: Smartphone, text: 'Access on Mobile and TV' },
        { icon: Trophy, text: 'Certificate of Completion' },
    ];

    return (
        <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                {/* Price Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {finalPrice === 0 ? 'FREE' : formatPrice(finalPrice, course.currency)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    {formatPrice(originalPrice, course.currency)}
                                </span>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded">
                                    {discountPercent}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Urgency Timer */}
                    {hasDiscount && timeLeft && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                            <Timer className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Offer ends in {timeLeft}
                            </span>
                        </div>
                    )}

                    {/* Main CTA */}
                    <Link
                        href={affiliateUrl}
                        target="_blank"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 group"
                    >
                        Secure Your Spot
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Guarantee */}
                    {/* <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                        30-Day Money-Back Guarantee
                    </p> */}
                </div>

                {/* Course Includes */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        This course includes:
                    </h3>
                    <ul className="space-y-3">
                        {courseIncludes.map((item, index) => (
                            <li key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Business CTA
                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Training 5 or more people?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Get your team access to top 5,000+ courses anytime, anywhere.
                    </p>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Building2 className="w-4 h-4" />
                        {course.platform.name} for Business
                    </button>
                </div> */}
            </div>
        </div>
    );
}

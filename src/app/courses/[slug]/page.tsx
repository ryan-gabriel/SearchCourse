/**
 * Course Detail Page
 * 
 * Conversion-first layout with sticky sidebar CTA,
 * "What you'll learn" grid, syllabus accordion, and instructor info.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Star,
    Users,
    Clock,
    PlayCircle,
    CheckCircle,
    ChevronRight,
    Award,
    TrendingUp,
    FileText,
    Download,
    Smartphone,
    Trophy,
    Timer,
    ArrowRight,
    ExternalLink
} from 'lucide-react';
import { getCourseWithFullDetails, getCourseBySlug } from '@/services';
import { formatPrice, calculateDiscountPercentage, formatCompactNumber } from '@/lib/utils';
import { CourseAccordion } from './CourseAccordion';
import { StickyCourseSidebar } from './StickyCourseSidebar';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourseBySlug(slug);

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    return {
        title: course.title,
        description: course.shortDescription || course.description?.slice(0, 160),
        openGraph: {
            title: `${course.title} | SearchCourse`,
            description: course.shortDescription || course.description?.slice(0, 160),
            images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : undefined,
        },
    };
}

// Revalidate every hour
export const revalidate = 3600;



export default async function CourseDetailPage(props: PageProps) {
    const { slug } = await props.params;
    const course = await getCourseWithFullDetails(slug);

    if (!course) {
        notFound();
    }

    const hasDiscount = course.activeCoupon !== null;
    const finalPrice = hasDiscount ? course.activeCoupon!.finalPrice : course.originalPrice;
    const discountPercent = hasDiscount
        ? calculateDiscountPercentage(Number(course.originalPrice), Number(finalPrice))
        : 0;

    const affiliateUrl = course.affiliateUrl || `/api/out/${course.id}`;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/courses" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            Courses
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <Link
                            href={`/courses?categoryId=${course.category.id}`}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {course.category.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <Link
                            href={`/courses?platformId=${course.platform.id}`}
                            className="text-blue-600 dark:text-blue-400 font-medium truncate max-w-[200px] hover:underline"
                        >
                            {course.platform.name}
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Left Column - Course Info */}
                    <div className="lg:col-span-2">
                        {/* Course Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                {course.title}
                            </h1>

                            {course.shortDescription && (
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                    {course.shortDescription}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                                {course.rating && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-amber-600">{Number(course.rating).toFixed(1)}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(Number(course.rating))
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            ({formatCompactNumber(course.reviewCount)} ratings)
                                        </span>
                                    </div>
                                )}

                                {course.studentCount > 0 && (
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span>{formatCompactNumber(course.studentCount)} students</span>
                                    </div>
                                )}

                                {course.lastVerifiedAt && (
                                    <div className="hidden sm:flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verified {new Date(course.lastVerifiedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Instructor */}
                            {course.instructorName && (
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {course.instructorName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{course.instructorName}</p>
                                    </div>
                                </div>
                            )}

                            {/* Platform & Duration */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1">
                                    Available on {course.platform.name}
                                </span>
                                {course.duration && (
                                    <span className="inline-flex items-center gap-1">
                                        <PlayCircle className="w-4 h-4" />
                                        {course.duration} of content
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Video Preview */}
                        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-10 shadow-lg">
                            {course.thumbnailUrl ? (
                                <Image
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                            )}
                            {course.directUrl && (
                                <Link
                                    href={course.directUrl}
                                    target="_blank"
                                    className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-center justify-center group"
                                >
                                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
                                        <PlayCircle className="w-12 h-12 text-white fill-white/20" />
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Value Props */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            <div className="flex items-start gap-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Career Growth</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Build a portfolio-ready project and master in-demand skills recognized by top employers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Certificate</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Receive a certificate of completion to validate your expertise on your resume.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What You'll Learn */}
                        {course.learningOutcomes.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    What you&apos;ll learn
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                                    {course.learningOutcomes.map((outcome: { id: string; text: string }) => (
                                        <div key={outcome.id} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{outcome.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Course Description */}
                        {course.description && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Description
                                </h2>
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {course.description}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Course Syllabus */}
                        {course.syllabusSections.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Course Content
                                </h2>
                                <CourseAccordion sections={course.syllabusSections.map((s: any) => ({
                                    ...s,
                                    lectures: s.items.length,
                                    items: s.items.map((i: any) => i.title),
                                    duration: s.duration || ''
                                }))} />
                            </section>
                        )}

                        {/* Student Feedback */}
                        {course.rating && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Student Feedback
                                </h2>
                                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                            {Number(course.rating).toFixed(1)}
                                        </div>
                                        <div className="flex justify-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-6 h-6 ${i < Math.floor(Number(course.rating || 0))
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white mb-2">Course Rating</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Trusted by {formatCompactNumber(course.studentCount)} students
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Instructor */}
                        {course.instructorName && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Instructor
                                </h2>
                                <div className="flex flex-col sm:flex-row items-start gap-6 p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                                        {course.instructorName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {course.instructorName}
                                        </h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium">
                                            Course Instructor
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {course.instructorBio || `${course.instructorName} is an experienced instructor with a passion for teaching complex topics in simple, understandable ways.`}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="hidden lg:block relative">
                        <StickyCourseSidebar
                            course={course}
                            finalPrice={Number(finalPrice)}
                            originalPrice={Number(course.originalPrice)}
                            discountPercent={discountPercent}
                            affiliateUrl={affiliateUrl}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Fixed CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {Number(finalPrice) === 0 ? 'FREE' : formatPrice(Number(finalPrice), course.currency)}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(Number(course.originalPrice), course.currency)}
                                </span>
                            )}
                        </div>
                        {hasDiscount && discountPercent > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                {discountPercent}% off
                            </span>
                        )}
                    </div>
                    <Link
                        href={affiliateUrl}
                        target="_blank"
                        className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Enroll Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

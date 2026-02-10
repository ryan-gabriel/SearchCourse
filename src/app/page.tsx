/**
 * Homepage
 *
 * Redesigned as a high-conversion discovery engine.
 * Focus: Automated Discovery, Trending Categories, and High-Value Deals.
 */

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Search,
  TrendingUp,
  Zap,
  CheckCircle2,
  Shield,
  BarChart3,
  Code2,
  Database,
  Layout,
  Globe,
  Star,
  Clock,
  Tag,
} from 'lucide-react';
import { CourseGrid } from '@/components/course';
import {
  getFeaturedCourses,
  getTopDiscountCourses,
  getAllCategories,
  getHomepageStats,
  getFeaturedRoadmaps
} from '@/services';
import { SearchForm } from '@/components/ui/SearchForm';

// Revalidate every hour for ISR
export const revalidate = 3600;

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'web-development': Code2,
  'data-science': BarChart3,
  'cloud-devops': Database,
  'ui-ux-design': Layout,
  'default': Globe,
};

const CATEGORY_COLORS: Record<string, string> = {
  'web-development': 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  'data-science': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  'cloud-devops': 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  'ui-ux-design': 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  'default': 'bg-gray-50 text-gray-600 dark:bg-gray-950/30 dark:text-gray-400',
};

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { courses: number };
}

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredResult, categories, stats, roadmaps] = await Promise.all([
    getFeaturedCourses(8).catch(() => ({ data: [], pagination: { total: 0, page: 1, limit: 8, totalPages: 0, hasNext: false, hasPrev: false } })),
    getAllCategories().catch((): Category[] => []),
    getHomepageStats().catch(() => ({ coursesVerified: '500+', studentSavings: '$45k+', uptime: '99.9%' })),
    getFeaturedRoadmaps(4).catch(() => ({ data: [] })),
  ]);

  return (
    <>
      {/* Navigation Placeholder (Assuming Global Layout handles this, but context implies header) */}

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-950 overflow-hidden pt-16 pb-20 lg:pt-26 lg:pb-28">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
            <Zap className="w-3 h-3" />
            <span>Automated Discovery Engine v2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            Master New Skills. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              We Filter the Noise.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop scrolling through low-quality content. SearchCourse aggregates the best technical education from top providers, verifying deals so you save money and time.
          </p>

          {/* Functional Search Bar */}
          <SearchForm className="max-w-2xl mx-auto mb-8" />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trending: <Link href="/courses?query=react" className="hover:text-blue-600 underline">React Patterns</Link>, <Link href="/courses?query=python" className="hover:text-blue-600 underline">Python for Data</Link>, <Link href="/courses?query=aws" className="hover:text-blue-600 underline">AWS Cert</Link>
          </p>
        </div>
      </section>

      {/* Trust / Stats Bar */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center divide-x divide-gray-200 dark:divide-gray-800">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.coursesVerified}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Courses Verified
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.studentSavings}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student Savings
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.uptime}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Explore Categories
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Curated learning paths for modern technologies.
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat: Category) => {
              const IconComponent = CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default;
              const colorClass = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS.default;
              return (
                <Link
                  key={cat.id}
                  href={`/courses?categoryId=${cat.id}`}
                  className="group relative overflow-hidden rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all bg-white dark:bg-gray-900"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cat._count?.courses ?? 0} Courses</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career Roadmap Teaser (Authority Feature) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-6">
                <TrendingUp className="w-3 h-3" />
                New Feature
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Career Roadmaps
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Don't just buy random courses. Follow a curated path to mastery. Our roadmap engine aggregates related courses and calculates your total bundle savings.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Logical learning sequences
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Progress tracking (Local Storage)
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Dynamic "Bundle Savings" calculator
                </li>
              </ul>
              <Link
                href="/roadmaps"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                View Roadmaps
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Roadmap Preview Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {roadmaps.data.slice(0, 2).map((roadmap) => (
                <Link
                  key={roadmap.id}
                  href={`/roadmaps/${roadmap.slug}`}
                  className="bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      {roadmap.courseCount} Courses
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {roadmap.estimatedHours ? `${roadmap.estimatedHours}h` : 'Flexible'} • {roadmap.courseCount} Modules
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses (Top Picks) */}
      {featuredResult.data.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Top Picks of the Month
                </h2>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Manually verified for quality & discount accuracy.
                </p>
              </div>
              <Link
                href="/courses?isFeatured=true"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                View All Deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* We assume CourseGrid handles the individual card styling, but we wrap it nicely */}
            <CourseGrid courses={featuredResult.data} />
          </div>
        </section>
      )}

      {/* Bottom CTA & Newsletter */}
      <section className="py-20 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to upgrade your career?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of developers saving time and money on technical education. No spam, just high-signal deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              Start Learning Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
            >
              Our Vetting Process
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">SearchCourse</h3>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              The automated discovery engine for technical excellence. We help developers find the best courses from top providers.
            </p>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} SearchCourse. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link href="/roadmaps" className="hover:text-white transition-colors">Career Roadmaps</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Flash Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px8 pt-8 border-t border-gray-900 text-center text-xs">
          <p>
            <span className="text-gray-500">Disclaimer:</span> We participate in the Impact.com affiliate network. We may earn a commission if you purchase through our links, at no extra cost to you. This helps support our platform.
          </p>
        </div>
      </footer>
    </>
  );
}
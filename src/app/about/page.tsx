/**
 * About Page
 * 
 * Updated with a full-screen, standout Hero section featuring a technical grid background
 * and modern SaaS aesthetic.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowRight,
    Target,
    Shield,
    ExternalLink,
    Cpu,
    Database,
    Zap,
    ChevronDown
} from 'lucide-react';
import { getAboutPageStats, getMissionContent } from '@/services';

// --- SEO METADATA ---
export const metadata: Metadata = {
    title: 'About Us - Our Mission & Team',
    description:
        'Learn about our mission to curate the highest quality online courses. Meet the experts behind our rigorous vetting process.',
    openGraph: {
        title: 'About SearchCourse | Our Mission',
        description: 'Learn about our mission to curate the highest quality online courses.',
    },
};

const VALUES = [
    {
        icon: Target,
        title: 'Precision, Not Volume',
        description: 'Our algorithms reject 96% of content. We only list courses that offer actionable, modern technical skills.',
    },
    {
        icon: Shield,
        title: 'Unbiased Integrity',
        description: 'Affiliate links are strictly for site maintenance. Our ranking logic is based on student outcomes, not commissions.',
    },
    {
        icon: Zap,
        title: 'Real-Time Data',
        description: 'We check prices hourly. If a deal expires, it disappears. What you see is what you get.',
    },
];

// Revalidate every hour
export const revalidate = 3600;

const SYSTEM_COMPONENTS = [
    {
        title: 'GitHub Scrapers',
        description: 'Node.js cron jobs that scan premium APIs for new course listings hourly.',
        icon: Cpu,
    },
    {
        title: 'Price Intelligence',
        description: 'Automated tracking of Udemy/Coursera discounts. We alert when prices drop > 80%.',
        icon: Database,
    },
    {
        title: 'Curriculum Audit',
        description: 'Scripts analyze syllabi keywords to ensure tech stacks are current (e.g., React 19, Python 3.12).',
        icon: Target,
    },
    {
        title: 'Manual Oversight',
        description: 'Final review by the founder to ensure "Brand Safety" and affiliate compliance standards.',
        icon: Shield,
    },
];

export default async function AboutPage() {
    // Fetch data in parallel
    const [stats, mission] = await Promise.all([
        getAboutPageStats().catch(() => ({
            coursesVerified: '500+',
            acceptanceRate: '4%',
            priceMonitoring: '24/7',
            hostingCost: '$0.00'
        })),
        getMissionContent().catch(() => ({
            title: 'Signal over Noise',
            subtitle: 'The automated discovery engine for technical excellence.',
            description: 'We filter the internet so you can focus on building.'
        }))
    ]);

    const statsArray = [
        { value: stats.coursesVerified, label: 'Courses Analyzed' },
        { value: stats.acceptanceRate, label: 'Acceptance Rate' },
        { value: stats.priceMonitoring, label: 'Price Monitoring' },
        { value: stats.hostingCost, label: 'Hosting Cost' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 selection:bg-blue-500/30">

            {/* --- REDESIGNED HERO SECTION --- */}
            <section className="relative h-[calc(100vh-4rem)] max-h-[1080px] w-full overflow-hidden flex flex-col items-center justify-center">

                {/* 1. Background Grid Pattern */}
                <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

                {/* 2. Ambient Glows (Creates depth & modern feel) */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                {/* 3. Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full">

                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm transition-all hover:scale-105">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                            Now Live on Vercel
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-8">
                        {mission.title.split(' ').slice(0, 2).join(' ')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            {mission.title.split(' ').slice(2).join(' ')}
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-10">
                        {mission.description || mission.subtitle}
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link
                            href="/courses"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all hover:-translate-y-1"
                        >
                            Start Learning
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/#problem"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Our Mission
                        </Link>
                    </div>
                </div>

                {/* 4. Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                </div>
            </section>


            {/* The Problem (Card Style) */}
            <section id="problem" className="py-24 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                <Zap className="w-4 h-4" />
                            </span>
                            The Platform Problem
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                Massive course platforms prioritize <strong>ad revenue</strong> and <strong>volume</strong>. They bury the best courses under pages of SEO-optimized, low-quality content.
                            </p>
                            <p>
                                As a solo developer, I built SearchCourse to solve this specific friction point. It utilizes serverless architecture to automatically filter, verify, and curate technical courses based on <strong>relevance</strong> and <strong>discount validity</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-gray-800">
                        {statsArray.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center">
                                <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Core Principles
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            The non-negotiable standards that define every link on this site.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {VALUES.map((value) => (
                            <div
                                key={value.title}
                                className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 mb-6 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Engine (Replacing Team Section) */}
            <section className="py-24 bg-white dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                The Discovery Engine
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                How our automated infrastructure ensures quality.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                System Operational
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SYSTEM_COMPONENTS.map((item) => (
                            <div
                                key={item.title}
                                className="group relative p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900"
                            >
                                <div className="mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliate Disclosure (Legal) */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-sm mb-6 border border-gray-200 dark:border-gray-800">
                        <ExternalLink className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Affiliate Disclosure
                    </h3>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p className="mb-4">
                            SearchCourse is a participant in the Impact.com and other affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to partner websites.
                        </p>
                        <p>
                            <strong className="text-gray-900 dark:text-white">Transparency Promise:</strong> We may earn a commission if you purchase through our links. This comes at no extra cost to you. We do not accept payment for positive reviews. Our "Top Picks" are determined by algorithmic quality scores.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-gray-900 dark:bg-black text-center relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50 pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to cut through the noise?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Join the developers who are learning smarter, not harder.
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-1"
                    >
                        Browse Verified Courses
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}   
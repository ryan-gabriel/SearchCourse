/**
 * sitemap.ts - Dynamic sitemap generation
 * 
 * Generates sitemap including all public pages, courses, and roadmaps.
 * Excludes admin and auth-related pages.
 */

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/roadmaps`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Fetch active courses and roadmaps from database
    const [courses, roadmaps] = await Promise.all([
        prisma.course.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        }),
        prisma.roadmap.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        }),
    ]);

    // Generate course pages
    const coursePages: MetadataRoute.Sitemap = courses.map((course: { slug: string; updatedAt: Date; }) => ({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: course.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    // Generate roadmap pages
    const roadmapPages: MetadataRoute.Sitemap = roadmaps.map((roadmap: { slug: string; updatedAt: Date; }) => ({
        url: `${baseUrl}/roadmaps/${roadmap.slug}`,
        lastModified: roadmap.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...coursePages, ...roadmapPages];
}

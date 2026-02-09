/**
 * HTML Course Extractor
 * Extracts course data from local HTML files (Udemy/Coursera) and inserts into database
 */

import 'dotenv/config';
import { CourseLevel } from '@prisma/client';
import prisma from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// Configuration
const HTML_BASE_PATH = path.resolve(__dirname, '../../html-scraper-result-example/courses');
const DRY_RUN = process.argv.includes('--dry-run');

interface ExtractedCourse {
    platform: string;
    category: string;
    title: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    instructorName: string | null;
    thumbnailUrl: string | null;
    originalPrice: number;
    currency: string;
    level: CourseLevel;
    rating: number | null;
    reviewCount: number;
    studentCount: number;
    duration: string | null;
    lectureCount: number | null;
    directUrl: string;
    learningOutcomes: string[];
    syllabusSections: { title: string; duration: string | null; items: string[] }[];
}

/**
 * Detect platform from HTML content
 */
function detectPlatform(html: string): 'udemy' | 'coursera' | 'unknown' {
    if (html.includes('udemy.com') || html.includes('ud-heading')) {
        return 'udemy';
    }
    if (html.includes('coursera.org') || html.includes('Coursera')) {
        return 'coursera';
    }
    return 'unknown';
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
}

/**
 * Convert ISO 8601 duration to readable format
 */
function parseDuration(isoDuration: string | undefined): string | null {
    if (!isoDuration) return null;

    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return isoDuration;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    }
    return null;
}

/**
 * Map level string to CourseLevel enum
 */
function mapLevel(levelStr: string | undefined): CourseLevel {
    if (!levelStr) return CourseLevel.ALL_LEVELS;

    const level = levelStr.toLowerCase();
    if (level.includes('beginner')) return CourseLevel.BEGINNER;
    if (level.includes('intermediate')) return CourseLevel.INTERMEDIATE;
    if (level.includes('advanced') || level.includes('expert')) return CourseLevel.ADVANCED;
    return CourseLevel.ALL_LEVELS;
}

/**
 * Parse Udemy HTML (JSON-LD structured data)
 */
function parseUdemy($: cheerio.CheerioAPI, category: string): ExtractedCourse | null {
    try {
        // Find JSON-LD script
        const jsonLdScript = $('script[type="application/ld+json"]').first().html();
        if (!jsonLdScript) {
            console.warn('No JSON-LD found');
            return null;
        }

        const jsonData = JSON.parse(jsonLdScript);
        const courseData = jsonData['@graph']?.find((item: any) => item['@type'] === 'Course') || jsonData;

        if (!courseData || !courseData.name) {
            console.warn('No course data in JSON-LD');
            return null;
        }

        // Extract learning outcomes
        const learningOutcomes: string[] = [];
        if (Array.isArray(courseData.teaches)) {
            learningOutcomes.push(...courseData.teaches);
        }

        // Extract syllabus sections
        const syllabusSections: { title: string; duration: string | null; items: string[] }[] = [];
        if (Array.isArray(courseData.syllabusSections)) {
            for (const section of courseData.syllabusSections) {
                syllabusSections.push({
                    title: section.name || 'Untitled Section',
                    duration: parseDuration(section.timeRequired),
                    items: [] // Udemy JSON-LD doesn't include individual items
                });
            }
        }

        // Parse pricing
        let price = 0;
        let currency = 'USD';
        if (courseData.offers) {
            price = parseFloat(courseData.offers.price) || 0;
            currency = courseData.offers.priceCurrency || 'USD';
        }

        // Get URL
        const directUrl = $('meta[property="og:url"]').attr('content') ||
            $('link[rel="canonical"]').attr('href') ||
            'https://www.udemy.com';

        const title = courseData.name;

        return {
            platform: 'udemy',
            category,
            title,
            slug: generateSlug(title),
            description: courseData.description || null,
            shortDescription: courseData.description?.substring(0, 320) || null,
            instructorName: courseData.instructor?.[0]?.name || courseData.creator?.name || null,
            thumbnailUrl: courseData.image || $('meta[property="og:image"]').attr('content') || null,
            originalPrice: price,
            currency,
            level: mapLevel(courseData.educationalLevel),
            rating: courseData.aggregateRating?.ratingValue ? parseFloat(courseData.aggregateRating.ratingValue) : null,
            reviewCount: parseInt(courseData.aggregateRating?.reviewCount) || 0,
            studentCount: 0,
            duration: parseDuration(courseData.timeRequired),
            lectureCount: null,
            directUrl,
            learningOutcomes,
            syllabusSections
        };
    } catch (error) {
        console.error('Error parsing Udemy HTML:', error);
        return null;
    }
}

/**
 * Parse Coursera HTML (meta tags)
 */
function parseCoursera($: cheerio.CheerioAPI, category: string): ExtractedCourse | null {
    try {
        const title = $('meta[property="og:title"]').attr('content') ||
            $('title').text().replace(' | Coursera', '');

        if (!title) {
            console.warn('No title found for Coursera course');
            return null;
        }

        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') || null;

        const directUrl = $('meta[property="og:url"]').attr('content') ||
            $('link[rel="canonical"]').attr('href') ||
            'https://www.coursera.org';

        const thumbnailUrl = $('meta[property="og:image"]').attr('content') || null;

        return {
            platform: 'coursera',
            category,
            title,
            slug: generateSlug(title),
            description,
            shortDescription: description?.substring(0, 320) || null,
            instructorName: null, // Coursera structure varies
            thumbnailUrl,
            originalPrice: 0, // Coursera often has subscription model
            currency: 'USD',
            level: CourseLevel.ALL_LEVELS,
            rating: null,
            reviewCount: 0,
            studentCount: 0,
            duration: null,
            lectureCount: null,
            directUrl,
            learningOutcomes: [],
            syllabusSections: []
        };
    } catch (error) {
        console.error('Error parsing Coursera HTML:', error);
        return null;
    }
}

/**
 * Insert course data into database
 */
async function insertCourse(course: ExtractedCourse): Promise<void> {
    if (DRY_RUN) {
        console.log(`[DRY RUN] Would insert: ${course.title}`);
        console.log(`  Platform: ${course.platform}`);
        console.log(`  Category: ${course.category}`);
        console.log(`  Learning Outcomes: ${course.learningOutcomes.length}`);
        console.log(`  Syllabus Sections: ${course.syllabusSections.length}`);
        return;
    }

    // Upsert platform
    const platform = await prisma.platform.upsert({
        where: { slug: course.platform },
        update: {},
        create: {
            name: course.platform === 'udemy' ? 'Udemy' : 'Coursera',
            slug: course.platform,
            baseUrl: course.platform === 'udemy' ? 'https://www.udemy.com' : 'https://www.coursera.org',
            isActive: true
        }
    });

    // Upsert category
    const categorySlug = course.category.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const categoryRecord = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: course.category,
            slug: categorySlug,
            description: `Courses in ${course.category}`
        }
    });

    // Upsert course
    const existingCourse = await prisma.course.findUnique({
        where: { slug: course.slug }
    });

    const courseRecord = await prisma.course.upsert({
        where: { slug: course.slug },
        update: {
            title: course.title,
            description: course.description,
            shortDescription: course.shortDescription,
            instructorName: course.instructorName,
            thumbnailUrl: course.thumbnailUrl,
            originalPrice: course.originalPrice,
            currency: course.currency,
            level: course.level,
            rating: course.rating,
            reviewCount: course.reviewCount,
            studentCount: course.studentCount,
            duration: course.duration,
            lectureCount: course.lectureCount,
            directUrl: course.directUrl,
            platformId: platform.id,
            categoryId: categoryRecord.id
        },
        create: {
            title: course.title,
            slug: course.slug,
            description: course.description,
            shortDescription: course.shortDescription,
            instructorName: course.instructorName,
            thumbnailUrl: course.thumbnailUrl,
            originalPrice: course.originalPrice,
            currency: course.currency,
            level: course.level,
            rating: course.rating,
            reviewCount: course.reviewCount,
            studentCount: course.studentCount,
            duration: course.duration,
            lectureCount: course.lectureCount,
            directUrl: course.directUrl,
            platformId: platform.id,
            categoryId: categoryRecord.id
        }
    });

    // Insert learning outcomes (delete existing first to avoid duplicates)
    if (course.learningOutcomes.length > 0) {
        await prisma.courseLearningOutcome.deleteMany({
            where: { courseId: courseRecord.id }
        });

        await prisma.courseLearningOutcome.createMany({
            data: course.learningOutcomes.map((text, index) => ({
                courseId: courseRecord.id,
                text: text.substring(0, 500),
                sortOrder: index
            }))
        });
    }

    // Insert syllabus sections
    if (course.syllabusSections.length > 0) {
        await prisma.courseSyllabusSection.deleteMany({
            where: { courseId: courseRecord.id }
        });

        for (let i = 0; i < course.syllabusSections.length; i++) {
            const section = course.syllabusSections[i];
            await prisma.courseSyllabusSection.create({
                data: {
                    courseId: courseRecord.id,
                    title: section.title,
                    duration: section.duration,
                    sortOrder: i
                }
            });
        }
    }

    console.log(`✓ Inserted: ${course.title}`);
}

/**
 * Process a single HTML file
 */
async function processFile(filePath: string, category: string): Promise<boolean> {
    try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);

        const platform = detectPlatform(html);
        console.log(`Processing: ${path.basename(filePath)} [${platform}]`);

        let course: ExtractedCourse | null = null;

        if (platform === 'udemy') {
            course = parseUdemy($, category);
        } else if (platform === 'coursera') {
            course = parseCoursera($, category);
        } else {
            console.warn(`Unknown platform for: ${filePath}`);
            return false;
        }

        if (!course) {
            console.warn(`Failed to parse: ${filePath}`);
            return false;
        }

        await insertCourse(course);
        return true;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return false;
    }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
    console.log('='.repeat(60));
    console.log('HTML Course Extractor');
    console.log('='.repeat(60));

    if (DRY_RUN) {
        console.log('🔍 DRY RUN MODE - No database changes will be made\n');
    }

    let successCount = 0;
    let errorCount = 0;

    // Get all category folders
    const categories = fs.readdirSync(HTML_BASE_PATH).filter(item => {
        const itemPath = path.join(HTML_BASE_PATH, item);
        return fs.statSync(itemPath).isDirectory();
    });

    console.log(`Found ${categories.length} categories\n`);

    for (const category of categories) {
        console.log(`\n📁 Category: ${category}`);
        console.log('-'.repeat(40));

        const categoryPath = path.join(HTML_BASE_PATH, category);
        const htmlFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.html'));

        for (const htmlFile of htmlFiles) {
            const filePath = path.join(categoryPath, htmlFile);
            const success = await processFile(filePath, category);

            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Complete! ✓ ${successCount} succeeded, ✗ ${errorCount} failed`);
    console.log('='.repeat(60));

    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error('Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
});

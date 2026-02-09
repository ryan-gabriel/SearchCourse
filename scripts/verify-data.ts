import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function verify() {
    console.log('='.repeat(50));
    console.log('Database Verification');
    console.log('='.repeat(50));

    // Get counts
    const counts = {
        courses: await prisma.course.count(),
        platforms: await prisma.platform.count(),
        categories: await prisma.category.count(),
        learningOutcomes: await prisma.courseLearningOutcome.count(),
        syllabusSections: await prisma.courseSyllabusSection.count()
    };

    console.log('\nRecord counts:');
    console.log(`  Courses: ${counts.courses}`);
    console.log(`  Platforms: ${counts.platforms}`);
    console.log(`  Categories: ${counts.categories}`);
    console.log(`  Learning Outcomes: ${counts.learningOutcomes}`);
    console.log(`  Syllabus Sections: ${counts.syllabusSections}`);

    // Get sample courses
    console.log('\n' + '-'.repeat(50));
    console.log('Sample courses:');

    const courses = await prisma.course.findMany({
        include: {
            platform: { select: { name: true } },
            category: { select: { name: true } },
            _count: {
                select: {
                    learningOutcomes: true,
                    syllabusSections: true
                }
            }
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    for (const course of courses) {
        console.log(`\n  ${course.title}`);
        console.log(`    Platform: ${course.platform.name}`);
        console.log(`    Category: ${course.category.name}`);
        console.log(`    Outcomes: ${course._count.learningOutcomes}, Sections: ${course._count.syllabusSections}`);
    }

    console.log('\n' + '='.repeat(50));
    await prisma.$disconnect();
}

verify();

/**
 * Course Syllabus Accordion Component
 * 
 * Expandable sections showing course content structure.
 */

'use client';

import { useState } from 'react';
import { ChevronDown, PlayCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyllabusSection {
    title: string;
    lectures: number;
    duration: string;
    items: string[];
}

interface CourseAccordionProps {
    sections: SyllabusSection[];
}

export function CourseAccordion({ sections }: CourseAccordionProps) {
    const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

    const toggleSection = (index: number) => {
        const newOpen = new Set(openSections);
        if (newOpen.has(index)) {
            newOpen.delete(index);
        } else {
            newOpen.add(index);
        }
        setOpenSections(newOpen);
    };

    const totalLectures = sections.reduce((sum, s) => sum + s.lectures, 0);
    const totalDuration = sections.reduce((sum, s) => {
        const match = s.duration.match(/(\d+)h?\s*(\d+)?m?/);
        if (match) {
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]) || 0;
            return sum + hours * 60 + minutes;
        }
        return sum;
    }, 0);

    const formatTotalDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div>
            {/* Summary */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>{sections.length} sections</span>
                <span>{totalLectures} lectures</span>
                <span>{formatTotalDuration(totalDuration)} total length</span>
            </div>

            {/* Accordion */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
                {sections.map((section, index) => {
                    const hasItems = section.lectures > 0;

                    // Sections without items - render as simple list item
                    if (!hasItems) {
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-950"
                            >
                                <PlayCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">
                                    {section.title}
                                </span>
                                {section.duration && (
                                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                                        {section.duration}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    // Sections with items - render as collapsible accordion
                    return (
                        <div key={index}>
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(index)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronDown
                                        className={cn(
                                            'w-5 h-5 text-gray-500 transition-transform',
                                            openSections.has(index) && 'rotate-180'
                                        )}
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {section.title}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {section.lectures} lectures • {section.duration}
                                </div>
                            </button>

                            {/* Section Content */}
                            <div
                                className={cn(
                                    'overflow-hidden transition-all duration-300',
                                    openSections.has(index) ? 'max-h-96' : 'max-h-0'
                                )}
                            >
                                <ul className="p-4 space-y-3 bg-white dark:bg-gray-950">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center gap-3 text-sm">
                                            {itemIndex % 2 === 0 ? (
                                                <PlayCircle className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-gray-400" />
                                            )}
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

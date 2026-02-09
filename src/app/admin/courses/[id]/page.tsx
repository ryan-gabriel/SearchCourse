'use client';

/**
 * Course Content Editor
 * 
 * Manage Learning Outcomes and Syllabus
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputField, SwitchField } from '@/components/admin';
import { ChevronLeft, Plus, Trash2, Save, GripVertical, Clock } from 'lucide-react';

interface LearningOutcome {
    id?: string;
    text: string;
    sortOrder: number;
}

interface SyllabusItem {
    id?: string;
    title: string;
    sortOrder: number;
}

interface SyllabusSection {
    id?: string;
    title: string;
    duration?: string;
    sortOrder: number;
    items: SyllabusItem[];
}

interface CourseDetails {
    id: string;
    title: string;
    slug: string;
    learningOutcomes: LearningOutcome[];
    syllabusSections: SyllabusSection[];
}

export default function CourseContentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
    const [sections, setSections] = useState<SyllabusSection[]>([]);

    const [isSavingOutcomes, setIsSavingOutcomes] = useState(false);
    const [isSavingSyllabus, setIsSavingSyllabus] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/admin/courses/${id}`);
            if (!res.ok) throw new Error('Failed to fetch course');
            const data = await res.json();
            setCourse(data);
            setOutcomes(data.learningOutcomes || []);
            setSections(data.syllabusSections || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // OUTCOMES LOGIC
    // ==========================================
    const addOutcome = () => {
        setOutcomes([...outcomes, { text: '', sortOrder: outcomes.length }]);
    };

    const updateOutcome = (index: number, text: string) => {
        const newOutcomes = [...outcomes];
        newOutcomes[index].text = text;
        setOutcomes(newOutcomes);
    };

    const removeOutcome = (index: number) => {
        setOutcomes(outcomes.filter((_, i) => i !== index));
    };

    const saveOutcomes = async () => {
        setIsSavingOutcomes(true);
        try {
            await fetch(`/api/admin/courses/${id}/outcomes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    outcomes: outcomes.map((o, i) => ({ text: o.text, sortOrder: i }))
                }),
            });
            // Show toast or explicit success?
        } catch (error) {
            console.error(error);
        } finally {
            setIsSavingOutcomes(false);
        }
    };

    // ==========================================
    // SYLLABUS LOGIC
    // ==========================================
    const addSection = () => {
        setSections([...sections, { title: 'New Section', duration: '', sortOrder: sections.length, items: [] }]);
    };

    type SyllabusSectionValue = string | number | SyllabusItem[] | undefined;
    const updateSection = (index: number, field: keyof SyllabusSection, value: SyllabusSectionValue) => {
        const newSections = [...sections];
        if (field === 'items') {
            newSections[index].items = value as SyllabusItem[];
        } else if (field === 'sortOrder') {
            newSections[index].sortOrder = value as number;
        } else if (field === 'title') {
            newSections[index].title = value as string;
        } else if (field === 'duration') {
            newSections[index].duration = value as string | undefined;
        }
        setSections(newSections);
    };

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const addItem = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].items.push({
            title: '',
            sortOrder: newSections[sectionIndex].items.length
        });
        setSections(newSections);
    };

    const updateItem = (sectionIndex: number, itemIndex: number, title: string) => {
        const newSections = [...sections];
        newSections[sectionIndex].items[itemIndex].title = title;
        setSections(newSections);
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
        setSections(newSections);
    };

    const saveSyllabus = async () => {
        setIsSavingSyllabus(true);
        try {
            await fetch(`/api/admin/courses/${id}/syllabus`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sections: sections.map((s, i) => ({
                        title: s.title,
                        duration: s.duration,
                        sortOrder: i,
                        items: s.items.map((item, j) => ({
                            title: item.title,
                            sortOrder: j
                        }))
                    }))
                }),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSavingSyllabus(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading editor...</div>;
    if (!course) return <div className="p-8 text-center text-rose-500">Course not found</div>;

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/courses"
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Content Editor
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {course.title}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Learning Outcomes */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            What you'll learn
                        </h2>
                        <button
                            onClick={saveOutcomes}
                            disabled={isSavingOutcomes}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSavingOutcomes ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        {outcomes.map((outcome, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="mt-3 text-slate-400 cursor-move">
                                    <GripVertical className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={outcome.text}
                                        onChange={(e) => updateOutcome(index, e.target.value)}
                                        placeholder="Enter learning outcome..."
                                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                                <button
                                    onClick={() => removeOutcome(index)}
                                    className="mt-2 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addOutcome}
                            className="flex items-center justify-center w-full gap-2 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Outcome
                        </button>
                    </div>
                </div>

                {/* Syllabus */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Syllabus
                        </h2>
                        <button
                            onClick={saveSyllabus}
                            disabled={isSavingSyllabus}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSavingSyllabus ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {sections.map((section, sIndex) => (
                            <div key={sIndex} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                                {/* Section Header */}
                                <div className="flex gap-3 items-start">
                                    <div className="mt-3 text-slate-400 cursor-move">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 grid gap-2">
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => updateSection(sIndex, 'title', e.target.value)}
                                            placeholder="Section Title"
                                            className="w-full px-3 py-2 font-medium rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={section.duration || ''}
                                                onChange={(e) => updateSection(sIndex, 'duration', e.target.value)}
                                                placeholder="Duration (e.g. 2h 10m)"
                                                className="w-32 px-2 py-1 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSection(sIndex)}
                                        className="mt-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Items */}
                                <div className="pl-8 space-y-2">
                                    {section.items.map((item, iIndex) => (
                                        <div key={iIndex} className="flex gap-2 items-center">
                                            <div className="text-slate-300">
                                                <GripVertical className="w-3 h-3" />
                                            </div>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateItem(sIndex, iIndex, e.target.value)}
                                                placeholder="Lecture title..."
                                                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            />
                                            <button
                                                onClick={() => removeItem(sIndex, iIndex)}
                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addItem(sIndex)}
                                        className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Lecture
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addSection}
                            className="flex items-center justify-center w-full gap-2 py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Syllabus Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

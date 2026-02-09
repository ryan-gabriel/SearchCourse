'use client';

/**
 * Courses Admin Page
 * 
 * CRUD operations for courses with advanced filtering
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { DataTable, Column, Modal, InputField, TextareaField, SelectField, SwitchField } from '@/components/admin';
import { BookOpen } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    instructorName: string | null;
    instructorBio: string | null;
    thumbnailUrl: string | null;
    originalPrice: number;
    currency: string;
    level: string;
    rating: number | null;
    reviewCount: number;
    studentCount: number;
    duration: string | null;
    lectureCount: number | null;
    directUrl: string;
    affiliateUrl: string | null;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    platform: { id: string; name: string };
    category: { id: string; name: string };
    activeCoupon?: { finalPrice: number; discountValue: number } | null;
}

interface Platform {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface PaginatedResponse {
    data: Course[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const levelOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'ALL_LEVELS', label: 'All Levels' },
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOptionsLoading, setIsOptionsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ platformId: '', categoryId: '' });
    const [debouncedFilters, setDebouncedFilters] = useState({ platformId: '', categoryId: '' });
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Delete modal
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        instructorName: '',
        instructorBio: '',
        thumbnailUrl: '',
        originalPrice: 0,
        currency: 'USD',
        level: 'ALL_LEVELS',
        rating: '',
        reviewCount: 0,
        studentCount: 0,
        duration: '',
        lectureCount: '',
        directUrl: '',
        affiliateUrl: '',
        isActive: true,
        isFeatured: false,
        platformId: '',
        categoryId: '',
    });

    // Fetch platforms and categories on mount
    useEffect(() => {
        const fetchOptions = async () => {
            setIsOptionsLoading(true);
            try {
                const [platRes, catRes] = await Promise.all([
                    fetch('/api/admin/platforms?limit=50'),
                    fetch('/api/admin/categories?limit=50'),
                ]);
                const [platData, catData] = await Promise.all([platRes.json(), catRes.json()]);
                setPlatforms(platData.data || []);
                setCategories(catData.data || []);
            } catch (error) {
                console.error('Failed to fetch options:', error);
            } finally {
                setIsOptionsLoading(false);
            }
        };
        fetchOptions();
    }, []);

    // Debounce search and filters
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearch(search);
            setDebouncedFilters(filters);
        }, 500);
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [search, filters]);

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (debouncedSearch) params.set('query', debouncedSearch);
            if (debouncedFilters.platformId) params.set('platformId', debouncedFilters.platformId);
            if (debouncedFilters.categoryId) params.set('categoryId', debouncedFilters.categoryId);

            const res = await fetch(`/api/admin/courses?${params}`);
            const data: PaginatedResponse = await res.json();
            setCourses(data.data);
            setPagination((prev) => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, debouncedFilters]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            slug: '',
            description: '',
            shortDescription: '',
            instructorName: '',
            instructorBio: '',
            thumbnailUrl: '',
            originalPrice: 0,
            currency: 'USD',
            level: 'ALL_LEVELS',
            rating: '',
            reviewCount: 0,
            studentCount: 0,
            duration: '',
            lectureCount: '',
            directUrl: '',
            affiliateUrl: '',
            isActive: true,
            isFeatured: false,
            platformId: platforms[0]?.id || '',
            categoryId: categories[0]?.id || '',
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            slug: course.slug,
            description: course.description || '',
            shortDescription: course.shortDescription || '',
            instructorName: course.instructorName || '',
            instructorBio: course.instructorBio || '',
            thumbnailUrl: course.thumbnailUrl || '',
            originalPrice: course.originalPrice,
            currency: course.currency,
            level: course.level,
            rating: course.rating?.toString() || '',
            reviewCount: course.reviewCount,
            studentCount: course.studentCount,
            duration: course.duration || '',
            lectureCount: course.lectureCount?.toString() || '',
            directUrl: course.directUrl,
            affiliateUrl: course.affiliateUrl || '',
            isActive: course.isActive,
            isFeatured: course.isFeatured,
            platformId: course.platform.id,
            categoryId: course.category.id,
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const url = editingCourse
                ? `/api/admin/courses/${editingCourse.id}`
                : '/api/admin/courses';
            const method = editingCourse ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                originalPrice: Number(formData.originalPrice),
                rating: formData.rating ? Number(formData.rating) : undefined,
                lectureCount: formData.lectureCount ? Number(formData.lectureCount) : undefined,
                description: formData.description || undefined,
                shortDescription: formData.shortDescription || undefined,
                instructorName: formData.instructorName || undefined,
                instructorBio: formData.instructorBio || undefined,
                thumbnailUrl: formData.thumbnailUrl || undefined,
                duration: formData.duration || undefined,
                affiliateUrl: formData.affiliateUrl || undefined,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    setErrors(error.errors);
                } else {
                    throw new Error(error.message || 'Failed to save');
                }
                return;
            }

            setIsModalOpen(false);
            fetchCourses();
        } catch (error) {
            console.error('Failed to save course:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/admin/courses/${deleteId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete');
            }

            setDeleteId(null);
            fetchCourses();
        } catch (error) {
            console.error('Failed to delete course:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const columns: Column<Course>[] = [
        {
            key: 'title',
            header: 'Course',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-3">
                    {course.thumbnailUrl ? (
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-12 h-8 rounded object-cover bg-slate-100"
                        />
                    ) : (
                        <div className="w-12 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
                    )}
                    <div className="min-w-0">
                        <p className="font-medium truncate max-w-xs">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.instructorName || 'Unknown'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'platform.name',
            header: 'Platform',
            sortable: true,
            render: (course) => (
                <span className="text-sm">{course.platform.name}</span>
            ),
        },
        {
            key: 'category.name',
            header: 'Category',
            render: (course) => (
                <span className="text-sm">{course.category.name}</span>
            ),
        },
        {
            key: 'originalPrice',
            header: 'Price',
            sortable: true,
            render: (course) => (
                <div>
                    {course.activeCoupon ? (
                        <>
                            <span className="text-emerald-600 font-medium">
                                ${course.activeCoupon.finalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 line-through ml-1">
                                ${course.originalPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span>${course.originalPrice.toFixed(2)}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (course) => (
                <div className="flex gap-1">
                    {course.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Featured
                        </span>
                    )}
                    <span
                        className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${course.isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }
                        `}
                    >
                        {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Courses
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your course catalog
                    </p>
                </div>
                <button onClick={openCreateModal} className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Course
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] max-w-md">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <select
                    value={filters.platformId}
                    onChange={(e) => {
                        setFilters((prev) => ({ ...prev, platformId: e.target.value }));
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    disabled={isOptionsLoading}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                >
                    <option value="">{isOptionsLoading ? 'Loading...' : 'All Platforms'}</option>
                    {platforms.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <select
                    value={filters.categoryId}
                    onChange={(e) => {
                        setFilters((prev) => ({ ...prev, categoryId: e.target.value }));
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    disabled={isOptionsLoading}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                >
                    <option value="">{isOptionsLoading ? 'Loading...' : 'All Categories'}</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={courses}
                keyExtractor={(c) => c.id}
                isLoading={isLoading}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
                }}
                actions={(course) => (
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/courses/${course.id}`}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Manage Content"
                        >
                            <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <button
                            onClick={() => openEditModal(course)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Details"
                        >
                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setDeleteId(course.id)}
                            className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            title="Delete"
                        >
                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCourse ? 'Edit Course' : 'Add Course'}
                size="xl"
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Title"
                            required
                            value={formData.title}
                            onChange={(e) => {
                                const title = e.target.value;
                                setFormData((prev) => ({
                                    ...prev,
                                    title,
                                    slug: prev.slug || generateSlug(title),
                                }));
                            }}
                            placeholder="Course title"
                            error={errors.title}
                        />
                        <InputField
                            label="Slug"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                            placeholder="course-slug"
                            error={errors.slug}
                        />
                    </div>

                    <TextareaField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Full course description"
                        error={errors.description}
                    />

                    <InputField
                        label="Short Description"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        placeholder="Brief description for SEO (max 320 chars)"
                        error={errors.shortDescription}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Platform"
                            required
                            options={platforms.map((p) => ({ value: p.id, label: p.name }))}
                            value={formData.platformId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, platformId: e.target.value }))}
                            error={errors.platformId}
                        />
                        <SelectField
                            label="Category"
                            required
                            options={categories.map((c) => ({ value: c.id, label: c.name }))}
                            value={formData.categoryId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                            error={errors.categoryId}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Instructor Name"
                            value={formData.instructorName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, instructorName: e.target.value }))}
                            placeholder="Name"
                        />
                        <TextareaField
                            label="Instructor Bio"
                            value={formData.instructorBio}
                            onChange={(e) => setFormData((prev) => ({ ...prev, instructorBio: e.target.value }))}
                            placeholder="Brief biography..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectField
                            label="Level"
                            options={levelOptions}
                            value={formData.level}
                            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                        />
                        <InputField
                            label="Duration"
                            value={formData.duration}
                            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g., 12h 30m"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Original Price"
                            type="number"
                            required
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                            error={errors.originalPrice}
                        />
                        <InputField
                            label="Rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                        />
                        <InputField
                            label="Lecture Count"
                            type="number"
                            value={formData.lectureCount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lectureCount: e.target.value }))}
                        />
                    </div>

                    <InputField
                        label="Thumbnail URL"
                        type="url"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                        placeholder="https://example.com/thumbnail.jpg"
                    />

                    <InputField
                        label="Direct URL"
                        type="url"
                        required
                        value={formData.directUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, directUrl: e.target.value }))}
                        placeholder="Direct course URL"
                        error={errors.directUrl}
                    />

                    <InputField
                        label="Affiliate URL"
                        type="url"
                        value={formData.affiliateUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, affiliateUrl: e.target.value }))}
                        placeholder="Affiliate link (optional)"
                    />

                    <div className="flex gap-6 pt-2">
                        <SwitchField
                            label="Active"
                            description="Show on site"
                            checked={formData.isActive}
                            onChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                        />
                        <SwitchField
                            label="Featured"
                            description="Show on homepage"
                            checked={formData.isFeatured}
                            onChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Course"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setDeleteId(null)}
                            disabled={isDeleting}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="btn bg-rose-500 hover:bg-rose-600 text-white"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </>
                }
            >
                <p className="text-slate-600 dark:text-slate-300">
                    Are you sure you want to delete this course? This will also delete all associated coupons and click data.
                </p>
            </Modal>
        </div>
    );
}

'use client';

/**
 * Platforms Admin Page
 * 
 * CRUD operations for course platforms
 */

import { useState, useEffect, useCallback } from 'react';
import { DataTable, Column, Modal, InputField, SwitchField } from '@/components/admin';

interface Platform {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    baseUrl: string;
    isActive: boolean;
    createdAt: string;
    _count: { courses: number };
}

interface PaginatedResponse {
    data: Platform[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function PlatformsPage() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
    const [search, setSearch] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Delete modal
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logoUrl: '',
        baseUrl: '',
        isActive: true,
    });

    const fetchPlatforms = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.set('query', search);

            const res = await fetch(`/api/admin/platforms?${params}`);
            const data: PaginatedResponse = await res.json();
            setPlatforms(data.data);
            setPagination((prev) => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to fetch platforms:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, search]);

    useEffect(() => {
        fetchPlatforms();
    }, [fetchPlatforms]);

    const openCreateModal = () => {
        setEditingPlatform(null);
        setFormData({ name: '', slug: '', logoUrl: '', baseUrl: '', isActive: true });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (platform: Platform) => {
        setEditingPlatform(platform);
        setFormData({
            name: platform.name,
            slug: platform.slug,
            logoUrl: platform.logoUrl || '',
            baseUrl: platform.baseUrl,
            isActive: platform.isActive,
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const url = editingPlatform
                ? `/api/admin/platforms/${editingPlatform.id}`
                : '/api/admin/platforms';
            const method = editingPlatform ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    logoUrl: formData.logoUrl || null,
                }),
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
            fetchPlatforms();
        } catch (error) {
            console.error('Failed to save platform:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/admin/platforms/${deleteId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete');
            }

            setDeleteId(null);
            fetchPlatforms();
        } catch (error) {
            console.error('Failed to delete platform:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const columns: Column<Platform>[] = [
        {
            key: 'name',
            header: 'Platform',
            sortable: true,
            render: (platform) => (
                <div className="flex items-center gap-3">
                    {platform.logoUrl ? (
                        <img
                            src={platform.logoUrl}
                            alt={platform.name}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {platform.name[0]}
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-xs text-slate-500">{platform.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'baseUrl',
            header: 'URL',
            render: (platform) => (
                <a
                    href={platform.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm"
                >
                    {platform.baseUrl}
                </a>
            ),
        },
        {
            key: '_count.courses',
            header: 'Courses',
            sortable: true,
            render: (platform) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700">
                    {platform._count.courses}
                </span>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (platform) => (
                <span
                    className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${platform.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }
                    `}
                >
                    {platform.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Platforms
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage course platforms like Udemy, Coursera, etc.
                    </p>
                </div>
                <button onClick={openCreateModal} className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Platform
                </button>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search platforms..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={platforms}
                keyExtractor={(p) => p.id}
                isLoading={isLoading}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
                }}
                actions={(platform) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openEditModal(platform)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit"
                        >
                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setDeleteId(platform.id)}
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
                title={editingPlatform ? 'Edit Platform' : 'Add Platform'}
                size="md"
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
                            {isSubmitting ? 'Saving...' : editingPlatform ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            setFormData((prev) => ({
                                ...prev,
                                name,
                                slug: prev.slug || generateSlug(name),
                            }));
                        }}
                        placeholder="e.g., Udemy"
                        error={errors.name}
                    />
                    <InputField
                        label="Slug"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g., udemy"
                        hint="URL-friendly identifier"
                        error={errors.slug}
                    />
                    <InputField
                        label="Base URL"
                        required
                        type="url"
                        value={formData.baseUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, baseUrl: e.target.value }))}
                        placeholder="https://www.udemy.com"
                        error={errors.baseUrl}
                    />
                    <InputField
                        label="Logo URL"
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        error={errors.logoUrl}
                    />
                    <SwitchField
                        label="Active"
                        description="Inactive platforms won't show on the site"
                        checked={formData.isActive}
                        onChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                    />
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Platform"
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
                    Are you sure you want to delete this platform? This action cannot be undone.
                    All associated courses will also be deleted.
                </p>
            </Modal>
        </div>
    );
}

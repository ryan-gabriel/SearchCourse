'use client';

/**
 * Data Table Component
 * 
 * Reusable table with pagination, sorting, and search
 */

import { useState } from 'react';

export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    onSort?: (key: string, order: 'asc' | 'desc') => void;
    emptyMessage?: string;
    actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends object>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    pagination,
    onSort,
    emptyMessage = 'No data available',
    actions,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string) => {
        const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(newOrder);
        onSort?.(key, newOrder);
    };

    const getValue = (item: T, key: string): unknown => {
        return key.split('.').reduce((obj: unknown, k) => {
            if (obj && typeof obj === 'object' && k in obj) {
                return (obj as Record<string, unknown>)[k];
            }
            return undefined;
        }, item);
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`
                                        px-4 py-3 text-left font-semibold
                                        text-slate-600 dark:text-slate-300
                                        ${col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none' : ''}
                                        ${col.className || ''}
                                    `}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && sortKey === col.key && (
                                            <span className="text-indigo-500">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3">
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ml-auto" />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${col.className || ''}`}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : String(getValue(item, col.key) ?? '-')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => pagination.onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="
                                    px-3 py-1.5 rounded-lg text-sm font-medium
                                    bg-white dark:bg-slate-700
                                    border border-slate-200 dark:border-slate-600
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:bg-slate-100 dark:hover:bg-slate-600
                                    transition-colors
                                "
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => pagination.onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="
                                    px-3 py-1.5 rounded-lg text-sm font-medium
                                    bg-white dark:bg-slate-700
                                    border border-slate-200 dark:border-slate-600
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:bg-slate-100 dark:hover:bg-slate-600
                                    transition-colors
                                "
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Sort Dropdown Client Component
 * 
 * Client-side component for handling sort selection with navigation.
 */

'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface SortOption {
    value: string;
    label: string;
}

interface SortDropdownProps {
    currentSort: string;
    options: SortOption[];
    currentFilters: Record<string, string | undefined>;
}

// Helper to build filter URL (moved to client)
function buildFilterUrl(
    currentParams: Record<string, string | undefined>,
    updates: Record<string, string | undefined>
): string {
    const params = new URLSearchParams();

    // Merge current params with updates
    const merged = { ...currentParams, ...updates };

    // Remove undefined/empty values
    Object.entries(merged).forEach(([key, value]) => {
        if (value && value !== '') {
            params.set(key, value);
        }
    });

    const queryString = params.toString();
    return queryString ? `/courses?${queryString}` : '/courses';
}

export function SortDropdown({ currentSort, options, currentFilters }: SortDropdownProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        const url = buildFilterUrl(currentFilters, { sortBy, sortOrder, page: '1' });
        router.push(url);
    };

    return (
        <div className="relative">
            <select
                defaultValue={currentSort}
                onChange={handleChange}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
}

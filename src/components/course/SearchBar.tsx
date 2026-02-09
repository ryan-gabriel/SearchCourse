/**
 * Search Bar Component
 * 
 * Debounced search input with filter options.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    placeholder = 'Search courses...',
    className,
}: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set('query', value);
            } else {
                params.delete('query');
            }
            params.set('page', '1');
            router.push(`/courses?${params.toString()}`);
        }, 300),
        [searchParams, router]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setQuery('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('query');
        params.set('page', '1');
        router.push(`/courses?${params.toString()}`);
    };

    return (
        <div className={cn('relative', className)}>
            <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cn(
                        'w-full pl-12 pr-20 py-3.5 rounded-xl',
                        'bg-white dark:bg-gray-800',
                        'border border-gray-200 dark:border-gray-700',
                        'text-gray-900 dark:text-white placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                        'transition-all duration-200'
                    )}
                />
                <div className="absolute right-2 flex items-center gap-1">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            showFilters
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                        aria-label="Toggle filters"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <FilterPanel />
                </div>
            )}
        </div>
    );
}

function FilterPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentLevel = searchParams.get('level') || '';
    const currentSort = searchParams.get('sortBy') || 'date';
    const hasDiscount = searchParams.get('hasDiscount') === 'true';

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`/courses?${params.toString()}`);
    };

    const levels = [
        { value: '', label: 'All Levels' },
        { value: 'BEGINNER', label: 'Beginner' },
        { value: 'INTERMEDIATE', label: 'Intermediate' },
        { value: 'ADVANCED', label: 'Advanced' },
    ];

    const sortOptions = [
        { value: 'date', label: 'Newest' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'price', label: 'Price: Low to High' },
        { value: 'discount', label: 'Biggest Discount' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Level
                </label>
                <select
                    value={currentLevel}
                    onChange={(e) => updateFilter('level', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                            {level.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort By */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                </label>
                <select
                    value={currentSort}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Discount Toggle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discounts
                </label>
                <button
                    onClick={() => updateFilter('hasDiscount', hasDiscount ? '' : 'true')}
                    className={cn(
                        'w-full px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                        hasDiscount
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    )}
                >
                    {hasDiscount ? '✓ On Sale Only' : 'Show All'}
                </button>
            </div>
        </div>
    );
}

'use client';

/**
 * SearchForm Component
 * 
 * A functional search bar that navigates to the courses page with a query parameter.
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchFormProps {
    placeholder?: string;
    className?: string;
    buttonText?: string;
}

export function SearchForm({
    placeholder = "What do you want to learn today? (e.g. React, Python)",
    className = "",
    buttonText = "Search",
}: SearchFormProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/courses?query=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/courses');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative group ${className}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="pl-4 text-gray-400">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
                />
                <button
                    type="submit"
                    className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
}

export default SearchForm;

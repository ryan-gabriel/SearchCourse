'use client';

/**
 * Form Field Components
 * 
 * Reusable form inputs with consistent styling
 */

import { forwardRef } from 'react';

interface BaseFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
}

interface InputFieldProps extends BaseFieldProps, React.InputHTMLAttributes<HTMLInputElement> { }

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, required, hint, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 rounded-xl
                        bg-white dark:bg-slate-700
                        border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-600'}
                        text-slate-900 dark:text-white
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                        transition-colors
                        ${className}
                    `}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-rose-500">{error}</p>
                )}
            </div>
        );
    }
);
InputField.displayName = 'InputField';

interface TextareaFieldProps extends BaseFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({ label, error, required, hint, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 rounded-xl
                        bg-white dark:bg-slate-700
                        border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-600'}
                        text-slate-900 dark:text-white
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                        transition-colors
                        resize-y min-h-[100px]
                        ${className}
                    `}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-rose-500">{error}</p>
                )}
            </div>
        );
    }
);
TextareaField.displayName = 'TextareaField';

interface SelectFieldProps extends BaseFieldProps, React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, error, required, hint, options, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                <select
                    ref={ref}
                    className={`
                        w-full px-4 py-2.5 rounded-xl
                        bg-white dark:bg-slate-700
                        border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-600'}
                        text-slate-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                        transition-colors
                        ${className}
                    `}
                    {...props}
                >
                    <option value="">Select...</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {hint && !error && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-rose-500">{error}</p>
                )}
            </div>
        );
    }
);
SelectField.displayName = 'SelectField';

interface SwitchFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export function SwitchField({ label, checked, onChange, description }: SwitchFieldProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`
                    relative w-11 h-6 rounded-full transition-colors
                    ${checked ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                        transition-transform
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
}

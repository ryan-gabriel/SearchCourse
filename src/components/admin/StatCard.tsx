/**
 * Stat Card Component
 * 
 * Dashboard statistic card with icon and trend indicator
 */

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    className?: string;
}

export function StatCard({ title, value, icon, trend, subtitle, className = '' }: StatCardProps) {
    return (
        <div
            className={`
                p-6 rounded-2xl
                bg-white dark:bg-slate-800/50
                border border-slate-200 dark:border-slate-700
                shadow-sm hover:shadow-md
                transition-all duration-300
                ${className}
            `}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className="mt-2 flex items-center gap-1">
                            <span
                                className={`
                                    text-sm font-medium
                                    ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}
                                `}
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>
                <div
                    className="
                        p-3 rounded-xl
                        bg-gradient-to-br from-indigo-500 to-purple-500
                        text-white shadow-lg shadow-indigo-500/25
                    "
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

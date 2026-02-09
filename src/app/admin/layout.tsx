import { Sidebar } from '@/components/admin';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata = {
    title: 'Admin Dashboard',
    description: 'SearchCourse Admin Dashboard',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}

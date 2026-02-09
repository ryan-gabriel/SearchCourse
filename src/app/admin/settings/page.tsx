'use client';

import { useState, useEffect } from 'react';
import { InputField, TextareaField } from '@/components/admin';
import { Save, Loader2, Settings } from 'lucide-react';

interface SiteSettings {
    coursesVerified: string;
    studentSavings: string;
    uptime: string;
    acceptanceRate: string;
    hostingCost: string;
    priceMonitoring: string;
    missionTitle: string;
    missionSubtitle: string;
    missionDescription: string;
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<SiteSettings>({
        coursesVerified: '',
        studentSavings: '',
        uptime: '',
        acceptanceRate: '',
        hostingCost: '',
        priceMonitoring: '',
        missionTitle: '',
        missionSubtitle: '',
        missionDescription: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    coursesVerified: data.coursesVerified || '500+',
                    studentSavings: data.studentSavings || '$45k+',
                    uptime: data.uptime || '99.9%',
                    acceptanceRate: data.acceptanceRate || '4%',
                    hostingCost: data.hostingCost || '$0.00',
                    priceMonitoring: data.priceMonitoring || '24/7',
                    missionTitle: data.missionTitle || 'Signal over Noise',
                    missionSubtitle: data.missionSubtitle || '',
                    missionDescription: data.missionDescription || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to update');
            // Toast success?
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Site Settings
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Global configuration and content
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </button>
            </div>

            <div className="grid gap-8">
                {/* Stats Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        Homepage Stats
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField
                            label="Courses Verified"
                            value={formData.coursesVerified}
                            onChange={(e) => setFormData({ ...formData, coursesVerified: e.target.value })}
                        />
                        <InputField
                            label="Student Savings"
                            value={formData.studentSavings}
                            onChange={(e) => setFormData({ ...formData, studentSavings: e.target.value })}
                        />
                        <InputField
                            label="Uptime"
                            value={formData.uptime}
                            onChange={(e) => setFormData({ ...formData, uptime: e.target.value })}
                        />
                        <InputField
                            label="Acceptance Rate"
                            value={formData.acceptanceRate}
                            onChange={(e) => setFormData({ ...formData, acceptanceRate: e.target.value })}
                        />
                        <InputField
                            label="Hosting Cost"
                            value={formData.hostingCost}
                            onChange={(e) => setFormData({ ...formData, hostingCost: e.target.value })}
                        />
                        <InputField
                            label="Price Monitoring"
                            value={formData.priceMonitoring}
                            onChange={(e) => setFormData({ ...formData, priceMonitoring: e.target.value })}
                        />
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        Mission Content
                    </h2>
                    <div className="space-y-4">
                        <InputField
                            label="Title"
                            value={formData.missionTitle}
                            onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                        />
                        <InputField
                            label="Subtitle"
                            value={formData.missionSubtitle}
                            onChange={(e) => setFormData({ ...formData, missionSubtitle: e.target.value })}
                        />
                        <TextareaField
                            label="Mission Description"
                            value={formData.missionDescription}
                            onChange={(e) => setFormData({ ...formData, missionDescription: e.target.value })}
                            rows={5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

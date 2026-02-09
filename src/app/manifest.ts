/**
 * manifest.ts - PWA manifest
 */

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SearchCourse',
        short_name: 'SearchCourse',
        description: 'Discover the best online course deals',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#6366f1',
        icons: [
            {
                src: '/seo/192x192-icon.ico',
                sizes: '192x192',
                type: 'image/x-icon',
            },
            {
                src: '/seo/512x512-icon.ico',
                sizes: '512x512',
                type: 'image/x-icon',
            },
        ],
    };
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Farm Manager',
        default: 'Farm Manager - Modern Farm Management System',
    },
    description: 'Comprehensive farm management system for tracking fields, crops, inventory, and activities',
    keywords: ['farm management', 'agriculture', 'crop tracking', 'inventory management', 'farm operations'],
    authors: [{ name: 'Ian Macharia' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://your-domain.com',
        siteName: 'Farm Manager',
        title: 'Farm Manager - Modern Farm Management System',
        description: 'Comprehensive farm management system for tracking fields, crops, inventory, and activities',
    },
};

import { Suspense } from 'react';
import { getAllFieldsAction } from "@/infrastructure/http/actions/field.actions";
import { FieldsList } from "@/components/fields/fields-list";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fields',
    description: 'Manage your farm fields and plots',
};

// Loading fallback component
function FieldsListSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="h-8 w-[200px] bg-muted rounded" />
                <div className="h-10 w-[120px] bg-muted rounded" />
            </div>
            <div className="h-[400px] w-full bg-muted rounded" />
        </div>
    );
}

// Async component that fetches data
async function FieldsListAsync() {
    const result = await getAllFieldsAction();
    const fields = result.data || [];
    return <FieldsList initialFields={fields} />;
}

export default function FieldsPage() {
    return (
        <Suspense fallback={<FieldsListSkeleton />}>
            <FieldsListAsync />
        </Suspense>
    );
}

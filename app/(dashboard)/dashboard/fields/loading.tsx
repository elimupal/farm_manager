export default function FieldsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-32 bg-muted rounded"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
                <div className="h-10 w-32 bg-muted rounded"></div>
            </div>

            {/* Fields Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-muted rounded"></div>
                            <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-muted rounded"></div>
                                <div className="h-4 w-16 bg-muted rounded"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-24 bg-muted rounded"></div>
                                <div className="h-4 w-12 bg-muted rounded"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-muted rounded"></div>
                                <div className="h-4 w-20 bg-muted rounded"></div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 pt-2 border-t">
                            <div className="h-6 w-16 bg-muted rounded-full"></div>
                            <div className="h-6 w-24 bg-muted rounded-full"></div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-2">
                            <div className="h-9 flex-1 bg-muted rounded"></div>
                            <div className="h-9 w-9 bg-muted rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

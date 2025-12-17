export default function FieldDetailLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
                <div className="h-10 w-32 bg-muted rounded"></div>
            </div>

            {/* Field Info Card Skeleton */}
            <div className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-6 w-40 bg-muted rounded"></div>
                    <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-muted rounded-lg"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-20 bg-muted rounded"></div>
                                <div className="h-4 w-32 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-2">
                        <div className="h-5 w-32 bg-muted rounded"></div>
                        <div className="h-8 w-16 bg-muted rounded"></div>
                    </div>
                ))}
            </div>

            {/* Activities Skeleton */}
            <div className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-6 w-40 bg-muted rounded"></div>
                    <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-32 bg-muted rounded"></div>
                                <div className="h-3 w-24 bg-muted rounded"></div>
                            </div>
                            <div className="h-3 w-20 bg-muted rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

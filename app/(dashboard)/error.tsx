'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[70vh] p-4">
            <Card className="w-full max-w-lg border-destructive/50 shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-destructive/10 p-4 rounded-full">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
                        <CardDescription>
                            We encountered an unexpected error while loading this page
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-mono text-destructive font-medium">
                            {error.message || 'An unexpected error occurred'}
                        </p>
                    </div>
                    {error.digest && (
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                Error ID: <code className="bg-muted px-2 py-1 rounded">{error.digest}</code>
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button onClick={reset} variant="default" className="w-full sm:w-auto">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Go to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
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
        console.error('Field error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-lg border-destructive/50">
                <CardHeader className="space-y-3">
                    <div className="flex justify-center">
                        <div className="bg-destructive/10 p-3 rounded-full">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-xl">Failed to Load Field</CardTitle>
                        <CardDescription className="mt-2">
                            We couldn't load the field data you requested
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-mono text-destructive">
                            {error.message || 'An unexpected error occurred'}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-center">
                    <Button onClick={reset} variant="default">
                        Try Again
                    </Button>
                    <Button onClick={() => router.push('/dashboard/fields')} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Fields
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

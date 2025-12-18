'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-muted/50 to-muted">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-6 rounded-full">
                            <Search className="h-16 w-16 text-primary" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold">Page Not Found</CardTitle>
                        <CardDescription className="text-base">
                            The page you're looking for doesn't exist or has been moved
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-mono font-bold text-destructive text-lg">404</span>
                            <span className="mx-2">·</span>
                            This could be a typo in the URL or the page may have been removed
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-5 w-5" />
                            Go to Dashboard
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

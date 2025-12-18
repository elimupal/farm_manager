import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, Droplets, Sprout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllFieldsAction } from "@/infrastructure/http/actions/field.actions";

export default async function FieldDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Get all fields and find the one we need
    const result = await getAllFieldsAction();

    if (!result.success || !result.data) {
        notFound();
    }

    const field = result.data.find(f => f.id === id);

    if (!field) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{field.name}</h1>
                    <p className="text-muted-foreground">Field Details</p>
                </div>
                <Link href="/dashboard/fields">
                    <Button variant="outline">Back to Fields</Button>
                </Link>
            </div>

            {/* Field Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Field Information</CardTitle>
                    <CardDescription>Basic details about this field</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{field.location || "Not specified"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Ruler className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Area</p>
                                <p className="font-medium">{field.area} hectares</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Droplets className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Irrigation</p>
                                <p className="font-medium">{field.irrigationType || "Not specified"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Sprout className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Soil Type</p>
                                <p className="font-medium">{field.soilType || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                        <Badge variant={field.status === "ACTIVE" ? "default" : "secondary"}>
                            {field.status}
                        </Badge>
                        <Badge variant="outline">{field.fieldType.replace(/_/g, " ")}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics - Simplified for now */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Plantings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{field.plantingsCount || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={field.status === "ACTIVE" ? "default" : "secondary"}>
                            {field.status}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline">{field.fieldType.replace(/_/g, " ")}</Badge>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { fieldService } from "@/lib/services";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, Droplets, Sprout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FieldDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let field;

    try {
        field = await fieldService.getFieldById(id);
    } catch (error) {
        notFound();
    }

    const stats = await fieldService.getFieldStatistics(id);

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

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Active Plantings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.activePlantings}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Total Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalActivities}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Plantings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{field.plantings.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            {stats.recentActivities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest activities on this field</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{activity.type}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.performedByUser.firstName} {activity.performedByUser.lastName}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(activity.activityDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Plantings */}
            {field.plantings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Plantings</CardTitle>
                        <CardDescription>Crops planted in this field</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {field.plantings.map((planting) => (
                                <div
                                    key={planting.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{planting.crop.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Planted: {new Date(planting.plantingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant={planting.status === "GROWING" ? "default" : "secondary"}>
                                        {planting.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

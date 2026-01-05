"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CropForm } from "@/components/forms/crop-form";
import { PlantingForm } from "@/components/forms/planting-form";
import { deletePlantingAction, harvestPlantingAction } from "@/infrastructure/http/actions/planting.actions";
import { deleteCropAction } from "@/infrastructure/http/actions/crop.actions";
import { PLANTING_STATUS_LABELS, CROP_CATEGORY_LABELS } from "@/core/domain/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Plus, Sprout, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface PlantingsListProps {
    initialData: {
        plantings: any[];
        crops: any[];
        fields: any[];
    };
}

export function PlantingsList({ initialData }: PlantingsListProps) {
    const router = useRouter();
    const [plantings, setPlantings] = useState(initialData.plantings);
    const [crops, setCrops] = useState(initialData.crops);
    const [cropFormOpen, setCropFormOpen] = useState(false);
    const [plantingFormOpen, setPlantingFormOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState<any>(null);
    const [editingPlanting, setEditingPlanting] = useState<any>(null);
    const [harvestingPlanting, setHarvestingPlanting] = useState<any>(null);

    // Pagination state for plantings
    const [plantingsPage, setPlantingsPage] = useState(1);
    const [plantingsPerPage] = useState(9);

    // Pagination state for crops
    const [cropsPage, setCropsPage] = useState(1);
    const [cropsPerPage] = useState(9);

    // Calculate pagination for plantings
    const totalPlantingsPages = Math.ceil(plantings.length / plantingsPerPage);
    const plantingsStartIndex = (plantingsPage - 1) * plantingsPerPage;
    const plantingsEndIndex = plantingsStartIndex + plantingsPerPage;
    const currentPlantings = plantings.slice(plantingsStartIndex, plantingsEndIndex);

    // Calculate pagination for crops
    const totalCropsPages = Math.ceil(crops.length / cropsPerPage);
    const cropsStartIndex = (cropsPage - 1) * cropsPerPage;
    const cropsEndIndex = cropsStartIndex + cropsPerPage;
    const currentCrops = crops.slice(cropsStartIndex, cropsEndIndex);

    async function handleDeletePlanting(id: string) {
        if (!confirm("Are you sure you want to delete this planting record?")) return;

        const result = await deletePlantingAction(id);
        if (result.success) {
            setPlantings(plantings.filter((p) => p.id !== id));
            router.refresh();
        }
    }

    async function handleDeleteCrop(id: string) {
        if (!confirm("Are you sure you want to delete this crop?")) return;

        const result = await deleteCropAction(id);
        if (result.success) {
            setCrops(crops.filter((c) => c.id !== id));
            router.refresh();
        }
    }

    function handleEditCrop(crop: any) {
        setEditingCrop(crop);
        setCropFormOpen(true);
    }

    function handleEditPlanting(planting: any) {
        setEditingPlanting(planting);
        setPlantingFormOpen(true);
    }

    function handleHarvestPlanting(planting: any) {
        setHarvestingPlanting(planting);
    }

    function handleFormClose() {
        setCropFormOpen(false);
        setPlantingFormOpen(false);
        setEditingCrop(null);
        setEditingPlanting(null);
        setHarvestingPlanting(null);
    }

    function handleSuccess() {
        router.refresh();
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Crops & Plantings</h1>
                    <p className="text-muted-foreground">
                        Manage your crop catalog and planting records
                    </p>
                </div>
            </div>

            <Tabs defaultValue="plantings" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="plantings">Plantings</TabsTrigger>
                    <TabsTrigger value="crops">Crop Catalog</TabsTrigger>
                </TabsList>

                {/* Plantings Tab */}
                <TabsContent value="plantings" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setPlantingFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Record Planting
                        </Button>
                    </div>

                    {plantings.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No plantings yet</CardTitle>
                                <CardDescription>
                                    Start by recording your first planting
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => setPlantingFormOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Record Your First Planting
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {currentPlantings.map((planting) => (
                                <Card key={planting.id}>
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="text-xl">{planting.crop.name}</CardTitle>
                                            <CardDescription>{planting.field.name}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {planting.status === "GROWING" && (
                                                    <DropdownMenuItem onClick={() => handleHarvestPlanting(planting)}>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Mark as Harvested
                                                    </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditPlanting(planting)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeletePlanting(planting.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Status:</span>
                                            <Badge
                                                variant={planting.status === "GROWING" ? "default" : planting.status === "HARVESTED" ? "secondary" : "destructive"}
                                            >
                                                {PLANTING_STATUS_LABELS[planting.status as keyof typeof PLANTING_STATUS_LABELS]}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Planted:</span>
                                            <span className="font-medium">
                                                {format(new Date(planting.plantingDate), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        {planting.expectedHarvestDate && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Expected Harvest:</span>
                                                <span className="font-medium">
                                                    {format(new Date(planting.expectedHarvestDate), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        {planting.actualHarvestDate && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Harvested:</span>
                                                <span className="font-medium">
                                                    {format(new Date(planting.actualHarvestDate), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                                            <span className="text-muted-foreground">Planted by:</span>
                                            <span className="font-medium">
                                                {planting.plantedByUser.firstName} {planting.plantedByUser.lastName}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Pagination Controls for Plantings */}
                    {totalPlantingsPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {plantingsStartIndex + 1} to {Math.min(plantingsEndIndex, plantings.length)} of {plantings.length} plantings
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPlantingsPage(p => Math.max(1, p - 1))}
                                    disabled={plantingsPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="text-sm">
                                    Page {plantingsPage} of {totalPlantingsPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPlantingsPage(p => Math.min(totalPlantingsPages, p + 1))}
                                    disabled={plantingsPage === totalPlantingsPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                </TabsContent>

                {/* Crops Catalog Tab */}
                <TabsContent value="crops" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setCropFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Crop
                        </Button>
                    </div>

                    {crops.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No crops in catalog</CardTitle>
                                <CardDescription>
                                    Add crops to your catalog to start planting
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => setCropFormOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Crop
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {currentCrops.map((crop) => (
                                <Card key={crop.id}>
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Sprout className="h-5 w-5 text-primary" />
                                                {crop.name}
                                            </CardTitle>
                                            {crop.variety && (
                                                <CardDescription>{crop.variety}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditCrop(crop)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteCrop(crop.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Category:</span>
                                            <Badge variant="outline">
                                                {CROP_CATEGORY_LABELS[crop.category as keyof typeof CROP_CATEGORY_LABELS]}
                                            </Badge>
                                        </div>
                                        {crop.growthCycleDays && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Growth Cycle:</span>
                                                <span className="font-medium">{crop.growthCycleDays} days</span>
                                            </div>
                                        {crop.scientificName && (
                                            <div className="text-xs text-muted-foreground italic pt-2 border-t">
                                                {crop.scientificName}
                                            </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Pagination Controls for Crops */}
                    {totalCropsPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {cropsStartIndex + 1} to {Math.min(cropsEndIndex, crops.length)} of {crops.length} crops
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCropsPage(p => Math.max(1, p - 1))}
                                    disabled={cropsPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="text-sm">
                                    Page {cropsPage} of {totalCropsPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCropsPage(p => Math.min(totalCropsPages, p + 1))}
                                    disabled={cropsPage === totalCropsPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                </TabsContent>
            </Tabs>

            <CropForm
                open={cropFormOpen}
                onOpenChange={handleFormClose}
                crop={editingCrop}
                onSuccess={handleSuccess}
            />

            <PlantingForm
                open={plantingFormOpen}
                onOpenChange={handleFormClose}
                planting={editingPlanting}
                harvestMode={!!harvestingPlanting}
                harvestingPlanting={harvestingPlanting}
                crops={crops}
                fields={initialData.fields}
                onSuccess={handleSuccess}
            />
        </>
    );
}

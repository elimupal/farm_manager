"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlantingSchema, harvestPlantingSchema, type CreatePlantingFormData, type HarvestPlantingFormData } from "@/infrastructure/http/schemas/planting.schema";
import { createPlantingAction, harvestPlantingAction } from "@/infrastructure/http/actions/planting.actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PlantingFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planting?: any;
    harvestMode?: boolean;
    harvestingPlanting?: any;
    crops: any[];
    fields: any[];
    onSuccess?: () => void;
}

export function PlantingForm({
    open,
    onOpenChange,
    planting,
    harvestMode = false,
    harvestingPlanting,
    crops,
    fields,
    onSuccess
}: PlantingFormProps) {
    const [error, setError] = useState<string>("");
    const isHarvest = harvestMode || !!harvestingPlanting;
    const plantingToHarvest = harvestingPlanting || planting;

    const plantingForm = useForm<CreatePlantingFormData>({
        resolver: zodResolver(createPlantingSchema) as any,
        defaultValues: planting
            ? {
                fieldId: planting.fieldId,
                cropId: planting.cropId,
                plantingDate: new Date(planting.plantingDate) as any,
                expectedHarvestDate: planting.expectedHarvestDate ? new Date(planting.expectedHarvestDate) as any : undefined,
                plantCount: planting.plantCount || undefined,
                notes: planting.notes || "",
            }
            : {
                fieldId: "",
                cropId: "",
                plantingDate: new Date() as any,
                expectedHarvestDate: undefined,
                plantCount: undefined,
                notes: "",
            },
    });

    const harvestForm = useForm<HarvestPlantingFormData>({
        resolver: zodResolver(harvestPlantingSchema) as any,
        defaultValues: {
            harvestDate: new Date() as any,
            actualYield: undefined,
            notes: "",
        },
    });

    const form = isHarvest ? harvestForm : plantingForm;

    async function onSubmitPlanting(data: CreatePlantingFormData) {
        setError("");

        try {
            const result = await createPlantingAction(data as any);

            if (result.success) {
                plantingForm.reset();
                onOpenChange(false);
                onSuccess?.();
            } else {
                setError(result.error || "Operation failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    }

    async function onSubmitHarvest(data: HarvestPlantingFormData) {
        setError("");

        try {
            if (!plantingToHarvest?.id) {
                setError("No planting selected");
                return;
            }

            const result = await harvestPlantingAction(plantingToHarvest.id, data as any);

            if (result.success) {
                harvestForm.reset();
                onOpenChange(false);
                onSuccess?.();
            } else {
                setError(result.error || "Operation failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isHarvest ? "Mark as Harvested" : planting ? "Edit Planting" : "Record New Planting"}
                    </DialogTitle>
                    <DialogDescription>
                        {isHarvest
                            ? "Record the harvest details for this planting"
                            : planting
                                ? "Update the planting information below"
                                : "Record a new planting in your field"}
                    </DialogDescription>
                </DialogHeader>

                {isHarvest ? (
                    <Form {...harvestForm}>
                        <form onSubmit={harvestForm.handleSubmit(onSubmitHarvest)} className="space-y-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {plantingToHarvest && (
                                <div className="bg-muted p-3 rounded-md space-y-1">
                                    <p className="text-sm font-medium">
                                        {plantingToHarvest.crop?.name || "Unknown Crop"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Field: {plantingToHarvest.field?.name || "Unknown Field"}
                                    </p>
                                </div>
                            )}

                            <FormField
                                control={harvestForm.control}
                                name="harvestDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harvest Date *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={harvestForm.control}
                                name="actualYield"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Actual Yield (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="150.5"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseFloat(value) : undefined);
                                                }}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={harvestForm.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Harvest notes..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={harvestForm.formState.isSubmitting}>
                                    {harvestForm.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Recording...
                                        </>
                                    ) : (
                                        "Record Harvest"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <Form {...plantingForm}>
                        <form onSubmit={plantingForm.handleSubmit(onSubmitPlanting)} className="space-y-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={plantingForm.control}
                                    name="fieldId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Field *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select field" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {fields.map((f) => (
                                                        <SelectItem key={f.id} value={f.id}>
                                                            {f.name} ({f.area} ha)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={plantingForm.control}
                                    name="cropId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Crop *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select crop" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {crops.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.name} {c.variety && `(${c.variety})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={plantingForm.control}
                                    name="plantingDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Planting Date *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={plantingForm.control}
                                    name="expectedHarvestDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expected Harvest Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value ? new Date(value) : undefined);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={plantingForm.control}
                                name="plantCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plant Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1000"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseInt(value) : undefined);
                                                }}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Number of plants or seedlings
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={plantingForm.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Additional planting details..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={plantingForm.formState.isSubmitting}>
                                    {plantingForm.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {planting ? "Updating..." : "Creating..."}
                                        </>
                                    ) : planting ? (
                                        "Update Planting"
                                    ) : (
                                        "Record Planting"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

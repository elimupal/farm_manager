"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCropSchema, type CreateCropFormData } from "@/infrastructure/http/schemas/crop.schema";
import { createCropAction, updateCropAction } from "@/infrastructure/http/actions/crop.actions";
import { CropCategory, CROP_CATEGORY_LABELS } from "@/core/domain/constants";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CropFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    crop?: any;
    onSuccess?: () => void;
}

export function CropForm({ open, onOpenChange, crop, onSuccess }: CropFormProps) {
    const [error, setError] = useState<string>("");

    const form = useForm<CreateCropFormData>({
        resolver: zodResolver(createCropSchema),
        defaultValues: crop
            ? {
                name: crop.name,
                category: crop.category,
                variety: crop.variety || "",
                description: crop.description || "",
                growthCycleDays: crop.growthCycleDays || undefined,
            }
            : {
                name: "",
                category: CropCategory.VEGETABLES,
                variety: "",
                description: "",
                growthCycleDays: undefined,
            },
    });

    async function onSubmit(data: CreateCropFormData) {
        setError("");

        try {
            const result = crop
                ? await updateCropAction(crop.id, data as any)
                : await createCropAction(data as any);

            if (result.success) {
                form.reset();
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
                    <DialogTitle>{crop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
                    <DialogDescription>
                        {crop
                            ? "Update the crop information below"
                            : "Add a new crop to your catalog"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Crop Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tomato" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(CROP_CATEGORY_LABELS).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {label}
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
                                control={form.control}
                                name="variety"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variety</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cherry" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="growthCycleDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Growth Cycle (days)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="90"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseInt(value) : undefined);
                                                }}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scientific Name / Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Solanum lycopersicum" {...field} />
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {crop ? "Updating..." : "Creating..."}
                                    </>
                                ) : crop ? (
                                    "Update Crop"
                                ) : (
                                    "Create Crop"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

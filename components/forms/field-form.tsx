"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldSchema, type FieldFormData } from "@/lib/validations/field.schema";
import { createFieldAction, updateFieldAction } from "@/infrastructure/http/actions/field.actions";
import { FieldType, FieldStatus, FIELD_TYPE_LABELS, FIELD_STATUS_LABELS } from "@/core/domain/constants";
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

interface FieldFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    field?: any;
    onSuccess?: () => void;
}

export function FieldForm({ open, onOpenChange, field, onSuccess }: FieldFormProps) {
    const [error, setError] = useState<string>("");

    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: field
            ? {
                name: field.name,
                fieldType: field.fieldType,
                area: field.area,
                location: field.location || "",
                soilType: field.soilType || "",
                irrigationType: field.irrigationType || "",
                status: field.status,
            }
            : {
                name: "",
                fieldType: "OPEN_FIELD",
                area: 0,
                location: "",
                soilType: "",
                irrigationType: "",
                status: "ACTIVE",
            },
    });

    async function onSubmit(data: FieldFormData) {
        setError("");

        try {
            // TODO: Get farmId from context/session - using seeded farm for now
            const farmId = "cmjbsf2wd0062qixx3x24nxgh";

            const result = field
                ? await updateFieldAction(field.id, data as any)
                : await createFieldAction({ ...data, farmId } as any);

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
                    <DialogTitle>{field ? "Edit Field" : "Add New Field"}</DialogTitle>
                    <DialogDescription>
                        {field
                            ? "Update the field information below"
                            : "Add a new field to your farm"}
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
                                        <FormLabel>Field Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="North Field" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fieldType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
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
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area (hectares) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="10.5"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(FIELD_STATUS_LABELS).map(([key, label]) => (
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

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location / GPS Coordinates</FormLabel>
                                    <FormControl>
                                        <Input placeholder="40.7128° N, 74.0060° W" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="soilType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Soil Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Loamy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="irrigationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Irrigation Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Drip irrigation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                        {field ? "Updating..." : "Creating..."}
                                    </>
                                ) : field ? (
                                    "Update Field"
                                ) : (
                                    "Create Field"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

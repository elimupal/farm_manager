"use client";

import { useState } from "react";
import { FieldForm } from "@/components/forms/field-form";
import { deleteField } from "@/actions/field.actions";
import { FIELD_TYPES, FIELD_STATUS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface FieldsListProps {
    initialFields: any[];
}

export function FieldsList({ initialFields }: FieldsListProps) {
    const router = useRouter();
    const [fields, setFields] = useState(initialFields);
    const [formOpen, setFormOpen] = useState(false);
    const [editingField, setEditingField] = useState<any>(null);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this field?")) return;

        const result = await deleteField(id);
        if (result.success) {
            setFields(fields.filter((f) => f.id !== id));
            router.refresh();
        }
    }

    function handleEdit(field: any) {
        setEditingField(field);
        setFormOpen(true);
    }

    function handleFormClose() {
        setFormOpen(false);
        setEditingField(null);
    }

    function handleSuccess() {
        router.refresh();
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fields</h1>
                    <p className="text-muted-foreground">
                        Manage your farm fields and plots
                    </p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                </Button>
            </div>

            {fields.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No fields yet</CardTitle>
                        <CardDescription>
                            Get started by adding your first field
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Field
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fields.map((field) => (
                        <Card key={field.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">{field.name}</CardTitle>
                                    <CardDescription>
                                        {FIELD_TYPES[field.fieldType as keyof typeof FIELD_TYPES]}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(field)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(field.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Area:</span>
                                    <span className="font-medium">{field.area} hectares</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge
                                        variant={field.status === "ACTIVE" ? "default" : "secondary"}
                                    >
                                        {FIELD_STATUS[field.status as keyof typeof FIELD_STATUS]}
                                    </Badge>
                                </div>
                                {field.soilType && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Soil:</span>
                                        <span className="font-medium">{field.soilType}</span>
                                    </div>
                                )}
                                {field.irrigationType && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Irrigation:</span>
                                        <span className="font-medium">{field.irrigationType}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm pt-2 border-t">
                                    <span className="text-muted-foreground">Plantings:</span>
                                    <span className="font-medium">{field._count.plantings}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <FieldForm
                open={formOpen}
                onOpenChange={handleFormClose}
                field={editingField}
                onSuccess={handleSuccess}
            />
        </>
    );
}

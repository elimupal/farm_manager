"use client";

import { useState } from "react";
import { FieldForm } from "@/components/forms/field-form";
import { deleteFieldAction } from "@/infrastructure/http/actions/field.actions";
import { FIELD_STATUS_LABELS } from "@/core/domain/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 3x3 grid

    // Calculate pagination
    const totalPages = Math.ceil(fields.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFields = fields.slice(startIndex, endIndex);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this field?")) return;

        const result = await deleteFieldAction(id);
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
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {currentFields.map((field) => (
                            <Card key={field.id}>
                                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{field.name}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => router.push(`/dashboard/fields/${field.id}`)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleEdit(field)}
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(field.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
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
                                            {FIELD_STATUS_LABELS[field.status as keyof typeof FIELD_STATUS_LABELS]}
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i + 1}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(i + 1)}
                                            isActive={currentPage === i + 1}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
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

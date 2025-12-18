import { getAllFieldsAction } from "@/infrastructure/http/actions/field.actions";
import { FieldsList } from "@/components/fields/fields-list";

export const metadata: { title: string; description: string } = {
    title: "Fields | Farm Manager",
    description: "Manage your farm fields and plots",
};

export default async function FieldsPage() {
    const result = await getAllFieldsAction();
    const fields = result.data || [];

    return <FieldsList initialFields={fields} />;
}

import type { ReactNode } from "react";
import { Button } from "@/shared/ui/Button";

interface EditPanelProps {
  title: string;
  saving?: boolean;
  onSave(): void | Promise<void>;
  onCancel(): void;
  children: ReactNode;
  saveText?: string;
  savingText?: string;
}

export function EditPanel({
  title,
  saving,
  onSave,
  onCancel,
  children,
  saveText = "Сохранить",
  savingText = "Сохранение...",
}: EditPanelProps) {
  return (
    <div className="space-y-3 border rounded p-3">
      <h1 className="text-xl font-semibold">{title}</h1>
      {children}
      <div className="flex gap-2">
        <Button
          onClick={() => onSave()}
          variant="primary"
          size="sm"
          loading={saving}>
          {saving ? savingText : saveText}
        </Button>
        <Button onClick={onCancel} size="sm">
          Отмена
        </Button>
      </div>
    </div>
  );
}

export default EditPanel;

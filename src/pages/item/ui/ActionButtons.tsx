import { memo } from "react";
import { Button } from "@/shared/ui/Button";

interface ActionButtonsProps {
  onEdit(): void;
  onDelete(): void;
  deleting?: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  onEdit,
  onDelete,
  deleting,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onEdit} size="xs">
        Редактировать
      </Button>
      <Button onClick={onDelete} disabled={deleting} variant="danger" size="xs">
        {deleting ? "Удаление..." : "Удалить"}
      </Button>
    </div>
  );
});

export default ActionButtons;

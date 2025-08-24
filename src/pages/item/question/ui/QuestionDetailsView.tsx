import { memo } from "react";
import { CodeBlock } from "@/shared/ui/CodeBlock";

export type QuestionDetailsViewProps = {
  title: string;
  description: string;
  attachedCode?: string;
  actions?: React.ReactNode;
};

export const QuestionDetailsView = memo(function QuestionDetailsView({
  title,
  description,
  attachedCode,
  actions,
}: QuestionDetailsViewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold flex-1 break-words">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {description}
      </p>
      {attachedCode && <CodeBlock code={attachedCode} />}
    </div>
  );
});

export default QuestionDetailsView;

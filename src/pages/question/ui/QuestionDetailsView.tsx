import { CodeBlock } from "../../../shared/ui/CodeBlock";

export type QuestionDetailsViewProps = {
  title: string;
  description: string;
  attachedCode?: string;
};

export default function QuestionDetailsView({
  title,
  description,
  attachedCode,
}: QuestionDetailsViewProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {description}
      </p>
      {attachedCode && <CodeBlock code={attachedCode} />}
    </div>
  );
}

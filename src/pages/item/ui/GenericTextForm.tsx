import type {
  ReactNode,
  TextareaHTMLAttributes,
  FormEventHandler,
} from "react";
import { memo } from "react";

type UncontrolledProps = {
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
  value?: never;
  onChange?: never;
};

type ControlledProps = {
  value: string;
  onChange(v: string): void;
  textareaProps?: never;
};

export type GenericTextFormProps = (UncontrolledProps | ControlledProps) & {
  placeholder?: string;
  submitLabel?: string;
  pending?: boolean;
  error?: string | null;
  success?: string | null;
  onSubmit?: () => void; // для контролируемого варианта
  formSubmit?: FormEventHandler<HTMLFormElement>; // для варианта с form + react-hook-form
  header?: ReactNode;
  disableIfEmpty?: boolean;
  rows?: number;
  className?: string;
};

export const GenericTextForm = memo(function GenericTextForm(
  props: GenericTextFormProps
) {
  const {
    placeholder = "",
    submitLabel = "Отправить",
    pending,
    error,
    success,
    header,
    disableIfEmpty = true,
    rows = 4,
    className = "space-y-2",
  } = props;

  const contentValue =
    "value" in props
      ? props.value
      : props.textareaProps && "value" in props.textareaProps
      ? (props.textareaProps as TextareaHTMLAttributes<HTMLTextAreaElement>)
          .value
      : undefined;
  const isEmpty =
    disableIfEmpty && (!contentValue || !String(contentValue).trim());
  const buttonDisabled = !!pending || (disableIfEmpty && isEmpty);

  const textarea = (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
      {...("value" in props
        ? {
            value: props.value,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChange && props.onChange(e.target.value),
          }
        : props.textareaProps)}
    />
  );

  const body = (
    <>
      {header}
      {textarea}
      <div className="flex items-center gap-2">
        <button
          type={props.formSubmit ? "submit" : "button"}
          onClick={props.formSubmit ? undefined : props.onSubmit}
          disabled={buttonDisabled}
          className="px-3 py-1.5 border rounded disabled:opacity-50 bg-white dark:bg-neutral-800">
          {pending ? "..." : submitLabel}
        </button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {success && <span className="text-green-600 text-sm">{success}</span>}
      </div>
    </>
  );

  if (props.formSubmit) {
    return (
      <form className={className} onSubmit={props.formSubmit}>
        {body}
      </form>
    );
  }
  return <div className={className}>{body}</div>;
});

export default GenericTextForm;

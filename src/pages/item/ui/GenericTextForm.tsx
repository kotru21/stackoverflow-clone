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

type TextAreaFieldBaseProps = {
  rows: number;
  placeholder: string;
  className?: string;
};

type TextAreaFieldProps = TextAreaFieldBaseProps & {
  value?: string;
  onChange?: (v: string) => void;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

const TextAreaField = memo(function TextAreaField(props: TextAreaFieldProps) {
  const { rows, placeholder, className } = props;
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className={
        className ??
        "w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
      }
      {...(props.textareaProps
        ? props.textareaProps
        : {
            value: props.value,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChange && props.onChange(e.target.value),
          })}
    />
  );
});

type FormControlsProps = {
  pending?: boolean;
  submitLabel: string;
  disabled: boolean;
  error?: string | null;
  success?: string | null;
  type: "button" | "submit";
  onClick?: () => void;
};

const FormControls = memo(function FormControls({
  pending,
  submitLabel,
  disabled,
  error,
  success,
  type,
  onClick,
}: FormControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type={type}
        onClick={type === "button" ? onClick : undefined}
        disabled={disabled}
        className="px-3 py-1.5 border rounded disabled:opacity-50 bg-white dark:bg-neutral-800">
        {pending ? "..." : submitLabel}
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      {success && <span className="text-green-600 text-sm">{success}</span>}
    </div>
  );
});

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

  const textAreaEl =
    "value" in props ? (
      <TextAreaField
        rows={rows}
        placeholder={placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    ) : (
      <TextAreaField
        rows={rows}
        placeholder={placeholder}
        textareaProps={props.textareaProps}
      />
    );

  const controls = (
    <FormControls
      pending={pending}
      submitLabel={submitLabel}
      disabled={buttonDisabled}
      error={error}
      success={success}
      type={props.formSubmit ? "submit" : "button"}
      onClick={props.formSubmit ? undefined : props.onSubmit}
    />
  );

  if (props.formSubmit) {
    return (
      <form className={className} onSubmit={props.formSubmit}>
        {header}
        {textAreaEl}
        {controls}
      </form>
    );
  }
  return (
    <div className={className}>
      {header}
      {textAreaEl}
      {controls}
    </div>
  );
});

export default GenericTextForm;

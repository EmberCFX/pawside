"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Every control is label-associated (no placeholder-as-label), errors are wired
 * with aria-describedby + aria-invalid, and focus states are visible. These are
 * used identically by the booking flow, the contact form, and the dashboard.
 */
const controlClasses =
  "w-full rounded-button border-0 bg-white px-3.5 py-2.5 text-[0.9375rem] text-navy-900 " +
  "ring-1 ring-inset ring-navy-900/12 transition-shadow duration-200 " +
  "placeholder:text-sand-400 hover:ring-navy-900/20 " +
  "focus:outline-none focus:ring-2 focus:ring-mint-600 disabled:bg-sand-100 disabled:text-sand-500";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-navy-800">
        {label}
        {required ? (
          <span className="ml-1 text-mint-700" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? <span className="ml-1.5 font-normal text-sand-500">Optional</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error ? (
        <p id={hintId} className="text-xs leading-relaxed text-sand-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "id">) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          className={cn(controlClasses, invalid && "ring-red-500 focus:ring-red-500")}
          {...props}
        />
      )}
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  error,
  required,
  optional,
  className,
  rows = 4,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "id">) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          className={cn(controlClasses, "resize-y", invalid && "ring-red-500 focus:ring-red-500")}
          {...props}
        />
      )}
    </Field>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  optional,
  className,
  options,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  options: { value: string; label: string }[];
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className" | "id">) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            required={required}
            className={cn(
              controlClasses,
              "appearance-none pr-10",
              invalid && "ring-red-500 focus:ring-red-500",
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-500"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </Field>
  );
}

/**
 * Segmented option chips used throughout the estimator and booking flow.
 * Rendered as real radio inputs so arrow-key navigation works natively.
 */
export function OptionChips<T extends string | number>({
  name,
  legend,
  options,
  value,
  onChange,
  className,
  columns = "auto",
}: {
  name: string;
  legend: string;
  options: { value: T; label: string; detail?: string; note?: string }[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
  columns?: "auto" | 2 | 3 | 4;
}) {
  const columnClass = {
    auto: "flex flex-wrap gap-2.5",
    2: "grid grid-cols-2 gap-2.5",
    3: "grid grid-cols-2 gap-2.5 sm:grid-cols-3",
    4: "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
  }[columns];

  return (
    <fieldset className={className}>
      <legend className="mb-3 text-[0.8125rem] font-medium text-navy-800">{legend}</legend>
      <div className={columnClass}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={String(option.value)}
              className={cn(
                "group relative flex cursor-pointer flex-col justify-center rounded-button px-4 py-3 text-left transition-all duration-200 ease-brand ring-1 ring-inset",
                selected
                  ? "bg-navy-900 text-white ring-navy-900 shadow-soft"
                  : "bg-white text-navy-800 ring-navy-900/12 hover:ring-navy-900/28 hover:bg-sand-50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span className="text-[0.9375rem] font-medium leading-tight">{option.label}</span>
              {option.detail ? (
                <span
                  className={cn(
                    "mt-0.5 text-xs leading-tight",
                    selected ? "text-navy-100/75" : "text-sand-600",
                  )}
                >
                  {option.detail}
                </span>
              ) : null}
              {option.note ? (
                <span
                  className={cn(
                    "mt-1.5 inline-flex w-fit rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
                    selected ? "bg-white/15 text-mint-300" : "bg-mint-50 text-mint-700",
                  )}
                >
                  {option.note}
                </span>
              ) : null}
              <span className="pointer-events-none absolute inset-0 rounded-button ring-2 ring-mint-600 opacity-0 transition-opacity peer-focus-visible:opacity-100" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Multi-select toggle used for add-ons and weekday pickers. */
export function ToggleChip({
  checked,
  onChange,
  label,
  detail,
  price,
  icon: Icon,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  detail?: string;
  price?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-card p-4 text-left transition-all duration-200 ease-brand ring-1 ring-inset",
        checked
          ? "bg-mint-50 ring-mint-500/60"
          : "bg-white ring-navy-900/10 hover:ring-navy-900/22",
        disabled && "cursor-not-allowed opacity-55",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ring-1 ring-inset transition-all duration-200",
          checked ? "bg-mint-600 text-white ring-mint-600" : "bg-white ring-navy-900/18",
        )}
        aria-hidden="true"
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2.5 6.2l2.2 2.2 4.8-4.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-navy-900">
            {Icon ? <Icon className="h-4 w-4 text-navy-600" strokeWidth={1.75} aria-hidden="true" /> : null}
            {label}
          </span>
          {price ? (
            <span className="shrink-0 text-[0.8125rem] font-semibold tabular text-navy-800">
              {price}
            </span>
          ) : null}
        </span>
        {detail ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-sand-600">{detail}</span>
        ) : null}
      </span>

      <span className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-mint-600 opacity-0 transition-opacity peer-focus-visible:opacity-100" />
    </label>
  );
}

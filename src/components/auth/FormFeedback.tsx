import { AlertCircle } from 'lucide-react';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-danger mt-1.5 text-xs">
      {message}
    </p>
  );
}

export function FormBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-inner bg-danger-bg text-danger flex gap-3 px-4 py-3 text-sm leading-5"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

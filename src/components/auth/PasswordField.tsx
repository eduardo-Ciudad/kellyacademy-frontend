import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

type PasswordFieldProps = {
  id: string;
  registration: UseFormRegisterReturn;
  autoComplete: 'current-password' | 'new-password';
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
};

export function PasswordField({
  id,
  registration,
  autoComplete,
  invalid,
  describedBy,
  placeholder = 'Digite sua senha',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...registration}
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        invalid={invalid}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className="pr-13"
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        className="focus-ring text-text-3 hover:text-text absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full"
      >
        {visible ? (
          <EyeOff size={19} aria-hidden="true" />
        ) : (
          <Eye size={19} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

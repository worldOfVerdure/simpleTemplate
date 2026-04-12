//!Important note: “touched” means “this field has entered validation flow,” not strictly “user
//!blurred it.”
'use client';

import * as Form from '@radix-ui/react-form';
import { useId, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  FormStateContext,
  type FormStateContextValue,
  FormThemeContext,
  type FormThemeContextValue
} from '../context/formContext';
import type { FormErrors, FormRootProps, FormTouchedFields } from '../helpers/types';

export function FormRoot({
  className,
  classes,
  tokens,
  style,
  rulebook,
  validationMessages,
  children,
  ...props
}: FormRootProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<FormTouchedFields>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const formId = useId().replace(/:/g, '');
  /*Populates the state context value with all necessary state and handlers, memoizing to prevent
  unnecessary re-renders of consuming components. Note that the handlers are defined inline here to
  have access to the form state setters, and are included in the memo dependencies to ensure they
  update when the state they rely on changes. The theme context value is also memoized, but only
  includes the classes since that's the only theme‑related value we have at the moment.
  */
  const stateValue = useMemo<FormStateContextValue>(
    () => ({
      formId,
      focusedField,
      touchedFields,
      errors,
      validationMessages,
      rulebook,
      setFocusedField,
      setTouchedWrapper: (fieldName, touched) => {
        setTouchedFields((previous) => {
          if (previous[fieldName] === touched) {
            return previous;
          }

          return {
            ...previous,
            [fieldName]: touched
          };
        });
      },
      setErrorWrapper: (fieldName, message) => {
        setErrors((previous) => {
          if (previous[fieldName] === message) {
            return previous;
          }

          return {
            ...previous,
            [fieldName]: message
          };
        });
      }
    }),
    [errors, focusedField, formId, touchedFields, validationMessages, rulebook]
  );

  const themeValue = useMemo<FormThemeContextValue>(() => ({ classes }), [classes]);

  return (
    <FormThemeContext value={themeValue}>
      <FormStateContext value={stateValue}>
        <Form.Root className={cn(classes?.form, className)} style={{ ...tokens, ...style }} {...props}>
          {children}
        </Form.Root>
      </FormStateContext>
    </FormThemeContext>
  );
}

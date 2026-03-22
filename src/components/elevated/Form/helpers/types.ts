import * as Form from '@radix-ui/react-form';
import { ComponentProps, CSSProperties, FocusEvent, InvalidEvent, ReactNode } from 'react';

export type FormFieldState = string;

export type FormErrors = Record<string, string | null>;

export type FormTouchedFields = Record<string, boolean>;

export type FormSlots = {
  form?: string;
  fieldset?: string;
  legend?: string;
  field?: string;
  fieldHeader?: string;
  label?: string;
  control?: string;
  textarea?: string;
  message?: string;
  actions?: string;
};
/*
What control.validity is and where it comes from:
The validity property is a browser‑provided ValidityState object on form controls (HTMLInputElement,
HTMLTextAreaElement, HTMLSelectElement). It exposes boolean flags such as valueMissing,
typeMismatch, tooShort, patternMismatch, badInput, and valid that reflect the element’s
constraint‑validation state.

*/
export type ValidationMessageRule =
  | 'containsScriptTag'
  | 'containsHtml'
  | 'valueMissing'
  | 'typeMismatch'
  | 'tooShort'
  | 'patternMismatch';

export type FormValidationMessages = Record<string, Partial<Record<ValidationMessageRule, string>>>;

export type RulebookGetValidationMessageArgs = {
  fieldName: string;
  control: HTMLInputElement | HTMLTextAreaElement;
  validationMessages?: FormValidationMessages;
};

export type RulebookGetValidationFlowStatusArgs = {
  fieldName: string;
  focusedField: string | null;
  touchedFields: FormTouchedFields;
  errors: FormErrors;
};

export type RulebookGetFieldMessageArgs = {
  fieldName: string;
  errors: FormErrors;
};

export type FormBehaviorRulebook = {
  rulebookName: string;
  getValidationMessage: (args: RulebookGetValidationMessageArgs) => string | null;
  getValidationFlowStatus: (args: RulebookGetValidationFlowStatusArgs) => FormFieldState;
  getFieldMessage: (args: RulebookGetFieldMessageArgs) => string;
  shouldClearOnEmptyBlur?: (value: string) => boolean;
};

export type FormRootProps = ComponentProps<typeof Form.Root> & {
  classes?: FormSlots;
  tokens?: CSSProperties;
  rulebook: FormBehaviorRulebook;
  validationMessages?: FormValidationMessages;
};

export type FormFieldProps = Omit<ComponentProps<typeof Form.Field>, 'name'> & {
  name: string;
};

export type FormFieldHeaderProps = {
  className?: string;
  children: ReactNode;
};

export type FormLabelProps = Omit<ComponentProps<typeof Form.Label>, 'htmlFor'> & {
  fieldName: string;
};

export type FormLegendProps = ComponentProps<'legend'>;

export type FormMessageProps = {
  fieldName: string;
  className?: string;
};

export type FormActionsProps = ComponentProps<'div'>;

export type SharedControlProps = {
  name: string;
  className?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInvalid?: (event: InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

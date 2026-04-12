'use client';

import { createContext, useContext } from 'react';
import {
  FormBehaviorRulebook,
  FormErrors,
  FormRootProps,
  FormSlots,
  FormTouchedFields
} from '../helpers/types';

export type FormStateContextValue = {
  formId: string;
  focusedField: string | null;
  touchedFields: FormTouchedFields;
  errors: FormErrors;
  validationMessages?: FormRootProps['validationMessages'];
  rulebook: FormBehaviorRulebook;
  setFocusedField: (fieldName: string | null) => void;
  setTouchedWrapper: (fieldName: string, touched: boolean) => void;
  setErrorWrapper: (fieldName: string, message: string | null) => void;
};

export type FormThemeContextValue = {
  classes?: FormSlots;
};

export const FormStateContext = createContext<FormStateContextValue | null>(null);
export const FormThemeContext = createContext<FormThemeContextValue>({});

export const useFormState = () => {
  const context = useContext(FormStateContext);

  if (!context) {
    throw new Error('Form primitives and controls must be used within FormRoot');
  }

  return context;
};

export const useFormTheme = () => useContext(FormThemeContext);

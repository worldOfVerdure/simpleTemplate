import type { ChangeEvent, FocusEvent, InvalidEvent } from 'react';
import { useFormState } from '../../context/formContext';

const isEmpty = (value: string) => value.trim().length === 0;

export const useControlValidationHandlers = (name: string) => {
  const {
    focusedField,
    touchedFields,
    setFocusedField,
    setTouchedWrapper,
    setErrorWrapper,
    validationMessages,
    rulebook
  } = useFormState();

  const handleFocus = () => {
    setFocusedField(name);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (focusedField === name) {
      setFocusedField(null);
    }

    const shouldClear = rulebook.shouldClearOnEmptyBlur?.(event.currentTarget.value) ?? isEmpty(event.currentTarget.value);

    if (shouldClear && !touchedFields[name])
      return;//Skip validation and the rest of handleBlur

    setTouchedWrapper(name, true);
    setErrorWrapper(
      name,
      rulebook.getValidationMessage({
        fieldName: name,
        control: event.currentTarget,
        validationMessages
      })
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouchedWrapper(name, true);
    setErrorWrapper(
      name,
      rulebook.getValidationMessage({
        fieldName: name,
        control: event.currentTarget,
        validationMessages
      })
    );
  };

  const handleInvalid = (event: InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouchedWrapper(name, true);
    setErrorWrapper(
      name,
      rulebook.getValidationMessage({
        fieldName: name,
        control: event.currentTarget,
        validationMessages
      })
    );
  };

  return {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
    onInvalid: handleInvalid
  };
};

import type { ChangeEvent, FocusEvent, InvalidEvent } from 'react';
import { useFormState } from '../../context/formContext';

const isEmpty = (value: string) => value.trim().length === 0;

const typingInputTypes = new Set(['insertText', 'insertCompositionText', 'deleteContentBackward', 'deleteContentForward']);
const pasteLikeInputTypes = new Set(['insertFromPaste', 'insertFromDrop', 'insertReplacementText']);

const isTypingInputType = (inputType: string | null | undefined) => {
  if (!inputType) {
    return false;
  }

  return typingInputTypes.has(inputType);
};

const isPasteLikeInputType = (inputType: string | null | undefined) => {
  if (!inputType) {
    return false;
  }

  return pasteLikeInputTypes.has(inputType);
};

const hasAutocompleteEnabled = (control: HTMLInputElement | HTMLTextAreaElement) => {
  const autocomplete = control.autocomplete.trim().toLowerCase();

  return autocomplete !== 'off';
};

const isFormControl = (control: Element): control is HTMLInputElement | HTMLTextAreaElement =>
  (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) && control.name.length > 0;

export const useUncontrolValidationHandlers = (name: string) => {
  const {
    focusedField,
    touchedFields,
    setFocusedField,
    setTouchedWrapper,
    setErrorWrapper,
    validationMessages,
    rulebook
  } = useFormState();

  const syncTouchedControlErrors = (form: HTMLFormElement | null) => {
    if (!form) {
      return;
    }

    const controls = Array.from(form.elements).filter(isFormControl);

    controls.forEach((control) => {
      const fieldName = control.name;

      if (!touchedFields[fieldName]) {
        return;
      }

      setErrorWrapper(
        fieldName,
        rulebook.getValidationMessage({
          fieldName,
          control,
          validationMessages
        })
      );
    });
  };

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

    syncTouchedControlErrors(event.currentTarget.form);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const control = event.currentTarget;
    const inputType = (event.nativeEvent as InputEvent).inputType ?? null;
    const looksLikeAutofillEvent = !inputType && !isEmpty(control.value) && hasAutocompleteEnabled(control);

    // Already-touched field re-autofilled: re-validate immediately since blur may not fire.
    if (touchedFields[name] && looksLikeAutofillEvent) {
      setErrorWrapper(
        name,
        rulebook.getValidationMessage({ fieldName: name, control, validationMessages })
      );
      syncTouchedControlErrors(control.form);
      return;
    }

    if (
      touchedFields[name] ||
      isEmpty(control.value) ||
      !hasAutocompleteEnabled(control) ||
      (!inputType && !looksLikeAutofillEvent) ||
      isTypingInputType(inputType) ||
      isPasteLikeInputType(inputType)
    ) return;

    setTouchedWrapper(name, true);
    setErrorWrapper(
      name,
      rulebook.getValidationMessage({
        fieldName: name,
        control,
        validationMessages
      })
    );

    syncTouchedControlErrors(control.form);
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

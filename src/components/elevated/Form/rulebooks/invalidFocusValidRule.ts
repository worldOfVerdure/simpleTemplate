//Rulebook in one sentence: A centralized behavioral policy engine that governs the UX lifecycle of
//every form control.
/*
This file controls when/how state transitions happen (not styling). The rulebook is passed to the
FormRoot component and is used by the form's internal logic to determine how to handle validation
messages, field states, and other behaviors based on user interactions and the current state of the
form.
*/
import {
  FormBehaviorRulebook,
  FormValidationMessages,
  RulebookGetValidationMessageArgs
} from '@/components/elevated/Form/helpers/types';

const scriptTagPattern = /<\s*script\b/i;
const htmlTagPattern = /<\s*\/?\s*[a-z][^>]*>/i;

const getMessageFromValidity = ( //*See below for explanation
  fieldName: string,
  control: HTMLInputElement | HTMLTextAreaElement,
  validationMessages?: FormValidationMessages
) => {
  const fieldMessages = validationMessages?.[fieldName];

  if (scriptTagPattern.test(control.value)) {
    return fieldMessages?.containsScriptTag ?? 'Script tags are not allowed';
  }

  if (htmlTagPattern.test(control.value)) {
    return fieldMessages?.containsHtml ?? 'HTML tags are not allowed';
  }

  if (control.validity.valid) {
    return null;
  }

  if (control.validity.valueMissing && fieldMessages?.valueMissing) {
    return fieldMessages.valueMissing;
  }

  if (control.validity.typeMismatch && fieldMessages?.typeMismatch) {
    return fieldMessages.typeMismatch;
  }

  if (control.validity.tooShort && fieldMessages?.tooShort) {
    return fieldMessages.tooShort;
  }

  if (control.validity.patternMismatch && fieldMessages?.patternMismatch) {
    return fieldMessages.patternMismatch;
  }

  return control.validationMessage || 'Please check this field';
};

export const invalidFocusValid: FormBehaviorRulebook = {
  rulebookName: ' focus + valid + invalid ',
  getValidationMessage: ({ fieldName, control, validationMessages }: RulebookGetValidationMessageArgs) =>
    getMessageFromValidity(fieldName, control, validationMessages),//~See below for explanation
  getValidationFlowStatus: ({ fieldName, focusedField, touchedFields, errors }) => {
    // if (focusedField === fieldName) {
    //   return 'focus';
    // }

    if (!touchedFields[fieldName]) {
      return 'idle';
    }

    return errors[fieldName] ? 'invalid' : 'valid';
  },
  getFieldMessage: ({ fieldName, errors }) => {
    if (!errors[fieldName]) {
      return '\u00A0';
    }

    return errors[fieldName] ?? '\u00A0';
  },
  shouldClearOnEmptyBlur: (value: string) => value.trim().length === 0
} as const;

/*
  *Optional so the rulebook can work in both modes:
  1) With custom per-field messages provided.
  2) Without any custom message config (fallback to native)
*/

/*
  ~getValidationMessage is responsible for determining the validation message to show for a given
  field based on its current validity state. It checks the validity of the control and returns the
  appropriate message based on the type of validation error. It first looks for custom messages
  provided in the validationMessages config for the specific field and error type, and if none are
  found, it falls back to the browser's default validation message or a generic message.

  The reason we pass fieldName, control, and validationMessages as arguments is to give the
  rulebook the necessary context to determine the correct message. The rulebook is designed to be
  flexible and work with different forms and validation configurations, so it needs access to the
  field's name, the actual form control element to check its validity, and any custom validation
  messages that may have been provided.
*/

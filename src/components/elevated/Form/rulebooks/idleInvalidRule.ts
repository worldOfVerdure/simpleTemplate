import {
  FormBehaviorRulebook,
  FormValidationMessages,
  RulebookGetValidationMessageArgs
} from '@/components/elevated/Form/helpers/types';

const scriptTagPattern = /<\s*script\b/i;
const htmlTagPattern = /<\s*\/?\s*[a-z][^>]*>/i;

const getMessageFromValidity = (
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

export const idleInvalidRule: FormBehaviorRulebook = {
  rulebookName: ' idle + invalid only ',
  getValidationMessage: ({ fieldName, control, validationMessages }: RulebookGetValidationMessageArgs) =>
    getMessageFromValidity(fieldName, control, validationMessages),
  getValidationFlowStatus: ({ fieldName, touchedFields, errors }) => {
    if (!touchedFields[fieldName]) {
      return 'idle';
    }

    return errors[fieldName] ? 'invalid' : 'idle';
  },
  getFieldMessage: ({ fieldName, errors }) => {
    if (!errors[fieldName]) {
      return '\u00A0';
    }

    return errors[fieldName] ?? '\u00A0';
  },
  shouldClearOnEmptyBlur: () => false
} as const;

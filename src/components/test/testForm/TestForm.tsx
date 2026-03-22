'use client';

import { useState } from 'react';
import { Button } from '@/components/primitives/Button';
import {
  EmailControl,
  Fieldset,
  FormActions,
  FormField,
  FormFieldHeader,
  FormLabel,
  FormLegend,
  FormMessage,
  FormRoot,
  TextControl,
  TextareaControl
} from '@/components/elevated/Form';
import { SectionHeading } from '../reuseables';
import { idleInvalidRule, invalidFocusValid } from '@/components/elevated/Form/rulebooks';
import styles from './styles/testForm.module.css';

const namePattern = "^[A-Za-z ,.'\\-]+$";

const validationMessages = {
  name: {
    valueMissing: 'Please enter your name',
    patternMismatch: "Use letters, spaces, ', or - only",
    containsHtml: 'HTML tags are not allowed',
    containsScriptTag: 'Script tags are not allowed'
  },
  email: {
    valueMissing: 'Please enter your email',
    typeMismatch: 'Please enter a valid email address',
    containsHtml: 'HTML tags are not allowed',
    containsScriptTag: 'Script tags are not allowed'
  },
  message: {
    valueMissing: 'Please enter a message',
    tooShort: 'Please write at least 10 characters',
    containsHtml: 'HTML tags are not allowed',
    containsScriptTag: 'Script tags are not allowed'
  }
};

export const TestForm = () => {
  const [rulebookName, setRulebookName] = useState(invalidFocusValid.rulebookName);
  const activeRulebook =
    rulebookName === invalidFocusValid.rulebookName ? invalidFocusValid : idleInvalidRule;

  return (
    <>
      <SectionHeading>Uncontrolled Forms</SectionHeading>
      <div className={styles.rulebookSwitcher}>
        <label className={styles.rulebookLabel} htmlFor="rulebook-select">
          Rulebook
        </label>
        <select
          className={styles.rulebookSelect}
          id="rulebook-select"
          value={rulebookName}
          onChange={(event) => setRulebookName(event.target.value)}
        >
          <option value={invalidFocusValid.rulebookName}>({invalidFocusValid.rulebookName})</option>
          <option value={idleInvalidRule.rulebookName}>({idleInvalidRule.rulebookName})</option>
        </select>
      </div>
      <FormRoot
        rulebook={activeRulebook}
        validationMessages={validationMessages}
        classes={{
          form: styles.form,
          fieldset: styles.fieldset,
          legend: styles.legend,
          field: styles.field,
          fieldHeader: styles.fieldHeader,
          label: styles.label,
          control: styles.control,
          textarea: styles.textarea,
          message: styles.message,
          actions: styles.actions
        }}
      >
        <Fieldset>
          <FormLegend>Message Me</FormLegend>

          <FormField name="name">
            <FormFieldHeader>
              <FormLabel fieldName="name">Name *</FormLabel>
              <FormMessage fieldName="name" />
            </FormFieldHeader>
            <TextControl name="name" required autoComplete="name" pattern={namePattern} />
          </FormField>

          <FormField name="email">
            <FormFieldHeader>
              <FormLabel fieldName="email">Email *</FormLabel>
              <FormMessage fieldName="email" />
            </FormFieldHeader>
            <EmailControl name="email" required autoComplete="email" />
          </FormField>

          <FormField name="message">
            <FormFieldHeader>
              <FormLabel fieldName="message">Message *</FormLabel>
              <FormMessage fieldName="message" />
            </FormFieldHeader>
            <TextareaControl name="message" required minLength={10} />
          </FormField>
        </Fieldset>

        <FormActions>
          <Button className={styles.submit} type="submit" size="md">
            Send message
          </Button>
        </FormActions>
      </FormRoot>
    </>
  );
};

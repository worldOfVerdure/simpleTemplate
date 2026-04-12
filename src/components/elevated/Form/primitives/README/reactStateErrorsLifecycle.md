Here is the errors object lifecycle in your form, end-to-end.

1. Initialization (mount)
At first render of [src/components/elevated/Form/primitives/FormRoot.tsx](src/components/elevated/Form/primitives/FormRoot.tsx#L29), React creates:
`const [errors, setErrors] = useState<FormErrors>({});`
So `errors` starts as an empty object.

2. Exposure to the tree
In [src/components/elevated/Form/primitives/FormRoot.tsx](src/components/elevated/Form/primitives/FormRoot.tsx#L37), `errors` is included in `stateValue` (context value).  
In [src/components/elevated/Form/primitives/FormRoot.tsx](src/components/elevated/Form/primitives/FormRoot.tsx#L78), that value is provided via `FormStateContext`, so controls/messages can read it.

3. Mutation entrypoint
`errors` is not mutated directly by controls. They call `setErrorWrapper` from context.  
That wrapper is defined in [src/components/elevated/Form/primitives/FormRoot.tsx](src/components/elevated/Form/primitives/FormRoot.tsx#L58) and updates by field key:
- same value: returns previous object (no state change)
- changed value: returns new object with `[fieldName]: message`

4. When updates happen
In [src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts](src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts#L29), `onBlur` sets error from `rulebook.getValidationMessage(...)`.  
In [src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts](src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts#L42), `onInvalid` does the same.  
In [src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts](src/components/elevated/Form/controls/uncontrolled/useUncontrolValidationHandlers.ts#L25), clear-path sets `null`.

5. React update behavior
When `setErrors` returns a new object, React schedules re-render of `FormRoot`.  
Because `errors` is in the `useMemo` deps for `stateValue` in [src/components/elevated/Form/primitives/FormRoot.tsx](src/components/elevated/Form/primitives/FormRoot.tsx#L71), context value changes and consumers re-render.

6. Consumption after update
Consumers read new `errors` through `useFormState`, then:
- field phase is recalculated in [src/components/elevated/Form/helpers/state.ts](src/components/elevated/Form/helpers/state.ts#L4)
- message text is recalculated in [src/components/elevated/Form/helpers/state.ts](src/components/elevated/Form/helpers/state.ts#L15)
- aria-invalid reflects `errors[name]` in [src/components/elevated/Form/controls/uncontrolled/BaseInputControl.tsx](src/components/elevated/Form/controls/uncontrolled/BaseInputControl.tsx#L42)

7. Reset/end
If field message becomes `null`, key remains present but value is cleared (`null`).  
On unmount of FormRoot, React state is discarded; remount starts again at `{}`.

If you want, I can also map this as a tiny state diagram for one field (`null -> error -> null`) including blur/invalid triggers.

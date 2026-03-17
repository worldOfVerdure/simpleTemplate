# Button Component

`Button` is a styled UI primitive with multiple styling entry points.

## Styling options

The component supports these styling methods:

1. **`variant`**
   - Built-in visual variants: `primary`, `secondary`, `ghost`.

2. **`size`**
   - Built-in sizes: `none`, `sm`, `md`, `lg`.
   - Default: `none` (applies no size class).

3. **`className`**
   - Extra class(es) applied to the root `<button>`.
   - Can include utility classes.

4. **`classes.root`**
   - Slot-based class for the root `<button>`.

5. **`classes.label`**
   - Slot-based class for the inner label `<span>`.

6. **`vars`**
   - CSS custom property overrides for button tokens:
   - `--btn-bg`, `--btn-color`, `--btn-border`, `--btn-radius`, `--btn-px`, `--btn-py`.

7. **`style`**
   - Standard inline style object applied to the root `<button>`.

8. **`unstyled`**
   - When `true`, skips default module classes so styles can be fully controlled externally.

## Priority / merge behavior

- Base styles come from `Button.module.css` (`button`, `variant`, `size`).
- Inline styles from `style`/`vars` are merged into `mergedStyle` and applied to the root button.
- In `mergedStyle`, `vars` is spread after `style`, so on key conflicts `vars` wins.

## Example

```tsx
<Button
  variant="ghost"
  size="md"
  className="myButton"
  classes={{ root: "myButtonRoot", label: "myButtonLabel" }}
  vars={{ '--btn-border': 'var(--color-primary)', '--btn-color': 'var(--color-primary)' }}
  style={{ opacity: 0.95 }}
>
  Token override
</Button>
```

# useMediaQuery Helper Guide

This guide shows how to use the breakpoint helpers in `useMediaQuery.ts`.

## Imports

```tsx
import {
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween
} from '@/lib/useMediaQuery';
```

## useBreakpointUp

Returns `true` when the viewport is at or above the selected breakpoint.

```tsx
'use client';

import { useBreakpointUp } from '@/lib/useMediaQuery';

export function ExampleUp() {
  const isDesktop = useBreakpointUp('lg');

  return isDesktop ? <DesktopNav /> : <MobileNav />;
}
```

## useBreakpointDown

Returns `true` while the viewport is within the selected breakpoint band or smaller.

```tsx
'use client';

import { useBreakpointDown } from '@/lib/useMediaQuery';

export function ExampleDown() {
  const isTabletOrSmaller = useBreakpointDown('md');

  return isTabletOrSmaller ? <CompactFilters /> : <ExpandedFilters />;
}
```

## useBreakpointBetween

Returns `true` only when the viewport is between the start and end breakpoints.

```tsx
'use client';

import { useBreakpointBetween } from '@/lib/useMediaQuery';

export function ExampleBetween() {
  const isTabletBand = useBreakpointBetween('sm', 'lg');

  return isTabletBand ? <TabletLayout /> : <NonTabletLayout />;
}
```

## Notes

- All helpers return a boolean, which makes them ideal for ternary rendering.
- `useBreakpointBetween(start, end)` expects `start` to be less than or equal to `end` in your breakpoint order.
- These helpers call the core `useMediaQuery` hook internally.

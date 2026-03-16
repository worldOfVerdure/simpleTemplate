export const breakpoints = {
    xxs: 0,
    xs: 420,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1920,
    xxxl: 2500
} as const;

export type Breakpoint = keyof typeof breakpoints;

const BREAKPOINT_STEP = 0.02;
const breakpointOrder = Object.keys(breakpoints) as Breakpoint[];

const getBreakpointIndex = (breakpoint: Breakpoint): number =>
  breakpointOrder.indexOf(breakpoint);

const getNextBreakpoint = (breakpoint: Breakpoint): Breakpoint | null => {
  const index = getBreakpointIndex(breakpoint);

  if (index === -1 || index >= breakpointOrder.length - 1) {
    return null;
  }

  return breakpointOrder[index + 1];
};

export const minWidthQuery = (breakpoint: Breakpoint) =>
  `(min-width: ${breakpoints[breakpoint]}px)`;

export const maxWidthQuery = (breakpoint: Breakpoint) => {
  const nextBreakpoint = getNextBreakpoint(breakpoint);

  if (!nextBreakpoint) {
    return '(min-width: 0px)';
  }

  const maxWidth = breakpoints[nextBreakpoint] - BREAKPOINT_STEP;
  return `(max-width: ${maxWidth}px)`;
};

export const betweenWidthQuery = (start: Breakpoint, end: Breakpoint) => {
  const startIndex = getBreakpointIndex(start);
  const endIndex = getBreakpointIndex(end);

  if (startIndex > endIndex) {
    throw new Error(`betweenWidthQuery expected start <= end. Received: ${start} > ${end}.`);
  }

  const nextBreakpoint = getNextBreakpoint(end);

  if (!nextBreakpoint) {
    return minWidthQuery(start);
  }

  const maxWidth = breakpoints[nextBreakpoint] - BREAKPOINT_STEP;
  return `(min-width: ${breakpoints[start]}px) and (max-width: ${maxWidth}px)`;
};

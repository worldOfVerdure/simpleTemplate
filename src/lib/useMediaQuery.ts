"use client";

import { useEffect, useState } from 'react';
import {
	Breakpoint,
	betweenWidthQuery,
	maxWidthQuery,
	minWidthQuery
} from './breakpoints';

type UseMediaQueryOptions = {
	defaultValue?: boolean;
	initializeWithValue?: boolean;
};

const getMatch = (query: string): boolean => {
	if (typeof window === 'undefined') {
		return false;
	}

	return window.matchMedia(query).matches;
};

export function useMediaQuery(
	query: string,
	{ defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
	const [matches, setMatches] = useState<boolean>(() => {
		if (!initializeWithValue || typeof window === 'undefined') {
			return defaultValue;
		}

		return getMatch(query);
	});

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const mediaQueryList = window.matchMedia(query);
		const onChange = () => setMatches(mediaQueryList.matches);

		onChange();
		mediaQueryList.addEventListener('change', onChange);
		return () => mediaQueryList.removeEventListener('change', onChange);
	}, [query]);

	return matches;
}

export function useBreakpointUp(
	breakpoint: Breakpoint,
	options?: UseMediaQueryOptions
): boolean {
	return useMediaQuery(minWidthQuery(breakpoint), options);
}

export function useBreakpointDown(
	breakpoint: Breakpoint,
	options?: UseMediaQueryOptions
): boolean {
	return useMediaQuery(maxWidthQuery(breakpoint), options);
}

export function useBreakpointBetween(
	start: Breakpoint,
	end: Breakpoint,
	options?: UseMediaQueryOptions
): boolean {
	return useMediaQuery(betweenWidthQuery(start, end), options);
}

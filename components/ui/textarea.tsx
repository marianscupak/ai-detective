'use client';

import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { cn } from '@/lib/utils';

export type AutosizeTextareaProps = React.ComponentPropsWithoutRef<
	typeof TextareaAutosize
>;

export const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	AutosizeTextareaProps
>(({ className, ...props }, ref) => {
	return (
		<TextareaAutosize
			ref={ref}
			className={cn(
				'border-input bg-background flex min-h-[2.25rem] w-full rounded-md border px-3 py-2 text-sm',
				'ring-offset-background placeholder:text-muted-foreground',
				'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'resize-none',
				'max-h-40',
				className
			)}
			minRows={1}
			maxRows={8}
			onKeyDown={e => {
				if (e.key === 'Enter' && e.shiftKey) return;

				if (e.key === 'Enter') {
					e.preventDefault();

					const form = e.currentTarget.closest('form');
					if (form) {
						form.requestSubmit();
					}
				}
			}}
			{...props}
		/>
	);
});

Textarea.displayName = 'Textarea';

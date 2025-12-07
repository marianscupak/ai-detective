import React from 'react';

import { cn } from '@/lib/utils';

const baseClassName =
	'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export const CaseTextarea = React.forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
	return (
		<textarea ref={ref} className={cn(baseClassName, className)} {...props} />
	);
});

CaseTextarea.displayName = 'CaseTextarea';

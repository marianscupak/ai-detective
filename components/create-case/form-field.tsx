'use client';

import React from 'react';
import type { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

type FormFieldProps = {
	label: string;
	error?: FieldError;
	className?: string;
	children: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
	label,
	error,
	className,
	children
}) => {
	return (
		<div className={cn('flex flex-col gap-1', className)}>
			<label className="block text-sm font-medium">{label}</label>
			{children}
			{error && <p className="mt-0.5 text-xs text-red-500">{error.message}</p>}
		</div>
	);
};

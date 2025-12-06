'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ArrayItemCardProps = {
	title: string;
	canRemove: boolean;
	onRemoveAction?: () => void;
	className?: string;
	children: React.ReactNode;
};

export const ArrayItemCard: React.FC<ArrayItemCardProps> = ({
	title,
	canRemove,
	onRemoveAction,
	className,
	children
}) => {
	return (
		<div
			className={cn(
				'border-border rounded-md border border-dashed p-3',
				className
			)}
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="text-xs font-semibold tracking-wide uppercase">
					{title}
				</span>
				{canRemove && onRemoveAction && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onRemoveAction}
					>
						Remove
					</Button>
				)}
			</div>
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	);
};

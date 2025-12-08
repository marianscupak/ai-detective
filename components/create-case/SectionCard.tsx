'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SectionCardProps = {
	title: string;
	children: React.ReactNode;
};

export const SectionCard: React.FC<SectionCardProps> = ({
	title,
	children
}) => (
	<Card>
		<CardHeader>
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col gap-4">{children}</CardContent>
	</Card>
);

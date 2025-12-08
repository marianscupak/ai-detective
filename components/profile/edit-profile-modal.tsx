'use client';

import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { updateUserProfile } from '@/server-actions/profile';
import { authClient } from '@/lib/auth-client';
import {
	type UpdateProfileDto,
	updateProfileSchema
} from '@/lib/schema/profile';

const EditProfileModal = () => {
	const [open, setOpen] = useState(false);
	const { data, refetch } = authClient.useSession();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError
	} = useForm<UpdateProfileDto>({
		resolver: zodResolver(updateProfileSchema),
		values: {
			name: data?.user.name ?? ''
		}
	});

	const onSubmit = async (values: UpdateProfileDto) => {
		const data = {
			name: values.name
		};

		try {
			await updateUserProfile(data);
			await refetch();
			setOpen(false);
		} catch (e) {
			const exception = e as Error;
			setError('root', { message: exception.message });
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Pencil className="ml-auto size-4 shrink-0" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} id="edit-profile-form">
					<div className="flex flex-col gap-3">
						<label htmlFor="username">Username</label>
						<Input {...register('name')} />
						<p className="text-xs text-red-500">{errors.name?.message}</p>
					</div>
					<p className="textsm text-red-500">{errors.root?.message}</p>
				</form>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						type="submit"
						form="edit-profile-form"
						disabled={isSubmitting}
					>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileModal;

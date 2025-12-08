'use client';

import { HelpCircle } from 'lucide-react';
import {
	type Dispatch,
	type SetStateAction,
	useState,
	useTransition
} from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage
} from '@/components/ui/form';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage, HintFocus, HintSubtlety } from '@/types/game';
import { requestHint } from '@/server-actions/game';

type HintFormValues = {
	focus: HintFocus;
	subtlety: HintSubtlety;
	message: string;
};

type Props = {
	gameSessionId: string;
	setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
	disabled?: boolean;
};

export const RequestHintDialog = ({
	gameSessionId,
	setMessages,
	disabled
}: Props) => {
	const [isHintPending, startHintTransition] = useTransition();
	const [isHintDialogOpen, setIsHintDialogOpen] = useState(false);

	const form = useForm<HintFormValues>({
		defaultValues: {
			focus: 'general',
			subtlety: 'normal',
			message: ''
		}
	});

	const onSubmitHint = form.handleSubmit(values => {
		if (isHintPending) return;

		startHintTransition(async () => {
			try {
				const result = await requestHint(gameSessionId, {
					message: values.message.trim() || undefined,
					focus: values.focus,
					subtlety: values.subtlety
				});

				if (result?.hintRequestMessage && result?.hintResponseMessage) {
					setMessages(prev => [
						...prev,
						result.hintRequestMessage,
						result.hintResponseMessage
					]);
				}

				form.reset();
				setIsHintDialogOpen(false);
			} catch (error) {
				console.error('Failed to request hint:', error);
			}
		});
	});

	return (
		<Dialog
			open={isHintDialogOpen}
			onOpenChange={open => {
				if (!isHintPending) {
					setIsHintDialogOpen(open);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-start"
					disabled={isHintPending || disabled}
				>
					<HelpCircle className="mr-2 h-4 w-4" />
					Get a Hint
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request a Hint</DialogTitle>
					<DialogDescription>
						Choose what kind of help you want. The Game Master will nudge you
						without spoiling the solution.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={onSubmitHint} className="space-y-4">
						<FormField
							control={form.control}
							name="focus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Hint focus</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isHintPending}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select focus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="general">General guidance</SelectItem>
											<SelectItem value="next-step">What to do next</SelectItem>
											<SelectItem value="evidence">Evidence / clues</SelectItem>
											<SelectItem value="suspect">Suspects</SelectItem>
											<SelectItem value="motive">Motive</SelectItem>
											<SelectItem value="method">
												Method / how it was done
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Tell the Game Master what part of the case you want help
										with.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subtlety"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subtlety</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isHintPending}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select subtlety" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="very-subtle">
												Very subtle (tiny nudge)
											</SelectItem>
											<SelectItem value="normal">Normal hint</SelectItem>
											<SelectItem value="direct">
												More direct (but no spoilers)
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										How strong do you want the hint to be?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Optional note to the Game Master</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g. I'm stuck connecting the timeline, or I'm unsure which suspect to focus on."
											className="h-20 resize-none"
											disabled={isHintPending}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Describe what you&apos;re stuck on (optional).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="mt-4">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsHintDialogOpen(false)}
								disabled={isHintPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isHintPending}>
								{isHintPending ? 'Requesting hint…' : 'Request Hint'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

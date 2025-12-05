import z from 'zod';

export const updateProfileSchema = z.object({
	name: z.string().min(3)
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

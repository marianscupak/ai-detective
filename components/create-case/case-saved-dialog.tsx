import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type CaseSavedDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
};

export const CaseSavedDialog: React.FC<CaseSavedDialogProps> = ({
	open,
	onOpenChange,
	onConfirm
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Case saved successfully</DialogTitle>
				</DialogHeader>
				<p className="text-muted-foreground text-sm">
					Your detective case has been created and stored in the database.
				</p>
				<DialogFooter>
					<Button onClick={onConfirm}>Go to homepage</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

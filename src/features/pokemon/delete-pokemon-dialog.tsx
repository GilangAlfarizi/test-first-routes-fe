import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Pokemon } from "@/types/pokemon";

type DeletePokemonDialogProps = {
	open: boolean;
	pokemon: Pokemon | null;
	isDeleting: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (pokemon: Pokemon) => Promise<void>;
};

export function DeletePokemonDialog({
	open,
	pokemon,
	isDeleting,
	onOpenChange,
	onConfirm,
}: DeletePokemonDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Pokemon</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. The Pokemon will be permanently removed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{pokemon ? (
					<p className="mt-3 text-sm text-muted-foreground">
						You are deleting <span className="font-semibold capitalize">{pokemon.name}</span>{" "}
						(#{pokemon.id}).
					</p>
				) : null}
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button variant="outline">Cancel</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							variant="destructive"
							disabled={!pokemon || isDeleting}
							onClick={() => (pokemon ? onConfirm(pokemon) : Promise.resolve())}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Pokemon, PokemonInput } from "@/types/pokemon";

type PokemonEditDialogProps = {
	open: boolean;
	pokemon: Pokemon | null;
	isSubmitting: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (id: number, input: PokemonInput) => Promise<void>;
};

export function PokemonEditDialog({
	open,
	pokemon,
	isSubmitting,
	onOpenChange,
	onSubmit,
}: PokemonEditDialogProps) {
	const [form, setForm] = useState<PokemonInput>({
		name: "",
		height: 0,
		weight: 0,
		baseExperience: 0,
		image: "",
	});
	const [error, setError] = useState("");

	useEffect(() => {
		if (!pokemon) return;
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setForm({
			name: pokemon.name,
			height: pokemon.height,
			weight: pokemon.weight,
			baseExperience: pokemon.baseExperience,
			image: pokemon.image,
		});
	}, [pokemon]);

	const updateField = (field: keyof PokemonInput, value: string) => {
		if (field === "name" || field === "image") {
			setForm((current) => ({ ...current, [field]: value }));
			return;
		}
		const parsedValue = Number(value);
		setForm((current) => ({ ...current, [field]: Number.isNaN(parsedValue) ? 0 : parsedValue }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!pokemon) return;

		if (!form.name.trim()) {
			setError("Name is required.");
			return;
		}

		if (form.height <= 0 || form.weight <= 0 || form.baseExperience <= 0) {
			setError("Height, weight, and base experience must be positive numbers.");
			return;
		}

		setError("");
		await onSubmit(pokemon.id, {
			...form,
			name: form.name.trim().toLowerCase(),
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Pokemon</DialogTitle>
					<DialogDescription>Update Pokemon data then save your changes.</DialogDescription>
				</DialogHeader>
				<form className="mt-4 space-y-3" onSubmit={handleSubmit}>
					<Input
						placeholder="Name"
						value={form.name}
						onChange={(event) => updateField("name", event.target.value)}
					/>
					<div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
						<Input
							placeholder="Height"
							type="number"
							value={form.height}
							onChange={(event) => updateField("height", event.target.value)}
						/>
						<Input
							placeholder="Weight"
							type="number"
							value={form.weight}
							onChange={(event) => updateField("weight", event.target.value)}
						/>
						<Input
							placeholder="Base Experience"
							type="number"
							value={form.baseExperience}
							onChange={(event) => updateField("baseExperience", event.target.value)}
						/>
					</div>
					<Input
						placeholder="Image URL"
						value={form.image}
						onChange={(event) => updateField("image", event.target.value)}
					/>
					{error ? <p className="text-sm text-destructive">{error}</p> : null}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

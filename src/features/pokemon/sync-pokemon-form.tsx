import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidPokemonId } from "@/features/pokemon/pokemon-helpers";

type SyncPokemonFormProps = {
	isSyncing: boolean;
	onSync: (pokemonId: number) => Promise<void>;
};

export function SyncPokemonForm({ isSyncing, onSync }: SyncPokemonFormProps) {
	const [value, setValue] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!isValidPokemonId(value)) {
			setError("Pokemon ID must be a positive integer.");
			return;
		}

		setError("");
		await onSync(Number(value));
		setValue("");
	};

	return (
		<form className="flex flex-col gap-2 md:flex-row md:items-center" onSubmit={handleSubmit}>
			<div className="w-full md:max-w-80">
				<Input
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder="Enter PokeAPI ID (e.g. 25)"
					inputMode="numeric"
				/>
				{error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
			</div>
			<Button type="submit" disabled={isSyncing}>
				{isSyncing ? "Syncing..." : "Sync Pokemon"}
			</Button>
		</form>
	);
}

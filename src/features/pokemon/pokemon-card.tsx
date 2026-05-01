import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pokemonPlaceholderImage } from "@/features/pokemon/pokemon-helpers";
import type { Pokemon } from "@/types/pokemon";

type PokemonCardProps = {
	pokemon: Pokemon;
	onView: (id: number) => void;
	onEdit: (pokemon: Pokemon) => void;
	onDelete: (pokemon: Pokemon) => void;
};

export function PokemonCard({ pokemon, onView, onEdit, onDelete }: PokemonCardProps) {
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="capitalize">{pokemon.name}</CardTitle>
					<Badge variant="outline">#{pokemon.id}</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="overflow-hidden rounded-2xl border border-border bg-muted">
					<img
						src={pokemon.image || pokemonPlaceholderImage}
						alt={pokemon.name}
						className="h-40 w-full object-contain"
						onError={(event) => {
							event.currentTarget.src = pokemonPlaceholderImage;
						}}
					/>
				</div>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<p>
						<span className="text-muted-foreground">Height:</span> {pokemon.height}
					</p>
					<p>
						<span className="text-muted-foreground">Weight:</span> {pokemon.weight}
					</p>
					<p className="col-span-2">
						<span className="text-muted-foreground">Base EXP:</span>{" "}
						{pokemon.baseExperience}
					</p>
				</div>
			</CardContent>
			<CardFooter className="flex flex-wrap gap-2">
				<Button variant="outline" onClick={() => onView(pokemon.id)}>
					View
				</Button>
				<Button variant="secondary" onClick={() => onEdit(pokemon)}>
					Edit
				</Button>
				<Button variant="destructive" onClick={() => onDelete(pokemon)}>
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
}

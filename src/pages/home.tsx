import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { pokemonApi } from "@/lib/api";
import type { Pokemon, PokemonInput } from "@/types/pokemon";
import {
	DeletePokemonDialog,
	PokemonCard,
	PokemonDetailDrawer,
	PokemonEditDialog,
	PokemonEmptyState,
	PokemonErrorState,
	PokemonGridSkeleton,
	SyncPokemonForm,
	toFriendlyApiMessage,
} from "../features/pokemon";

export function PokemonPage() {
	const { toast } = useToast();
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [isLoadingList, setIsLoadingList] = useState(false);
	const [listError, setListError] = useState("");

	const [isSyncing, setIsSyncing] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
		null,
	);

	const [isEditOpen, setIsEditOpen] = useState(false);
	const [pokemonToEdit, setPokemonToEdit] = useState<Pokemon | null>(null);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [pokemonToDelete, setPokemonToDelete] = useState<Pokemon | null>(null);

	const fetchPokemons = useCallback(async () => {
		setIsLoadingList(true);
		setListError("");
		try {
			const response = await pokemonApi.getPokemons();
			setPokemons(response);
		} catch (error) {
			setListError(
				toFriendlyApiMessage(error, "Failed to fetch Pokemon list."),
			);
		} finally {
			setIsLoadingList(false);
		}
	}, []);

	useEffect(() => {
		void fetchPokemons();
	}, [fetchPokemons]);

	const openDetail = (id: number) => {
		setSelectedPokemonId(id);
		setIsDetailOpen(true);
	};

	const openEdit = (pokemon: Pokemon) => {
		setPokemonToEdit(pokemon);
		setIsEditOpen(true);
	};

	const openDelete = (pokemon: Pokemon) => {
		setPokemonToDelete(pokemon);
		setIsDeleteOpen(true);
	};

	const handleSync = async (pokemonId: number) => {
		setIsSyncing(true);
		try {
			await pokemonApi.syncPokemonById(pokemonId);
			toast({
				title: "Pokemon synced",
				description: `Pokemon with ID ${pokemonId} was synced successfully.`,
				variant: "default",
			});
			await fetchPokemons();
		} catch (error) {
			toast({
				title: "Failed to sync Pokemon",
				description: toFriendlyApiMessage(error, "Sync request failed."),
				variant: "destructive",
			});
		} finally {
			setIsSyncing(false);
		}
	};

	const handleUpdate = async (id: number, input: PokemonInput) => {
		setIsUpdating(true);
		try {
			await pokemonApi.updatePokemon(id, input);
			toast({
				title: "Pokemon updated",
				description: "Pokemon data has been updated.",
				variant: "default",
			});
			setIsEditOpen(false);
			setPokemonToEdit(null);
			await fetchPokemons();
		} catch (error) {
			toast({
				title: "Failed to update Pokemon",
				description: toFriendlyApiMessage(error, "Update request failed."),
				variant: "destructive",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async (pokemon: Pokemon) => {
		setIsDeleting(true);
		try {
			await pokemonApi.deletePokemon(pokemon.id);
			toast({
				title: "Pokemon deleted",
				description: `${pokemon.name} has been removed.`,
				variant: "default",
			});
			setIsDeleteOpen(false);
			setPokemonToDelete(null);
			if (selectedPokemonId === pokemon.id) {
				setIsDetailOpen(false);
				setSelectedPokemonId(null);
			}
			await fetchPokemons();
		} catch (error) {
			toast({
				title: "Failed to delete Pokemon",
				description: toFriendlyApiMessage(error, "Delete request failed."),
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const sortedPokemons = useMemo(
		() => [...pokemons].sort((a, b) => a.id - b.id),
		[pokemons],
	);

	return (
		<main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8 max-sm:px-4">
			<header className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Pokemon CRUD Dashboard
				</h1>
				<p className="text-muted-foreground">
					Manage Pokemon data synced from backend `/pokemon` APIs.
				</p>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>Sync Pokemon</CardTitle>
					<CardDescription>
						Add a Pokemon using PokeAPI numeric ID with `POST
						/pokemon/sync/:id`.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SyncPokemonForm isSyncing={isSyncing} onSync={handleSync} />
				</CardContent>
			</Card>

			<section className="space-y-4">
				<div className="flex items-center justify-between gap-2">
					<h2 className="text-xl font-semibold">Pokemon List</h2>
					<Button variant="outline" onClick={() => void fetchPokemons()}>
						Refresh
					</Button>
				</div>

				{isLoadingList ? <PokemonGridSkeleton /> : null}
				{!isLoadingList && listError ? (
					<PokemonErrorState
						message={listError}
						onRetry={() => void fetchPokemons()}
					/>
				) : null}
				{!isLoadingList && !listError && sortedPokemons.length === 0 ? (
					<PokemonEmptyState />
				) : null}

				{!isLoadingList && !listError && sortedPokemons.length > 0 ? (
					<div className="grid grid-cols-4 gap-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
						{sortedPokemons.map((pokemon) => (
							<PokemonCard
								key={pokemon.id}
								pokemon={pokemon}
								onView={openDetail}
								onEdit={openEdit}
								onDelete={openDelete}
							/>
						))}
					</div>
				) : null}
			</section>

			<PokemonDetailDrawer
				open={isDetailOpen}
				pokemonId={selectedPokemonId}
				onOpenChange={setIsDetailOpen}
				onEdit={openEdit}
				onDelete={openDelete}
			/>

			<PokemonEditDialog
				open={isEditOpen}
				pokemon={pokemonToEdit}
				isSubmitting={isUpdating}
				onOpenChange={setIsEditOpen}
				onSubmit={handleUpdate}
			/>

			<DeletePokemonDialog
				open={isDeleteOpen}
				pokemon={pokemonToDelete}
				isDeleting={isDeleting}
				onOpenChange={setIsDeleteOpen}
				onConfirm={handleDelete}
			/>
		</main>
	);
}

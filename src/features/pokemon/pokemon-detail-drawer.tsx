import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { pokemonApi } from "@/lib/api";
import type { Pokemon } from "@/types/pokemon";
import { pokemonPlaceholderImage, toFriendlyApiMessage } from "./pokemon-helpers";

type PokemonDetailDrawerProps = {
	open: boolean;
	pokemonId: number | null;
	onOpenChange: (open: boolean) => void;
	onEdit: (pokemon: Pokemon) => void;
	onDelete: (pokemon: Pokemon) => void;
};

export function PokemonDetailDrawer({
	open,
	pokemonId,
	onOpenChange,
	onEdit,
	onDelete,
}: PokemonDetailDrawerProps) {
	const [data, setData] = useState<Pokemon | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchDetail = useCallback(async () => {
		if (!pokemonId) return;
		setIsLoading(true);
		setError("");
		try {
			const response = await pokemonApi.getPokemonById(pokemonId);
			setData(response);
		} catch (requestError) {
			setError(toFriendlyApiMessage(requestError, "Failed to fetch Pokemon detail."));
		} finally {
			setIsLoading(false);
		}
	}, [pokemonId]);

	useEffect(() => {
		if (open && pokemonId) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			void fetchDetail();
		}
	}, [open, pokemonId, fetchDetail]);

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Pokemon Detail</DrawerTitle>
					<DrawerDescription>Complete data fetched from backend.</DrawerDescription>
				</DrawerHeader>

				<div className="mt-6">
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-40 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					) : null}

					{!isLoading && error ? (
						<Card>
							<CardContent className="space-y-3 p-4">
								<p className="text-sm text-destructive">{error}</p>
								<Button variant="outline" onClick={fetchDetail}>
									Retry
								</Button>
							</CardContent>
						</Card>
					) : null}

					{!isLoading && !error && data ? (
						<div className="space-y-4">
							<div className="overflow-hidden rounded-3xl border border-border bg-muted">
								<img
									src={data.image || pokemonPlaceholderImage}
									alt={data.name}
									className="h-64 w-full object-contain max-sm:h-48"
									onError={(event) => {
										event.currentTarget.src = pokemonPlaceholderImage;
									}}
								/>
							</div>
							<div className="flex items-center justify-between">
								<h3 className="text-2xl font-semibold capitalize">{data.name}</h3>
								<Badge variant="outline">#{data.id}</Badge>
							</div>
							<div className="grid grid-cols-2 gap-3 text-sm max-sm:grid-cols-1">
								<p>
									<span className="text-muted-foreground">Height:</span> {data.height}
								</p>
								<p>
									<span className="text-muted-foreground">Weight:</span> {data.weight}
								</p>
								<p>
									<span className="text-muted-foreground">Base Experience:</span>{" "}
									{data.baseExperience}
								</p>
								<p>
									<span className="text-muted-foreground">Created At:</span>{" "}
									{new Date(data.createdAt).toLocaleString()}
								</p>
								<p className="col-span-2 max-sm:col-span-1">
									<span className="text-muted-foreground">Updated At:</span>{" "}
									{new Date(data.updatedAt).toLocaleString()}
								</p>
							</div>
							<DrawerFooter className="mt-0 p-0">
								<Button variant="secondary" onClick={() => onEdit(data)}>
									Edit Pokemon
								</Button>
								<Button variant="destructive" onClick={() => onDelete(data)}>
									Delete Pokemon
								</Button>
								<Button variant="outline" onClick={() => onOpenChange(false)}>
									Close
								</Button>
							</DrawerFooter>
						</div>
					) : null}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

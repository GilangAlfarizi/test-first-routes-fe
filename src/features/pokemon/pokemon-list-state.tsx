import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonGridSkeleton() {
	return (
		<div className="grid grid-cols-4 gap-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
			{Array.from({ length: 8 }).map((_, index) => (
				<Card key={index}>
					<CardContent className="space-y-3 p-6">
						<Skeleton className="h-5 w-1/2" />
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-9 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function PokemonErrorState({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<Card>
			<CardContent className="space-y-3 p-6">
				<p className="font-medium text-destructive">{message}</p>
				<Button variant="outline" onClick={onRetry}>
					Retry
				</Button>
			</CardContent>
		</Card>
	);
}

export function PokemonEmptyState() {
	return (
		<Card>
			<CardContent className="p-6">
				<p className="text-muted-foreground">
					No Pokemon found yet. Sync one using a PokeAPI ID to get started.
				</p>
			</CardContent>
		</Card>
	);
}

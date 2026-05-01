import type { ApiError } from "@/types/pokemon";

export const pokemonPlaceholderImage =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

export const toFriendlyApiMessage = (error: unknown, fallback: string): string => {
	if (!error || typeof error !== "object") return fallback;

	const maybeApiError = error as Partial<ApiError>;
	if (typeof maybeApiError.message === "string" && maybeApiError.message.trim().length > 0) {
		return maybeApiError.message;
	}

	return fallback;
};

export const isValidPokemonId = (value: string): boolean => /^[1-9]\d*$/.test(value);

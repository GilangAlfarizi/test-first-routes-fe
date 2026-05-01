import type {
	ApiError,
	ApiErrorResponse,
	ApiResponse,
	Pokemon,
	PokemonInput,
} from "@/types/pokemon";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const getErrorMessage = (value: unknown, fallback: string): string => {
	if (typeof value === "string" && value.trim().length > 0) {
		return value;
	}
	return fallback;
};

const normalizeApiError = (
	status: number,
	payload: ApiErrorResponse | null,
	fallbackMessage: string,
): ApiError => ({
	status,
	message: getErrorMessage(payload?.message, fallbackMessage),
	errors: Array.isArray(payload?.errors) ? payload.errors : [],
});

const request = async <T>(
	path: string,
	options?: RequestInit,
): Promise<ApiResponse<T>> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options?.headers ?? {}),
		},
		...options,
	});

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		payload = undefined;
	}

	if (!response.ok) {
		throw normalizeApiError(
			response.status,
			(payload as ApiErrorResponse | undefined) ?? null,
			"Request failed",
		);
	}

	return payload as ApiResponse<T>;
};

export const pokemonApi = {
	getPokemons: async (): Promise<Pokemon[]> => {
		const response = await request<Pokemon[]>("/pokemon");
		return response.data;
	},
	getPokemonById: async (id: number): Promise<Pokemon> => {
		const response = await request<Pokemon>(`/pokemon/${id}`);
		return response.data;
	},
	syncPokemonById: async (id: number): Promise<void> => {
		await request<Pokemon>(`/pokemon/sync/${id}`, {
			method: "POST",
		});
	},
	updatePokemon: async (id: number, input: PokemonInput): Promise<void> => {
		await request<Pokemon>(`/pokemon/${id}`, {
			method: "PUT",
			body: JSON.stringify(input),
		});
	},
	deletePokemon: async (id: number): Promise<void> => {
		await request<{ id: number }>(`/pokemon/${id}`, {
			method: "DELETE",
		});
	},
};

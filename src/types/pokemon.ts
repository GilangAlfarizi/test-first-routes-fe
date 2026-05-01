export type Pokemon = {
	id: number;
	name: string;
	height: number;
	weight: number;
	baseExperience: number;
	image: string;
	createdAt: string;
	updatedAt: string;
};

export type PokemonInput = {
	name: string;
	height: number;
	weight: number;
	baseExperience: number;
	image: string;
};

export type ApiResponse<T> = {
	message: string;
	data: T;
};

export type ApiFieldError = {
	field: string;
	message: string;
};

export type ApiErrorResponse = {
	message: string;
	errors?: ApiFieldError[];
};

export type ApiError = {
	status: number;
	message: string;
	errors: ApiFieldError[];
};

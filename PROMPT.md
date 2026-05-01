# Frontend Build Prompt (React + TS + Tailwind + shadcn)

You are building a frontend for a Pokedex app.

## Tech Stack

- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- Keep implementation simple, clean, and readable
- Mobile-first responsive UI

## Goal

Build a simple responsive CRUD interface for Pokemon data using the backend API contract below.

## Important Notes

- The backend base route is `/pokemon` (singular).
- There is no generic `POST /pokemon` create endpoint.
- Create flow must use `POST /pokemon/sync/:id` where `:id` is PokeAPI numeric ID.
- For detail endpoint (`GET /pokemon/:id`), backend may auto-sync from PokeAPI on DB miss.

## Backend Base URL

Use environment variable:

- `VITE_API_BASE_URL=http://localhost:8080`

Build requests using `${VITE_API_BASE_URL}/pokemon...`

## API Contract

### 1) Get all Pokemon

- `GET /pokemon`
- Success response:

```json
{
	"message": "pokemons fetched",
	"data": [
		{
			"id": 25,
			"name": "pikachu",
			"height": 4,
			"weight": 60,
			"baseExperience": 100,
			"image": "https://...",
			"createdAt": "2026-05-01T00:00:00Z",
			"updatedAt": "2026-05-01T00:00:00Z"
		}
	]
}
```

### 2) Get Pokemon detail

- `GET /pokemon/:id`
- `:id` is integer
- Success response:

```json
{
	"message": "pokemon fetched",
	"data": {
		"id": 25,
		"name": "pikachu",
		"height": 4,
		"weight": 60,
		"baseExperience": 100,
		"image": "https://...",
		"createdAt": "2026-05-01T00:00:00Z",
		"updatedAt": "2026-05-01T00:00:00Z"
	}
}
```

### 3) Sync/Create Pokemon from PokeAPI

- `POST /pokemon/sync/:id`
- `:id` is PokeAPI numeric ID
- No request body
- Success status: `201`
- Error examples:
  - `404` pokemon not found in pokeapi
  - `409` pokemon already exists

### 4) Update Pokemon

- `PUT /pokemon/:id`
- Request body:

```json
{
	"name": "pikachu",
	"height": 4,
	"weight": 60,
	"baseExperience": 112,
	"image": "https://..."
}
```

- Success status: `200`

### 5) Delete Pokemon

- `DELETE /pokemon/:id`
- Success response:

```json
{
	"message": "pokemon deleted",
	"data": {
		"id": 25
	}
}
```

### Error response shape (common)

```json
{
	"message": "validation failed",
	"errors": [
		{
			"field": "id",
			"message": "must be a positive integer"
		}
	]
}
```

## Frontend Features to Implement

1. Pokemon list page

- Fetch and display all Pokemon in responsive card/grid layout.
- Show image, name, id, base stats summary.
- Add loading skeleton and empty state.
- Add error state with retry button.

2. Sync/Add Pokemon section

- Input field for numeric Pokemon ID.
- Button: "Sync Pokemon".
- Calls `POST /pokemon/sync/:id`.
- On success:
  - show success toast
  - refresh list
- On 404/409:
  - show friendly error toast/message from API

3. Detail modal or detail panel

- Open detail by clicking card or "View" button.
- Fetch detail with `GET /pokemon/:id`.
- Show all fields: image, name, height, weight, baseExperience, createdAt, updatedAt.

4. Update form

- Open edit modal/drawer from card/detail.
- Prefill fields from selected Pokemon.
- Submit via `PUT /pokemon/:id`.
- Validate simple required fields in UI.
- On success:
  - optimistic UI update or refetch list
  - success toast

5. Delete action

- Add delete button on card/detail.
- Use confirmation dialog (shadcn AlertDialog).
- Call `DELETE /pokemon/:id`.
- On success: remove from UI + toast.

## UI/UX Requirements

- Responsive:
  - mobile: 1 column cards
  - tablet: 2 columns
  - desktop: 3-4 columns
- Use shadcn components where appropriate:
  - Card, Button, Input, Dialog/Drawer, AlertDialog, Badge, Skeleton, Toast
- Clean spacing and readable typography.
- Use fallback image/placeholder when image URL is empty.

## Suggested Project Structure

- `src/types/pokemon.ts` for DTOs/types
- `src/lib/api.ts` for fetch wrapper and typed API methods
- `src/features/pokemon/` for page/components/hooks
- `src/components/ui/` from shadcn

## TypeScript Types (target)

Create types matching backend contract:

- `Pokemon`
- `ApiResponse<T>`
- `ApiErrorResponse`
- `PokemonInput`

## API Utility Rules

- Centralize all API calls in one module.
- Handle non-2xx responses by parsing backend error JSON.
- Return typed data.
- Avoid duplicating fetch logic.

## Acceptance Checklist

- [ ] Can list all Pokemon from backend
- [ ] Can sync Pokemon by numeric ID
- [ ] Can view Pokemon detail
- [ ] Can update Pokemon
- [ ] Can delete Pokemon with confirmation
- [ ] Mobile and desktop responsive
- [ ] Clear loading, empty, and error states
- [ ] Uses shadcn components consistently

## Implementation Output

Please implement the full UI directly in code with:

- typed API client
- reusable components
- minimal but clean state management
- no over-engineering

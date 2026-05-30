import { filterBy, getLimit } from "../utils";
import { endpointAPI } from "./endpoints";

export async function getArtists(genre = [], limit, sorted = true) {
	const response = await fetch(`${endpointAPI}/bands`, {
		method: "GET",
	});

	let data = await response.json();

	if (genre.length) {
		data = filterBy(genre, "genre", data);
	}

	if (sorted) {
		data.sort((a, b) => a.name.localeCompare(b.name));
	}

	if (limit) return getLimit(limit, data);

	return { items: data, total: data.length };
}

export async function getArtistBySlug(slug) {
	const response = await fetch(`${endpointAPI}/bands/${slug}`, {
		method: "GET",
	});

	return await response.json();
}

export async function getStages() {
	const response = await fetch(`${endpointAPI}/schedule`, {
		method: "GET",
	});

	return await response.json();
}

export async function getGenres() {
	const { items } = await getArtists();
	const genres = new Set(items.map((artist) => artist.genre).sort());

	return [...genres];
}

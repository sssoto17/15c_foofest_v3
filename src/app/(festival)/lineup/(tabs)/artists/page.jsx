// COMPONENTS
import Filter from "@/components/lineup/Filter";
import { LoadMore, ScrollToButton } from "@/components/lineup/Buttons";

// FUNCTIONS
import { getArtists, getGenres } from "@/lib/api/lineup";
import GridView, { GridGroup } from "@/components/lineup/GridView";
import ArtistCard from "@/components/lineup/ArtistCard";

export default async function Page({ searchParams }) {
	let { genre = [], limit = 12 } = await searchParams;
	genre = typeof genre == "string" ? [genre] : genre;

	const genres = await getGenres();
	const { items, total } = await getArtists(genre, limit);

	return (
		<section className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start relative">
			<Filter options={genres} active={genre} />
			<GridView>
				{genre.length
					? genre.map((genre, id) => (
							<GridGroup key={id} title={genre}>
								{items.map((artist, id) => (
									<ArtistCard key={id} {...artist} />
								))}
							</GridGroup>
						))
					: items.map((artist, id) => (
							<ArtistCard key={id} {...artist} />
						))}
				{!genre.length && items.length < total && (
					<LoadMore limit={limit} />
				)}
			</GridView>
			<ScrollToButton scrollFromTop="0">Back to top</ScrollToButton>
		</section>
	);
}

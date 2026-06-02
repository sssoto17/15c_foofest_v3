// COMPONENTS
import {
	ArtistDetails,
	ArtistPortrait,
} from "@/components/lineup/ArtistDetails";
import { BackButton } from "@/components/lineup/Buttons";

// FUNCTIONS
import { getArtistBySlug, getArtists } from "@/lib/api/lineup";

export async function generateStaticParams() {
	const { items } = await getArtists();

	return items.map((artist) => ({
		slug: artist.slug,
	}));
}

export default async function Artist({ params }) {
	const { slug } = await params;
	const artist = await getArtistBySlug(slug);

	return (
		<main className="my-8">
			<BackButton />
			<section className="grid md:grid-cols-2 gap-10">
				<ArtistPortrait {...artist} />
				<ArtistDetails {...artist} />
			</section>
		</main>
	);
}

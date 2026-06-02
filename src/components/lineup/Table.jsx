import { getArtists } from "@/lib/api/lineup";
import Link from "next/link";

export default function Table({ cols }) {
	return (
		<section className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[2fr_12fr]">
			{cols.map((col, id) => (
				<Column key={id} {...col} />
			))}
		</section>
	);
}

function Column({ items, title }) {
	return (
		<article className="row-span-full grid grid-rows-subgrid gap-0">
			<ColumnHeader deco={title?.slice(0, 3)}>{title}</ColumnHeader>
			<ul className="grid grid-rows-12">
				{items.map((obj, id) => {
					// console.log(obj);
					return <ColumnCell key={id} {...obj} />;
				})}
			</ul>
		</article>
	);
}

function ColumnHeader({ deco, children }) {
	return (
		<header className="grid grid-cols-[1fr_1fr_1fr_4fr] grid-rows-4 cursor-default">
			{deco && (
				<p className="hidden font-display text-res-5xl md:block uppercase text-forest-900 row-start-1 row-span-4 col-start-1 col-span-3">
					{deco}
				</p>
			)}
			<h2 className="-rotate-45 -translate-9 sm:-translate-12 md:translate-0 md:rotate-0 heading-5 row-start-3 row-span-2 col-start-2 col-span-full">
				{children}
			</h2>
		</header>
	);
}

function ColumnCellWrapper({ children }) {
	return (
		<li className="pr-2 sm:p-2 border-t-2 border-border-global sm:min-w-32">
			{children}
		</li>
	);
}

async function ColumnCell({ start, act, cancelled }) {
	if (start)
		return (
			<ColumnCellWrapper>
				<p>{start}</p>
			</ColumnCellWrapper>
		);

	if (act === "break") return <ColumnCellWrapper />;

	const { items } = await getArtists();
	const { slug } = items.find(({ name }) => name === act);

	return (
		<ColumnCellWrapper>
			<Link
				href={`/lineup/artists/${slug}`}
				className="col-start-1 text-res-sm sm:text-res-base"
			>
				{act}
			</Link>
			{cancelled && (
				<p className="col-start-1 opacity-75 -rotate-8 text-res-xs sm:text-res-sm uppercase border-2 border-gold-600 text-gold-600 max-w-min px-1 sm:px-2 sm:py-0.5">
					Cancelled
				</p>
			)}
		</ColumnCellWrapper>
	);
}

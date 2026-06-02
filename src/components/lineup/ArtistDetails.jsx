import { endpointAPI } from "@/lib/api/endpoints";
import { Program } from "@/lib/schedule";
import Image from "next/image";

export function ArtistDetails({ name, genre, members, bio }) {
	return (
		<article className=" pb-8">
			<header className="grid">
				<h1 className="heading-2 my-6">{name}</h1>
				<ScheduleView artist={name} />
			</header>
			{/*  */}
			<div className="grid grid-cols-2 pb-8">
				<PropertyBox label="Genre">
					<p>{genre}</p>
				</PropertyBox>
				<PropertyBox label="Members">
					<List items={members} />
				</PropertyBox>
			</div>
			<PropertyBox label="About">
				<p>{bio}</p>
			</PropertyBox>
		</article>
	);
}

export function ArtistPortrait({ name, logo, logoCredits }) {
	const img = logo.startsWith("https://")
		? logo
		: `${endpointAPI}/logos/${logo}`;

	return (
		<figure>
			<Image
				src={img}
				alt={`Image of ${name}`}
				width={400}
				height={400}
				className="h-full w-full object-cover"
			/>
			{logoCredits && (
				<figcaption className="mt-2 body-copy-small text-aztec-300">
					<small className="inline-block">{logoCredits}</small>
				</figcaption>
			)}
		</figure>
	);
}

async function ScheduleView({ artist }) {
	const { week, getNextPerformance } = await Program.create();
	const { day, stage, act } = getNextPerformance(week, artist);

	return (
		<h2
			className={`relative heading-tagline px-4 py-2 -order-1 cursor-default ${
				!act.cancelled && "border-2"
			} inline-block`}
		>
			{day} <small className="font-semibold">@ {stage}</small>
			<span className="ml-8">{act.start}</span>
			{act.cancelled && (
				<span>
					<p className="absolute left-16 -bottom-2 col-start-1 -rotate-12 text-res-xs sm:text-res-sm uppercase border-2 border-gold-600 text-gold-600 inline-block px-1 sm:px-2 sm:py-0.5">
						Cancelled
					</p>
				</span>
			)}
		</h2>
	);
}

function PropertyBox({ label, children }) {
	return (
		<section>
			<h3 className="heading-7 text-for">{label}</h3>
			{children}
		</section>
	);
}

function List({ items }) {
	return (
		<ul className="flex flex-wrap gap-x-3">
			{items.map((item, i) => (
				<li key={i}>{item}</li>
			))}
		</ul>
	);
}

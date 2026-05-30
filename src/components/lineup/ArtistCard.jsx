"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { endpointAPI } from "@/lib/api/endpoints";

export default function ArtistCard({ name, slug, logo }) {
	const path = usePathname();
	const img = logo.startsWith("https://")
		? logo
		: `${endpointAPI}/logos/${logo}`;

	return (
		<li className="grid overflow-clip relative group">
			<h2 className="heading-4 px-6 py-2 self-end bg-gradient-to-t from-black col-span-full row-span-full z-10 transition-all ease-in group-hover:pb-4">
				<Link
					href={`${path}/${slug}`}
					className="after:absolute after:inset-0"
				>
					{name}
				</Link>
			</h2>
			<Image
				src={img}
				width="400"
				height="400"
				alt={`Image of ${name}`}
				className="aspect-square grayscale col-span-full row-span-full object-cover group-hover:opacity-60 transition-all ease-in"
			></Image>
		</li>
	);
}

"use client";

// COMPONENTS
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Tabs() {
	const currentPage = useSelectedLayoutSegment();
	const tabs = ["artists", "program", "stages"];

	return (
		<ul className="flex gap-8 justify-center mb-8">
			{tabs.map((tab, id) => (
				<Tab key={id} endpoint={tab} isActive={tab === currentPage} />
			))}
		</ul>
	);
}

function Tab({ endpoint, isActive }) {
	return (
		<li
			className={`uppercase font-semibold ${isActive && "border-b-2 border-forest-700"}`}
		>
			<Link href={`/lineup/${endpoint}`}>{endpoint}</Link>
		</li>
	);
}

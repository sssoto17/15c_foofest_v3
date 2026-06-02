import { LoadMore } from "./Buttons";

export default function GridView({ children, limit, totalLimit, genre }) {
	return (
		<ul className="sm:col-span-2 lg:col-span-3 grid grid-cols-[repeat(auto-fit,minmax(216px,1fr))] gap-4 content-start">
			{children}
		</ul>
	);
}

export function GridGroup({ title, children }) {
	return (
		<li className="col-span-full grid grid-cols-subgrid">
			<h2 className="col-span-full heading-6">{title}</h2>
			<ul className="col-span-full grid grid-cols-subgrid gap-y-4 py-6 ">
				{children}
			</ul>
		</li>
	);
}

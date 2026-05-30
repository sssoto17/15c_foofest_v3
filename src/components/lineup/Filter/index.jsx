// COMPONENTS
import FilterList from "./Options";
import { Disclosure, DisclosureButton } from "@headlessui/react";

// ASSETS
import { MdArrowRight } from "react-icons/md";

export default function Filter(props) {
	return (
		<aside className="@container sm:row-span-full">
			<Disclosure>
				<FilterHeader>Filter By Genre</FilterHeader>
				<FilterList {...props} />
			</Disclosure>
		</aside>
	);
}

function FilterHeader({ children }) {
	return (
		<DisclosureButton className="group cursor-pointer flex items-center border-2 border-border-global p-2 heading-6 text-res-base w-full">
			<MdArrowRight
				size="32"
				className="group-data-open:rotate-90 transition-all duration-200"
			/>
			{children}
		</DisclosureButton>
	);
}

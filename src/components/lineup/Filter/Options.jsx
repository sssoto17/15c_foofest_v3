// COMPONENTS
import Form from "next/form";
import { DisclosurePanel } from "@headlessui/react";
import { FilterButtons, Checkbox } from "./Buttons";

export default function FilterOptions({ options, selected = [] }) {
	return (
		<DisclosurePanel className="@container border-2 border-t-0 border-border-global p-4">
			<Form action="/lineup/artists" className="grid gap-4">
				<ul className="grid gap-1">
					{options.map((option, i) => {
						return (
							<FilterOption
								key={i}
								isActive={selected?.find(
									(str) => str === option,
								)}
							>
								{option}
							</FilterOption>
						);
					})}
				</ul>
				<FilterButtons />
			</Form>
		</DisclosurePanel>
	);
}

function FilterOption({ children, isActive }) {
	return (
		<li>
			<Checkbox active={isActive}>{children}</Checkbox>
		</li>
	);
}

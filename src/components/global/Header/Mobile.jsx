import Link from "next/link";

import {
	Disclosure,
	DisclosurePanel,
	CloseButton,
	DisclosureButton,
} from "@headlessui/react";

export default function Navigation() {
	return (
		<Disclosure>
			<MenuIcon />
			<DisclosurePanel
				transition={true}
				className="md:hidden fixed inset-0 w-screen grid place-content-center data-closed:left-full bg-[#171e1b] drop-shadow-main gap-4 transition-[left] duration-500 ease-in-out text-2xl"
			>
				<CloseButton
					as={Link}
					className="py-2 px-6 uppercase font-semibold cursor-pointer"
					href="/lineup/artists"
				>
					Lineup 2025
				</CloseButton>
				<CloseButton
					as={Link}
					className="border-2 border-forest-600 bg-forest-600 py-2 px-6 uppercase font-bold cursor-pointer"
					href="/session/reservation/flow/checkout"
				>
					Buy Tickets
				</CloseButton>
			</DisclosurePanel>
		</Disclosure>
	);
}

function MenuIcon() {
	const role = {
		top: "group:transition-[transform] group-data-open:rotate-45 group-data-open:translate-y-1.5 group-data-closed:-translate-y-0.5",
		middle: "group:transition-[opacity] my-1 group-data-open:opacity-0 group-data-closed:opacity-100",
		bottom: "group:transition-[transform] group-data-open:-rotate-45 group-data-open:-translate-y-1.5 group-data-closed:translate-y-0.5",
	};

	function setClasses(role) {
		return (
			"bg-forest-100 block duration-300 ease-out h-0.5 w-6 rounded-sm z-100 " +
			role
		);
	}

	return (
		<DisclosureButton
			aria-label="Navigation"
			className="group z-10 cursor-pointer md:hidden"
		>
			<span className={setClasses(role.top)} />
			<span className={setClasses(role.middle)} />
			<span className={setClasses(role.bottom)} />
		</DisclosureButton>
	);
}

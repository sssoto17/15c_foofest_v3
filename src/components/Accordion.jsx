"use client";

import { usePathname, useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";

export default function Accordion({ isOpen, children, ...props }) {
	return (
		<details
			open={isOpen}
			name={props.type}
			className="group border-2 border-border-global px-4 py-6 md:p-6"
		>
			<AccordionHeader {...props} />
			{children}
		</details>
	);
}

function AccordionHeader({ label, type, variant, optional }) {
	const variants = {
		primary: "heading-4",
		secondary: "body-copy font-bold",
	};

	const router = useRouter();
	const path = usePathname();

	function navigate() {
		if (optional) return;

		router.push(`${path}?${type}=${label}`, { scroll: false });
	}

	return (
		<summary
			onClick={() => navigate()}
			className={`cursor-pointer flex items-center justify-between gap-4 ${variants[variant]}`}
		>
			<div
				className={`flex items-center gap-4 grow ${
					variant === "primary" && "justify-between"
				}`}
			>
				<MdAdd
					size="2rem"
					className={`duration-300 ease-in-out group-open:rotate-45 ${
						variant === "primary" && "order-2"
					}`}
				/>
				<span className="grow">{label}</span>
				{optional && (
					<span className="body-copy-small font-bold uppercase opacity-50 justify-self-end px-4">
						Optional
					</span>
				)}
			</div>
		</summary>
	);
}

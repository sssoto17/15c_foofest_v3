"use client";

// COMPONENTS
import {
	Checkbox as HeadlessCheckbox,
	Field,
	Label,
	Button,
} from "@headlessui/react";

// FUNCTIONS
import { redirect } from "next/navigation";
import { useState } from "react";

// ASSETS
import { MdOutlineCheck } from "react-icons/md";

export function FilterButtons() {
	function handleClear() {
		redirect("/lineup/artists");
	}
	return (
		<footer className="flex gap-2 justify-center @sm:gap-6">
			<Button
				type="submit"
				formAction={handleClear}
				className="button button-size-sm button-tertiary--disabled"
			>
				Clear all
			</Button>
			<Button
				type="submit"
				className="button button-size-sm button-tertiary"
			>
				Apply
			</Button>
		</footer>
	);
}

export function Checkbox({ active, children }) {
	const [checked, setChecked] = useState(active || false);
	return (
		<Field className="flex items-center gap-3 max-w-xl group">
			<HeadlessCheckbox
				name="genre"
				value={children}
				checked={checked}
				onChange={setChecked}
				className="input-checkbox"
			>
				<MdOutlineCheck className="opacity-0 group-has-data-checked:opacity-100" />
			</HeadlessCheckbox>
			<Label className="body-copy-small md:text-res-base text-aztec-300 flex justify-between group-data-disabled:opacity-25 group-not-data-disabled:cursor-pointer">
				{children}
			</Label>
		</Field>
	);
}

"use client";

// COMPONENTS
import {
	Dialog,
	DialogTitle,
	DialogPanel,
	Description,
	Button,
} from "@headlessui/react";

// FUNCTIONS
import { useState } from "react";
import { redirect } from "next/navigation";
import { deleteUnpaid } from "@/lib/api/order";

// ASSETS
import { MdArrowLeft } from "react-icons/md";

export function WarningEscape() {
	const [isOpen, setIsOpen] = useState(false);

	const handleExit = () => {
		deleteUnpaid();
		redirect("/");
	};
	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className="cursor-pointer body-copy flex items-center py-2 hover:opacity-80"
			>
				<MdArrowLeft size="32" />
				Back
			</Button>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md backdrop-grayscale-25 backdrop-brightness-50 z-50"
			>
				<Modal setIsOpen={setIsOpen}>
					<Button
						onClick={() => setIsOpen(false)}
						className="button button-size-sm button-tertiary--disabled"
					>
						Cancel
					</Button>
					<Button
						onClick={handleExit}
						className="button button-size-sm button-tertiary--error"
					>
						Exit
					</Button>
				</Modal>
			</Dialog>
		</>
	);
}

function Modal({ children }) {
	return (
		<div className="bg-surface-global p-12 border border-border-global rounded-sm max-w-md">
			<DialogPanel className="grid gap-6">
				<div className="grid gap-2">
					<DialogTitle className="heading-6">
						Leave Booking Session
					</DialogTitle>
					<Description className="text-aztec-300">
						If you exit the booking session you will lose your
						reservation.
					</Description>
				</div>
				<footer className="flex justify-evenly gap-4">
					{children}
				</footer>
			</DialogPanel>
		</div>
	);
}

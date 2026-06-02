// COMPONENTS
import ReservationTimer from "@/components/checkout/ReservationTimer";
import { Button } from "@headlessui/react";

// FUNCTIONS
import { useState } from "react";

// ASSETS
import formSteps from "@/data/formsteps";
import { CgSpinner } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import { PiLockBold } from "react-icons/pi";

export default function BookingWindow({ state, isPending, children }) {
	return (
		<section className="grid md:grid-rows-subgrid md:col-span-2 lg:col-span-3 row-span-full border border-border-form">
			<FormHeader {...state} isPending={isPending} />
			<article
				className={`${
					isPending && "animate-pulse"
				} @container grid gap-y-12 sm:gap-y-14 p-8 sm:p-12 content-start`}
			>
				{children}
			</article>
			<FormFooter {...state} isPending={isPending} />
		</section>
	);
}

function FormHeader({ step, isPending }) {
	return (
		<>
			<header
				className={`@container border-b border-border-form py-8 px-12 ${
					step === 3 ? "hidden @md:block" : "block"
				}`}
			>
				<ol className="@container flex justify-center @md:justify-between items-center gap-8 @md:gap-4 font-semibold">
					{formSteps.map((obj, id) => (
						<FormStepIndicator
							active={step === obj.step}
							{...obj}
							key={id}
							isPending={isPending}
						/>
					))}
				</ol>
			</header>
			{step !== 1 && (
				<div className="block sm:hidden">
					<ReservationTimer />
				</div>
			)}
		</>
	);
}

function FormStepIndicator({ active, step, title, isPending }) {
	return (
		<>
			<li
				key={crypto.randomUUID()}
				className="hidden first-of-type:hidden lg:block max-w-18 grow h-0.5 bg-aztec-800"
			/>
			<li
				{...(active && {
					"data-active": true,
				})}
				className={`group body-copy @md:data-active:grow data-active:grow-0 sm:max-w-max font-semibold flex items-center gap-4 place-content-center sm:justify-between ${
					active ? "text-text-global" : "text-text-global--disabled"
				}`}
			>
				<span className="body-copy-small font-bold grid place-content-center rounded-full h-8 aspect-square text-text-global bg-surface-action--disabled group-data-active:bg-surface-action">
					{active && isPending ? (
						<ImSpinner2 size="18" className="loaderIcon" />
					) : (
						step
					)}
				</span>
				<span
					className={`hidden group-data-active:inline @md:inline ${
						!active && isPending && "animate-pulse"
					}`}
				>
					{title}
				</span>
			</li>
		</>
	);
}

export function FormFooter({ step, isPending }) {
	const [isSubmitting, setIsSubmitting] = useState();
	return (
		<footer
			className={`pb-8 px-12 self-end flex justify-center ${
				step > 1 ? "sm:justify-between" : "sm:justify-end"
			} gap-4 items-end`}
		>
			{step !== 1 && (
				<NavButton
					name="back"
					isPending={isPending}
					isSubmitting={isSubmitting}
					setIsSubmitting={() => setIsSubmitting("back")}
				>
					Back
				</NavButton>
			)}
			{step === 3 ? (
				<NavButton
					name="purchase"
					isPending={isPending}
					isSubmitting={isSubmitting}
					setIsSubmitting={() => setIsSubmitting("purchase")}
					icon
				>
					Purchase
				</NavButton>
			) : (
				<NavButton
					name="next"
					step={step}
					isPending={isPending}
					isSubmitting={isSubmitting}
					setIsSubmitting={() => setIsSubmitting("next")}
				>
					Next
				</NavButton>
			)}
		</footer>
	);
}

function NavButton({
	isPending,
	name,
	children,
	setIsSubmitting,
	isSubmitting,
	icon,
}) {
	return (
		<Button
			name={name}
			type="submit"
			disabled={isPending}
			onClick={(e) => setIsSubmitting(e.target.name)}
			className="group button button-primary button-size-base grid grid-cols-3 gap-2"
		>
			{icon && !isPending ? (
				<PiLockBold
					size="20"
					className={
						isPending && isSubmitting === name
							? "opacity-0"
							: "opacity-100 justify-self-end self-center"
					}
				/>
			) : (
				<CgSpinner
					size="24"
					className={`loaderIcon justify-self-end self-center opacity-0 ${
						isSubmitting === name && "group-disabled:opacity-100"
					}`}
				/>
			)}
			<span className="col-start-2">{children}</span>
		</Button>
	);
}

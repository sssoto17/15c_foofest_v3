"use client";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineArrowBack, MdOutlineArrowUpward } from "react-icons/md";

export const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.back()}
			className="cursor-pointer body-copy uppercase font-bold py-4 transition-all duration-150 text-aztec-400  hover:text-aztec-300 hover:scale-105 flex gap-2 items-center"
		>
			<MdOutlineArrowBack />
			Back
		</Button>
	);
};

// Code used in this component, is from the article below by Michael Ojogbo.
// https://medium.com/@ojogbomichael/same-page-navigation-with-nextjs-bb99cccfda11
// Styling and more adjusted to fit our design

export function ScrollToButton({ scrollFromTop }) {
	const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

	function scrollToTop() {
		if (!isBrowser()) return;
		window.scrollTo({ top: scrollFromTop, behavior: "smooth" });
	}

	const [isVisible, setIsVisible] = useState(false);

	const handleScroll = () => {
		// Show the button when the user scrolls down
		if (window.scrollY > 350) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		// Add scroll event listener when the component mounts
		window.addEventListener("scroll", handleScroll);

		// Remove the event listener when the component unmounts
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<button
			aria-label="Back to Top"
			className={`fixed m-12 bottom-0 right-0 rounded-full bg-forest-600 drop-shadow-2xl body-copy font-bold p-4 z-30 cursor-pointer hover:scale-105 transition-all duration-150 opacity-0 ${isVisible && "opacity-100"}`}
			onClick={scrollToTop}
		>
			<MdOutlineArrowUpward size="24" />
		</button>
	);
}

export function LoadMore({ limit = 12 }) {
	const newLimit = `/lineup/artists?limit=${Number(limit) + 12}`;

	return (
		<footer className="grid place-content-center col-span-full">
			<Link
				href={newLimit}
				scroll={false}
				className="button button-secondary button-size-base font-bold uppercase"
			>
				Load More
			</Link>
		</footer>
	);
}

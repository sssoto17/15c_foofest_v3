// COMPONENTS
import Image from "next/image";
import Navigation from "./Desktop";
import MobileNavigation from "./Mobile";
import { WarningEscape } from "@/components/checkout/Header";

// ASSETS
import logo from "@/assets/svg/logo_bold.svg";

export default function Header() {
	return (
		<HeaderWrapper>
			<Navigation />
			<MobileNavigation />
		</HeaderWrapper>
	);
}

export function BookingFlowHeader() {
	return (
		<HeaderWrapper>
			<WarningEscape />
			<Image src={logo} alt="FooFest" className="h-14 w-fit" />
		</HeaderWrapper>
	);
}

function HeaderWrapper({ children }) {
	return (
		<header className="col-span-full bg-main-background drop-shadow-main z-50">
			<nav className="py-4 flex w-full items-center justify-between">
				{children}
			</nav>
		</header>
	);
}

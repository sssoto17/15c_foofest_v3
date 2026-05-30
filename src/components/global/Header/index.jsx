// COMPONENTS
import Navigation from "./Desktop";
import MobileNavigation from "./Mobile";

// ASSETS

export default function Header() {
	return (
		<header className="col-span-full bg-main-background drop-shadow-main z-50">
			<nav className="py-4 flex w-full items-center justify-between">
				<Navigation />
				<MobileNavigation />
			</nav>
		</header>
	);
}

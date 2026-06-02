import Tabs from "@/components/lineup/Tabs";

export default function TabbedLayout({ children }) {
	return (
		<main className="grid gap-10 content-start">
			<header className="grid gap-6">
				<h1 className="heading-title text-center">Lineup</h1>
				<Tabs />
			</header>
			{children}
		</main>
	);
}

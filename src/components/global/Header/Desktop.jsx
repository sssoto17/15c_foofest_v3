import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/svg/logo_bold.svg";

export default function Navigation() {
	return (
		<>
			<Link href="/">
				<Image src={Logo} alt="FooFest" className="h-16 w-fit" />
			</Link>
			<ul className="md:flex gap-2 hidden">
				<li>
					<Link
						href="/lineup/artists"
						className="py-2 px-6 grid place-content-center uppercase font-semibold"
					>
						Lineup 2025
					</Link>
				</li>
				<li>
					<Link
						href="/session/reservation/flow/checkout"
						className="border-2 border-forest-600 bg-forest-600 py-2 px-6 grid place-content-center uppercase font-bold"
					>
						Buy Tickets
					</Link>
				</li>
			</ul>
		</>
	);
}

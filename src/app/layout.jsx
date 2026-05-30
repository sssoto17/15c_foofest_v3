// CSS
import "@/app/globals.css";

import { Anton } from "next/font/google";

const anton = Anton({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
	variable: "--font-anton",
});

// META
export const metadata = {
	title: "FooFest",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={anton.variable}>
			{children}
		</html>
	);
}

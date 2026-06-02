// COMPONENTS
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

export default function RootLayout({ children }) {
	return (
		<body className="text-forest-100 text-desk-base grid-rows-[auto_1fr_auto]">
			<Header />
			{children}
			<Footer />
		</body>
	);
}

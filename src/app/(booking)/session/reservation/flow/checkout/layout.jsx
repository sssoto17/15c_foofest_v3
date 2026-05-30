// COMPONENTS
import { Suspense } from "react";
import { BookingFlowHeader } from "@/components/global/Header";
import Loading from "./loading";

export default function BookingLayout({ children }) {
	return (
		<body className="text-forest-100 text-desk-base grid-rows-[auto_1fr]">
			<BookingFlowHeader />
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</body>
	);
}

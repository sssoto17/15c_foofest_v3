// FUNCTIONS || NEXT
import dynamic from "next/dynamic";

// COMPONENTS
import Loading from "@/app/(booking)/session/reservation/flow/checkout/loading";
import { getCampingAreas } from "@/lib/api/order";
const BookingFlow = dynamic(() => import("@/components/checkout/FormSteps"), {
	loading: () => <Loading />,
});

export default async function Page() {
	const data = await getCampingAreas();
	return (
		<main className="mb-6">
			<BookingFlow areas={data} />
		</main>
	);
}

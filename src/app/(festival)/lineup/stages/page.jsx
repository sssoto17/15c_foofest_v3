import Accordion from "@/components/Accordion";
import Table from "@/components/lineup/Table";
import { getArtists } from "@/lib/api/lineup";
import { Program } from "@/lib/schedule";

export default async function Stages({ searchParams }) {
	const { stage } = await searchParams;

	const { stages, scheduleByStage } = await Program.create();
	const { items } = await getArtists();

	return (
		<section className="grid gap-4 items-start">
			{stages.map((obj, i) => {
				const cols = scheduleByStage(obj.schedule.slice(-3), items);

				return (
					<Accordion
						key={i}
						variant="primary"
						{...obj}
						isOpen={stage === obj.label}
					>
						<Table cols={cols} />
					</Accordion>
				);
			})}
		</section>
	);
}

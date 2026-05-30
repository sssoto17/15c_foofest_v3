import Accordion from "@/components/Accordion";
import Table from "@/components/lineup/Table";
import ColSchedule from "@/components/lineup/Table";
import { Program, scheduleByDay, stageSchedule, Week } from "@/lib/schedule";

export default async function Schedule({ searchParams }) {
	const { day } = await searchParams;
	const { week, scheduleByDay } = await Program.create();

	return (
		<section className="grid gap-4">
			{week.map((obj, i) => {
				const cols = scheduleByDay(obj.stages);

				return (
					<Accordion
						key={i}
						variant="primary"
						{...obj}
						isOpen={day === obj.day}
						type="day"
					>
						<Table cols={cols} />
					</Accordion>
				);
			})}
		</section>
	);
}

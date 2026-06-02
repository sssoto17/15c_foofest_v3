import { getArtists, getStages } from "@/lib/api/lineup";

const weekdays = {
	mon: "Monday",
	tue: "Tuesday",
	wed: "Wednesday",
	thu: "Thursday",
	fri: "Friday",
	sat: "Saturday",
	sun: "Sunday",
};

export async function stageSchedule() {
	const stages = await getStages();
	const data = Object.entries(stages).map(([name, schedule]) => ({
		name,
		schedule,
	}));
	// console.log(data);
	const test = Object.groupBy(data, ({ schedule }) => schedule.mon);
	console.log(test);

	return data;
}

class Col {
	constructor(obj, data, deco, time) {
		this.title = obj;
		this.data = data;
		this.deco = deco;
		this.time = time;
	}
}

//For stages schedule
export function Days(stage) {
	const hours = new Col("", stage.days.thu, "", true);
	const thu = new Col("Thursday", stage.days.thu, "08", false);
	const fri = new Col("Friday", stage.days.fri, "09", false);
	const sat = new Col("Saturday", stage.days.sat, "10", false);
	const cols = [hours, thu, fri, sat];
	return cols;
}

// For days schedule
function Day(dayKey, dayName, data) {
	const stages = data.map((stage) => {
		return {
			title: stage.name,
			deco: stage.name.slice(0, -4),
			data: stage.days[dayKey],
		};
	});

	const hours = new Col("", data[0].days.thu, "", true);
	const cols = [hours, ...stages];
	const dayObj = { name: dayName, cols };
	return dayObj;
}

export class Program {
	#stages;

	constructor(stages) {
		this.#stages = stages;
	}

	static async create() {
		const stages = await getStages();

		return new Program(stages);
	}

	get stages() {
		return Object.entries(this.#stages).flatMap(([stage, schedule]) => {
			return {
				label: stage,
				type: "stage",
				schedule: Object.entries(schedule).map(([day, acts]) => ({
					day,
					acts,
				})),
			};
		});
	}

	get week() {
		const dayMap = {};

		Object.entries(this.#stages).map(([stageName, days]) => {
			Object.entries(days).map(([dayName, acts]) => {
				if (!dayMap[dayName]) {
					dayMap[dayName] = {
						label: weekdays[dayName],
						type: "day",
						stages: [],
					};
				}

				const stageWithActs = {
					stage: stageName,
					acts,
				};

				dayMap[dayName].stages = [
					...dayMap[dayName].stages,
					stageWithActs,
				];
			});
		});

		return Object.entries(dayMap).map(([id, day]) => day);
	}

	static getTimeTable(timeslots) {
		return {
			items: timeslots.map(({ start, end }) => ({
				start,
				end,
			})),
		};
	}

	static findAct(acts, artist) {
		return acts.find(({ act }) => act == artist);
	}

	scheduleByStage(schedule) {
		const acts = schedule.map(({ day, acts }) => ({
			title: weekdays[day],
			items: acts.map(({ act, cancelled }) => {
				const item = { act };

				if (cancelled) {
					item.cancelled = cancelled;
				}

				return item;
			}),
		}));

		return [Program.getTimeTable(schedule[0].acts), ...acts];
	}

	scheduleByDay(schedule) {
		const acts = schedule.map(({ stage, acts }) => ({
			title: stage,
			items: acts.map(({ act, cancelled }) => {
				const item = { act };
				if (cancelled) {
					item.cancelled = cancelled;
				}
				return item;
			}),
		}));
		return [Program.getTimeTable(schedule[0].acts), ...acts];
	}

	getNextPerformance(schedule, artist) {
		const item = {};

		const { label, stages } = schedule.find(({ stages }) => {
			return stages.find(({ acts }) => Program.findAct(acts, artist));
		});

		const { stage, acts } = stages.find(({ acts }) =>
			Program.findAct(acts, artist),
		);
		const act = Program.findAct(acts, artist);
		item.day = label;
		item.stage = stage;
		item.act = act;

		return item;
	}
}

function Week(data) {
	const mon = new Day("mon", "Monday", data);
	const tue = new Day("tue", "Tuesday", data);
	const wed = new Day("wed", "Wednesday", data);
	const thu = new Day("thu", "Thursday", data);
	const fri = new Day("fri", "Friday", data);
	const sat = new Day("sat", "Saturday", data);
	const sun = new Day("sun", "Sunday", data);

	const week = [mon, tue, wed, thu, fri, sat, sun];
	return week;
}

async function test() {
	// SCHEDULE RECONFIGURATION
	const schedule = await stageSchedule();
	const data = await Program.create();
	const schedules = data.stages.map((stage) => stage.schedule);
	// console.log(schedules);
	// console.log(Object.groupBy(data.stages, ({ type }) => type));
	// console.log(Object.groupBy(data.stages, ({}) => ));

	// const mon = {
	// 	day: "Monday",
	// 	acts: [
	// 		...schedule.Midgard.mon,
	// 		...schedule.Jotunheim.mon,
	// 		...schedule.Vanaheim.mon,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.mon,
	// 		...schedule.Jotunheim.mon,
	// 		...schedule.Vanaheim.mon,
	// 	],
	// };
	// const tue = {
	// 	day: "Tuesday",
	// 	acts: [
	// 		...schedule.Midgard.tue,
	// 		...schedule.Jotunheim.tue,
	// 		...schedule.Vanaheim.tue,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.tue,
	// 		...schedule.Jotunheim.tue,
	// 		...schedule.Vanaheim.tue,
	// 	],
	// };
	// const wed = {
	// 	day: "Wednesday",
	// 	acts: [
	// 		...schedule.Midgard.wed,
	// 		...schedule.Jotunheim.wed,
	// 		...schedule.Vanaheim.wed,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.wed,
	// 		...schedule.Jotunheim.wed,
	// 		...schedule.Vanaheim.wed,
	// 	],
	// };
	// const thu = {
	// 	day: "Thursday",
	// 	acts: [
	// 		...schedule.Midgard.thu,
	// 		...schedule.Jotunheim.thu,
	// 		...schedule.Vanaheim.thu,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.thu,
	// 		...schedule.Jotunheim.thu,
	// 		...schedule.Vanaheim.thu,
	// 	],
	// };
	// const fri = {
	// 	day: "Friday",
	// 	acts: [
	// 		...schedule.Midgard.fri,
	// 		...schedule.Jotunheim.fri,
	// 		...schedule.Vanaheim.fri,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.fri,
	// 		...schedule.Jotunheim.fri,
	// 		...schedule.Vanaheim.fri,
	// 	],
	// };
	// const sat = {
	// 	day: "Saturday",
	// 	acts: [
	// 		...schedule.Midgard.sat,
	// 		...schedule.Jotunheim.sat,
	// 		...schedule.Vanaheim.sat,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.sat,
	// 		...schedule.Jotunheim.sat,
	// 		...schedule.Vanaheim.sat,
	// 	],
	// };
	// const sun = {
	// 	day: "Sunday",
	// 	acts: [
	// 		...schedule.Midgard.sun,
	// 		...schedule.Jotunheim.sun,
	// 		...schedule.Vanaheim.sun,
	// 	],
	// 	acts: [
	// 		...schedule.Midgard.sun,
	// 		...schedule.Jotunheim.sun,
	// 		...schedule.Vanaheim.sun,
	// 	],
	// };

	// const days = [mon, tue, wed, thu, fri, sat, sun];

	// const daySchedule = days.find((day) =>
	// 	day.acts.find((act) => act.act === name),
	// );

	// const dayPlaying = daySchedule.day;
	// const actPlaying = daySchedule.acts.find((act) => act.act === name);
}

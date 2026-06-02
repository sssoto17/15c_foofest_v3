import { useTickets } from "@/store/TicketStore";
import { useTents } from "@/store/TentStore";
import { postGuests } from "@/lib/api/order";

export const fetcher = (url) => fetch(url).then((res) => res.json());

export function keyEnter(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		e.target.blur();
	}
}

export async function Processing(ms) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTotalQuantity(type) {
	const { partoutTickets, vipTickets } = useTickets();
	const { doubleTents, doubleTentSpaces, tripleTents, tripleTentSpaces } =
		useTents();

	const totalTickets = partoutTickets + vipTickets;
	const totalTents = doubleTents + tripleTents;
	const totalTentSpaces = doubleTentSpaces + tripleTentSpaces;
	if (type === "tickets") {
		return totalTickets;
	}
	if (type === "tents") {
		return { totalTents, totalTentSpaces };
	}
}

export function newGuest(names, emails, vip, reservationId, isBuyer) {
	const customerData = {};
	function Guest(name, email, status) {
		this.name = name;
		this.email = email;
		this.vip = status;
		this.reservation_id = reservationId;
	}

	names.map((guest, id) => {
		const email = emails[id];
		const isVip = vip[id];
		const newGuest = new Guest(guest, email, isVip);
		postGuests(newGuest);

		if (isBuyer) {
			customerData.name = newGuest.name;
			customerData.email = newGuest.email;
		}
	});

	return customerData;
}

export function orderTotal(partout, vip, tentDouble, tentTriple, greenFee) {
	const greenPrice = greenFee ? 249 : 0;
	const partoutPrice = partout * 799;
	const vipPrice = vip * 1299;
	const tentPrice = tentDouble * 299 + tentTriple * 399;
	const total = partoutPrice + vipPrice + tentPrice + greenPrice + 99;
	return total;
}

export function filterBy(filter, cat, pool) {
	if (!filter.length) return pool;

	return filter.flatMap((str) => pool.filter((obj) => obj[cat] === str));
}

export function getLimit(limit, pool) {
	return { items: pool.slice(0, Number(limit)), total: pool.length };
}

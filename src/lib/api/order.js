import useSWR from "swr";
import { fetcher } from "../utils";

import {
	endpointAPI,
	endpointOrders,
	endpointGuests,
	endpointKey,
} from "./endpoints";

const headersList = {
	Accept: "application/json",
	"Content-Type": "application/json",
	apikey: endpointKey,
	Prefer: "return=representation",
};

export function getCampingAreas() {
	const { data, error, isLoading } = useSWR(
		`${endpointAPI}/available-spots`,
		fetcher,
	);

	return {
		areas: data,
		isLoading,
		isError: error,
	};
}

export async function putReservation(reservationData) {
	const data = await fetch(`${endpointAPI}/reserve-spot`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(reservationData),
	}).then((res) => res.json());

	return data;
}

export async function postReservation(reservationData) {
	const data = await fetch(`${endpointAPI}/fullfill-reservation`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(reservationData),
	}).then((res) => res.json());

	return data;
}

export async function postOrder(orderData) {
	const data = await fetch(endpointOrders, {
		method: "POST",
		headers: headersList,
		body: JSON.stringify(orderData),
	}).then((res) => res.json());

	return data;
}

export async function patchOrder(orderData) {
	const data = await fetch(
		`${endpointOrders}?reservation_id=eq.${orderData.reservation_id}`,
		{
			method: "PATCH",
			headers: headersList,
			body: JSON.stringify(orderData),
		},
	).then((res) => res.json());

	return data;
}

export async function postGuests(guestData) {
	const data = await fetch(endpointGuests, {
		method: "POST",
		headers: headersList,
		body: JSON.stringify(guestData),
	}).then((res) => res.json());

	return data;
}

export async function deleteUnpaid() {
	const data = await fetch(`${endpointOrders}?paid=eq.false`, {
		method: "DELETE",
		headers: headersList,
	}).then((res) => res.json());

	return data;
}

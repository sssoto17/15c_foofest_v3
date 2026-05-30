"use client";

// FUNCTIONS
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { deleteUnpaid } from "@/lib/api/order";

// RESERVATION COUNTDOWN
export default function ReservationTimer() {
	return (
		<div className="flex justify-between gap-2 items-center bg-surface-action py-2 px-4">
			<small className="body-copy-small leading-tight">
				Time to complete reservation
			</small>
			<CountDown seconds={60 * 5} />
		</div>
	);
}

function CountDown({ seconds }) {
	const [countdown, setCountdown] = useState(seconds);
	const timerID = useRef();

	useEffect(() => {
		timerID.current = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timerID.current);
	}, []);

	useEffect(() => {
		if (countdown <= 1) {
			const cancelReservation = async () => {
				await deleteUnpaid();
			};
			cancelReservation();
			clearInterval(timerID);
			redirect("/session/timeout");
		}
	}, [countdown]);
	// COUNTDOWN FUNCTION CREDIT: https://youtu.be/4_9yJXO4F2Y

	const formattedTimer =
		new Date(countdown * 1000).getUTCMinutes().toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			maximumFractionDigits: 0,
			useGrouping: false,
		}) +
		":" +
		new Date(countdown * 1000).getSeconds().toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			maximumFractionDigits: 0,
			useGrouping: false,
		});
	// TIME FORMAT CREDIT: https://www.geeksforgeeks.org/how-to-convert-seconds-to-time-string-format-hhmmss-using-javascript/

	return <p className="body-copy font-semibold">{formattedTimer}</p>;
}

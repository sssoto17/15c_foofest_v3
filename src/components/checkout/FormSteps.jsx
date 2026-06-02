"use client";

// FUNCTIONS || NEXT
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// FUNCTIONS || REACT
import { useActionState, startTransition, useEffect } from "react";

// COMPONENTS
import Form from "next/form";
import { ProcessingOrder } from "@/app/(booking)/session/reservation/flow/checkout/loading";
import BookingWindow from "./BookingWindow";
import OrderSummary from "@/components/checkout/OrderSummary";

// SERVER ACTION
import {
	completeOrder,
	submitOrder,
} from "@/app/(booking)/session/reservation/flow/checkout/actions";
import { keyEnter } from "@/lib/utils";

// COMPONENTS
import {
	SelectTickets,
	SelectCampingArea,
	GreenFee,
	EnterGuestData,
	SelectTents,
	EnterCustomerData,
	EnterPaymentInfo,
} from "./FormSections";
import { SmallLoading } from "@/app/(booking)/session/reservation/flow/checkout/loading";

export default function BookingFlow(props) {
	// FORM ACTION
	const initState = { step: 1, success: false, errors: {} };
	const [state, submit, isPending] = useActionState(submitOrder, initState);
	const [order, complete, processingOrder] = useActionState(completeOrder, {
		success: false,
	});

	// SUBMIT FORM
	function handleSubmit(e) {
		e.preventDefault();
		const handler = e.nativeEvent.submitter.name;
		const formData = new FormData(e.target);

		if (handler === "back") {
			formData.append("isGoingBack", true);
			startTransition(() => submit(formData));
		}
		if (handler === "next") {
			startTransition(() => submit(formData));
		}
		if (handler === "purchase") {
			startTransition(() => submit(formData));
		}
	}

	// SUBMISSION REDIRECT
	useEffect(() => {
		if (state?.success) {
			startTransition(() => complete());
		}
	}, [state]);

	if (order?.success) {
		redirect("/session/reservation/success");
	}

	if (processingOrder) return <ProcessingOrder />;

	return (
		<Form
			onSubmit={handleSubmit}
			onKeyDown={keyEnter}
			className="grid gap-x-4 grid-rows-[auto_1fr_auto] md:grid-cols-3 lg:grid-cols-4 h-full"
		>
			<BookingWindow state={state} isPending={isPending}>
				{state?.step === 1 && <BookingStepOne {...state} {...props} />}
				{state?.step === 2 && <BookingStepTwo {...state} />}
				{state?.step === 3 && <BookingStepThree {...state} />}
			</BookingWindow>
			<OrderSummary {...state} isPending={isPending} />
		</Form>
	);
}

function BookingStepOne({ areas, orderData, errors, isPending = false }) {
	if (isPending) return <SmallLoading />;

	return (
		<>
			<SelectTickets error={errors} />
			<SelectCampingArea {...orderData} data={areas} />
			<GreenFee {...orderData} />
		</>
	);
}

function BookingStepTwo({ orderData, errors, tickets, isBuyer }) {
	return (
		<>
			<EnterGuestData
				{...orderData}
				{...tickets}
				error={errors?.guests}
				isBuyer={isBuyer}
			/>
			<SelectTents error={errors} />
		</>
	);
}

function BookingStepThree({ errors, isBuyer, orderData }) {
	return (
		<>
			{!isBuyer && <EnterCustomerData {...orderData} error={errors} />}
			<EnterPaymentInfo {...orderData} error={errors?.cardDetails} />
		</>
	);
}

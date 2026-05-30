"use server";
// FUNCTIONS
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
	putReservation,
	postReservation,
	postOrder,
	patchOrder,
	postGuests,
	deleteUnpaid,
} from "@/lib/api/order";
import { Processing } from "@/lib/utils";

// ORDER COMPLETION
export async function completeOrder() {
	await deleteUnpaid();
	await Processing(3000);
	return { success: true };
}

// STATE ACTION
export async function submitOrder(prev, formData) {
	// BOOKING FLOW || STEP ONE
	if (prev.step === 1) {
		const stepOne = await submitStepOne(prev, formData);
		revalidatePath("/");
		return { success: false, ...stepOne };
	}

	// BOOKING FLOW || STEP TWO
	if (prev.step === 2) {
		const stepTwo = await submitStepTwo(prev, formData);
		revalidatePath("/");
		return { success: false, ...stepTwo };
	}

	// BOOKING FLOW || STEP THREE
	if (prev.step === 3) {
		const stepThree = await submitStepThree(prev, formData);
		return { success: true, ...stepThree };
	}
}

// BOOKING FLOW || STEP ONE
export async function submitStepOne(prev, formData) {
	// COLLECT ORDER
	const partoutQuantity = Number(formData.get("partout"));
	const vipQuantity = Number(formData.get("vip"));
	const tickets = {};

	const partoutKey = {
		keyName: "partoutName",
		keyEmail: "partoutEmail",
	};
	const vipKey = {
		keyName: "vipName",
		keyEmail: "vipEmail",
		vip: true,
	};

	const prevPartout = prev?.tickets?.keys?.filter((key) =>
		key.keyName.includes("partout"),
	);
	const prevVip = prev?.tickets?.keys?.filter((key) =>
		key.keyName.includes("vip"),
	);

	if (!prev?.tickets) {
		const partoutTickets = Array(partoutQuantity).fill(partoutKey);
		const vipTickets = Array(vipQuantity).fill(vipKey);
		tickets.keys = [...partoutTickets, ...vipTickets];
	} else if (prev?.tickets?.keys?.length < partoutQuantity + vipQuantity) {
		const addSlotsPartout = partoutQuantity - prevPartout.length;
		const addSlotsVip = vipQuantity - prevVip.length;

		const partoutTickets = [
			...prevPartout,
			...Array(addSlotsPartout).fill(partoutKey),
		];
		const vipTickets = [...prevVip, ...Array(addSlotsVip).fill(vipKey)];
		tickets.keys = [...partoutTickets, ...vipTickets];
		tickets.data = [...prev.tickets.data];
	} else if (prev?.tickets?.keys?.length > partoutQuantity + vipQuantity) {
		const partoutTickets = prevPartout.slice(0, partoutQuantity);
		const vipTickets = prevVip.slice(0, vipQuantity);
		tickets.keys = [...partoutTickets, ...vipTickets];

		const partoutGuests = prev.tickets.data.filter((guest) => !guest.vip);
		const vipGuests = prev.tickets.data.filter((guest) => guest.vip);

		tickets.data = [
			...partoutGuests.slice(0, partoutQuantity),
			...vipGuests.slice(0, vipQuantity),
		];
	} else {
		tickets.keys = [...prev.tickets.keys];
		tickets.data = [...prev.tickets.data];
	}

	// PREPARE RESERVATION
	const reservationData = {};
	const orderData = {};

	reservationData.area = formData.get("area");
	reservationData.amount = partoutQuantity + vipQuantity;

	orderData.camping_area = reservationData.area;
	orderData.green_fee = Boolean(formData.get("greenFee"));

	// FORM VALIDATION
	const errors = {};

	if (!reservationData.amount || reservationData.amount < 1) {
		errors.tooFewTickets = "Please select your tickets.";
	}

	if (partoutQuantity > 10 || vipQuantity > 10) {
		errors.tooManyTickets = "Please limit your selection to 10 tickets.";
	}

	if (errors.tooFewTickets || errors.tooManyTickets) {
		await Processing(1500);
		return { ...prev, success: false, errors, orderData };
	}

	// PUT RESERVATION
	const response = await putReservation(reservationData);

	if (response) {
		orderData.reservation_id = response.id;
		orderData.paid = false;

		await postOrder(orderData);
		await Processing(1000);

		return {
			step: 2,
			errors: {},
			orderData,
			tickets,
		};
	} else {
		return { errors: {} };
	}
}

// BOOKING FLOW || STEP TWO
export async function submitStepTwo(prev, formData) {
	const isGoingBack = Boolean(formData.get("isGoingBack"));

	// LINK GUESTS TO RESERVATION
	const reservationId = prev.orderData.reservation_id;
	// IS BUYER GUEST?
	const customerData = {};
	const isBuyer = Boolean(formData.get("isBuyer"));

	// COLLECT GUEST DATA
	let guests = [];

	const names = [
		...formData.getAll("partoutName"),
		...formData.getAll("vipName"),
	];
	const emails = [
		...formData.getAll("partoutEmail"),
		...formData.getAll("vipEmail"),
	];
	const vip = [
		...Array(formData.getAll("partoutName").length).fill(false),
		...Array(formData.getAll("vipName").length).fill(true),
	];

	names.map((str, id) => {
		const guest = {};

		guest.reservation_id = reservationId;
		guest.name = str;
		guest.email = emails[id];
		guest.vip = vip[id];

		guests = [...guests, guest];

		if (isBuyer) {
			customerData.name = str;
			customerData.email = emails[id];
		}
	});

	const orderData = { ...prev.orderData, ...customerData };

	// COLLECT TENT ADDONS
	const tentSpaces = {};

	tentSpaces.double = formData.get("tentDouble") * 2;
	tentSpaces.triple = formData.get("tentTriple") * 3;
	tentSpaces.total = tentSpaces.double + tentSpaces.triple;

	orderData.optional_tent_setup = {
		tent_double: formData.get("tentDouble"),
		tent_triple: formData.get("tentTriple"),
	};

	// FORM VALIDATION
	const errors = {};

	if (!isGoingBack) {
		guests.map(({ name, email }) => {
			if (!name || name.length < 2) {
				errors.guests = {
					name: "Please provide the name of each guest.",
				};
			}

			if (isBuyer) {
				if (!name || name.length < 2) {
					errors.guests = {
						name: "Please provide your name and email.",
					};
				}
				if (!email || !email.includes("@") || !email.includes(".")) {
					errors.guests = {
						...errors.guests,
						email: "Please provide your name and email.",
					};
				}
			}
		});

		if (guests.length > 1 && tentSpaces.total) {
			if (guests.length < tentSpaces.total) {
				errors.tentSetup = `Please fill up all available tent space. ${
					tentSpaces.total - guests.length
				} spaces left to fill.`;
			}
			if (guests.length > tentSpaces.total) {
				errors.tentSetup = `Please ensure room for all guests. Missing space for ${
					guests.length - tentSpaces.total
				} guests.`;
			}
		}
		if (guests.length === 1 && tentSpaces.total > 2) {
			errors.tentSetup = "You can only add one tent for a single guest.";
		}

		if (errors.guests || errors.tentSetup) {
			await Processing(1500);
			return {
				...prev,
				success: false,
				errors,
				orderData,
				tickets: { ...prev.tickets, data: guests },
				isBuyer,
			};
		}
	}

	// POST TO GUESTS DATABASE
	await postGuests(guests);

	// POST TO RESERVATIONS DATABASE
	await patchOrder(orderData);

	// NAVIGATE
	if (isGoingBack) {
		await Processing(600);
	} else {
		await Processing(1000);
	}

	return {
		...prev,
		step: isGoingBack ? prev.step - 1 : prev.step + 1,
		errors: {},
		orderData,
		tickets: { ...prev.tickets, data: guests },
		isBuyer,
	};
}

// BOOKING FLOW || STEP THREE
export async function submitStepThree(prev, formData) {
	const isGoingBack = Boolean(formData.get("isGoingBack"));
	const orderData = { ...prev.orderData };

	// COLLECT CUSTOMER DATA
	if (!orderData.name || !orderData.email) {
		orderData.name = formData.get("name");
		orderData.email = formData.get("email");
	}

	// COLLECT PAYMENT
	const cardDetails = {};

	cardDetails.cardNumber = Boolean(formData.get("cardNumber"));
	cardDetails.cardExp = Boolean(formData.get("cardExp"));
	cardDetails.cardSec = Boolean(formData.get("cardSec"));
	cardDetails.cardHolder = Boolean(formData.get("cardHolder"));

	// FORM VALIDATION
	const errors = {};

	if (!isGoingBack) {
		if (!orderData.name || orderData.name.length <= 1) {
			errors.name = "Please enter your name.";
		}
		if (
			!orderData.email ||
			!orderData.email.includes("@") ||
			!orderData.email.includes(".")
		) {
			errors.email = "Please enter your email.";
		}

		if (
			!cardDetails.cardNumber ||
			!cardDetails.cardExp ||
			!cardDetails.cardSec ||
			!cardDetails.cardHolder
		) {
			errors.cardDetails = "Please check your card details.";
		} else {
			const priceTotal = formData.get("priceTotal");
			orderData.price_total = Number(priceTotal);
			orderData.paid = true;
		}

		if (errors.name || errors.email || errors.cardDetails) {
			await Processing(1000);
			return {
				...prev,
				success: false,
				errors,
				orderData,
			};
		}
	}

	// POST TO RESERVATIONS
	await patchOrder(orderData);
	await Processing(600);

	if (isGoingBack) {
		return {
			...prev,
			step: isGoingBack ? prev.step - 1 : prev.step,
			success: false,
			errors: {},
			orderData,
		};
	}

	// FULLFIL RESERVATION
	const id = { id: orderData.reservation_id };
	const response = await postReservation(id);
	await Processing(600);
	if (response.status) {
		return { success: false };
	} else {
		return { succes: true };
	}
}

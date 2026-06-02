"use client";

// COMPONENTS
import Image from "next/image";
import Accordion from "../Accordion";
import { Fieldset, Field, Legend, Label, Input } from "@headlessui/react";
import {
	QuantitySelector,
	RadioSelector,
	CheckField,
	ErrorText,
	CustomerField,
} from "./FormFields";

// FUNCTIONS
import { useEffect, useState } from "react";
import { getTotalQuantity } from "@/lib/utils";

// HOOKS
import useAvailableArea from "@/hooks/useAvailableArea";
import useTicketListing from "@/hooks/useTicketListing";
import useTentListing from "@/hooks/useTentListing";

// STORE
import { useTickets } from "@/store/TicketStore";
import { useTentActions, useTents } from "@/store/TentStore";

// ASSETS
import vipStamp from "@/assets/svg/vip.svg";
import DinersClub from "@/assets/svg/payment/dinersclub.svg";
import MasterCard from "@/assets/svg/payment/mastercard.svg";
import Visa from "@/assets/svg/payment/visa.svg";
import { MdOutlineError } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";

// BOOKING || STEP ONE
export function SelectTickets({ error }) {
	const ticketListing = useTicketListing(error);

	return (
		<Fieldset className="grid grid-rows-[auto_1rem_auto] gap-y-4 max-w-xl">
			<Legend className="heading-5">Tickets</Legend>
			<ErrorText>
				{((ticketListing[0].overallTotal < 1 && error?.tooFewTickets) ||
					(ticketListing[0].overallTotal > 10 &&
						error?.tooManyTickets)) &&
					(error?.tooFewTickets || error?.tooManyTickets)}
			</ErrorText>
			{ticketListing.map((ticket, id) => {
				return (
					<QuantitySelector key={id} data={ticket}>
						{ticket.label}
					</QuantitySelector>
				);
			})}
		</Fieldset>
	);
}

export function SelectCampingArea({ camping_area, data }) {
	const [selected, setSelected, areaData] = useAvailableArea(
		data,
		camping_area,
	);

	return (
		<Fieldset className="grid grid-rows-[auto_1rem_auto] gap-y-4 md:gap-y-6">
			<Legend className="heading-5">Camping Spot</Legend>
			<p className="body-copy-small opacity-70">
				Choose a camping area for your stay.
			</p>
			<RadioSelector
				data={areaData}
				selected={selected}
				setSelected={setSelected}
			/>
		</Fieldset>
	);
}

export function GreenFee({ green_fee }) {
	const data = {
		name: "greenFee",
		price: 249,
	};

	return (
		<Fieldset className="@container flex flex-wrap @lg:flex-nowrap items-center gap-2">
			<CheckField data={data} state={green_fee}>
				Green Fee
			</CheckField>
			<Information>
				<span className="w-3xs @xl:w-xs block">
					Support our commitment to sustainability and help reduce the
					festival's environmental impact.
				</span>
			</Information>
			<p className="body-copy-small opacity-60 grow @lg:hidden">
				Support our commitment to sustainability and help reduce the
				festival's environmental impact.
			</p>
		</Fieldset>
	);
}

// BOOKING || STEP TWO
export function EnterGuestData({ keys, isBuyer, data, error }) {
	return (
		<section
			className={`grid ${keys.length > 1 && "md:grid-cols-2"} gap-4 w-full`}
		>
			<header className="col-span-full grid grid-rows-[auto_1rem] gap-2">
				<h2 className="heading-5">Ticket Information</h2>
				<ErrorText>{error?.name || error?.email}</ErrorText>
			</header>
			{keys.map((key, id) => {
				return (
					<GuestCard
						key={id}
						{...key}
						data={data && data[id]}
						number={id + 1}
						single={keys.length === 1}
						error={error}
						state={isBuyer}
					/>
				);
			})}
		</section>
	);
}

function GuestCard({
	keyName,
	keyEmail,
	vip,
	data,
	number,
	single,
	error,
	state,
}) {
	const [isBuyer, setIsBuyer] = useState(state || false);
	const checkboxData = {
		name: "isBuyer",
		state: isBuyer,
		onChange: setIsBuyer,
	};

	return (
		<>
			<Fieldset className="grid gap-y-6 max-w-md grow shrink">
				<Legend className="heading-6 font-semibold capitalize flex gap-4">
					Ticket #{number}
				</Legend>
				<div
					className={`grid gap-y-4 border p-6 md:p-8 pt-4 relative ${
						(error?.name && !data?.name) ||
						(error?.email && !data?.email)
							? "border-border-global--error/35"
							: "border-border-input"
					}`}
				>
					{vip && (
						<Image
							src={vipStamp}
							alt="VIP Ticket"
							className="absolute right-6 -top-6"
						/>
					)}
					<CustomerField
						name={keyName}
						error={
							error?.name && data?.name?.length < 2
								? error?.name
								: null
						}
						defaultValue={data?.name}
					>
						Name
					</CustomerField>
					<CustomerField
						name={keyEmail}
						error={
							isBuyer &&
							error?.email &&
							(!data?.email?.includes("@") ||
								!data?.email?.includes("."))
								? error?.email
								: null
						}
						defaultValue={data?.email}
					>
						Email{" "}
						{!isBuyer && (
							<span className="body-copy-small opacity-75">
								(Optional)
							</span>
						)}
					</CustomerField>
				</div>
				{single && (
					<CheckField data={checkboxData} minor>
						Use for payment information
					</CheckField>
				)}
			</Fieldset>
		</>
	);
}

export function SelectTents({ error }) {
	const tentListing = useTentListing(error);
	const totalTickets = getTotalQuantity("tickets");
	const { doubleTentSpaces, tripleTentSpaces } = useTents();
	const totalTentSpaces = doubleTentSpaces + tripleTentSpaces;
	const { setDouble, setTriple } = useTentActions();
	const { partoutTickets, vipTickets } = useTickets();
	const totalGuests = partoutTickets + vipTickets;

	useEffect(() => {
		setDouble(0);
		setTriple(0);
	}, [totalTickets]);

	return (
		<Accordion label="Tent Setup" variant="secondary" optional>
			<Fieldset className="@container grid grid-rows-[1.rem_auto] gap-y-4 ml-12 pt-4">
				{error?.tentSetup &&
				totalTentSpaces !== 0 &&
				totalTentSpaces !== totalGuests ? (
					<ErrorText>{error?.tentSetup}</ErrorText>
				) : (
					<p className="body-copy-small opacity-70">
						As add-on, FooFest can provide tents for your stay.
						Enough tent space must be provided for all guests.
					</p>
				)}
				{tentListing
					.filter((tent) => tent.display === true)
					.map((tent, id) => {
						return (
							<QuantitySelector key={id} data={tent}>
								{tent.label}
							</QuantitySelector>
						);
					})}
			</Fieldset>
		</Accordion>
	);
}

// BOOKING || STEP THREE
export function EnterCustomerData({ name, email, isBuyer, error }) {
	return (
		<Fieldset className="grid gap-y-4 max-w-sm">
			<Legend className="heading-5">Your Information</Legend>
			<CustomerField
				name="name"
				defaultValue={isBuyer ? name : ""}
				placeholder="e.g. John Doe"
				error={error?.name}
				errorIcon
				errorText
			>
				Name
			</CustomerField>
			<CustomerField
				name="email"
				defaultValue={isBuyer ? email : ""}
				placeholder="johndoe@gmail.com"
				error={error?.email}
				errorIcon
				errorText
			>
				Email
			</CustomerField>
		</Fieldset>
	);
}

function PaymentMethods() {
	// ICON CREDIT: https://www.figma.com/community/file/880472656109554171
	return (
		<div className="flex gap-1">
			<Image src={MasterCard} alt="Mastercard" className="w-10" />
			<Image src={Visa} alt="Visa" className="w-10" />
			<Image
				src={DinersClub}
				alt="Diners Club International"
				className="w-10"
			/>
		</div>
	);
}

export function EnterPaymentInfo({ error }) {
	const errorStyle =
		"not-data-focus:border-border-global--error bg-surface-input--focus";

	return (
		<Fieldset className="grid gap-y-6">
			<Legend className="heading-5 flex justify-between max-w-md">
				Payment Details
			</Legend>
			{error && <ErrorText>{error}</ErrorText>}
			<div className="grid grid-cols-[6fr_1fr] gap-x-2 gap-y-4 max-w-lg">
				<Field className="grid gap-y-2">
					<div className="flex gap-x-2 justify-between items-end">
						<Label className="body-copy-small font-semibold">
							Card Number
						</Label>
						<PaymentMethods />
					</div>
					<Input
						name="cardNumber"
						type="number"
						placeholder="Card number"
						className={`cursor-auto input-field input-field-text--focus body-copy placeholder:text-res-sm ${
							error && errorStyle
						}`}
					/>
				</Field>
				<MdOutlineError
					aria-label="Attention!"
					className={`m-2 self-end text-text-global--error opacity-0 ${
						error && "opacity-100"
					}`}
					size="24"
				/>
				<div className="grid grid-cols-3 gap-x-4">
					<Field className="grid col-span-2 gap-y-2">
						<Label className="body-copy-small font-semibold">
							Expiry Date
						</Label>
						<Input
							name="cardExp"
							placeholder="( MM / YY )"
							className={`cursor-auto input-field input-field-text--focus body-copy placeholder:text-res-sm ${
								error && errorStyle
							}`}
						/>
					</Field>
					<Field className="grid gap-y-2 relative">
						<Label className="body-copy-small font-semibold">
							Security code
						</Label>
						<Input
							name="cardSec"
							placeholder="CVC"
							className={`cursor-auto input-field input-field-text--focus body-copy placeholder:text-res-sm ${
								error && errorStyle
							}`}
						/>
						<InformationTooltip>
							The card security code is a three digit number on
							the back of your card.
						</InformationTooltip>
					</Field>
				</div>
				<MdOutlineError
					aria-label="Attention!"
					className={`m-2 self-end text-text-global--error opacity-0 ${
						error && "opacity-100"
					}`}
					size="24"
				/>
				<Field className="grid gap-y-2">
					<Label className="body-copy-small font-semibold">
						Card Holder
					</Label>
					<Input
						name="cardHolder"
						placeholder="Name on card"
						className={`cursor-auto input-field input-field-text--focus body-copy placeholder:text-res-sm ${
							error && errorStyle
						}`}
					/>
				</Field>
				<MdOutlineError
					aria-label="Attention!"
					className={`m-2 self-end text-text-global--error opacity-0 ${
						error && "opacity-100"
					}`}
					size="24"
				/>
			</div>
		</Fieldset>
	);
}

export function Information({ children }) {
	return (
		<div className="hidden group shrink @lg:flex items-center gap-2">
			<FaRegQuestionCircle
				aria-label="Details"
				className="cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity duration-150 text-xs @sm:text-base"
			/>
			<p className="opacity-0 group-hover:opacity-100 body-copy-small px-2 py-1 bg-aztec-950 text-aztec-300 border border-border-global rounded-xs">
				{children}
			</p>
		</div>
	);
}
export function InformationTooltip({ children }) {
	return (
		<div className="hidden p-1 absolute top-8 right-1 group @xl:flex items-center gap-2">
			<FaRegQuestionCircle
				size="16"
				aria-label="Details"
				className="cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity duration-150"
			/>
			<p className="absolute -top-2 left-10 w-48 @2xl:w-3xs opacity-0 group-hover:opacity-100 body-copy-small px-2 py-1 bg-aztec-950 text-aztec-300 border border-border-global rounded-xs">
				{children}
			</p>
		</div>
	);
}

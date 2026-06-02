"use client";

// COMPONENTS
import ReservationTimer from "./ReservationTimer";
import { SmallLoading } from "@/app/(booking)/session/reservation/flow/checkout/loading";
import { Input } from "@headlessui/react";

// FUNCTIONS
import { orderTotal } from "@/lib/utils";

// STORE
import { useTickets } from "@/store/TicketStore";
import { useTents } from "@/store/TentStore";

export default function OrderSummary({ step, orderData, isPending }) {
  const tickets = useTickets();
  const tents = useTents();

  const priceTotal = orderTotal(
    tickets.partoutTickets,
    tickets.vipTickets,
    tents.doubleTents,
    tents.tripleTents,
    orderData?.green_fee
  );

  const styles = `md:grid border border-border-form self-start grid-rows-subgrid row-span-full ${
    step === 3 ? "grid" : "hidden"
  }`;

  return (
    <section className={styles}>
      <OrderHeader />
      <OrderOverview
        isPending={isPending}
        activeStep={step}
        {...tickets}
        {...orderData}
      >
        <ItemBasket {...tickets} {...tents} />
        <FeesBasket greenFee={orderData?.green_fee} />
      </OrderOverview>
      <OrderTotal total={priceTotal} />
    </section>
  );
}

function OrderHeader() {
  return (
    <header className="cursor-default border-b border-border-form grid place-items-end p-8">
      <h3 className="body-copy font-semibold w-full text-center">
        Order Summary
      </h3>
    </header>
  );
}

function OrderOverview({
  isPending,
  activeStep,
  reservation_id,
  partoutTickets,
  vipTickets,
  children,
}) {
  return (
    <article
      className={`cursor-default grid grid-rows-[auto_1fr] ${
        activeStep !== 1 && "grid-rows-[auto_auto_1fr]"
      } gap-y-2`}
    >
      <div className={activeStep === 3 ? "hidden sm:block" : undefined}>
        {reservation_id && <ReservationTimer />}
      </div>
      {isPending ? (
        <SmallLoading />
      ) : !partoutTickets && !vipTickets ? (
        <small className="body-copy-small p-6 text-center italic opacity-50">
          No tickets selected.
        </small>
      ) : (
        <>{children}</>
      )}
    </article>
  );
}

function OrderTotal({ total }) {
  return (
    <footer className="relative flex justify-between gap-4 p-6 items-center border-t border-border-global font-bold">
      <p className="body-copy font-bold uppercase tracking-wider">Total</p>
      <p className="body-copy font-semibold">{total},-</p>
      <Input
        name="priceTotal"
        value={total}
        readOnly
        className="absolute opacity-0 text-right body-copy font-semibold"
      />
    </footer>
  );
}

function ItemBasket({ partoutTickets, vipTickets, doubleTents, tripleTents }) {
  return (
    <ul className="p-6">
      {partoutTickets > 0 && (
        <Item quantity={partoutTickets} price={799}>
          Partout Ticket
        </Item>
      )}
      {vipTickets > 0 && (
        <Item quantity={vipTickets} price={1299}>
          VIP Ticket
        </Item>
      )}
      {doubleTents > 0 && (
        <Item quantity={doubleTents} price={299}>
          Double Person Tent
        </Item>
      )}
      {tripleTents > 0 && (
        <Item quantity={tripleTents} price={399}>
          Triple Person Tent
        </Item>
      )}
    </ul>
  );
}

function Item({ quantity, price, children }) {
  return (
    <li className="@container flex justify-between items-end gap-2 body-copy text-base">
      <p className="flex gap-2 items-end">
        <span className="body-copy-small">{quantity} x</span>
        {children}
        {quantity > 1 && "s"}
      </p>
      <p>{quantity * price},-</p>
    </li>
  );
}

function FeesBasket({ greenFee }) {
  return (
    <ul className="p-6 place-content-end">
      {greenFee && <FeeItem price={249}>Green Fee</FeeItem>}
      <FeeItem price={99}>Fixed Booking Fee</FeeItem>
    </ul>
  );
}

function FeeItem({ price, children }) {
  return (
    <li className="flex justify-between items-end gap-2">
      <p className="body-copy font-bold flex gap-2 items-end">{children}</p>
      <p className="body-copy font-semibold">{price},-</p>
    </li>
  );
}

import { getTotalQuantity } from "@/lib/utils";
import { useTickets } from "@/store/TicketStore";
import { useTicketActions } from "@/store/TicketStore";

export default function useTicketListing(error) {
  const { partoutTickets, vipTickets } = useTickets();
  const { setPartout, setVip } = useTicketActions();
  const totalTickets = getTotalQuantity("tickets");

  const ticketListing = [
    {
      name: "partout",
      label: "Partout Ticket",
      price: "799",
      disabled: partoutTickets >= 10,
      error: error?.tooFewTickets || error?.tooManyTickets,
      currentTotal: partoutTickets,
      setTotal: setPartout,
      overallTotal: totalTickets,
    },
    {
      name: "vip",
      label: "VIP Ticket",
      price: "1299",
      disabled: vipTickets >= 10,
      error: error?.tooFewTickets || error?.tooManyTickets,
      currentTotal: vipTickets,
      setTotal: setVip,
      overallTotal: totalTickets,
    },
  ];

  return ticketListing;
}

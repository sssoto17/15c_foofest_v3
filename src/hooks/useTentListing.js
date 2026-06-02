import { getTotalQuantity } from "@/lib/utils";
import { useTents } from "@/store/TentStore";
import { useTentActions } from "@/store/TentStore";

export default function useTentListing(error) {
  const { doubleTents, tripleTents } = useTents();
  const { setDouble, setTriple } = useTentActions();
  const totalTickets = getTotalQuantity("tickets");
  const { totalTentSpaces } = getTotalQuantity("tents");

  const tentListing = [
    {
      name: "tentDouble",
      label: "Double Person Tent",
      price: "299",
      error: error?.tentSetup,
      disabled:
        totalTickets === 1
          ? totalTentSpaces === 2
          : (totalTickets - totalTentSpaces) / 2 < 1,
      display: totalTickets !== 3 || totalTickets === 1,
      currentTotal: doubleTents,
      setTotal: setDouble,
      overallTotal: totalTentSpaces,
    },
    {
      name: "tentTriple",
      label: "Triple Person Tent",
      price: "399",
      error: error?.tentSetup,
      disabled: (totalTickets - totalTentSpaces) / 3 < 1,
      display: totalTickets >= 3 || totalTickets / 3 >= 1,
      currentTotal: tripleTents,
      setTotal: setTriple,
      overallTotal: totalTentSpaces,
    },
  ];

  return tentListing;
}

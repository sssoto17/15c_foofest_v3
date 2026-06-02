import { useState, useEffect } from "react";
import { getTotalQuantity } from "@/lib/utils";

export default function useAvailableArea(data, init) {
  // TICKET QUANTITY IN BASKET
  const ticketQuantity = getTotalQuantity("tickets");

  // INITIALIZING STATE
  const initialArea = data.find((obj) => obj.available > 0);
  const [selected, setSelected] = useState(init || initialArea.area);

  // RESET STATE IF TOO FEW AVAILABLE SPOTS
  useEffect(() => {
    const selectedArea = data.find((obj) => obj.area === selected);
    if (selectedArea.available < ticketQuantity) {
      const resetArea = data.find(
        (obj) => obj.available > 0 && obj.available >= ticketQuantity
      );
      setSelected(resetArea.area);
    }
  }, [ticketQuantity]);

  const areaData = data.map((obj) => ({
    label: obj.area,
    details: obj.available + " / " + obj.spots,
    disabled: obj.available === 0 || obj.available < ticketQuantity,
  }));
  return [selected, setSelected, areaData];
}

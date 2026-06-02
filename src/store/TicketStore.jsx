import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

// TICKETS IN BASKET
const useTicketStore = create((set) => ({
  partoutTickets: 0,
  vipTickets: 0,
  actions: {
    setPartout: (quantity) =>
      set(() => ({
        partoutTickets: Number(quantity),
      })),
    setVip: (quantity) =>
      set(() => ({
        vipTickets: Number(quantity),
      })),
  },
}));

export const useTickets = () =>
  useTicketStore(
    useShallow((state) => ({
      partoutTickets: state.partoutTickets,
      vipTickets: state.vipTickets,
    }))
  );
export const useTicketActions = () => useTicketStore((state) => state.actions);

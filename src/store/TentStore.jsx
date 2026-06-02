import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

// TENTS IN BASKET
const useTentStore = create((set) => ({
  doubleTents: 0,
  doubleTentSpaces: 0,
  tripleTents: 0,
  tripleTentSpaces: 0,
  actions: {
    setDouble: (quantity) =>
      set((state) => ({
        doubleTents: Number(quantity),
        doubleTentSpaces: Number(quantity) * 2,
      })),
    setTriple: (quantity) =>
      set((state) => ({
        tripleTents: Number(quantity),
        tripleTentSpaces: Number(quantity) * 3,
      })),
  },
}));

export const useTents = () =>
  useTentStore(
    useShallow((state) => ({
      doubleTents: state.doubleTents,
      doubleTentSpaces: state.doubleTentSpaces,
      tripleTents: state.tripleTents,
      tripleTentSpaces: state.tripleTentSpaces,
    }))
  );
export const useTentActions = () => useTentStore((state) => state.actions);

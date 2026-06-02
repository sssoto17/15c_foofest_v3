"use client";

// COMPONENTS
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// FUNCTIONS
import { useState } from "react";

// ASSETS
import { ImSpinner2 } from "react-icons/im";

export default function Loading() {
  return (
    <section className="cursor-default h-full flex gap-4 self-center items-center place-self-center">
      <ImSpinner2 size="32" className="loaderIcon" />
      <p className="heading-5 animate-pulse">Loading</p>
    </section>
  );
}

export function SmallLoading() {
  return (
    <section className="p-6 flex gap-4 items-center self-start justify-self-center">
      <ImSpinner2 size="20" className="loaderIcon" />
      <p className="body-copy animate-pulse">Loading</p>
    </section>
  );
}

export function ProcessingOrder() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog
      open={true}
      onClose={() => setIsOpen(false)}
      className="z-50 fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md backdrop-grayscale-25 backdrop-brightness-50"
    >
      <DialogPanel>
        <DialogTitle className="flex gap-6 cursor-default">
          <ImSpinner2 size="32" className="loaderIcon" />
          <p className="heading-5">Processing Order...</p>
        </DialogTitle>
      </DialogPanel>
    </Dialog>
  );
}

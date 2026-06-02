"use client";

import Image from "next/image";

import { useSelectedLayoutSegment } from "next/navigation";

import timeout from "@/assets/img/timeout.png";
import success from "@/assets/img/succes.png";

export default function Layout({ children }) {
  const path = useSelectedLayoutSegment();
  const pages = [
    {
      name: "reservation",
      src: success,
      alt: "Image from Foo Fest. Photo by Roberto Rendon on Unsplash",
    },
    {
      name: "timeout",
      src: timeout.src,
      alt: "Image of a forest. Photo by Sebastian Unrau on Unsplash",
    },
  ];

  const currentPage = pages.find(({ name }) => name === path);

  return (
    <main>
      <section className="grid grid-cols-4 h-full sm:grid-cols-10 sm:h-full sm:grid-rows-1">
        <Image
          className="col-start-2 col-span-full row-start-1 sm:col-start-6 sm:row-span-full sm:object-cover sm:h-full"
          src={currentPage.src}
          alt={currentPage.alt}
          width={400}
          height={400}
        />
        <section className="row-start-1 row-span-4 col-start-1 col-span-3 grid grid-rows-subgrid sm:block sm:row-start-1 sm:col-start-1 sm:col-span-7 pt-20">
          {children}
        </section>
      </section>
    </main>
  );
}

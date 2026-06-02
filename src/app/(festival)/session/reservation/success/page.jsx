import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="heading-1 uppercase self-end">
        Yes! You’re ready for FooFest
      </h1>
      <div className="flow-space">
        <p className="body-copy">
          You have succesfully purchased tickets for FooFest 2025. <br /> We’ll
          send you an e-mail with the tickets shortly.{" "}
        </p>
        <p className="body-copy">Meanwhile check out the schedule!</p>
      </div>
      <Link
        href="/lineup/artists"
        className="self-start button button-primary button-size-base mt-8"
      >
        Lineup 2025
      </Link>
    </>
  );
}

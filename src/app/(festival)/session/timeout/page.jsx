import Link from "next/link";

export default function Page() {
  return (
    <article>
      <h1 className="heading-1 uppercase self-end">Time limit exceeded...</h1>
      <div className="flow-space">
        <p className="body-copy row-start-2">
          The time limit makes it fair to all our customers searching for
          tickets.{" "}
        </p>
        <p className="body-copy">You’re welcome to try again!</p>
      </div>
      <Link
        href="/session/reservation/flow/checkout"
        className="self-start button button-primary button-size-base mt-8"
      >
        Try again
      </Link>
    </article>
  );
}

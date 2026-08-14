import Link from "next/link";

export default function ShareNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-wall-deep px-4 text-center text-fg">
      <p className="font-serif text-sm tracking-[0.22em] text-gilt uppercase">
        Missing specimen
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
        This Chill Bug is not on the wall
      </h1>
      <Link
        href="/"
        className="mt-8 inline-flex bg-brass px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-wall-deep uppercase transition hover:bg-gilt"
      >
        Home
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-[100svh] flex-col items-start justify-center gap-6">
      <p className="eyebrow">404</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">This page doesn&apos;t exist.</h1>
      <p className="text-muted">The portfolio lives on a single page now.</p>
      <Link href="/" className="btn btn-primary">
        Go home
      </Link>
    </main>
  );
}

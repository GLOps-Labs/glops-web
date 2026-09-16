import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col items-start gap-4 px-4 py-20">
      <span className="font-display text-6xl font-bold text-accent">404</span>
      <h1 className="font-display text-2xl font-bold">Página no encontrada · Page not found</h1>
      <p className="max-w-md text-muted">
        Esa ruta no existe en este sitio. / This route doesn&apos;t exist on this site.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink"
        >
          Volver al inicio <ArrowIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/servicios"
          className="rounded-full border border-ink px-6 py-3 text-sm font-semibold"
        >
          Ver servicios
        </Link>
      </div>
    </main>
  );
}

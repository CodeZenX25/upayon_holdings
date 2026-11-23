import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold tracking-wider uppercase text-gold">404 Error</p>
        <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
